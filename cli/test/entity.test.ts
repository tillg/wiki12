import { test } from "node:test";
import assert from "node:assert/strict";
import {
  OP_CREATE,
  OP_DELETE,
  OP_QUERY,
  OP_READ,
  OP_UNIFIED_SEARCH,
  OP_UPDATE,
  runEntity,
} from "../src/commands/entity.ts";
import { runPage } from "../src/commands/page.ts";
import { RpcClient } from "../src/rpc.ts";
import { captureCtx, mockRpc } from "./helpers.ts";

function ctxWith(results = {}) {
  const { transport, calls } = mockRpc(results);
  const cap = captureCtx();
  const ctx = { rpc: new RpcClient(transport), out: cap.out, err: cap.err };
  return { ctx, calls, cap };
}

test("create builds ADD_DOCUMENT with model + fields", async () => {
  const { ctx, calls, cap } = ctxWith({
    [OP_CREATE]: { id: "pg_1", slug: "page:hello" },
  });
  const code = await runEntity(ctx, "page", "create", [
    "--field",
    "title=Hello",
    "--field",
    "body=Hi there",
  ]);
  assert.equal(code, 0);
  assert.equal(calls[0].method, OP_CREATE);
  assert.deepEqual(calls[0].params, {
    model: "Page_DM",
    fields: { title: "Hello", body: "Hi there" },
  });
  assert.match(cap.lines.join("\n"), /Created page:hello/);
});

test("read resolves slug then builds GET_DOCUMENT", async () => {
  const { ctx, calls } = ctxWith({
    ResolveBySlug: { docRef: "Page_DM/pg_1" },
    [OP_READ]: { id: "pg_1", slug: "page:hello", type: "page", fields: {} },
  });
  const code = await runEntity(ctx, "page", "read", ["hello"]);
  assert.equal(code, 0);
  assert.equal(calls[0].method, "ResolveBySlug");
  assert.deepEqual(calls[0].params, { ref: "page:hello" });
  assert.equal(calls[1].method, OP_READ);
  assert.deepEqual(calls[1].params, { docRef: "Page_DM/pg_1" });
});

test("read by technical id skips ResolveBySlug", async () => {
  const { ctx, calls } = ctxWith({
    [OP_READ]: { id: "pg_1", slug: "page:hello", type: "page", fields: {} },
  });
  await runEntity(ctx, "page", "read", ["pg_01HXYZ"]);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].method, OP_READ);
  assert.deepEqual(calls[0].params, { docRef: "Page_DM/pg_01HXYZ" });
});

test("update builds UPDATE_DOCUMENT and reports a slug change", async () => {
  const { ctx, calls, cap } = ctxWith({
    ResolveBySlug: { docRef: "Page_DM/pg_1" },
    [OP_UPDATE]: {
      id: "pg_1",
      slug: "page:new_title",
      slugChange: { from: "page:old_title", to: "page:new_title" },
    },
  });
  const code = await runEntity(ctx, "page", "update", [
    "old_title",
    "--field",
    "title=New Title",
  ]);
  assert.equal(code, 0);
  assert.equal(calls[1].method, OP_UPDATE);
  assert.deepEqual(calls[1].params, {
    docRef: "Page_DM/pg_1",
    fields: { title: "New Title" },
  });
  const output = cap.lines.join("\n");
  assert.match(output, /Slug changed: page:old_title -> page:new_title/);
});

test("update without a slug change prints no slug message", async () => {
  const { ctx, cap } = ctxWith({
    [OP_UPDATE]: { id: "pg_1", slug: "page:hello" },
  });
  await runEntity(ctx, "page", "update", ["pg_01HXYZ", "--field", "body=x"]);
  assert.doesNotMatch(cap.lines.join("\n"), /Slug changed/);
});

test("delete resolves then builds DELETE_DOCUMENT", async () => {
  const { ctx, calls } = ctxWith({
    ResolveBySlug: { docRef: "Person_DM/en_2" },
    [OP_DELETE]: {},
  });
  const code = await runEntity(ctx, "person", "delete", ["person:till_gartner"]);
  assert.equal(code, 0);
  assert.equal(calls[1].method, OP_DELETE);
  assert.deepEqual(calls[1].params, { docRef: "Person_DM/en_2" });
});

test("list builds QUERY for the type's model", async () => {
  const { ctx, calls } = ctxWith({
    [OP_QUERY]: [{ slug: "page:a", id: "1" }],
  });
  await runEntity(ctx, "page", "list", []);
  assert.equal(calls[0].method, OP_QUERY);
  assert.deepEqual(calls[0].params, { targetDocumentModel: "Page_DM" });
});

test("entity search builds UnifiedSearch filtered by type", async () => {
  const { ctx, calls } = ctxWith({ [OP_UNIFIED_SEARCH]: [] });
  await runEntity(ctx, "person", "search", ["einstein"]);
  assert.equal(calls[0].method, OP_UNIFIED_SEARCH);
  assert.deepEqual(calls[0].params, { query: "einstein", type: "person" });
});

test("page sugar -> entity --type page (same ADD_DOCUMENT request)", async () => {
  const { ctx, calls } = ctxWith({ [OP_CREATE]: { id: "pg_1", slug: "page:x" } });
  await runPage(ctx, "create", ["--field", "title=X"]);
  assert.equal(calls[0].method, OP_CREATE);
  assert.equal((calls[0].params as { model: string }).model, "Page_DM");
});
