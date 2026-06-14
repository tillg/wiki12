import { describe, expect, it } from "vitest";
import { changesOf, createdOnOf, rootFields, slugOf, titleOf } from "./envelope";

const personDoc = {
  __meta: { docRef: "Person_DM/pe_1" },
  Person: {
    FirstName: "Ada",
    LastName: "Lovelace",
    Slug: "person:ada_lovelace",
    Title: "Ada Lovelace",
    CreatedOn: "2026-06-14T00:00:00Z",
    Changes: [
      { ChangedOn: "2026-06-14T00:00:00Z", Summary: "created" },
      { ChangedOn: "2026-06-15T09:30:00Z", Summary: "updated: Nationality" },
    ],
  },
};

describe("rootFields", () => {
  it("descends into the model-rooted group past __meta", () => {
    expect(rootFields(personDoc).FirstName).toBe("Ada");
  });
});

describe("titleOf", () => {
  it("prefers the derived/authored Title", () => {
    expect(titleOf(personDoc)).toBe("Ada Lovelace");
  });
  it("falls back to a FirstName+LastName join when no Title", () => {
    expect(titleOf({ Person: { FirstName: "Grace", LastName: "Hopper" } })).toBe("Grace Hopper");
  });
  it("falls back to Name, then the provided fallback", () => {
    expect(titleOf({ Location: { Name: "Berlin" } })).toBe("Berlin");
    expect(titleOf({ Page: {} }, "page:x")).toBe("page:x");
  });
});

describe("slugOf", () => {
  it("returns the envelope Slug when present", () => {
    expect(slugOf(personDoc)).toBe("person:ada_lovelace");
  });
  it("returns '' when the Slug is absent (drives the docRef fallback)", () => {
    expect(slugOf({ Page: { Title: "x" } })).toBe("");
  });
});

describe("createdOnOf", () => {
  it("returns the CreatedOn instant", () => {
    expect(createdOnOf(personDoc)).toBe("2026-06-14T00:00:00Z");
  });
  it("returns null when absent", () => {
    expect(createdOnOf({ Page: { Title: "x" } })).toBeNull();
  });
});

describe("changesOf", () => {
  it("returns the change log newest-first (reverse-chronological)", () => {
    const c = changesOf(personDoc);
    expect(c).toHaveLength(2);
    expect(c[0].summary).toBe("updated: Nationality");
    expect(c[1].summary).toBe("created");
  });
  it("returns an empty array when there is no Changes log", () => {
    expect(changesOf({ Page: { Title: "x" } })).toEqual([]);
  });
});
