// Runtime configuration injected by nginx at container start (config.js).
// Lets the same static bundle target different backends without a rebuild.

export interface RuntimeConfig {
  KEYCLOAK_CONSOLE_URL: string;
}

declare global {
  interface Window {
    __WIKI12_CONFIG__?: Partial<RuntimeConfig>;
  }
}

const DEFAULTS: RuntimeConfig = {
  KEYCLOAK_CONSOLE_URL: "http://localhost:8089/admin",
};

export function getRuntimeConfig(): RuntimeConfig {
  return { ...DEFAULTS, ...(window.__WIKI12_CONFIG__ ?? {}) };
}
