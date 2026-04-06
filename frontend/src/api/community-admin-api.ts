/**
 * community-admin-api.ts
 *
 * DSpace REST API helpers for community admin group management.
 *
 * Flow:
 *   1. GET  /api/core/communities/{id}/adminGroup
 *      → 204 = no group yet; 200 = group exists
 *   2. POST /api/core/communities/{id}/adminGroup   (create group)
 *      payload: { metadata: { "dc.description": [{ value: "..." }] } }
 *   3. GET  /api/eperson/groups/{groupId}/subgroups  (current members)
 *   4. GET  /api/eperson/groups/search/isNotMemberOf (search addable groups)
 *   5. POST /api/eperson/groups/{groupId}/subgroups  (add subgroup)
 *      Content-Type: text/uri-list, body = self href of the group to add
 *   6. DELETE /api/eperson/groups/{groupId}/subgroups/{subgroupId}  (remove)
 */

import { apiFetch } from "../auth/client";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface AdminGroup {
  id: string;
  uuid: string;
  name: string;
  permanent: boolean;
  description: string;
}

export interface GroupMember {
  id: string;
  uuid: string;
  name: string;
  permanent: boolean;
  description: string;
  /** The linked DSpace object (community/collection) if any */
  linkedObjectName?: string;
  linkedObjectType?: string;
  selfHref: string;
}

// ── Admin group ───────────────────────────────────────────────────────────────

/**
 * Returns the admin group for a community, or null if none exists (204).
 */
export async function getCommunityAdminGroup(
  communityId: string,
): Promise<AdminGroup | null> {
  try {
    const data = await apiFetch<any>(
      `/api/core/communities/${communityId}/adminGroup`,
    );
    if (!data?.id) return null;
    return mapGroup(data);
  } catch (err: any) {
    // 204 No Content comes through as a successful but empty response;
    // a genuine 404 also means no group.
    if (err?.message?.includes("204") || err?.message?.includes("404")) {
      return null;
    }
    throw err;
  }
}

/**
 * Creates the admin group for a community.
 * description is stored as dc.description on the group.
 */
export async function createCommunityAdminGroup(
  communityId: string,
  description = "",
): Promise<AdminGroup> {
  const body: any = { metadata: {} };
  if (description.trim()) {
    body.metadata["dc.description"] = [{ value: description.trim() }];
  }
  const data = await apiFetch<any>(
    `/api/core/communities/${communityId}/adminGroup`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );
  if (!data?.id) throw new Error("Admin group creation failed.");
  return mapGroup(data);
}

// ── Subgroups (current members) ───────────────────────────────────────────────

/**
 * Lists all subgroups currently in the admin group.
 */
export async function listAdminGroupSubgroups(
  adminGroupId: string,
): Promise<GroupMember[]> {
  const all: GroupMember[] = [];
  let page = 0;

  for (;;) {
    const params = new URLSearchParams({
      page: String(page),
      size: "50",
      embed: "object",
    });
    const data = await apiFetch<any>(
      `/api/eperson/groups/${adminGroupId}/subgroups?${params}`,
    );
    const rows: any[] = data?._embedded?.subgroups ?? [];
    all.push(...rows.map(mapGroupMember));
    const totalPages: number = data?.page?.totalPages ?? 1;
    if (page >= totalPages - 1) break;
    page += 1;
  }

  return all;
}

// ── Searchable groups (not yet members) ──────────────────────────────────────

/**
 * Searches groups that can be added to the admin group (isNotMemberOf).
 */
export async function searchAddableGroups(
  adminGroupId: string,
  query: string,
  page = 0,
  size = 10,
): Promise<{ members: GroupMember[]; totalElements: number; totalPages: number }> {
  const params = new URLSearchParams({
    group: adminGroupId,
    query: query.trim(),
    page: String(page),
    size: String(size),
    embed: "object",
  });
  const data = await apiFetch<any>(
    `/api/eperson/groups/search/isNotMemberOf?${params}`,
  );
  const rows: any[] = data?._embedded?.groups ?? [];
  return {
    members: rows.map(mapGroupMember),
    totalElements: data?.page?.totalElements ?? 0,
    totalPages: data?.page?.totalPages ?? 1,
  };
}

// ── Add / remove subgroups ────────────────────────────────────────────────────

/**
 * Adds a group as a subgroup of the admin group.
 * DSpace expects Content-Type: text/uri-list with the self href as body.
 */
export async function addSubgroupToAdminGroup(
  adminGroupId: string,
  subgroupHref: string,
): Promise<void> {
  // apiFetch sets X-XSRF-TOKEN for non-GET but uses JSON by default.
  // For text/uri-list we need to call the raw fetch with CSRF manually.
  // const { getStoredJwt, getStoredCsrfToken, ensureCsrfToken } = await import(
  const { getStoredJwt, ensureCsrfToken } = await import(
    "../auth/client"
  );
  const jwt = getStoredJwt();
  const csrf = await ensureCsrfToken();

  const API = (import.meta as any).env?.VITE_API_BASE_URL ?? "/server";
  const res = await fetch(
    `${API}/api/eperson/groups/${adminGroupId}/subgroups`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "text/uri-list",
        "X-XSRF-TOKEN": csrf,
        ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
      },
      body: subgroupHref,
    },
  );
  if (!res.ok && res.status !== 204) {
    throw new Error(`Add subgroup failed: ${res.status}`);
  }
}

/**
 * Removes a subgroup from the admin group.
 */
export async function removeSubgroupFromAdminGroup(
  adminGroupId: string,
  subgroupId: string,
): Promise<void> {
  await apiFetch<void>(
    `/api/eperson/groups/${adminGroupId}/subgroups/${subgroupId}`,
    { method: "DELETE" },
  );
}

// ── Mappers ───────────────────────────────────────────────────────────────────

function mapGroup(data: any): AdminGroup {
  return {
    id: data.id,
    uuid: data.uuid,
    name: data.name ?? "",
    permanent: data.permanent ?? false,
    description: data.metadata?.["dc.description"]?.[0]?.value ?? "",
  };
}

function mapGroupMember(data: any): GroupMember {
  const obj = data._embedded?.object;
  return {
    id: data.id,
    uuid: data.uuid,
    name: data.name ?? "",
    permanent: data.permanent ?? false,
    description: data.metadata?.["dc.description"]?.[0]?.value ?? "",
    linkedObjectName: obj?.name ?? undefined,
    linkedObjectType: obj?.type ?? undefined,
    selfHref: data._links?.self?.href ?? "",
  };
}
