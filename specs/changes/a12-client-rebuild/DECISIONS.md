# Autonomous run — Decisions & Assumptions log

Applying `/spec:apply a12-client-rebuild` in autonomous mode on branch
`feat/a12-client-rebuild`. This log records every assumption and decision made
without user input, for review at the end.

## Ground rules I'm operating under
- Server (`server/`) is **fixed** — no changes. Seam is JSON-RPC + model endpoints.
- Stage 0 (Form-Engine binding inside the Client) is the **gate**. If binding
  cannot be made to work, STOP and reassess rather than building Stages 1–9 blind.
- Test-first for pure logic; browser-verify the engine/binding pieces; artifacts → `tmp/`.
- Use A12 docs (in-repo bundles) before guessing; mark contract assumptions `// VERIFY`.

## Decisions
| # | Decision | Rationale |
|---|----------|-----------|
| D1 | Work on branch `feat/a12-client-rebuild`, branched from `feat/system-area-redesign` carrying its uncommitted working tree. | User asked for a "special branch"; the in-flight prior fixes (refUrl/liveSearch/envelope/SearchPage) are exactly what the plan says to carry over. |
| D2 | Interpreted `/spec:apply a12-client-rebuild` as "implement the plan in `specs/changes/a12-client-rebuild/`". | No `spec:apply` skill exists; the change dir + autonomous wrapper make the intent unambiguous. |

## Assumptions
| # | Assumption | Risk if wrong |
|---|------------|---------------|
| A1 | `@com.mgmtp.a12.client/client-core` (installed) is sufficient to host the Client runtime without pulling the full external project template repo. | May need more template packages; would need to source them. |

## Stage 0 (binding spike) — RESULT: PASS ✅
The whole bet is won. Form Engine hosted in the A12 Client **binds typed values**
and the document populates correctly.

**Root cause of the historic binding failure (now understood):** the standalone
embedding (and the first spike iteration) lacked **localization config**. The
form engine's value conversion (`conversion.parseValue` from `LocalizerContext`)
returns `undefined` with no active locale, so every typed value was dropped before
reaching the document — *and* field labels rendered empty. Wiring
`withLocalization` + `config.locale = {language:"en",country:"US"}` fixed both:
labels render and `VALUE_CHANGE` now carries the value → document populates
(`{Person:{FirstName:"Al"}}`), `SET_DATA`/`SET_DIRTY` fire.

**The Stage-0 recipe that works** (client/src/a12client/):
1. `ConnectorLocator.createInstance(new RestServerConnector("/api", [authFilter]))`
   — authFilter adds `UAABearer` token + `Accept-Language: en`.
2. App config: `withFormEngine` → `withLocalization` → `withModel(appModel)` →
   `withPlatformModelLoader` (order is type-enforced).
3. App model: ApplicationFrame region with CONTENT(MasterDetail)+SIDEBAR(Null)+MODAL(Stack);
   a scene matching `model:"Person"` doing `VIEW_ADD "FormEngine"` with
   `models:[{form,Person_FM},{document,Person_DM}]`.
4. Dispatch `ActivityActions.create({activityId, activityDescriptor:{model:"Person",instance:"__NEW__"}})`.

**Test-harness note:** Playwright `fill()` and native value-setter do NOT update
the A12 `BufferedTextLine` buffer; only real keystrokes (`page.keyboard.press`)
do. Binding verification must use real keystrokes + Tab (blur triggers
`onValueSubmit`).

## Decisions (continued)
| # | Decision | Rationale |
|---|----------|-----------|
| D3 | Adopt-in-place: keep the Vite app, wire client-core via a new `src/a12client/` + a separate `spike.html` entry, rather than scaffolding the full template (Gradle+Webpack monorepo). | Template conflicts ADR-0005; client-core is bundler-agnostic. Per research recommendation. |
| D4 | Stage-0 spike served at `/spike.html` (separate entry) so the working SPA at `/index.html` stays intact until parity. | Plan §0/§9: replace the old client only at parity. |
| D5 | Edit/View/Delete will need a **custom RequestSelectorMap** (`formEngine.singleDocument.requestSelectorMap`): the platform default adds `locale` to MODIFY/DELETE (wiki12 rejects per B21) and uses a `QUERY exact_match` for load instead of `GET_DOCUMENT`. Stage-0 Create (ADD_DOCUMENT) matches as-is. | Confirmed by reading DefaultRequestSelectorMap + RequestBuilder vs wiki12 contract. |

## Load/Edit path — TESTED, platform provider is INCOMPATIBLE (key finding)
Loading an existing document via the platform single-document provider **fails**
against wiki12 (`loadingState: "error"`). Root cause (read from
`PlatformSingleDocumentDataProvider.js:74`): on load it **hardcodes**
- a `QUERY` with `constraint: exact_match on /__meta/docRef` (wiki12 reads single
  docs with `GET_DOCUMENT`, not a docRef query), AND
- a second batched RPC `loadAllThumbnailURLs` (`LOAD_THUMBNAIL_URLS_INTERNAL`),
  which wiki12's Data Service does not serve — failing the whole batch.
It also parses the response as `result.entries[0]`. A custom `RequestSelectorMap`
**cannot** fix this (the thumbnail RPC + entries-parse are hardcoded outside the
selector). **Decision (supersedes D5):** for View/Edit/Delete, write a **custom
single-document `DataProvider`** that reuses wiki12's proven `api/content.ts`
(`GET_DOCUMENT` / `resolveRef` / `ADD_DOCUMENT` / `MODIFY_DOCUMENT {docRef,document}` /
`DELETE_DOCUMENT`), applying the form-engine recipe (createEmptyDocument for new;
`parseDates` + `preProcessDocument` on load; `filterDataByRelevance` + strip
id/modelId + `formatDates` on save). Compose the form engine WITHOUT the platform
provider: use the individual `withFormEngine{DataReducers,Middlewares,Sagas,View}`
+ `withConfiguredFormEngine` + `withFormModelSupport` + `addDataHandlers(createEmptyDocumentDataProvider(...), customProvider)`.
For **Create** only, the platform provider's `ADD_DOCUMENT` is contract-correct
(proven in Stage 0).

## Custom DataProvider — BUILT & VERIFIED ✅ (Milestone 2)
`client/src/a12client/wikiSingleDocumentDataProvider.ts` mirrors the platform
provider's form-engine recipe but routes persistence through wiki12's `api/content.ts`.
Composed via the individual form-engine features (not bundled `withFormEngine`):
`withFormEngine{DataReducers,Middlewares,Sagas,View}` + `withConfiguredFormEngine`
+ `withFormModelSupport` + `addDataHandlers(createEmptyDocumentDataProvider(), customProvider)`.
Verified live against the running stack:
- **Load existing** (`?instance=Person_DM/<uuid>`): `GET_DOCUMENT` → `parseDates` →
  `preProcessDocument` → form shows Albert/Einstein, DatePicker re-renders `09/29/1967`. `loadingState: "loaded"`.
- **Edit/save**: `MODIFY_DOCUMENT {docRef, document}` — **no `locale`** (B21 satisfied),
  BirthDate serialized `1967-09-29`, Nationality added → 200, `savingState: "saved"`.
- **Create/save** (Stage 0): `ADD_DOCUMENT` → server Technical ID.
- Delete uses the same `deleteDocument` (`DELETE_DOCUMENT {docRef}`, no locale) — wired, not yet click-tested.

So Create + Load + Edit round-trip through the Form Engine inside the Client all
work against wiki12's real contract. View (read-only) reuses the same load path.

## Session scope decision (autonomous)
A full from-scratch A12 Client rebuild replacing the entire React-Router SPA
(Browse, Search, View, Edit, Delete, System, global chrome, deep linking) verified
screen-by-screen is a multi-session effort (the plan itself stages it on a branch
"verified screen-by-screen before replacing the current client"). In this session I:
- **Proved the gate (Stage 0)** — the explicit go/no-go for the whole change. PASS.
- Produced complete, code-level **research findings** (RESEARCH-FINDINGS.md).
- **De-risked** the architecture (adopt-in-place), the working app recipe, and the
  load/save contract gaps (custom DataProvider needed).
Per CLAUDE.md's verify-before-done discipline, I did not dump unverified code for the
remaining stages. The roadmap below is now low-risk and precisely specified.

## Remaining roadmap (de-risked; next sessions)
1. ~~**Custom single-document DataProvider**~~ — **DONE & verified** (Milestone 2).
   View/Edit/Delete now need only Application-Model scenes + activities, not new
   data-layer work. (Delete: add a confirm dialog + dispatch the activity remove;
   read-only View: create the activity with `slices.ui = { readonly: true }`.)
2. **Promote spike → real app**: full Application Model with Browse/View/Create/Edit/
   Search/System scenes; mount from `main.tsx` behind the working SPA until parity.
3. **Browse**: custom Overview view component + DataLoader using `listAllContent`/
   `sortByRecency`/`dedupeCards` (no overview-engine package installed).
4. **Global chrome**: header views (brand, New `PopUpMenu` dropdown over served models,
   live search box) + sidebar (Browse, System) in header/sidebar regions.
5. **Search**: custom overview over `unifiedSearch`; ≥3-char guard + live `liveSearch`.
6. **Deep linking**: Client deep-linking is NOT a router — needs a custom
   `DeepLinkCoder`/`locationManager` mapping `/view/:ref`,`/edit/:ref`,`/search?q=` ↔
   activity descriptors (resolve slugs via `ResolveBySlug`). Biggest remaining unknown.
7. **Markdown**: re-enable `markdownWidgetMap`/`markdownFormModelMap` for Description/Body; verify.
8. **System** page (migrations via model-lifecycle HTTP).
9. **Retire** SimpleForm/docModel/FormEngineHost/old App.tsx+pages; **ADR**; update
   CLAUDE.md/README/functional.md; `just build` the client image.

## Open questions deferred (decided autonomously)
- Markdown widget map temporarily disabled in the spike to isolate binding; re-enable in step 7.
- Spike keeps a dev-only Redux action logger (window.__actions/__fullActions) and a
  `?instance=` param + `__save()` helper — harmless dev aids on the /spike.html entry only.
