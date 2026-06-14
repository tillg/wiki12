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

/** The UAA bearer token to authenticate Data Service calls, from the environment. */
export function dataServiceToken(env: NodeJS.ProcessEnv = process.env): string | undefined {
  return env.WIKI12_TOKEN || undefined;
}

// Default transport: a single POST per call to /api/v2/rpc using fetch. When a
// token is supplied (WIKI12_TOKEN), it is sent as `Authorization: UAABearer <token>`
// — the same scheme the web client uses (lib/auth) for the auth-enforcing Data Service.
//
// A concrete `Accept-Language` is REQUIRED: Node's fetch (undici) otherwise defaults
// it to `*`, which the Data Service rejects with "unsupported locale: *" on QUERY.
export function fetchTransport(baseUrl: string, token = dataServiceToken()): RpcTransport {
  const locale = process.env.WIKI12_LOCALE || "en";
  return async (req: JsonRpcRequest): Promise<JsonRpcResponse> => {
    const res = await fetch(`${baseUrl}/api/v2/rpc`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "Accept-Language": locale,
        ...(token ? { Authorization: `UAABearer ${token}` } : {}),
      },
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
