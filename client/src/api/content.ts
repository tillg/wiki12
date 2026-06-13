// Content CRUD over the Data Service JSON-RPC ops (findings-a12.md §3).
//
//   create  -> ADD_DOCUMENT
//   read    -> GET_DOCUMENT   (docRef = "<Model>/<uuid>")
//   update  -> MODIFY_DOCUMENT (// VERIFY exact op name)
//   delete  -> DELETE_DOCUMENT (// VERIFY exact op name)
//
// Identity resolution is server-side: ResolveBySlug {ref} maps an id-or-slug to a
// concrete docRef (architecture.md §3, "try-ID-then-slug"). Slugs are read-only
// and system-derived; a write may change one, so the create/update results carry
// the slug back (and slugChange when it differs).

import { rpc } from "./rpc";

export interface ContentDocument {
  // The A12 document payload as the kernel returns it. Field names follow the
  // data model (Page: Title, Slug, Body). We keep it open since types are
  // user-defined; pages/components read known fields defensively.
  [field: string]: unknown;
}

export interface ContentItem {
  type: string; // model name, e.g. "Page", "Person"
  id: string; // technical id
  slug: string; // namespaced slug
  document: ContentDocument; // full field payload
}

/** docRef = "<Model>/<uuid>" (findings-a12.md §3). */
export function docRef(type: string, id: string): string {
  return `${type}/${id}`;
}

export interface ResolveResult {
  type: string;
  id: string;
  slug: string;
  found: boolean;
}

/** Resolve an id-or-slug to a concrete item ref.
 *
 * The custom ResolveBySlug op isn't in the stock server (QA-LOG B8), so we resolve
 * a docRef ("<Model>_DM/<uuid>") directly here; other refs fall back to the op
 * (and degrade gracefully to not-found if it's absent). */
export async function resolveRef(ref: string): Promise<ResolveResult> {
  const m = ref.match(/^([A-Za-z]\w*_DM)\/(.+)$/);
  if (m) return { type: m[1], id: m[2], slug: ref, found: true };
  try {
    return await rpc<ResolveResult>("ResolveBySlug", { ref });
  } catch {
    return { type: "", id: "", slug: ref, found: false };
  }
}

/** Read a document by technical id. */
export async function getDocument(type: string, id: string): Promise<ContentItem> {
  // VERIFY: GET_DOCUMENT param key (`docRef`) and result envelope.
  const dref = docRef(type, id);
  const result = await rpc<{ document: ContentDocument; docRef?: string }>("GET_DOCUMENT", {
    docRef: dref,
  });
  // Real slugs need the extension listener; until then the docRef is the handle.
  return { type, id, slug: dref, document: result.document };
}

/** Read by id-or-slug (resolve, then GET). */
export async function readByRef(ref: string): Promise<ContentItem> {
  const resolved = await resolveRef(ref);
  if (!resolved.found) throw new Error(`Not found: ${ref}`);
  return getDocument(resolved.type, resolved.id);
}

export interface SlugChange {
  old: string;
  new: string;
}

export interface WriteResult {
  item: ContentItem;
  /** Present when the write changed the slug (architecture.md §3 notification). */
  slugChange?: SlugChange;
}

function extractWriteResult(
  type: string,
  previousSlug: string | undefined,
  raw: { id?: string; document?: ContentDocument; meta?: { slug?: string }; slug?: string },
): WriteResult {
  const id = raw.id ?? String(raw.document?.id ?? "");
  const newSlug = raw.meta?.slug ?? raw.slug ?? String(raw.document?.Slug ?? "");
  const item: ContentItem = { type, id, slug: newSlug, document: raw.document ?? {} };
  const result: WriteResult = { item };
  if (previousSlug && newSlug && previousSlug !== newSlug) {
    result.slugChange = { old: previousSlug, new: newSlug };
  }
  return result;
}

/** Create a new content item; server derives slug + assigns id. */
export async function createDocument(type: string, document: ContentDocument): Promise<WriteResult> {
  // VERIFY: ADD_DOCUMENT param shape (model name + document payload).
  const raw = await rpc<{ id?: string; document?: ContentDocument; meta?: { slug?: string } }>(
    "ADD_DOCUMENT",
    { model: type, document },
  );
  return extractWriteResult(type, undefined, raw);
}

/** Update an existing item; the server may re-derive the slug on key-field change. */
export async function updateDocument(
  type: string,
  id: string,
  document: ContentDocument,
  previousSlug: string,
): Promise<WriteResult> {
  // VERIFY: modify op name + param shape (assumed MODIFY_DOCUMENT with docRef).
  const raw = await rpc<{ id?: string; document?: ContentDocument; meta?: { slug?: string } }>(
    "MODIFY_DOCUMENT",
    { docRef: docRef(type, id), document },
  );
  return extractWriteResult(type, previousSlug, raw);
}

/** Delete an item by id. */
export async function deleteDocument(type: string, id: string): Promise<void> {
  // VERIFY: delete op name + param shape (assumed DELETE_DOCUMENT with docRef).
  await rpc<unknown>("DELETE_DOCUMENT", { docRef: docRef(type, id) });
}
