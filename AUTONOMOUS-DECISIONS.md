# Autonomous session — decisions & assumptions

Task: **Fix the bugs in the README "Known issues & TODO" chapter**, then test E2E.
Started autonomously (user away). This file logs every decision/assumption for review.

## Scope (from the TODO)
1. **BUG: Read mode isn't read-only** (client) — view form is editable; edits lost.
2. **BUG: Content envelope never derived** (server) — Slug/CreatedOn/Changes/searchText absent.
3. **BUG: Slug-based read fails** (server) — `ResolveBySlug` → `-32004`.
4. **FEATURE: Wire up Milkdown editor** — body is a plain textarea.

Decision: fix all BUGs (1–3). Also attempt FEATURE 4 since it's small and in scope
("all functionality"); if it risks destabilizing, document and defer.

## Decisions log

### D1 — Client bugs delegated to a background agent
Bugs #1 (read-only) and #4 (Milkdown) are client-only and independent of the server
work, so a background agent owns `client/` while I do `server/`. Disjoint dirs → no
conflict.

### PIVOTAL FINDING (changes the nature of #2/#3)
The running data-service is the **stock A12 fatjar** — `server/Dockerfile` deliberately
pulls `dataservices-server-app-38.4.2-fatjar.jar` and **never compiles the wiki12
custom module** (documented "Tier-2 follow-on" shortcut). Proof: the running `app.jar`
contains **zero** `net/mgmtp/wiki12/*` classes; startup uses the stock
`ServerApplication`. So the slug listener, envelope derivation, `ResolveBySlug` and
`UnifiedSearch` were **never deployed** — that's the root cause of #2 and #3, not a
logic bug. The source also wouldn't compile: it imports `com.mgmtp.a12.dataservices.event.*`
but the real packages are `com.mgmtp.a12.dataservices.{document,common}.events.*`.
Real artifact versions: dataservices **38.4.2**, kernel-md **30.8.1** (build.gradle
guessed `2025.06-ext5` — wrong). A12 artifacts resolve from the public repo (HTTP 200,
no auth).

### D2 — Deployment approach: extension jar injected into the stock fatjar
Rather than rebuild a custom Spring Boot fatjar (the bootstrapping the project
deliberately avoided), compile the wiki12 classes into a small extension jar and add it
into the stock fatjar's `BOOT-INF/lib/`, with a Spring Boot AutoConfiguration that
component-scans `net.mgmtp.wiki12` so the stock `ServerApplication` registers our beans.
Lowest risk; binary-compatible (compiled against the exact 38.4.2/30.8.1 jars from the
fatjar).

### D3 — Read model config from the model JSON, not A12 model introspection
The stubbed `readConfig`/`allFields`/`annotationValue`/`fieldPath` use deeply-uncertain
A12 model-walk APIs. Instead, read the `wiki12.*` annotation config + field paths by
parsing the mounted Document Model JSON (`/opt/wiki12/models/document-models/*.json`) —
wiki12 owns that format (validated by `src/model_tools`), so it's deterministic and
offline-verifiable. Field paths follow the `/Group/Field` convention from the JSON.

### D4 — Client bugs (#1, #4) implemented by the agent, verified offline
Read-only: dispatch `Commands.setReadonly(true/false)` via `FormEngineActions.command`
into the activity engine state, driven by route mode (useEffect). Milkdown: resolve the
control's bound field NAME from its `elementPath` leaf (generated controls have no
`fieldName`), fix the widget key (`TextAreaStateless`) and DOM-event `onChange` contract.
typecheck + 82 tests + build all green. Needs live E2E confirmation.

### D5 — Server build/deploy: compile with javac against the fatjar's own A12 jars; merge into a copy of the fatjar; bind-mount over /app/app.jar
Avoids Docker image rebuilds and guarantees binary compatibility (compiled against the
exact 38.4.2/30.8.1 classes the fatjar ships). Register beans via a Spring Boot
`AutoConfiguration.imports` + a `@ComponentScan("net.mgmtp.wiki12")` config placed in
`BOOT-INF/classes` of the merged jar. Drop Lombok in server code (explicit ctor + slf4j
Logger) to keep the manual javac build simple.

### D6 — Scope/sequencing: #2 (envelope) first, then #3 (ResolveBySlug/UnifiedSearch)
#2 is highest-value and self-contained (verified DocumentV2 read/write APIs + model
config parsed from the mounted DM JSON). #3 needs the QueryService result-row API, which
is less certain — do it after #2 is verified live. Stock fatjar kept as fallback so the
stack never ends up broken.

### Verified A12 API signatures (via javap on the fatjar jars)
- Event: `com.mgmtp.a12.dataservices.document.events.{DocumentBeforeCreateEvent,
  DocumentBeforeUpdateEvent}`; `getCreatedDocument/setCreatedDocument`,
  `getUpdatedDocument/getPersistedDocument`. Listener annotation:
  `com.mgmtp.a12.dataservices.common.events.CommonDataServicesEventListener`.
- Document: `com.mgmtp.a12.kernel.md.document.apiV2.immutable.DocumentV2` —
  `getId():Optional<String>`, `getDocumentModelId()`, `fieldValue(String):Object`,
  `withBatchUpdates(Collection<UpdateAction>)`, `withGroupRepetitionAppended(String,
  GroupInstanceV2)`. `UpdateAction.putFieldValue(String,Object)`.
  `FieldInstanceV2.ofValue(Object)`, `GroupInstanceV2.of(Map,Map)`.
- Query: `com.mgmtp.a12.dataservices.query.QueryService.query(QueryRoot,String):QueryPage<T>`;
  `QueryRoot` is `...query.topology.QueryRoot` (builder). Result row type TBD at runtime.
(The committed source had WRONG imports: `dataservices.event.*` and `kernel.md.document.v2.*`.)

## Assumptions log
- DateTimeType wire format: the field `format` is `yyyy-MM-dd'T'HH:mm:ss`; the listener
  must stamp values in that exact shape (NOT `Instant.toString()` which adds millis+`Z`).
- Document field path format `/Group/Field` (e.g. `/Page/Title`) — to be confirmed at runtime.

## Status — ALL COMPLETE ✅
- [x] Investigate A12 event API (server)
- [x] Investigate A12 form-engine read-only mode (client)
- [x] Investigate Milkdown trigger (client)
- [x] Fix envelope derivation (server) — incl. update carry-over + collision suffix
- [x] Fix ResolveBySlug (server) + UnifiedSearch
- [x] Fix read-only mode (client)
- [x] Wire Milkdown (client) — editable in edit, read-only in view
- [x] Rebuild + bring up stack (permanent Dockerfile, no bind-mount)
- [x] E2E test (create/search/edit/delete/collision/entities, regressions)

### ✅ BUG #2 FIXED & VERIFIED E2E (2026-06-16)
After deploying the extension, creating a Page through the web client and reading it
back via GET_DOCUMENT yields the full envelope:
`Slug=page:envelope_test_delta`, `CreatedOn=2026-06-16T06:51:35`,
`searchText="envelope test delta ..."`, `Changes=[{ChangedOn, Summary:"created"}]`.
Runtime fixes found by iterating against the live stack:
1. Document paths are under the root group: `/Page/<Field>` (directSubgroups=[Page,__meta]).
2. Change-log append needs a `DocumentPointer` with PathParts, 1-based reps on
   non-terminal parts and `0` (append wildcard) on the last: `Page[1]/Changes[0]`.
3. DateTimeType values must be a `java.time.Instant` object (NOT a String) — the
   FieldValueConverter serializes the Instant via the field's format.

### ✅ BUGS #1 (read-only) + #4 (Milkdown) FIXED & VERIFIED E2E
- The agent's post-mount `Commands.setReadonly` dispatch CRASHED the form (it re-enters
  `uiStateReducer.handleDefault`→`extractModelsFromPayload` before models exist → assertion,
  blank "Oops" screen). Reverted it.
- Root cause of read-only never working: `routing.ts` set the activity slice under key
  **`ui`**, but the engine reads **`uiState`** (`resolveUiState(dh.slices.uiState)`).
  Fixed the key → View now renders read-only.
- `MilkdownEditor` only tinted its background for read-only; now it sets ProseMirror's
  `editable` callback (via `editorViewOptionsCtx` + a no-op tx on change) so the
  contenteditable surface is truly disabled in View.
- Verified: View → Title `readonly`, Milkdown `contenteditable=false`, no crash;
  Edit → both editable, Milkdown loads + binds the stored markdown; Save/Cancel/Delete present.

### ✅ BUG #3 FIXED & VERIFIED (ResolveBySlug + UnifiedSearch)
- Rewrote both custom @RemoteOperations (no lombok/QueryService) to scan documents via
  IDocumentRepository (findAllDocRefsForModel + findByDocumentReference) and match the
  derived slug / searchText. Whitelisted in allowedOperations (config + env).
- Verified: `ResolveBySlug{idOrSlug:"page:envelope_test_delta"}` → `{found:true, type, id,
  slug, docRef}`; `UnifiedSearch{query:"delta"}` → `[{kind,type,id,slug,title,snippet}]`.
- Note: the web client does search via stock QUERY simple_search on the (now-derived)
  searchText, not UnifiedSearch — UnifiedSearch is for the CLI.
- Made deployment PERMANENT: server/Dockerfile now compiles the extension against the
  fat jar's own jars and merges it into BOOT-INF/classes (so `just dev` ships the fix).

### ADD_DOCUMENT shape probe (for E2E bulk create)

---

## FINAL SUMMARY

### All four TODO items fixed & verified end-to-end
| # | Item | Status | Verified by |
|---|------|--------|-------------|
| 1 | BUG: Read mode not read-only | ✅ fixed | View: Title `readonly`, Milkdown `contenteditable=false`; Edit fully editable |
| 2 | BUG: Content envelope never derived | ✅ fixed | Create/update of Pages + all entities → Slug, CreatedOn, searchText, Title, Changes all derived |
| 3 | BUG: Slug-based read fails | ✅ fixed | `ResolveBySlug` + `UnifiedSearch` return correct results |
| 4 | FEATURE: Milkdown editor | ✅ done | Body renders Milkdown (edit) / read-only (view), value binds |

### E2E test coverage (live stack, Playwright + RPC)
- **Create**: Pages + Person + Film + Location (9+ docs) — all get the full envelope.
- **Update**: slug stays stable on same-name edit; `CreatedOn` immutable; `Changes`
  log is append-only (verified 1→2→3 across edits); slug rename surfaced.
- **Collision**: duplicate "Albert Einstein" page → `page:albert_einstein_2`.
- **Delete**: document removed (subsequent GET errors).
- **Search**: `UnifiedSearch` matches across types by `searchText`; stock `QUERY`
  `simple_search` (web client path) works now that `searchText` is populated.
- **Resolve**: `ResolveBySlug` for page + entity slugs returns `{type,id,slug,docRef}`.
- **Read-only / Milkdown**: confirmed in the browser on the baked image.
- **Full UI create flow** (form → Milkdown body → Save → read-only View): works.
- Regression suites: client typecheck + 82 vitest + build; offline `just test`
  (models valid, dm-to-fm 7, cli 94, lifecycle 20) — all green.

### Deployment
`server/Dockerfile` now compiles the extension against the fatjar's own A12 jars
(38.4.2 / 30.8.1) and merges the classes + AutoConfiguration into `BOOT-INF/classes`
with `zip` (NOT `jar uf`, which corrupts the Spring Boot fat jar). The baked image was
brought up with the plain `docker-compose.yml` (no override) and verified — so
`just dev` / `just build` ship the fix. Custom ops whitelisted in
`server/config/application-shared.properties`.

### Assumptions / decisions worth a human review
- **No advisory lock** on slug derivation (concurrency caveat — see README Open item).
- **Model config read from DM JSON** (not A12 model introspection) — deterministic, but
  assumes the wiki12 JSON layout (validated by `src/model_tools`).
- **Lombok dropped** in server code (plain Java) to keep the in-Dockerfile javac simple.
- The old gradle `build.gradle` is now unused for deployment (the Dockerfile compiles
  directly). Left in place; could be removed or aligned in a follow-up.
- `tmp/docker-compose.wiki12ext.yml` + `tmp/app-wiki12.jar` were the fast-iteration
  bind-mount harness (gitignored `tmp/`); not needed now that the image bakes the fix.

### Files changed
- server: `Dockerfile`, `config/application-shared.properties`,
  `src/main/java/net/mgmtp/wiki12/` (WikiExtAutoConfiguration + slug/ + operation/ rewritten),
  `src/main/resources/META-INF/spring/...AutoConfiguration.imports` (new).
- client: `a12client/routing.ts`, `a12client/views/FormScreen.tsx`,
  `widgets/markdownWidgetMap.tsx`, `widgets/MilkdownEditor.tsx`, `lib/modelFields.ts` (+test).
- docs: `README.md` (Known issues & TODO), this file.
