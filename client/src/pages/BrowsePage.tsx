// Browse landing ('/') — the content card gallery.
//   no selection  → a full-width, multi-column responsive CardGrid of ContentCards
//   card clicked  → the grid reflows and a read-only detail panel opens on the right
//                   (a transient in-page selection — the URL stays '/')
//   full size     → navigates to the deep link /view/<slug>, the bookmarkable
//                   standalone view (slug-based-urls §4)
// Browse is a pure list-all gallery — searching is the header search box's job
// (live /search?q=). List-all + recency sort live in api/search.ts.
//
// NOTE: the spec named the A12 Managed Master-Detail widget, but it manages its own
// single "active view" and cannot show a full-width master with NO detail pane (and
// crashes when the views array changes length). The requested behaviour — full-width
// grid until a card is opened — is a small responsive flex split, hand-rolled here.

import { useEffect, useState } from "react";
import type { ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import { listAllContent, type ContentCardData } from "../api/search";
import { readByRef, type ContentItem } from "../api/content";
import { ContentCard } from "../components/ContentCard";
import { CardGrid } from "../components/CardGrid";
import { ContentDetailView } from "../components/ContentDetailView";
import { Banner } from "../components/Ui";
import { refSegment } from "../lib/refUrl";
import { Button } from "@com.mgmtp.a12.widgets/widgets-core/lib/button";
import { Icon } from "@com.mgmtp.a12.widgets/widgets-core/lib/icon";

/** Detail panel: fetch the full document for the selected card and render it
 *  read-only in the split pane. This is a transient in-page selection — the URL
 *  stays '/'. "Full size" navigates to the deep-linkable standalone /view/<slug>. */
function DetailPanel({
  item,
  onClose,
}: {
  item: ContentCardData;
  onClose: () => void;
}): ReactElement {
  const [doc, setDoc] = useState<ContentItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  // The document read surfaces the real Slug; prefer it for the deep links, falling
  // back to the docRef the card carries until the server derives the Slug.
  const ref = refSegment((doc?.slug || item.slug) || item.id);

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
        flex: "0 0 30rem",
        maxWidth: "40%",
        minWidth: 0,
        borderLeft: "1px solid #eee",
        paddingLeft: "1.25rem",
        position: "sticky",
        top: "1rem",
        alignSelf: "flex-start",
      }}
    >
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem", alignItems: "center" }}>
        <Button icon={<Icon>close</Icon>} secondary title="Close" onClick={onClose} />
        <Button
          icon={<Icon>edit</Icon>}
          secondary
          title="Edit"
          onClick={() => navigate(`/edit/${ref}`)}
        />
        <Button
          icon={<Icon>fullscreen</Icon>}
          secondary
          title="Full size"
          onClick={() => navigate(`/view/${ref}`)}
        />
      </div>
      {error && <Banner kind="error">{error}</Banner>}
      {!doc && !error && <p style={{ color: "#888" }}>Loading…</p>}
      {doc && <ContentDetailView item={doc} />}
    </aside>
  );
}

export function BrowsePage(): ReactElement {
  const [cards, setCards] = useState<ContentCardData[]>([]);
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

  // Browse is a pure list-all gallery; searching is the header's job (live /search).
  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Content</h2>
      <div style={{ display: "flex", gap: "1.25rem", alignItems: "flex-start" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
            {error && <Banner kind="error">{error}</Banner>}
            {loading && <p style={{ color: "#666" }}>Loading…</p>}
            {!loading && !error && cards.length === 0 && (
              <p style={{ color: "#666" }}>No content yet. Create a page to get started.</p>
            )}
            <CardGrid>
              {cards.map((item) => (
                <ContentCard key={item.slug || `${item.type}/${item.id}`} item={item} onOpen={setSelected} />
              ))}
            </CardGrid>
            {/* No silent caps (CLAUDE.md): the gallery lists up to 100 items per model. */}
            <p style={{ color: "#aaa", fontSize: "0.75rem", marginTop: "1rem" }}>Showing up to 100 items per type.</p>
          </div>
        {selected && <DetailPanel item={selected} onClose={() => setSelected(null)} />}
      </div>
    </div>
  );
}
