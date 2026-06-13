import { describe, expect, it } from "vitest";
import { mergeResults, normalizeHit, toLists, type RawHit } from "./search";

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
