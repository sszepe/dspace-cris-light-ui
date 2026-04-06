import { getStoredJwt } from "../auth/client";
import { ENTITY_CLUSTERS } from "../config/entity-clusters";

// ── Types ─────────────────────────────────────────────────────────────────────

export type ClusterConfig = {
  id?: number | string;
  key: string;
  label: string;
  description?: string;
  sort_order?: number;
  enabled?: boolean;
  entity_types?: Array<{
    id?: number | string;
    entity_type_label: string;
    sort_order?: number;
  }>;
};

export type ResolvedCluster = {
  key: string;
  label: string;
  description?: string;
  items: Array<{ id: number | string; label: string }>;
  count: number;
};

export type DjangoAuthDiagnostics = {
  django_reachable: boolean;
  dspace_base_url: string;
  dspace_reachable: boolean;
  dspace_status_code: number | null;
  dspace_authenticated: boolean | null;
  jwt_received: boolean;
  jwt_preview: string | null;
  auth_error: string | null;
  settings_module: string | null;
  frontend_base_url?: string;
  frontend_jwt_in_storage?: boolean;
};

// ── Runtime config resolution ─────────────────────────────────────────────────
//
// Priority chain for the Django base URL:
//   1. window.__DJANGO_CONFIG_API_BASE_URL__  (injected via index.html at runtime)
//   2. import.meta.env.VITE_DJANGO_CONFIG_API_BASE_URL  (Vite build-time .env)
//
// Add to index.html <head> before the Vite bundle:
//   <script>
//     window.__DJANGO_CONFIG_API_BASE_URL__ = "http://localhost:5189/api/dspace-config";
//     window.__CLUSTER_CONFIG_SOURCE__ = "django";
//   </script>

declare global {
  interface Window {
    __DJANGO_CONFIG_API_BASE_URL__?: string;
    __CLUSTER_CONFIG_SOURCE__?: string;
  }
}

function djangoBase(): string {
  const url =
    window.__DJANGO_CONFIG_API_BASE_URL__ ||
    import.meta.env.VITE_DJANGO_CONFIG_API_BASE_URL ||
    "";
  return url.replace(/\/$/, "");
}

export function getClusterConfigSource(): "ts" | "django" {
  const src =
    window.__CLUSTER_CONFIG_SOURCE__ ||
    import.meta.env.VITE_CLUSTER_CONFIG_SOURCE ||
    "ts";
  return src === "django" ? "django" : "ts";
}

function fallbackEnabled(): boolean {
  return String(import.meta.env.VITE_CLUSTER_CONFIG_FALLBACK ?? "true").toLowerCase() !== "false";
}

// ── Debug probe ───────────────────────────────────────────────────────────────

export async function probeDjangoAuth(): Promise<DjangoAuthDiagnostics | null> {
  const base = djangoBase();
  const jwt = getStoredJwt();
  const headers: Record<string, string> = { Accept: "application/json" };
  if (jwt) headers["Authorization"] = `Bearer ${jwt}`;
  try {
    const res = await fetch(`${base}/debug/auth/`, { headers, credentials: "include" });
    if (!res.ok) {
      console.warn(`[django-debug] /debug/auth/ -> HTTP ${res.status}`);
      return null;
    }
    const data: DjangoAuthDiagnostics = await res.json();
    data.frontend_base_url = base || "(empty)";
    data.frontend_jwt_in_storage = Boolean(jwt);
    return data;
  } catch (err) {
    console.warn("[django-debug] /debug/auth/ unreachable:", err);
    return null;
  }
}

function logDiagnostics(diag: DjangoAuthDiagnostics | null, apiError?: unknown) {
  console.group("[DSpace Config API - diagnostics]");
  if (!diag) {
    console.warn("  /debug/auth/ unreachable");
    console.warn("  Django base URL:", djangoBase() || "(empty - URL not configured)");
    console.warn("  window.__DJANGO_CONFIG_API_BASE_URL__:", window.__DJANGO_CONFIG_API_BASE_URL__ ?? "(not set)");
    console.warn("  VITE_DJANGO_CONFIG_API_BASE_URL:", import.meta.env.VITE_DJANGO_CONFIG_API_BASE_URL ?? "(not set)");
  } else {
    console.log("  Frontend base URL    :", diag.frontend_base_url);
    console.log("  Django reachable     :", diag.django_reachable ? "yes" : "NO");
    console.log("  DSPACE_BASE_URL      :", diag.dspace_base_url);
    console.log("  DSpace reachable     :", diag.dspace_reachable ? "yes" : "NO", "(status", diag.dspace_status_code ?? "-", ")");
    console.log("  DSpace authenticated :", diag.dspace_authenticated ?? "-");
    console.log("  JWT in sessionStorage:", diag.frontend_jwt_in_storage ? "yes" : "NO");
    console.log("  JWT received/Django  :", diag.jwt_received ? "yes " + diag.jwt_preview : "NO - Authorization header missing");
    if (diag.auth_error) console.error("  Auth error           :", diag.auth_error);
    console.log("  Settings module      :", diag.settings_module ?? "-");
  }
  if (apiError) console.error("  API call error:", apiError);
  console.groupEnd();
}

// ── Django API helpers ────────────────────────────────────────────────────────

async function djangoFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers || {});
  headers.set("Accept", "application/json");
  const jwt = getStoredJwt();
  if (jwt && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${jwt}`);
  }
  if (!headers.has("Content-Type") && init.body != null) {
    headers.set("Content-Type", "application/json");
  }
  const url = `${djangoBase()}${path}`;
  const res = await fetch(url, { ...init, headers, credentials: "include" });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Django config API error ${res.status} [${url}]${text ? `: ${text}` : ""}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

// ── Static fallback ───────────────────────────────────────────────────────────

function staticClusters(): ClusterConfig[] {
  return ENTITY_CLUSTERS.map((c, i) => ({
    ...c,
    sort_order: i + 1,
    enabled: true,
    entity_types: c.entityTypes.map((t, j) => ({
      entity_type_label: t,
      sort_order: j + 1,
    })),
  }));
}

// ── loadClusterConfig ─────────────────────────────────────────────────────────

export async function loadClusterConfig(): Promise<{
  source: "ts" | "django";
  clusters: ClusterConfig[];
  diagnostics?: DjangoAuthDiagnostics | null;
}> {
  if (getClusterConfigSource() !== "django") {
    return { source: "ts", clusters: staticClusters() };
  }

  const [apiResult, diagResult] = await Promise.allSettled([
    djangoFetch<any>("/dashboard-config/"),
    probeDjangoAuth(),
  ]);

  const diagValue = diagResult.status === "fulfilled" ? diagResult.value : null;

  if (apiResult.status === "fulfilled") {
    const data = apiResult.value;
    const raw = Array.isArray(data) ? data : Array.isArray(data?.clusters) ? data.clusters : null;
    if (raw) {
      console.log("[DSpace Config API] Django cluster config loaded successfully.");
      return { source: "django", clusters: raw, diagnostics: diagValue };
    }
    const err = new Error("Unexpected dashboard-config payload shape");
    logDiagnostics(diagValue, err);
    if (!fallbackEnabled()) throw err;
    return { source: "ts", clusters: staticClusters(), diagnostics: diagValue };
  }

  logDiagnostics(diagValue, apiResult.reason);
  if (!fallbackEnabled()) throw apiResult.reason;
  console.warn("[DSpace Config API] Falling back to TypeScript static config.");
  return { source: "ts", clusters: staticClusters(), diagnostics: diagValue };
}

// ── resolveClusters ───────────────────────────────────────────────────────────

export function resolveClusters(
  entityTypes: Array<{ id: number | string; label: string }>,
  configs: ClusterConfig[],
): ResolvedCluster[] {
  const byLabel = new Map(entityTypes.map((e) => [e.label, e]));
  const resolved: ResolvedCluster[] = [];

  for (const cluster of [...configs]
    .filter((c) => c.enabled !== false)
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))) {
    const refs = (cluster.entity_types ?? [])
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      .map((e) => byLabel.get(e.entity_type_label))
      .filter(Boolean) as Array<{ id: number | string; label: string }>;
    if (refs.length) {
      resolved.push({
        key: cluster.key,
        label: cluster.label,
        description: cluster.description,
        items: refs,
        count: refs.length,
      });
    }
  }

  const assigned = new Set(resolved.flatMap((c) => c.items.map((i) => i.label)));
  const unclustered = entityTypes.filter((e) => !assigned.has(e.label));
  if (unclustered.length) {
    resolved.push({
      key: "other",
      label: "Other",
      description: "Authorized entity types not yet assigned to a cluster",
      items: unclustered,
      count: unclustered.length,
    });
  }
  return resolved;
}

// ── Django CRUD API ───────────────────────────────────────────────────────────

export async function listDjangoClusters() {
  return djangoFetch<ClusterConfig[]>("/clusters/");
}
export async function createDjangoCluster(
  payload: Pick<ClusterConfig, "key" | "label" | "description" | "sort_order" | "enabled">,
) {
  return djangoFetch<ClusterConfig>("/clusters/", { method: "POST", body: JSON.stringify(payload) });
}
export async function updateDjangoCluster(id: number | string, payload: Partial<ClusterConfig>) {
  return djangoFetch<ClusterConfig>(`/clusters/${id}/`, { method: "PATCH", body: JSON.stringify(payload) });
}
export async function deleteDjangoCluster(id: number | string) {
  return djangoFetch<void>(`/clusters/${id}/`, { method: "DELETE" });
}
export async function addDjangoClusterEntityType(
  clusterId: number | string,
  entityTypeLabel: string,
  sort_order?: number,
) {
  return djangoFetch(`/clusters/${clusterId}/entity-types/`, {
    method: "POST",
    body: JSON.stringify({ entity_type_label: entityTypeLabel, sort_order }),
  });
}
export async function updateDjangoClusterEntityType(
  id: number | string,
  payload: { entity_type_label?: string; sort_order?: number },
) {
  return djangoFetch(`/entity-types/${id}/`, { method: "PATCH", body: JSON.stringify(payload) });
}
export async function deleteDjangoClusterEntityType(id: number | string) {
  return djangoFetch<void>(`/entity-types/${id}/`, { method: "DELETE" });
}
