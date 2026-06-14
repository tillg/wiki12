// Browse landing ('/') — the A12 Managed Master-Detail gallery.
//   master view = live filter field + responsive CardGrid of ContentCards
//   detail view = read-only ContentDetailView for the selected item, with the
//                 widget's native full-size toggle and responsive single-view.
// List-all + recency sort + in-memory live filter live in api/search.ts.

import { useEffect, useState } from "react";
import type { ReactElement } from "react";
import { ManagedMasterDetail } from "@com.mgmtp.a12.widgets/widgets-core/lib/layout/master-detail";
import type { ContentProps } from "@com.mgmtp.a12.widgets/widgets-core/lib/layout/master-detail";
import { filterCards, listAllContent, type ContentCardData } from "../api/search";
import { readByRef, type ContentItem } from "../api/content";
import { ContentCard } from "../components/ContentCard";
import { CardGrid } from "../components/CardGrid";
import { ContentDetailView } from "../components/ContentDetailView";
import { Banner } from "../components/Ui";

/** Detail column: fetch the full document for the selected card and render it read-only. */
function DetailPane({ item, view }: { item: ContentCardData | null; view: ContentProps }): ReactElement {
  const [doc, setDoc] = useState<ContentItem | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!item) {
      setDoc(null);
      return;
    }
    let active = true;
    setDoc(null);
    setError(null);
    readByRef(item.id)
      .then((d) => active && setDoc(d))
      .catch((e) => active && setError(e instanceof Error ? e.message : String(e)));
    return () => {
      active = false;
    };
  }, [item]);

  if (!item) return <p style={{ color: "#888" }}>Select a card to read it here.</p>;

  return (
    <div>
      <div style={{ marginBottom: "0.5rem" }}>
        {/* VERIFY: onFullscreenToggled(index) expands THIS (detail) view to the full
            viewport per A12 Managed Master-Detail; confirm against a live browser. */}
        <button onClick={() => view.onFullscreenToggled(1)} style={{ fontSize: "0.8rem", cursor: "pointer" }}>
          {view.fullScreen ? "Exit full size" : "Full size"}
        </button>
      </div>
      {error && <Banner kind="error">{error}</Banner>}
      {!doc && !error && <p style={{ color: "#888" }}>Loading…</p>}
      {doc && <ContentDetailView item={doc} />}
    </div>
  );
}

export function BrowsePage(): ReactElement {
  const [cards, setCards] = useState<ContentCardData[]>([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<ContentCardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    listAllContent()
      .then((c) => active && setCards(c))
      .catch((e) => active && setError(e instanceof Error ? e.message : String(e)))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const shown = filterCards(cards, query);

  const views = [
    {
      label: "Browse",
      content: (view: ContentProps): ReactElement => (
        <div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by title or content…"
            aria-label="Filter content"
            style={{ width: "100%", padding: "0.45rem", marginBottom: "1rem", boxSizing: "border-box" }}
          />
          {error && <Banner kind="error">{error}</Banner>}
          {loading && <p style={{ color: "#666" }}>Loading…</p>}
          {!loading && !error && cards.length === 0 && (
            <p style={{ color: "#666" }}>No content yet. Create a page to get started.</p>
          )}
          {!loading && cards.length > 0 && shown.length === 0 && (
            <p style={{ color: "#666" }}>No items match “{query}”.</p>
          )}
          <CardGrid>
            {shown.map((item) => (
              <ContentCard
                key={item.slug || `${item.type}/${item.id}`}
                item={item}
                onOpen={(it) => {
                  setSelected(it);
                  view.onGoTo(1); // switch the master-detail to the detail column
                }}
              />
            ))}
          </CardGrid>
          {/* No silent caps (CLAUDE.md): the gallery lists up to 100 items per model. */}
          <p style={{ color: "#aaa", fontSize: "0.75rem", marginTop: "1rem" }}>
            Showing up to 100 items per type.
          </p>
        </div>
      ),
    },
    {
      label: "Detail",
      content: (view: ContentProps): ReactElement => <DetailPane item={selected} view={view} />,
    },
  ];

  return (
    <ManagedMasterDetail
      title="Content"
      views={views}
      columnCount={2}
      fullScreenable
    />
  );
}
