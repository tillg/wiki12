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

## Open questions deferred (decided autonomously)
- Markdown widget map temporarily disabled in the spike to isolate binding; must be
  re-enabled and verified for the Description/Body field in Stage 5.
