// Slug derivation for the dry-run manifest.
//
// Authoritative slug (re)computation lives in the Data Service (ADR-0001) — the
// before-write listener derives + uniquifies on write. The migration runner does
// NOT own slugs; it only needs to PREDICT which instances would have their slug
// changed by a transform so it can surface the old->new manifest before writing
// (architecture.md §5, ADR-0003 "Dry-run surfaces the slug-change manifest").
//
// We mirror the listener's text-part rule (lowercase [a-z0-9_], '_' separator)
// over the model's key fields. The uniqueness suffix (_N) is the Data Service's
// stored state, not reproducible here, so the manifest reports the TEXT PART; a
// real run's final slugs come back from the Data Service. This is sufficient to
// show the operator the blast radius (which items rename) before committing.

import type { A12Document, DocumentModel } from "../types.ts";
import { typeOf } from "../registry.ts";

interface KeyField {
  order: number;
  name: string;
}
interface SlugSpec {
  type: string;
  namespace: string; // type name lowercased; "page" is the default namespace
  keyFields: KeyField[];
  slugFieldName?: string;
}

/** Extract the slug specification (key fields + slug field) from a DM. */
export function slugSpec(dm: DocumentModel): SlugSpec {
  const keyFields: KeyField[] = [];
  let slugFieldName: string | undefined;
  function visit(el: Record<string, unknown>): void {
    if (el.type === "Field") {
      const anns = (el.annotations as { name: string; value: string }[] | undefined) ?? [];
      const kf = anns.find((a) => a.name === "wiki12.keyField");
      if (kf) keyFields.push({ order: Number(kf.value), name: el.name as string });
      if (anns.some((a) => a.name === "wiki12.derived" && a.value === "slug")) {
        slugFieldName = el.name as string;
      }
    }
    const detail = el[el.type as string] as { elements?: Record<string, unknown>[] } | undefined;
    for (const child of detail?.elements ?? []) visit(child);
  }
  for (const rg of dm.content.modelRoot.rootGroups) visit(rg as Record<string, unknown>);
  keyFields.sort((a, b) => a.order - b.order);
  const type = typeOf(dm);
  return { type, namespace: type.toLowerCase(), keyFields, slugFieldName };
}

/** Slugify a single text part: lowercase, [a-z0-9_], '_' separator. */
export function slugifyPart(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

/**
 * Find a field value anywhere in the document by field name (the A12 payload is
 * model-rooted and nested; we search recursively for the leaf key). Returns the
 * first match as a string, or "" if absent.
 */
function findFieldValue(doc: A12Document, name: string): string {
  let found = "";
  function walk(node: unknown): void {
    if (found) return;
    if (node && typeof node === "object") {
      for (const [k, v] of Object.entries(node as Record<string, unknown>)) {
        if (k === name && (typeof v === "string" || typeof v === "number")) {
          found = String(v);
          return;
        }
        walk(v);
      }
    }
  }
  walk(doc);
  return found;
}

/** The derived slug text part for a document: `<namespace>:<key1_key2_…>`. */
export function deriveSlug(spec: SlugSpec, doc: A12Document): string {
  const parts = spec.keyFields.map((kf) => slugifyPart(findFieldValue(doc, kf.name))).filter(Boolean);
  return `${spec.namespace}:${parts.join("_")}`;
}

/** The slug currently stored on the document (the derived slug field), or "". */
export function currentSlug(spec: SlugSpec, doc: A12Document): string {
  if (!spec.slugFieldName) return "";
  return findFieldValue(doc, spec.slugFieldName);
}
