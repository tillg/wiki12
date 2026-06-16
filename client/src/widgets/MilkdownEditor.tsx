// Milkdown wrapped as a controlled markdown editor for the A12 form engine.
//
// Milkdown is markdown-native (ProseMirror + Remark): the value IS the markdown
// string, so it binds directly to the A12 String body field — no serialization
// (findings-a12.md §5, the reason we picked it over A12's Lexical RTE).
//
// FOCUS/SCROLL CAVEAT (findings-a12.md §5; formengine docs "ScrollHandler"):
// the form engine only focuses elements that are input/select/textarea OR a div
// with data-role="text-output". Milkdown's editable surface is a contenteditable
// div, so we put data-role="text-output" and the form engine's uiID on the
// wrapper, letting "jump to field" from the validation bar work.

import { useEffect, useRef } from "react";
import type { ReactElement } from "react";
import { Editor, rootCtx, defaultValueCtx, editorViewCtx, editorViewOptionsCtx, parserCtx, serializerCtx } from "@milkdown/core";
import { commonmark } from "@milkdown/preset-commonmark";
import { nord } from "@milkdown/theme-nord";
import { listener, listenerCtx } from "@milkdown/plugin-listener";
import { shouldReplaceFromExternal } from "../lib/markdownSync";

export interface MilkdownEditorProps {
  /** Current markdown string (the form field value). */
  value: string;
  /** Called with the new markdown whenever the document changes. */
  onChange: (markdown: string) => void;
  /** Form engine HTML id used by the ScrollHandler to focus this control. */
  uiID?: string;
  readOnly?: boolean;
  ariaLabel?: string;
}

export function MilkdownEditor(props: MilkdownEditorProps): ReactElement {
  const hostRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<Editor | null>(null);
  // Keep the latest onChange without re-creating the editor on every render.
  const onChangeRef = useRef(props.onChange);
  onChangeRef.current = props.onChange;
  // Keep the latest read-only flag readable from the editor's editable callback.
  const readOnlyRef = useRef(props.readOnly);
  readOnlyRef.current = props.readOnly;
  // The markdown this editor last emitted. When props.value comes back equal to it,
  // it's the echo of a local edit — never re-parse/replace (that would reset the
  // caret, e.g. swallow a newly typed paragraph / Return key).
  const lastEmittedRef = useRef<string | null>(null);

  // Create the editor once on mount.
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let cancelled = false;

    const initial = props.value ?? "";
    Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, host);
        ctx.set(defaultValueCtx, initial);
        // ProseMirror consults `editable` on every state change; read the live ref
        // so read-only (View mode) disables the contenteditable surface.
        ctx.update(editorViewOptionsCtx, (prev) => ({
          ...prev,
          editable: () => !readOnlyRef.current,
        }));
        ctx.get(listenerCtx).markdownUpdated((_ctx, markdown) => {
          lastEmittedRef.current = markdown;
          onChangeRef.current(markdown);
        });
      })
      .config(nord)
      .use(commonmark)
      .use(listener)
      .create()
      .then((editor) => {
        if (cancelled) {
          editor.destroy();
          return;
        }
        editorRef.current = editor;
      });

    return () => {
      cancelled = true;
      editorRef.current?.destroy();
      editorRef.current = null;
    };
    // Intentionally create once; value sync is handled in the effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Push external value changes (e.g. loading an existing document) into the
  // editor without clobbering in-progress edits: only replace when the editor's
  // current markdown differs from the incoming value.
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    const incoming = props.value ?? "";
    editor.action((ctx) => {
      const view = ctx.get(editorViewCtx);
      const serializer = ctx.get(serializerCtx);
      // Re-parse/replace ONLY for a genuinely external value. The echo of the user's
      // own edits differs only by trailing whitespace (editor emits "A\n"; the form
      // layer trims to "A"), and replacing then would swallow a just-typed paragraph
      // and reset the caret. shouldReplaceFromExternal ignores trailing whitespace.
      if (!shouldReplaceFromExternal(incoming, lastEmittedRef.current, serializer(view.state.doc))) {
        return;
      }
      // PARSE the markdown into a ProseMirror document and replace the content. Using
      // schema.text() here would insert the markdown as LITERAL text, which Milkdown
      // then re-escapes every cycle (runaway `\*\*…`). parserCtx round-trips cleanly.
      const parser = ctx.get(parserCtx);
      const parsed = parser(incoming);
      if (!parsed) return;
      const { state } = view;
      view.dispatch(state.tr.replaceWith(0, state.doc.content.size, parsed.content));
    });
  }, [props.value]);

  // Re-evaluate editability when read-only flips (e.g. View ↔ Edit) by dispatching a
  // no-op transaction; ProseMirror re-reads the `editable` callback on each update.
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    editor.action((ctx) => {
      const view = ctx.get(editorViewCtx);
      view.dispatch(view.state.tr);
    });
  }, [props.readOnly]);

  return (
    <div
      id={props.uiID}
      data-role="text-output"
      className="wiki12-milkdown"
      aria-label={props.ariaLabel}
      tabIndex={-1}
      style={{
        border: "1px solid #ccc",
        borderRadius: 2,
        padding: "0.5rem",
        minHeight: "12rem",
        background: props.readOnly ? "#f7f7f7" : "#fff",
      }}
    >
      <div ref={hostRef} />
    </div>
  );
}
