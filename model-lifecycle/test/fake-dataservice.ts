// In-memory fake Data Service transport for tests. Implements just enough of the
// JSON-RPC surface the runner uses: QUERY (by /__meta/modelVersion) and
// MODIFY_DOCUMENT (write-back).

import type { A12Document, RpcRequest, RpcResponse, RpcTransport } from "../src/types.ts";

export interface FakeStore {
  /** docRef -> document */
  docs: Map<string, A12Document>;
  writes: A12Document[];
}

export function makeFakeTransport(seed: A12Document[] = []): { transport: RpcTransport; store: FakeStore } {
  const store: FakeStore = { docs: new Map(), writes: [] };
  for (const d of seed) store.docs.set(d.__meta?.docRef as string, d);

  const transport: RpcTransport = async (req: RpcRequest): Promise<RpcResponse> => {
    if (req.method === "QUERY") {
      const params = req.params as {
        query: { targetDocumentModel: string; constraint?: { field: string; value: unknown }; paging: { pageNumber: number; pageSize: number } };
      };
      const { targetDocumentModel, constraint, paging } = params.query;
      const want = constraint?.value;
      const matches = [...store.docs.values()].filter((d) => {
        const ref = d.__meta?.docRef as string | undefined;
        if (!ref || !ref.startsWith(`${targetDocumentModel}/`)) return false;
        if (constraint && constraint.field === "/__meta/modelVersion") {
          return d.__meta?.modelVersion === want;
        }
        return true;
      });
      const start = paging.pageNumber * paging.pageSize;
      const page = matches.slice(start, start + paging.pageSize);
      return { jsonrpc: "2.0", id: req.id, result: { result: page.map((document) => ({ document })) } };
    }
    if (req.method === "MODIFY_DOCUMENT") {
      const { document } = req.params as { document: A12Document };
      store.docs.set(document.__meta?.docRef as string, document);
      store.writes.push(document);
      return { jsonrpc: "2.0", id: req.id, result: { ok: true } };
    }
    return { jsonrpc: "2.0", id: req.id, error: { code: -32601, message: `method not found: ${req.method}` } };
  };

  return { transport, store };
}
