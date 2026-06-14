// Transpile + sandbox transform, and dry-run (no writes) vs real run (writes)
// against a fake in-memory Data Service.

import { test } from "node:test";
import assert from "node:assert/strict";
import { DataService } from "../src/dataservice.ts";
import { runMigration, transpile } from "../src/migrate/runner.ts";
import { getSandbox } from "../src/migrate/sandbox.ts";
import { makeFakeTransport } from "./fake-dataservice.ts";
import { envelopeMigrationV1to2, personDM, personDoc, personMigrationV1to2 } from "./helpers.ts";

test("envelope migration backfills CreatedOn + Changes (type-agnostic, no globals)", async () => {
  const sandbox = await getSandbox();
  const compiled = transpile(envelopeMigrationV1to2().script);
  const doc = personDoc({ id: "z", first: "Ada", last: "Lovelace" });
  const res = await sandbox.run(compiled, doc);
  assert.equal(res.ok, true, res.error);
  const person = (res.value as typeof doc).Person as Record<string, unknown>;
  assert.equal(person.CreatedOn, "2026-06-14T00:00:00Z", "CreatedOn backfilled");
  assert.deepEqual(person.Changes, [{ ChangedOn: "2026-06-14T00:00:00Z", Summary: "migrated to v2" }]);
  // Existing fields preserved; Title left for the listener to derive (not set here).
  assert.equal(person.FirstName, "Ada");
  assert.equal(person.Title, undefined);
});

test("transpile + sandbox applies the per-document transform", async () => {
  const sandbox = await getSandbox();
  const compiled = transpile(personMigrationV1to2().script);
  const doc = personDoc({ id: "a", first: "Albert", last: "Einstein" });
  const res = await sandbox.run(compiled, doc);
  assert.equal(res.ok, true, res.error);
  const out = res.value as typeof doc;
  assert.equal((out.Person as Record<string, unknown>).FullName, "Albert Einstein");
  // Original fields preserved.
  assert.equal((out.Person as Record<string, unknown>).FirstName, "Albert");
});

test("transpile rejects a script with no exported function", async () => {
  const sandbox = await getSandbox();
  const compiled = transpile(`export const notAFunction = 42;`);
  const res = await sandbox.run(compiled, {});
  assert.equal(res.ok, false);
  assert.match(res.error ?? "", /must default-export or export 'migrate'/);
});

test("dry-run reports the slug manifest WITHOUT writing", async () => {
  // Two docs whose FullName-add does not change the slug, plus one whose stored
  // slug differs from the derived one (simulating a key-field rename) to exercise
  // the manifest. Here we feed a doc whose stored Slug is stale.
  const stale = personDoc({ id: "b", first: "Marie", last: "Curie", slug: "person:old_name" });
  const { transport, store } = makeFakeTransport([stale]);
  const ds = new DataService(transport);

  const { report } = await runMigration({
    migration: personMigrationV1to2(),
    documentModel: personDM(2),
    dataService: ds,
    dryRun: true,
  });

  assert.equal(report.count, 1);
  assert.equal(report.migrated, 1); // "would migrate"
  assert.equal(report.failures.length, 0);
  assert.equal(report.slugManifest.length, 1, "stale slug should appear in manifest");
  assert.equal(report.slugManifest[0].oldSlug, "person:old_name");
  assert.equal(report.slugManifest[0].newSlug, "person:marie_curie");
  // No writes happened.
  assert.equal(store.writes.length, 0);
});

test("real run writes upgraded docs back at the new version", async () => {
  const docs = [
    personDoc({ id: "c", first: "Albert", last: "Einstein", slug: "person:albert_einstein" }),
    personDoc({ id: "d", first: "Marie", last: "Curie", slug: "person:marie_curie" }),
  ];
  const { transport, store } = makeFakeTransport(docs);
  const ds = new DataService(transport);

  const { report } = await runMigration({
    migration: personMigrationV1to2(),
    documentModel: personDM(2),
    dataService: ds,
    dryRun: false,
  });

  assert.equal(report.count, 2);
  assert.equal(report.migrated, 2);
  assert.equal(report.failures.length, 0);
  // Stable slugs => empty manifest.
  assert.equal(report.slugManifest.length, 0);
  // Both written, both stamped to v2 and carrying FullName.
  assert.equal(store.writes.length, 2);
  for (const w of store.writes) {
    assert.equal(w.__meta?.modelVersion, 2);
    assert.ok((w.Person as Record<string, unknown>).FullName);
  }
});

test("version filter: only instances at `from` are fetched", async () => {
  const v1 = personDoc({ id: "e", first: "Ada", last: "Lovelace" });
  const v2 = personDoc({ id: "f", first: "Grace", last: "Hopper" });
  v2.__meta!.modelVersion = 2; // already migrated
  const { transport, store } = makeFakeTransport([v1, v2]);
  const ds = new DataService(transport);

  const { report } = await runMigration({
    migration: personMigrationV1to2(),
    documentModel: personDM(2),
    dataService: ds,
    dryRun: false,
  });
  assert.equal(report.count, 1, "only the v1 doc should be fetched");
  assert.equal(store.writes.length, 1);
  assert.equal(store.writes[0].__meta?.docRef, "Person_DM/e");
});
