import { describe, expect, it } from "vitest";
import { isMarkdownBodyControl, MARKDOWN_BODY_ANNOTATION } from "./modelFields";

describe("isMarkdownBodyControl", () => {
  it("matches a control annotated with the markdown-body annotation", () => {
    expect(isMarkdownBodyControl({ annotations: [{ name: MARKDOWN_BODY_ANNOTATION }] })).toBe(true);
  });

  it("matches by known body field names", () => {
    expect(isMarkdownBodyControl({ fieldName: "Body" })).toBe(true);
    expect(isMarkdownBodyControl({ field: { name: "Description" } })).toBe(true);
    expect(isMarkdownBodyControl(undefined, "body")).toBe(true);
  });

  it("does not match a non-body field", () => {
    expect(isMarkdownBodyControl({ fieldName: "Title" })).toBe(false);
    expect(isMarkdownBodyControl(undefined)).toBe(false);
  });
});
