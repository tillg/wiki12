import { describe, expect, it } from "vitest";
import {
  buildRequest,
  buildBatch,
  matchBatchResponses,
  RpcCallError,
  type RpcResponse,
} from "./rpc";

describe("buildRequest", () => {
  it("builds a JSON-RPC 2.0 envelope with method and params", () => {
    const req = buildRequest("GET_DOCUMENT", { docRef: "Page/abc" }, 7);
    expect(req).toEqual({
      jsonrpc: "2.0",
      id: 7,
      method: "GET_DOCUMENT",
      params: { docRef: "Page/abc" },
    });
  });

  it("omits params when none given", () => {
    const req = buildRequest("PING", undefined, 1);
    expect(req).toEqual({ jsonrpc: "2.0", id: 1, method: "PING" });
    expect("params" in req).toBe(false);
  });

  it("auto-assigns incrementing ids", () => {
    const a = buildRequest("A");
    const b = buildRequest("B");
    expect(b.id).toBe(a.id + 1);
  });
});

describe("buildBatch", () => {
  it("assigns sequential ids from a start id", () => {
    const batch = buildBatch(
      [
        { method: "QUERY", params: { model: "Page" } },
        { method: "QUERY", params: { model: "Person" } },
      ],
      100,
    );
    expect(batch.map((r) => r.id)).toEqual([100, 101]);
    expect(batch[0].params).toEqual({ model: "Page" });
  });
});

describe("matchBatchResponses", () => {
  it("realigns out-of-order responses back to request order", () => {
    const requests = buildBatch([{ method: "QUERY" }, { method: "QUERY" }, { method: "QUERY" }], 1);
    const responses: RpcResponse[] = [
      { jsonrpc: "2.0", id: 3, result: "third" },
      { jsonrpc: "2.0", id: 1, result: "first" },
      { jsonrpc: "2.0", id: 2, result: "second" },
    ];
    expect(matchBatchResponses(requests, responses)).toEqual(["first", "second", "third"]);
  });

  it("returns an RpcCallError in the slot for a per-item error", () => {
    const requests = buildBatch([{ method: "QUERY" }, { method: "BAD" }], 1);
    const responses: RpcResponse[] = [
      { jsonrpc: "2.0", id: 1, result: "ok" },
      { jsonrpc: "2.0", id: 2, error: { code: -32601, message: "Method not found" } },
    ];
    const out = matchBatchResponses(requests, responses);
    expect(out[0]).toBe("ok");
    expect(out[1]).toBeInstanceOf(RpcCallError);
    expect((out[1] as RpcCallError).method).toBe("BAD");
  });

  it("fills a missing response with an RpcCallError", () => {
    const requests = buildBatch([{ method: "QUERY" }, { method: "QUERY" }], 1);
    const responses: RpcResponse[] = [{ jsonrpc: "2.0", id: 1, result: "only" }];
    const out = matchBatchResponses(requests, responses);
    expect(out[0]).toBe("only");
    expect(out[1]).toBeInstanceOf(RpcCallError);
  });
});
