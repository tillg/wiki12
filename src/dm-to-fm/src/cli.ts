// CLI: generate a default Form Model from one or more Document Model JSON files.
//
//   node --experimental-strip-types src/dm-to-fm/src/cli.ts <DM.json…> [--out <dir>]
//
// Writes <X>_FM.json next to each input (or into --out dir). Verifies that every
// generated control resolves to a DM field.

import process from "node:process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { generateFormModel, unresolvedRefs } from "./generate.ts";
import type { DocumentModel } from "./types.ts";

// An explicit, hand-tuned form model (e.g. Page_FM) opts out of regeneration by
// carrying header annotation wiki12.formModel="explicit". Don't clobber it.
function isExplicit(path: string): boolean {
  try {
    const fm = JSON.parse(readFileSync(path, "utf8")) as { header?: { annotations?: { name: string; value: string }[] } };
    return (fm.header?.annotations ?? []).some((a) => a.name === "wiki12.formModel" && a.value === "explicit");
  } catch {
    return false;
  }
}

function main(argv: string[]): number {
  const args = argv.slice(2);
  let outDir: string | undefined;
  const inputs: string[] = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--out") { outDir = args[++i]; }
    else inputs.push(args[i]);
  }
  if (inputs.length === 0) {
    console.error("usage: cli.ts <DocumentModel.json…> [--out <dir>]");
    return 2;
  }

  let failures = 0;
  for (const input of inputs) {
    const dm = JSON.parse(readFileSync(input, "utf8")) as DocumentModel;
    if (dm.header?.modelType !== "document") {
      console.error(`✗ ${input}: not a document model (modelType=${dm.header?.modelType})`);
      failures++;
      continue;
    }
    const fm = generateFormModel(dm);
    const bad = unresolvedRefs(dm, fm);
    if (bad.length) {
      console.error(`✗ ${input}: unresolved control refs ${JSON.stringify(bad)}`);
      failures++;
      continue;
    }
    const dir = outDir ?? dirname(input);
    mkdirSync(dir, { recursive: true });
    const outPath = join(dir, `${fm.header.id}.json`);
    if (existsSync(outPath) && isExplicit(outPath)) {
      console.log(`• ${basename(input)} → ${outPath}  (kept explicit form model, not regenerated)`);
      continue;
    }
    writeFileSync(outPath, JSON.stringify(fm, null, 2) + "\n");
    const controls = fm.content.screens[0].screenElements
      .reduce((n, s) => n + s.screenElements.reduce((m, g) => m + g.row.length, 0), 0);
    console.log(`✓ ${basename(input)} → ${outPath}  (${fm.content.screens[0].screenElements.length} section(s), ${controls} control(s))`);
  }
  return failures ? 1 : 0;
}

process.exit(main(process.argv));
