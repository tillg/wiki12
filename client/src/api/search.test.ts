import { beforeEach, describe, expect, it, vi } from "vitest";

// unifiedSearch/listAllContent fan out over rpcBatch; stub the transport so the
// query-guard tests can assert whether the server is hit.
vi.mock("./rpc", () => ({
  rpcBatch: vi.fn(async () => []),
  RpcCallError: class RpcCallError extends Error {},
}));

import { rpcBatch } from "./rpc";
import {
  dedupeCards,
  formatCardDate,
  formatCardDates,
  isSearchable,
  lastChangedOf,
  mergeResults,
  MIN_SEARCH_LENGTH,
  normalizeHit,
  resolveTimestamps,
  sortByRecency,
  toLists,
  unifiedSearch,
  type ContentCardData,
  type RawHit,
} from "./search";

const rpcBatchMock = vi.mocked(rpcBatch);

// Regression: searching "ar" returned 0 cards while "arr" returned 5. simple_search
// (Postgres trigram) rejects a <3-char query as "invalid search data" (-32051) and
// the whole batch rolls back; the client swallowed the error → misleading empty. The
// fix guards too-short queries client-side so we never fire an invalid one.
describe("isSearchable / unifiedSearch min-length guard", () => {
  it("MIN_SEARCH_LENGTH is 3 (trigram minimum)", () => {
    expect(MIN_SEARCH_LENGTH).toBe(3);
  });
  it("rejects sub-3-char queries, accepts >=3 (trimmed)", () => {
    expect(isSearchable("ar")).toBe(false);
    expect(isSearchable(" a ")).toBe(false);
    expect(isSearchable("arr")).toBe(true);
    expect(isSearchable("  arr  ")).toBe(true);
  });

  beforeEach(() => {
    rpcBatchMock.mockReset();
    rpcBatchMock.mockResolvedValue([]);
  });
  it("does NOT hit the server for a too-short query (was the bug: 'ar' fired + errored)", async () => {
    expect(await unifiedSearch({ query: "ar" })).toEqual([]);
    expect(rpcBatchMock).not.toHaveBeenCalled();
  });
  it("hits the server for a 3-char query ('arr')", async () => {
    await unifiedSearch({ query: "arr" });
    expect(rpcBatchMock).toHaveBeenCalledOnce();
  });
});

describe("resolveTimestamps", () => {
  it("prefers the envelope CreatedOn + newest Changes", () => {
    const doc = {
      Page: { CreatedOn: "2026-06-10T00:00:00Z", Changes: [{ ChangedOn: "2026-06-12T00:00:00Z" }] },
      __meta: { createdAt: "2020-01-01T00:00:00", modifiedAt: "2020-02-02T00:00:00" },
    };
    expect(resolveTimestamps(doc)).toEqual({
      createdOn: "2026-06-10T00:00:00Z",
      lastChangedOn: "2026-06-12T00:00:00Z",
    });
  });
  it("falls back to __meta.createdAt/modifiedAt when the envelope is absent", () => {
    const doc = { Page: { Title: "x" }, __meta: { createdAt: "2026-06-13T07:52:16", modifiedAt: "2026-06-14T08:00:00" } };
    expect(resolveTimestamps(doc)).toEqual({
      createdOn: "2026-06-13T07:52:16",
      lastChangedOn: "2026-06-14T08:00:00",
    });
  });
  it("is empty when neither envelope nor meta timestamps exist", () => {
    expect(resolveTimestamps({ Page: { Title: "x" } })).toEqual({
      createdOn: undefined,
      lastChangedOn: undefined,
    });
  });
});

function cd(over: Partial<ContentCardData> = {}): ContentCardData {
  return { kind: "entity", type: "person", id: "M/1", slug: "person:x", title: "X", snippet: "", ...over };
}

describe("formatCardDate", () => {
  it("renders an ISO instant as YYYY-MM-DD", () => {
    expect(formatCardDate("2026-06-14T09:30:00Z")).toBe("2026-06-14");
  });
  it("is empty for undefined/empty", () => {
    expect(formatCardDate(undefined)).toBe("");
    expect(formatCardDate("")).toBe("");
  });
});

describe("formatCardDates (created · edited line)", () => {
  it("is empty when no timestamps", () => {
    expect(formatCardDates(undefined, undefined)).toBe("");
  });
  it("shows just the created date when nothing changed", () => {
    expect(formatCardDates("2026-06-14T17:56:17", "2026-06-14T17:56:17")).toBe("2026-06-14");
    expect(formatCardDates("2026-06-14T17:56:17", undefined)).toBe("2026-06-14");
  });
  it("appends the edit TIME when modified later the same day", () => {
    expect(formatCardDates("2026-06-14T17:56:17", "2026-06-14T18:09:30")).toBe("2026-06-14 · edited 18:09");
  });
  it("appends the edit DATE when modified on a different day", () => {
    expect(formatCardDates("2026-06-13T07:00:00", "2026-06-20T09:30:00")).toBe("2026-06-13 · edited 2026-06-20");
  });
  it("falls back to the changed date when there is no created", () => {
    expect(formatCardDates(undefined, "2026-06-14T18:09:30")).toBe("2026-06-14");
  });
});

describe("lastChangedOf", () => {
  it("takes the newest ChangedOn across the Changes group", () => {
    const f = {
      CreatedOn: "2026-06-01T00:00:00Z",
      Changes: [
        { ChangedOn: "2026-06-01T00:00:00Z", Summary: "created" },
        { ChangedOn: "2026-06-09T12:00:00Z", Summary: "updated" },
        { ChangedOn: "2026-06-05T08:00:00Z", Summary: "updated" },
      ],
    };
    expect(lastChangedOf(f, "2026-06-01T00:00:00Z")).toBe("2026-06-09T12:00:00Z");
  });
  it("falls back to CreatedOn when there is no Changes log", () => {
    expect(lastChangedOf({}, "2026-06-01T00:00:00Z")).toBe("2026-06-01T00:00:00Z");
  });
  it("is undefined when neither is present", () => {
    expect(lastChangedOf({})).toBeUndefined();
  });
});

describe("sortByRecency", () => {
  it("orders newest-changed first, missing timestamps last", () => {
    const cards = [
      cd({ slug: "a", lastChangedOn: "2026-01-01T00:00:00Z" }),
      cd({ slug: "b" }),
      cd({ slug: "c", lastChangedOn: "2026-06-01T00:00:00Z" }),
    ];
    expect(sortByRecency(cards).map((c) => c.slug)).toEqual(["c", "a", "b"]);
  });
  it("breaks ties deterministically by title then slug, and does not mutate input", () => {
    const cards = [cd({ slug: "z", title: "Beta" }), cd({ slug: "a", title: "Alpha" })];
    const before = cards.map((c) => c.slug);
    expect(sortByRecency(cards).map((c) => c.title)).toEqual(["Alpha", "Beta"]);
    expect(cards.map((c) => c.slug)).toEqual(before);
  });
});

describe("dedupeCards", () => {
  it("removes duplicates by slug, first wins, order preserved", () => {
    const cards = [cd({ slug: "a", title: "first" }), cd({ slug: "b" }), cd({ slug: "a", title: "dup" })];
    const out = dedupeCards(cards);
    expect(out.map((c) => c.slug)).toEqual(["a", "b"]);
    expect(out[0].title).toBe("first");
  });
});

describe("normalizeHit", () => {
  it("infers kind 'page' for the page type and 'entity' otherwise", () => {
    expect(normalizeHit({ type: "page", id: "1" }).kind).toBe("page");
    expect(normalizeHit({ type: "person", id: "2" }).kind).toBe("entity");
  });

  it("respects an explicit kind", () => {
    expect(normalizeHit({ kind: "entity", type: "page", id: "1" }).kind).toBe("entity");
  });

  it("falls back title to slug then placeholder", () => {
    expect(normalizeHit({ type: "page", id: "1", slug: "page:home" }).title).toBe("page:home");
    expect(normalizeHit({ type: "page", id: "1" }).title).toBe("(untitled)");
  });
});

describe("mergeResults", () => {
  it("merges per-model lists preserving order", () => {
    const lists: RawHit[][] = [
      [{ type: "page", id: "1", slug: "page:a", title: "A" }],
      [{ type: "person", id: "2", slug: "person:b", title: "B" }],
    ];
    const out = mergeResults(lists);
    expect(out.map((h) => h.slug)).toEqual(["page:a", "person:b"]);
    expect(out[1].kind).toBe("entity");
  });

  it("de-duplicates by slug, first occurrence wins", () => {
    const lists: RawHit[][] = [
      [{ type: "page", id: "1", slug: "page:a", title: "First" }],
      [{ type: "page", id: "1", slug: "page:a", title: "Dup" }],
    ];
    const out = mergeResults(lists);
    expect(out).toHaveLength(1);
    expect(out[0].title).toBe("First");
  });

  it("de-duplicates by type/id when slug is absent", () => {
    const lists: RawHit[][] = [
      [{ type: "page", id: "x" }],
      [{ type: "page", id: "x" }],
    ];
    expect(mergeResults(lists)).toHaveLength(1);
  });
});

describe("toLists", () => {
  it("wraps a flat hit array", () => {
    expect(toLists([{ type: "page", id: "1" }])).toEqual([[{ type: "page", id: "1" }]]);
  });

  it("passes through an array of per-model lists", () => {
    const nested = [[{ type: "page", id: "1" }], [{ type: "person", id: "2" }]];
    expect(toLists(nested)).toEqual(nested);
  });

  it("reads the { results } envelope", () => {
    expect(toLists({ results: [{ type: "page", id: "1" }] })).toEqual([[{ type: "page", id: "1" }]]);
  });

  it("reads the { byModel } envelope", () => {
    const byModel = [[{ type: "page", id: "1" }]];
    expect(toLists({ byModel })).toEqual(byModel);
  });

  it("returns [] for unknown shapes", () => {
    expect(toLists(null)).toEqual([]);
    expect(toLists("nope")).toEqual([]);
    expect(toLists([])).toEqual([]);
  });
});
