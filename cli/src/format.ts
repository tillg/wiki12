// Output formatting helpers.

import type { SearchHit, WriteResult } from "./types.ts";

// Parse repeated --field k=v flags into a fields object. Because the tiny arg
// parser keeps only the last value per flag name, fields are passed as
// "--field key=value" and collected from the raw argv instead.
export function collectFields(argv: string[]): Record<string, string> {
  const fields: Record<string, string> = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--field") {
      const kv = argv[++i];
      if (kv === undefined) continue;
      const eq = kv.indexOf("=");
      if (eq === -1) throw new Error(`--field expects key=value, got "${kv}"`);
      // Trim leading/trailing whitespace: the A12 kernel's formal check rejects it
      // (fuehrendesBlank / nachfolgendesBlank), rolling back ADD/MODIFY_DOCUMENT.
      fields[kv.slice(0, eq)] = kv.slice(eq + 1).trim();
    }
  }
  return fields;
}

// A write response may carry old -> new slug; surface it clearly.
export function slugChangeMessage(result: WriteResult): string | undefined {
  if (!result.slugChange) return undefined;
  const { from, to } = result.slugChange;
  if (from === to) return undefined;
  return `Slug changed: ${from} -> ${to}  (the old slug now 404s)`;
}

export function formatHit(hit: SearchHit): string {
  const title = hit.title || "(untitled)";
  const snippet = hit.snippet ? `  ${hit.snippet}` : "";
  return `[${hit.kind}:${hit.type}] ${hit.slug}  ${title}${snippet}`;
}

// ---- read output: ALWAYS the A12 document, as JSON -------------------------
// The CLI's data format for a content read is the A12 document itself (never a
// human-formatted view). GET_DOCUMENT returns { document: <A12 doc> }; we unwrap
// to the document so the CLI emits the A12 document verbatim — including the
// standard envelope fields (Title, Slug, CreatedOn, the Changes log) the Data
// Service derives. Scriptable and round-trippable.
export function a12Document(item: unknown): unknown {
  if (item && typeof item === "object" && "document" in item) {
    return (item as { document: unknown }).document;
  }
  return item;
}

export function formatDocument(item: unknown): string {
  return JSON.stringify(a12Document(item), null, 2);
}
