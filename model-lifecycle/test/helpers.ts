// Shared test fixtures.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import type { A12Document, DocumentModel, Migration } from "../src/types.ts";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, "..", "..");

/** The real Person document model from the repo. */
export function personDM(version = 1): DocumentModel {
  const dm = JSON.parse(
    readFileSync(join(repoRoot, "models", "document-models", "Person_DM.json"), "utf8"),
  ) as DocumentModel;
  // Stamp the wiki12 content-schema version (header annotation).
  dm.header.annotations = (dm.header.annotations ?? []).filter((a) => a.name !== "wiki12.version");
  if (version !== 1) dm.header.annotations.push({ name: "wiki12.version", value: String(version) });
  else dm.header.annotations.push({ name: "wiki12.version", value: "1" });
  return dm;
}

/** A Person DM with the standard envelope removed (CreatedOn, derived Title, Changes group). */
export function personDMNoEnvelope(version = 2): DocumentModel {
  const dm = personDM(version);
  type El = { type: string; annotations?: { name: string; value: string }[] };
  const root = dm.content.modelRoot.rootGroups[0] as unknown as { Group: { elements: El[] } };
  root.Group.elements = root.Group.elements.filter((e) => {
    const derived = e.annotations?.find((a) => a.name === "wiki12.derived")?.value;
    if (e.type === "Group" && derived === "changeLog") return false; // drop Changes group
    if (derived === "createdOn" || derived === "title") return false; // drop CreatedOn + derived Title
    return true;
  });
  return dm;
}

/** The envelope v1->v2 migration as a Migration content item (type-agnostic script). */
export function envelopeMigrationV1to2(targetModel = "Person"): Migration {
  const script = readFileSync(join(here, "..", "examples", "envelope_v1_to_v2.ts"), "utf8");
  return { id: `${targetModel}:1-2`, targetModel, fromVersion: 1, toVersion: 2, script };
}

/** The worked-example person v1->v2 migration as a Migration content item. */
export function personMigrationV1to2(): Migration {
  const script = readFileSync(join(here, "..", "examples", "person_v1_to_v2.ts"), "utf8");
  return {
    id: "Person:1-2",
    targetModel: "Person",
    fromVersion: 1,
    toVersion: 2,
    script,
  };
}

/** A v1 person document instance (model-rooted, with __meta). */
export function personDoc(opts: { id: string; first: string; last: string; slug?: string }): A12Document {
  return {
    __meta: { docRef: `Person_DM/${opts.id}`, modelVersion: 1 },
    Person: {
      FirstName: opts.first,
      LastName: opts.last,
      Slug: opts.slug ?? `person:${opts.first}_${opts.last}`.toLowerCase(),
    },
  };
}
