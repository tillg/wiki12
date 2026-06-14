import { useEffect, useState } from "react";
import type { ReactElement } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { readByRef, type ContentItem } from "../api/content";
import { Chip, Banner } from "../components/Ui";
import { changesOf, createdOnOf, rootFields, titleOf } from "../lib/envelope";

function bodyMarkdown(item: ContentItem): string {
  const f = rootFields(item.document as Record<string, unknown>);
  return String(f.Body ?? f.Description ?? "");
}

export function ViewPage(): ReactElement {
  const { ref = "" } = useParams();
  const [item, setItem] = useState<ContentItem | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setItem(null);
    setError(null);
    readByRef(decodeURIComponent(ref))
      .then((it) => active && setItem(it))
      .catch((e) => active && setError(e instanceof Error ? e.message : String(e)));
    return () => {
      active = false;
    };
  }, [ref]);

  if (error) return <Banner kind="error">{error}</Banner>;
  if (!item) return <p>Loading…</p>;

  const doc = item.document as Record<string, unknown>;
  const createdOn = createdOnOf(doc);
  const changes = changesOf(doc);

  return (
    <article>
      <div style={{ marginBottom: "0.5rem" }}>
        <Chip tone="type">{item.type}</Chip>
        <span style={{ fontFamily: "monospace", color: "#888", fontSize: "0.85rem" }}>{item.slug}</span>
      </div>
      <h1 style={{ marginTop: 0 }}>{titleOf(doc, item.slug)}</h1>
      <div style={{ marginBottom: "1rem", color: "#888", fontSize: "0.85rem" }}>
        {createdOn && <span>Created {createdOn}</span>}
        <span style={{ marginLeft: createdOn ? "1rem" : 0 }}>
          <Link to={`/edit/${encodeURIComponent(item.slug || item.id)}`}>Edit</Link>
        </span>
      </div>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{bodyMarkdown(item)}</ReactMarkdown>
      {changes.length > 0 && (
        <section style={{ marginTop: "2rem", borderTop: "1px solid #eee", paddingTop: "1rem" }}>
          <h2 style={{ fontSize: "1rem", color: "#555" }}>Changes</h2>
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
