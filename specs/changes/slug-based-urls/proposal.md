# Proposal — Slug-based URLs

## What

Make the web client's URLs **address content by its Slug**, and add a
**shareable search URL**.

- **View** a deep link: `/view/page:albert_einstein`, `/view/person:till_gartner_5`
- **Edit** a deep link: `/edit/page:albert_einstein`, `/edit/person:till_gartner_5`
- **Search**: `/search?q=einstein` (optionally `&type=person`)

The URL path segment **is the Slug verbatim** — colon delimiter and all
(`<type>:<name>`, per CONTEXT.md). No alternate encoding, no `_`-for-`:`
substitution: what you see in the address bar is the Slug you'd type into the
CLI.

## Why

The Slug is wiki12's "read-only, system-maintained human handle" (CONTEXT.md).
It's the natural thing to put in a URL: stable enough to bookmark, readable, and
already the cross-client identifier. Two gaps today:

1. **View/edit URLs don't actually carry the Slug.** The routes
   `/view/:ref` and `/edit/:ref` already exist (react-router v7), and `:ref`
   already accepts an id-or-slug. But the client never surfaces the *real* Slug:
   reads return the `docRef` (`<Model>_DM/<uuid>`) as a stand-in
   (`client/src/api/content.ts:66`), and gallery cards navigate by `docRef`
   (`client/src/api/search.ts:71`) — both carrying the comment *"real slugs need
   the extension listener"*. So in practice the address bar shows
   `/view/Page_DM%2F<uuid>`, not `/view/page:albert_einstein`. This change closes
   that gap on the client side and makes the Slug the canonical link.

2. **Search isn't deep-linkable.** The Browse landing (`/`) has an in-memory
   filter box over the already-loaded gallery (`filterCards`), but no URL — you
   can't bookmark or share "everything matching einstein". A real cross-model
   search (`unifiedSearch`) exists in `api/search.ts` but nothing routes to it.

## Scope

```mermaid
flowchart LR
  subgraph in["In scope"]
    A["View/edit links emit the real Slug (colon-literal)"]
    B["Read path surfaces the Slug envelope field"]
    C["New /search?q=&type= route over unifiedSearch"]
    D["Header search box -> /search"]
    E["Graceful fallback to Technical ID when Slug absent"]
    J["Browse 'Full size' navigates to the deep link; split-pane keeps '/'"]
  end
  subgraph out["Out of scope"]
    F["Server slug-derivation listener (separate, ongoing work)"]
    G["ResolveBySlug server op availability"]
    H["CLI URL changes (CLI uses refs, not URLs)"]
    I["Auth / access control"]
  end
```

**In scope (client):**
- Build view/edit deep links from the **Slug** (raw, colon-literal), falling back
  to the Technical ID when no Slug is available yet.
- Surface the real `Slug` from a document read (read the envelope `Slug` field
  instead of substituting the `docRef`).
- Add a `/search?q=…&type=…` route that renders `unifiedSearch` results as the
  same content cards the gallery uses.
- Add a search input (application header) that navigates to `/search`.
- Keep `/view/:ref` and `/edit/:ref` resolving **either** a Slug **or** a
  Technical ID (try-ID-then-slug is preserved — old/ID links keep working).
- **Browse landing URL behavior:** opening a card's **inline** (split-pane)
  detail leaves the URL at `/` (a transient, in-page interaction). Switching that
  detail to **Full size** navigates to the deep link `/view/<slug>` (the
  standalone, bookmarkable view); returning to split / closing goes back to `/`.

**Out of scope:**
- The **server-side** Slug derivation (the `WikiContentLifecycleListener`) and the
  `ResolveBySlug` / envelope contract. This is the *"implementation work still
  ongoing"* the request acknowledges. This change is written to **degrade
  gracefully**: until the server surfaces real Slugs, links fall back to
  Technical IDs and everything keeps working; the moment the Slug is present in
  reads/search, the URLs become slug-based with no further client change.
- CLI changes — the CLI addresses items by ref, not URL.
- Authentication/authorization.

## Expected outcome

**Gating:** slug-based URLs are only *fully realized* once the server surfaces the
`Slug` envelope field on reads/search **and** `ResolveBySlug`'s row extraction
lands (today both are stubbed — system architecture.md §"As-built status",
QA-LOG B8/B10). This change is the **client half**; it is built to degrade
gracefully and ships independently. So the outcomes split in two:

**Verifiable now (this change, on a current stack):**
- The view/edit link builder and route decode go through a single pure helper
  (`refSegment`/`refFromParam`/`isSlug`) — a Slug interpolates colon-literal, a
  docRef is percent-encoded; round-trips both. (Unit-tested.)
- `/search?q=einstein` (and `&type=person`) is a shareable search over the
  existing client-side fan-out (`unifiedSearch`).
- After create/edit, the client navigates to the saved item's view **by docRef**
  (`/view/<Model>_DM/<uuid>`). The `old → new` slug-change notification *on save*
  is **not** part of this change: `MODIFY_DOCUMENT` returns void, so a re-derived
  Slug only appears on the next read (system architecture.md §Slug derivation;
  functional.md edge cases). The existing slug-change banner scaffolding stays
  dormant until the server returns slug info.
- A deep link by Technical ID still resolves (no broken old links).
- Browse: opening a card's inline detail keeps the URL at `/`; **Full size**
  navigates to the standalone view.

**Verifiable once the server surfaces Slug + ResolveBySlug (no further client change):**
- `/view/page:albert_einstein` and `/edit/person:till_gartner_5` work as
  bookmarkable deep links, with the Slug shown literally in the address bar.
- Reads and gallery cards carry the real Slug, so emitted links *are* slug URLs.

> Until then the client emits docRef links and a hand-typed slug URL won't
> resolve (ResolveBySlug returns not-found) — expected, not a regression. See
> architecture.md §"Dependency & rollout".

## Risks / notes

- **Colon in the path.** `:` is a legal `pchar` in a non-leading path segment
  (RFC 3986), so `/view/page:albert_einstein` is valid and browsers keep it
  literal. **`encodeURIComponent` must not be used** on the slug — it turns `:`
  into `%3A` (verified), producing ugly `/view/page%3Aalbert_einstein`. The Slug
  character set (`[a-z0-9_]` + one `:`) is URL-safe by construction, so the link
  is built by raw interpolation. (Decode stays tolerant of legacy `%3A`.)
- **Dependency on server work.** Real slug URLs only appear once reads/search
  carry the real `Slug`. The fallback keeps the feature shippable before then.
- **Single search affordance (revised in implementation):** the proposal first
  kept two inputs — Browse's in-memory filter *and* a header search box. Having both
  visible on `/` was rejected in review, so the Browse filter box was **removed**;
  the header search box is now the only search input and searches **live as you
  type** (debounced → `/search?q=`). `/` Browse stays a pure list-all gallery and
  `/search` stays the shareable server-side cross-model search — still distinct
  *routes*, just one visible search box.
