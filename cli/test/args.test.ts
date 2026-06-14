import { test } from "node:test";
import assert from "node:assert/strict";
import { parseArgs } from "../src/args.ts";

test("parses positionals and value flags", () => {
  const p = parseArgs(["read", "page:foo", "--type", "person"]);
  assert.deepEqual(p.positionals, ["read", "page:foo"]);
  assert.equal(p.flags.type, "person");
  assert.equal(p.help, false);
});

test("detects -h and --help", () => {
  assert.equal(parseArgs(["read", "-h"]).help, true);
  assert.equal(parseArgs(["--help"]).help, true);
});

test("boolean switches take no value", () => {
  const p = parseArgs(["person", "--from", "1", "--to", "2", "--dry-run"], [
    "dry-run",
  ]);
  assert.equal(p.flags.from, "1");
  assert.equal(p.flags.to, "2");
  assert.ok(p.switches.has("dry-run"));
});

test("a value flag with no following value becomes a switch", () => {
  const p = parseArgs(["--type"]);
  assert.equal(p.flags.type, undefined);
  assert.ok(p.switches.has("type"));
});

test("empty argv yields empty results", () => {
  const p = parseArgs([]);
  assert.deepEqual(p.positionals, []);
  assert.deepEqual(p.flags, {});
  assert.equal(p.switches.size, 0);
  assert.equal(p.help, false);
});

test("a value flag immediately followed by another flag becomes a switch", () => {
  // --type has no value because the next token starts with "--".
  const p = parseArgs(["--type", "--kind", "page"]);
  assert.ok(p.switches.has("type"));
  assert.equal(p.flags.kind, "page");
});

test("a repeated value flag keeps the last value", () => {
  const p = parseArgs(["--type", "page", "--type", "person"]);
  assert.equal(p.flags.type, "person");
});

test("-h anywhere sets help while still parsing the rest", () => {
  const p = parseArgs(["read", "page:x", "-h", "--type", "person"]);
  assert.equal(p.help, true);
  assert.deepEqual(p.positionals, ["read", "page:x"]);
  assert.equal(p.flags.type, "person");
});

test("a flag is only treated as boolean when declared in booleanFlags", () => {
  // Without declaring "dry-run", it would consume the next token as its value.
  const p = parseArgs(["--dry-run", "person"]);
  assert.equal(p.flags["dry-run"], "person");
  const q = parseArgs(["--dry-run", "person"], ["dry-run"]);
  assert.ok(q.switches.has("dry-run"));
  assert.deepEqual(q.positionals, ["person"]);
});
