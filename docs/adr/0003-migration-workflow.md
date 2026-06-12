# Migration workflow

Data Models are versioned. Bringing existing instances from version N to N+1 is
done by a **TypeScript migration**, run by the **`wiki12` CLI** (Node is already
present for the CLI, keeping the Java Data Service free of a JS runtime).
Migrations are discovered by filesystem convention: `migrations/<type>/<N-1>-<N>.ts`.

## Script signature: single-document transform

A migration exports a pure function over **one A12 content document**:
`(doc at version N) → (doc at version N+1)`. The runner fetches each instance's
A12 document, applies the transform, and writes the upgraded document back. The
script has no batch/IO concerns — iteration, fetching, writing, dry-run, and
reporting all live in the runner; the script only describes the per-document
shape change. `page` is a valid migration target like any entity type (it has a
versioned data model too).

## Bump is gated on the migration file

The proposal's invariant — *no model version bump ships without its migration* —
is enforced at registration, not left to discipline: `wiki12 model update
<type> --version N` **refuses unless `migrations/<type>/<N-1>-<N>.ts` exists**.
Execution stays a separate, dry-runnable step (`wiki12 migrate <type> --from
<v> --to <v> [--dry-run]`), so operators still control *when* data transforms
and can stage a cutover. We chose this over coupling bump+migrate into one
atomic command (which loses the controlled dry-run workflow) and over a
warn-only detector (which lets the invariant be violated).

## Dry-run surfaces the slug-change manifest

A migration whose transform alters Key Fields triggers server-side slug
recomputation for every migrated instance (ADR-0001) — a mass rename in which
old slugs 404. So `--dry-run` reports the **full old→new slug manifest** it would
cause, and the real run's report lists the same. No suppression and no special
flag: this reuses the dry-run and the slug-change-notification rules already
decided, and makes the blast radius visible before the operator commits.
