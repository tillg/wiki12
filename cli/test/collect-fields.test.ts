import { test } from "node:test";
import assert from "node:assert/strict";
import { collectFields } from "../src/format.ts";

test("collects repeated --field key=value pairs", () => {
  const f = collectFields(["create", "--field", "Title=Hello", "--field", "Body=World"]);
  assert.deepEqual(f, { Title: "Hello", Body: "World" });
});

test("trims leading/trailing whitespace (A12 formalePruefung rejects it)", () => {
  const f = collectFields(["--field", "Title=  Hello ", "--field", "Body=back* "]);
  assert.deepEqual(f, { Title: "Hello", Body: "back*" });
});

test("preserves interior whitespace", () => {
  const f = collectFields(["--field", "Body=line one\nline two"]);
  assert.equal(f.Body, "line one\nline two");
});

test("rejects --field without an = separator", () => {
  assert.throws(() => collectFields(["--field", "novalue"]), /expects key=value/);
});

test("splits on the first = so values may contain =", () => {
  const f = collectFields(["--field", "Body=a=b=c"]);
  assert.equal(f.Body, "a=b=c");
});

test("allows an empty value", () => {
  const f = collectFields(["--field", "Title="]);
  assert.deepEqual(f, { Title: "" });
});

test("a trailing --field with no value is ignored (not an error)", () => {
  const f = collectFields(["--field", "Title=Hello", "--field"]);
  assert.deepEqual(f, { Title: "Hello" });
});

test("a later --field for the same key wins", () => {
  const f = collectFields(["--field", "Title=First", "--field", "Title=Second"]);
  assert.equal(f.Title, "Second");
});

test("ignores non --field tokens", () => {
  const f = collectFields(["update", "page:x", "--field", "Title=Hi", "--type", "page"]);
  assert.deepEqual(f, { Title: "Hi" });
});
