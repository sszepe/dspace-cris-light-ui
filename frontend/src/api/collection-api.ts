/**
 * collection-api.ts
 *
 * DSpace REST API helpers for Collection management.
 *
 * Create:
 *   POST /api/core/collections?parent={communityId}
 *
 * Permission groups (all are POST on sub-resources of the collection):
 *   adminGroup        → /api/core/collections/{id}/adminGroup
 *   submittersGroup   → /api/core/collections/{id}/submittersGroup
 *   itemReadGroup     → /api/core/collections/{id}/itemReadGroup        (removes Anonymous)
 *   bitstreamReadGroup→ /api/core/collections/{id}/bitstreamReadGroup   (removes Anonymous)
 *
 * Additional TYPE_SUBMISSION resource policies:
 *   POST /api/authz/resourcepolicies?resource={collectionId}&group={groupId}
 *   GET  /api/authz/resourcepolicies/search/resource?uuid={collectionId}&embed=eperson&embed=group
 *   DELETE /api/authz/resourcepolicies/{policyId}
 *
 * Group search (isNotMemberOf is not used here; we reuse community-admin-api
 * helpers for the subgroup search pattern and add a plain group search).
 */

import { apiFetch } from "../auth/client";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface CollectionPayload {
  title: string;
  description?: string;         // dc.description (HTML allowed)
  abstract?: string;             // dc.description.abstract
  rights?: string;               // dc.rights (HTML allowed)
  tableOfContents?: string;      // dc.description.tableofcontents (HTML allowed)
  license?: string;              // dc.rights.license
  entityType?: string;           // dspace.entity.type
  submissionDefinition?: string; // cris.submission.definition
  submissionDefinitionCorrection?: string; // cris.submission.definition-correction
  workspaceShared?: boolean;     // cris.workspace.shared
}

export interface CreatedCollection {
  id: string;
  uuid: string;
  name: string;
  handle: string | null;
}

export interface CollectionGroup {
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
  linkedObjectName?: string;
  linkedObjectType?: string;
  selfHref: string;
}

export interface ResourcePolicy {
  id: number;
  name: string | null;
  description: string | null;
  policyType: string | null;
  action: string;
  startDate: string | null;
  endDate: string | null;
  groupId: string | null;
  groupName: string | null;
  groupSelfHref: string | null;
}

// ── Build collection POST body ────────────────────────────────────────────────

function buildCollectionBody(payload: CollectionPayload) {
  const meta: Record<string, Array<{ language: null; value: string }>> = {};

  const add = (field: string, value?: string) => {
    const v = (value ?? "").trim();
    if (!v) return;
    meta[field] = [{ language: null, value: v }];
  };

  add("dc.title", payload.title);
  add("dc.description", payload.description);
  add("dc.description.abstract", payload.abstract);
  add("dc.rights", payload.rights);
  add("dc.description.tableofcontents", payload.tableOfContents);
  add("dc.rights.license", payload.license);
  add("dspace.entity.type", payload.entityType);
  add("cris.submission.definition", payload.submissionDefinition);
  add("cris.submission.definition-correction", payload.submissionDefinitionCorrection);
  if (payload.workspaceShared !== undefined) {
    meta["cris.workspace.shared"] = [{ language: null, value: String(payload.workspaceShared) }];
  }

  return { type: { value: "community" }, metadata: meta };
}

// ── Create collection ─────────────────────────────────────────────────────────

export async function createCollection(
  parentCommunityId: string,
  payload: CollectionPayload,
): Promise<CreatedCollection> {
  const body = buildCollectionBody(payload);
  const data = await apiFetch<any>(
    `/api/core/collections?parent=${encodeURIComponent(parentCommunityId)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );
  if (!data?.id) throw new Error("Collection creation failed — no id in response.");
  return { id: data.id, uuid: data.uuid, name: data.name, handle: data.handle ?? null };
}

// ── Built-in permission groups ────────────────────────────────────────────────

type GroupEndpoint = "adminGroup" | "submittersGroup" | "itemReadGroup" | "bitstreamReadGroup";

/**
 * Fetches one of the four built-in collection groups.
 * Returns null if none exists yet (204 / 404).
 */
export async function getCollectionGroup(
  collectionId: string,
  endpoint: GroupEndpoint,
): Promise<CollectionGroup | null> {
  try {
    const data = await apiFetch<any>(`/api/core/collections/${collectionId}/${endpoint}`);
    if (!data?.id) return null;
    return mapGroup(data);
  } catch (err: any) {
    if (err?.message?.includes("204") || err?.message?.includes("404")) return null;
    throw err;
  }
}

/**
 * Creates one of the four built-in collection groups.
 */
export async function createCollectionGroup(
  collectionId: string,
  endpoint: GroupEndpoint,
  description = "",
): Promise<CollectionGroup> {
  const body: any = { metadata: {} };
  if (description.trim()) {
    body.metadata["dc.description"] = [{ value: description.trim() }];
  }
  const data = await apiFetch<any>(`/api/core/collections/${collectionId}/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!data?.id) throw new Error(`Failed to create ${endpoint}.`);
  return mapGroup(data);
}

// ── Group subgroup management (for adding/removing groups to the 4 built-in groups) ──

export async function listGroupSubgroups(groupId: string): Promise<GroupMember[]> {
  const all: GroupMember[] = [];
  let page = 0;
  for (;;) {
    const params = new URLSearchParams({ page: String(page), size: "50", embed: "object" });
    const data = await apiFetch<any>(`/api/eperson/groups/${groupId}/subgroups?${params}`);
    const rows: any[] = data?._embedded?.subgroups ?? [];
    all.push(...rows.map(mapGroupMember));
    const totalPages: number = data?.page?.totalPages ?? 1;
    if (page >= totalPages - 1) break;
    page += 1;
  }
  return all;
}

export async function searchAddableGroupsForGroup(
  groupId: string,
  query: string,
  page = 0,
  size = 10,
): Promise<{ members: GroupMember[]; totalElements: number; totalPages: number }> {
  const params = new URLSearchParams({
    group: groupId,
    query: query.trim(),
    page: String(page),
    size: String(size),
    embed: "object",
  });
  const data = await apiFetch<any>(`/api/eperson/groups/search/isNotMemberOf?${params}`);
  const rows: any[] = data?._embedded?.groups ?? [];
  return {
    members: rows.map(mapGroupMember),
    totalElements: data?.page?.totalElements ?? 0,
    totalPages: data?.page?.totalPages ?? 1,
  };
}

export async function addSubgroupToGroup(groupId: string, subgroupHref: string): Promise<void> {
  const { getStoredJwt, ensureCsrfToken } = await import("../auth/client");
  const jwt = getStoredJwt();
  const csrf = await ensureCsrfToken();
  const API = (import.meta as any).env?.VITE_API_BASE_URL ?? "/server";
  const res = await fetch(`${API}/api/eperson/groups/${groupId}/subgroups`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "text/uri-list",
      "X-XSRF-TOKEN": csrf,
      ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
    },
    body: subgroupHref,
  });
  if (!res.ok && res.status !== 204) throw new Error(`Add subgroup failed: ${res.status}`);
}

export async function removeSubgroupFromGroup(groupId: string, subgroupId: string): Promise<void> {
  await apiFetch<void>(`/api/eperson/groups/${groupId}/subgroups/${subgroupId}`, { method: "DELETE" });
}

// ── Resource policies (TYPE_SUBMISSION only) ──────────────────────────────────

/**
 * Fetches all resource policies on a collection, returning only TYPE_SUBMISSION ones.
 */
export async function getCollectionResourcePolicies(
  collectionId: string,
): Promise<ResourcePolicy[]> {
  const params = new URLSearchParams({
    uuid: collectionId,
    embed: "eperson",
  });
  params.append("embed", "group");
  const data = await apiFetch<any>(
    `/api/authz/resourcepolicies/search/resource?${params}`,
  );
  const policies: any[] = data?._embedded?.resourcepolicies ?? [];
  return policies
    .filter((p) => p.policyType === "TYPE_SUBMISSION")
    .map(mapResourcePolicy);
}

/**
 * Creates a TYPE_SUBMISSION resource policy for a group on a collection.
 */
export async function createResourcePolicy(
  collectionId: string,
  groupId: string,
  policy: {
    name?: string;
    action: string;
    startDate?: string | null;
    endDate?: string | null;
  },
): Promise<ResourcePolicy> {
  const body = {
    name: policy.name ?? null,
    description: null,
    policyType: "TYPE_SUBMISSION",
    action: policy.action,
    startDate: policy.startDate ?? null,
    endDate: policy.endDate ?? null,
    type: { value: "resourcepolicy" },
  };
  const params = new URLSearchParams({ resource: collectionId, group: groupId });
  const data = await apiFetch<any>(`/api/authz/resourcepolicies?${params}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!data?.id) throw new Error("Resource policy creation failed.");
  return mapResourcePolicy(data);
}

/**
 * Deletes a resource policy by its numeric id.
 */
export async function deleteResourcePolicy(policyId: number): Promise<void> {
  await apiFetch<void>(`/api/authz/resourcepolicies/${policyId}`, { method: "DELETE" });
}

// ── Group search (plain, not isNotMemberOf) ───────────────────────────────────

export interface SearchableGroup {
  id: string;
  uuid: string;
  name: string;
  selfHref: string;
}

export async function searchGroups(
  query: string,
  page = 0,
  size = 10,
): Promise<{ groups: SearchableGroup[]; totalElements: number; totalPages: number }> {
  const params = new URLSearchParams({
    query: query.trim(),
    page: String(page),
    size: String(size),
  });
  const data = await apiFetch<any>(`/api/eperson/groups/search/byMetadata?${params}`);
  const rows: any[] = data?._embedded?.groups ?? [];
  return {
    groups: rows.map((g) => ({
      id: g.id,
      uuid: g.uuid,
      name: g.name ?? "",
      selfHref: g._links?.self?.href ?? "",
    })),
    totalElements: data?.page?.totalElements ?? 0,
    totalPages: data?.page?.totalPages ?? 1,
  };
}

// ── Mappers ───────────────────────────────────────────────────────────────────

function mapGroup(data: any): CollectionGroup {
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

function mapResourcePolicy(data: any): ResourcePolicy {
  const group = data._embedded?.group;
  return {
    id: data.id,
    name: data.name ?? null,
    description: data.description ?? null,
    policyType: data.policyType ?? null,
    action: data.action,
    startDate: data.startDate ?? null,
    endDate: data.endDate ?? null,
    groupId: group?.id ?? null,
    groupName: group?.name ?? null,
    groupSelfHref: group?._links?.self?.href ?? null,
  };
}
