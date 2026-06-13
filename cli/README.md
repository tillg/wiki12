# `wiki12` CLI

Operator/developer CLI for the wiki12 A12 wiki: content CRUD, data-model and
form-model management, and migrations. Both this CLI and the web client talk to
the **same** services — "two clients, one contract" (see
`specs/changes/basic_setup/architecture.md` §6).

- **Content** (`search`, `page`, `entity`) → the **A12 Data Service**
  (JSON-RPC 2.0 over `POST /api/v2/rpc`).
- **Models / forms / migrations** (`model`, `form`, `migrate`) → the
  **model-lifecycle service** (plain HTTP).

## Install / run

Node 22+. Runs directly via `--experimental-strip-types` — **no build step**
(same idiom as `src/dm-to-fm`).

```bash
cd cli
npm install                 # @types/node + typescript (dev only)
npm start -- <command> ...  # e.g. npm start -- page list
# or invoke the entrypoint directly:
node --experimental-strip-types src/index.ts <command> ...
```

Scripts: `npm start` (run), `npm test` (Node test runner), `npm run typecheck`
(`tsc --noEmit`).

## Environment

| Variable | Default | Used by |
|---|---|---|
| `WIKI12_DATA_SERVICE_URL` | `http://localhost:8082` | `search`, `page`, `entity` |
| `WIKI12_MODEL_LIFECYCLE_URL` | `http://localhost:8090` | `model`, `form`, `migrate` |

## Commands

Every command and subcommand supports `-h`/`--help`; `wiki12 -h` prints the
overview.

```text
wiki12 search  <query>                                [--kind page|entity] [--type <type>]
wiki12 page    list|create|read|update|delete|search  <id-or-slug>
wiki12 entity  list|create|read|update|delete|search  --type <type> <id-or-slug>
wiki12 model   list|create|read|update                <type>
wiki12 form    list|create|read|update                <type>
wiki12 migrate <type> --from <v> --to <v> [--dry-run]
```

### Identifiers (either ID or slug)

Items are addressable by **either** their Technical ID **or** their slug
(domain.md "Identifiers", ADR-0001). Resolution is **try-ID-then-slug**: a
ref that is ID-shaped is read directly; otherwise it is treated as a slug and
resolved via the `ResolveBySlug` op. A **bare name defaults to the `page:`
namespace** (`albert_einstein` → `page:albert_einstein`).

Slugs are **read-only and system-derived**. When an `update` changes an item's
slug, the CLI prints a clear message:

```
Slug changed: page:old_title -> page:new_title  (the old slug now 404s)
```

### Examples

```bash
# Unified search across all content
wiki12 search "albert einstein"
wiki12 search "einstein" --kind entity --type person

# Pages (sugar for: entity --type page)
wiki12 page list
wiki12 page create --field title="Albert Einstein" --field body="# Physicist"
wiki12 page read  albert_einstein           # by slug (bare name => page:)
wiki12 page read  pg_01HXYZ                  # by Technical ID
wiki12 page update albert_einstein --field title="A. Einstein"
wiki12 page delete page:albert_einstein
wiki12 page search einstein

# Entities (any user-defined type)
wiki12 entity --type person list
wiki12 entity --type person create --field firstName=Till --field lastName=Gartner
wiki12 entity --type person read person:till_gartner

# Data models (model-lifecycle service). A version bump uploads the model AND
# its Migration together (gated — ADR-0003).
wiki12 model list
wiki12 model read   person
wiki12 model create person --file Person_DM.json
wiki12 model update person --file Person_DM.json --migration 1-2.ts --to-version 2

# Form models (a type with no explicit form gets a generated default)
wiki12 form read   page
wiki12 form update page --file Page_FM.json

# Migrations (dry-run reports the slug-change manifest before writing)
wiki12 migrate person --from 1 --to 2 --dry-run
wiki12 migrate person --from 1 --to 2
```

## Contract this CLI depends on

**Data Service** — JSON-RPC 2.0, `POST {WIKI12_DATA_SERVICE_URL}/api/v2/rpc`,
body `{"jsonrpc":"2.0","id":N,"method":"<OP>","params":{...}}`:

| Purpose | Op | Params (this CLI sends) |
|---|---|---|
| create | `ADD_DOCUMENT` | `{ model, fields }` |
| read by ref | `GET_DOCUMENT` | `{ docRef: "<Model>/<uuid>" }` |
| list / read-by-field | `QUERY` | `{ targetDocumentModel }` |
| update | `UPDATE_DOCUMENT` | `{ docRef, fields }` |
| delete | `DELETE_DOCUMENT` | `{ docRef }` |
| resolve a slug | `ResolveBySlug` (custom) | `{ ref }` → `{ docRef }` or `{ type, id }` |
| unified search | `UnifiedSearch` (custom) | `{ query, kind?, type? }` → `[{ kind, type, id, slug, title, snippet }]` |

**Model-lifecycle service** — HTTP at `{WIKI12_MODEL_LIFECYCLE_URL}`:

| Purpose | Route |
|---|---|
| list / read / upload data models | `GET /models`, `GET /models/:type`, `POST /models` (model + Migration, gated) |
| read / write form model | `GET /form-model/:type`, `PUT /form-model/:type` |
| run a migration | `POST /migrate` `{ type, from, to, dryRun }` → report (incl. slug manifest) |
| list / write migrations | `GET /migrations`, `PUT /migrations` |

**Model-name mapping:** type → data-model name by capitalizing + `_DM`
(`page` → `Page_DM`, `person` → `Person_DM`).

## `// VERIFY` assumptions

These are this CLI's assumptions about exact A12 op/route shapes, marked
`// VERIFY` in the source. They build the requests the contract above implies,
but the precise param/route names were inferred and should be confirmed against
the running Data Service + model-lifecycle service:

- **`resolve.ts`** — the **Technical ID grammar**. We treat a ref as an ID when
  it is *not* slug-shaped (slug = `(<ns>:)?[a-z0-9_]+`), i.e. it contains an
  uppercase letter or a char outside `[a-z0-9_:]`. The domain says "the ID
  grammar is reserved so the two never collide" but does not pin the exact
  prefix/charset. A lowercase, underscore-only token (e.g. `pg_1`) is currently
  read as a **slug**, not an ID.
- **`resolve.ts`** — `ResolveBySlug` **return shape**: assumed `{ docRef }` or
  `{ type, id, slug }`.
- **`entity.ts`** — **op names for update/delete**: assumed `UPDATE_DOCUMENT` /
  `DELETE_DOCUMENT`. `ADD_DOCUMENT` / `GET_DOCUMENT` / `QUERY` are documented
  (findings §3).
- **`entity.ts`** — create/update **param keys**: assumed `{ model, fields }`
  for create and `{ docRef, fields }` for update; `QUERY` uses
  `{ targetDocumentModel }`. (Findings §3 shows `targetDocumentModel`; the exact
  create payload key — `fields` vs `document` — is assumed.)
- **`entity.ts`** — the **slug-change** signal on a write: assumed the write
  result carries `slugChange: { from, to }`. The contract says the Data Service
  "returns old→new on such writes"; the exact field name is assumed.
- **`model.ts`** — `/models` **read route** (`GET /models/:type`) and the
  **upload payload** (`{ type, model, migration?, toVersion? }`) are assumed.
- **`form.ts`** — **list route** `GET /form-model` is assumed (the contract
  pins `GET/PUT /form-model/:type` but not list).
- **`migrate.ts`** — the **report shape**
  (`{ migrated, failed, dryRun, slugManifest: [{ id?, from, to }] }`) is
  assumed; only `{ type, from, to, dryRun }` on the request is pinned.

## Tests

```bash
npm test   # node --test --experimental-strip-types test/*.test.ts
```

Tests inject a **mock transport** (no live server) and cover: arg/flag parsing
incl. `-h`; JSON-RPC request building for create/read/update/delete/search;
id-vs-slug resolution dispatch; `page` sugar → `entity --type page`; and the
slug-change message formatting.
