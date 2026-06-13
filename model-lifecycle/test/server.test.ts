// HTTP routes end-to-end: boot the app on an ephemeral port with an injected
// fake Data Service, drive it with fetch. Covers /health, the deploy gate over
// HTTP, form-model get, migration list/get/put, and /migrate dry-run vs real.

import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { createApp } from "../src/app.ts";
import { DataService } from "../src/dataservice.ts";
import { Registry } from "../src/registry.ts";
import { makeFakeTransport } from "./fake-dataservice.ts";
import { personDM, personDoc, personMigrationV1to2 } from "./helpers.ts";

let server: http.Server;
let base: string;
let store: ReturnType<typeof makeFakeTransport>["store"];
const registry = new Registry();

before(async () => {
  const docs = [personDoc({ id: "a", first: "Albert", last: "Einstein", slug: "person:albert_einstein" })];
  const fake = makeFakeTransport(docs);
  store = fake.store;
  const app = createApp({ registry, dataService: new DataService(fake.transport), version: "9.9.9" });
  server = http.createServer((req, res) => void app(req, res));
  await new Promise<void>((r) => server.listen(0, r));
  const addr = server.address();
  base = `http://127.0.0.1:${(addr as { port: number }).port}`;
});

after(() => server.close());

async function req(method: string, path: string, body?: unknown) {
  const res = await fetch(`${base}${path}`, {
    method,
    headers: body ? { "content-type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  return { status: res.status, json };
}

test("GET /health", async () => {
  const { status, json } = await req("GET", "/health");
  assert.equal(status, 200);
  assert.deepEqual(json, { status: "ok", version: "9.9.9" });
});

test("POST /models deploys v1 and generates a form model; GET /form-model/:type returns it", async () => {
  const deploy = await req("POST", "/models", { documentModel: personDM(1) });
  assert.equal(deploy.status, 200);
  assert.equal(deploy.json.formModelGenerated, true);

  const fm = await req("GET", "/form-model/Person");
  assert.equal(fm.status, 200);
  assert.equal(fm.json.header.modelType, "form");
});

test("POST /models version bump without migration is rejected (409)", async () => {
  const res = await req("POST", "/models", { documentModel: personDM(2) });
  assert.equal(res.status, 409);
  assert.match(res.json.error, /requires a matching Migration/);
});

test("POST /models version bump with migration is accepted; migration is listable", async () => {
  const res = await req("POST", "/models", {
    documentModel: personDM(2),
    migration: personMigrationV1to2(),
  });
  assert.equal(res.status, 200);
  assert.equal(res.json.version, 2);

  const list = await req("GET", "/migrations");
  assert.equal(list.status, 200);
  assert.equal(list.json.length, 1);
  assert.equal(list.json[0].id, "Person:1-2");

  const one = await req("GET", "/migrations/Person:1-2");
  assert.equal(one.status, 200);
  assert.equal(one.json.targetModel, "Person");
});

test("PUT /migrations/:id updates the TS script", async () => {
  const updated = await req("PUT", "/migrations/Person:1-2", { script: "export const migrate = (d) => d;" });
  assert.equal(updated.status, 200);
  assert.match(updated.json.script, /=> d/);
});

test("POST /migrate dry-run reports without writing", async () => {
  // Restore a real migration script (previous test replaced it with a no-op).
  await req("PUT", "/migrations/Person:1-2", { script: personMigrationV1to2().script });
  const before = store.writes.length;
  const res = await req("POST", "/migrate", { type: "Person", from: 1, to: 2, dryRun: true });
  assert.equal(res.status, 200);
  assert.equal(res.json.count, 1);
  assert.equal(store.writes.length, before, "dry-run must not write");
});

test("POST /migrate real run writes upgraded docs", async () => {
  const res = await req("POST", "/migrate", { type: "Person", from: 1, to: 2 });
  assert.equal(res.status, 200);
  assert.equal(res.json.migrated, 1);
  assert.ok(store.writes.length >= 1);
  const last = store.writes[store.writes.length - 1];
  assert.equal(last.__meta?.modelVersion, 2);
});

test("unknown route 404s", async () => {
  const res = await req("GET", "/nope");
  assert.equal(res.status, 404);
});
