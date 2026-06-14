import { describe, expect, it } from "vitest";
import { isSlug, refSegment, refFromParam } from "./refUrl";

describe("isSlug", () => {
  it("accepts a namespaced slug", () => {
    expect(isSlug("page:albert_einstein")).toBe(true);
  });
  it("accepts a numeric-suffix slug", () => {
    expect(isSlug("person:till_gartner_5")).toBe(true);
  });
  it("rejects a docRef (<Model>_DM/<uuid>)", () => {
    expect(isSlug("Page_DM/abc-123")).toBe(false);
  });
  it("rejects a bare uuid (no namespace)", () => {
    expect(isSlug("abc-123-def")).toBe(false);
  });
});

describe("refSegment", () => {
  it("keeps a slug's colon literal (no %3A)", () => {
    expect(refSegment("page:albert_einstein")).toBe("page:albert_einstein");
  });
  it("keeps a numeric-suffix slug unchanged", () => {
    expect(refSegment("person:till_gartner_5")).toBe("person:till_gartner_5");
  });
  it("percent-encodes a docRef's slash (so it can't split the route)", () => {
    expect(refSegment("Page_DM/abc-123")).toBe("Page_DM%2Fabc-123");
  });
});

describe("refFromParam", () => {
  it("round-trips a slug", () => {
    const s = "page:albert_einstein";
    expect(refFromParam(refSegment(s))).toBe(s);
  });
  it("round-trips a docRef", () => {
    const d = "Page_DM/abc-123";
    expect(refFromParam(refSegment(d))).toBe(d);
  });
  it("decodes a legacy %3A-encoded slug", () => {
    expect(refFromParam("page%3Aalbert_einstein")).toBe("page:albert_einstein");
  });
});
