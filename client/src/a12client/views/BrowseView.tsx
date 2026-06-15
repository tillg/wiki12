// Browse landing — a custom A12 Client view (registered as "BrowseView"). Browse
// is a pure list-all card gallery (searching is the header's job), so it does its
// own data fetch via the existing api/search.ts helpers rather than a model-driven
// engine. Clicking a card navigates to the standalone /view/<slug>.
import { useEffect, useState } from "react";
import type { ReactElement } from "react";
import { useStore } from "react-redux";

import { listAllContent, type ContentCardData } from "../../api/search";
import { CardGrid } from "../../components/CardGrid";
import { ContentCard } from "../../components/ContentCard";
import { Banner } from "../../components/Ui";
import { navigate, viewUrl, type Store } from "../routing";

export function BrowseView(): ReactElement {
  const store = useStore() as unknown as Store;
  const [cards, setCards] = useState<ContentCardData[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setCards(null);
    setError(null);
    listAllContent()
      .then((c) => active && setCards(c))
      .catch((e) => active && setError(e instanceof Error ? e.message : String(e)));
    return () => {
      active = false;
    };
  }, []);

  if (error) return <Banner kind="error">{error}</Banner>;
  if (cards === null) return <div style={{ padding: "1rem" }}>Loading…</div>;
  if (cards.length === 0) {
    return <Banner kind="info">No content yet. Create a page to get started.</Banner>;
  }

  return (
    <div style={{ padding: "1rem" }}>
      <CardGrid>
        {cards.map((item) => (
          <ContentCard
            key={`${item.type}/${item.id}`}
            item={item}
            onOpen={(c) => navigate(store, viewUrl(c.slug || c.id))}
          />
        ))}
      </CardGrid>
    </div>
  );
}
