# Plan: mandatory content fields

Ordered, test-first steps. Read [`architecture.md`](architecture.md) first. Each
step is small enough to implement and verify on its own; `verify` lines are the
success criterion (run before marking done). Offline-testable steps gate via
`just test`; A12-boundary steps carry `// VERIFY` and are confirmed against a
running stack.

## 1. Annotation contract & models

- [x] Add the new annotation constants to `server/.../slug/SlugAnnotations.java`:
      `DERIVED_CREATED_ON="createdOn"`, `DERIVED_TITLE="title"`,
      `DERIVED_CHANGE_LOG="changeLog"`, and `CHANGE_FIELD="wiki12.changeField"`
      with values `CHANGE_FIELD_DATETIME="datetime"` /
      `CHANGE_FIELD_SUMMARY="summary"`.
- [x] Add `CreatedOn` (`DateTimeType`, `wiki12.derived="createdOn"`) and the
      repeatable `Changes` group (`wiki12.derived="changeLog"`, child fields
      `ChangedOn`/`Summary` with `wiki12.changeField`) to **all four** DMs
      (`Page_DM`, `Person_DM`, `Film_DM`, `Location_DM`).
- [x] Add a derived `Title` field (`StringType`, `wiki12.derived="title"`) to
      `Person_DM` and `Location_DM` only. **Page AND Film keep their authored
      `Title` Key Field** (correcting the original note — Film also authors a
      Title); Location derives Title from its `Name` key field.
- [x] Add `wiki12.version="2"` header annotation to the edited models (the
      pre-envelope baseline is implicitly version 1 — the annotation was absent).
- [x] Extend `src/model_tools/validate.py` to **require the envelope** on every
      content DM: a `wiki12.derived="createdOn"` field, a `wiki12.derived="changeLog"`
      group with `changeField="datetime"`/`"summary"` children, and a `Title`
      (authored Key Field or `wiki12.derived="title"`). This is the primary
      enforcement that every new/changed model carries the envelope.
- [x] verify: `just validate-models` passes for the four updated DMs and
      `python3 src/model_tools/test_validate.py` confirms a fixture DM missing the
      envelope is rejected (flags createdOn/Title/changeLog).

## 2. Form generation excludes derived fields

- [x] Test-first: added a case to `src/dm-to-fm/test/` asserting a generated FM
      contains **no** control for any `wiki12.derived="*"` field (slug,
      searchText, createdOn, title) and **no** section for the `changeLog` group.
- [x] Generalise `generate.ts`: exclude every field annotated `wiki12.derived`
      (any value) and skip derived groups (the `changeLog`) in `collectGroups`.
      Replaced the `searchText`-only exclusion.
- [x] verify: `just test-forms` passes (6/6); `just generate-forms` regenerated
      Person/Film/Location `_FM.json` with derived fields gone. Page_FM is explicit
      (shows Slug read-only, has no envelope fields) — left as-is.

## 3. Pure derivation helpers (offline-unit-tested)

- [x] Test-first (`server/test/SlugifierTest.java`): `displayTitle` from Key-Field
      values is the human join (`["Till","Gartner"]` → `"Till Gartner"`, original
      casing, trimmed, single-spaced); empty/blank values handled.
- [x] Test-first: change-summary formatting — `SUMMARY_CREATED="created"`; for
      update a stable `"updated: <sorted, comma-joined labels>"` from a changed-field
      set (bare `"updated"` when none/all-blank).
- [x] Implement both as **pure** static methods in `Slugifier` (no A12 deps):
      `displayTitle(...)`, `updateSummary(...)`, `SUMMARY_CREATED`.
- [x] verify: compiled + ran the offline Java test — 36 passed, 0 failed.

## 4. Listener / derivation service (A12-bound)

- [x] In `SlugDerivationService.readConfig()`, resolve and store the new paths:
      `createdOnFieldPath`, `titleFieldPath`, `changeLogGroupPath`,
      `changeDatetimePath`, `changeSummaryPath`, and the `editableFields` list
      (extended `ModelDerivationConfig`).
- [x] `deriveForCreate`: stamp `CreatedOn=now`, derive `Title`, append one
      `Changes` entry `{ now, "created" }` — added to the existing
      `withBatchUpdates(...)` batch alongside slug/searchText.
- [x] `deriveForUpdate`: re-derive `Title`, **skip** `CreatedOn`, append
      `{ now, "updated: <diff>" }` computed from `updated` vs `persisted` over the
      editable (non-derived) fields via `Slugifier.updateSummary`.
- [~] The four A12-boundary assumptions are implemented with `// VERIFY (envelope
      #1–#4)` markers and documented in `server/README.md` (write clock, group
      repetition, DateTimeType format, field label). **Not strikable offline** —
      pending live-stack confirmation (no A12 artifacts available here).
- [~] verify (offline): pure helpers green (step 3, 36/36). verify (stack):
      **PENDING** — requires `just dev` + a built data-service (A12 artifacts).

## 5. Migration v1 → v2 (gated, ADR-0003)

- [x] Authored a **type-agnostic** TS Migration
      (`model-lifecycle/examples/envelope_v1_to_v2.ts`): backfills `CreatedOn` and
      seeds a `{ ChangedOn, "migrated to v2" }` Change Entry on the single
      model-rooted group (works for all four types). The sandbox strips all globals
      (no `Date`), so the instant is a baked constant (documented approximation);
      Title is left for the listener to re-derive on the migration write.
- [x] verify: gate test confirms the existing v-bump gate still holds; runner test
      confirms the migration backfills CreatedOn + Changes via transpile + sandbox.
- [x] Added an envelope check (`assertEnvelope`) to the `POST /models` gate
      (`model-lifecycle/src/registry.ts`) as a runtime backstop: a content model
      (identified by its slug field) missing the envelope is rejected via
      `GateError` (→ 409). Infra models without a slug are exempt.
- [x] verify: `just test-lifecycle` passes (20/20); a model missing the envelope
      is rejected with a `GateError` naming the missing parts.

## 6. Clients surface the envelope (read-only)

- [x] Web: extracted pure envelope helpers to `client/src/lib/envelope.ts`
      (`titleOf`/`createdOnOf`/`changesOf`); `ViewPage` now renders `CreatedOn` and
      the `Changes` log (reverse-chronological) read-only, Title via the derived
      field. Edit screen unchanged (fields excluded from the FM). Added
      `envelope.test.ts` (8 Vitest cases).
- [x] CLI: `read` ALWAYS emits the **A12 document** as JSON (envelope fields
      included) via `formatDocument`/`a12Document` — per the new CLAUDE.md rule; no
      new create/edit flag (auto summary). Added CLI tests (format + entity read).
- [x] verify: `cd client && npm run test` (37 pass, 8 new); `just test-cli` (91
      pass); `npm run build` clean (type-checks against real A12 types); dev server
      starts and the SPA renders (screenshot `tmp/wiki12-spa-login.png`). Live
      ViewPage envelope render needs the full Docker stack (data-service) — PENDING,
      same dependency as step 4.

## 7. Docs

- [x] `CONTEXT.md`: added **Content Envelope**, **CreatedOn**, **Title**,
      **Changes / Change Entry** under Content; refined **Key Fields** (now feeds
      both Slug and Title).
- [x] `README.md` (Core concepts) + `CLAUDE.md` (derivation paragraph + the new
      CLI A12-document rule): note the standard envelope and the derived-field
      exclusion from edit forms.
- [x] Added **ADR-0006** (standard content envelope) extending ADR-0001; notes the
      `SlugDerivationService`→`ContentDerivationService` rename.
- [x] verify: `just test` (full offline gate) green — validate-models, version,
      forms (6), CLI (91), lifecycle (20). Slugifier offline test 36/36 separately.

## 8. Rename to match the widened role

- [x] Renamed `SlugDerivationService`→`ContentDerivationService` and
      `SlugAnnotations`→`WikiAnnotations` (+ the `slugDerivationService` field) via
      `git mv` + identifier rename across the 4 referencing files. No residual
      references; pure rename, no behaviour change.
- [x] verify: Slugifier offline test 36/36; `just test` stays green (rename is
      Java-only, outside the offline gate, but nothing else regressed).
