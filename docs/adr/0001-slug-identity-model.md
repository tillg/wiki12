# Slug identity model

Every Page and Entity has two identifiers: an opaque server-assigned **Technical
ID** (the reference/persistence target) and a human-facing **Slug**. The Slug is
read-only and system-derived. **Every slug is namespaced `<type>:<name>`**,
derived from that type's Key Fields — `page:albert_einstein`,
`person:till_gartner`. `page` is a built-in type that always exists and is the
default namespace. We chose this split (rather than a single user-editable
handle) so references stay stable while handles stay readable, and uniform
namespacing so Pages and Entities share one grammar.

## Derivation, uniqueness, and change

- **Server-side derivation.** Slug derivation, global uniqueness, and the
  old→new diff are enforced once at the A12 Data Service boundary, so the web
  client and `wiki12` CLI cannot diverge. Slugs are (re)computed on create and
  whenever a Key Field changes.
- **Format.** Slugs are `<type>:<name>`; `<name>` is lowercase, `[a-z0-9_]` with
  `_` as word separator (`Till Gartner` → `till_gartner`); `:` is the reserved
  namespace delimiter. `page` is the default namespace.
- **Sticky numeric suffix on collision.** Identical derived slugs disambiguate
  as `…`, `…_2`, `…_3`, assigned at creation order and never recomputed. So
  `slug = f(Key Fields, creation order)` — stored state, not a pure function of
  current Key Fields. Deleting an earlier item does **not** renumber later ones
  (no URL churn).
- **Rename surfaces, old slug 404s.** When a write changes a slug, the Data
  Service returns old→new and clients show a clear statement. The old slug is
  **not** preserved — it 404s. Accepted limitation: renaming a Key Field rots
  existing links. Aliases/redirects are deferred to the relationships/graph
  change, where stable handles start to matter.

## Resolution: either identifier

Anywhere an item is named (CLI argument, API path, link), both the Technical ID
and the Slug are accepted. Resolution is **try-ID-then-slug**: look the value up
as a Technical ID, and on miss retry as a Slug; a value with no `<type>:` prefix
is resolved in the default `page` namespace (`albert_einstein` → `page:albert_einstein`).
Both slugs and IDs now use `_`,
so the disjointness rests on **case + structural pattern**: Technical IDs keep
the ULID's canonical uppercase form (`pg_01H8X…`), slugs are always lowercase, and
ID lookup is case-sensitive — so a lowercase slug can never hit an ID. As
belt-and-suspenders, derivation also forbids a slug from matching the full
`<prefix>_<ULID>` pattern. Cost: read-by-slug pays a harmless extra ID lookup
first. Resolution happens server-side (the Data Service already owns slug logic).

## Risk (hard gate) — narrowed to race-safety

The broad extensibility gate (ADR-0002) is **RESOLVED = GO**: the stock Data
Service hosts the slug logic (before-write listener), so derivation, the old→new
diff, and single-boundary enforcement are settled, and the façade fallback is
dropped. Pushing derivation into clients remains rejected (direct API writes —
seeds, migrations, future clients — would bypass it).

What is **still unverified** is *race-safe global uniqueness* under concurrent
creates of the same name. The review gate chose the **transaction-scoped Postgres
advisory lock** as the mechanism, with **no DB-index backstop** — so this is a hard
gate before Step 2. The required A12 primitive is unconfirmed, so a spike probes
**two** at once (`specs/changes/basic_setup/spike-slug-concurrency.md`):

- **A — raw `DataSource`/`JdbcTemplate` injection** → enables the advisory lock
  (primary mechanism).
- **B — optimistic locking on document `update`** (stale writes rejected) →
  enables a no-raw-SQL fallback: a per-`(model,name)` counter used as the
  *primary* number generator, or retry-on-conflict.

Decision matrix: **A pass → advisory lock**; **A fail, B pass → counter / retry**;
**both fail → reopen the rejected DB partial unique index** (the only remaining
hard guarantee). Confirm before writing slug code in Step 2.
