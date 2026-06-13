import { useState } from "react";
import type { FormEvent, ReactElement } from "react";
import { Link } from "react-router-dom";
import { unifiedSearch, type SearchHit } from "../api/search";
import { Chip, Banner } from "../components/Ui";

export function SearchPage(): ReactElement {
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  async function runSearch(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      setHits(await unifiedSearch({ query }));
      setSearched(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2>Search</h2>
      <form onSubmit={runSearch} style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search pages and entities…"
          aria-label="Search query"
          style={{ flex: 1, padding: "0.45rem" }}
        />
        <button type="submit" disabled={loading || !query.trim()}>
          {loading ? "Searching…" : "Search"}
        </button>
      </form>

      {error && <Banner kind="error">{error}</Banner>}

      {searched && !loading && hits.length === 0 && !error && (
        <p style={{ color: "#666" }}>No results for “{query}”.</p>
      )}

      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {hits.map((hit) => (
          <li key={hit.slug || `${hit.type}/${hit.id}`} style={{ padding: "0.6rem 0", borderBottom: "1px solid #eee" }}>
            <div style={{ marginBottom: "0.2rem" }}>
              <Chip tone="kind">{hit.kind}</Chip>
              <Chip tone="type">{hit.type}</Chip>
              <Link to={`/view/${encodeURIComponent(hit.slug || hit.id)}`} style={{ fontWeight: 600 }}>
                {hit.title}
              </Link>
            </div>
            <div style={{ fontSize: "0.8rem", color: "#888", fontFamily: "monospace" }}>{hit.slug}</div>
            {hit.snippet && <div style={{ fontSize: "0.9rem", color: "#444" }}>{hit.snippet}</div>}
          </li>
        ))}
      </ul>
    </div>
  );
}
