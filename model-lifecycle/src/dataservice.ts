// JSON-RPC 2.0 client for the A12 Data Service (architecture.md §6).
//
// The transport is INJECTABLE: production uses `httpTransport` (fetch to
// `{WIKI12_DATA_SERVICE_URL}/api/v2/rpc`); tests inject an in-memory fake.

import type { A12Document, RpcRequest, RpcResponse, RpcTransport } from "./types.ts";

/** Default HTTP transport: one POST per JSON-RPC request. */
export function httpTransport(baseUrl: string): RpcTransport {
  const url = `${baseUrl.replace(/\/$/, "")}/api/v2/rpc`;
  return async (req: RpcRequest): Promise<RpcResponse> => {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(req),
    });
    if (!res.ok) throw new Error(`Data Service RPC HTTP ${res.status}`);
    return (await res.json()) as RpcResponse;
  };
}

export interface QueryResultRow {
  document: A12Document;
}

export class DataService {
  private seq = 0;
  private transport: RpcTransport;
  constructor(transport: RpcTransport) {
    this.transport = transport;
  }

  private async call<T>(method: string, params: unknown): Promise<T> {
    const req: RpcRequest = { jsonrpc: "2.0", id: ++this.seq, method, params };
    const res = await this.transport(req);
    if (res.error) {
      throw new Error(`Data Service ${method} error ${res.error.code}: ${res.error.message}`);
    }
    return res.result as T;
  }

  /**
   * Fetch all instances of `targetDocumentModel` at content version `version`.
   * Pages through the result set. The version filter is an `exact_match` on
   * `/__meta/modelVersion`.
   */
  async fetchInstances(targetDocumentModel: string, version: number): Promise<A12Document[]> {
    const out: A12Document[] = [];
    const pageSize = 100;
    for (let pageNumber = 0; ; pageNumber++) {
      const result = await this.call<{ result?: QueryResultRow[]; rows?: QueryResultRow[] }>("QUERY", {
        query: {
          targetDocumentModel,
          projectionName: "document",
          constraint: {
            operator: "exact_match",
            field: "/__meta/modelVersion",
            value: version,
          },
          paging: { pageNumber, pageSize },
        },
      });
      const rows = result.result ?? result.rows ?? [];
      for (const r of rows) out.push(r.document);
      if (rows.length < pageSize) break;
    }
    return out;
  }

  /** Write an upgraded document back (modify op). */
  async writeDocument(doc: A12Document): Promise<void> {
    await this.call("MODIFY_DOCUMENT", { document: doc });
  }
}
