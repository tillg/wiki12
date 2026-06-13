// Shared types for the wiki12 CLI.

// ---------------------------------------------------------------------------
// JSON-RPC 2.0 (Data Service)
// ---------------------------------------------------------------------------

export type JsonRpcId = number;

export interface JsonRpcRequest {
  jsonrpc: "2.0";
  id: JsonRpcId;
  method: string;
  params: Record<string, unknown>;
}

export interface JsonRpcError {
  code: number;
  message: string;
  data?: unknown;
}

export interface JsonRpcResponse<T = unknown> {
  jsonrpc: "2.0";
  id: JsonRpcId;
  result?: T;
  error?: JsonRpcError;
}

// A transport takes a fully-formed JSON-RPC request and returns the response.
// Injectable so tests can mock it without touching the network.
export type RpcTransport = (
  req: JsonRpcRequest,
) => Promise<JsonRpcResponse>;

// ---------------------------------------------------------------------------
// HTTP transport (model-lifecycle service)
// ---------------------------------------------------------------------------

export interface HttpRequest {
  method: "GET" | "POST" | "PUT";
  path: string; // e.g. "/models", "/form-model/page"
  body?: unknown;
}

export interface HttpResponse<T = unknown> {
  status: number;
  body: T;
}

export type HttpTransport = (req: HttpRequest) => Promise<HttpResponse>;

// ---------------------------------------------------------------------------
// Domain shapes
// ---------------------------------------------------------------------------

// A content item as returned by the Data Service. `fields` carries the
// type-specific data; slug/id/type are the common addressing attributes.
export interface ContentItem {
  type: string;
  id: string;
  slug: string;
  fields: Record<string, unknown>;
}

// A write (create/update) may report a slug change old -> new.
export interface WriteResult extends ContentItem {
  slugChange?: { from: string; to: string };
}

// A unified-search hit.
export interface SearchHit {
  kind: "page" | "entity";
  type: string;
  id: string;
  slug: string;
  title: string;
  snippet: string;
}
