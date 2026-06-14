# Domain — Slug-based URLs

This change introduces no new content concepts. It adds **URL vocabulary** on top
of the existing identity model (CONTEXT.md: *Content item / Page / Entity / Slug /
Technical ID*). The Slug already exists and is canonical — we are giving it a
**presentation as a URL**.

## Existing concepts (unchanged, recalled for grounding)

- **Slug** — the read-only, system-maintained human handle, namespaced
  `<type>:<name>` (`page:albert_einstein`, `person:till_gartner_5`). Lowercase,
  name chars `[a-z0-9_]`, `:` is the reserved namespace delimiter, `page` is the
  default namespace, collisions get a sticky numeric suffix. **This is the string
  that goes in the URL, verbatim.**
- **Technical ID** — the opaque stable identifier; target of all references.
  Remains a valid way to address an item in a URL (fallback), but is *never the
  primary human handle* — so it is not the canonical link.
- **try-ID-then-slug** — the existing resolution rule (ADR-0001): a ref is
  resolved as a Technical ID first, then as a Slug. Deep-link URLs ride on this
  unchanged.

## New / clarified terms

**Deep link** *(already used in functional.md — now made precise)*
: A bookmarkable client URL that addresses one content item by its **Slug**:
  `/view/<slug>` (read) and `/edit/<slug>` (edit). The path segment is the Slug
  exactly as the CLI would accept it. A Technical ID is also accepted in the same
  position as a fallback.
  _Avoid_: Permalink, URL key (per CONTEXT.md slug guidance).

**Search URL**
: The shareable client URL for a cross-model search: `/search?q=<query>` with an
  optional `&type=<type>` filter. Distinct from the Browse landing (`/`), which is
  a list-all gallery with an in-memory filter, not a search.
  _Avoid_: Query page, results route.

**Slug URL ⇄ Slug identity**
: The Slug is the **single source of truth**; the URL is one rendering of it.
  Because the Slug's character set is URL-safe by construction, the rendering is
  the identity (no escaping, no transform). A URL therefore round-trips to a Slug
  with no information loss.

## Relationship to identity

```mermaid
flowchart TD
  KF["Key Fields"] -->|f(KeyFields, creation order)| SLUG["Slug<br/>page:albert_einstein"]
  ID["Technical ID<br/>opaque uuid"]
  SLUG -->|canonical link| URL["/view/page:albert_einstein"]
  ID -.->|fallback link| URL2["/view/&lt;Model&gt;_DM/&lt;uuid&gt;"]
  URL -->|try-ID-then-slug| RESOLVE["ResolveBySlug"]
  URL2 -->|try-ID-then-slug| RESOLVE
  RESOLVE --> ITEM["Content item"]
```

## Actors & interactions

- **Reader** opens/shares a `/view/<slug>` link, or a `/search?q=` link.
- **Editor** opens `/edit/<slug>`; on saving a Key-Field change, the Slug may
  change — the client navigates to the **new** slug URL and surfaces `old → new`
  (existing behavior, CONTEXT.md "the change is surfaced to the user").

## Lifecycle note (why a fallback exists)

A Slug is *stored state* derived server-side at write time, surfaced on read in
the content **envelope** (alongside `Title`, `CreatedOn`, `Changes`). Until the
server consistently surfaces it (ongoing work), the client may only have the
Technical ID — hence Technical-ID links remain first-class. This is a transitional
property, not a permanent dual-identity in URLs: the **Slug is the intended
canonical link**.
