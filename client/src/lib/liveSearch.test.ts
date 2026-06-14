import { describe, expect, it } from "vitest";
import { liveSearchTarget } from "./liveSearch";

describe("liveSearchTarget", () => {
  it("first search from a non-/search route pushes /search?q=", () => {
    expect(liveSearchTarget("tesla", "/", "")).toEqual({ to: "/search?q=tesla", replace: false });
  });

  it("typing more while on /search replaces (no history spam)", () => {
    expect(liveSearchTarget("tesl", "/search", "te")).toEqual({ to: "/search?q=tesl", replace: true });
  });

  // Regression (card-click bug): leftover search text + a route change to Browse must
  // NOT bounce the user back to /search. The query is unchanged since the last nav, so
  // a bare route change yields no navigation.
  it("does NOT navigate on a route change when the query is unchanged (Browse stays Browse)", () => {
    expect(liveSearchTarget("tesla", "/", "tesla")).toBeNull();
    expect(liveSearchTarget("tesla", "/view/Page_DM%2Fx", "tesla")).toBeNull();
  });

  it("clearing the box while on /search shows the hint route (no q), replace", () => {
    expect(liveSearchTarget("", "/search", "tesla")).toEqual({ to: "/search", replace: true });
  });

  it("an empty box off /search does nothing", () => {
    expect(liveSearchTarget("", "/", "")).toBeNull();
    expect(liveSearchTarget("   ", "/", "")).toBeNull();
  });

  it("trims and url-encodes the query", () => {
    expect(liveSearchTarget("  a b  ", "/", "")).toEqual({ to: "/search?q=a%20b", replace: false });
  });
});
