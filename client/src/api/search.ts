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

import { rpc } from "./rpc";

export type ContentKind = "page" | "entity";

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

/** Call the server-side UnifiedSearch op and return a clean, merged result set. */
export async function unifiedSearch(params: SearchParams): Promise<SearchHit[]> {
  const query = params.query.trim();
  if (!query) return [];
  // VERIFY: the exact UnifiedSearch result envelope. The contract states a flat
  // array of hits; we also accept { results: [...] } and per-model { byModel: [[...]] }
  // shapes so the UI is robust to the server's final shape.
  const raw = await rpc<unknown>("UnifiedSearch", {
    query,
    ...(params.kind ? { kind: params.kind } : {}),
    ...(params.type ? { type: params.type } : {}),
  });
  return mergeResults(toLists(raw));
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
