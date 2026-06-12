# Migration workflow

> **Revised at the Step 0 review gate (2026-06-12).** This supersedes the
> original "runner-in-CLI / migrations-as-filesystem-files" design. Models are
> **runtime-deployable**, so a migration script baked into an image can't be
> deployed at runtime — execution and storage move server-side. See
> `findings-a12.md §4`.

Data Models are versioned. Bringing existing instances from version N to N+1 is
done by a **TypeScript migration** — a pure function over **one A12 content
document**: `(doc at version N) → (doc at version N+1)`. The runner owns
iteration, fetching, writing, dry-run, and reporting; the script only describes
the per-document shape change. `page` is a valid migration target like any
entity type (it has a versioned data model too).

## Execution lives in a server-side Node component

A **server-side Node component** (in the docker-compose stack) owns the TS
tooling triggered by the **model lifecycle**: form-model generation and the
**migration runner**. The split with the Java Data Service is clean:

- **Java Data Service** — per-document runtime logic (slug derivation,
  `searchText`, uniqueness, CRUD), **model registration**, and the JVM kernel
  codegen (`validation.js` / typed accessors) served for the client to fetch.
- **Node component** — model-lifecycle TS tooling: the form generator
  (`src/dm-to-fm`, a shared pure library also reusable in the React client) and
  the migration runner.

**No client owns form generation or migration** — both the web client and the
`wiki12` CLI call the server-side path, so the two can't diverge.

## Migrations are stored as content items, not files

Because models deploy at runtime, migrations are stored as
**`Migration` content items** — an A12 document model
(`targetModel`, `fromVersion`, `toVersion`, `script` = **TS source**, …) keyed by
`(model, fromVersion, toVersion)`. Reuses the Data Service for storage —
queryable, versioned, access-controlled, no new infra; on-brand with "everything
is a content item". Clients upload **TS source only** — the `wiki12` CLI **and**
the web client's System → Migrations area, which edits each `Migration`'s TS in a
simple text editor (baseline). Because a browser TS-editor must not be the
compile boundary, transpile is server-side (next section).

## The Node service owns transpile + sandboxed execution

So a future WebApp TS-editor can't bypass a client-side compile, **TS→JS
transpile is the Node service's job** (esbuild/swc), not the CLI's. The service
runs the compiled function **per document in a sandbox** (`isolated-vm` or a
locked-down worker — no fs, no net). Safe because the per-doc transform is **pure
by design**; the runner owns iteration/IO/reporting. **Executing
operator-uploaded code ⇒ the sandbox is mandatory.**

> **Accepted risk (auth is out of scope in `basic_setup`).** Runtime
> migration-upload + server-side execution is a code-execution surface that, in
> the unauthenticated baseline, anyone who can reach the Node service can drive.
> The sandbox (no fs/net) is the mitigation until auth lands in a later change.

## Bump is gated on the migration at upload

The invariant — *no model version bump ships without its migration* — is enforced
at **upload**: a model-version bump is rejected unless its matching `Migration`
content item is uploaded with it (one combined `wiki12` deploy op). Execution
stays a separate, dry-runnable step (`wiki12 migrate <type> --from <v> --to <v>
[--dry-run]`), so operators control *when* data transforms. Chosen over coupling
bump+migrate into one atomic command (loses the dry-run workflow) and over a
warn-only detector (lets the invariant be violated).

## Dry-run surfaces the slug-change manifest

A migration whose transform alters Key Fields triggers server-side slug
recomputation for every migrated instance (ADR-0001) — a mass rename in which old
slugs 404. So `--dry-run` reports the **full old→new slug manifest** it would
cause, and the real run's report lists the same. This reuses the dry-run and the
slug-change-notification rules already decided, making the blast radius visible
before the operator commits.
