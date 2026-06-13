#!/bin/sh
set -eu

# Render the nginx config from its template (only the upstream vars).
envsubst '${DATA_SERVICE_UPSTREAM} ${MODEL_LIFECYCLE_UPSTREAM}' \
  < /etc/nginx/templates/nginx.conf.template \
  > /etc/nginx/conf.d/default.conf

# Render the runtime SPA config (Keycloak console URL) into the served root.
envsubst '${KEYCLOAK_CONSOLE_URL}' \
  < /usr/share/nginx/html/config.js.template \
  > /usr/share/nginx/html/config.js

exec nginx -g 'daemon off;'
