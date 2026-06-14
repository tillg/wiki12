// Read-only detail view for a content item — renders the WHOLE item (header, markdown
// body, generic scalar fields, CreatedOn, Changes log) as values, never a form, so
// there is no write path to leak (architecture.md §4). Reuses the envelope extractors
// and the ViewPage markdown render. Type-agnostic: works for any Page or Entity.

import type { ReactElement } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ContentItem } from "../api/content";
import { Chip } from "./Ui";
import { changesOf, createdOnOf, rootFields, titleOf } from "../lib/envelope";

// Keys shown elsewhere (header/body/CreatedOn/Changes) or hidden — excluded from the
// generic label→value field list.
const EXCLUDED_FIELDS = new Set([
  "Title",
  "Slug",
  "Body",
  "Description",
  "searchText",
  "Changes",
  "CreatedOn",
]);

/** Humanize a field key for a label: split camelCase/PascalCase into spaced words
 * ("FirstName" -> "First Name", "ReleaseYear" -> "Release Year"). */
function humanizeLabel(key: string): string {
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .trim();
}

/** The scalar (string/number/boolean) fields to render generically, excluding the
 * keys shown elsewhere and any null/empty/object/array values. */
function scalarRows(fields: Record<string, unknown>): { key: string; value: string }[] {
  const rows: { key: string; value: string }[] = [];
  for (const [key, value] of Object.entries(fields)) {
    if (EXCLUDED_FIELDS.has(key)) continue;
    if (value === null || value === undefined || value === "") continue;
    if (typeof value === "object") continue; // skip nested groups/arrays
    rows.push({ key, value: String(value) });
  }
  return rows;
}

export function ContentDetailView(props: { item: ContentItem }): ReactElement {
  const doc = props.item.document as Record<string, unknown>;
  const fields = rootFields(doc);
  const body = fields.Body ?? fields.Description;
  const markdown = typeof body === "string" && body ? body : "";
  const rows = scalarRows(fields);
  const createdOn = createdOnOf(doc);
  const changes = changesOf(doc);

  return (
    <article>
      <div style={{ marginBottom: "0.5rem" }}>
        <Chip tone="type">{props.item.type}</Chip>
      </div>
      <h2 style={{ marginTop: 0, marginBottom: "0.25rem" }}>{titleOf(doc, props.item.slug)}</h2>
      <div style={{ fontFamily: "monospace", color: "#888", fontSize: "0.85rem", marginBottom: "1rem" }}>
        {props.item.slug}
      </div>

      {markdown && <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>}

      {rows.length > 0 && (
        <section style={{ marginTop: "1.5rem", borderTop: "1px solid #eee", paddingTop: "1rem" }}>
          <dl style={{ margin: 0 }}>
            {rows.map((r) => (
              <div key={r.key} style={{ display: "flex", gap: "0.75rem", marginBottom: "0.4rem" }}>
                <dt style={{ minWidth: "8rem", color: "#555", fontWeight: 600 }}>{humanizeLabel(r.key)}</dt>
                <dd style={{ margin: 0 }}>{r.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {createdOn && (
        <div style={{ marginTop: "1rem", color: "#888", fontSize: "0.85rem" }}>Created {createdOn}</div>
      )}

      {changes.length > 0 && (
        <section style={{ marginTop: "2rem", borderTop: "1px solid #eee", paddingTop: "1rem" }}>
          <h3 style={{ fontSize: "1rem", color: "#555", marginTop: 0 }}>Changes</h3>
          <ul style={{ listStyle: "none", padding: 0, fontSize: "0.85rem", color: "#666" }}>
            {changes.map((c, i) => (
              <li key={i} style={{ marginBottom: "0.25rem" }}>
                <span style={{ fontFamily: "monospace", marginRight: "0.75rem" }}>{c.changedOn}</span>
                {c.summary}
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
