// Deployed-model registry + the upload gate (ADR-0003).
//
// Two distinct notions of "version" exist:
//   - A12 `header.modelVersion` ("28.4.0") = the A12 model-FORMAT version.
//   - wiki12 content-schema version (integer 1, 2, 3 …) = what migrations step
//     between and what `POST /migrate {from,to}` and the gate operate on.
//
// The content-schema version is carried in a header annotation
// `wiki12.version` (default 1 if absent). The gate: a deploy whose content
// version is GREATER than the currently-deployed version is rejected unless a
// matching `Migration(targetModel, fromVersion=current, toVersion=new)` ships
// with it (architecture.md §5, ADR-0003 "Bump is gated on the migration").

import type { DocumentModel, FormModel, Migration } from "./types.ts";

/** Read the wiki12 integer content-schema version from a DM header annotation. */
export function contentVersion(dm: DocumentModel): number {
  const ann = (dm.header.annotations ?? []).find((a) => a.name === "wiki12.version");
  if (!ann) return 1;
  const n = Number(ann.value);
  if (!Number.isInteger(n) || n < 1) {
    throw new Error(`invalid wiki12.version annotation: ${ann.value}`);
  }
  return n;
}

/** The content type name a model targets, e.g. "Person" from "Person_DM". */
export function typeOf(dm: DocumentModel): string {
  return dm.header.id.replace(/_DM$/, "");
}

export class GateError extends Error {}

interface Deployed {
  documentModel: DocumentModel;
  version: number;
  formModel: FormModel;
}

export class Registry {
  private models = new Map<string, Deployed>();
  /** keyed `<targetModel>:<from>-<to>` */
  private migrations = new Map<string, Migration>();

  /** Currently-deployed content version for a type, or 0 if never deployed. */
  deployedVersion(type: string): number {
    return this.models.get(type)?.version ?? 0;
  }

  getModel(type: string): Deployed | undefined {
    return this.models.get(type);
  }

  formModel(type: string): FormModel | undefined {
    return this.models.get(type)?.formModel;
  }

  setFormModel(type: string, fm: FormModel): void {
    const d = this.models.get(type);
    if (!d) throw new Error(`no deployed model for type ${type}`);
    d.formModel = fm;
  }

  listMigrations(): Migration[] {
    return [...this.migrations.values()];
  }
  getMigration(id: string): Migration | undefined {
    return this.migrations.get(id);
  }
  /** Lookup by the (targetModel, from, to) key. */
  findMigration(targetModel: string, from: number, to: number): Migration | undefined {
    return this.migrations.get(`${targetModel}:${from}-${to}`);
  }
  putMigration(m: Migration): Migration {
    const id = m.id || `${m.targetModel}:${m.fromVersion}-${m.toVersion}`;
    const stored: Migration = { ...m, id };
    this.migrations.set(id, stored);
    return stored;
  }

  /**
   * The upload GATE. Validates and (on accept) deploys the model, storing the
   * supplied/generated form model and any supplied migration. Throws GateError
   * on rejection. `generateFm` produces the default form model if none stored.
   */
  deploy(
    dm: DocumentModel,
    migration: Migration | undefined,
    generateFm: (dm: DocumentModel) => FormModel,
  ): { type: string; version: number; formModelGenerated: boolean } {
    const type = typeOf(dm);
    const newVersion = contentVersion(dm);
    const current = this.deployedVersion(type);

    if (newVersion > current && current > 0) {
      // A bump. Require a matching migration (current -> newVersion).
      if (!migration) {
        throw new GateError(
          `model ${type} v${current}->v${newVersion} rejected: a version bump requires a matching Migration`,
        );
      }
      if (
        migration.targetModel !== type ||
        migration.fromVersion !== current ||
        migration.toVersion !== newVersion
      ) {
        throw new GateError(
          `model ${type} v${current}->v${newVersion} rejected: migration ` +
            `(${migration.targetModel}, ${migration.fromVersion}->${migration.toVersion}) ` +
            `does not match the bump (${type}, ${current}->${newVersion})`,
        );
      }
    }
    if (newVersion < current) {
      throw new GateError(
        `model ${type} v${newVersion} rejected: cannot deploy a version below the deployed v${current}`,
      );
    }

    // Accept. Store the migration first (so it is queryable), then the model.
    if (migration) this.putMigration(migration);

    const existingFm = this.models.get(type)?.formModel;
    const formModel = existingFm ?? generateFm(dm);
    this.models.set(type, { documentModel: dm, version: newVersion, formModel });

    return { type, version: newVersion, formModelGenerated: !existingFm };
  }
}
