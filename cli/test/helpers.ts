// Test helpers: a recording mock JSON-RPC transport and a mock HTTP transport.

import type {
  HttpRequest,
  HttpResponse,
  HttpTransport,
  JsonRpcRequest,
  JsonRpcResponse,
  RpcTransport,
} from "../src/types.ts";

// Records every JSON-RPC request and returns canned results keyed by method.
// `results` maps an op name to either a fixed result or a function of the
// request; anything not listed returns `{}`.
export function mockRpc(
  results: Record<
    string,
    unknown | ((req: JsonRpcRequest) => unknown)
  > = {},
): { transport: RpcTransport; calls: JsonRpcRequest[] } {
  const calls: JsonRpcRequest[] = [];
  const transport: RpcTransport = async (req: JsonRpcRequest) => {
    calls.push(req);
    const r = results[req.method];
    const result = typeof r === "function" ? (r as (q: JsonRpcRequest) => unknown)(req) : r;
    const res: JsonRpcResponse = {
      jsonrpc: "2.0",
      id: req.id,
      result: result ?? {},
    };
    return res;
  };
  return { transport, calls };
}

// Records every HTTP request and returns canned bodies keyed by "METHOD path".
export function mockHttp(
  bodies: Record<string, unknown | ((req: HttpRequest) => unknown)> = {},
): { transport: HttpTransport; calls: HttpRequest[] } {
  const calls: HttpRequest[] = [];
  const transport: HttpTransport = async (req: HttpRequest) => {
    calls.push(req);
    const key = `${req.method} ${req.path}`;
    const b = bodies[key];
    const body = typeof b === "function" ? (b as (q: HttpRequest) => unknown)(req) : b;
    const res: HttpResponse = { status: 200, body: body ?? {} };
    return res;
  };
  return { transport, calls };
}

// Collect console output from a command run.
export function captureCtx() {
  const out: string[] = [];
  const err: string[] = [];
  return {
    out: (m: string) => out.push(m),
    err: (m: string) => err.push(m),
    lines: out,
    errors: err,
  };
}
