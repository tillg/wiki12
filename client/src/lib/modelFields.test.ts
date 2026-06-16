import { describe, expect, it } from "vitest";
import { boundFieldName, isMarkdownBodyControl, MARKDOWN_BODY_ANNOTATION } from "./modelFields";

describe("boundFieldName", () => {
  it("reads the leaf elementName from a generated control's elementPath", () => {
    // A generated Control carries only elementRef ("F3") + elementPath; the last
    // path segment's elementName is the bound DM field's NAME.
    expect(boundFieldName({ elementPath: [{ elementName: "Body" }] })).toBe("Body");
    expect(
      boundFieldName({ elementPath: [{ elementName: "Group1" }, { elementName: "Description" }] }),
    ).toBe("Description");
  });

  it("falls back to fieldName / field.name for hand-authored controls", () => {
    expect(boundFieldName({ fieldName: "Body" })).toBe("Body");
    expect(boundFieldName({ field: { name: "Description" } })).toBe("Description");
  });

  it("returns undefined when no field info is present", () => {
    expect(boundFieldName(undefined)).toBeUndefined();
    expect(boundFieldName({})).toBeUndefined();
    expect(boundFieldName({ elementPath: [] })).toBeUndefined();
  });
});

describe("isMarkdownBodyControl", () => {
  it("matches a control annotated with the markdown-body annotation", () => {
    expect(isMarkdownBodyControl({ annotations: [{ name: MARKDOWN_BODY_ANNOTATION }] })).toBe(true);
  });

  it("matches by known body field names", () => {
    expect(isMarkdownBodyControl({ fieldName: "Body" })).toBe(true);
    expect(isMarkdownBodyControl({ field: { name: "Description" } })).toBe(true);
    expect(isMarkdownBodyControl(undefined, "body")).toBe(true);
  });

  it("matches a generated control via its elementPath leaf (the real bug)", () => {
    // Regression for BUG 4: generated controls only have elementRef ("F3") +
    // elementPath, no fieldName — detection must still fire off the leaf name.
    expect(isMarkdownBodyControl({ elementPath: [{ elementName: "Body" }] })).toBe(true);
    expect(isMarkdownBodyControl({ elementPath: [{ elementName: "Description" }] })).toBe(true);
  });

  it("does not match a non-body field", () => {
    expect(isMarkdownBodyControl({ fieldName: "Title" })).toBe(false);
    expect(isMarkdownBodyControl({ elementPath: [{ elementName: "Slug" }] })).toBe(false);
    expect(isMarkdownBodyControl(undefined)).toBe(false);
  });
});
