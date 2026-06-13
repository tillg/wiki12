// `wiki12 migrate <type> --from <v> --to <v> [--dry-run]`
//
// Asks the model-lifecycle service to run a stored migration.
//   POST /migrate { type, from, to, dryRun } -> report (incl. slug manifest)
//
// --dry-run reports without writing, including the full old->new slug manifest.

import { parseArgs } from "../args.ts";
import { HELP } from "../help.ts";
import type { LifecycleContext } from "./model.ts";

interface SlugManifestEntry {
  id?: string;
  from: string;
  to: string;
}

interface MigrationReport {
  migrated?: number;
  failed?: number;
  dryRun?: boolean;
  slugManifest?: SlugManifestEntry[];
  [k: string]: unknown;
}

export async function runMigrate(
  ctx: LifecycleContext,
  rest: string[],
): Promise<number> {
  const { lifecycle, out, err } = ctx;
  const parsed = parseArgs(rest, ["dry-run"]);
  const type = parsed.positionals[0];
  const from = parsed.flags.from;
  const to = parsed.flags.to;
  const dryRun = parsed.switches.has("dry-run");

  if (!type || !from || !to) {
    err(HELP.migrate);
    return 2;
  }

  const report = await lifecycle.send<MigrationReport>("POST", "/migrate", {
    type,
    from,
    to,
    dryRun,
  });

  out(
    `${dryRun ? "[dry-run] " : ""}migrate ${type} ${from} -> ${to}: ` +
      `${report.migrated ?? 0} migrated, ${report.failed ?? 0} failed`,
  );

  if (report.slugManifest && report.slugManifest.length) {
    out(`Slug changes (${report.slugManifest.length}):`);
    for (const e of report.slugManifest) {
      out(`  ${e.from} -> ${e.to}${e.id ? `  (id ${e.id})` : ""}`);
    }
  }

  return report.failed && report.failed > 0 ? 1 : 0;
}
