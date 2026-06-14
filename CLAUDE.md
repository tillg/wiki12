# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Look up A12 — don't guess or reverse-engineer it

This project is built on **A12** (mgm technology partners). **Always consult the
A12 docs before writing, changing, or assuming anything about A12 APIs, widgets,
the form engine, the Data Service, models, or operations.** Do not guess op
names, param shapes, widget keys, or model semantics, and do not reverse-engineer
behavior from compiled artifacts — read the docs.

- **In-repo mirror first**: [`docs/a12/`](docs/a12/index.md) (104 pages) and the
  Widgets Showcase under `docs/a12/` (65 pages). Search it before anything else.
- **Before any A12 Widgets work** (e.g. the web client): read the Widgets Quick
  Start — [`docs/a12/widgets/get-started/quick-start.md`](docs/a12/widgets/get-started/quick-start.md)
  (upstream <https://www.mgm-tp.com/a12.htmlshowcase/#/get-started/quick-start>).
- **Upstream when the mirror is thin**: docs at geta12.com (an SPA — use the
  browser/Playwright agent, not curl), source at github.com/mgm-tp, forum at
  discourse.geta12.com.

Where the live A12 contract genuinely could not be confirmed offline, the code
carries explicit `// VERIFY` markers. **Grep for `VERIFY`** before touching
A12-boundary code; each component's `README.md` has a numbered VERIFY list
explaining the assumption and how to confirm it against a running stack. When you
confirm one, update the code and strike it from the list.

## A12 in one minute

A12 (mgm technology partners) is a **model-driven platform**: you describe an
application as **models** (declarative JSON), and generic runtime engines turn
those models into a working backend and UI — little to no hand-written CRUD/UI
code. wiki12 leans on this: define a content type's **Document Model** and the
platform gives you storage, validation, querying, and (via a generated **Form
Model**) an editing screen.

**Model types** (authored in SME, the closed-source modeler — wiki12 hand-authors
JSON + generates forms via `src/dm-to-fm`, so it doesn't need SME):
- **Document Model (DM)** — the data: fields, types, constraints, versioned. One per content type.
- **Form Model (FM)** — the editing UI for a DM (layout, widgets, validation). Auto-generated when absent.
- Others A12 offers but wiki12 doesn't use yet: Overview, Tree, Query, Relationship, Workflow, Application models.

**Runtime components** (consumed as published artifacts from `artifacts.geta12.com`,
open source on github.com/mgm-tp; build graph in dependency order):
- **Backend** `kernel → base → dataservices` — the **Data Service** is the Spring-Boot
  app that serves model-driven CRUD/search/validation over **JSON-RPC 2.0**
  (`POST /api/v2/rpc`), backed by Postgres.
  Extended via lifecycle event listeners and custom `@RemoteOperation`s (that's what `server/` does).
- **Frontend** `utils → form-engine → widgets → client`:
  - **A12 Widgets** (`@com.mgmtp.a12.widgets`) — the React UI component library.
  - **Form Engine** (`@com.mgmtp.a12.formengine`) — interprets a Form Model at runtime
    to render/validate an editing form against a document (the `client/` create/edit screens drive this).
- **SME** — the (closed-source) visual model editor. Not used here.

So the A12 mental model is: **models in → engines interpret → app out**, and you
customize by writing models plus small, well-defined backend/frontend extension
points — not by replacing the engines.

## What this is

A wiki built on A12. One underlying mechanism — a **content item**
(`{ type, slug, id, fields }`) — expressed as two vocabularies: **Pages** (the
built-in `page` type) and **Entities** (user-defined types like `person`,
`film`, `location`). Three clients over one contract: a React/A12-Widgets web
client, the `wiki12` CLI, and the A12 Data Service. Read [`CONTEXT.md`](CONTEXT.md)
for the canonical domain language (Content item / Page / Entity / Slug / Technical
ID / Key Fields / Data Model / Form Model / Migration) — use those terms exactly.

## Commands

`just` is the operator entrypoint (see [`justfile`](justfile)). Per-component
work uses each dir's own npm/gradle scripts.

```sh
# Stack (Docker Compose, 5 services)
just build          # bump patch + build all images       | just bump (just the version bump)
just dev            # bump patch + up --build, follow logs | just up (detached)
just dev-stop       # down (keep volumes)        | just dev-clean (down --rmi local --volumes)
just logs <svc>     # tail one service           | just check (validate compose config)
just seed           # sample pages + entities (needs a running stack)

# Versioning: every build bumps VERSION's PATCH (3rd) number deterministically via
# scripts/bump-version.sh (NOT manually / AI-edited). build, dev, up all run `bump`
# first, then stamp the bumped VERSION into all images as WIKI12_VERSION. The justfile's
# parse-time `export WIKI12_VERSION` is stale within a bumping recipe, so build recipes
# re-read VERSION inline. Bump MAJOR/MINOR by editing VERSION directly. (ADR-0005)

# Models
just validate-models   # python3 src/model_tools/validate.py on document-models/*.json
just generate-forms    # regenerate default form models from *_DM.json

# Tests — `just test` runs every OFFLINE test + model validation:
just test              # = validate-models + test-version + test-forms + test-cli + test-lifecycle
just test-cli          # cd cli && npm test
just test-lifecycle    # cd model-lifecycle && npm test
just test-forms        # cd src/dm-to-fm && npm test
just test-version      # sh scripts/bump-version.test.sh (deterministic patch bump)
```

Component-level (run a single test / typecheck):

```sh
# Node components (cli, model-lifecycle, src/dm-to-fm) — run via --experimental-strip-types, NO build step
cd cli && npm test                                   # node --test
node --test --experimental-strip-types cli/test/<one>.test.ts   # a single test file
cd <comp> && npm run typecheck                       # tsc --noEmit

# Web client (Vitest)
cd client && npm run dev        # Vite on :5173, proxies /api + /lifecycle
cd client && npm run test       # Vitest, pure logic, no live stack
cd client && npx vitest run src/api/rpc.test.ts      # a single test file
cd client && npm run build      # type-check + bundle (needs A12 packages installed)

# Java Slugifier (the one Java test that runs offline — no A12 deps)
cd server && javac -d /tmp/wiki12-slugtest \
  src/main/java/net/mgmtp/wiki12/slug/Slugifier.java test/SlugifierTest.java \
  && java -cp /tmp/wiki12-slugtest SlugifierTest
```

The full Java Data Service builds **only** as a container (Gradle pulls
`com.mgmtp.a12.*` from artifacts.geta12.com): `docker compose build data-service`.
Don't expect a local `gradle build` to work without the A12 artifacts.

## Architecture

Five services (compose ports → container):

| Service | Port | What |
|---|---|---|
| `client` | 8081→80 | nginx serving the React SPA; proxies `/api`→data-service, `/lifecycle`→model-lifecycle (prefix stripped) |
| `data-service` | 8082→8080 | A12 Data Service (Java/Spring Boot); JSON-RPC at `POST /api/v2/rpc` |
| `model-lifecycle` | 8090 | Node: form-model generation + TS migration runner |
| `postgres` | 8083→5432 | persistence |
| `keycloak` | 8089→8080 | user store; seeds admin/admin (**auth not enforced in the baseline**) |

**Two clients, one contract.** The web client and the `wiki12` CLI both go
through the **same** two boundaries, so they can't diverge:
- **Content** (search / CRUD / resolve) → Data Service JSON-RPC. Ops:
  `ADD_DOCUMENT`, `GET_DOCUMENT`, `QUERY`, `UPDATE_DOCUMENT`/`MODIFY_DOCUMENT`,
  `DELETE_DOCUMENT`, plus two custom A12 `@RemoteOperation`s: **`ResolveBySlug`**
  (try-ID-then-slug) and **`UnifiedSearch`** (batched fan-out across content models).
- **Models / forms / migrations** → the model-lifecycle service over plain HTTP.

**Slug & search derivation lives only in the Data Service** (`server/`,
ADR-0001). A `@CommonDataServicesEventListener` (`WikiContentLifecycleListener`)
derives the read-only `slug` and a `searchText` blob inside the write
transaction, reading field-level `wiki12.*` annotations off the Document Model
(`wiki12.keyField`, `wiki12.derived`, `wiki12.searchable`). Slugs are
`<type>:<name>`, `page` is the default namespace, collisions get a sticky `_N`
suffix fixed at creation. The pure algorithm is isolated in `Slugifier.java` (no
A12 deps, unit-tested); `SlugDerivationService` owns the A12-bound parts
(advisory lock, model read, collision query, document mutation). **There is no
DB-unique-index backstop** — slug uniqueness depends on the advisory-lock spike
(`specs/changes/basic_setup/spike-slug-concurrency.md`).

**Migrations** are A12 `Migration` content items holding **TS source only**
(`models/Migration_DM.json`). The model-lifecycle runner transpiles (esbuild) and
runs the operator's `migrate(doc)` function **per document in a sandbox**
(`isolated-vm` preferred — a real security boundary; `node:vm` is a fallback that
only strips globals, NOT a sandbox). Clients never compile TS. A data-model
version bump is **gated**: deploying a higher content version is rejected (409)
unless a matching `Migration` ships with it (ADR-0003).

**Two version axes** (don't conflate): A12 `header.modelVersion` (e.g. `28.4.0`,
the model *format*) vs. wiki12 content-schema version (integer `1, 2, …`, carried
in DM header annotation `wiki12.version`, what migrations step between).

**Form models are auto-generated** from data models when none is supplied
(`src/dm-to-fm`, "Build Screens From Fields"), so every type is always editable.

### Layout

| Path | What |
|---|---|
| `server/` | Java A12 Data Service: slug listener, `ResolveBySlug` + `UnifiedSearch`, `Slugifier`, Dockerfile (the one place using Gradle) |
| `client/` | React + TS web client on A12 Widgets (search/view/edit/delete, Milkdown markdown editor, System area), nginx |
| `model-lifecycle/` | Node service: form-model gen + TS migration runner |
| `cli/` | the `wiki12` CLI (Node/TS) |
| `models/document-models/`, `models/form-models/` | canonical DMs + generated/explicit FMs |
| `src/dm-to-fm/`, `src/model_tools/` | shared DM→FM generator + the model validator |
| `docker/`, `docker-compose.yml`, `justfile` | Postgres/Keycloak config + orchestration |
| `seed/` | sample content + a seed runner (drives the CLI) |
| `docs/a12/` | in-repo A12 docs mirror |
| `specs/changes/basic_setup/` | proposal, domain, architecture, plan, findings-a12, DECISIONS, QA-LOG, slug spike |
| `docs/adr/` | ADRs 0001–0005 |

## Conventions

- **Node components run TypeScript directly** via `node --experimental-strip-types`
  — no build/transpile step for `cli`, `model-lifecycle`, `src/dm-to-fm`, `seed`.
  Tests use the built-in `node --test`. The web client is the exception (Vite + Vitest).
- **Model-name mapping**: type → data-model name by capitalizing + `_DM`
  (`page`→`Page_DM`, `person`→`Person_DM`); form models use `_FM`. Strip `_DM`/`_FM`
  before normalizing a type name.
- **Identifiers**: either a Technical ID or a Slug names an item; resolution is
  **try-ID-then-slug**, and a bare name defaults to the `page:` namespace. Slugs
  are read-only/system-derived — surface `old → new` when an edit changes one.
- **Build is per-component, driven by compose** (ADR-0005): no top-level Gradle;
  every image is stamped with the single `VERSION` (`WIKI12_VERSION`).
- **Read the ADRs** (`docs/adr/`) before changing slug/identity (0001),
  A12-extensibility approach (0002), the migration workflow (0003), the
  one-content-mechanism model (0004), or build/deploy structure (0005).

## Web-app testing (global rule)

After building or modifying the web client, start the dev server, open it in the
browser, and verify it renders before declaring done. Save all browser-agent
artifacts (screenshots, snapshots, logs) under `tmp/` (already gitignored).

**Playwright screenshots must always be written to `tmp/`** (which is gitignored)
— never to the repo root or any tracked path. Verify `tmp/` is in `.gitignore`
before capturing.

## Skills

Vendored [mattpocock skills](https://github.com/mattpocock/skills) in
`.claude/skills/` (Claude Code) and `.agents/skills/` (Codex): `/grill-with-docs`,
`/tdd`, `/diagnose`, `/to-prd`, `/zoom-out`, `/improve-codebase-architecture`.
