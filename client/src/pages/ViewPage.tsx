import { useEffect, useState } from "react";
import type { ReactElement } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { readByRef, type ContentItem } from "../api/content";
import { Chip, Banner } from "../components/Ui";

function bodyMarkdown(item: ContentItem): string {
  // Body field by wiki12 convention is "Body"/"Description" (StringType markdown).
  const doc = item.document;
  return String(doc.Body ?? doc.Description ?? doc.body ?? doc.description ?? "");
}

function titleOf(item: ContentItem): string {
  const doc = item.document;
  return String(doc.Title ?? doc.title ?? item.slug);
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

  return (
    <article>
      <div style={{ marginBottom: "0.5rem" }}>
        <Chip tone="type">{item.type}</Chip>
        <span style={{ fontFamily: "monospace", color: "#888", fontSize: "0.85rem" }}>{item.slug}</span>
      </div>
      <h1 style={{ marginTop: 0 }}>{titleOf(item)}</h1>
      <div style={{ marginBottom: "1rem" }}>
        <Link to={`/edit/${encodeURIComponent(item.slug || item.id)}`}>Edit</Link>
      </div>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{bodyMarkdown(item)}</ReactMarkdown>
    </article>
  );
}
