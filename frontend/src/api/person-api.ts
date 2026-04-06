import { apiFetch } from "../auth/client";
import { hrefToPath } from "./dspace";

export async function fetchAuthStatus() {
  return apiFetch<any>("/api/authn/status");
}

export async function fetchEPersonByHref(href: string) {
  return apiFetch<any>(hrefToPath(href));
}

export async function fetchEPersonGroups(epersonId: string) {
  const all: any[] = [];
  let page = 0;
  for (;;) {
    const data = await apiFetch<any>(
      `/api/eperson/epersons/${epersonId}/groups?page=${page}&size=100&embed=object`,
    );
    const rows = data?._embedded?.groups ?? [];
    all.push(...rows);
    const totalPages = data?.page?.totalPages ?? 1;
    if (page >= totalPages - 1) break;
    page += 1;
  }
  return all;
}

export async function fetchAuthorizedEntityTypes() {
  const all: any[] = [];
  let page = 0;
  for (;;) {
    const data = await apiFetch<any>(
      `/api/core/entitytypes/search/findAllByAuthorizedExternalSource?page=${page}&size=100`,
    );
    const rows = data?._embedded?.entitytypes ?? [];
    all.push(...rows);
    const totalPages = data?.page?.totalPages ?? 1;
    if (page >= totalPages - 1) break;
    page += 1;
  }
  return all;
}

/**
 * Entity types the current user can create submissions for
 * (has submit permission on at least one collection of that type).
 * Used to gate creation buttons in the UI.
 */
export async function fetchAuthorizedCollectionEntityTypes() {
  const all: any[] = [];
  let page = 0;
  for (;;) {
    const data = await apiFetch<any>(
      `/api/core/entitytypes/search/findAllByAuthorizedCollection?page=${page}&size=100`,
    );
    const rows = data?._embedded?.entitytypes ?? [];
    all.push(...rows);
    const totalPages = data?.page?.totalPages ?? 1;
    if (page >= totalPages - 1) break;
    page += 1;
  }
  return all;
}
