import { test } from "node:test";
import assert from "node:assert/strict";
import { fetchTransport, RpcClient } from "../src/rpc.ts";
import { mockRpc } from "./helpers.ts";

// Regression: Node's fetch (undici) defaults `Accept-Language: *`, which the A12
// Data Service rejects with "unsupported locale: *". The transport must send a
// concrete locale, plus the UAABearer Authorization when a token is supplied.
test("fetchTransport sends a concrete Accept-Language and UAABearer Authorization", async () => {
  const calls: { url: string; init: { headers: Record<string, string> } }[] = [];
  const orig = globalThis.fetch;
  globalThis.fetch = (async (url: unknown, init: unknown) => {
    calls.push({ url: String(url), init: init as { headers: Record<string, string> } });
    return { ok: true, json: async () => ({ jsonrpc: "2.0", id: 1, result: {} }) } as unknown as Response;
  }) as typeof fetch;
  try {
    const t = fetchTransport("http://ds.test", "tok123");
    await t({ jsonrpc: "2.0", id: 1, method: "QUERY", params: {} });
  } finally {
    globalThis.fetch = orig;
  }
  assert.equal(calls.length, 1);
  const headers = calls[0].init.headers;
  assert.equal(headers["Accept-Language"], "en", "must send a concrete locale, not undici's '*'");
  assert.equal(headers["Authorization"], "UAABearer tok123");
  assert.equal(calls[0].url, "http://ds.test/api/v2/rpc");
});

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
