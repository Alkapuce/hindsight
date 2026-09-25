import type { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

type ListDocumentsArg = { query: Record<string, unknown> };

const { listDocuments, getDocument } = vi.hoisted(() => ({
  listDocuments: vi.fn<(arg: ListDocumentsArg) => Promise<unknown>>(),
  getDocument: vi.fn<(arg: { path: Record<string, unknown> }) => Promise<unknown>>(),
}));

vi.mock("@/lib/hindsight-client", () => ({
  sdk: { listDocuments, getDocument },
  lowLevelClient: {},
  dataplaneBankUrl: (bankId: string, suffix: string) => `http://dataplane/${bankId}${suffix}`,
  getDataplaneHeaders: () => ({}),
}));

vi.mock("@/lib/sdk-response", () => ({
  respondWithSdk: vi.fn(() => new Response(null, { status: 200 })),
}));

import { GET } from "@/app/api/documents/route";

function makeRequest(url: string): NextRequest {
  // The route only reads `request.nextUrl.searchParams`.
  return { nextUrl: new URL(url) } as unknown as NextRequest;
}

describe("GET /api/documents", () => {
  beforeEach(() => {
    listDocuments.mockReset();
    getDocument.mockReset();
    getDocument.mockResolvedValue({ data: {}, error: undefined });
    listDocuments.mockResolvedValue({ data: { items: [], total: 0 }, error: undefined });
  });

  it("forwards the `q` search term to the dataplane (search by document ID)", async () => {
    await GET(makeRequest("http://localhost/api/documents?bank_id=b1&q=my-doc-id&limit=25&offset=0"));

    expect(listDocuments).toHaveBeenCalledTimes(1);
    expect(listDocuments.mock.calls[0][0].query).toMatchObject({ q: "my-doc-id" });
  });

  it("omits `q` when no search term is provided", async () => {
    await GET(makeRequest("http://localhost/api/documents?bank_id=b1&limit=25&offset=0"));

    expect(listDocuments.mock.calls[0][0].query.q).toBeUndefined();
  });

  it("forwards repeated `tags` params and `tags_match` to the dataplane", async () => {
    await GET(
      makeRequest("http://localhost/api/documents?bank_id=b1&tags=alpha&tags=beta&tags_match=all_strict")
    );

    expect(listDocuments.mock.calls[0][0].query).toMatchObject({
      tags: ["alpha", "beta"],
      tags_match: "all_strict",
    });
  });

  it("omits `tags` when none are provided", async () => {
    await GET(makeRequest("http://localhost/api/documents?bank_id=b1"));

    expect(listDocuments.mock.calls[0][0].query.tags).toBeUndefined();
  });

  it("drops `tags_match` when no tags are filtered, so the dataplane default stands", async () => {
    await GET(makeRequest("http://localhost/api/documents?bank_id=b1&tags_match=all_strict"));

    expect(listDocuments.mock.calls[0][0].query.tags_match).toBeUndefined();
  });

  it("rejects an unknown `tags_match` value rather than passing it through", async () => {
    await GET(makeRequest("http://localhost/api/documents?bank_id=b1&tags=alpha&tags_match=bogus"));

    expect(listDocuments.mock.calls[0][0].query).toMatchObject({ tags: ["alpha"] });
    expect(listDocuments.mock.calls[0][0].query.tags_match).toBeUndefined();
  });

  // Regression for #4586: a slash-bearing document id arrives as a query param,
  // so the route never has to reconstruct it from path segments.
  it("fetches a single document when `document_id` is present, slashes intact", async () => {
    await GET(
      makeRequest(
        "http://localhost/api/documents?bank_id=b1&document_id=folder%2Fsub%2Fdoc.pdf"
      )
    );

    expect(listDocuments).not.toHaveBeenCalled();
    expect(getDocument.mock.calls[0][0].path).toMatchObject({
      bank_id: "b1",
      document_id: "folder/sub/doc.pdf",
    });
  });
});
