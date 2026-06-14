# Research findings — A12 Client rebuild (synthesized from doc + package research)

Distilled from reading the three A12 doc bundles + the installed packages + the
existing client contract. Authoritative for the build; supersedes guessing.

## Installed packages (versions matter — experimental APIs)
- `@com.mgmtp.a12.client/client-core` **16.2.1**
- `@com.mgmtp.a12.formengine/formengine-core` **38.4.1**
- `@com.mgmtp.a12.dataservices/dataservices-access` 38.4.2
- `@com.mgmtp.a12.widgets/widgets-core` 38.3.4
- `@com.mgmtp.a12.kernel/kernel-md-facade` 30.8.1
- `@com.mgmtp.a12.utils/utils-connector` 8.2.2
- **NO overview-engine package installed** → Browse/Search cannot use the Overview
  Engine. Use a **custom view component backed by a DataLoader/DataProvider** that
  calls the existing `QUERY` fan-out / `unifiedSearch`.

## The binding fix (Stage 0 — the whole bet)
Host the Form Engine **inside a Client Activity** with a **single-document data
provider**. The framework ships it: `createPlatformSingleDocumentDataProvider()` /
`platformSingleDocumentDataProvider`, plus the one-shot app-config helper
`withFormEngine(cfg)`. The form view component is `FormEngineViews.FormEngine`
(already connected). New doc: `instance === NEW_INSTANCE_IDENTIFIER` ("__NEW__").

**Lifecycle (from form-engine docs):**
- new: `{ id: "__NEW__", modelId: dm.header.id, ...createEmptyDocument(dm, fm) }`
- load existing: `documentService.parseDates(doc, dm)` → `preProcessDocument(...)`
- save: `FormActivity.Data.filterDataByRelevance(data, {dm,fm})` → strip `id`/`modelId`
  → `documentService.formatDates(doc, dm)` → ADD_DOCUMENT / MODIFY_DOCUMENT
- `DocumentService` via `new DocumentServiceFactory().getDocumentService()` from
  `@com.mgmtp.a12.kernel/kernel-md-facade`.

**Why this also fixes the `29.09.1967` date bug:** Date field → DatePicker emits a
`Date` object into the document; `formatDates` serializes it to the kernel string.
No more locale string shuttled verbatim.

## Composable app setup (client-core, all `@experimental`)
`combineFeatures(...)` + `createA12ApplicationSetup(finalConfig)` →
`{ store, initialActions, Component }`. Features: `withModel(appModel)`,
`withPlatformModelLoader`/`withHTTPModelLoader`, `withFormEngine`, `addView(name, Comp)`,
`addWrapper`, `withDeepLinking`, `withLocalization`. Render `<Provider store={store}>{Component}</Provider>`
after `await initialActions()`.

## Application Model JSON
Application → Module(`menu?`, `flows[]`) → Flow(`scenes[]`) → Scene
(`matchConditions`, `sceneChange.onEnter/onExit` directives). Directives:
`VIEW_ADD {region, name, models?}`, `REGION_CLEAR {region}`. Regions tree under
`content.region` with `layout.name` ∈ {ApplicationFrame, MasterDetail, Stack, Null}.
`initialActivity.descriptor`. Activity descriptor: `{ model, instance? }` (`instance`
is the only reserved key). **VERIFY header.modelVersion against installed schema.**

## Data Providers
`DataProvider` (saga, full control) | `DataLoader` (load/save/delete promises) |
`DataEditor` (parent↔child). Registered via `addDataHandlers(...)`/`dataHandlers`.
For wiki12, reuse `client/src/api/content.ts` + `search.ts` ops inside these.

## Auth (NOT in client-core)
`ConnectorLocator.createInstance(new RestServerConnector(baseUrl, [authFilter]))`
from `@com.mgmtp.a12.utils/utils-connector`. The `authFilter` (a `RequestFilter`)
adds `Authorization: UAABearer <token>` (reuse `auth.ts` getToken). The platform
model loader uses the ConnectorLocator. **VERIFY RequestFilter interface live.**

## Deep linking (NOT a router)
Client deep-linking only encodes the latest activity **descriptor** into the URL
hash. wiki12's `/view/:ref`, `/search?q=` style URLs need EITHER a custom
`DeepLinkCoder`/`locationManager` OR keeping react-router for URL↔descriptor
mapping. **Decision deferred to Stage 4/7; Stage 0 doesn't need it.**

## Markdown widget (Milkdown on Body)
Form-Engine `widgetMap` (NOT ClientWidgetMap): override key **`TextAreaStateless`**
(String + lineBreaksPermitted → TextArea), plus `formModelMap.Control` wrapper for
context. The existing `client/src/widgets/markdownWidgetMap.tsx` already does this.
Pass via `FormEngineViews.FormEngine` props / `formEngine.viewConfig`.

## Proven JSON-RPC contract (reuse verbatim — server is fixed)
- `POST /api/v2/rpc`, JSON-RPC 2.0; headers `Accept-Language: en` (mandatory),
  `Authorization: UAABearer <token>`.
- ADD_DOCUMENT `{documentModelName, locale, document}` → `{docRef}`
- GET_DOCUMENT `{docRef}` → `{document, docRef}`
- MODIFY_DOCUMENT `{docRef, document}` — **ONLY** these two keys (B21)
- DELETE_DOCUMENT `{docRef}`
- QUERY `{query:{targetDocumentModel, projectionName:"document", constraint?, sort?, paging}}`
  — omit constraint = list-all; `simple_search` needs **≥3 chars** or batch rolls back.
- ResolveBySlug `{idOrSlug}` → `{type,id,slug,found}`; docRef short-circuits without RPC.
- UnifiedSearch: documented but NOT in stock server — emulated by QUERY fan-out.
- docRef = `<Model>/<uuid>`; model = `Cap(type)+"_DM"`. Documents group-keyed
  `{<Group>:{...}}`; strip id/modelId/__meta; trim strings before write.
- `CONTENT_MODELS` (search.ts): page/Page_DM, person/Person_DM, film/Film_DM, location/Location_DM.

## Recommendation: adopt-in-place, keep Vite
Do NOT scaffold the full template (Gradle+Webpack monorepo — conflicts ADR-0005).
Keep Vite, Vitest, Dockerfile, nginx/config.js, `auth.ts`, `api/*`, pure helpers.
Add client-core app composition into `main.tsx`. Replace Webpack `require.context`
with Vite `import.meta.glob` if module auto-discovery is used.
