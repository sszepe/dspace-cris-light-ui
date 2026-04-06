const API = import.meta.env.VITE_API_BASE_URL || "/server";

function readHeader(headers: Headers, name: string): string | null {
  const value = headers.get(name);
  return value && value.trim() ? value.trim() : null;
}

export function getStoredCsrfToken(): string | null {
  return sessionStorage.getItem("csrf");
}

export function setStoredCsrfToken(token: string | null) {
  if (token) {
    sessionStorage.setItem("csrf", token);
  } else {
    sessionStorage.removeItem("csrf");
  }
}

export function getStoredJwt(): string | null {
  return sessionStorage.getItem("jwt");
}

export function setStoredJwt(token: string | null) {
  if (token) {
    sessionStorage.setItem("jwt", token);
  } else {
    sessionStorage.removeItem("jwt");
  }
}

export function clearStoredAuth() {
  sessionStorage.removeItem("csrf");
  sessionStorage.removeItem("jwt");
}

function updateTokensFromResponse(res: Response) {
  const csrf = readHeader(res.headers, "DSPACE-XSRF-TOKEN");
  if (csrf) {
    setStoredCsrfToken(csrf);
  }

  const auth = readHeader(res.headers, "Authorization");
  if (auth) {
    setStoredJwt(auth.replace(/^Bearer\s+/i, ""));
  }
}

export async function ensureCsrfToken(force = false): Promise<string> {
  const existing = getStoredCsrfToken();
  if (existing && !force) {
    return existing;
  }

  const res = await fetch(`${API}/api/security/csrf`, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  updateTokensFromResponse(res);

  if (!res.ok) {
    throw new Error(`CSRF request failed: ${res.status}`);
  }

  const csrf = getStoredCsrfToken();
  if (!csrf) {
    throw new Error("No DSPACE-XSRF-TOKEN returned by backend");
  }

  return csrf;
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const method = (init.method || "GET").toUpperCase();
  const headers = new Headers(init.headers || {});

  const jwt = getStoredJwt();
  if (jwt && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${jwt}`);
  }

  if (method !== "GET" && method !== "HEAD") {
    const csrf = await ensureCsrfToken();
    headers.set("X-XSRF-TOKEN", csrf);
  }

  const res = await fetch(`${API}${path}`, {
    ...init,
    method,
    headers,
    credentials: "include",
  });

  updateTokensFromResponse(res);

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API error ${res.status}${text ? `: ${text}` : ""}`);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("json")) {
    return res.json();
  }

  return (await res.text()) as T;
}