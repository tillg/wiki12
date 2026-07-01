# Proposal — Adopt the A12 rich-text markdown editor (port from `w12-on-a12`)

## What

Replace wiki12's bespoke **Milkdown** body editor with the **A12-native
markdown rich-text editor** built in the sibling project
`../w12-on-a12` (`client/src/components/markdown-editor/`).

That editor wraps A12's own **`DefaultRichTextEditor`** (the Lexical-based RTE
shipped in `@com.mgmtp.a12.widgets/widgets-core`) and adds a thin
**markdown ⇄ Lexical** conversion layer, so the stored field value stays a
plain markdown string while the user edits in a real WYSIWYG surface (with a
"Visual | Markdown" toggle). It is registered into the A12 Form Engine the
same way wiki12 already registers Milkdown — by overriding the
`TextAreaStateless` widget for the markdown-body control — so the swap is
contained to the client's widget layer.

We take over the module almost verbatim (21 source files, ~1.6k LOC + 5 test
files), make a handful of wiki12-specific adaptations (single theme, global
style mount, keep wiki12's body-field detection), add the Lexical
dependencies, and delete Milkdown.

## Why

1. **It's the A12 way.** `CLAUDE.md` mandates A12 Widgets for every UI element
   that has a suitable widget. A12 *ships* a rich-text editor
   (`DefaultRichTextEditor`); Milkdown is a third-party ProseMirror editor we
   bolted on. The sibling project proves the A12 RTE can persist plain markdown
   — so we get theming, accessibility, dark-mode and the A12 toolbar/dialog
   widgets for free, and stop maintaining an off-platform editor.

2. **It retires our recurring bug class.** The last four commits on `main`
   (`f8ad18d`, `c0d6b6b`, `5e4562d`, `8e7c204`) are all Milkdown value-sync
   firefighting: runaway `\*\*` escaping, swallowed `<Return>`, a
   trailing-whitespace echo guard (`client/src/lib/markdownSync.ts`). All of
   that stems from Milkdown being a *controlled* component fighting the form
   engine's round-trip. The A12 editor sidesteps it structurally: it bridges
   into the form engine's **BufferedInput** focus contract
   (`BufferedFocusBridgePlugin`), so typing buffers locally and commits once on
   blur — exactly like every other A12 field. The `shouldReplaceFromExternal`
   hack disappears.

3. **More capability, less code we own.** The ported editor brings GFM tables,
   inline images, links with a follow-popup, headings, lists, quotes, code
   blocks, and a Visual/Markdown toggle — driven entirely by A12 toolbar
   widgets. wiki12's Milkdown integration has none of the toolbar/dialog UI.

4. **Zero A12 upgrade.** wiki12 already has `widgets-core@38.3.4`, which
   root-exports every symbol the module imports (`DefaultRichTextEditor`,
   `createBlockButton`, `InlineStyleTextNode`, `ModalOverlay`, … — all
   verified). The sibling runs `38.3.3`; they are API-compatible for this use.
   The only new dependencies are the open-source Lexical packages.

## How they model it (the thing we're copying)

The model side is deliberately **generic** — markdown is *not* a model concept:

- **Document Model**: the body is a plain `StringType` field with
  `lineBreaksPermitted: true` and `noValueValidation: true`. No markdown-specific
  type or annotation. (wiki12 already does this minus `noValueValidation`.)
- **Form Model**: the control carries an annotation **`widget: markdown-editor`**.
  That annotation is the *only* model-level signal; everything else is the
  client widget layer.

So "markdown" lives entirely in the **widget**, decoupled from the model — which
is why the editor is reusable for any String field on any type.

## Scope

- Port the `markdown-editor` module into `client/src/widgets/markdown-editor/`.
- Rewire `client/src/widgets/markdownWidgetMap.tsx` to render the new editor and
  **forward `inputRef`/`onBlur`** (the BufferedInput bridge).
- Add Lexical deps; remove Milkdown deps.
- Delete `MilkdownEditor.tsx`, `markdownSync.ts` (+ test).
- Mount `MarkdownEditorGlobalStyles` in `client/src/main.tsx`.
- Add `noValueValidation: true` to body fields in the document models.
- Port the 5 unit tests; add `@lexical/headless` (dev).
- Update ADR-0007, `client/README.md`, and the project `README.md` known-issues.

## Non-goals

- No change to the Data Service, slug/envelope derivation, CLI, or the
  stored content format — the field stays a markdown string, so existing pages
  round-trip unchanged.
- No image **upload** / attachments (the ported `ImageNode` is external-URL
  only — matches the sibling's spec-007 cut).
- We do **not** adopt the sibling's `widget: markdown-editor` annotation as the
  detection mechanism by default (see `architecture.md` §4 — wiki12 keeps its
  existing body-field detection so the DM→FM generator is untouched). Honoring
  the annotation *additionally* is a cheap, recommended add.
