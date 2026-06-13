// Model-lifecycle service API (the Node service), reached same-origin under
// /lifecycle (nginx strips the prefix when proxying).
//
//   GET  /lifecycle/migrations          -> Migration[] (list)
//   GET  /lifecycle/migrations/<id>     -> Migration   (one, incl. TS source)
//   PUT  /lifecycle/migrations/<id>     -> save TS `script` source ONLY
//   GET  /lifecycle/form-model/<type>   -> generated/stored form model (see models.ts)
//
// Migrations are stored as `Migration` content items; we edit only the TS source
// (architecture.md System area / §5). The service transpiles + sandbox-runs —
// the client NEVER compiles TS (that is the whole point of editing source only).

const LIFECYCLE_BASE = "/lifecycle";

export interface Migration {
  id: string;
  targetModel: string;
  fromVersion: number | string;
  toVersion: number | string;
  /** TypeScript source of the (doc vN) -> (doc vN+1) transform. */
  script: string;
}

async function lifecycleFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${LIFECYCLE_BASE}${path}`, {
    ...init,
    headers: { Accept: "application/json", ...(init?.headers ?? {}) },
  });
  if (!res.ok) {
    throw new Error(`Lifecycle ${init?.method ?? "GET"} ${path} failed: HTTP ${res.status}`);
  }
  // PUT may return 204 No Content.
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

/** List all stored Migration content items. */
export async function listMigrations(): Promise<Migration[]> {
  // VERIFY: /lifecycle/migrations response shape (array vs { migrations: [...] }).
  const data = await lifecycleFetch<Migration[] | { migrations: Migration[] }>("/migrations");
  return Array.isArray(data) ? data : (data?.migrations ?? []);
}

/** Save a migration's TS source. Sends ONLY the script (server owns transpile). */
export async function saveMigrationScript(id: string, script: string): Promise<void> {
  // VERIFY: PUT /lifecycle/migrations/<id> body shape ({ script } assumed).
  await lifecycleFetch<void>(`/migrations/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ script }),
  });
}
