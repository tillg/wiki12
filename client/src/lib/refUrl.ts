// URL ref helper: the single source of truth for turning an id-or-slug into a
// /view|/edit path segment and back (architecture.md §1). A Slug's charset
// ([a-z0-9_] + one ':') is URL-safe in a non-leading path segment (RFC 3986), so
// it goes in raw — colon-literal, pretty. A docRef ("<Model>_DM/<uuid>") carries a
// '/' that would split the route, so it must be percent-encoded.

/** Is this ref a Slug ("<type>:<name>") vs a docRef ("<Model>_DM/<uuid>")? */
export function isSlug(ref: string): boolean {
  return /^[a-z][a-z0-9_]*:[a-z0-9_]+$/.test(ref);
}

/** Path segment for a /view|/edit deep link.
 *  Slug -> raw (colon-literal, pretty). docRef/other -> encodeURIComponent
 *  (its '/' would otherwise split the route). */
export function refSegment(ref: string): string {
  return isSlug(ref) ? ref : encodeURIComponent(ref);
}

/** Inverse for the route param. encodeURIComponent is a no-op on a clean Slug,
 *  and decodeURIComponent restores a legacy %3A / %2F ref — so decode is safe
 *  for both. */
export function refFromParam(param: string): string {
  return decodeURIComponent(param);
}
