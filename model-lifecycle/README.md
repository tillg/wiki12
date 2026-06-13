# @wiki12/model-lifecycle

The wiki12 **model-lifecycle service** (Node/TypeScript). It owns the two pieces
of model-lifecycle tooling that the architecture keeps server-side so the web
client and the `wiki12` CLI can't diverge (architecture.md §2, §5; ADR-0003):

1. **Default form-model generation** — when a data model is deployed without an
   explicit form model, generate + store one (reusing `src/dm-to-fm`, the
   headless "Build Screens From Fields").
2. **The TS migration runner** — transpile an operator-supplied TypeScript
   migration and run it **per document in a sandbox**, with dry-run and a
   slug-change manifest.

It talks to the A12 Data Service over JSON-RPC 2.0 and is itself stateless apart
from an in-memory registry of deployed models + migrations (baseline; Data
Service-backed persistence comes later).

## Run

```bash
npm install            # esbuild (required) + isolated-vm (optional native addon)
npm start              # node --experimental-strip-types src/server.ts
npm test               # node --test (built-in runner)
npm run typecheck      # tsc --noEmit
```

Environment:

| Var | Default | Meaning |
|---|---|---|
| `MODEL_LIFECYCLE_PORT` | `8090` | HTTP listen port |
| `WIKI12_DATA_SERVICE_URL` | `http://data-service:8080` | Data Service base URL (JSON-RPC at `…/api/v2/rpc`) |
| `WIKI12_VERSION` | `0.1.0` | reported by `GET /health` |

## Routes

Served at root. The web client reaches them via an nginx `/lifecycle` prefix
that is stripped; the CLI calls them directly.

| Method + path | Purpose |
|---|---|
| `GET /health` | `200 {status:"ok",version}` |
| `GET /form-model/:type` | stored/generated form model JSON for a type |
| `PUT /form-model/:type` | store an explicit form model (type must be deployed first) |
| `GET /migrations` | list `Migration` items |
| `GET /migrations/:id` | one `Migration` (`id = <targetModel>:<from>-<to>`) |
| `PUT /migrations/:id` | update a `Migration`'s TS `script` source |
| `POST /models` | deploy a data model — **the upload gate** (see below) |
| `POST /migrate` | run a stored migration (dry-run aware) |

`POST /models` body: `{ documentModel, migration? }`. Response:
`{ type, version, formModelGenerated }`.

`POST /migrate` body: `{ type, from, to, dryRun? }`. Response — the report:
`{ count, migrated, failures:[{id,error}], slugManifest:[{id,oldSlug,newSlug}] }`.

## The migration contract

A migration is stored as a **`Migration` content item** (an A12 document model,
`models/Migration_DM.json`): `targetModel`, `fromVersion` (Number), `toVersion`
(Number), `script` (String, `lineBreaksPermitted` = the TS source). Clients
upload **TS source only**.

The `script` must **default-export OR export `migrate`** a **pure** function
transforming ONE document from vN to vN+1:

```ts
export function migrate(doc) {
  return { ...doc, Person: { ...doc.Person, FullName: /* … */ } };
}
export default migrate;
```

The runner owns everything else — iteration, fetching (`QUERY` by
`/__meta/modelVersion`), writing back (`MODIFY_DOCUMENT`), dry-run, and reporting.
The function must not do IO. A worked example lives in
[`examples/person_v1_to_v2.ts`](examples/person_v1_to_v2.ts) (Person v1→v2 adding
`FullName`), exercised end-to-end in `test/runner.test.ts` against a fake
in-memory Data Service.

### Two notions of "version"

- A12 `header.modelVersion` (`"28.4.0"`) — the A12 model **format** version.
- wiki12 **content-schema version** (integer `1, 2, …`) — what migrations step
  between, what `POST /migrate {from,to}` uses, and what the gate compares. It is
  carried in a DM header annotation `wiki12.version` (defaults to `1`).

## The upload gate

Enforced in `src/registry.ts` at `POST /models`: if the deployed model's content
version is **greater** than the currently-deployed version, the deploy is
**rejected (409)** unless a matching `Migration` (`targetModel`, `fromVersion =
current`, `toVersion = new`) is included in the body. A first deploy (no prior
version) and a same-version re-deploy need no migration. Downgrades are rejected.
On accept, the default form model is generated + stored if none exists yet.

## Sandbox choice

Migration scripts are **untrusted operator code** (in the unauthenticated
baseline anyone reaching the service can drive it — ADR-0003 accepted risk), so
execution runs with **no fs / no net**.

- **Preferred: `isolated-vm`** — a true V8 isolate with no ambient Node globals.
  It is installed and verified working in this environment.
- **Fallback: `node:vm`** — a frozen, fs/net-free context with code-generation
  disabled. Selected automatically only if `isolated-vm` fails to install/load.

The active backend is chosen at runtime (`src/migrate/sandbox.ts`,
`getSandbox()`), preferring `isolated-vm`. The transform receives the document as
a JSON string and returns one — no live references cross the boundary.

## `// VERIFY` / accepted-risk notes

- `src/migrate/sandbox.ts` — **`// VERIFY: harden sandbox (isolated-vm) before
  running untrusted operator scripts`.** The `node:vm` fallback is *not* a
  security boundary (vm escapes are possible); it only removes ambient globals.
  Ensure `isolated-vm` is the active path wherever untrusted scripts run.
- **Slug manifest is a prediction.** Authoritative slug (re)computation +
  uniqueness (`_N` suffix) live in the Data Service (ADR-0001). The runner mirrors
  only the slug **text-part** rule to predict which instances would rename
  (`src/migrate/slug.ts`); the real final slugs come back from the Data Service on
  write. The manifest shows the operator the blast radius before committing.
- **In-memory registry.** Deployed models + migrations are held in memory in the
  baseline. Persisting them as `Migration` content items in the Data Service is a
  later step; the `Migration_DM.json` model is already authored + validated.
- **RPC method names** (`QUERY`, `MODIFY_DOCUMENT`) match the A12 docs; the
  transport is injectable (`src/dataservice.ts`) so the write op name can be
  adjusted to the exact Data Service contract without touching the runner.

## Files

```
model-lifecycle/
├── package.json            @wiki12/model-lifecycle (start/test/typecheck)
├── tsconfig.json
├── Dockerfile              node:22-alpine; build context = REPO ROOT
├── models/
│   └── Migration_DM.json   the Migration content-item model (validated)
├── examples/
│   └── person_v1_to_v2.ts  worked migration (adds FullName)
├── src/
│   ├── server.ts           entrypoint: wire HTTP transport + http.createServer
│   ├── app.ts              route handler (DI: registry + dataService)
│   ├── formgen.ts          wraps src/dm-to-fm generate
│   ├── registry.ts         deployed-version tracking + the upload gate
│   ├── dataservice.ts      JSON-RPC client (injectable transport)
│   ├── types.ts            shared types (DM/FM imported read-only from dm-to-fm)
│   └── migrate/
│       ├── runner.ts       transpile + sandbox + iterate + report
│       ├── sandbox.ts      isolated-vm (preferred) / node:vm (fallback)
│       └── slug.ts         slug-change prediction for the manifest
└── test/                   node --test: gate, runner, server, fixtures
```

## Docker

The image builds from the **repo root** (it needs both `model-lifecycle/` and
`src/dm-to-fm/`). docker-compose already wires this:

```yaml
build:
  context: .
  dockerfile: model-lifecycle/Dockerfile
  args: { WIKI12_VERSION: ${WIKI12_VERSION:-0.1.0} }
```
