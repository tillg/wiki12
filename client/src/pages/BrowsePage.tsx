// Browse landing ('/') — the content card gallery.
//   no selection  → a full-width, multi-column responsive CardGrid of ContentCards
//   card clicked  → the grid reflows and a read-only detail panel opens on the right
//   full size     → the detail takes the whole width (grid hidden)
// List-all + recency sort + in-memory live filter live in api/search.ts.
//
// NOTE: the spec named the A12 Managed Master-Detail widget, but it manages its own
// single "active view" and cannot show a full-width master with NO detail pane (and
// crashes when the views array changes length). The requested behaviour — full-width
// grid until a card is opened — is a small responsive flex split, hand-rolled here.

import { useEffect, useState } from "react";
import type { ReactElement } from "react";
import { filterCards, listAllContent, type ContentCardData } from "../api/search";
import { readByRef, type ContentItem } from "../api/content";
import { ContentCard } from "../components/ContentCard";
import { CardGrid } from "../components/CardGrid";
import { ContentDetailView } from "../components/ContentDetailView";
import { Banner } from "../components/Ui";

/** Detail panel: fetch the full document for the selected card and render it read-only. */
function DetailPanel({
  item,
  fullSize,
  onToggleFullSize,
  onClose,
}: {
  item: ContentCardData;
  fullSize: boolean;
  onToggleFullSize: () => void;
  onClose: () => void;
}): ReactElement {
  const [doc, setDoc] = useState<ContentItem | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

  return (
    <aside
      style={{
        flex: fullSize ? "1 1 100%" : "0 0 30rem",
        maxWidth: fullSize ? "none" : "40%",
        minWidth: 0,
        borderLeft: fullSize ? "none" : "1px solid #eee",
        paddingLeft: fullSize ? 0 : "1.25rem",
        position: "sticky",
        top: "1rem",
        alignSelf: "flex-start",
      }}
    >
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
        <button onClick={onClose} style={{ fontSize: "0.8rem", cursor: "pointer" }}>
          ← Close
        </button>
        <button onClick={onToggleFullSize} style={{ fontSize: "0.8rem", cursor: "pointer" }}>
          {fullSize ? "Split view" : "Full size"}
        </button>
      </div>
      {error && <Banner kind="error">{error}</Banner>}
      {!doc && !error && <p style={{ color: "#888" }}>Loading…</p>}
      {doc && <ContentDetailView item={doc} />}
    </aside>
  );
}

export function BrowsePage(): ReactElement {
  const [cards, setCards] = useState<ContentCardData[]>([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<ContentCardData | null>(null);
  const [fullSize, setFullSize] = useState(false);
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
  const showMaster = !(selected && fullSize);

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Content</h2>
      <div style={{ display: "flex", gap: "1.25rem", alignItems: "flex-start" }}>
        {showMaster && (
          <div style={{ flex: 1, minWidth: 0 }}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter by title or content…"
              aria-label="Filter content"
              style={{ width: "100%", maxWidth: "32rem", padding: "0.45rem", marginBottom: "1rem", boxSizing: "border-box" }}
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
                <ContentCard key={item.slug || `${item.type}/${item.id}`} item={item} onOpen={setSelected} />
              ))}
            </CardGrid>
            {/* No silent caps (CLAUDE.md): the gallery lists up to 100 items per model. */}
            <p style={{ color: "#aaa", fontSize: "0.75rem", marginTop: "1rem" }}>Showing up to 100 items per type.</p>
          </div>
        )}
        {selected && (
          <DetailPanel
            item={selected}
            fullSize={fullSize}
            onToggleFullSize={() => setFullSize((f) => !f)}
            onClose={() => {
              setSelected(null);
              setFullSize(false);
            }}
          />
        )}
      </div>
    </div>
  );
}
