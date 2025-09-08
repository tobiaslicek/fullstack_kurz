import { vi } from "vitest";

type Json = Record<string, any>;

export function ok(data: Json, init?: ResponseInit) {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
    ...init,
  });
}
export function fail(status = 500, data: Json = { error: "fail" }) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

/** Nastaví globální fetch mock s routerem podle URL. */
export function mockFetch(router: (url: string) => Promise<Response> | Response) {
  vi.stubGlobal("fetch", vi.fn((input: RequestInfo | URL) => {
    const url = typeof input === "string" ? input : String(input);
    return Promise.resolve(router(url));
  }));
}

/** Zruší globální fetch mock. */
export function restoreFetch() {
  (globalThis.fetch as any)?.mockRestore?.();
}
