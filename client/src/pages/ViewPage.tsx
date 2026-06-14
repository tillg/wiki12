import { useEffect, useState } from "react";
import type { ReactElement } from "react";
import { Link, useParams } from "react-router-dom";
import { readByRef, type ContentItem } from "../api/content";
import { Banner } from "../components/Ui";
import { ContentDetailView } from "../components/ContentDetailView";

// The standalone /view/:ref route: fetch the item by ref, then delegate the whole
// read-only render to ContentDetailView (the same component the Browse detail pane
// uses), so a deep-linked view and the split-pane detail render identically.
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
    <div>
      <div style={{ marginBottom: "0.75rem" }}>
        <Link to={`/edit/${encodeURIComponent(item.slug || item.id)}`}>Edit</Link>
      </div>
      <ContentDetailView item={item} />
    </div>
  );
}
