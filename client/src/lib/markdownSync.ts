// Decision logic for the controlled Milkdown editor's value-sync (extracted so it can
// be unit-tested without a DOM/editor — see MilkdownEditor.tsx).
//
// The editor is a controlled component: it emits markdown via onChange, the parent
// (form engine) feeds the value back as `props.value`, and a sync effect decides
// whether to re-parse that value into the editor. It must re-parse ONLY for genuinely
// external changes (e.g. loading a document) — never for the echo of the user's own
// edits, or the document gets rebuilt and the caret jumps (e.g. a freshly typed
// paragraph from <Return> is swallowed).
//
// KEY SUBTLETY: the editor serializes with a trailing newline (e.g. "A\n"), but the
// form engine trims the value it echoes back ("A"). A naive `===` comparison treats
// that trimmed echo as an external change and re-parses on every keystroke — that is
// the newline bug. So comparisons must ignore trailing whitespace.

/** Strip trailing whitespace/newlines, which markdown serialization adds and the form layer trims. */
function normalizeTrailing(value: string | null | undefined): string {
  return (value ?? "").replace(/\s+$/, "");
}

/**
 * Should the editor re-parse `incoming` and replace its document?
 *
 * @param incoming           the value the parent passed (props.value)
 * @param lastEmitted        the markdown the editor last emitted via onChange (or null)
 * @param currentDocMarkdown the editor's current document serialized to markdown
 * @returns true only for a genuinely external value (not an echo, not already shown)
 */
export function shouldReplaceFromExternal(
  incoming: string | null | undefined,
  lastEmitted: string | null,
  currentDocMarkdown: string,
): boolean {
  const inc = normalizeTrailing(incoming);
  if (inc === normalizeTrailing(lastEmitted)) return false; // echo of our own edit
  if (inc === normalizeTrailing(currentDocMarkdown)) return false; // already displayed
  return true;
}
