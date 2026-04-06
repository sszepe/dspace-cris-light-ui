import React from "react";
import { apiFetch, ensureCsrfToken, clearStoredAuth, setStoredJwt, setStoredCsrfToken } from "./client";
import {
  fetchAuthStatus,
  fetchEPersonByHref,
  fetchEPersonGroups,
  fetchAuthorizedEntityTypes,
  fetchAuthorizedCollectionEntityTypes,
} from "../api/person-api";

// ── Types ─────────────────────────────────────────────────────────────────────

export type EPerson = {
  id: string;
  uuid: string;
  name: string | null;
  email: string | null;
  netid: string | null;
  lastActive: string | null;
  canLogIn: boolean;
  requireCertificate: boolean;
  selfRegistered: boolean;
  metadata: Record<string, Array<{ value: string; language?: string | null; authority?: string | null; confidence?: number; place?: number }>>;
  _links?: {
    self?: { href: string };
    groups?: { href: string };
  };
};

export type Group = {
  id: string;
  uuid: string;
  name: string;
  permanent: boolean;
  metadata?: Record<string, Array<{ value: string }>>;
  _embedded?: {
    object?: any;
  };
};

export type EntityType = {
  id: number;
  label: string;
};

type AuthState = {
  isAuthenticated: boolean;
  username: string | null;
  epersonId: string | null;
  eperson: EPerson | null;
  groups: Group[];
  /** Entity types authorized via external source (for dashboard cluster display). */
  entityTypes: EntityType[];
  /**
   * Entity types the user can submit to via at least one collection.
   * Used to gate creation / import buttons in the UI.
   * Populated from /api/core/entitytypes/search/findAllByAuthorizedCollection.
   */
  collectionEntityTypes: EntityType[];
};

type AuthContextValue = {
  isAuthenticated: boolean;
  isLoading: boolean;
  username: string | null;
  epersonId: string | null;
  eperson: EPerson | null;
  groups: Group[];
  entityTypes: EntityType[];
  collectionEntityTypes: EntityType[];
  /** True when the user is a member of the DSpace Administrators group. */
  isAdmin: boolean;
  /**
   * True when the user is a community admin for at least one community.
   * Derived from membership in any group named COMMUNITY_<uuid>_ADMIN.
   */
  isCommunityAdmin: boolean;
  /**
   * Set of community UUIDs for which the user is a community admin.
   * Derived from group names matching COMMUNITY_<uuid>_ADMIN.
   */
  communityAdminIds: ReadonlySet<string>;
  /**
   * Returns true if the user is a community admin for the given community UUID.
   * Shorthand for communityAdminIds.has(communityId).
   */
  isCommunityAdminOf: (communityId: string) => boolean;
  /**
   * Returns true if the user can create items of the given entity type.
   * Checks collectionEntityTypes (submit permission on a collection).
   */
  canCreate: (entityType: string) => boolean;
  refreshUser: () => Promise<void>;
  login: (u: string, p: string) => Promise<void>;
  logout: () => Promise<void>;
};

// ── Constants ─────────────────────────────────────────────────────────────────

// const CSRF_TOKEN_KEY = "csrf";
const JWT_KEY = "jwt";
const ADMIN_GROUP_NAME = "Administrator";
// DSpace names community admin groups "COMMUNITY_<uuid>_ADMIN"
const COMMUNITY_ADMIN_RE = /^COMMUNITY_([0-9a-f-]+)_ADMIN$/i;

const EMPTY_STATE: AuthState = {
  isAuthenticated: false,
  username: null,
  epersonId: null,
  eperson: null,
  groups: [],
  entityTypes: [],
  collectionEntityTypes: [],
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function metaFirst(meta: EPerson["metadata"] | undefined, field: string): string | null {
  return meta?.[field]?.[0]?.value ?? null;
}

async function loadCurrentUser(): Promise<AuthState> {
  const status = await fetchAuthStatus();

  if (!status?.authenticated) {
    return EMPTY_STATE;
  }

  const epersonHref = status?._links?.eperson?.href;
  let eperson: EPerson | null = null;
  let groups: Group[] = [];
  let entityTypes: EntityType[] = [];
  let collectionEntityTypes: EntityType[] = [];

  if (epersonHref) {
    eperson = await fetchEPersonByHref(epersonHref).catch(() => null);
  }

  if (eperson?.id) {
    [groups, entityTypes, collectionEntityTypes] = await Promise.all([
      fetchEPersonGroups(eperson.id).catch(() => []),
      fetchAuthorizedEntityTypes().catch(() => []),
      fetchAuthorizedCollectionEntityTypes().catch(() => []),
    ]);
  }

  const firstName = metaFirst(eperson?.metadata, "eperson.firstname");
  const lastName = metaFirst(eperson?.metadata, "eperson.lastname");
  const username =
    firstName && lastName
      ? `${firstName} ${lastName}`
      : eperson?.email ?? eperson?.name ?? "user";

  return {
    isAuthenticated: true,
    username,
    epersonId: eperson?.id ?? null,
    eperson,
    groups,
    entityTypes,
    collectionEntityTypes,
  };
}

// ── Context ───────────────────────────────────────────────────────────────────

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<AuthState>(EMPTY_STATE);
  const [loading, setLoading] = React.useState(true);

  const refreshUser = React.useCallback(async () => {
    const next = await loadCurrentUser();
    setState(next);
  }, []);

  React.useEffect(() => {
    const existingJwt = sessionStorage.getItem(JWT_KEY);
    if (!existingJwt) {
      setLoading(false);
      return;
    }

    refreshUser()
      .catch(() => {
        clearStoredAuth();
        setState(EMPTY_STATE);
      })
      .finally(() => setLoading(false));
  }, [refreshUser]);

  const login = React.useCallback(async (username: string, password: string) => {
    const csrf = await ensureCsrfToken(true);

    const body = new URLSearchParams();
    body.set("user", username);
    body.set("password", password);

    const API = import.meta.env.VITE_API_BASE_URL || "/server";
    const res = await fetch(`${API}/api/authn/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        "X-XSRF-TOKEN": csrf,
      },
      body: body.toString(),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(text || `Login failed (${res.status})`);
    }

    const rotatedCsrf = res.headers.get("DSPACE-XSRF-TOKEN");
    if (rotatedCsrf) setStoredCsrfToken(rotatedCsrf);

    const auth = res.headers.get("Authorization");
    if (auth) setStoredJwt(auth.replace(/^Bearer\s+/i, "").trim());

    const next = await loadCurrentUser();
    setState(next);
  }, []);

  const logout = React.useCallback(async () => {
    try {
      await apiFetch("/api/authn/logout", { method: "POST" });
    } finally {
      clearStoredAuth();
      setState(EMPTY_STATE);
    }
  }, []);

  const isAdmin = state.groups.some((g) => g.name === ADMIN_GROUP_NAME);

  const communityAdminIds = React.useMemo<ReadonlySet<string>>(() => {
    const ids = new Set<string>();
    for (const g of state.groups) {
      const m = COMMUNITY_ADMIN_RE.exec(g.name);
      if (m) ids.add(m[1].toLowerCase());
    }
    return ids;
  }, [state.groups]);

  const isCommunityAdmin = communityAdminIds.size > 0;

  const isCommunityAdminOf = React.useCallback(
    (communityId: string) => communityAdminIds.has(communityId.toLowerCase()),
    [communityAdminIds],
  );

  const canCreate = React.useCallback(
    (entityType: string) => {
      const normalised = entityType.toLowerCase();
      return state.collectionEntityTypes.some(
        (et) => et.label.toLowerCase() === normalised,
      );
    },
    [state.collectionEntityTypes],
  );

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: state.isAuthenticated,
        isLoading: loading,
        username: state.username,
        epersonId: state.epersonId,
        eperson: state.eperson,
        groups: state.groups,
        entityTypes: state.entityTypes,
        collectionEntityTypes: state.collectionEntityTypes,
        isAdmin,
        isCommunityAdmin,
        communityAdminIds,
        isCommunityAdminOf,
        canCreate,
        refreshUser,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
