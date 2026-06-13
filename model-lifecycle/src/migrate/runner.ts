// Migration runner: transpile (TS->JS) + sandbox-run a stored Migration's
// per-document transform across all instances of a type, with dry-run and
// reporting (architecture.md §5, ADR-0003).
//
// The migration script contract: it default-exports OR exports `migrate` a pure
// function `(doc) => doc` transforming ONE document from vN to vN+1. The runner
// owns iteration, IO, dry-run, slug-manifest reporting.

import { transformSync } from "esbuild";
import type {
  A12Document,
  DocumentModel,
  Migration,
  MigrateFailure,
  MigrateReport,
  SlugChange,
} from "../types.ts";
import type { DataService } from "../dataservice.ts";
import { getSandbox } from "./sandbox.ts";
import { currentSlug, deriveSlug, slugSpec } from "./slug.ts";

/**
 * Transpile a migration's TS source to a JS body that assigns the transform to
 * a global `__migrate`. Accepts either `export default fn` or `export function
 * migrate`/`export const migrate`. esbuild's `transformSync` with loader 'ts'
 * strips types; we then bridge ESM exports onto `__migrate`.
 */
export function transpile(script: string): string {
  const { code } = transformSync(script, {
    loader: "ts",
    format: "cjs", // emit `exports.x = …` / `module.exports` we can read
    target: "es2022",
  });
  // Provide a CommonJS shim (`exports`/`module`) the emitted code writes into,
  // then pick the transform off it. No real `require` is exposed.
  return `
    var module = { exports: {} };
    var exports = module.exports;
    (function(module, exports){
      ${code}
    })(module, exports);
    var __mig = module.exports;
    var __migrate = (typeof __mig === "function")
      ? __mig
      : (__mig && (__mig.default || __mig.migrate));
    if (typeof __migrate !== "function") {
      throw new Error("migration script must default-export or export 'migrate' a function");
    }
  `;
}

export interface RunResult {
  report: MigrateReport;
  /** Documents the transform produced (parallel to inputs that succeeded). */
  upgraded: A12Document[];
}

/**
 * Run `migration` over every instance of its target type at version `from`.
 * Transforms each doc in the sandbox, predicts slug changes, and (unless
 * dryRun) writes upgraded docs back via the Data Service.
 */
export async function runMigration(opts: {
  migration: Migration;
  documentModel: DocumentModel;
  dataService: DataService;
  dryRun: boolean;
}): Promise<RunResult> {
  const { migration, documentModel, dataService, dryRun } = opts;
  const sandbox = await getSandbox();
  const compiled = transpile(migration.script);
  const spec = slugSpec(documentModel);

  // A12 addresses instances by the DM model id (e.g. "Person_DM"), while a
  // Migration's targetModel is the type name ("Person"). Query by the model id.
  const modelId = documentModel.header.id;
  const instances = await dataService.fetchInstances(modelId, migration.fromVersion);

  const failures: MigrateFailure[] = [];
  const slugManifest: SlugChange[] = [];
  const upgraded: A12Document[] = [];
  let migrated = 0;

  for (const doc of instances) {
    const id = doc.__meta?.docRef ?? "(unknown)";
    const res = await sandbox.run(compiled, doc);
    if (!res.ok) {
      failures.push({ id, error: res.error ?? "sandbox failure" });
      continue;
    }
    const newDoc = res.value as A12Document;

    // Stamp the new content version into __meta so the written doc reports vN+1.
    newDoc.__meta = { ...(newDoc.__meta ?? {}), modelVersion: migration.toVersion };

    // Predict slug change for the manifest.
    const oldSlug = currentSlug(spec, doc);
    const newSlug = deriveSlug(spec, newDoc);
    if (oldSlug && newSlug && oldSlug !== newSlug) {
      slugManifest.push({ id, oldSlug, newSlug });
    }

    upgraded.push(newDoc);
    if (!dryRun) {
      try {
        await dataService.writeDocument(newDoc);
        migrated++;
      } catch (e) {
        failures.push({ id, error: e instanceof Error ? e.message : String(e) });
      }
    } else {
      migrated++; // "would migrate"
    }
  }

  const report: MigrateReport = {
    count: instances.length,
    migrated,
    failures,
    slugManifest,
  };
  return { report, upgraded };
}
