export const ACCESS_TOKEN_KEY = "archive_access_token";
export const CSRF_TOKEN_KEY = "archive_csrf_token";

export type StoredSession = {
  token: string;
  csrfToken: string | null;
  username?: string | null;
};

export function getAccessToken(): string | null {
  return sessionStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token: string | null) {
  if (token) {
    sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
  } else {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  }
}

export function getCsrfToken(): string | null {
  return sessionStorage.getItem(CSRF_TOKEN_KEY);
}

export function setCsrfToken(token: string | null) {
  if (token) {
    sessionStorage.setItem(CSRF_TOKEN_KEY, token);
  } else {
    sessionStorage.removeItem(CSRF_TOKEN_KEY);
  }
}

export function setUsername(username: string | null) {
  if (username) {
    sessionStorage.setItem("archive_username", username);
  } else {
    sessionStorage.removeItem("archive_username");
  }
}

export function getUsername(): string | null {
  return sessionStorage.getItem("archive_username");
}

export function clearSessionStorage() {
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(CSRF_TOKEN_KEY);
  sessionStorage.removeItem("archive_username");
}

export function getStoredSession(): StoredSession | null {
  const token = getAccessToken();
  if (!token) return null;

  return {
    token,
    csrfToken: getCsrfToken(),
    username: getUsername(),
  };
}