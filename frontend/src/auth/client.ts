/**
 * auth/client.ts
 *
 * Thin wrapper around fetch that:
 *  - Sends the JWT in Authorization: Bearer <token>
 *  - Reads the DSPACE-XSRF-TOKEN cookie and echoes it as X-XSRF-TOKEN
 *  - Persists the token returned by login / refreshed by the server
 *  - Exposes apiFetch for all API calls
 */

const BASE_URL = import.meta.env.VITE_DSPACE_URL ?? "";
const TOKEN_KEY = "dspace_jwt";

// ── Token store ───────────────────────────────────────────────────────────────

export function getToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  sessionStorage.removeItem(TOKEN_KEY);
}

// ── CSRF cookie helper ────────────────────────────────────────────────────────

function getCsrfToken(): string | null {
  const match = document.cookie
    .split("; ")
    .find((c) => c.startsWith("DSPACE-XSRF-TOKEN="));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
}

// ── Core fetch wrapper ────────────────────────────────────────────────────────

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const csrf = getCsrfToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (csrf) headers["X-XSRF-TOKEN"] = csrf;

  const res = await fetch(`${BASE_URL}/server${path}`, {
    ...options,
    credentials: "include", // send/receive cookies (needed for CSRF seed)
    headers,
  });

  // Server may return a refreshed token in the Authorization header
  const newToken = res.headers.get("Authorization")?.replace(/^Bearer\s+/i, "");
  if (newToken) setToken(newToken);

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`${res.status} ${res.statusText}: ${text}`);
  }

  // 204 No Content (e.g. logout)
  if (res.status === 204) return undefined as unknown as T;

  return res.json() as Promise<T>;
}

// ── Auth API calls ────────────────────────────────────────────────────────────

export interface LoginCredentials {
  user: string;
  password: string;
}

export interface AuthStatus {
  okay: boolean;
  authenticated: boolean;
  type: string;
  _links?: { eperson?: { href: string } };
  _embedded?: {
    eperson?: EPerson;
    specialGroups?: any;
  };
}

export interface EPerson {
  uuid: string;
  email: string;
  name: string | null;
  netid: string | null;
  lastActive: string | null;
  canLogIn: boolean;
  requireCertificate: boolean;
  selfRegistered: boolean;
  metadata: Record<string, Array<{ value: string; language: string | null }>>;
  _links: Record<string, { href: string }>;
}

/**
 * POST /api/authn/login
 * DSpace returns the JWT in the Authorization response header.
 */
export async function apiLogin(credentials: LoginCredentials): Promise<string> {
  const csrf = getCsrfToken();
  const body = new URLSearchParams({
    user: credentials.user,
    password: credentials.password,
  });

  const headers: Record<string, string> = {
    "Content-Type": "application/x-www-form-urlencoded",
  };
  if (csrf) headers["X-XSRF-TOKEN"] = csrf;

  const res = await fetch(`${BASE_URL}/server/api/authn/login`, {
    method: "POST",
    credentials: "include",
    headers,
    body,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(text || `Login failed (${res.status})`);
  }

  const token = res.headers.get("Authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) throw new Error("No token in login response");
  setToken(token);
  return token;
}

/**
 * POST /api/authn/logout
 * Sends the current JWT in Authorization + CSRF token.
 * Server invalidates the token server-side (all devices/browsers).
 */
export async function apiLogout(): Promise<void> {
  const token = getToken();
  const csrf = getCsrfToken();

  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (csrf) headers["X-XSRF-TOKEN"] = csrf;

  try {
    await fetch(`${BASE_URL}/server/api/authn/logout`, {
      method: "POST",
      credentials: "include",
      headers,
    });
  } finally {
    // Always clear local token, even if the request fails
    clearToken();
  }
}

/**
 * GET /api/authn/status
 * Returns current authentication state + embedded eperson.
 */
export async function apiAuthStatus(): Promise<AuthStatus> {
  return apiFetch<AuthStatus>("/api/authn/status");
}
