// Dev default. In the container this file is overwritten at startup by
// config.js.template via envsubst (see Dockerfile entrypoint), so the
// KEYCLOAK_CONSOLE_URL from docker-compose reaches the SPA at runtime.
window.__WIKI12_CONFIG__ = {
  KEYCLOAK_CONSOLE_URL: "http://localhost:8089/admin",
};
