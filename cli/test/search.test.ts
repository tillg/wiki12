import { test } from "node:test";
import assert from "node:assert/strict";
import { runSearch } from "../src/commands/search.ts";
import { OP_UNIFIED_SEARCH } from "../src/commands/entity.ts";
import { RpcClient } from "../src/rpc.ts";
import { captureCtx, mockRpc } from "./helpers.ts";

function ctxWith(results = {}) {
  const { transport, calls } = mockRpc(results);
  const cap = captureCtx();
  return { ctx: { rpc: new RpcClient(transport), out: cap.out, err: cap.err }, calls, cap };
}

test("search builds UnifiedSearch with just the query", async () => {
  const { ctx, calls } = ctxWith({ [OP_UNIFIED_SEARCH]: [] });
  await runSearch(ctx, ["albert", "einstein"]);
  assert.equal(calls[0].method, OP_UNIFIED_SEARCH);
  assert.deepEqual(calls[0].params, { query: "albert einstein" });
});

test("search passes --kind and --type filters", async () => {
  const { ctx, calls } = ctxWith({ [OP_UNIFIED_SEARCH]: [] });
  await runSearch(ctx, ["x", "--kind", "entity", "--type", "person"]);
  assert.deepEqual(calls[0].params, {
    query: "x",
    kind: "entity",
    type: "person",
  });
});

test("search formats typed hits", async () => {
  const { ctx, cap } = ctxWith({
    [OP_UNIFIED_SEARCH]: [
      {
        kind: "page",
        type: "page",
        id: "1",
        slug: "page:albert_einstein",
        title: "Albert Einstein",
        snippet: "physicist",
      },
    ],
  });
  await runSearch(ctx, ["einstein"]);
  assert.match(
    cap.lines.join("\n"),
    /\[page:page\] page:albert_einstein\s+Albert Einstein\s+physicist/,
  );
});

test("missing query is a usage error (exit 2)", async () => {
  const { ctx } = ctxWith();
  const code = await runSearch(ctx, []);
  assert.equal(code, 2);
});
