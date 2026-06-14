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
export const CONTENT_MODELS: { model: string; type: string; kind: ContentKind }[] = [
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

/** A string field value, or undefined if absent/empty. */
function isoOrUndef(v: unknown): string | undefined {
  return typeof v === "string" && v ? v : undefined;
}

/**
 * Last-modification instant: the newest ChangedOn across the append-only Changes
 * group (ISO strings compare chronologically), falling back to CreatedOn, else
 * undefined. The Changes group is a JSON array of { ChangedOn, Summary } (A12 contract).
 */
export function lastChangedOf(f: Record<string, unknown>, createdOn?: string): string | undefined {
  const changes = Array.isArray(f.Changes) ? (f.Changes as Record<string, unknown>[]) : [];
  let max: string | undefined;
  for (const c of changes) {
    const t = isoOrUndef(c?.ChangedOn);
    if (t && (!max || t > max)) max = t;
  }
  return max ?? createdOn;
}

/**
 * Resolve a card's timestamps from a document. Prefers the standard envelope
 * (`CreatedOn`, newest `Changes[].ChangedOn`); falls back to A12's document
 * metadata (`__meta.createdAt` / `__meta.modifiedAt`) so the date line still shows
 * on instances created before the envelope shipped. Pure — unit tested.
 */
export function resolveTimestamps(document: Record<string, unknown>): {
  createdOn?: string;
  lastChangedOn?: string;
} {
  const f = rootFields(document);
  const meta = (document?.__meta ?? {}) as Record<string, unknown>;
  const createdOn = isoOrUndef(f.CreatedOn) ?? isoOrUndef(meta.createdAt);
  const changesMax = lastChangedOf(f, undefined); // newest Changes[].ChangedOn, else undefined
  const lastChangedOn = changesMax ?? isoOrUndef(meta.modifiedAt) ?? createdOn;
  return { createdOn, lastChangedOn };
}

function entriesToHits(result: unknown, m: { type: string; kind: ContentKind }): ContentCardData[] {
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
      ...resolveTimestamps(e.document),
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

/** A SearchHit enriched with the envelope timestamps, for gallery cards. */
export interface ContentCardData extends SearchHit {
  createdOn?: string; // CreatedOn (DateTimeType ISO string)
  lastChangedOn?: string; // max(Changes[].ChangedOn) ?? createdOn
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

// ---- Gallery read model: list-all + recency sort + live filter -------------

/** Format an ISO instant as a short display date (YYYY-MM-DD); empty for absent. Pure. */
export function formatCardDate(iso?: string): string {
  return iso ? iso.slice(0, 10) : "";
}

/** De-duplicate cards by slug (else type/id); first wins, order preserved. Pure. */
export function dedupeCards(cards: ContentCardData[]): ContentCardData[] {
  const seen = new Set<string>();
  const out: ContentCardData[] = [];
  for (const c of cards) {
    const key = c.slug || `${c.type}/${c.id}`;
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(c);
  }
  return out;
}

/**
 * Order cards by last modification, newest first. Cards without a lastChangedOn
 * sort last; ties (and missing-both) break deterministically by title then slug.
 * ISO strings compare chronologically. Pure — unit tested.
 */
export function sortByRecency(cards: ContentCardData[]): ContentCardData[] {
  return [...cards].sort((a, b) => {
    const ta = a.lastChangedOn;
    const tb = b.lastChangedOn;
    if (ta && tb && ta !== tb) return tb.localeCompare(ta); // newest first
    if (ta && !tb) return -1; // missing sorts last
    if (!ta && tb) return 1;
    return (a.title || a.slug).localeCompare(b.title || b.slug); // deterministic tie-break
  });
}

/** Live filter: case-insensitive substring over title + snippet; empty query = all. Pure. */
export function filterCards(cards: ContentCardData[], query: string): ContentCardData[] {
  const q = query.trim().toLowerCase();
  if (!q) return cards;
  return cards.filter((c) => `${c.title} ${c.snippet}`.toLowerCase().includes(q));
}

/**
 * List ALL content as gallery cards, newest-changed first. Same client-side
 * batched fan-out as unifiedSearch but with a constraint-free (list-all) QUERY per
 * model (A12: omitting `constraint` returns every document), biased recent via a
 * per-model CreatedOn DESC sort; authoritative cross-model ordering is sortByRecency.
 */
export async function listAllContent(params: { type?: string; kind?: ContentKind } = {}): Promise<ContentCardData[]> {
  const models = CONTENT_MODELS.filter(
    (m) => (!params.type || m.type === params.type) && (!params.kind || m.kind === params.kind),
  );
  const batch = models.map((m) => ({
    method: "QUERY",
    params: {
      query: {
        targetDocumentModel: m.model,
        projectionName: "document",
        // constraint omitted → all documents (A12 Query API)
        sort: [{ field: "CreatedOn", direction: "DESC", nullHandling: "NULLS_LAST", ignoreCase: false }],
        paging: { pageSize: 100, pageNumber: 0 },
      },
    },
  }));
  const results = await rpcBatch(batch);
  const cards = results.flatMap((res, i) => entriesToHits(res, models[i]));
  return sortByRecency(dedupeCards(cards));
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
