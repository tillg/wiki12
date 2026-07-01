# Architecture — A12 markdown editor port

## 1. How the sibling editor is built (the design we adopt)

```
A12 Form Engine
  └─ widgetMap.TextAreaStateless = MarkdownTextArea      ← widget override
       │  (reads Control annotations via ControlModelContext, set by a
       │   formModelMap.Control bridge — needed because widget props don't
       │   carry the model element)
       ├─ not a markdown control → DefaultWidgetMap.TextAreaStateless (fallback)
       └─ markdown control       → MarkdownRichTextEditor
            ├─ "Visual | Markdown" toggle (A12 Button/ButtonGroup)
            ├─ Visual:   DefaultRichTextEditor   (A12 widgets-core, Lexical-based)
            │     ├─ MarkdownSyncPlugin            markdown ⇄ Lexical state
            │     ├─ BufferedFocusBridgePlugin     hook into BufferedInput (commit on blur)
            │     ├─ MarkdownShortcutPlugin        live markdown shortcuts (@lexical/react)
            │     ├─ TablePlugin / Link / Image / Strikethrough plugins
            │     └─ staticToolbarButtons          A12 toolbar widgets
            └─ Markdown: MarkdownSourceArea       focus-buffered raw <textarea>
```

**The pivotal idea**: the field value *is* markdown. `$markdownToNodes` /
`$nodesToMarkdown` (`@lexical/markdown` `$convertFrom/ToMarkdownString` in
preserve-newlines mode) convert at the editor boundary; the document model
never sees Lexical state. This is the same contract wiki12's Milkdown editor
already honors — so the data format is unchanged.

**Why it doesn't have wiki12's value-sync bugs**: `BufferedFocusBridgePlugin`
registers the contenteditable root as the form engine's `inputRef` and forwards
Lexical's `BLUR_COMMAND` to the buffered `onBlur`. Result: keystrokes buffer
locally (no per-keystroke document commit / re-render), and the document commits
once on blur. `MarkdownSyncPlugin` only re-imports an external value when the
editor is **not focused** — so the echo of the user's own edit can never
clobber the in-progress state. This makes wiki12's `markdownSync.ts`
trailing-whitespace heuristic obsolete.

## 2. Model side (already ~done in wiki12)

| | `w12-on-a12` | `wiki12` today | Action |
|---|---|---|---|
| Body field type | `StringType` | `StringType` | — |
| `lineBreaksPermitted` | `true` | `true` (`Page_DM` F3) | — |
| `noValueValidation` | `true` | *(absent)* | **Add** to body fields |
| FM detection | `widget: markdown-editor` annotation | `wiki12.markdownBody` annot. **or** body-name fallback (`Body`/`Description`) | Keep wiki12's (see §4) |

`noValueValidation: true` stops A12's String value-validation from rejecting
markdown punctuation. Add it to the `Body` field's `StringType` block in every
content DM (`models/document-models/*_DM.json`) and regenerate forms.

## 3. Takeover manifest — exact files to copy

Copy the whole module to **`client/src/widgets/markdown-editor/`** (wiki12 keeps
client widgets under `client/src/widgets/`, not `components/`). Source:
`../w12-on-a12/client/src/components/markdown-editor/`.

**Copy verbatim (no edit needed — only A12 + Lexical imports):**

| File | LOC | Notes |
|---|---|---|
| `index.ts` | 1 | barrel |
| `control/markdownEditorAnnotation.ts` | 12 | `widget: markdown-editor` detector (optional, see §4) |
| `control/MarkdownControlContext.tsx` | 24 | Control→context bridge |
| `editor/MarkdownRichTextEditor.tsx` | 173 | main component + Visual/Markdown toggle |
| `editor/MarkdownSourceArea.tsx` | 70 | focus-buffered raw textarea |
| `editor/markdownEditorOnError.ts` | 32 | swallows one benign Lexical 0.31 race; **VERIFY on Lexical bumps** |
| `editor/FollowLinkContent.tsx` | 39 | link hover popup |
| `markdown/markdownConversion.ts` | 19 | `$markdownToNodes` / `$nodesToMarkdown` |
| `markdown/markdownTransformers.ts` | 258 | feature set + GFM table + image transformer |
| `markdown/listTransformers.ts` | 197 | 2-space-indent list dialect; **don't blind-recopy on Lexical bumps** |
| `nodes/ImageNode.tsx` | 99 | external-URL inline image |
| `plugins/MarkdownSyncPlugin.tsx` | 55 | value sync (focus-gated re-import) |
| `plugins/BufferedFocusBridgePlugin.tsx` | 57 | **the BufferedInput bridge** — the bug fix |
| `plugins/LinkDialogPlugin.tsx` | 68 | link insert dialog |
| `plugins/ImageDialogPlugin.tsx` | 54 | image insert dialog |
| `plugins/StrikethroughClassPlugin.tsx` | 42 | widgets-core 38.3.x strikethrough workaround; **VERIFY on widgets bumps** |
| `theme/editorTheme.ts` | 79 | Lexical theme classes + `MarkdownEditorGlobalStyles` |
| `toolbar/toolbarButtons.tsx` | 177 | toolbar (A12 button widgets) |
| `toolbar/tableToolbarButtons.tsx` | 70 | table ops |

**Copy with a small adaptation (2 files):**

| File | Adaptation |
|---|---|
| `control/MarkdownTextArea.tsx` (54) | If we keep wiki12's body-field detection (§4), replace `isMarkdownEditorAnnotated(control?.annotations)` with `isMarkdownBodyControl(control)` from `../../lib/modelFields`. If we adopt the annotation instead, copy verbatim. |
| `plugins/EditorDialog.tsx` (38) | Drop the `../../../app/ThemeContext` import (wiki12 has no multi-theme context). Wrap the `ModalOverlay` in `<ThemeProvider theme={flatTheme}>` using `flatTheme` from `@com.mgmtp.a12.widgets/widgets-core/lib/theme/flat/flat-theme` (the theme `main.tsx` already uses). Keep `isPlaceholderUrl`. |

**Tests — copy to `client/src/widgets/markdown-editor/` test locations** (both
projects use Vitest, so they run as-is; fix the relative import depth):

| File | LOC-ish |
|---|---|
| `test/.../markdownTestUtils.ts` | headless-editor helpers (`createTestEditor`, `roundTrip`) |
| `test/.../markdownEditorAnnotation.test.ts` | |
| `test/.../markdownEditorOnError.test.ts` | |
| `test/.../markdown/markdownTransformers.test.ts` | round-trip table/image/list fidelity |
| `test/.../toolbar/tableToolbarButtons.test.ts` | |

Total ≈ 437 test LOC. They use `@lexical/headless`’s `createHeadlessEditor`.

## 4. wiki12 integration decisions

**(a) Detection — keep wiki12's, don't switch to the annotation.**
The sibling activates the editor when a control carries `widget: markdown-editor`,
which they **hand-author** into `WikiPage_FM.json`. wiki12 **auto-generates** form
models from DMs (`src/dm-to-fm`), and its forms have no such annotation; instead
`client/src/lib/modelFields.ts::isMarkdownBodyControl` already detects the body
by `wiki12.markdownBody` annotation **or** body field-name
(`Body`/`Description`), resolving generated controls via `elementPath`.

→ **Simpler path (recommended): keep `isMarkdownBodyControl`.** Point
`MarkdownTextArea` at it, and the existing `markdownWidgetMap.tsx` wiring
(widgetMap override + `MarkdownControlContext` provider + `FormScreen`
activation) stays — we only swap the *inner* editor component. The DM→FM
generator is untouched.

→ Cheap optional add: also return `true` from `isMarkdownBodyControl` when the
control carries `widget: markdown-editor`, so the sibling's explicit-annotation
convention works too. Recommended; low risk.

*(Alternative, not recommended now: adopt the annotation as the sole signal and
teach `src/dm-to-fm` to emit it for body fields. More moving parts, touches the
model pipeline — out of scope.)*

**(b) Props forwarding — the real fix.** wiki12's current `MarkdownOrDefault`
(`markdownWidgetMap.tsx`) does **not** forward `inputRef`/`onBlur` to
`MilkdownEditor`. The ported `MarkdownTextArea` **must** forward them so
`BufferedFocusBridgePlugin` can register the buffered-input ref. Either:
- replace `MarkdownOrDefault`'s body with the ported `MarkdownTextArea` (keeping
  the `MarkdownControlContext` provider already in `markdownFormModelMap`), or
- fold `MarkdownTextArea` in and keep `markdownButtonlessFormModelMap` (which
  suppresses the model's Save/Cancel panel — wiki12-specific, must be kept).

Keep `markdownWidgetMap.tsx`'s exports (`markdownWidgetMap`,
`markdownFormModelMap`, `markdownButtonlessFormModelMap`) — `FormScreen.tsx`
imports them and that wiring is correct.

**(c) Single theme.** `main.tsx` wraps the app in
`<ThemeProvider theme={flatTheme}>`. The editor inherits it; only `EditorDialog`
(portal, outside the tree) needs an explicit re-wrap — see §3.

**(d) Global styles.** Mount `<MarkdownEditorGlobalStyles />` once, next to the
existing `<GlobalStyles />` in `client/src/main.tsx`. (Sibling mounts it in
`app/page/index.tsx`; wiki12's equivalent root is `main.tsx`.)

**(e) Read-only / View.** `FormScreen` renders View read-only via the activity
`ui.readonly` slice; `MarkdownTextArea` receives `readonly`/`disabled` and
`MarkdownRichTextEditor` hides the toggle and renders the RTE read-only. No
separate read-only renderer is needed (wiki12 currently has none — no
`react-markdown` import exists).

## 5. Dependencies

**Add** to `client/package.json` (match the sibling's `^0.31.2`):

```
@lexical/code, @lexical/link, @lexical/list, @lexical/markdown,
@lexical/react, @lexical/rich-text, @lexical/selection, @lexical/table, lexical
```
dev: `@lexical/headless` (tests only).

`styled-components` is already a wiki12 dep (used in `main.tsx`).

**Remove**: `@milkdown/core`, `@milkdown/ctx`, `@milkdown/plugin-listener`,
`@milkdown/preset-commonmark`, `@milkdown/theme-nord`.

## 6. Files to delete

- `client/src/widgets/MilkdownEditor.tsx`
- `client/src/lib/markdownSync.ts` + `client/src/lib/markdownSync.test.ts`
  (logic superseded by `BufferedFocusBridgePlugin` + focus-gated
  `MarkdownSyncPlugin`).
- `client/src/lib/modelFields.ts` — **keep** (detection reused).

## 7. VERIFY / risk markers to carry over

- `markdownEditorOnError.ts` — swallows Lexical 0.31 `#113` stale-node race;
  re-check on any Lexical upgrade.
- `StrikethroughClassPlugin.tsx` — workaround for a `widgets-core@38.3.x`
  `InlineStyleTextNode` rendering bug; re-check / delete when fixed upstream
  (wiki12 is on `38.3.4`, sibling on `38.3.3` — confirm the bug still applies).
- `listTransformers.ts` — structurally diverges from upstream `@lexical/markdown`
  (2-space indent dialect); do **not** blind-recopy on a Lexical bump.
- Confirm the full named-export surface compiles against `38.3.4` (all 20
  symbols verified present + root-exported; a build is the final check).

## 8. Docs to update

- `docs/adr/0007-web-client-on-a12-client-framework.md` — the Milkdown
  paragraph; consider a short new ADR "Markdown editor: A12 RTE over Milkdown".
- `client/README.md` — rewrite the "Markdown editor" section.
- `README.md` — known-issues: drop the (now-fixed) Milkdown items.
- `CONTEXT.md` — only if the body-field vocabulary changes (it doesn't).
