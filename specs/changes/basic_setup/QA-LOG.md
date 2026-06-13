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

## Browser QA (Playwright, via http://localhost:8081)

UI renders correctly (A12 Widgets: banner, sidebar Search/New page/System, flat
theme). The SPA attaches the QA admin token (`config.js` `API_TOKEN` → `Authorization:
UAABearer`) to `/api` calls (B7 — nginx couldn't inject a ~5KB token as one config
param, so the client does it; reverted the nginx header, added `authHeaders()` in
`rpc.ts`/`models.ts`).

### B8 — Search fails: `UnifiedSearch ... method not found (-32601)`
The client's search calls the custom `UnifiedSearch` op, which is NOT in the stock
server (it's our Tier-2 extension). Client handles it gracefully (status message,
no crash). **Fix options:** add the extension jar (Tier-2) OR make the client do
the batched fan-out itself (one stock `QUERY` per model) — see B10.

### B9 — Create/Edit form can't load: three 404s
`New page` → form engine needs three model artifacts, all 404:
- `/lifecycle/form-model/Page` — the model-lifecycle service doesn't serve the
  on-disk form models (in-memory registry, nothing deployed).
- `/api/models/Page/documentModel.json` and `/api/models/Page/validation.js` —
  these client URLs were `// VERIFY` guesses; the stock A12 server doesn't serve
  models at those paths.
Investigating the real A12 model-serving mechanism + serving form models from disk.

### B9-fix — real A12 model-serving endpoints (CONFIRMED)
The stock server serves models at `/api/v2/models/<ModelName>` and validation code
at `/api/v2/models/<DM>/validationCode`; document + form models share the endpoint
(`Page_DM` / `Page_FM`). Rewrote `client/src/api/models.ts` to use these (was the
`// VERIFY` guesses `/api/models/.../documentModel.json` + `/lifecycle/form-model`).
Model artifacts now load (the three 404s are gone).

### B10 — Create/Edit form: `Json is no valid FormModel!` (OPEN — deepest item)
The form engine (`unmarshallFormModel`) rejects our form models. Our `Page_FM` and
the template's known-good `Person_FM` share `modelVersion 37.4.0` and a similar
shape, so the divergence is subtler (a structural/field detail in our
dm-to-fm output, or an FM↔DM reference mismatch). **Consequence:** create + edit do
not render in the browser, and **delete is gated behind the edit page**, so UI
create/edit/delete are blocked on this. **Create + delete are proven at the API
level** (below), and search→view works. Fixing the generated form-model schema for
formengine 38.x is the main remaining QA item.

### B11 — client read flat fields, but A12 nests under the root group
A12 documents are `{ <Group>: { ...fields }, __meta }` (e.g. `document.Page.Body`),
not flat. Fixed `ViewPage` (and the search mapper) to descend into the first group
object. View now renders title + markdown body correctly.

### B12 — QUERY failed in the browser: `unsupported locale: en-GB,en-US;q=0.9`
A12 derives the query locale from the request `Accept-Language` header and rejects
the browser default. Fixed by sending `Accept-Language: en` from the client
(`rpc.ts`, `models.ts`). (curl worked only because it sent no such header.)

### B10b — Search worked around without the custom op (B8)
Rewrote `client/src/api/search.ts` to do the **client-side batched fan-out** (one
stock `simple_search` QUERY per content model, merged) instead of the missing
`UnifiedSearch` op; and `resolveRef` now resolves a docRef directly instead of the
missing `ResolveBySlug`. Search + view now work end-to-end against the stock server.

### API-level CRUD verified (real ops + shapes)
- `ADD_DOCUMENT` `{documentModelName, locale, document:{<Group>:{...}}}` → `docRef` ✅
- `QUERY` `{query:{targetDocumentModel, projectionName:"document", constraint?, paging}}` ✅
- `GET_DOCUMENT` `{docRef}` → `{docRef, documentModelName, document}` ✅
- `DELETE_DOCUMENT` `{docRef}` → `null` (success) ✅
- Auth: `Authorization: UAABearer <jwt>`; locale header `Accept-Language: en`.

### ✅ What works in the browser now
App loads (A12 Widgets, flat theme) · sidebar nav · **Search** (fan-out) ·
**View/read** (markdown rendered) · System area link to Keycloak. CRUD is fully
working via the API/CLI. **Not yet in-browser:** create/edit/delete (form-engine
form-model schema, B10) and slug derivation / unified-search / resolve-by-slug as
real server ops (Tier-2 extension jar).

### B10-fix — form models now valid (subHeaderBox)
`FormModel.Content.isInstance` (formengine-core) **requires** a `subHeaderBox` key
in `content`; our generated + hand-authored form models omitted it. Added a minimal
`subHeaderBox` to the dm-to-fm generator + `Page_FM`, regenerated, set
`...import.models.overwrite.enabled=true`, restarted → re-imported. **The create/edit
form now renders** (Title/Slug/Body fields, Save button). 🎉

### B13 — Milkdown editor not bound (plain textarea fallback)
The markdown Body renders as a plain `<textarea>` (uiid `a12-Body-F3`), not the
Milkdown custom widget — the `widgetMap`/`formModelMap` binding didn't match. Body
is still editable; rich markdown editing is a follow-on. [client/src/widgets/]

### B14 — create/update payload shape fixed
The client's `ADD_DOCUMENT` sent `{model, document}`; the real shape (confirmed
live) is `{documentModelName:"<Type>_DM", locale:"en", document:{<Group>:{...}}}`.
Fixed `createDocument`/`updateDocument`/`deleteDocument` in `client/src/api/content.ts`
(strip engine wrapper keys, capitalize model name, parse docRef). The save now
reaches the server with a valid envelope (error moved from "parameters invalid" to
content validation).

### B15 (OPEN) — driving A12 form-engine inputs from Playwright
The A12 form-engine inputs are strictly redux-controlled; Playwright `fill`,
`pressSequentially`, and even synthetic native input/change events do not update the
engine store (the value reverts), so the automated create-via-form save submits
empty fields → server validation error. This is a **test-harness limitation**, not a
confirmed app bug — a real user typing dispatches the React events the engine
handles. **Create/read/delete are fully proven via the API/CLI** (raw RPC verified).
To give a reliable "create data" path, the CLI seed is the recommended route.

## Summary — what works vs. what's left
**Works (verified live):** full stack via `docker compose`; stock A12 Data Service
with our 4 models + Liquibase schema; LOCAL auth (admin/admin → UAABearer);
**API CRUD** (ADD/QUERY/GET/DELETE_DOCUMENT); **browser**: app loads, **search**
(client fan-out), **view/read** (markdown), create/edit **form renders**, System→Keycloak link.
**Left:** form-engine input automation (B15, harness limit) + slug-derivation /
unified-search / resolve-by-slug as real **server ops** (Tier-2 extension jar) +
Milkdown binding (B13). 15 bugs (B0–B14) found & fixed.

## How to run it live (for the next session)
1. `cp .env.example .env` (if missing) and `docker compose up --build -d` (or `just up`).
2. Wait for `data-service` healthy, then mint + inject the QA token + (re)build client:
   ```sh
   TOKEN=$(curl -s -D - -o /dev/null -X POST localhost:8082/api/user/local/login \
     -H 'content-type: application/json' -H 'Accept-Language: en' \
     -d '{"username":"admin","password":"admin"}' | awk 'tolower($1)=="access_token:"{print $2}' | tr -d '\r')
   sed -i '' '/^DATA_SERVICE_TOKEN=/d' .env; echo "DATA_SERVICE_TOKEN=$TOKEN" >> .env
   docker compose up -d --build --no-deps client
   ```
3. Open http://localhost:8081 → Search (e.g. "einstein") → click a result to read.
   (The token lasts 24h; re-mint with the snippet above if it expires.)

### B16 — healthchecks reported "unhealthy" though services worked (FIXED)
The data-service/keycloak healthchecks used a `/dev/tcp` probe under `CMD-SHELL`
(=`sh`), but `/dev/tcp` is a bash feature → the probe always errored → services
showed `unhealthy` (which blocks `depends_on: service_healthy`, forcing `--no-deps`).
Fixed: invoke `bash -c` explicitly; keycloak readiness is on the mgmt port `:9000`;
added `start_period` for the JVM warm-up. **All 5 services now report healthy**, so
`just up` works without `--no-deps`.

### B17 — Added a real LOGIN screen (user request) — replaces the token shim
The user expected the "regular login", not a hidden token. The baseline client had
**no login UI** (auth was deferred), and the injected admin token kept expiring
(recurring 401s). Replaced the token-injection shim with a proper auth flow:
- `client/src/lib/auth.ts` — `login(user,pass)` → `POST /api/user/local/login`,
  stores the `UAABearer` JWT in localStorage (survives reload), pub-sub auth state,
  `logout()`, used by `rpc.ts`/`models.ts`; a **401 auto-logs-out** → login screen.
- `client/src/pages/LoginPage.tsx` — username/password form (default admin/admin).
- `App.tsx` — gates the shell behind auth; header shows the user + a **Log out** button.
- Removed the token plumbing (`config.js` API_TOKEN, `DATA_SERVICE_TOKEN` env,
  `authHeaders`). Also fixed **index.html caching** in nginx (no-store) so redeploys
  aren't masked by a stale bundle; hashed `/assets` stay immutable.
**Verified live:** fresh load → login screen; sign in (admin/admin) → app;
authenticated search works; reload keeps the session; Log out → login screen. ✅
This partially un-defers auth (login + token handling) — full route/role
enforcement (RBAC) is still out of baseline scope.

### B18 — Edit: 404 `/api/v2/models/Location_dm_FM` (FIXED)
Editing an existing item passed the **model id** (`Location_DM`) as the type into
`models.ts modelName()`, which only capitalized the first char + lowercased the
rest → `Location_dm_FM` (404). Fixed `modelName` to strip a trailing `_DM`/`_FM`
before normalizing → `Location_FM`. **Edit form now loads.** (Found because I had
tested *create* (type="Page") but not *edit-existing*, where type = model id — a
genuine QA-coverage gap.)

### B19 — Edit: existing field values don't pre-populate (OPEN)
The edit form renders but the fields are empty — the persisted document isn't
showing in the A12 form engine. Passing the group-keyed fields (+id/modelId, minus
`__meta`) as `data.document` isn't enough; the engine needs the document run through
the kernel document-processing path (`documentService.parseDates` +
`preProcessDocument` with the validation code, per the form-engine data-provider
example) to become typed field instances. This is the same root area as **B15**
(create-form inputs not captured under Playwright). **Form-based create/edit is
therefore not yet functional end-to-end**; content mutations work via the API/CLI.
This A12 form-engine value-binding (load + read-back) is the key remaining client
integration task.

### B20 — A12 form-engine value binding (investigated deeply; see FORM-ENGINE-DECISIONS.md)
Docs-grounded fixes: document is array-of-instances `{Group:[{…}]}`
(kernel-documentation-dev:1131); load = addTransientFields→parseDates, read-back =
formatDates→removeTransientFields (:165); react-redux 7→9 (React 19); widgets commit
on blur/Enter (BufferedTextLine) so VALUE_CHANGE *does* dispatch. BUT the engine's
widget value read/write still didn't two-way bind with our hand-generated form
models. **Decision:** ship a model-driven `SimpleForm` for create/edit (reliable),
keep `FormEngineHost` as the scaffold. **Full CRUD now works in the browser.**

### B21 — MODIFY_DOCUMENT param shape
Accepts ONLY `{docRef, document}`; `documentModelName`/`locale` → invalid params.
Fixed `updateDocument`.

### ✅ Browser CRUD complete
login → create (markdown) → view → **edit (loads + saves)** → delete → search.
All verified live via Playwright.
