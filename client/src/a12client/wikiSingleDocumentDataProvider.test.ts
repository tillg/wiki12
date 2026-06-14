import { describe, expect, it } from "vitest";

import { splitDocRef } from "./docRefParts";

// splitDocRef turns an activity `instance` docRef ("Model_DM/<uuid>") into the
// (type, id) pair api/content.ts expects (it rebuilds the docRef internally).
describe("splitDocRef", () => {
  it("splits a docRef into model and id on the first slash", () => {
    expect(splitDocRef("Person_DM/7cd61fd3-86d0-4253-95e9-03a7e6d709a3")).toEqual({
      model: "Person_DM",
      id: "7cd61fd3-86d0-4253-95e9-03a7e6d709a3",
    });
  });

  it("keeps everything after the FIRST slash as the id (ids may contain slashes)", () => {
    expect(splitDocRef("Page_DM/a/b")).toEqual({ model: "Page_DM", id: "a/b" });
  });

  it("treats a value with no slash as the model with an empty id", () => {
    expect(splitDocRef("Person_DM")).toEqual({ model: "Person_DM", id: "" });
  });
});
