/**
 * src/api/django-client.ts
 *
 * HTTP client for the Django dspace_config REST API.
 *
 * All config modules that talk to Django (dashboard-config, quicklinks-config,
 * communities-config, collection-mapping) import `djangoFetch` from here
 * instead of each rolling their own fetch wrapper.
 *
 * Base URL is read from VITE_DJANGO_CONFIG_API_BASE_URL (default: /config-api).
 * The DSpace JWT stored in sessionStorage is forwarded automatically so Django
 * can authenticate the request via its DSpace JWT validation middleware.
 *
 * Usage
 * -----
 * import { djangoFetch } from "../api/django-client";
 *
 * const data = await djangoFetch<MyType>("/api/site-settings/");
 * await djangoFetch("/api/site-settings/", { method: "PATCH", body: { quicklinks_enabled: true } });
 */

import { getStoredJwt } from "../auth/client";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

function djangoBase(): string {
  return (
    (import.meta.env.VITE_DJANGO_CONFIG_API_BASE_URL as string | undefined) || "/config-api"
  ).replace(/\/$/, "");
}

// ---------------------------------------------------------------------------
// Error type
// ---------------------------------------------------------------------------

export class DjangoApiError extends Error {
  status: number;
  url: string;
  detail: unknown;

  constructor(message: string, status: number, url: string, detail?: unknown) {
    super(message);
    this.name = "DjangoApiError";
    this.status = status;
    this.url = url;
    this.detail = detail;
  }
}

// ---------------------------------------------------------------------------
// Core fetch
// ---------------------------------------------------------------------------

export async function djangoFetch<T = unknown>(
  path: string,
  init: {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: unknown;
    headers?: HeadersInit;
    signal?: AbortSignal;
  } = {},
): Promise<T> {
  const method = init.method ?? "GET";
  const url = `${djangoBase()}${path}`;

  const headers = new Headers(init.headers ?? {});
  headers.set("Accept", "application/json");

  const jwt = getStoredJwt();
  if (jwt && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${jwt}`);
  }

  let body: BodyInit | undefined;
  if (init.body != null) {
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    body = JSON.stringify(init.body);
  }

  let res: Response;
  try {
    res = await fetch(url, {
      method,
      headers,
      body,
      credentials: "include",
      signal: init.signal,
    });
  } catch (err: unknown) {
    throw new DjangoApiError(
      "Django config API is unreachable.",
      0,
      url,
      String((err as Error)?.message ?? err),
    );
  }

  if (res.status === 204) return undefined as T;

  const text = await res.text().catch(() => "");

  if (!res.ok) {
    let detail: unknown = text;
    try { if (text.trim()) detail = JSON.parse(text); } catch { /* keep text */ }
    const message =
      typeof detail === "object" && detail !== null && "detail" in detail
        ? String((detail as Record<string, unknown>).detail)
        : `Django API error ${res.status}`;
    throw new DjangoApiError(message, res.status, url, detail);
  }

  if (!text.trim()) return undefined as T;
  return JSON.parse(text) as T;
}

// ---------------------------------------------------------------------------
// Convenience wrappers
// ---------------------------------------------------------------------------

export function djangoGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  return djangoFetch<T>(path, { signal });
}

export function djangoPost<T>(path: string, body: unknown): Promise<T> {
  return djangoFetch<T>(path, { method: "POST", body });
}

export function djangoPatch<T>(path: string, body: unknown): Promise<T> {
  return djangoFetch<T>(path, { method: "PATCH", body });
}

export function djangoPut<T>(path: string, body: unknown): Promise<T> {
  return djangoFetch<T>(path, { method: "PUT", body });
}

export function djangoDelete(path: string): Promise<void> {
  return djangoFetch<void>(path, { method: "DELETE" });
}
