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
wiki12 page create --field Title="Albert Einstein" --field Body="# Physicist"
wiki12 page read  albert_einstein           # by slug (bare name => page:)
wiki12 page read  pg_01HXYZ                  # by Technical ID
wiki12 page update albert_einstein --field Title="A. Einstein"
wiki12 page delete page:albert_einstein
wiki12 page search einstein

# Entities (any user-defined type)
wiki12 entity --type person list
wiki12 entity --type person create --field FirstName=Till --field LastName=Gartner
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
| create | `ADD_DOCUMENT` | `{ documentModelName, locale, document }` → `{ docRef }` |
| read by ref | `GET_DOCUMENT` | `{ docRef: "<Model>/<uuid>" }` → `{ document }` |
| list | `QUERY` | `{ query: { targetDocumentModel, projectionName, paging } }` |
| update | `MODIFY_DOCUMENT` | `{ docRef, document }` (returns void) |
| delete | `DELETE_DOCUMENT` | `{ docRef }` |
| resolve a slug | `ResolveBySlug` (custom) | `{ idOrSlug, type }` → resolved document/ref |
| unified search | `UnifiedSearch` (custom) | `{ query, kind?, type? }` → `[{ kind, type, id, slug, title, snippet }]` |

`document` is the **group-keyed** payload `{ <Group>: { ...fields } }` (Group = the
capitalized type, e.g. `Page`/`Person`); the CLI wraps the flat `--field` pairs
into it. `MODIFY_DOCUMENT` accepts **only** `{ docRef, document }` — adding
`documentModelName`/`locale` is rejected (QA-LOG B21).

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

The content-op shapes (op names + param keys) were **confirmed** against the
validated web client (`client/src/api/content.ts` + `search.ts`, run against a
live stack — QA-LOG B14/B21) and the custom-op server source, and updated in the
contract table above. What remains open, marked `// VERIFY` in the source:

- **`resolve.ts`** — the **Technical ID grammar**. We treat a ref as an ID when
  it is *not* slug-shaped (slug = `(<ns>:)?[a-z0-9_]+`), i.e. it contains an
  uppercase letter or a char outside `[a-z0-9_:]`. The domain says "the ID
  grammar is reserved so the two never collide" but does not pin the exact
  prefix/charset. A lowercase, underscore-only token (e.g. `pg_1`) is currently
  read as a **slug**, not an ID.
- **`resolve.ts`** — `ResolveBySlug` **return shape**. The param is now
  `idOrSlug` (+ `type`) per the server `@JsonRpcParam`, but the server returns
  the resolved A12 document and its mapping is still **stubbed**
  (`extractDocRef` → null), so this path is not yet validated end-to-end. We
  accept `{ docRef }` or `{ type, id }` defensively.
- **`entity.ts`** — the **QUERY result envelope** (`PagedResultSet`) and the
  per-row `{ slug, id }` projection. The request spec is confirmed; the response
  is coerced defensively (bare array / `{ content }` / `{ results }`).
- **`entity.ts`** — the **`document` root group** = capitalized type. Holds for
  every sample DM (`Page`/`Person`/`Film`/`Location`); a DM whose root group
  differs from its type would need its group read from the model.
- **`entity.ts`** — the **slug-change-on-write** signal. `MODIFY_DOCUMENT`
  returns void and slug re-derivation is owned by the server-side lifecycle
  listener (Tier-2), so an old→new slug change surfaces on the next read, not
  from the write. `slugChangeMessage` is kept as a pure helper for when that
  lands.
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

Tests inject a **mock transport** (no live server) and cover every command and
subcommand plus corner cases: arg/flag parsing (incl. `-h`, repeated flags,
value-flag-as-switch); the full content-op contract (group-keyed `ADD_DOCUMENT`,
`MODIFY_DOCUMENT`, nested `QUERY`, `docRef` extraction, `ResolveBySlug idOrSlug`);
`--field` collection edge cases (empty value, `=` in value, trailing `--field`,
last-wins); id-vs-slug resolution dispatch; model/form/migrate routes and the
migrate exit code (failures → exit 1); usage errors (exit 2); and search hit
formatting. `page` sugar is verified to route identically to `entity --type page`.
