/**
 * community-api.ts
 *
 * DSpace REST API helpers for Community management.
 *
 * Create endpoints:
 *   Top community:   POST /api/core/communities
 *   Subcommunity:    POST /api/core/communities?parent={parentId}
 *
 * Search for parent communities uses the editCommunity discover configuration
 * which returns all communities the current user can administrate.
 */

import { apiFetch } from "../auth/client";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface CommunityPayload {
  title: string;
  description?: string;
  abstract?: string;
  rights?: string;
  tableOfContents?: string;
}

export interface CreatedCommunity {
  id: string;
  uuid: string;
  name: string;
  handle: string | null;
}

export interface CommunityOption {
  id: string;
  label: string;
  handle: string | null;
  description?: string;
}

// ── Search communities (for parent picker) ────────────────────────────────────

/**
 * Searches all communities the current user can edit/admin.
 * Uses the editCommunity discover configuration — returns communities
 * regardless of whether they are top-level or subcommunities.
 */
export async function searchEditableCommunities(
  query: string,
): Promise<CommunityOption[]> {
  const params = new URLSearchParams({
    configuration: "editCommunity",
    dsoType: "COMMUNITY",
    sort: "dc.title,ASC",
    page: "0",
    size: "20",
  });
  if (query.trim()) params.set("query", query.trim());

  const data = await apiFetch<any>(`/api/discover/search/objects?${params}`);
  const objects: any[] =
    data?._embedded?.searchResult?._embedded?.objects ?? [];

  return objects
    .map((obj) => {
      const c = obj?._embedded?.indexableObject;
      if (!c?.id) return null;
      const title =
        c.metadata?.["dc.title"]?.[0]?.value ?? c.name ?? c.id;
      const desc =
        c.metadata?.["dc.description"]?.[0]?.value ?? undefined;
      return {
        id: c.id,
        label: title,
        handle: c.handle ?? null,
        description: desc,
      } satisfies CommunityOption;
    })
    .filter(Boolean) as CommunityOption[];
}

// ── Create community ──────────────────────────────────────────────────────────

function buildCommunityBody(payload: CommunityPayload) {
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

  return { type: { value: "community" }, metadata: meta };
}

/**
 * Creates a top-level community.
 */
export async function createTopCommunity(
  payload: CommunityPayload,
): Promise<CreatedCommunity> {
  const body = buildCommunityBody(payload);
  const data = await apiFetch<any>("/api/core/communities", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!data?.id) throw new Error("Community creation failed — no id in response.");
  return { id: data.id, uuid: data.uuid, name: data.name, handle: data.handle ?? null };
}

/**
 * Creates a subcommunity under the given parent community UUID.
 */
export async function createSubCommunity(
  parentId: string,
  payload: CommunityPayload,
): Promise<CreatedCommunity> {
  const body = buildCommunityBody(payload);
  const data = await apiFetch<any>(
    `/api/core/communities?parent=${encodeURIComponent(parentId)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );
  if (!data?.id) throw new Error("Subcommunity creation failed — no id in response.");
  return { id: data.id, uuid: data.uuid, name: data.name, handle: data.handle ?? null };
}

/**
 * Unified create — dispatches to top or sub based on parentId.
 */
export async function createCommunity(
  payload: CommunityPayload,
  parentId?: string | null,
): Promise<CreatedCommunity> {
  return parentId
    ? createSubCommunity(parentId, payload)
    : createTopCommunity(payload);
}
