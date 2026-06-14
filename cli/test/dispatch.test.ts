// End-to-end dispatch tests through run(). These do NOT mock the transport
// (run() wires fetch), so they only exercise paths that return before any
// network call: help output and arg-validation errors.

import { test } from "node:test";
import assert from "node:assert/strict";
import { run } from "../src/index.ts";

function captureConsole() {
  const out: string[] = [];
  const err: string[] = [];
  const origLog = console.log;
  const origErr = console.error;
  console.log = (m?: unknown) => out.push(String(m));
  console.error = (m?: unknown) => err.push(String(m));
  return {
    out,
    err,
    restore: () => {
      console.log = origLog;
      console.error = origErr;
    },
  };
}

test("no command prints top-level help (exit 2)", async () => {
  const c = captureConsole();
  const code = await run([]);
  c.restore();
  assert.equal(code, 2);
  assert.match(c.out.join("\n"), /wiki12 — A12 wiki CLI/);
});

test("-h prints top-level help (exit 0)", async () => {
  const c = captureConsole();
  const code = await run(["-h"]);
  c.restore();
  assert.equal(code, 0);
  assert.match(c.out.join("\n"), /Usage:/);
});

test("per-command help: page -h", async () => {
  const c = captureConsole();
  const code = await run(["page", "-h"]);
  c.restore();
  assert.equal(code, 0);
  assert.match(c.out.join("\n"), /[Ss]ugar for "wiki12 entity --type page/);
});

test("per-command help: migrate -h", async () => {
  const c = captureConsole();
  const code = await run(["migrate", "-h"]);
  c.restore();
  assert.equal(code, 0);
  assert.match(c.out.join("\n"), /--dry-run/);
});

test("entity without --type errors (exit 2)", async () => {
  const c = captureConsole();
  const code = await run(["entity", "read", "person:x"]);
  c.restore();
  assert.equal(code, 2);
  assert.match(c.err.join("\n"), /requires --type/);
});

test("unknown command errors (exit 2)", async () => {
  const c = captureConsole();
  const code = await run(["frobnicate"]);
  c.restore();
  assert.equal(code, 2);
  assert.match(c.err.join("\n"), /unknown command "frobnicate"/);
});

// The following all return before any network call (no-subcommand / usage errors),
// so they are safe to drive through run() which wires the real fetch transports.

test("page with no subcommand prints help (exit 2)", async () => {
  const c = captureConsole();
  const code = await run(["page"]);
  c.restore();
  assert.equal(code, 2);
});

test("model with no subcommand errors (exit 2)", async () => {
  const c = captureConsole();
  const code = await run(["model"]);
  c.restore();
  assert.equal(code, 2);
  assert.match(c.err.join("\n"), /unknown subcommand/);
});

test("form with no subcommand errors (exit 2)", async () => {
  const c = captureConsole();
  const code = await run(["form"]);
  c.restore();
  assert.equal(code, 2);
  assert.match(c.err.join("\n"), /unknown subcommand/);
});

test("search with no query is a usage error (exit 2)", async () => {
  const c = captureConsole();
  const code = await run(["search"]);
  c.restore();
  assert.equal(code, 2);
});

test("entity with --type but no subcommand errors (exit 2)", async () => {
  const c = captureConsole();
  const code = await run(["entity", "--type", "person"]);
  c.restore();
  assert.equal(code, 2);
});

test("per-command help: entity -h, model -h, form -h, search -h (exit 0)", async () => {
  for (const cmd of ["entity", "model", "form", "search"]) {
    const c = captureConsole();
    const code = await run([cmd, "-h"]);
    c.restore();
    assert.equal(code, 0, `${cmd} -h should exit 0`);
    assert.ok(c.out.join("\n").length > 0, `${cmd} -h should print help`);
  }
});
