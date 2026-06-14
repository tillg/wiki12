import { beforeEach, describe, expect, it, vi } from "vitest";

// Isolate the content-API param building from the transport/auth layer.
vi.mock("./rpc", () => ({ rpc: vi.fn() }));

import { rpc } from "./rpc";
import { createDocument, resolveRef, toServerDocument } from "./content";

const rpcMock = vi.mocked(rpc);

describe("toServerDocument", () => {
  it("trims leading/trailing whitespace on string field values", () => {
    // Regression: the A12 kernel rejects leading/trailing spaces (formalePruefung
    // → fuehrendesBlank / nachfolgendesBlank), which crashed ADD_DOCUMENT (-32002).
    const out = toServerDocument({
      Page: { Title: "  Hello World ", Body: "Till is *back* " },
    });
    expect(out).toEqual({ Page: { Title: "Hello World", Body: "Till is *back*" } });
  });

  it("preserves interior whitespace and newlines", () => {
    const out = toServerDocument({ Page: { Body: "line one\nline two" } });
    expect((out.Page as Record<string, unknown>).Body).toBe("line one\nline two");
  });

  it("drops the form-engine wrapper keys", () => {
    const out = toServerDocument({
      id: "x",
      modelId: "Page_DM",
      __meta: { v: 1 },
      Page: { Title: "Keep" },
    });
    expect(out).toEqual({ Page: { Title: "Keep" } });
  });

  it("leaves non-string values untouched", () => {
    const out = toServerDocument({ Page: { Count: 3, Flag: true } });
    expect(out).toEqual({ Page: { Count: 3, Flag: true } });
  });
});

describe("resolveRef", () => {
  beforeEach(() => {
    rpcMock.mockReset();
  });

  it("dispatches ResolveBySlug with the server's `idOrSlug` param (not `ref`)", async () => {
    rpcMock.mockResolvedValue({
      type: "Page_DM",
      id: "pg_1",
      slug: "page:albert_einstein",
      found: true,
    });
    await resolveRef("albert_einstein");
    expect(rpcMock).toHaveBeenCalledWith("ResolveBySlug", { idOrSlug: "albert_einstein" });
  });

  it("resolves a docRef-shaped ref client-side without calling ResolveBySlug", async () => {
    const r = await resolveRef("Page_DM/pg_1");
    expect(r).toEqual({ type: "Page_DM", id: "pg_1", slug: "Page_DM/pg_1", found: true });
    expect(rpcMock).not.toHaveBeenCalled();
  });

  it("degrades to not-found when the op throws (op may be absent server-side)", async () => {
    rpcMock.mockImplementation(() => {
      throw new Error("Method not found");
    });
    const r = await resolveRef("missing_slug");
    expect(r).toEqual({ type: "", id: "", slug: "missing_slug", found: false });
  });
});

describe("createDocument", () => {
  beforeEach(() => {
    rpcMock.mockReset();
  });

  it("sends ADD_DOCUMENT with documentModelName + locale + trimmed group-keyed document", async () => {
    rpcMock.mockResolvedValue({ docRef: "Page_DM/pg_1" });
    const result = await createDocument("page", { Page: { Title: " Hello " } });
    expect(rpcMock).toHaveBeenCalledWith("ADD_DOCUMENT", {
      documentModelName: "Page_DM",
      locale: "en",
      document: { Page: { Title: "Hello" } },
    });
    // id is extracted from the returned docRef.
    expect(result.item.id).toBe("pg_1");
  });
});
