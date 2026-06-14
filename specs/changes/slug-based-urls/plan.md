# Plan — Slug-based URLs

Read `proposal.md` and `architecture.md` first. All work in `client/`.
Test-first per the global convention: each step pairs a change with its verify.

## 1. URL ref helper (pure core)

- [ ] Write `client/src/lib/refUrl.test.ts` (Vitest) covering:
  - `refSegment("page:albert_einstein") === "page:albert_einstein"` (colon kept)
  - `refSegment("person:till_gartner_5")` unchanged (numeric-suffix slug)
  - `refSegment("Page_DM/abc-123")` percent-encodes the `/` (→ `Page_DM%2Fabc-123`)
  - `refFromParam(refSegment(x)) === x` round-trip for both a slug and a docRef
  - `refFromParam("page%3Aalbert_einstein") === "page:albert_einstein"` (legacy)
  - `isSlug` accepts slugs, rejects docRef / bare uuid
- [ ] Implement `client/src/lib/refUrl.ts` (`isSlug`, `refSegment`, `refFromParam`).
- [ ] Verify: `cd client && npx vitest run src/lib/refUrl.test.ts` is green.

## 2. Surface the real Slug on read

- [ ] Add a pure `readSlugField(document)` (extract envelope `Slug` from the root
      group via the existing `rootFields` shape) — colocate with content.ts or in
      a small lib; add a unit test (present → value, absent → "").
- [ ] `content.ts getDocument`: set `slug = readSlugField(result.document) || dref`.
- [ ] `search.ts entriesToHits`: set `slug` from the hit's `Slug` field when
      present (keep `id: e.docRef`); leave dedupe/sort keys (`slug || type/id`) as-is.
- [ ] Verify: `cd client && npm run test` green; `npm run typecheck` clean.

## 3. View/edit links emit the slug

- [ ] `ViewPage.tsx`: decode param with `refFromParam`; build the Edit link with
      `/edit/${refSegment(item.slug || item.id)}`.
- [ ] `EditPage.tsx`: decode param with `refFromParam`; post-save `navigate` to
      `/view/${refSegment(result.item.slug || result.item.id)}` (keep slug-change state).
- [ ] `BrowsePage.tsx`: opening a card navigates to `/view/${refSegment(slug||id)}`
      (deep link) — confirm this matches the intended UX vs. the inline detail pane;
      keep the inline detail pane, add an explicit "open as page" deep link if both
      are wanted.
- [ ] Verify: `npm run typecheck` clean; existing Vitest suite green.

## 4. Search route + header search box

- [ ] Add `client/src/pages/SearchPage.tsx`: read `q`, `type` via
      `useSearchParams`; call `unifiedSearch({query:q, type})`; render results with
      `ContentCard`/`CardGrid`; empty-`q` hint; loading/error banners; validate
      `type` against `CONTENT_MODELS` (ignore unknown).
- [ ] `App.tsx`: add `<Route path="/search" element={<SearchPage />} />`.
- [ ] `App.tsx`: add a search input to `ApplicationHeader` (rightSlots/leftSlots)
      that `navigate("/search?q=" + encodeURIComponent(value))` on submit/Enter.
- [ ] Verify: `npm run typecheck` clean; existing suite green.

## 5. Browser verification (CLAUDE.md global rule)

- [ ] `cd client && npm run dev`; ensure `tmp/` is gitignored.
- [ ] Playwright (artifacts → `tmp/`), screenshot each:
  - `/view/page:<slug>` renders; address bar shows the literal colon (not `%3A`).
  - `/edit/<slug>` loads the form; Edit link from view → correct `/edit/<slug>`.
  - `/search?q=einstein` shows cards; `&type=person` narrows; card click →
    `/view/<slug>`.
  - A legacy Technical-ID link (`/view/Page_DM%2F<uuid>`) still resolves.
  - Editing a Key Field that changes the slug → navigates to the **new** slug URL
    + `old → new` banner.
- [ ] Confirm the dev server is actually responding before declaring done.

## 6. Docs

- [ ] Update `specs/system/functional.md` (Pages list / Read row) to note the
      slug-based deep links and the `/search?q=&type=` route.
- [ ] If `client/README.md` lists routes/screens, add `/search` and the
      slug-URL note (and any new `VERIFY` for the `Slug` envelope read).

## Notes / guards

- **No `encodeURIComponent` on a Slug** — it produces `%3A`. Use `refSegment`.
- **Graceful fallback** — until the server surfaces `Slug` on reads/search, links
  fall back to Technical IDs and everything keeps working; no client change needed
  when the server side lands.
- Keep `/` Browse (list-all + in-memory filter) and `/search` (server-side
  cross-model search) as distinct interactions — do not merge them.
- Grep `VERIFY` for `ResolveBySlug` / `GET_DOCUMENT` envelope assumptions before
  wiring the read path.
