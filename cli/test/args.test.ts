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
