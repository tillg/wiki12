// Pure extractors for the standard content envelope (CreatedOn, Title, Changes)
// off an A12 document (specs/changes/mandatory-content-fields). Kept free of React
// so it can be unit-tested in the node test environment, like lib/modelFields.

export interface ChangeEntry {
  changedOn: string;
  summary: string;
}

/** The model-rooted fields object of an A12 document (descend past __meta). */
export function rootFields(document: Record<string, unknown>): Record<string, unknown> {
  const key = Object.keys(document).find(
    (k) => k !== "__meta" && typeof document[k] === "object" && document[k] !== null,
  );
  return key ? (document[key] as Record<string, unknown>) : document;
}

/** The display Title: derived/authored Title, else Name, else a FirstName+LastName join. */
export function titleOf(document: Record<string, unknown>, fallback = ""): string {
  const f = rootFields(document);
  const name = [f.FirstName, f.LastName].filter(Boolean).join(" ");
  return String(f.Title ?? f.Name ?? (name || fallback));
}

/** The envelope Slug ("<type>:<name>"), or "" if absent. This is the single point
 *  where "real slugs" turn on: until the server-side listener surfaces Slug, this
 *  returns "" and callers fall back to the docRef (graceful degradation). */
export function slugOf(document: Record<string, unknown>): string {
  const v = rootFields(document).Slug;
  return typeof v === "string" ? v : "";
}

/** The CreatedOn instant (ISO string), or null if absent. */
export function createdOnOf(document: Record<string, unknown>): string | null {
  const v = rootFields(document).CreatedOn;
  return typeof v === "string" && v ? v : null;
}

/** The change log, newest entry first (reverse-chronological for display). */
export function changesOf(document: Record<string, unknown>): ChangeEntry[] {
  const raw = rootFields(document).Changes;
  if (!Array.isArray(raw)) return [];
  const entries = raw.map((e) => {
    const o = (e ?? {}) as Record<string, unknown>;
    return {
      changedOn: typeof o.ChangedOn === "string" ? o.ChangedOn : "",
      summary: typeof o.Summary === "string" ? o.Summary : "",
    };
  });
  return entries.reverse();
}
