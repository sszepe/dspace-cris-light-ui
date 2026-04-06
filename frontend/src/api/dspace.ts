/**
 * Shared DSpace REST API types and parsers.
 * Derived from the DSpace HAL+JSON response shapes and dspace-rest-python models.
 */

// ── Metadata ─────────────────────────────────────────────────────────────────

export interface MetaValue {
  value: string;
  language: string | null;
  authority: string | null;
  confidence: number;
  place: number;
}

export type Metadata = Record<string, MetaValue[]>;

/** Return the first value for a metadata field, or null. */
export function metaFirst(
  meta: Metadata | undefined,
  field: string,
): string | null {
  return meta?.[field]?.[0]?.value ?? null;
}

/** Return all string values for a metadata field. */
export function metaAll(meta: Metadata | undefined, field: string): string[] {
  return (meta?.[field] ?? []).map((v) => v.value);
}

/**
 * Return all full MetaValue objects for a metadata field.
 * Use this when you need authority, confidence, or language alongside the value.
 */
export function metaAllFull(
  meta: Metadata | undefined,
  field: string,
): MetaValue[] {
  return meta?.[field] ?? [];
}

/** Strip HTML tags from a string. */
export function stripHtml(s: string | null | undefined): string {
  if (!s) return "";
  return s.replace(/<[^>]+>/g, "").trim();
}

/**
 * Convert an absolute DSpace href like
 *   http://host:8080/server/api/core/...
 * to a relative API path like
 *   /api/core/...
 * so apiFetch doesn't double the base URL.
 */
export function hrefToPath(href: string): string {
  try {
    const url = new URL(href);
    // Strip everything up to and including "/server"
    const path = url.pathname.replace(/^\/server/, "");
    const qs = url.search;
    return path + qs;
  } catch {
    // If it's already a relative path, return as-is
    return href;
  }
}

// ── HAL link helpers ──────────────────────────────────────────────────────────

export interface HalLink {
  href: string;
}

export type HalLinks = Record<string, HalLink | HalLink[]>;

// ── Core DSO types ────────────────────────────────────────────────────────────

export interface DSpaceObject {
  id: string;
  uuid: string;
  name: string | null;
  handle: string | null;
  type: string;
  metadata: Metadata;
  lastModified?: string;
  _links: HalLinks;
  _embedded?: Record<string, any>;
}

export interface Item extends DSpaceObject {
  type: "item";
  inArchive: boolean;
  discoverable: boolean;
  withdrawn: boolean;
  entityType?: string | null;
}

export interface Community extends DSpaceObject {
  type: "community";
  _embedded?: {
    subcommunities?: { page: PageInfo };
    collections?: { page: PageInfo };
    [key: string]: any;
  };
}

export interface Collection extends DSpaceObject {
  type: "collection";
}

export interface WorkspaceItem {
  id: number;
  type: "workspaceitem";
  lastModified: string;
  _links: HalLinks;
  _embedded: {
    item: Item;
    [key: string]: any;
  };
}

// ── Pagination ────────────────────────────────────────────────────────────────

export interface PageInfo {
  size: number;
  totalElements: number;
  totalPages: number;
  number: number;
}

// ── Search / discover response ────────────────────────────────────────────────

export interface SearchResultObject {
  _embedded: {
    indexableObject: Item | WorkspaceItem | DSpaceObject;
  };
}

export interface SearchResult {
  _embedded: {
    objects: SearchResultObject[];
  };
  page: PageInfo;
}

export interface SearchResponse {
  _embedded: {
    searchResult: SearchResult;
  };
}

// ── Parsed view-model rows ────────────────────────────────────────────────────

export interface ParsedWorkspaceRow {
  /** Unique react key */
  key: string;
  /** UUID for archived items, numeric id for workspace items */
  uuid: string | null;
  workspaceId: number | null;
  name: string;
  handle: string | null;
  entityType: string | null;
  dcType: string | null;
  inArchive: boolean;
  withdrawn: boolean;
  isWorkspaceItem: boolean;
  lastModified: string | null;
}

export interface ParsedItemRow {
  uuid: string;
  name: string;
  handle: string | null;
  entityType: string | null;
  dcType: string | null;
  inArchive: boolean;
  withdrawn: boolean;
  lastModified: string | null;
  thumbnail: string | null;
}

// ── Parser: workspace search result object ────────────────────────────────────

export function parseSearchObject(
  obj: SearchResultObject,
): ParsedWorkspaceRow | null {
  const raw = obj?._embedded?.indexableObject;
  if (!raw) return null;

  if (raw.type === "workspaceitem") {
    const ws = raw as WorkspaceItem;
    const item = ws._embedded?.item;
    const meta = item?.metadata ?? {};
    return {
      key: `ws-${ws.id}`,
      uuid: item?.uuid ?? null,
      workspaceId: ws.id,
      name: item?.name ?? metaFirst(meta, "dc.title") ?? "(untitled)",
      handle: item?.handle ?? null,
      entityType: item?.entityType ?? metaFirst(meta, "dspace.entity.type"),
      dcType: metaFirst(meta, "dc.type"),
      inArchive: item?.inArchive ?? false,
      withdrawn: item?.withdrawn ?? false,
      isWorkspaceItem: true,
      lastModified: ws.lastModified ?? null,
    };
  }

  // Archived item or generic DSO
  const item = raw as Item;
  const meta = item.metadata ?? {};
  return {
    key: `item-${item.uuid ?? item.id}`,
    uuid: item.uuid ?? item.id ?? null,
    workspaceId: null,
    name: item.name ?? metaFirst(meta, "dc.title") ?? "(untitled)",
    handle: item.handle ?? null,
    entityType:
      (item as Item).entityType ?? metaFirst(meta, "dspace.entity.type"),
    dcType: metaFirst(meta, "dc.type"),
    inArchive: (item as Item).inArchive ?? true,
    withdrawn: (item as Item).withdrawn ?? false,
    isWorkspaceItem: false,
    lastModified: item.lastModified ?? null,
  };
}

// ── Parser: collection search result object ───────────────────────────────────

export function parseItemRow(obj: SearchResultObject): ParsedItemRow | null {
  const raw = obj?._embedded?.indexableObject as Item;
  if (!raw?.uuid) return null;
  const meta = raw.metadata ?? {};
  return {
    uuid: raw.uuid,
    name: raw.name ?? metaFirst(meta, "dc.title") ?? "(untitled)",
    handle: raw.handle ?? null,
    entityType: raw.entityType ?? metaFirst(meta, "dspace.entity.type"),
    dcType: metaFirst(meta, "dc.type"),
    inArchive: raw.inArchive ?? true,
    withdrawn: raw.withdrawn ?? false,
    lastModified: raw.lastModified ?? null,
    thumbnail:
      raw._embedded?.thumbnail?._links?.content?.href ??
      raw._embedded?.["thumbnail"]?.["_links"]?.["content"]?.["href"] ??
      null,
  };
}

// ── Item detail (full embedded response) ─────────────────────────────────────

export interface Bundle {
  id: string;
  name: string;
  _embedded?: {
    bitstreams?: {
      _embedded?: {
        bitstreams?: Bitstream[];
      };
      page?: PageInfo;
    };
  };
}

export interface Bitstream {
  id: string;
  uuid: string;
  name: string | null;
  description?: string | null;
  sizeBytes: number;
  checkSum?: { checkSumAlgorithm: string; value: string };
  sequenceId?: number;
  _links: HalLinks;
}

export interface Relationship {
  id: number;
  leftPlace: number;
  rightPlace: number;
  _links: HalLinks;
}

export interface ItemDetailResponse extends Item {
  _embedded: {
    owningCollection?: Collection & {
      _embedded?: {
        parentCommunity?: Community & {
          _embedded?: { parentCommunity?: Community };
        };
      };
    };
    bundles?: {
      _embedded?: { bundles?: Bundle[] };
      page?: PageInfo;
    };
    thumbnail?: { _links?: { content?: HalLink } };
    relationships?: {
      _embedded?: { relationships?: Relationship[] };
      page?: PageInfo;
    };
    metrics?: any;
    version?: any;
    [key: string]: any;
  };
}

// ── Workspace item detail (submission endpoint) ───────────────────────────────

export interface WorkspaceItemDetail {
  id: number;
  type: "workspaceitem";
  lastModified: string;
  errors?: Array<{ message: string; paths: string[] }>;
  sections?: Record<string, any>;
  _links: HalLinks;
  _embedded: {
    item: Item;
    collection?: Collection;
    submissionDefinition?: any;
    [key: string]: any;
  };
}
