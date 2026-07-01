# Plan — port the A12 markdown editor

Each step is `do → verify`. Stop and reassess if a verify fails.

## 1. Dependencies
- **Do**: add the 9 Lexical packages (`^0.31.2`) + `@lexical/headless` (dev) to
  `client/package.json`; remove the 5 `@milkdown/*` packages. `npm install`.
- **Verify**: `cd client && npm ls lexical @lexical/markdown` resolves; no
  `@milkdown` left in the lockfile.

## 2. Copy the module
- **Do**: copy `../w12-on-a12/client/src/components/markdown-editor/` →
  `client/src/widgets/markdown-editor/` (all 21 files). Adapt only
  `EditorDialog.tsx` (use `flatTheme`, drop `ThemeContext`) and
  `MarkdownTextArea.tsx` (detection — step 4).
- **Verify**: `cd client && npm run build` (tsc) compiles the new module —
  confirms every `@com.mgmtp.a12.widgets/widgets-core` symbol resolves against
  `38.3.4`. Fix import depths / any 38.3.3→38.3.4 drift.

## 3. Port tests
- **Do**: copy the 5 test files + `markdownTestUtils.ts` under
  `client/src/widgets/markdown-editor/` (or `client/src/test/...` to match
  wiki12's layout); fix relative import depth.
- **Verify**: `cd client && npx vitest run` — the ported transformer/round-trip
  tests pass (red→green confidence the conversion layer works headless).

## 4. Rewire the form-engine widget
- **Do**: in `client/src/widgets/markdownWidgetMap.tsx`, render the ported
  `MarkdownRichTextEditor` (via `MarkdownTextArea`) instead of `MilkdownEditor`,
  and **forward `inputRef` and `onBlur`**. Keep `isMarkdownBodyControl`
  detection, the `MarkdownControlContext` provider, and the
  `markdownButtonlessFormModelMap`/`markdownWidgetMap` exports `FormScreen.tsx`
  consumes. Optionally also honor `widget: markdown-editor` in
  `isMarkdownBodyControl`.
- **Verify**: `cd client && npm run build` passes; `FormScreen.tsx` still type-checks.

## 5. Global styles + cleanup
- **Do**: mount `<MarkdownEditorGlobalStyles />` next to `<GlobalStyles />` in
  `client/src/main.tsx`. Delete `MilkdownEditor.tsx`, `markdownSync.ts`,
  `markdownSync.test.ts`.
- **Verify**: `grep -rn milkdown client/src` returns nothing;
  `npm run build` + `npx vitest run` both green.

## 6. Model: `noValueValidation`
- **Do**: add `"noValueValidation": true` to the `Body` field's `StringType`
  block in every `models/document-models/*_DM.json`; `just generate-forms`.
- **Verify**: `just validate-models` passes; `just test-forms` passes.

## 7. End-to-end through the real UI (mandatory — see CLAUDE.md)
- **Do**: `just dev`; wait for healthy stack; log in `admin`/`admin`.
- **Verify** (Playwright, screenshots → `tmp/`):
  1. `/create?type=Page` — the body control renders the **A12 RTE** (toolbar
     visible), not a bare textarea; `browser_evaluate` confirms non-zero width.
  2. Type multi-paragraph markdown incl. `<Return>`, **bold**, a heading, a
     bullet list, a GFM table, a link, an inline image — **the newline/escaping
     bugs do not reproduce**.
  3. Save → View renders read-only with formatting intact; toggle works in Edit.
  4. Read back via `wiki12 page read <slug>` — the emitted A12 document's body
     is clean markdown (no runaway `\*\*`), round-trips.
  5. No console errors.

## 8. Docs
- **Do**: update ADR-0007 (or add a new ADR), `client/README.md` markdown
  section, and `README.md` known-issues. Note the new capabilities
  (tables/images/links/toggle) and the retired Milkdown bug class.
- **Verify**: `grep -rn -i milkdown docs/ client/README.md README.md` only
  appears in historical/ADR-superseded context, not as current behavior.

## Rollback
Single-commit-revertable: the change is confined to `client/` (widget layer +
deps) plus a one-line-per-DM model annotation. Stored content is unchanged
(still markdown strings), so revert needs no data migration.
