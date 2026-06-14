import { test } from "node:test";
import assert from "node:assert/strict";
import {
  OP_CREATE,
  OP_DELETE,
  OP_MODIFY,
  OP_QUERY,
  OP_READ,
  OP_UNIFIED_SEARCH,
  runEntity,
} from "../src/commands/entity.ts";
import { runPage } from "../src/commands/page.ts";
import { RpcClient } from "../src/rpc.ts";
import { captureCtx, mockRpc } from "./helpers.ts";

function ctxWith(results = {}) {
  const { transport, calls } = mockRpc(results);
  const cap = captureCtx();
  const ctx = { rpc: new RpcClient(transport), out: cap.out, err: cap.err };
  return { ctx, calls, cap };
}

// ---------------------------------------------------------------------------
// create -> ADD_DOCUMENT { documentModelName, locale, document } (validated:
// client/src/api/content.ts createDocument, QA-LOG B14). `document` is the
// group-keyed payload { <Group>: { ...fields } }.
// ---------------------------------------------------------------------------

test("create builds ADD_DOCUMENT with documentModelName + locale + group-keyed document", async () => {
  const { ctx, calls, cap } = ctxWith({
    [OP_CREATE]: { docRef: "Page_DM/pg_1" },
  });
  const code = await runEntity(ctx, "page", "create", [
    "--field",
    "Title=Hello",
    "--field",
    "Body=Hi there",
  ]);
  assert.equal(code, 0);
  assert.equal(calls[0].method, OP_CREATE);
  assert.deepEqual(calls[0].params, {
    documentModelName: "Page_DM",
    locale: "en",
    document: { Page: { Title: "Hello", Body: "Hi there" } },
  });
  // Slug is server-derived (not returned by the write); id comes from the docRef.
  assert.match(cap.lines.join("\n"), /Created Page_DM\/pg_1/);
});

test("create wraps under the entity's own root group (person -> Person)", async () => {
  const { ctx, calls } = ctxWith({ [OP_CREATE]: { docRef: "Person_DM/en_1" } });
  await runEntity(ctx, "person", "create", ["--field", "Name=Till"]);
  assert.deepEqual(calls[0].params, {
    documentModelName: "Person_DM",
    locale: "en",
    document: { Person: { Name: "Till" } },
  });
});

test("create with no --field sends an empty group document", async () => {
  const { ctx, calls } = ctxWith({ [OP_CREATE]: { docRef: "Page_DM/pg_9" } });
  const code = await runEntity(ctx, "page", "create", []);
  assert.equal(code, 0);
  assert.deepEqual((calls[0].params as { document: unknown }).document, { Page: {} });
});

test("create accepts a bare-string docRef result", async () => {
  const { ctx, cap } = ctxWith({ [OP_CREATE]: "Page_DM/pg_42" });
  await runEntity(ctx, "page", "create", ["--field", "Title=X"]);
  assert.match(cap.lines.join("\n"), /Created Page_DM\/pg_42/);
});

// ---------------------------------------------------------------------------
// read -> resolve then GET_DOCUMENT { docRef }
// ---------------------------------------------------------------------------

test("read resolves slug (ResolveBySlug idOrSlug) then GET_DOCUMENT", async () => {
  const { ctx, calls } = ctxWith({
    ResolveBySlug: { docRef: "Page_DM/pg_1" },
    [OP_READ]: { document: { Page: { Title: "Hello" } } },
  });
  const code = await runEntity(ctx, "page", "read", ["hello"]);
  assert.equal(code, 0);
  assert.equal(calls[0].method, "ResolveBySlug");
  assert.deepEqual(calls[0].params, { idOrSlug: "page:hello", type: "Page_DM" });
  assert.equal(calls[1].method, OP_READ);
  assert.deepEqual(calls[1].params, { docRef: "Page_DM/pg_1" });
});

test("read by technical id skips ResolveBySlug", async () => {
  const { ctx, calls } = ctxWith({
    [OP_READ]: { document: {} },
  });
  await runEntity(ctx, "page", "read", ["pg_01HXYZ"]);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].method, OP_READ);
  assert.deepEqual(calls[0].params, { docRef: "Page_DM/pg_01HXYZ" });
});

test("read ALWAYS prints the A12 document (unwrapped) incl. the standard envelope", async () => {
  const doc = {
    Person: {
      FirstName: "Ada",
      LastName: "Lovelace",
      Slug: "person:ada_lovelace",
      Title: "Ada Lovelace",
      CreatedOn: "2026-06-14T00:00:00Z",
      Changes: [{ ChangedOn: "2026-06-14T00:00:00Z", Summary: "created" }],
    },
  };
  const { ctx, cap } = ctxWith({
    ResolveBySlug: { docRef: "Person_DM/pe_1" },
    [OP_READ]: { document: doc },
  });
  const code = await runEntity(ctx, "person", "read", ["ada_lovelace"]);
  assert.equal(code, 0);
  // Exactly one line, and it parses back to the A12 document (the { document }
  // wrapper unwrapped) — the CLI's data format is the A12 document itself.
  assert.equal(cap.lines.length, 1);
  assert.deepEqual(JSON.parse(cap.lines[0]), doc);
});

test("read without a ref is a usage error (exit 2)", async () => {
  const { ctx, cap } = ctxWith();
  const code = await runEntity(ctx, "page", "read", []);
  assert.equal(code, 2);
  assert.match(cap.errors.join("\n"), /id-or-slug is required/);
});

// ---------------------------------------------------------------------------
// update -> MODIFY_DOCUMENT { docRef, document } only (no modelName/locale, B21)
// ---------------------------------------------------------------------------

test("update builds MODIFY_DOCUMENT with docRef + group-keyed document only", async () => {
  const { ctx, calls, cap } = ctxWith({
    ResolveBySlug: { docRef: "Page_DM/pg_1" },
    [OP_MODIFY]: undefined, // MODIFY_DOCUMENT returns void
  });
  const code = await runEntity(ctx, "page", "update", [
    "old_title",
    "--field",
    "Title=New Title",
  ]);
  assert.equal(code, 0);
  assert.equal(calls[1].method, OP_MODIFY);
  assert.deepEqual(calls[1].params, {
    docRef: "Page_DM/pg_1",
    document: { Page: { Title: "New Title" } },
  });
  // No documentModelName / locale keys (rejected by MODIFY_DOCUMENT).
  assert.ok(!("documentModelName" in (calls[1].params as object)));
  assert.ok(!("locale" in (calls[1].params as object)));
  assert.match(cap.lines.join("\n"), /Updated Page_DM\/pg_1/);
});

test("update by technical id resolves the docRef directly (no ResolveBySlug)", async () => {
  const { ctx, calls } = ctxWith({ [OP_MODIFY]: undefined });
  await runEntity(ctx, "page", "update", ["pg_01HXYZ", "--field", "Body=x"]);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].method, OP_MODIFY);
  assert.equal((calls[0].params as { docRef: string }).docRef, "Page_DM/pg_01HXYZ");
});

test("update without a ref is a usage error (exit 2)", async () => {
  const { ctx } = ctxWith();
  const code = await runEntity(ctx, "page", "update", ["--field", "Title=x"]);
  assert.equal(code, 2);
});

// ---------------------------------------------------------------------------
// delete -> DELETE_DOCUMENT { docRef }
// ---------------------------------------------------------------------------

test("delete resolves a slug then builds DELETE_DOCUMENT", async () => {
  const { ctx, calls, cap } = ctxWith({
    ResolveBySlug: { type: "person", id: "en_2" },
    [OP_DELETE]: {},
  });
  const code = await runEntity(ctx, "person", "delete", ["person:till_gartner"]);
  assert.equal(code, 0);
  assert.equal(calls[1].method, OP_DELETE);
  assert.deepEqual(calls[1].params, { docRef: "Person_DM/en_2" });
  assert.match(cap.lines.join("\n"), /Deleted person:till_gartner/);
});

test("delete without a ref is a usage error (exit 2)", async () => {
  const { ctx } = ctxWith();
  const code = await runEntity(ctx, "person", "delete", []);
  assert.equal(code, 2);
});

// ---------------------------------------------------------------------------
// list -> QUERY { query: { targetDocumentModel, projectionName, paging } }
// ---------------------------------------------------------------------------

test("list builds a nested QUERY spec for the type's model", async () => {
  const { ctx, calls } = ctxWith({
    [OP_QUERY]: { content: [{ slug: "page:a", id: "1" }] },
  });
  await runEntity(ctx, "page", "list", []);
  assert.equal(calls[0].method, OP_QUERY);
  assert.deepEqual(calls[0].params, {
    query: {
      targetDocumentModel: "Page_DM",
      projectionName: "document",
      paging: { pageSize: 100, pageNumber: 0 },
    },
  });
});

test("list prints rows from a PagedResultSet { content }", async () => {
  const { ctx, cap } = ctxWith({
    [OP_QUERY]: {
      content: [
        { slug: "page:a", id: "1" },
        { slug: "page:b", id: "2" },
      ],
    },
  });
  await runEntity(ctx, "page", "list", []);
  assert.deepEqual(cap.lines, ["page:a\t1", "page:b\t2"]);
});

test("list tolerates a bare-array result and an empty result", async () => {
  const arr = ctxWith({ [OP_QUERY]: [{ slug: "page:a", id: "1" }] });
  await runEntity(arr.ctx, "page", "list", []);
  assert.deepEqual(arr.cap.lines, ["page:a\t1"]);

  const empty = ctxWith({ [OP_QUERY]: { content: [] } });
  await runEntity(empty.ctx, "page", "list", []);
  assert.deepEqual(empty.cap.lines, []);
});

// ---------------------------------------------------------------------------
// search (within entity) + unknown subcommand
// ---------------------------------------------------------------------------

test("entity search builds UnifiedSearch filtered by type", async () => {
  const { ctx, calls } = ctxWith({ [OP_UNIFIED_SEARCH]: [] });
  await runEntity(ctx, "person", "search", ["einstein"]);
  assert.equal(calls[0].method, OP_UNIFIED_SEARCH);
  assert.deepEqual(calls[0].params, { query: "einstein", type: "person" });
});

test("entity search with no query is a usage error (exit 2)", async () => {
  const { ctx } = ctxWith({ [OP_UNIFIED_SEARCH]: [] });
  const code = await runEntity(ctx, "person", "search", []);
  assert.equal(code, 2);
});

test("unknown subcommand errors (exit 2)", async () => {
  const { ctx, cap } = ctxWith();
  const code = await runEntity(ctx, "page", "frobnicate", []);
  assert.equal(code, 2);
  assert.match(cap.errors.join("\n"), /unknown subcommand "frobnicate"/);
});

// ---------------------------------------------------------------------------
// page sugar == entity --type page
// ---------------------------------------------------------------------------

test("page sugar -> entity --type page (same ADD_DOCUMENT request)", async () => {
  const { ctx, calls } = ctxWith({ [OP_CREATE]: { docRef: "Page_DM/pg_1" } });
  await runPage(ctx, "create", ["--field", "Title=X"]);
  assert.equal(calls[0].method, OP_CREATE);
  assert.equal(
    (calls[0].params as { documentModelName: string }).documentModelName,
    "Page_DM",
  );
});
