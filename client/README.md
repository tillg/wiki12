# wiki12 web client

React + TypeScript SPA for the wiki12 A12-based wiki. Built with Vite, rendered
with A12 Widgets, and driven by the A12 form engine. Talks to the A12 Data
Service over JSON-RPC and to the Node model-lifecycle service over a small REST
API — both same-origin behind nginx in production.

## Develop

```sh
npm install        # see "npm registry" below — A12 packages need the right registry
npm run dev        # Vite dev server on http://localhost:5173
npm run test       # Vitest (pure-logic unit tests; needs no live stack)
npm run build      # type-check + production bundle into dist/
```

`npm run dev` proxies the same-origin paths the production nginx serves, so the
app code only ever uses relative URLs:

- `/api/*`       → A12 Data Service (default `http://localhost:8082`, override `VITE_DATA_SERVICE`)
- `/lifecycle/*` → Node model-lifecycle service, **prefix stripped** (default `http://localhost:8090`, override `VITE_MODEL_LIFECYCLE`)

## How it's built and served

Multi-stage `Dockerfile`:

1. **build** (`node:22-alpine`) — `npm ci`/`npm install` then `vite build` → `dist/`.
   Takes `WIKI12_VERSION` as a build arg (stamped from the repo `VERSION` via
   docker-compose).
2. **serve** (`nginx:alpine`) — serves `dist/` from `/usr/share/nginx/html`.
   The entrypoint runs `envsubst` over two templates, then `nginx -g 'daemon off;'`:
   - `nginx.conf.template` → `/etc/nginx/conf.d/default.conf`
     (substitutes `DATA_SERVICE_UPSTREAM`, `MODEL_LIFECYCLE_UPSTREAM`)
   - `config.js.template` → `/usr/share/nginx/html/config.js`
     (substitutes `KEYCLOAK_CONSOLE_URL`)

Container listens on port **80**.

### nginx proxy contract (production)

| Path              | Upstream / behavior                                                        |
|-------------------|----------------------------------------------------------------------------|
| `POST /api/v2/rpc`| A12 Data Service JSON-RPC (`${DATA_SERVICE_UPSTREAM}`, default `data-service:8080`) |
| `/api/*`          | Data Service (also serves model artifacts — see VERIFY)                    |
| `/lifecycle/*`    | Model-lifecycle service (`${MODEL_LIFECYCLE_UPSTREAM}`, default `model-lifecycle:8090`); **`/lifecycle` prefix stripped** |
| `/config.js`      | Runtime config (`no-store`); regenerated per container start               |
| everything else   | static SPA with history fallback to `index.html`                          |

`KEYCLOAK_CONSOLE_URL` is injected into the SPA at runtime via `config.js`
(`window.__WIKI12_CONFIG__`), read by `src/lib/runtimeConfig.ts` — so the same
static bundle works against any backend without a rebuild.

### npm registry

A12 packages are scoped `@com.mgmtp.a12.*` from the public JFrog Artifactory at
`artifacts.geta12.com`. **An npm scope is the whole segment between `@` and `/`**
(`@com.mgmtp.a12.widgets`, not `@com.mgmtp.a12`), so `.npmrc` maps each A12
sub-scope individually. The exact Artifactory repo path is unverified — see the
VERIFY list. Until it resolves, `npm install` cannot fetch the A12 packages; the
unit tests run in isolation and need none of them.

## App surface

- **Browse** (`/`) — the landing view, built on the A12 **Managed Master-Detail**
  widget (`@com.mgmtp.a12.widgets/widgets-core/lib/layout/master-detail`). Master
  pane = a live keystroke filter box + a responsive `CardGrid` of `ContentCard`s
  for **all** content (recency-sorted, newest-changed first); detail pane =
  `ContentDetailView` (read-only, all fields) with the widget's native
  **full-size** toggle. Responsive: a single view at a time on narrow screens.
  Replaces the old submit-button `SearchPage` (deleted) as home.
- **View** (`/view/:ref`) — fetches by ref (id-or-slug, resolved via
  `ResolveBySlug`) and delegates to `ContentDetailView`, so it renders identically
  to the Browse detail pane (markdown via `react-markdown` + GFM). Keeps an Edit
  link.
- **Create / Edit** (`/create?type=…`, `/edit/:ref`) — A12 form engine, non-Redux
  bootstrap (`unmarshallFormModel` + `createEmptyDocument` + `createEngineStore` +
  `<EngineConnected/>`). The slug is shown **read-only**. On a save that changes
  the slug, an info banner states `old → new`. **Delete** uses a confirm dialog.
- **System** (`/system`) — outbound link to the Keycloak admin console, plus a
  **Migrations** list; each row opens a `<textarea>` editing the migration's TS
  `script` source and PUTs it back. **TS source only** — the lifecycle service
  transpiles + sandbox-runs; the client never compiles TS.

### Content cards & detail (reusable)

The Browse view is composed from three reusable components in `src/components/`,
each depending only on data + callbacks (never on the router or a fetch):

- **`ContentCard.tsx`** — built on the A12 `Card` widget
  (`@com.mgmtp.a12.widgets/widgets-core/lib/card`). Renders any content item
  identically (props `{ item, onOpen }`): an optional grey created·changed date
  line, a bold title, type/kind `Chip`s, and a clamped content preview.
- **`CardGrid.tsx`** — a thin responsive layout wrapper
  (`grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr))`); owns layout
  only, not data.
- **`ContentDetailView.tsx`** — renders a whole item **read-only**: title/slug/type
  header, markdown Body/Description, a humanized label→value list of the remaining
  scalar fields, CreatedOn, and the Changes log newest-first. Reused by both
  `BrowsePage`'s detail pane and `ViewPage`.

### Read model (`api/search.ts`)

Alongside `unifiedSearch`, the module exposes the browse read path:

- **`listAllContent()`** — a constraint-free (list-all) `QUERY` fan-out per content
  model, recency-sorted; runs once on mount and is filtered in memory per keystroke.
- **`ContentCardData`** — `SearchHit` plus optional `createdOn` / `lastChangedOn`.
- Pure, unit-tested helpers: `sortByRecency`, `filterCards`, `formatCardDate`,
  `lastChangedOf`.

**List cap (no silent caps):** the gallery lists up to **100 items per content
model**; the UI states this. Cross-model paging is out of scope.

### Sans-serif global

`App.tsx` layers a `createGlobalStyle` sans-serif rule over the A12 theme. The
flat theme is already sans-serif for widget text; `createTheme`'s typography token
isn't in the theme schema, so the global is the documented safe path. The sidebar
item is now **Browse** (was "Search").

### Markdown editor

`src/widgets/MilkdownEditor.tsx` wraps Milkdown (markdown-native ProseMirror +
Remark) as a controlled editor — the field value IS the markdown string, so it
binds directly to the A12 String body field (no serialization). It exposes
`data-role="text-output"` and the form-engine `uiID` on the editable wrapper so
the validation-bar "jump to field" focus/scroll works (findings-a12.md §5).
It's registered into the form engine via `src/widgets/markdownWidgetMap.tsx`
(custom `WidgetMap` + `FormModelMap`), activated for controls whose field is the
markdown body (annotation `wiki12.markdownBody`, or a known body field name).

## Source layout

```
src/
  api/        rpc.ts (JSON-RPC, batch), content.ts (CRUD), models.ts (model fetch),
              search.ts (UnifiedSearch + merge), lifecycle.ts (migrations + form-model)
  components/ FormEngineHost.tsx (non-Redux bootstrap), Ui.tsx (chip/banner/dialog),
              ContentCard.tsx (on A12 Card), CardGrid.tsx, ContentDetailView.tsx
  widgets/    MilkdownEditor.tsx, markdownWidgetMap.tsx
  pages/      BrowsePage (landing '/', A12 Managed Master-Detail), ViewPage,
              EditPage, SystemPage
  lib/        runtimeConfig.ts, modelFields.ts
  *.test.ts   Vitest unit tests (rpc, search, modelFields)
```

## Unit tests

`npm run test` runs Vitest against the pure logic that needs no live stack:

- `src/api/rpc.test.ts` — JSON-RPC request/batch builders + batch-response
  realignment by id (and per-item error handling).
- `src/api/search.test.ts` — search-result normalization, merge/de-dup across
  per-model lists, tolerant envelope coercion (`toLists`), plus the browse read
  model: `sortByRecency`, `filterCards`, `formatCardDate`, `lastChangedOf`.
- `src/lib/modelFields.test.ts` — markdown-body control detection.

A standalone `vitest.config.ts` (no Vite React plugin) is used so the tests run
even when the A12 packages aren't installed. 21 tests, all passing.

## VERIFY list — assumptions against the live A12 / model-serving contract

Every assumption that needs confirming against the running stack. Grep the code
for `VERIFY` to find them in context.

1. **npm registry path** (`.npmrc`). The Artifactory npm repo path for the
   `@com.mgmtp.a12.*` scopes is unconfirmed. Probed 2026-06-12:
   `…/api/npm/a12-npm/` → 403 (repo exists; likely needs the correct path/headers),
   `…/api/npm/npm[-release]/` → 404. Confirm the real path, then update every
   scope line. `npm install` cannot resolve A12 packages until this is fixed.
2. **Data Service model-artifact URLs** (`api/models.ts`). Assumed
   `/api/models/<type>/documentModel.json` and `/api/models/<type>/validation.js`.
   The kernel may serve these via JSON-RPC ops instead of static files. This is
   the one module to change — all three model inputs are fetched here.
3. **`UnifiedSearch` result envelope** (`api/search.ts`). Assumed a flat array of
   `{kind,type,id,slug,title,snippet}`; the client also tolerates `{results}` and
   `{byModel}` shapes via `toLists`. Confirm the op's actual return shape.
4. **CRUD op names + param/result shapes** (`api/content.ts`):
   - `GET_DOCUMENT` param key `docRef` and result envelope (`{document, meta.slug}`).
   - `ADD_DOCUMENT` params `{model, document}`; result carrying `id` + derived slug.
   - **`MODIFY_DOCUMENT`** — update op name + `{docRef, document}` params (assumed).
   - **`DELETE_DOCUMENT`** — delete op name + `{docRef}` params (assumed).
   - `ResolveBySlug` param `{ref}` and result `{type,id,slug,found}`.
   - Where the slug-change `old → new` is carried on a write response (assumed
     `meta.slug`); the banner depends on detecting it.
5. **Form engine details** (`components/FormEngineHost.tsx`):
   - How to seed an **existing** document into the store (the docs only show
     `createEmptyDocument` for new docs); assumed `data.document = loaded payload`.
   - The path to read the current document back out (`state.data.document`).
6. **Form engine widget key** (`widgets/markdownWidgetMap.tsx`). The default
   String/TextArea widget key is assumed `TextAreaStateless`; the props carrying
   `value` / `onValueChange` / `uiID`, and how the bound field name is exposed on
   the `FormModel.Control`, depend on the installed `@com.mgmtp.a12.formengine`
   version (docs show `TextLineStateless` as the example).
7. **Lifecycle REST shapes** (`api/lifecycle.ts`). `GET /lifecycle/migrations`
   array vs `{migrations}` (tolerated); `PUT /lifecycle/migrations/<id>` body
   `{script}` (assumed). The Node service isn't implemented yet, so these match
   the integration contract, not running code.
8. **A12 package versions**. Pinned to `^38.0.0` per the Widgets Quick Start
   (`widgets-core ^38`); confirm the form-engine / kernel / utils versions line up
   on the registry.
9. **A12 Managed Master-Detail runtime behavior** (`pages/BrowsePage.tsx`). That
   the detail's full-size toggle expands it to the whole viewport and the
   responsive breakpoint collapses to a single view on narrow screens — confirmed
   working in a **manual browser check against the live stack**; left as a VERIFY
   pending an automated regression for the widget's runtime behavior.
```
