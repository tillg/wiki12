import { test } from "node:test";
import assert from "node:assert/strict";
import { formatHit, slugChangeMessage } from "../src/format.ts";
import type { SearchHit, WriteResult } from "../src/types.ts";

function hit(over: Partial<SearchHit> = {}): SearchHit {
  return {
    kind: "page",
    type: "page",
    id: "1",
    slug: "page:x",
    title: "Title",
    snippet: "snip",
    ...over,
  };
}

test("formatHit renders kind:type, slug, title and snippet", () => {
  assert.equal(
    formatHit(hit({ slug: "page:albert", title: "Albert", snippet: "physicist" })),
    "[page:page] page:albert  Albert  physicist",
  );
});

test("formatHit falls back to (untitled) for an empty title", () => {
  assert.match(formatHit(hit({ title: "" })), /\(untitled\)/);
});

test("formatHit omits the snippet section when there is no snippet", () => {
  const line = formatHit(hit({ title: "T", snippet: "" }));
  assert.equal(line, "[page:page] page:x  T");
});

test("formatHit shows an entity hit's type", () => {
  assert.match(
    formatHit(hit({ kind: "entity", type: "person", slug: "person:till" })),
    /^\[entity:person\] person:till/,
  );
});

// slugChangeMessage: a pure helper for the (Tier-2) slug-change-on-write signal.
test("slugChangeMessage announces an old -> new slug change", () => {
  const r = { slugChange: { from: "page:old", to: "page:new" } } as WriteResult;
  assert.match(slugChangeMessage(r)!, /page:old -> page:new.*404/);
});

test("slugChangeMessage is undefined with no change or a no-op change", () => {
  assert.equal(slugChangeMessage({} as WriteResult), undefined);
  assert.equal(
    slugChangeMessage({ slugChange: { from: "page:x", to: "page:x" } } as WriteResult),
    undefined,
  );
});
