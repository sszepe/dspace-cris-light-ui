/**
 * auth/AuthContext.tsx
 *
 * Provides authentication state to the whole app.
 * On mount, calls /api/authn/status to verify the stored JWT is still valid.
 * Logout calls POST /api/authn/logout before clearing local state.
 */

import React from "react";
import {
  apiLogin,
  apiLogout,
  apiAuthStatus,
  getToken,
  clearToken,
  type LoginCredentials,
  type EPerson,
} from "./client";

// ── Context shape ─────────────────────────────────────────────────────────────

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  eperson: EPerson | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  /** Re-fetch /api/authn/status (e.g. after profile edit) */
  refreshStatus: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [eperson, setEperson] = React.useState<EPerson | null>(null);

  const checkStatus = React.useCallback(async () => {
    const token = getToken();
    if (!token) {
      setIsAuthenticated(false);
      setEperson(null);
      setIsLoading(false);
      return;
    }

    try {
      const status = await apiAuthStatus();
      if (status.authenticated) {
        setIsAuthenticated(true);
        setEperson(status._embedded?.eperson ?? null);
      } else {
        clearToken();
        setIsAuthenticated(false);
        setEperson(null);
      }
    } catch {
      // Token invalid or network error — treat as unauthenticated
      clearToken();
      setIsAuthenticated(false);
      setEperson(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Verify token on mount
  React.useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  const login = React.useCallback(
    async (credentials: LoginCredentials) => {
      await apiLogin(credentials);
      // Re-check status to populate eperson
      setIsLoading(true);
      await checkStatus();
    },
    [checkStatus],
  );

  const logout = React.useCallback(async () => {
    await apiLogout(); // POST /api/authn/logout — invalidates server-side
    setIsAuthenticated(false);
    setEperson(null);
  }, []);

  const refreshStatus = React.useCallback(async () => {
    await checkStatus();
  }, [checkStatus]);

  const value = React.useMemo<AuthContextValue>(
    () => ({
      isAuthenticated,
      isLoading,
      eperson,
      login,
      logout,
      refreshStatus,
    }),
    [isAuthenticated, isLoading, eperson, login, logout, refreshStatus],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
