// Typed JSON-RPC 2.0 client for the A12 Data Service.
//
// Contract (architecture.md "Two clients, one contract", findings-a12.md §3):
//   POST /api/v2/rpc   (same-origin; nginx proxies to the Data Service)
//   { "jsonrpc": "2.0", "id": N, "method": "<OP>", "params": {...} }
//
// Batching: the Data Service accepts an array of requests in one HTTP round-trip
// and one transaction — used for the unified-search fan-out (one QUERY per model).

import { authHeaders } from "../lib/runtimeConfig.ts";

export const RPC_ENDPOINT = "/api/v2/rpc";

export interface RpcRequest<P = unknown> {
  jsonrpc: "2.0";
  id: number;
  method: string;
  params?: P;
}

export interface RpcError {
  code: number;
  message: string;
  data?: unknown;
}

export interface RpcResponse<R = unknown> {
  jsonrpc: "2.0";
  id: number;
  result?: R;
  error?: RpcError;
}

let nextId = 1;
function allocId(): number {
  return nextId++;
}

/** Build a single JSON-RPC request envelope. Pure — unit tested. */
export function buildRequest<P>(method: string, params?: P, id: number = allocId()): RpcRequest<P> {
  const req: RpcRequest<P> = { jsonrpc: "2.0", id, method };
  if (params !== undefined) req.params = params;
  return req;
}

/** A method+params pair for a batch call, before ids are assigned. */
export interface BatchItem<P = unknown> {
  method: string;
  params?: P;
}

/** Build a batch (array) of JSON-RPC requests with sequential ids. Pure. */
export function buildBatch(items: BatchItem[], startId: number = allocId()): RpcRequest[] {
  return items.map((it, i) => buildRequest(it.method, it.params, startId + i));
}

export class RpcCallError extends Error {
  constructor(
    public readonly rpcError: RpcError,
    public readonly method: string,
  ) {
    super(`JSON-RPC ${method} failed [${rpcError.code}]: ${rpcError.message}`);
    this.name = "RpcCallError";
  }
}

async function postRpc(body: RpcRequest | RpcRequest[]): Promise<unknown> {
  const res = await fetch(RPC_ENDPOINT, {
    method: "POST",
    // Accept-Language: en — A12 derives the query locale from this header and
    // rejects the browser default (e.g. "en-GB,en-US;q=0.9") as unsupported (QA B12).
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Accept-Language": "en",
      ...authHeaders(),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`RPC transport error: HTTP ${res.status} ${res.statusText}`);
  }
  return res.json();
}

/** Single typed call. Throws RpcCallError on a JSON-RPC error result. */
export async function rpc<R, P = unknown>(method: string, params?: P): Promise<R> {
  const req = buildRequest(method, params);
  const resp = (await postRpc(req)) as RpcResponse<R>;
  if (resp.error) throw new RpcCallError(resp.error, method);
  return resp.result as R;
}

/**
 * Batch call. Returns results in the SAME ORDER as `items` (the Data Service may
 * reorder the response array, so we match on id). A per-item error becomes an
 * RpcCallError in that slot rather than aborting the whole batch.
 */
export async function rpcBatch(items: BatchItem[]): Promise<Array<unknown | RpcCallError>> {
  if (items.length === 0) return [];
  const requests = buildBatch(items);
  const responses = (await postRpc(requests)) as RpcResponse[];
  return matchBatchResponses(requests, responses);
}

/**
 * Align a batch response array back to request order by id. Pure — unit tested.
 * Missing responses surface as an RpcCallError so callers never get undefined.
 */
export function matchBatchResponses(
  requests: RpcRequest[],
  responses: RpcResponse[],
): Array<unknown | RpcCallError> {
  const byId = new Map<number, RpcResponse>();
  for (const r of responses) byId.set(r.id, r);
  return requests.map((req) => {
    const resp = byId.get(req.id);
    if (!resp) {
      return new RpcCallError({ code: -32603, message: "No response for request id" }, req.method);
    }
    if (resp.error) return new RpcCallError(resp.error, req.method);
    return resp.result;
  });
}
