// Shared types for the model-lifecycle service.
//
// We import the Document/Form model shapes read-only from the dm-to-fm package
// (the form generator we reuse). Everything else here is local to this service.

import type { DMElement, DocumentModel, FormModel } from "../../src/dm-to-fm/src/types.ts";

export type { DMElement, DocumentModel, FormModel };

// ---- A12 documents (content instances) ----
// An A12 document carries a `__meta` block (docRef, modelVersion, …) plus the
// model-rooted payload. We keep it permissive: migrations transform arbitrary
// JSON, the runner only relies on `__meta`.
export interface DocMeta {
  docRef?: string; // "<ModelName>/<uuid>"
  modelReference?: string;
  modelVersion?: number | string | null;
  [key: string]: unknown;
}
export interface A12Document {
  __meta?: DocMeta;
  [key: string]: unknown;
}

// ---- Migration content item ----
// Stored as an A12 `Migration` document (see models/Migration_DM.json). The
// service holds the registry in memory in the baseline; persistence rides the
// Data Service later. `id` is keyed `<targetModel>:<from>-<to>` for addressing.
export interface Migration {
  id: string;
  targetModel: string;
  fromVersion: number;
  toVersion: number;
  /** TS source: default-exports (or exports `migrate`) `(doc) => doc`. */
  script: string;
}

// ---- Migrate report (POST /migrate response) ----
export interface SlugChange {
  id: string;
  oldSlug: string;
  newSlug: string;
}
export interface MigrateFailure {
  id: string;
  error: string;
}
export interface MigrateReport {
  count: number;
  migrated: number;
  failures: MigrateFailure[];
  slugManifest: SlugChange[];
}

// ---- Deploy request (POST /models) ----
export interface DeployRequest {
  documentModel: DocumentModel;
  migration?: Migration;
}

// ---- Migrate request (POST /migrate) ----
export interface MigrateRequest {
  type: string;
  from: number;
  to: number;
  dryRun?: boolean;
}

// ---- Data Service JSON-RPC transport (injectable) ----
export interface RpcRequest {
  jsonrpc: "2.0";
  id: string | number;
  method: string;
  params: unknown;
}
export interface RpcResponse<T = unknown> {
  jsonrpc: "2.0";
  id: string | number;
  result?: T;
  error?: { code: number; message: string; data?: unknown };
}
/** A function that sends one JSON-RPC request and resolves its response. */
export type RpcTransport = (req: RpcRequest) => Promise<RpcResponse>;
