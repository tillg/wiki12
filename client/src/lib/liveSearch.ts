// Pure decision for the header's live-search box: given the current query, the
// current route, and the query we last navigated for, what navigation (if any)
// should happen? Kept pure so the tricky "don't bounce" rule is unit-testable.
//
// The header box lives in the app shell and its value persists across routes. The
// live-search effect therefore re-fires on route changes too — so we must NOT treat
// "still has text, route changed" as a reason to navigate, or leftover search text
// would trap the user on /search and make Browse (and its card-click detail)
// unreachable. The `lastNavigatedQuery` guard encodes exactly that.

export interface LiveSearchNav {
  to: string;
  replace: boolean;
}

/**
 * @param query               current text in the search box
 * @param pathname            current route pathname
 * @param lastNavigatedQuery  the (trimmed) query we last navigated for
 * @returns the navigation to perform, or null to stay put.
 */
export function liveSearchTarget(
  query: string,
  pathname: string,
  lastNavigatedQuery: string,
): LiveSearchNav | null {
  const q = query.trim();
  const onSearch = pathname === "/search";

  // Already navigated for this exact query: a bare route change (e.g. user went to
  // Browse) must not re-trigger a jump to /search. Only an actual query change does.
  if (q === lastNavigatedQuery && (q !== "" || onSearch)) return null;

  if (q) return { to: `/search?q=${encodeURIComponent(q)}`, replace: onSearch };
  if (onSearch) return { to: "/search", replace: true }; // cleared → show the hint
  return null; // empty box, off /search → nothing to do
}
