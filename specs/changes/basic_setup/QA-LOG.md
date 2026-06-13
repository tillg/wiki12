# wiki12 — autonomous QA & live-bring-up log

Started 2026-06-13. Goal (per user): bring the stack up, drive it with Playwright,
exercise features (login, create, edit, delete, search), find & fix bugs, restart
the stack as needed, document everything here. User is away; no questions — decide
and proceed.

Companion to `DECISIONS.md` (design decisions). This file = the live test diary.

## Environment
- docker compose v5, Node 22, Java 25 (host), Playwright MCP.
- Ports: client 8081, data-service 8082, keycloak 8089, model-lifecycle 8090, pg 8083.

## Timeline / findings

### B0 — initial `docker compose up --build` failed (data-service)
- **Symptom:** `gradle: not found` (exit 127) in the server build stage; whole `up`
  aborted, nothing started → browser "cannot connect".
- **Cause:** server Dockerfile build stage used `eclipse-temurin:21-jdk` (no gradle)
  and no `./gradlew` wrapper was vendored.
- **Fix:** build stage → `gradle:8.10-jdk21` (gradle on PATH). [server/Dockerfile]

### B1 — client image build failed (`npm ci || npm install`, exit 1)
- **Symptom:** client image failed to build → `:8081` never came up.
- **Cause:** A12 packages need `--legacy-peer-deps` (DECISIONS D11); the Dockerfile
  ran plain `npm ci`/`npm install`.
- **Fix:** `npm ci --legacy-peer-deps || npm install --legacy-peer-deps`; added
  `client/.dockerignore`. [client/Dockerfile]

### B2 — client (nginx) crash-looped: `host not found in upstream "data-service"`
- **Symptom:** client container `Exited (1)`; nginx refused to start when the Data
  Service container was down → browser still "cannot connect".
- **Cause:** nginx resolves `proxy_pass http://data-service...` hostnames at startup
  and aborts if unresolvable. So the SPA couldn't serve unless the backend was up.
- **Fix:** `nginx.conf.template` now uses the Docker embedded DNS `resolver
  127.0.0.11` + **variable** `proxy_pass` (regex locations w/ named captures), so
  upstreams resolve lazily per-request. SPA loads regardless of backend state.
  [client/nginx.conf.template]

### B3 — data-service gradle build: `pluginManagement {} must appear before any other statements`
- **Cause:** `server/settings.gradle` had `rootProject.name` + a comment before the
  `pluginManagement {}` block.
- **Fix:** moved `pluginManagement {}` to the top. [server/settings.gradle]

### ✅ Milestone — client reachable
After B1+B2 fixes: `http://localhost:8081` → **HTTP 200**, `<title>wiki12</title>`.
postgres + keycloak + model-lifecycle + client all up. data-service still building
(B3 fix applied; Gradle now resolves A12 from `a12-community-maven`).

### B4 — data-service: pivot to the stock A12 fatjar (no custom compile)
The custom Spring-Boot embed couldn't build (guessed Maven coords; `dataservices-query`/
`-rpc` don't exist). Pivoted the server image to **download & run the prebuilt
`dataservices-server-app-38.4.2-fatjar.jar`** from `a12-community-maven`. The
custom slug/search ops (the bespoke Java) become a Tier-2 extension-jar follow-on.
[server/Dockerfile]

### B5/B6 — stock server needs full UAA config the fatjar doesn't ship
The bare fatjar ships **no** `application.properties`/auth resources (the Project
Template supplies them). Downloaded the template
(`@com.mgmtp.a12.projecttemplate/project-template@202506.5.1`) and assembled a
self-contained config bundle in `server/config/` (mounted into the image):
- `application-shared.properties` (template's — RPC ops, `/api` context, etc.)
- `application-wiki12.properties` (ours — model import, datasource via env, LOCAL
  auth, actuator health)
- `auth/roles.yaml`, `auth/childAuthorizationDefinition.json` (template's),
  `auth/users.yaml` (admin/admin).
Iterated through a chain of required config (resolved each): authorization
definition → principal extension → LocalUserManager → JWT secret
(**must be base64 decoding to exactly 32 bytes**). Profiles activated:
`dataservices-uaa,dataservices-rpc,dataservices-actuators,
dataservices-embedded_contentstore,dataservices-external_postgres,shared,wiki12`.
**Result: server boots, Liquibase builds the schema, and our 4 document + 4 form
models import** (`Page_DM, Person_DM, Film_DM, Location_DM`). `/actuator/health` = UP.

### B7 — auth model reality (affects the no-login client)
- A12 "backend super-user" is for **scheduled jobs only**, NOT HTTP requests;
  anonymous HTTP needs a custom principal adapter (custom Java). So the no-login
  client can't call a secured API directly.
- Working path = **LOCAL login**: `POST /api/user/local/login` (admin/admin) → JWT,
  sent as **`Authorization: UAABearer <token>`** (NOT `Bearer`).
- **Verified live CRUD** (with token): `ADD_DOCUMENT` (params:
  `{documentModelName:"Page_DM", locale:"en", document:{Page:{Title,Body}}}`) →
  returns `docRef`; `QUERY` (`{query:{targetDocumentModel,projectionName:"document",
  paging}}`) → returns the created doc with `__meta.creator=admin`. ✅
- **Real op shapes confirmed** (resolves the CLI/client `// VERIFY` D12 drift):
  ADD_DOCUMENT uses `documentModelName` + document keyed by the **root group name**;
  QUERY wraps under `query` with `projectionName`. Token scheme = `UAABearer`.
- **Known gap:** the no-login web client sends no Authorization header. Next: make
  the browser usable by injecting the token at the nginx proxy (no client change).
- **Slug/searchText are NOT auto-derived** (stock server lacks our extension jar) —
  Tier-2.

### ✅ Milestone — backend live with working CRUD
postgres + keycloak + model-lifecycle + client + **data-service** all up;
models loaded; authenticated CRUD verified against the real A12 Data Service.

(continued below)
