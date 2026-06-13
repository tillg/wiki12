import { test } from "node:test";
import assert from "node:assert/strict";
import { RpcClient } from "../src/rpc.ts";
import { mockRpc } from "./helpers.ts";

test("buildRequest produces jsonrpc 2.0 with auto-incrementing ids", () => {
  const { transport } = mockRpc();
  const rpc = new RpcClient(transport);
  const a = rpc.buildRequest("GET_DOCUMENT", { docRef: "Page_DM/x" });
  const b = rpc.buildRequest("QUERY", { targetDocumentModel: "Page_DM" });
  assert.equal(a.jsonrpc, "2.0");
  assert.equal(a.id, 1);
  assert.equal(a.method, "GET_DOCUMENT");
  assert.deepEqual(a.params, { docRef: "Page_DM/x" });
  assert.equal(b.id, 2);
});

test("call unwraps result", async () => {
  const { transport } = mockRpc({ GET_DOCUMENT: { slug: "page:x" } });
  const rpc = new RpcClient(transport);
  const r = await rpc.call<{ slug: string }>("GET_DOCUMENT", { docRef: "Page_DM/x" });
  assert.equal(r.slug, "page:x");
});

test("call throws on JSON-RPC error", async () => {
  const transport = async () => ({
    jsonrpc: "2.0" as const,
    id: 1,
    error: { code: -32601, message: "Method not found" },
  });
  const rpc = new RpcClient(transport);
  await assert.rejects(() => rpc.call("NOPE", {}), /-32601.*Method not found/);
});
