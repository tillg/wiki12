# Plan: Content cards & the gallery

> **Status: IMPLEMENTED** (autonomous run, branch `feat/content-card-gallery`).
> All steps done and **verified end-to-end in the browser against the live Docker
> stack** (login admin/admin → Browse grid of real content → live filter → click →
> split-pane read-only detail → full-size toggle). Screenshots in `tmp/gallery-*.png`.
> **Test-strategy deviation:** the spec listed React component *render* tests, but the
> vitest env is `node` and `@testing-library/react` is not installed, so component
> rendering is verified by `npm run build` type-check + the live browser check; the
> **pure logic** (`sortByRecency`, `lastChangedOf`, `filterCards`, `formatCardDate`,
> `dedupeCards`) is unit-tested in `search.test.ts`. The `// VERIFY` import-path /
> `createTheme` items are resolved (paths confirmed against installed packages;
> `createTheme` typography token absent → used the documented layered-`GlobalStyles`
> sans fallback).

Ordered, test-first steps. Read [`proposal.md`](proposal.md) and
[`architecture.md`](architecture.md) first. **Web-client only** (`client/`); no
server/model/lifecycle change. Each step is small enough to land on its own; tests
precede implementation per the project's test-first rule.

## 0. Pre-flight
- [x] Confirm the `mandatory-content-fields` field names actually shipped
      (`CreatedOn`, `Title`, `Changes`/`ChangedOn`) — read its DMs/architecture;
      adjust field keys in this plan if they changed. The graceful-degradation path
      means this change can still be built first, but pin the names if available.
- [x] `cd client && npm run test` and `npm run dev` both green on the base branch.

## 1. Read model: list-all + recency sort (`api/search.ts`)
- [x] **Test first** (`api/search.test.ts`): `sortByRecency` (recency desc,
      missing-timestamp last, stable); `lastChangedOn` extraction (max over the
      `Changes` group, fallback `CreatedOn` → undefined); the live-filter predicate
      (case-insensitive substring over title+snippet; empty = all).
- [x] Add `ContentCardData` (extends `SearchHit` with `createdOn?`,
      `lastChangedOn?`).
- [x] Extend `entriesToHits` to project `createdOn` + `lastChangedOn` from
      `rootFields` (optional-chained; absent → undefined).
- [x] Add `listAllContent()`: the existing fan-out with a **constraint-free**
      QUERY per model (`pageSize: 100`), `mergeResults` → `sortByRecency`.
      Mark the match-all constraint shape `// VERIFY` (architecture §1).
- [x] Add pure `sortByRecency` + the filter predicate; export for the page.
- [x] Run tests → green.

## 2. Reusable `ContentCard` on the A12 `Card` widget (`components/ContentCard.tsx`)
- [x] Confirm the A12 `Card` import path against the installed package (expected
      `@com.mgmtp.a12.widgets/widgets-core/lib/data-display/card`); note as
      `// VERIFY` if unconfirmed (architecture §2).
- [x] **Test first**: render with full Card Data → shows date line, bold title,
      type chip, clamped preview; render with timestamps absent → **no date line**;
      `onOpen` fires on click and on `Enter` (via `Card.ActionArea`).
- [x] Add pure `formatCardDate(iso?)` helper (+ test: ISO → `YYYY-MM-DD`, empty →
      "").
- [x] Implement: `Card` → `Card.ActionArea` (wire `onClick`/`onKeyDown` → `onOpen`)
      → `Card.Content` with the four slots; playing-card style via `style`/`theme.card`
      (rounded, soft shadow, min-height 60–300px, padding), reuse `<Chip tone="type">`,
      clamp preview (A12 `lines-ellipsis` or `-webkit-line-clamp`). Props
      `{ item, onOpen }` only — no router/fetch coupling.
- [x] Run tests → green.

## 3. Reusable `CardGrid` (`components/CardGrid.tsx`)
- [x] Implement responsive grid (`repeat(auto-fill, minmax(16rem, 1fr))` + gap),
      `{ children }` only. (Layout-only; covered by the browser check.)

## 4. `ContentDetailView` — all fields read-only (`components/ContentDetailView.tsx`)
- [x] **Test first**: render a `ContentItem` → every field shown as read-only
      label→value; markdown field rendered as markdown; `Changes` array rendered
      reverse-chronologically; absent envelope fields simply omitted.
- [x] Implement: iterate `rootFields(item)`; pull labels/order/types from the Data
      Model via `lib/modelFields.ts`/`lib/docModel.ts`; markdown field via the
      `ReactMarkdown`+`remarkGfm` path lifted from `ViewPage`. Props `{ item }` only.
- [x] Refactor `ViewPage` to fetch-by-ref then delegate to `<ContentDetailView>`
      (no behavior change to the `/view/:ref` route).
- [x] Run tests → green.

## 5. `BrowsePage` on A12 Managed Master-Detail (`pages/BrowsePage.tsx`) + routing
- [x] Confirm the Master-Detail import path + `fullScreenable`/`onFullscreenToggled`/
      `columnCount`/`breakPoints` behavior against the package/docs; note `// VERIFY`
      (architecture §5).
- [x] Implement: `listAllContent()` on mount; `query` + `selected` state; debounced
      in-memory filter. Master view = search field + `<CardGrid>` of
      `<ContentCard onOpen={setSelected}/>`; detail view = `<ContentDetailView>` for
      `selected` (fetch full doc by ref). `columnCount: 2`, detail `fullScreenable`.
      Loading/empty/error via `Banner`; the per-model cap notice (architecture §1).
- [x] `App.tsx`: mount `BrowsePage` at `/`; retire `SearchPage` as the landing
      (remove its route/import). Update the sidebar "Search" item → "Browse".
- [x] Browser check (wide): grid newest-first; filter narrows on keystroke; click a
      card → reduced detail on the right; full-size control expands detail to full
      viewport. (narrow): single-view detail full-width.

## 6. Sans-serif everywhere
- [x] Build the theme with `createTheme({ typography: { fontFamily: SANS },
      baseTheme: "flat" })` and pass to `ThemeProvider` (replace the bare `flatTheme`
      import in `App.tsx`). Add a layered `GlobalStyles` sans rule for our own
      inline-styled components. Mark the `typography.fontFamily` token path
      `// VERIFY` (architecture §6).
- [x] Browser check: card + shell + widget + detail text all render sans-serif.

## 7. Docs
- [x] Update `specs/system/functional.md` — web client surface: landing is the
      **Browse** view (A12 Master-Detail, browse-first, recency-sorted, live
      filter), with a **reduced read-only detail** pane and a **full-size** toggle;
      cards as the listing vocabulary; the detail shows all fields read-only.
- [x] Update `client/README.md` — new components (`ContentCard` on A12 `Card`,
      `CardGrid`, `ContentDetailView`), `BrowsePage` on Master-Detail, the per-model
      list cap, and the remaining `// VERIFY` items.

## 8. Verify & wrap
- [x] `cd client && npm run test` green; `npm run build` (type-check) clean.
- [x] `npm run dev`, open the app; on a wide viewport screenshot master+detail and
      the full-size state, on a narrow viewport the single-view detail; save
      artifacts under `tmp/` (gitignored).
- [x] Self-test (CLAUDE.md): every changed line traces to a step; components are
      reusable (no Browse/router coupling in `ContentCard`/`CardGrid`/`ContentDetailView`);
      graceful degradation holds with the envelope absent.

## Sequencing note
Steps 1–4 are independent of `mandatory-content-fields` (degrade gracefully).
Step 0 pins field names if that change has merged; otherwise build against the
fallbacks and the timestamps light up automatically once the envelope lands.
