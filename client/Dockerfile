# Multi-stage: build the static SPA with Node, serve it with nginx.
# WIKI12_VERSION is stamped from the root VERSION file (ADR-0005, docker-compose).

# ---- build ----
FROM node:22-alpine AS build
WORKDIR /app

ARG WIKI12_VERSION=0.0.0
ENV VITE_WIKI12_VERSION=${WIKI12_VERSION}

# .npmrc points the @com.mgmtp.a12.* scope at artifacts.geta12.com.
COPY .npmrc package.json package-lock.json* ./
# A12's internal peer ranges are self-consistent but trip npm's strict solver, so
# --legacy-peer-deps is required (see client/README + DECISIONS D11). Use ci when the
# lockfile is in sync, else fall back to install.
RUN npm ci --legacy-peer-deps || npm install --legacy-peer-deps

COPY . .
RUN npm run build

# ---- serve ----
FROM nginx:alpine AS serve

# nginx:alpine ships envsubst (gettext). Templates are rendered at start.
COPY nginx.conf.template /etc/nginx/templates/nginx.conf.template
COPY --from=build /app/dist /usr/share/nginx/html
COPY config.js.template /usr/share/nginx/html/config.js.template
COPY docker-entrypoint.sh /docker-entrypoint-wiki12.sh
RUN chmod +x /docker-entrypoint-wiki12.sh

# Sensible defaults (overridden by docker-compose env).
ENV DATA_SERVICE_UPSTREAM=http://data-service:8080 \
    MODEL_LIFECYCLE_UPSTREAM=http://model-lifecycle:8090 \
    KEYCLOAK_CONSOLE_URL=http://localhost:8089/admin

EXPOSE 80
ENTRYPOINT ["/docker-entrypoint-wiki12.sh"]
