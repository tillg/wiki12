// /search?q=<query>&type=<type> — the shareable cross-model search (slug-based-urls
// §3). Distinct from Browse ('/'), which is a list-all gallery with an in-memory
// filter. Reads q/type from the URL, fans out via unifiedSearch, and renders the
// same ContentCards the gallery uses. A card click opens the slug deep link.

import { useEffect, useState } from "react";
import type { ReactElement } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { unifiedSearch, isSearchable, CONTENT_MODELS, MIN_SEARCH_LENGTH, type SearchHit } from "../api/search";
import { refSegment } from "../lib/refUrl";
import { ContentCard } from "../components/ContentCard";
import { CardGrid } from "../components/CardGrid";
import { Banner } from "../components/Ui";

export function SearchPage(): ReactElement {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const q = (searchParams.get("q") ?? "").trim();
  // Validate `type` against the known content types; an unknown type is ignored
  // (search all), mirroring unifiedSearch's own filtering.
  const rawType = searchParams.get("type") ?? "";
  const type = CONTENT_MODELS.some((m) => m.type === rawType) ? rawType : undefined;

  const [hits, setHits] = useState<SearchHit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Below the trigram minimum the server rejects the query as invalid — don't fire
    // it; the render shows a "keep typing" hint instead of a misleading "no results".
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
    <div>
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
            onOpen={(item) => navigate(`/view/${refSegment(item.slug || item.id)}`)}
          />
        ))}
      </CardGrid>
    </div>
  );
}
