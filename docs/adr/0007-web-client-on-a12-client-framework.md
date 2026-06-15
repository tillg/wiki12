# Web client runs on the A12 Client framework (supersedes the SimpleForm workaround)

> **Status: ACCEPTED (2026-06-15).** The web client is rebuilt on the **A12 Client**
> runtime (`@com.mgmtp.a12.client/client-core` + `@com.mgmtp.a12.formengine`),
> replacing the hand-rolled React-Router SPA and its `SimpleForm` form fallback.
> Implemented and verified live against the running stack. See
> `specs/changes/a12-client-rebuild/`.

## Context

The original web client hand-rolled forms (`SimpleForm`) because the **standalone**
form-engine embedding (`<EngineConnected>` over a bare store) never persisted typed
values — typing dispatched no value into the document, so `ADD_DOCUMENT` sent an
empty document and the kernel rejected it. A symptom was the date-entry bug: a date
field was a plain text box, so `29.09.1967` reached the kernel verbatim and was
rejected (`-32009`).

The Form Engine's working examples all run the engine **inside the A12 Client** — an
Activity with a single-document Data Provider and the framework's saga/reducer
wiring that drives `valueChange` into the document. The Client is the supported host.

## Decision

Rebuild the web client on the **A12 Client framework**, adopted **in place** in the
existing Vite app (not scaffolded from the full project template, which is a
Gradle+Webpack monorepo that conflicts with ADR-0005). The server (Data Service:
slug/envelope derivation, `ResolveBySlug`, `UnifiedSearch`) is **unchanged** — the
integration seam is the existing JSON-RPC contract.

Key structural choices (all verified live):

1. **Form Engine inside the Client** for Create/View/Edit. Binding works because the
   engine runs in an Activity with a data provider. **Root cause of the historic
   failure: missing localization** — the engine's value conversion (`parseValue`)
   returns `undefined` with no active locale, dropping every typed value (and
   blanking labels). Wiring `withLocalization` + an active locale fixes it. The
   DatePicker then emits a real `Date` and `formatDates` serializes it to the kernel
   form (`1967-09-29`) — the date bug is gone by construction.
2. **Custom single-document Data Provider** (`wikiSingleDocumentDataProvider.ts`)
   routes persistence through the proven `api/content.ts` ops. The platform provider
   is incompatible with wiki12: on load it hardcodes a `QUERY exact_match` +
   `LOAD_THUMBNAIL_URLS_INTERNAL` (not served) and parses `entries[0]`; on
   MODIFY/DELETE it adds a `locale` param the server rejects (QA-LOG B21). The form
   engine recipe (createEmptyDocument / parseDates+preProcessDocument / filterDataByRelevance+formatDates)
   is preserved.
3. **Non-form screens are custom React views** (Browse, Search, System) registered as
   Client views, doing their own fetch via the existing `api/*`. No Overview Engine
   package is installed, so Browse/Search reuse `listAllContent`/`unifiedSearch` +
   the existing card components.
4. **Chrome** is a custom **ApplicationFrame layout** (single frame) hosting the
   wiki12 brand, live search box, New type dropdown, user/logout, and sidebar nav.
5. **Routing**: the Client deep-linking feature is **not** a URL router, so a thin
   `routing.ts` maps `/`, `/view/:ref`, `/edit/:ref`, `/create?type=`, `/search?q=`,
   `/system` to Activity descriptors (slug refs via `ResolveBySlug`) and syncs
   history. Deep-link full page loads work via the nginx/Vite SPA fallback to
   `index.html`.

## Consequences

- The whole content lifecycle (Browse → Create → View → Edit → Delete, plus Search
  and System) runs on the A12 Client, verified end-to-end against the live stack.
- `SimpleForm`, `FormEngineHost`, `docModel.ts`, `ContentDetailView`, the
  React-Router `App.tsx`, and the per-screen pages are **retired**. Reused logic is
  kept: `api/*`, the pure helpers (`refUrl`, `liveSearch`, `envelope`, `modelFields`),
  `auth`, `runtimeConfig`, the Milkdown markdown widget, `LoginPage`, `SystemPage`.
- Build/deploy is unchanged (ADR-0005): per-component Vite build, nginx image,
  VERSION-stamped. No top-level Gradle, no Webpack.
- The composable-appsetup APIs used are marked `@experimental` in client-core 16.2.1;
  the package versions are effectively pinned. Engine/Client upgrades must re-verify
  the binding + provider recipe.

## Alternatives rejected

- **Keep SimpleForm / standalone embedding** — the binding never worked; the date
  bug and empty-document rejection are intrinsic.
- **Scaffold from the A12 project template** — full Gradle+Webpack monorepo;
  conflicts with ADR-0005 and discards wiki12's working Vite/nginx/runtime-config.
- **Platform single-document data provider as-is** — incompatible with wiki12's
  load/modify/delete contract (see Decision §2).
