// wiki12 seed runner.
//
// Creates the sample pages + entities in `content.json` by driving the REAL
// `wiki12` CLI (two-clients-one-contract: the seed uses the same path an
// operator would). Needs a running stack — point the CLI at it via
// WIKI12_DATA_SERVICE_URL / WIKI12_MODEL_LIFECYCLE_URL (see .env.example).
//
//   node --experimental-strip-types seed/seed.ts            # create sample content
//   node --experimental-strip-types seed/seed.ts --dry-run  # print the CLI calls only
//
// Slug + searchText are derived server-side, so we only send authored fields.

import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import process from "node:process";

const here = dirname(fileURLToPath(import.meta.url));
const CLI = join(here, "..", "cli", "src", "index.ts");
const dryRun = process.argv.includes("--dry-run");

interface Page { Title: string; Body: string }
interface Entity { type: string; fields: Record<string, string> }
interface Content { pages: Page[]; entities: Entity[] }

function fieldArgs(fields: Record<string, string>): string[] {
  return Object.entries(fields).flatMap(([k, v]) => ["--field", `${k}=${v}`]);
}

function runCli(args: string[]): void {
  const printable = ["wiki12", ...args]
    .map((a) => (/\s/.test(a) ? JSON.stringify(a) : a))
    .join(" ");
  if (dryRun) { console.log(printable); return; }
  console.log(`+ ${printable}`);
  const r = spawnSync("node", ["--experimental-strip-types", CLI, ...args], {
    stdio: "inherit",
    env: process.env,
  });
  if (r.status !== 0) {
    console.error(`seed: command failed (exit ${r.status}): ${printable}`);
    process.exit(r.status ?? 1);
  }
}

function main(): void {
  const content: Content = JSON.parse(
    readFileSync(join(here, "content.json"), "utf8"),
  );

  console.log(`Seeding ${content.pages.length} pages and ${content.entities.length} entities` +
    (dryRun ? " (dry run)" : "") + "...\n");

  for (const p of content.pages) {
    runCli(["page", "create", ...fieldArgs({ Title: p.Title, Body: p.Body })]);
  }
  for (const e of content.entities) {
    runCli(["entity", "create", "--type", e.type, ...fieldArgs(e.fields)]);
  }

  console.log("\nSeed complete. Try: wiki12 search einstein");
}

main();
