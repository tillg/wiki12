// Thin wrapper over the dm-to-fm form generator (read-only import).
// The model-lifecycle service generates+stores a default form model when a data
// model is deployed without an explicit one (architecture.md §2).

import { generateFormModel, unresolvedRefs } from "../../src/dm-to-fm/src/generate.ts";
import type { DocumentModel, FormModel } from "./types.ts";

export { generateFormModel, unresolvedRefs };

/**
 * Generate the default form model for a document model, asserting that every
 * generated control resolves to a DM field (the dm-to-fm CLI's safety check).
 */
export function generateDefaultFormModel(dm: DocumentModel): FormModel {
  const fm = generateFormModel(dm);
  const bad = unresolvedRefs(dm, fm);
  if (bad.length) {
    throw new Error(`form generation produced unresolved control refs: ${JSON.stringify(bad)}`);
  }
  return fm;
}
