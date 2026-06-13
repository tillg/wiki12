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
