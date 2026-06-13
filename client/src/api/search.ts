// Unified search over all content (page + every entity type).
//
// Per the integration contract the Data Service hosts a custom `UnifiedSearch`
// op {query, kind?, type?} returning a typed, already-merged result set:
//   [{ kind, type, id, slug, title, snippet }]
// (architecture.md §4; findings-a12.md §3 — server does the batched fan-out +
// searchText match; the client merges/normalizes the shape it returns).
//
// We still keep a client-side normalize/merge step (`mergeResults`) so that if
// the op ever returns per-model lists, or duplicate hits across models, the UI
// gets one clean, de-duplicated, stably-ordered list. That merge is the pure,
// unit-tested core.

import { rpcBatch, RpcCallError } from "./rpc";

export type ContentKind = "page" | "entity";

// The content models to fan out over (page + entity types). The architecture's
// server-side UnifiedSearch op isn't in the stock server (QA-LOG B8/B10), so the
// client does the batched fan-out itself: one stock simple_search QUERY per model.
const CONTENT_MODELS: { model: string; type: string; kind: ContentKind }[] = [
  { model: "Page_DM", type: "page", kind: "page" },
  { model: "Person_DM", type: "person", kind: "entity" },
  { model: "Film_DM", type: "film", kind: "entity" },
  { model: "Location_DM", type: "location", kind: "entity" },
];

interface QueryEntry {
  docRef: string;
  document: Record<string, Record<string, unknown> & { __meta?: unknown }>;
}

/** Pull the root-group field bag out of an A12 document (fields nest under the group). */
function rootFields(document: Record<string, unknown>): Record<string, unknown> {
  const key = Object.keys(document).find((k) => k !== "__meta" && typeof document[k] === "object");
  return key ? (document[key] as Record<string, unknown>) : {};
}

function entriesToHits(result: unknown, m: { type: string; kind: ContentKind }): RawHit[] {
  if (result instanceof RpcCallError || !result) return [];
  const entries = (result as { entries?: QueryEntry[] }).entries ?? [];
  return entries.map((e) => {
    const f = rootFields(e.document);
    const name = [f.FirstName, f.LastName].filter(Boolean).join(" ");
    const title = String(f.Title ?? f.Name ?? (name || "") ?? "");
    const body = String(f.Body ?? f.Description ?? "");
    return {
      kind: m.kind,
      type: m.type,
      id: e.docRef, // navigate by docRef (real slugs need the extension listener)
      slug: e.docRef,
      title,
      snippet: body.replace(/[#*`>\n]/g, " ").trim().slice(0, 140),
    };
  });
}

export interface SearchHit {
  kind: ContentKind;
  type: string; // model/type name, e.g. "page", "person", "film"
  id: string; // technical id
  slug: string; // namespaced slug, e.g. "person:till_gartner"
  title: string;
  snippet: string;
}

export interface SearchParams {
  query: string;
  kind?: ContentKind;
  type?: string;
}

/** A raw hit as it may arrive from the server (tolerant of missing fields). */
export interface RawHit {
  kind?: string;
  type?: string;
  id?: string;
  slug?: string;
  title?: string;
  snippet?: string;
}

function normalizeKind(kind: string | undefined, type: string | undefined): ContentKind {
  if (kind === "page" || kind === "entity") return kind;
  return type === "page" ? "page" : "entity";
}

/** Coerce one raw hit into a SearchHit, filling sensible fallbacks. Pure. */
export function normalizeHit(raw: RawHit): SearchHit {
  const type = (raw.type ?? "").trim() || "page";
  return {
    kind: normalizeKind(raw.kind, type),
    type,
    id: raw.id ?? "",
    slug: raw.slug ?? "",
    title: (raw.title ?? "").trim() || raw.slug || "(untitled)",
    snippet: raw.snippet ?? "",
  };
}

/**
 * Merge + normalize raw hits (possibly several per-model lists) into one ordered,
 * de-duplicated result set. De-dup key is slug when present, else type/id.
 * Stable: first occurrence wins and ordering is preserved. Pure — unit tested.
 */
export function mergeResults(lists: RawHit[][]): SearchHit[] {
  const seen = new Set<string>();
  const out: SearchHit[] = [];
  for (const list of lists) {
    for (const raw of list) {
      const hit = normalizeHit(raw);
      const key = hit.slug || `${hit.type}/${hit.id}`;
      if (!key || seen.has(key)) continue;
      seen.add(key);
      out.push(hit);
    }
  }
  return out;
}

/** Unified search = client-side batched fan-out (one simple_search QUERY per model). */
export async function unifiedSearch(params: SearchParams): Promise<SearchHit[]> {
  const query = params.query.trim();
  if (!query) return [];
  const models = CONTENT_MODELS.filter(
    (m) => (!params.type || m.type === params.type) && (!params.kind || m.kind === params.kind),
  );
  const batch = models.map((m) => ({
    method: "QUERY",
    params: {
      query: {
        targetDocumentModel: m.model,
        projectionName: "document",
        constraint: { operator: "simple_search", value: query },
        paging: { pageSize: 25, pageNumber: 0 },
      },
    },
  }));
  const results = await rpcBatch(batch);
  return mergeResults(results.map((res, i) => entriesToHits(res, models[i])));
}

/** Coerce the various plausible server envelopes into RawHit[][]. Pure. */
export function toLists(raw: unknown): RawHit[][] {
  if (Array.isArray(raw)) {
    // Either a flat hit array, or an array of per-model lists.
    if (raw.length === 0) return [];
    if (Array.isArray(raw[0])) return raw as RawHit[][];
    return [raw as RawHit[]];
  }
  if (raw && typeof raw === "object") {
    const obj = raw as { results?: RawHit[]; byModel?: RawHit[][] };
    if (Array.isArray(obj.byModel)) return obj.byModel;
    if (Array.isArray(obj.results)) return [obj.results];
  }
  return [];
}
