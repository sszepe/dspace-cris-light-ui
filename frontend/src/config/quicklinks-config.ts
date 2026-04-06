import { djangoGet, djangoPost, djangoPatch, djangoDelete } from "../api/django-client";

// ── Types ─────────────────────────────────────────────────────────────────────

export type QuickFilterConfig = {
  key: string;
  label: string;
  facetName: string;
  kind?: "text" | "date";
  placeholder?: string;
};

export type QuickPreset = {
  key: string;
  label: string;
  description?: string;
  /** Always-applied filters merged in before user selections. */
  baseFilters: Record<string, string[]>;
  /** Dynamic facet filters the user can interact with. */
  filters: QuickFilterConfig[];
  sort_order?: number;
  enabled?: boolean;
};

// ── Static presets (TypeScript source) ───────────────────────────────────────

export const QUICKLINKS_CRIS_PRESETS: QuickPreset[] = [
  // Standard entity types shipped with a default DSpace CRIS installation.
  // Place, ConceptScheme, Concept, ArchivalResource are institution-specific
  // extensions and are NOT included here.
  {
    key: "publication",
    label: "Publication",
    description: "Publications filtered by type, year and author.",
    baseFilters: { entityType: ["Publication"] },
    filters: [
      { key: "dc.type",               label: "Type",   facetName: "dc.type" },
      { key: "dc.date.issued",        label: "Year",   facetName: "dc.date.issued",        kind: "date" as const },
      { key: "dc.contributor.author", label: "Author", facetName: "dc.contributor.author" },
    ],
    sort_order: 1,
    enabled: true,
  },
  {
    key: "project",
    label: "Project",
    description: "Projects filtered by investigator, coordinator, status, and dates.",
    baseFilters: { entityType: ["Project"] },
    filters: [
      { key: "crispj.investigator",        label: "Investigator",  facetName: "crispj.investigator" },
      { key: "crispj.coordinator",         label: "Coordinator",   facetName: "crispj.coordinator" },
      { key: "oairecerif.project.status",  label: "Status",        facetName: "oairecerif.project.status" },
      { key: "oairecerif.project.startDate", label: "Start date",  facetName: "oairecerif.project.startDate", kind: "date" as const },
      { key: "oairecerif.project.endDate",   label: "End date",    facetName: "oairecerif.project.endDate",   kind: "date" as const },
    ],
    sort_order: 2,
    enabled: true,
  },
  {
    key: "funding",
    label: "Funding",
    description: "Funding items filtered by type and funder.",
    baseFilters: { entityType: ["Funding"] },
    filters: [
      { key: "itemtype",         label: "Type",   facetName: "itemtype" },
      { key: "oairecerif.funder", label: "Funder", facetName: "oairecerif.funder" },
    ],
    sort_order: 3,
    enabled: true,
  },
  {
    key: "person",
    label: "Person",
    description: "Person entities filtered by affiliation.",
    baseFilters: { entityType: ["Person"] },
    filters: [
      { key: "person.affiliation.name", label: "Affiliation", facetName: "person.affiliation.name" },
    ],
    sort_order: 4,
    enabled: true,
  },
  {
    key: "orgunit",
    label: "OrgUnit",
    description: "Organisational units filtered by type and country.",
    baseFilters: { entityType: ["OrgUnit"] },
    filters: [
      { key: "dc.type",                              label: "Type",    facetName: "dc.type" },
      { key: "organization.address.addressCountry",  label: "Country", facetName: "organization.address.addressCountry" },
    ],
    sort_order: 5,
    enabled: true,
  },
  {
    key: "equipment",
    label: "Equipment",
    description: "Equipment entities filtered by type.",
    baseFilters: { entityType: ["Equipment"] },
    filters: [
      { key: "itemtype", label: "Type", facetName: "itemtype" },
    ],
    sort_order: 6,
    enabled: true,
  },
  {
    key: "event",
    label: "Event",
    description: "Events filtered by type and dates.",
    baseFilters: { entityType: ["Event"] },
    filters: [
      { key: "itemtype",                     label: "Type",       facetName: "itemtype" },
      { key: "oairecerif.event.startDate",   label: "Start date", facetName: "oairecerif.event.startDate", kind: "date" as const },
      { key: "oairecerif.event.endDate",     label: "End date",   facetName: "oairecerif.event.endDate",   kind: "date" as const },
    ],
    sort_order: 7,
    enabled: true,
  },
  {
    key: "product",
    label: "Product",
    description: "Product (dataset) entities.",
    baseFilters: { entityType: ["Product"] },
    filters: [
      { key: "dc.type",               label: "Type",   facetName: "dc.type" },
      { key: "dc.contributor.author", label: "Author", facetName: "dc.contributor.author" },
    ],
    sort_order: 8,
    enabled: true,
  },
  {
    key: "patent",
    label: "Patent",
    description: "Patent entities.",
    baseFilters: { entityType: ["Patent"] },
    filters: [
      { key: "dc.contributor.author", label: "Inventor", facetName: "dc.contributor.author" },
    ],
    sort_order: 9,
    enabled: true,
  },
  {
    key: "journal",
    label: "Journal",
    description: "Journal entities.",
    baseFilters: { entityType: ["Journal"] },
    filters: [
      { key: "dc.publisher", label: "Publisher", facetName: "dc.publisher" },
    ],
    sort_order: 10,
    enabled: true,
  },
];

// ── Env flags ─────────────────────────────────────────────────────────────────
//
// Two build-time .env flags control the feature. In ts mode (no Django) these
// are the only knobs — edit .env and redeploy to change behaviour.
//
//   VITE_QUICKLINKS_ENABLED      Master on/off for the feature.
//                                false (default) → tab hidden for everyone.
//                                true            → feature active; audience
//                                                  set by the flag below.
//
//   VITE_QUICKLINKS_ADMIN_ONLY   Audience gate when the feature is enabled.
//                                true  (default) → tab shown to admins only.
//                                false           → tab shown to all users.
//
// When VITE_QUICKLINKS_CONFIG_SOURCE=django these same env flags act as the
// outer build-time gate, but admins additionally get a live toggle in the
// Admin Settings page.  That toggle is stored in the Django DB and takes
// effect immediately without a redeploy.  It has no effect in ts mode.

/** Master feature switch. Default: false. */
export function isQuicklinksEnabled(): boolean {
  return String(import.meta.env.VITE_QUICKLINKS_ENABLED ?? "false").toLowerCase() === "true";
}

/** Audience gate. Default: true (admin-only). */
export function isQuicklinksAdminOnly(): boolean {
  return String(import.meta.env.VITE_QUICKLINKS_ADMIN_ONLY ?? "true").toLowerCase() !== "false";
}

// ── Config source ─────────────────────────────────────────────────────────────

/**
 * VITE_QUICKLINKS_CONFIG_SOURCE
 * "ts"     (default) — static presets above; all config via .env only.
 * "django" — presets and runtime enabled-toggle stored in Django.
 */
export function getQuicklinksConfigSource(): "ts" | "django" {
  return import.meta.env.VITE_QUICKLINKS_CONFIG_SOURCE === "django" ? "django" : "ts";
}

// ── Site settings (django mode only) ─────────────────────────────────────────
//
// These functions are only called when VITE_QUICKLINKS_CONFIG_SOURCE=django.
// In ts mode the SiteSettings concept does not exist — use .env flags instead.

export type SiteSettings = {
  quicklinks_enabled: boolean;
  communities_creation_enabled: boolean;
  communities_role_management_enabled: boolean;
  collections_creation_enabled: boolean;
  updated_at?: string;
};

/** Fetch runtime site settings from Django. */
export async function fetchSiteSettings(): Promise<SiteSettings> {
  return djangoGet<SiteSettings>("/site-settings/");
}

/** Persist a runtime settings change to Django (admin only). */
export async function patchSiteSettings(patch: Partial<SiteSettings>): Promise<SiteSettings> {
  return djangoPatch<SiteSettings>("/site-settings/", patch);
}

// ── QuickPreset CRUD (django mode only) ───────────────────────────────────────

export type QuickPresetFilter = {
  id?: number;
  key: string;
  label: string;
  facet_name: string;
  kind?: "text" | "date";
  placeholder?: string;
  sort_order?: number;
};

export type QuickPresetRecord = {
  id?: number;
  key: string;
  label: string;
  description?: string;
  base_filters: Record<string, string[]>;
  sort_order?: number;
  enabled?: boolean;
  filters?: QuickPresetFilter[];
  created_at?: string;
  updated_at?: string;
};

export async function listDjangoPresets(): Promise<QuickPresetRecord[]> {
  return djangoGet<QuickPresetRecord[]>("/quickpresets/");
}

export async function createDjangoPreset(
  payload: Pick<QuickPresetRecord, "key" | "label" | "description" | "base_filters" | "sort_order" | "enabled">,
): Promise<QuickPresetRecord> {
  return djangoPost<QuickPresetRecord>("/quickpresets/", payload);
}

export async function updateDjangoPreset(
  id: number,
  payload: Partial<QuickPresetRecord>,
): Promise<QuickPresetRecord> {
  return djangoPatch<QuickPresetRecord>(`/quickpresets/${id}/`, payload);
}

export async function deleteDjangoPreset(id: number): Promise<void> {
  return djangoDelete(`/quickpresets/${id}/`);
}

export async function addDjangoPresetFilter(
  presetId: number,
  filter: Omit<QuickPresetFilter, "id">,
): Promise<QuickPresetFilter> {
  return djangoPost<QuickPresetFilter>(`/quickpresets/${presetId}/filters/`, filter);
}

export async function updateDjangoPresetFilter(
  id: number,
  payload: Partial<QuickPresetFilter>,
): Promise<QuickPresetFilter> {
  return djangoPatch<QuickPresetFilter>(`/quickpreset-filters/${id}/`, payload);
}

export async function deleteDjangoPresetFilter(id: number): Promise<void> {
  return djangoDelete(`/quickpreset-filters/${id}/`);
}


// ── loadQuicklinksConfig ──────────────────────────────────────────────────────

export async function loadQuicklinksConfig(): Promise<{
  source: "ts" | "django";
  presets: QuickPreset[];
}> {
  if (getQuicklinksConfigSource() !== "django") {
    return { source: "ts", presets: QUICKLINKS_CRIS_PRESETS };
  }

  const fallback = String(import.meta.env.VITE_QUICKLINKS_CONFIG_FALLBACK ?? "true").toLowerCase() !== "false";

  try {
    const data = await djangoGet<any>("/quicklinks/");
    const raw: any[] = Array.isArray(data)
      ? data
      : Array.isArray(data?.presets)
        ? data.presets
        : null;

    if (!raw) throw new Error("Unexpected quicklinks payload shape");

    const presets: QuickPreset[] = raw
      .filter((p) => p.enabled !== false)
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      .map((p) => ({
        key: p.key,
        label: p.label,
        description: p.description,
        baseFilters: p.base_filters ?? p.baseFilters ?? {},
        filters: (p.filters ?? []).map((f: any) => ({
          key: f.key,
          label: f.label,
          facetName: f.facet_name ?? f.facetName,
          kind: f.kind,
          placeholder: f.placeholder,
        })),
        sort_order: p.sort_order,
        enabled: p.enabled,
      }));

    return { source: "django", presets };
  } catch (err) {
    if (!fallback) throw err;
    console.warn("[quicklinks] Django fetch failed, using TS fallback:", err);
    return { source: "ts", presets: QUICKLINKS_CRIS_PRESETS };
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

export function getQuickPreset(
  key: string | undefined | null,
  presets: QuickPreset[] = QUICKLINKS_CRIS_PRESETS,
): QuickPreset {
  return presets.find((p) => p.key === key) ?? presets[0];
}
