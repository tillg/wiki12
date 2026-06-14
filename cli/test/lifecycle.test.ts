import { test } from "node:test";
import assert from "node:assert/strict";
import { runModel } from "../src/commands/model.ts";
import { runForm } from "../src/commands/form.ts";
import { runMigrate } from "../src/commands/migrate.ts";
import { LifecycleClient } from "../src/lifecycle.ts";
import { captureCtx, mockHttp } from "./helpers.ts";

function ctxWith(bodies = {}) {
  const { transport, calls } = mockHttp(bodies);
  const cap = captureCtx();
  return {
    ctx: { lifecycle: new LifecycleClient(transport), out: cap.out, err: cap.err },
    calls,
    cap,
  };
}

test("model list -> GET /models", async () => {
  const { ctx, calls } = ctxWith({ "GET /models": [] });
  await runModel(ctx, "list", []);
  assert.equal(calls[0].method, "GET");
  assert.equal(calls[0].path, "/models");
});

test("model read -> GET /models/:type", async () => {
  const { ctx, calls } = ctxWith({ "GET /models/person": {} });
  await runModel(ctx, "read", ["person"]);
  assert.equal(calls[0].path, "/models/person");
});

test("migrate -> POST /migrate with dryRun and prints slug manifest", async () => {
  const { ctx, calls, cap } = ctxWith({
    "POST /migrate": {
      migrated: 3,
      failed: 0,
      dryRun: true,
      slugManifest: [{ id: "en_1", from: "person:a", to: "person:b" }],
    },
  });
  const code = await runMigrate(ctx, ["person", "--from", "1", "--to", "2", "--dry-run"]);
  assert.equal(code, 0);
  assert.equal(calls[0].method, "POST");
  assert.equal(calls[0].path, "/migrate");
  assert.deepEqual(calls[0].body, {
    type: "person",
    from: "1",
    to: "2",
    dryRun: true,
  });
  const output = cap.lines.join("\n");
  assert.match(output, /\[dry-run\] migrate person 1 -> 2: 3 migrated, 0 failed/);
  assert.match(output, /person:a -> person:b/);
});

test("migrate requires --from and --to (exit 2)", async () => {
  const { ctx } = ctxWith();
  const code = await runMigrate(ctx, ["person", "--from", "1"]);
  assert.equal(code, 2);
});

test("form read -> GET /form-model/:type", async () => {
  const { ctx, calls } = ctxWith({ "GET /form-model/page": {} });
  await runForm(ctx, "read", ["page"]);
  assert.equal(calls[0].path, "/form-model/page");
});

test("form update -> PUT /form-model/:type", async () => {
  const { ctx, calls } = ctxWith({ "PUT /form-model/page": {} });
  await runForm(ctx, "update", ["page"]);
  assert.equal(calls[0].method, "PUT");
  assert.equal(calls[0].path, "/form-model/page");
});

test("model list -> GET /models", async () => {
  const { ctx, calls } = ctxWith({ "GET /models": [] });
  await runModel(ctx, "list", []);
  assert.equal(calls[0].method, "GET");
  assert.equal(calls[0].path, "/models");
});

test("model create -> POST /models { type } (no --file sends no model)", async () => {
  const { ctx, calls, cap } = ctxWith({ "POST /models": {} });
  const code = await runModel(ctx, "create", ["person"]);
  assert.equal(code, 0);
  assert.equal(calls[0].method, "POST");
  assert.equal(calls[0].path, "/models");
  assert.deepEqual(calls[0].body, { type: "person", model: undefined });
  assert.match(cap.lines.join("\n"), /Uploaded data model "person"/);
});

test("model update with --to-version carries the gated version bump", async () => {
  const { ctx, calls } = ctxWith({ "POST /models": {} });
  await runModel(ctx, "update", ["person", "--to-version", "2"]);
  assert.equal(calls[0].path, "/models");
  assert.deepEqual(calls[0].body, { type: "person", model: undefined, toVersion: "2" });
});

test("model/form without a <type> is a usage error (exit 2)", async () => {
  const m = ctxWith();
  assert.equal(await runModel(m.ctx, "read", []), 2);
  assert.match(m.cap.errors.join("\n"), /<type> is required/);
  const f = ctxWith();
  assert.equal(await runForm(f.ctx, "read", []), 2);
});

test("model unknown subcommand errors (exit 2)", async () => {
  const { ctx, cap } = ctxWith();
  assert.equal(await runModel(ctx, "frobnicate", []), 2);
  assert.match(cap.errors.join("\n"), /unknown subcommand "frobnicate"/);
});

test("form create -> PUT /form-model/:type", async () => {
  const { ctx, calls, cap } = ctxWith({ "PUT /form-model/person": {} });
  const code = await runForm(ctx, "create", ["person"]);
  assert.equal(code, 0);
  assert.equal(calls[0].method, "PUT");
  assert.equal(calls[0].path, "/form-model/person");
  assert.match(cap.lines.join("\n"), /Saved form model for "person"/);
});

test("form list -> GET /form-model", async () => {
  const { ctx, calls } = ctxWith({ "GET /form-model": [] });
  await runForm(ctx, "list", []);
  assert.equal(calls[0].path, "/form-model");
});

test("migrate (real run) reports counts without a dry-run prefix", async () => {
  const { ctx, calls, cap } = ctxWith({
    "POST /migrate": { migrated: 2, failed: 0 },
  });
  const code = await runMigrate(ctx, ["person", "--from", "1", "--to", "2"]);
  assert.equal(code, 0);
  assert.deepEqual(calls[0].body, { type: "person", from: "1", to: "2", dryRun: false });
  const out = cap.lines.join("\n");
  assert.match(out, /^migrate person 1 -> 2: 2 migrated, 0 failed/);
  assert.doesNotMatch(out, /dry-run/);
  assert.doesNotMatch(out, /Slug changes/);
});

test("migrate with failures exits 1", async () => {
  const { ctx, cap } = ctxWith({
    "POST /migrate": { migrated: 1, failed: 2 },
  });
  const code = await runMigrate(ctx, ["person", "--from", "1", "--to", "2"]);
  assert.equal(code, 1);
  assert.match(cap.lines.join("\n"), /1 migrated, 2 failed/);
});

test("migrate tolerates a report with no counts (defaults to 0/0, exit 0)", async () => {
  const { ctx, cap } = ctxWith({ "POST /migrate": {} });
  const code = await runMigrate(ctx, ["person", "--from", "1", "--to", "2"]);
  assert.equal(code, 0);
  assert.match(cap.lines.join("\n"), /0 migrated, 0 failed/);
});
