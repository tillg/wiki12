// JSON-RPC 2.0 client for the A12 Data Service.
//
// Contract (findings-a12.md §3, architecture §6):
//   POST {WIKI12_DATA_SERVICE_URL}/api/v2/rpc
//   { "jsonrpc": "2.0", "id": N, "method": "<OP>", "params": { ... } }
//
// The transport is injectable so tests can mock it; the default uses fetch.

import type {
  JsonRpcRequest,
  JsonRpcResponse,
  RpcTransport,
} from "./types.ts";

export const DEFAULT_DATA_SERVICE_URL = "http://localhost:8082";

export function dataServiceUrl(env: NodeJS.ProcessEnv = process.env): string {
  return env.WIKI12_DATA_SERVICE_URL ?? DEFAULT_DATA_SERVICE_URL;
}

// Default transport: a single POST per call to /api/v2/rpc using fetch.
export function fetchTransport(baseUrl: string): RpcTransport {
  return async (req: JsonRpcRequest): Promise<JsonRpcResponse> => {
    const res = await fetch(`${baseUrl}/api/v2/rpc`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(req),
    });
    if (!res.ok) {
      throw new Error(
        `Data Service HTTP ${res.status} ${res.statusText} for ${req.method}`,
      );
    }
    return (await res.json()) as JsonRpcResponse;
  };
}

// A thin client that builds JSON-RPC requests with auto-incrementing ids and
// unwraps the result (throwing on JSON-RPC errors).
export class RpcClient {
  private nextId = 1;
  private readonly transport: RpcTransport;

  constructor(transport: RpcTransport) {
    this.transport = transport;
  }

  // Build a request without sending — exposed for testing the request shape.
  buildRequest(method: string, params: Record<string, unknown>): JsonRpcRequest {
    return { jsonrpc: "2.0", id: this.nextId++, method, params };
  }

  async call<T = unknown>(
    method: string,
    params: Record<string, unknown>,
  ): Promise<T> {
    const req = this.buildRequest(method, params);
    const res = await this.transport(req);
    if (res.error) {
      throw new Error(
        `JSON-RPC error ${res.error.code}: ${res.error.message}`,
      );
    }
    return res.result as T;
  }
}
