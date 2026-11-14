import { describe, expect, it, vi } from "vitest";
import { formspreeEndpoint, submitToFormspree } from "../src/lib/formspree";

describe("formspreeEndpoint", () => {
  it("returns undefined when not configured", () => {
    expect(formspreeEndpoint(undefined)).toBeUndefined();
    expect(formspreeEndpoint("")).toBeUndefined();
    expect(formspreeEndpoint("   ")).toBeUndefined();
  });

  it("accepts a form ID or a full endpoint URL", () => {
    expect(formspreeEndpoint("xyzabcde")).toBe("https://formspree.io/f/xyzabcde");
    expect(formspreeEndpoint(" https://formspree.io/f/xyzabcde ")).toBe("https://formspree.io/f/xyzabcde");
    expect(formspreeEndpoint("https://formspree.io/f/xyzabcde/")).toBe("https://formspree.io/f/xyzabcde");
  });

  it("rejects malformed values so a typo fails the build", () => {
    expect(() => formspreeEndpoint("https://evil.example/f/abc")).toThrow(/not a valid Formspree/);
    expect(() => formspreeEndpoint("abc def")).toThrow();
    expect(() => formspreeEndpoint("abc/../x")).toThrow();
  });
});

const jsonResponse = (status: number, body: unknown): Response =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

describe("submitToFormspree", () => {
  const endpoint = "https://formspree.io/f/xyzabcde";

  it("posts JSON with the AJAX headers Formspree expects", async () => {
    const fetchImpl = vi.fn(async () => jsonResponse(200, { ok: true, next: "/thanks" }));
    const result = await submitToFormspree(endpoint, { name: "Jane", _gotcha: "" }, { fetchImpl });
    expect(result).toEqual({ ok: true });
    expect(fetchImpl).toHaveBeenCalledOnce();
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe(endpoint);
    expect(init.method).toBe("POST");
    expect(init.headers).toMatchObject({ Accept: "application/json", "Content-Type": "application/json" });
    expect(JSON.parse(init.body as string)).toEqual({ name: "Jane", _gotcha: "" });
  });

  it("reports Formspree validation errors", async () => {
    const fetchImpl = vi.fn(async () => jsonResponse(422, { errors: [{ message: "should be an email" }] }));
    expect(await submitToFormspree(endpoint, {}, { fetchImpl })).toEqual({
      ok: false,
      reason: "rejected",
      detail: "should be an email",
    });
  });

  it("reports non-JSON errors by status code", async () => {
    const fetchImpl = vi.fn(async () => new Response("Bad gateway", { status: 502 }));
    expect(await submitToFormspree(endpoint, {}, { fetchImpl })).toEqual({
      ok: false,
      reason: "rejected",
      detail: "HTTP 502",
    });
  });

  it("reports network failures without throwing", async () => {
    const fetchImpl = vi.fn(async () => {
      throw new TypeError("Failed to fetch");
    });
    expect(await submitToFormspree(endpoint, {}, { fetchImpl })).toEqual({ ok: false, reason: "network" });
  });

  it("times out slow requests", async () => {
    const fetchImpl = vi.fn(
      (_url: string | URL | Request, init?: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")));
        }),
    );
    expect(await submitToFormspree(endpoint, {}, { fetchImpl, timeoutMs: 20 })).toEqual({
      ok: false,
      reason: "timeout",
    });
  });
});
