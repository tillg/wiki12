import { test } from "node:test";
import assert from "node:assert/strict";
import {
  docRef,
  looksLikeId,
  looksLikeSlug,
  normalizeSlug,
  resolveDocRef,
} from "../src/resolve.ts";
import { modelName, rootGroup } from "../src/model-name.ts";
import { RpcClient } from "../src/rpc.ts";
import { mockRpc } from "./helpers.ts";

test("model-name mapping capitalizes + _DM", () => {
  assert.equal(modelName("page"), "Page_DM");
  assert.equal(modelName("person"), "Person_DM");
  assert.equal(modelName("location"), "Location_DM");
});

test("slug grammar vs technical id", () => {
  assert.ok(looksLikeSlug("page:albert_einstein"));
  assert.ok(looksLikeSlug("till_gartner"));
  assert.ok(looksLikeSlug("person:till_gartner_2"));
  // Technical IDs carry uppercase / non-slug chars -> treated as IDs.
  assert.ok(looksLikeId("pg_01HXYZ"));
  assert.ok(looksLikeId("en_01H8ABC"));
  assert.equal(looksLikeSlug("pg_01HXYZ"), false);
});

test("bare name defaults to page namespace", () => {
  assert.equal(normalizeSlug("albert_einstein"), "page:albert_einstein");
  assert.equal(normalizeSlug("person:till_gartner"), "person:till_gartner");
});

test("docRef builds <Model>/<id>", () => {
  assert.equal(docRef("page", "abc"), "Page_DM/abc");
  assert.equal(docRef("person", "xyz"), "Person_DM/xyz");
});

test("resolveDocRef: an id is read directly (no ResolveBySlug call)", async () => {
  const { transport, calls } = mockRpc();
  const rpc = new RpcClient(transport);
  const ref = await resolveDocRef(rpc, "page", "pg_01HXYZ");
  assert.equal(ref, "Page_DM/pg_01HXYZ");
  assert.equal(calls.length, 0, "no ResolveBySlug for an id");
});

test("resolveDocRef: a slug dispatches ResolveBySlug with page default", async () => {
  const { transport, calls } = mockRpc({
    ResolveBySlug: { docRef: "Page_DM/pg_01HXYZ" },
  });
  const rpc = new RpcClient(transport);
  const ref = await resolveDocRef(rpc, "page", "albert_einstein");
  assert.equal(ref, "Page_DM/pg_01HXYZ");
  assert.equal(calls.length, 1);
  assert.equal(calls[0].method, "ResolveBySlug");
  // Server op param is `idOrSlug` (+ a model `type` to scope the slug query).
  assert.deepEqual(calls[0].params, {
    idOrSlug: "page:albert_einstein",
    type: "Page_DM",
  });
});

test("resolveDocRef: ResolveBySlug returning {type,id} is composed", async () => {
  const { transport } = mockRpc({
    ResolveBySlug: { type: "person", id: "en_9" },
  });
  const rpc = new RpcClient(transport);
  const ref = await resolveDocRef(rpc, "person", "person:till_gartner");
  assert.equal(ref, "Person_DM/en_9");
});

test("resolveDocRef: throws when ResolveBySlug yields neither docRef nor {type,id}", async () => {
  const { transport } = mockRpc({ ResolveBySlug: {} });
  const rpc = new RpcClient(transport);
  await assert.rejects(
    () => resolveDocRef(rpc, "page", "missing_slug"),
    /could not resolve slug "page:missing_slug"/,
  );
});

test("rootGroup is the capitalized type (group key for the document payload)", () => {
  assert.equal(rootGroup("page"), "Page");
  assert.equal(rootGroup("person"), "Person");
  assert.equal(rootGroup("location"), "Location");
});
