/// <reference types="vite/client" />

import {
  clearSessionStorage,
  getAccessToken,
  getCsrfToken,
  setAccessToken,
  setCsrfToken,
} from "./storage";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/server";

export class ApiError extends Error {
  status?: number;
  url?: string;
  detail?: unknown;

  constructor(message: string, opts?: { status?: number; url?: string; detail?: unknown }) {
    super(message);
    this.name = "ApiError";
    this.status = opts?.status;
    this.url = opts?.url;
    this.detail = opts?.detail;
  }
}

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

function isModifying(method: Method) {
  return method !== "GET";
}

function emit(name: "api:down" | "api:up", detail?: unknown) {
  window.dispatchEvent(new CustomEvent(name, { detail }));
}

function normalizeAuthHeader(value: string | null): string | null {
  if (!value) return null;
  return value.replace(/^Bearer\s+/i, "").trim() || null;
}

function updateSessionFromResponse(res: Response) {
  const csrf = res.headers.get("DSPACE-XSRF-TOKEN");
  if (csrf) {
    setCsrfToken(csrf);
  }

  const auth = normalizeAuthHeader(res.headers.get("Authorization"));
  if (auth) {
    setAccessToken(auth);
  }
}

async function readTextSafe(res: Response): Promise<string> {
  try {
    return await res.text();
  } catch {
    return "";
  }
}

function buildUrl(path: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${API_BASE_URL}${path}`;
}

function buildHeaders(method: Method, extra?: HeadersInit): Headers {
  const headers = new Headers(extra);

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  const token = getAccessToken();
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (isModifying(method)) {
    const csrf = getCsrfToken();
    if (csrf && !headers.has("X-XSRF-TOKEN")) {
      headers.set("X-XSRF-TOKEN", csrf);
    }
  }

  return headers;
}

function shouldSendJsonBody(body: unknown, headers: Headers) {
  if (body == null) return false;
  const contentType = headers.get("Content-Type");
  return !contentType || contentType.includes("application/json");
}

async function parseBody<T>(res: Response): Promise<T> {
  if (res.status === 204) {
    return undefined as T;
  }

  const text = await readTextSafe(res);
  if (!text.trim()) {
    return undefined as T;
  }

  const contentType = res.headers.get("content-type")?.toLowerCase() ?? "";

  if (contentType.includes("application/json") || text.trim().startsWith("{") || text.trim().startsWith("[")) {
    try {
      return JSON.parse(text) as T;
    } catch {
      throw new ApiError("API returned invalid JSON.", { status: res.status, detail: text.slice(0, 400) });
    }
  }

  return text as T;
}

async function handleError(res: Response, url: string): Promise<never> {
  updateSessionFromResponse(res);

  const text = await readTextSafe(res);
  let detail: unknown = text;

  try {
    if (text.trim()) {
      detail = JSON.parse(text);
    }
  } catch {
    // keep text
  }

  if (res.status === 401) {
    clearSessionStorage();
    emit("api:down", { reason: "unauthorized", status: 401, url });
    throw new ApiError("SESSION_EXPIRED", { status: 401, url, detail });
  }

  const message =
    typeof detail === "object" && detail && "message" in (detail as any)
      ? String((detail as any).message)
      : typeof detail === "object" && detail && "detail" in (detail as any)
      ? String((detail as any).detail)
      : `Request failed (${res.status})`;

  throw new ApiError(message, { status: res.status, url, detail });
}

export async function ensureCsrfToken(force = false): Promise<string> {
  const existing = getCsrfToken();
  if (existing && !force) return existing;

  const url = buildUrl("/api/security/csrf");
  const res = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  updateSessionFromResponse(res);

  const csrf = getCsrfToken();
  if (!res.ok || !csrf) {
    throw new ApiError("Could not obtain CSRF token.", { status: res.status, url });
  }

  return csrf;
}

export async function apiFetch<T>(
  path: string,
  opts?: {
    method?: Method;
    body?: unknown;
    headers?: HeadersInit;
    signal?: AbortSignal;
  }
): Promise<T> {
  const method = opts?.method ?? "GET";
  const url = buildUrl(path);

  if (isModifying(method)) {
    await ensureCsrfToken();
  }

  const headers = buildHeaders(method, opts?.headers);

  let body: BodyInit | undefined = undefined;
  if (opts?.body != null) {
    if (shouldSendJsonBody(opts.body, headers)) {
      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
      }
      body = JSON.stringify(opts.body);
    } else {
      body = opts.body as BodyInit;
    }
  }

  let res: Response;
  try {
    res = await fetch(url, {
      method,
      credentials: "include",
      headers,
      body,
      signal: opts?.signal,
    });
  } catch (error: any) {
    emit("api:down", { reason: "network", url, error: String(error?.message ?? error) });
    throw new ApiError("API is unreachable.", { url, detail: String(error?.message ?? error) });
  }

  emit("api:up", { url, status: res.status });
  updateSessionFromResponse(res);

  if (!res.ok) {
    return handleError(res, url);
  }

  return parseBody<T>(res);
}