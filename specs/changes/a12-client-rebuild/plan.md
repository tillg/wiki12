# Plan — A12 Client rebuild

Read `proposal.md`, `architecture.md`, and **`screens.md`** first. Large, staged
change: build on a branch, verify screen-by-screen against `screens.md`, replace the
current client only when the new one reaches parity. Test-first where there's pure
logic; the engine/binding pieces are verified live in the browser (CLAUDE.md rule),
artifacts → `tmp/`. Grep `VERIFY` at every A12 contract point; consult the A12 docs +
discourse before each A12-boundary step (don't guess).

## 0. Spike — prove Form-Engine binding inside the Client

- [ ] From the project template, stand up the bare A12 **Client** app pointed at
      wiki12's Data Service (`/api/v2/rpc`, `/api/v2/models/*`).
- [ ] Define ONE activity for **Create Person** using the Form Engine via a
      single-document **data provider** (createEmptyDocument → ADD_DOCUMENT).
- [ ] **Verify (the whole bet):** typing into fields persists to the store; the
      `BirthDate` **DatePicker** value binds; `ADD_DOCUMENT` sends a populated
      document and **succeeds**. If binding still fails here, STOP and reassess
      before building the rest.

## 1. Template adoption & app shell

- [ ] Retrieve/adopt the template Client (Composable Appsetup, Root Reducer, Model
      Loader, Application Frame); strip demo models/activities.
- [ ] Wire auth (Keycloak/UAA) and the model loader to wiki12 endpoints.
- [ ] Render the **Application Frame** with empty regions; confirm login → frame.
- [ ] Verify: app builds; login works; nginx proxy contract intact (ADR-0005 build).

## 2. Application Model & global chrome

- [ ] Author the Application Model skeleton (activities + scene directives) for the
      screens in `screens.md`.
- [ ] Build the **header** views: brand, **global live search** box, **New** type
      dropdown (one item per served model), user/logout.
- [ ] Build the **sidebar** nav (Browse, System).
- [ ] Verify: chrome renders; New dropdown lists all types; search box present.

## 3. Browse (Overview, master)

- [ ] Browse overview activity → list-all across `CONTENT_MODELS`, recency-sorted,
      card render (reuse `listAllContent`/sort/dedupe logic via a data provider).
- [ ] Click → dependent detail activity (split); selecting another cancels+recreates.
- [ ] Verify: cards render newest-first; clicking opens detail; URL stays `/`.

## 4. Content detail (View) + deep link

- [ ] Standalone `/view/:ref` activity; slug→docRef via `ResolveBySlug`; `GET_DOCUMENT`.
- [ ] Read-only render incl. envelope (Title/Slug/CreatedOn/Changes) + markdown body.
- [ ] **Full size** from Browse split → `/view/<slug>`.
- [ ] Verify: deep link by slug (colon-literal) and by Technical ID both resolve;
      envelope shows; legacy `%3A` decodes.

## 5. Create & Edit (Form Engine)

- [ ] Create `/create?type=` activity (`__NEW__`) and Edit `/edit/:ref` activity
      (existing doc); Form Engine view; single-document data provider (load/save).
- [ ] Register the **Milkdown** markdown widget in the ClientWidgetMap for `Body`.
- [ ] Save: `filterDataByRelevance` + `formatDates` → `ADD_DOCUMENT` /
      `MODIFY_DOCUMENT { docRef, document }`; navigate to View.
- [ ] Verify per type (page/person/film/location): DatePicker binds; validation
      blocks empty mandatory fields; save succeeds; edit round-trips; markdown works.

## 6. Delete

- [ ] Delete action + confirm dialog → `DELETE_DOCUMENT`; on success → Browse.
- [ ] Verify: item removed; idempotent.

## 7. Search

- [ ] `/search?q=&type=` overview activity over `unifiedSearch`; header box drives it
      live (debounced); `type` validated; **≥3-char** guard + hint; result click →
      `/view/<slug>`.
- [ ] Verify: shareable URL; type filter narrows; `<3` chars shows hint, no request;
      leftover text doesn't trap navigation.

## 8. System / Migrations

- [ ] `/system` view: Keycloak link + Migrations list/editor (TS source, PUT to
      model-lifecycle).
- [ ] Verify: list loads; edit+save a migration's TS source round-trips.

## 9. Retire the old client & finalize

- [ ] Remove `SimpleForm.tsx`, `docModel.ts`, the bare `FormEngineHost.tsx`, and the
      React-Router `App.tsx`/pages superseded by the Application Model. Keep reused
      `api/*` + pure helpers (refUrl, search, envelope, liveSearch) and their tests.
- [ ] Full browser pass against `screens.md` acceptance for every screen.
- [ ] Update docs: `CLAUDE.md` (client now on A12 Client), `client/README.md`
      (architecture + VERIFY list), `specs/system/functional.md`, and an **ADR** for
      "web client on the A12 Client framework" (supersedes the SimpleForm decision).
- [ ] `just build` so the `client` Docker image ships the A12 Client app.

## Notes / guards

- **Server is fixed** — no `server/` changes; the seam is the JSON-RPC + model
  endpoints already proven by the CLI.
- **Binding is the risk** — Stage 0 must pass before investing in Stages 1–9.
- **Carry over prior fixes** — slug-verbatim URLs (`refUrl`), search min-length +
  live-search behavior (`liveSearch`), envelope read.
- **A12 first** — confirm Client/Form-Engine/Template APIs against the docs +
  discourse; mark every assumption `VERIFY`.
