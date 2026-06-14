import { test } from "node:test";
import assert from "node:assert/strict";
import { a12Document, formatDocument, formatHit, slugChangeMessage } from "../src/format.ts";
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

// a12Document / formatDocument: the CLI ALWAYS returns the A12 document as data.
test("a12Document unwraps the GET_DOCUMENT { document } envelope", () => {
  const doc = { Page: { Title: "Hello", Slug: "page:hello" } };
  assert.deepEqual(a12Document({ document: doc }), doc);
});

test("a12Document passes through an already-unwrapped document", () => {
  const doc = { Person: { FirstName: "Ada" } };
  assert.deepEqual(a12Document(doc), doc);
});

test("formatDocument emits the A12 document incl. the standard envelope as JSON", () => {
  const item = {
    document: {
      Person: {
        FirstName: "Ada",
        LastName: "Lovelace",
        Slug: "person:ada_lovelace",
        Title: "Ada Lovelace",
        CreatedOn: "2026-06-14T00:00:00Z",
        Changes: [{ ChangedOn: "2026-06-14T00:00:00Z", Summary: "created" }],
      },
    },
  };
  const out = formatDocument(item);
  // It is the A12 document (unwrapped), parseable, with every envelope field present.
  const parsed = JSON.parse(out) as { Person: Record<string, unknown> };
  assert.equal(parsed.Person.Title, "Ada Lovelace");
  assert.equal(parsed.Person.Slug, "person:ada_lovelace");
  assert.equal(parsed.Person.CreatedOn, "2026-06-14T00:00:00Z");
  assert.deepEqual(parsed.Person.Changes, [{ ChangedOn: "2026-06-14T00:00:00Z", Summary: "created" }]);
  // No human-formatting wrapper — round-trips back to the document.
  assert.equal(typeof parsed.Person, "object");
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
