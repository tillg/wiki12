// Search screen — a custom A12 Client view (registered as "SearchView"). Reads
// q/type from the URL (kept in sync by routing.ts), fans out via unifiedSearch, and
// renders the same ContentCards as Browse. ≥3-char guard + live behaviour carry
// over from the prior client. A result click opens the standalone /view/<slug>.
import { useEffect, useState } from "react";
import type { ReactElement } from "react";
import { useStore } from "react-redux";

import {
  CONTENT_MODELS,
  isSearchable,
  MIN_SEARCH_LENGTH,
  unifiedSearch,
  type SearchHit,
} from "../../api/search";
import { CardGrid } from "../../components/CardGrid";
import { ContentCard } from "../../components/ContentCard";
import { Banner } from "../../components/Ui";
import { navigate, viewUrl, type Store } from "../routing";

export function SearchView(): ReactElement {
  const store = useStore() as unknown as Store;
  // The URL is the source of truth (routing keeps it in sync with the activity).
  const params = new URLSearchParams(window.location.search);
  const q = (params.get("q") ?? "").trim();
  const rawType = params.get("type") ?? "";
  const type = CONTENT_MODELS.some((m) => m.type === rawType) ? rawType : undefined;

  const [hits, setHits] = useState<SearchHit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSearchable(q)) {
      setHits([]);
      setError(null);
      return;
    }
    let active = true;
    setLoading(true);
    setError(null);
    unifiedSearch({ query: q, type })
      .then((r) => active && setHits(r))
      .catch((e) => active && setError(e instanceof Error ? e.message : String(e)))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [q, type]);

  return (
    <div style={{ padding: "1rem" }}>
      <h2 style={{ marginTop: 0 }}>
        Search{q && <> · “{q}”</>}
        {type && <> · {type}</>}
      </h2>

      {!q && <p style={{ color: "#666" }}>Type something in the search box to find content.</p>}
      {q && !isSearchable(q) && (
        <p style={{ color: "#666" }}>Keep typing — at least {MIN_SEARCH_LENGTH} characters.</p>
      )}
      {error && <Banner kind="error">{error}</Banner>}
      {isSearchable(q) && loading && <p style={{ color: "#666" }}>Searching…</p>}
      {isSearchable(q) && !loading && !error && hits.length === 0 && (
        <p style={{ color: "#666" }}>No results for “{q}”.</p>
      )}

      <CardGrid>
        {hits.map((hit) => (
          <ContentCard
            key={hit.slug || `${hit.type}/${hit.id}`}
            item={hit}
            onOpen={(item) => navigate(store, viewUrl(item.slug || item.id))}
          />
        ))}
      </CardGrid>
    </div>
  );
}
