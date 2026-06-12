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

## Risk (hard gate)

Server-side enforcement assumes A12's stock Data Service exposes a server-side
extension point (computed field / write hook / interceptor) capable of running
this logic. **This is unverified.** Step 0 of the plan must confirm it before
implementation. If no such hook exists, this decision is revisited — the
fallback is a thin façade service in front of the Data Service that owns slug
logic (keeping the single-boundary guarantee); pushing derivation into the
clients is explicitly rejected, because direct API writes (seeds, migrations,
future clients) would bypass it and corrupt uniqueness. This is a specific
instance of the broader extensibility gate in ADR-0002.
