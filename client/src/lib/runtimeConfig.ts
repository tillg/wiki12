// Runtime configuration injected by nginx at container start (config.js).
// Lets the same static bundle target different backends without a rebuild.

export interface RuntimeConfig {
  KEYCLOAK_CONSOLE_URL: string;
  // QA-only admin token (UAABearer). Baseline defers auth (scope); the stock A12
  // Data Service still requires a token, so for QA the deploy injects one here and
  // the API layer attaches it (QA-LOG B7). Empty in a real auth build.
  API_TOKEN: string;
}

declare global {
  interface Window {
    __WIKI12_CONFIG__?: Partial<RuntimeConfig>;
  }
}

const DEFAULTS: RuntimeConfig = {
  KEYCLOAK_CONSOLE_URL: "http://localhost:8089/admin",
  API_TOKEN: "",
};

export function getRuntimeConfig(): RuntimeConfig {
  return { ...DEFAULTS, ...(window.__WIKI12_CONFIG__ ?? {}) };
}

/** Authorization header for A12 Data Service calls, when a QA token is present. */
export function authHeaders(): Record<string, string> {
  const token = getRuntimeConfig().API_TOKEN;
  return token ? { Authorization: `UAABearer ${token}` } : {};
}
