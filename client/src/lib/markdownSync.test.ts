import { describe, it, expect } from "vitest";
import { shouldReplaceFromExternal } from "./markdownSync";

describe("shouldReplaceFromExternal", () => {
  // The newline bug: the editor serializes "A\n"; the form engine echoes back a
  // trimmed "A". This is the SAME content, so the editor must NOT re-parse/replace
  // (doing so swallows a freshly typed paragraph and resets the caret).
  it("does NOT replace when the echo only differs by trailing whitespace", () => {
    expect(shouldReplaceFromExternal("A", "A\n", "A\n")).toBe(false);
  });

  it("does NOT replace right after <Return> (empty trailing paragraph, trimmed echo)", () => {
    // User pressed Enter: editor doc serializes to "A\n\n"; form echoes trimmed "A".
    expect(shouldReplaceFromExternal("A", "A\n\n", "A\n\n")).toBe(false);
  });

  it("does NOT replace on an exact echo of the last emitted value", () => {
    expect(shouldReplaceFromExternal("A\n", "A\n", "A\n")).toBe(false);
  });

  it("does NOT replace when the doc already shows the incoming value", () => {
    expect(shouldReplaceFromExternal("Loaded body.", null, "Loaded body.")).toBe(false);
  });

  it("DOES replace for a genuinely external value (e.g. loading a document)", () => {
    // Editor empty, never emitted; a stored body arrives → must load it.
    expect(shouldReplaceFromExternal("Physicist, relativity.", null, "")).toBe(true);
  });

  it("DOES replace when an external value differs in real content", () => {
    expect(shouldReplaceFromExternal("New external text", "old emitted", "old current")).toBe(true);
  });
});
