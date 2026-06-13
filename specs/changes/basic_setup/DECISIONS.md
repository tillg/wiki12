# basic_setup — autonomous implementation decisions & assumptions

This log records every decision and assumption made while applying `basic_setup`
in autonomous mode (no interactive user feedback). Review with the user at the
end. Newest sections appended as work proceeds.

Started: 2026-06-12. Mode: `/autonomous` over `/spec:apply basic_setup`.

---

## D0 — Scope of this autonomous pass (the big one)

**Decision.** `basic_setup` bootstraps an entire multi-service A12 system (Java
Data Service image built from `artifacts.geta12.com`, Keycloak, Postgres, a
React/A12-widgets client, a Node model-lifecycle service, the `wiki12` CLI, all
under docker-compose). A live, fully-verified end-to-end stack is a multi-day
effort gated on long external Docker/Gradle builds and a running server. In one
autonomous session I split the work into two tiers and complete tier 1 fully:

**Tier 1 — built AND verified offline (completed here):**
- Repo scaffolding & the full docker-compose / `just` / env / Keycloak / Postgres
  configuration (authored; compose *config* validated, not a live `up`).
- Data models (`page`, `person`, `film`, `location`, `Migration`) placed under
  `models/` and validated by `src/model_tools/validate.py`.
- Slug + `searchText` derivation **algorithm** as a standalone, unit-tested Java
  `Slugifier` (compiled & tested with `javac`/JUnit-free asserts — no A12 deps),
  plus the listener/op Java that wraps it (authored against the documented A12
  extension points).
- Default form-model generation via `src/dm-to-fm` for every DM, with tests.
- The `wiki12` CLI (full command surface) with unit tests over a mocked JSON-RPC
  transport.
- The model-lifecycle service migration runner (transpile + sandbox per-doc
  transform, upload gate, dry-run slug manifest) with tests.
- Seed script + README.

**Tier 2 — authored, verification needs the live stack (documented, NOT run here):**
- Building the Java Data Service Docker image (pulls A12 artifacts + Gradle build).
- `docker compose up` health of all five services.
- React client rendering A12 widgets in a browser (npm install of
  `@com.mgmtp.a12.*` may succeed; full render needs the stack + served models).
- The **slug-concurrency spike** (`spike-slug-concurrency.md`) — needs a running
  Data Service + Postgres. The advisory-lock code is authored on the *assumption*
  Probe A passes (the findings' recommended primary); the spike must still be run
  before trusting slug uniqueness in production.

**Why:** maximises real, tested value now; isolates the genuinely
infra-gated steps so they can be run in one focused live session later. Each
Tier-2 item has a concrete "how to verify" note in the README / this log.

---

## Decisions & assumptions (chronological)

### D1 — Service topology, ports, and the client proxy contract (Step 1)
- **Ports** follow the A12 Project Template defaults so they're familiar
  (findings §6): client `8081`, data-service `8082`, postgres `8083`,
  keycloak `8089`; model-lifecycle on `8090`. All overridable via `.env`.
- **Service names** (compose DNS): `postgres`, `keycloak`, `data-service`,
  `model-lifecycle`, `client`.
- **Client uses same-origin relative URLs**; nginx in the client image proxies
  `POST /api/v2/rpc → data-service:8080` and `/lifecycle/* → model-lifecycle:8090`
  (prefix stripped). *Why:* a static SPA can't bake in container DNS names, and
  same-origin avoids CORS. The Keycloak console URL is injected as an env var.
- **One stack version** stamped from the root `VERSION` file into every image as
  a `WIKI12_VERSION` build arg (ADR-0005). *Assumption:* the "every compile bumps
  PATCH" cadence (ADR-0005 open item) is **not** wired into `just dev` yet — left
  manual to avoid noisy churn (matches the ADR's own open concern).

### D2 — model-lifecycle HTTP contract (Steps 3 & 6)
Fixed so the CLI, the web client, and the service itself agree. Service serves at
root (client reaches it via the stripped `/lifecycle` prefix):
`GET /health`, `GET|PUT /form-model/:type`, `GET /migrations`,
`GET|PUT /migrations/:id`, `POST /models` (deploy DM + gated Migration),
`POST /migrate` ({type,from,to,dryRun} → report incl. slug manifest).

### D3 — Keycloak shape
A dedicated **`wiki12` realm** is import-seeded with an `admin`/`admin` user
(+ `wiki12-admin`/`wiki12-editor` roles) and a public `wiki12-web` client. The
master-realm bootstrap admin is `admin`/`admin` via `KC_BOOTSTRAP_ADMIN_*`.
Baseline does **not** consume Keycloak for auth (scope); the realm/client exist
so the future auth change has a seam and the System area can link to the console.

### D4 — Postgres init is a no-op; no slug unique-index backstop
The A12 Data Service owns its schema via Liquibase on startup (findings §6), so
`docker/postgres/init/01-init.sql` only logs. Per the review-gate decision, the
optional DB partial-unique-index backstop for slugs is **deliberately omitted** —
slug uniqueness is the advisory-lock path only (which makes the slug-concurrency
spike a hard gate; see D0 Tier 2).

### D5 — type → model-name mapping
CLI/client/lifecycle map a content type to its A12 model by Capitalize + `_DM`:
`page → Page_DM`, `person → Person_DM`, `film → Film_DM`, `location → Location_DM`.
`wiki12 page …` is sugar for `entity --type page …` (ADR-0004 / architecture §1).

### D6 — Delegation (per user's "use agents as much as possible")
Authoring fanned out to five parallel sub-agents — server (Java Data Service +
extension code + Slugifier), client (React/A12-widgets), models+forms,
`wiki12` CLI, model-lifecycle service — each scoped to its own directory against
the fixed contracts above. I own integration: compose, env, Keycloak/Postgres
config, seed, decisions, README, and the cross-component verification pass.

### D7 — Models & forms (Step 2-models / Step 3) — DONE & verified
- The four sample DMs were already domain-correct; promoted verbatim into
  `models/document-models/` (canonical, deployable). Validator exits 0.
- **`person` key fields = FirstName (1) + LastName (2)** → `person:till_gartner`,
  matching the domain example.
- **Explicit `Page_FM.json`** authored (markdown body in a full-width editor row,
  slug read-only), marked `wiki12.formModel="explicit"`; the other three forms are
  generated defaults. `just generate-forms` now **skips** explicit forms so
  regeneration never clobbers the hand-tuned Page form.
- **Additive validator rule:** every content type must carry a searchable markdown
  field (`StringType` + `lineBreaksPermitted`) distinct from the `searchText` blob
  — encodes the domain's "markdown body/description" requirement.
- dm-to-fm gained a Node-built-in test suite (5 tests, green). *Verified by me:
  re-ran the validator (exit 0) and the tests (5/5).*

### D8 — Java Data Service (Step 1 image + Step 2 slug logic) — authored, Slugifier verified
- The slug algorithm is isolated in a **pure `Slugifier`** (no A12 deps) with a
  framework-free test harness — **compiled & run by me: 25/25 pass.** The
  A12-coupled pieces (lifecycle listener, `SlugDerivationService` with the advisory
  lock, `ResolveBySlug` + `UnifiedSearch` `@RemoteOperation`s) are authored against
  the documented A12 idioms and carry explicit `// VERIFY` notes (see
  `server/README.md`).
- **Spec-faithful slug edge case:** ADR-0001's rule is literally `[a-z0-9_]` with
  **no transliteration**, so `café → caf` (non-ASCII letters drop), not `cafe`.
  Kept true to spec; NFD-folding is noted as a future refinement.
- **Tier-2 (needs live stack):** the Gradle build of the image (pulls
  `com.mgmtp.a12.*`), and the **slug-concurrency spike** (Probe A: raw
  `JdbcTemplate` advisory lock in the A12 write transaction) — a hard gate with no
  DB-index fallback per the review-gate decision. Server code assumes Probe A
  passes; the spike must run before trusting slug uniqueness.

### D9 — model-lifecycle service (Step 6) — DONE & verified
- **Sandbox = `isolated-vm`** (installed & confirmed working here); `node:vm`
  (frozen, fs/net-free, codegen disabled) is the auto-fallback. The transform
  crosses the boundary only as JSON. *Carry-over `// VERIFY`:* the `node:vm`
  fallback is not a true security boundary — harden before running untrusted
  operator scripts in production.
- **New annotation `wiki12.version`** (integer, default 1) on the DM header =
  the *content-schema* version the gate/migrate operate on, kept **distinct from**
  A12's `modelVersion` format string (`"28.4.0"`). The upload gate compares this.
- **`Migration` is itself a content item** (`model-lifecycle/models/Migration_DM.json`,
  validates): `targetModel` + `fromVersion` + `toVersion` key fields, `script`
  (TS source) body. Registry is **in-memory** in the baseline; persisting
  `Migration` docs to the Data Service is a later step (DM already authored).
- Dry-run **slug manifest is a prediction** — authoritative `_N` uniqueness lives
  in the Data Service (ADR-0001); the runner mirrors only the text-part rule to
  show the rename blast radius. *Verified by me: 18/18 tests, typecheck clean.*

### D10 — Seed (Step 7) — runner drives the real CLI
`seed/seed.ts` reads `seed/content.json` and shells out to the `wiki12` CLI
(`page create` / `entity create --field k=v`) — "two clients, one contract": the
seed exercises the same path an operator uses, rather than duplicating the RPC
envelope. Field keys match the DM field names exactly (`Title`/`Body`,
`FirstName`/`LastName`/…). Slug + `searchText` are derived server-side, so only
authored fields are sent. *Verified offline via `--dry-run`* (prints the exact
CLI calls); the live create round-trip is Tier-2 (needs the running stack).

### D11 — Web client (Step 4) — resolved a real blocker; now COMPILES & BUNDLES against real A12
This is the biggest upgrade over the initial plan. The client agent could not
`npm install` because the exact A12 npm path was unknown. I resolved it:
- **A12 npm registry = `https://artifacts.geta12.com/artifactory/api/npm/a12-community-npm/`**
  (discovered via the JFrog `api/repositories` endpoint — the public *Community*
  virtual npm repo). `.npmrc` maps every A12 **sub-scope** individually
  (`@com.mgmtp.a12.widgets`, `.formengine`, `.kernel`, `.client`, `.base`,
  `.utils`, `.dataservices`, `.expression`, ...) — an npm scope is the whole
  `@...segment`, so one line per sub-scope.
- **A12 packages are on independent version lines** — the client agent's blanket
  `^38.0.0` pins were wrong. Corrected to the real published majors:
  widgets-core 38.3.4, formengine-core 38.4.1, kernel-md-facade 30.8.1,
  utils-localization 7.2.0, utils-logging 6.2.0, base-model-api 29.3.0,
  client-core 16.2.1, etc.
- **A12 expects `redux@^4` + `react-redux@^7`** (even on React 19); the agent had
  chosen redux 5 / react-redux 9. Aligned to A12's peers. Installed the full A12
  peer **closure** (+ third-party peers `react-dnd`, `redux-saga`,
  `typed-redux-saga`, `typescript-fsa`). Install uses **`--legacy-peer-deps`**
  (A12's internal peer ranges are self-consistent but trip npm's strict solver).
- **Result (verified by me):** `tsc -b` type-checks the whole client against the
  **real A12 types**; `vite build` bundles **4074 modules -> `dist/`** (3.1 MB JS);
  Vitest **21/21**. Two tiny code fixes were needed (guard an `undefined` in
  `markdownWidgetMap.tsx`; move the `test` block out of `vite.config.ts`).
- **Tier-2 remaining:** the live browser render against a running Data Service +
  served models, and the form-engine/Milkdown `// VERIFY` items in
  `client/README.md` (model-serving URLs, widget-map key, document seeding).

### D12 — Cross-client contract drift (to reconcile against the live server)
The three TS clients independently guessed a few A12 op shapes that are all
behind `// VERIFY` (the real names need the live Data Service):
- **Write/delete op names:** CLI used `UPDATE_DOCUMENT`/`DELETE_DOCUMENT`; the web
  client + model-lifecycle used `MODIFY_DOCUMENT`/`DELETE_DOCUMENT`. The A12 docs
  say "modify"; **standardize on `MODIFY_DOCUMENT`** when the live op is confirmed.
- **Slug-change signal:** assumed a `slugChange:{from,to}` field on write results.
- **`UnifiedSearch` envelope:** clients tolerate both a flat array and `{results}`.
- All transports are **injectable**, so reconciling to the confirmed names is a
  one-line change per client with no structural rework. Left as a documented
  Tier-2 reconciliation rather than churning code toward another guess.

### D13 — Consolidated Tier-2 "needs the live stack" checklist
None of these are blocked by missing code — they need a running stack / external
build to *verify*:
1. **Build the Data Service image** (`docker compose build data-service`) — Gradle
   pulls `com.mgmtp.a12.*` from `a12-community-maven`. Confirm the `// VERIFY`
   Maven coordinates/versions in `server/build.gradle`.
2. **`docker compose up`** — all 5 services healthy; client reachable at `:8081`.
3. **Slug-concurrency spike** (`spike-slug-concurrency.md`, Probe A) — the hard
   gate for slug uniqueness (no DB-index fallback).
4. **Confirm the A12 op/event `// VERIFY` items** in `server/README.md`,
   `cli/README.md`, `client/README.md`, `model-lifecycle/README.md`, then reconcile
   D12's op-name drift.
5. **Live browser round-trip** (search -> open -> edit -> save -> delete) for a Page
   and an Entity; **`just seed`**; a real **migration** dry-run + apply.
