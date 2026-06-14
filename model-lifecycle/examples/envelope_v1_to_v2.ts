// Migration: content schema v1 -> v2 — backfill the standard content envelope
// (specs/changes/mandatory-content-fields).
//
// v2 adds CreatedOn, a derived Title, and a Changes log to every content type.
// This migration is TYPE-AGNOSTIC: it operates on the single model-rooted group
// of the document (Page / Person / Film / Location), so one script serves all
// four types (shipped as four Migration items — Page:1-2, Person:1-2, …).
//
// A migration is a PURE function over ONE document: (doc at v1) -> (doc at v2).
// The runner owns iteration, IO, dry-run, and reporting. The sandbox strips ALL
// ambient globals (no Date/Math.random), so the backfill instant is a baked
// constant: the migration's authoring date. Legacy rows' true creation time is
// unknown, so this is a documented approximation (architecture.md §5).
//
// Title is intentionally NOT set here: the Data Service lifecycle listener
// re-derives Title (and slug/searchText) on the write that persists the upgraded
// instance, for the types that declare a derived Title (Person, Location). Page
// and Film already author their Title.

const BACKFILL_INSTANT = "2026-06-14T00:00:00Z";

interface Doc {
  __meta?: Record<string, unknown>;
  [group: string]: unknown;
}

interface ChangeEntry {
  ChangedOn: string;
  Summary: string;
}

export function migrate(doc: Doc): Doc {
  const groupKey = Object.keys(doc).find((k) => k !== "__meta");
  if (!groupKey) return doc;
  const group = (doc[groupKey] as Record<string, unknown>) ?? {};
  const existing = Array.isArray(group.Changes) ? (group.Changes as ChangeEntry[]) : [];
  return {
    ...doc,
    [groupKey]: {
      ...group,
      CreatedOn: (group.CreatedOn as string | undefined) ?? BACKFILL_INSTANT,
      Changes: existing.length
        ? existing
        : [{ ChangedOn: BACKFILL_INSTANT, Summary: "migrated to v2" }],
    },
  };
}

export default migrate;
