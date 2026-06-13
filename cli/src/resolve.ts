// Identifier resolution and model-name mapping.
//
// Domain (domain.md "Identifiers"; ADR-0001):
//   - Either a Technical ID or a slug resolves an item (try-ID-then-slug).
//   - Slugs are namespaced "<type>:<name>"; a bare "<name>" defaults to the
//     "page:" namespace.
//   - The ID grammar is reserved so the two never collide.
//
// Resolution strategy:
//   - If the ref looks like a Technical ID, read it directly via GET_DOCUMENT.
//   - Otherwise treat it as a slug (defaulting a bare name to page:<name>) and
//     resolve it to a docRef via the custom `ResolveBySlug` op.

import { RpcClient } from "./rpc.ts";
import { modelName } from "./model-name.ts";

// Technical IDs are opaque, prefixed handles (e.g. "pg_01H...", "en_01H...").
// The slug grammar is lowercase [a-z0-9_] with ":" as the namespace delimiter,
// so an ID is anything that is NOT a bare/namespaced slug. We treat a ref as an
// ID when it contains a character outside the slug grammar (notably uppercase),
// matching the "ID grammar is reserved so the two never collide" rule.
// VERIFY: exact Technical ID grammar (prefix + charset) — assumed here to be
// non-slug-shaped (contains uppercase or a char outside [a-z0-9_:]).
const SLUG_RE = /^(?:[a-z][a-z0-9_]*:)?[a-z0-9_]+$/;

export function looksLikeSlug(ref: string): boolean {
  return SLUG_RE.test(ref);
}

export function looksLikeId(ref: string): boolean {
  return !looksLikeSlug(ref);
}

// Normalize a slug: a bare name defaults to the page namespace.
export function normalizeSlug(ref: string): string {
  return ref.includes(":") ? ref : `page:${ref}`;
}

// docRef for the Data Service = "<ModelName>/<uuid>".
export function docRef(type: string, id: string): string {
  return `${modelName(type)}/${id}`;
}

// Resolve a user-supplied ref (ID or slug) to a docRef the Data Service reads.
//   - ID  -> "<ModelName>/<id>" directly (type known from the command).
//   - slug -> ResolveBySlug({ ref }) -> { docRef } (or { type, id }).
// VERIFY: ResolveBySlug return shape — assumed { docRef } or { type, id, slug }.
export async function resolveDocRef(
  rpc: RpcClient,
  type: string,
  ref: string,
): Promise<string> {
  if (looksLikeId(ref)) {
    return docRef(type, ref);
  }
  const slug = normalizeSlug(ref);
  const resolved = await rpc.call<{ docRef?: string; type?: string; id?: string }>(
    "ResolveBySlug",
    { ref: slug },
  );
  if (resolved.docRef) return resolved.docRef;
  if (resolved.type && resolved.id) return docRef(resolved.type, resolved.id);
  throw new Error(`could not resolve slug "${slug}"`);
}
