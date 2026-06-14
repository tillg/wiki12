# Plan — Slug-based URLs

Read `proposal.md` and `architecture.md` first. All work in `client/`.
Test-first per the global convention: each step pairs a change with its verify.

## 1. URL ref helper (pure core)

- [x] Write `client/src/lib/refUrl.test.ts` (Vitest) covering:
  - `refSegment("page:albert_einstein") === "page:albert_einstein"` (colon kept)
  - `refSegment("person:till_gartner_5")` unchanged (numeric-suffix slug)
  - `refSegment("Page_DM/abc-123")` percent-encodes the `/` (→ `Page_DM%2Fabc-123`)
  - `refFromParam(refSegment(x)) === x` round-trip for both a slug and a docRef
  - `refFromParam("page%3Aalbert_einstein") === "page:albert_einstein"` (legacy)
  - `isSlug` accepts slugs, rejects docRef / bare uuid
- [x] Implement `client/src/lib/refUrl.ts` (`isSlug`, `refSegment`, `refFromParam`).
- [x] Verify: `cd client && npx vitest run src/lib/refUrl.test.ts` is green.

## 2. Surface the real Slug on read

- [x] Add a pure `readSlugField(document)` (extract envelope `Slug` from the root
      group via the existing `rootFields` shape) — colocate with content.ts or in
      a small lib; add a unit test (present → value, absent → ""). _Done as `slugOf`
      in `lib/envelope.ts` (reuses its `rootFields`)._
- [x] `content.ts getDocument`: set `slug = readSlugField(result.document) || dref`.
- [x] `search.ts entriesToHits`: set `slug` from the hit's `Slug` field when
      present (keep `id: e.docRef`); leave dedupe/sort keys (`slug || type/id`) as-is.
- [x] Verify: `cd client && npm run test` green; `npm run typecheck` clean.

## 3. View/edit links emit the slug

- [x] `ViewPage.tsx`: decode param with `refFromParam`; build the Edit link with
      `/edit/${refSegment(item.slug || item.id)}`.
- [x] `EditPage.tsx`: decode param with `refFromParam`; post-save `navigate` to
      `/view/${refSegment(result.item.slug || result.item.id)}`. Note `result.item.slug`
      is the **docRef** today (writes don't return the derived Slug), so this lands on
      the docRef view until the server surfaces the Slug — it then becomes a slug URL
      with no further change. Leave the existing slug-change banner scaffolding as-is
      (dormant); do **not** add or assert an `old → new`-on-save behavior here.
- [x] `BrowsePage.tsx`: keep the inline split-pane detail as a transient in-page
      selection (URL stays `/`). Change the **"Full size"** action to
      `navigate("/view/" + refSegment(slug || id))` (the deep-linkable standalone
      view) instead of toggling the local `fullSize` boolean for the open case;
      closing / browser-back returns to `/`.
- [x] Verify: `npm run typecheck` clean; existing Vitest suite green.

## 4. Search route + header search box

- [x] Add `client/src/pages/SearchPage.tsx`: read `q`, `type` via
      `useSearchParams`; call `unifiedSearch({query:q, type})`; render results with
      `ContentCard`/`CardGrid`; empty-`q` hint; loading/error banners; validate
      `type` against `CONTENT_MODELS` (ignore unknown).
- [x] `App.tsx`: add `<Route path="/search" element={<SearchPage />} />`.
- [x] `App.tsx`: add a search input to `ApplicationHeader` (rightSlots/leftSlots)
      that `navigate("/search?q=" + encodeURIComponent(value))` on submit/Enter.
- [x] Verify: `npm run typecheck` clean; existing suite green.

## 5. Browser verification (CLAUDE.md global rule)

- [x] `cd client && npm run dev`; ensure `tmp/` is gitignored.
- [x] Playwright (artifacts → `tmp/`), screenshot each:
  - `/view/page:<slug>` renders; address bar shows the literal colon (not `%3A`).
  - `/edit/<slug>` loads the form; Edit link from view → correct `/edit/<slug>`.
  - Browse `/`: clicking a card opens the inline split-pane detail with the URL
    **still `/`**; hitting **Full size** navigates to `/view/<slug>`; back returns
    to `/`.
  - `/search?q=einstein` shows cards; `&type=person` narrows; card click →
    `/view/<slug>`.
  - A legacy Technical-ID link (`/view/Page_DM%2F<uuid>`) still resolves.
  - After create/edit, the app navigates to the saved item's view (by **docRef**
    today) and it loads. The `old → new` slug-change banner is dormant until the
    server returns slug info — **not asserted** in this change.
- [x] Confirm the dev server is actually responding before declaring done.

> Verified on the running stack (2026-06-14): the server does **not** yet surface
> the envelope `Slug`, so the detail/view fall back to the docRef (graceful
> degradation, as designed). Confirmed: card→split-pane keeps URL `/`; **Full size**
> → `/view/Person_DM%2F<uuid>` (docRef `/` encoded); Edit link → matching `/edit/…`;
> `/view/page:photosynthesis` keeps the colon **literal** (no `%3A`) and resolves via
> `ResolveBySlug` → "Not found" (expected until the server lands); `/search?q=tesla`
> shows the Person card; `&type=location` narrows (no match) vs. `q=water` (5 pages);
> search card click → `/view/<docRef>`; header search box → `/search?q=…` on Enter.
> Screenshots in `tmp/0{1,2,3}-*.png`.

## 6. Docs

- [x] Update `specs/system/functional.md` (Pages list / Read row) to note the
      slug-based deep links and the `/search?q=&type=` route.
- [x] If `client/README.md` lists routes/screens, add `/search` and the
      slug-URL note (and any new `VERIFY` for the `Slug` envelope read).

## Notes / guards

- **No `encodeURIComponent` on a Slug** — it produces `%3A`. Use `refSegment`.
- **Graceful fallback** — until the server surfaces `Slug` on reads/search, links
  fall back to Technical IDs and everything keeps working; no client change needed
  when the server side lands.
- **Single search affordance (decided during implementation).** The original plan
  kept two inputs — Browse's in-memory filter box *and* a header search box — as
  distinct interactions. In review the two boxes colliding on `/` was rejected: the
  Browse filter box was **removed**, leaving the header search box as the only search
  input, and it now searches **live as you type** (debounced → `/search?q=`). Browse
  is a pure list-all gallery. The orphaned `filterCards` helper + its test were
  removed. (`filterCards` no longer exists; `/` and `/search` are still distinct
  *routes*, just not two visible inputs.)
- Grep `VERIFY` for `ResolveBySlug` / `GET_DOCUMENT` envelope assumptions before
  wiring the read path.
