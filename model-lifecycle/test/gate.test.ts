// The upload GATE (ADR-0003): a content-version bump is rejected unless its
// matching Migration is uploaded with it; accepted with it.

import { test } from "node:test";
import assert from "node:assert/strict";
import { GateError, Registry } from "../src/registry.ts";
import { generateDefaultFormModel } from "../src/formgen.ts";
import { personDM, personMigrationV1to2 } from "./helpers.ts";

test("first deploy (v1) is accepted and generates a default form model", () => {
  const reg = new Registry();
  const r = reg.deploy(personDM(1), undefined, generateDefaultFormModel);
  assert.equal(r.type, "Person");
  assert.equal(r.version, 1);
  assert.equal(r.formModelGenerated, true);
  assert.ok(reg.formModel("Person"), "form model should be stored");
});

test("version bump WITHOUT a migration is rejected", () => {
  const reg = new Registry();
  reg.deploy(personDM(1), undefined, generateDefaultFormModel);
  assert.throws(
    () => reg.deploy(personDM(2), undefined, generateDefaultFormModel),
    (e: unknown) => e instanceof GateError && /requires a matching Migration/.test((e as Error).message),
  );
  // The deployed version must not have advanced.
  assert.equal(reg.deployedVersion("Person"), 1);
});

test("version bump WITH a matching migration is accepted", () => {
  const reg = new Registry();
  reg.deploy(personDM(1), undefined, generateDefaultFormModel);
  const r = reg.deploy(personDM(2), personMigrationV1to2(), generateDefaultFormModel);
  assert.equal(r.version, 2);
  assert.equal(reg.deployedVersion("Person"), 2);
  // The migration is now queryable.
  assert.ok(reg.findMigration("Person", 1, 2), "migration should be registered");
});

test("version bump with a MISMATCHED migration is rejected", () => {
  const reg = new Registry();
  reg.deploy(personDM(1), undefined, generateDefaultFormModel);
  const wrong = { ...personMigrationV1to2(), toVersion: 3 };
  assert.throws(
    () => reg.deploy(personDM(2), wrong, generateDefaultFormModel),
    (e: unknown) => e instanceof GateError && /does not match the bump/.test((e as Error).message),
  );
});

test("re-deploying the same version (no bump) needs no migration", () => {
  const reg = new Registry();
  reg.deploy(personDM(1), undefined, generateDefaultFormModel);
  const r = reg.deploy(personDM(1), undefined, generateDefaultFormModel);
  assert.equal(r.version, 1);
  // Existing form model is kept, not regenerated.
  assert.equal(r.formModelGenerated, false);
});
