import React from "react";
import { apiFetch } from "../auth/client";
import type { ParsedItemRow, SearchResponse } from "../api/dspace";
import { parseItemRow } from "../api/dspace";
import {
  loadQuicklinksConfig,
  getQuickPreset,
  type QuickPreset,
} from "../config/quicklinks-config";
import { routes } from "../navigation/hash";
import { useAuth } from "../auth/AuthContext";
import EquipmentCreationModal from "../components/equipment-creation-modal";
import FundingCreationModal from "../components/funding-creation-modal";
import FundingProgrammeModal from "../components/funding-programme-modal";
import { PlaceCreateOrImportButtons } from "../components/place-import-flow";
import ConceptSchemeModal from "../components/concept-scheme-modal";
import ConceptModal from "../components/concept-modal";
import ArchivalResourceModal from "../components/archival-resource-modal";
import OrgUnitCreationModal from "../components/orgunit-creation-modal";
import {
  ArchivalResourceTreePanel,
  ConceptSchemeTreePanel,
} from "../components/quicklinks-tree-panels";
import "../styles/quicklinks.css";

const PAGE_SIZE = 12;

// ── Types ─────────────────────────────────────────────────────────────────────

type FacetValue = {
  label: string;
  count: number;
  authorityKey: string | null;
};

type FacetData = {
  values: FacetValue[];
  hasMore: boolean;
};

type Props = {
  initialPreset?: string | null;
  onOpenItem: (uuid: string) => void;
  onOpenWorkspaceItem?: (wsId: number) => void;
};

// ── API ───────────────────────────────────────────────────────────────────────

// ── Filter serialisation ──────────────────────────────────────────────────────
//
// DSpace filter operators and grouping:
//
//   Different facets → separate f.X params, AND'd automatically:
//     f.entityType=Funding,equals & f.dc.type=Software,equals
//
//   Multiple values for the SAME facet → OR within that facet.
//   DSpace requires the param key to be wrapped in parentheses:
//     (f.itemtype)=Grant,OR & (f.itemtype)=Scholarship,OR
//
//   Single value for a facet → plain f.X=value,equals (no grouping needed).

// Build the filter query string segments.
// Single-value facets:  f.facetName=value,equals        (safe for URLSearchParams)
// Multi-value facets:   ((f.facetName)=v1,equals&(f.facetName)=v2,equals)
//   The outer parens wrapping the whole group must survive percent-encoding, so
//   we build those segments as raw strings and append them manually.
function buildFilterSegments(
  filters: Record<string, string[]>,
  excludeFacet?: string,
): { params: URLSearchParams; rawSegments: string[] } {
  const params = new URLSearchParams();
  const rawSegments: string[] = [];

  for (const [facetName, values] of Object.entries(filters)) {
    if (facetName === excludeFacet) continue;
    if (!values.length) continue;

    if (values.length === 1) {
      params.append(`f.${facetName}`, `${values[0]},equals`);
    } else {
      // Build: ((f.facetName)=v1,equals&(f.facetName)=v2,equals)
      const inner = values
        .map(
          (val) =>
            `(f.${encodeURIComponent(facetName)})=${encodeURIComponent(val)},equals`,
        )
        .join("&");
      rawSegments.push(`(${inner})`);
    }
  }

  return { params, rawSegments };
}

function buildQueryString(
  base: URLSearchParams,
  filters: Record<string, string[]>,
  excludeFacet?: string,
): string {
  const { params: filterParams, rawSegments } = buildFilterSegments(filters, excludeFacet);
  const parts: string[] = [];
  if (base.toString()) parts.push(base.toString());
  if (filterParams.toString()) parts.push(filterParams.toString());
  parts.push(...rawSegments);
  return parts.join("&");
}

async function fetchSearchResults(
  query: string,
  page: number,
  filters: Record<string, string[]>,
): Promise<{ rows: ParsedItemRow[]; totalElements: number; totalPages: number }> {
  const base = new URLSearchParams({
    sort: "score,DESC",
    page: String(page),
    size: String(PAGE_SIZE),
    projection: "preventMetadataSecurity",
  });

  if (query.trim()) base.set("query", query.trim());
  base.append("embed", "thumbnail");

  const qs = buildQueryString(base, filters);

  const data = await apiFetch<SearchResponse>(
    `/api/discover/search/objects?${qs}`,
  );
  const sr = data?._embedded?.searchResult;
  const objects = sr?._embedded?.objects ?? [];
  const pageInfo = sr?.page;

  return {
    rows: objects.map(parseItemRow).filter(Boolean) as ParsedItemRow[],
    totalElements: pageInfo?.totalElements ?? 0,
    totalPages: pageInfo?.totalPages ?? 0,
  };
}

async function fetchFacet(
  facetName: string,
  query: string,
  filters: Record<string, string[]>,
  size = 12,
): Promise<FacetData> {
  const base = new URLSearchParams({
    query: query || "*",
    size: String(size),
  });

  // Exclude the facet being loaded so its own counts aren't constrained.
  const qs = buildQueryString(base, filters, facetName);

  const data = await apiFetch<any>(
    `/api/discover/facets/${facetName}?${qs}`,
  );
  const rawValues: any[] = data?._embedded?.values ?? [];

  return {
    values: rawValues.map((v) => ({
      label: v.label,
      count: v.count,
      authorityKey: v.authorityKey ?? null,
    })),
    hasMore: !!data?._links?.next,
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function mergeFilters(
  base: Record<string, string[]>,
  active: Record<string, string[]>,
): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const [k, v] of Object.entries(base)) out[k] = [...v];
  for (const [k, v] of Object.entries(active)) {
    out[k] = Array.from(new Set([...(out[k] ?? []), ...v]));
  }
  return out;
}

function fmtDate(s?: string | null): string {
  if (!s) return "—";
  const d = new Date(s);
  return isNaN(d.getTime()) ? s : d.toLocaleDateString();
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ResultCard({
  row,
  onOpen,
  onEdit,
}: {
  row: ParsedItemRow;
  onOpen: (uuid: string) => void;
  onEdit?: (row: ParsedItemRow) => void;
}) {
  return (
    <div className="ql-result-card" onClick={() => onOpen(row.uuid)}>
      {row.thumbnail ? (
        <img className="ql-result-thumb" src={row.thumbnail} alt="" />
      ) : (
        <div className="ql-result-thumb-placeholder">▤</div>
      )}
      <div className="ql-result-body">
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
          <div className="ql-result-name">{row.name}</div>
          {onEdit && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onEdit(row); }}
              style={{
                flexShrink: 0, padding: "2px 8px", borderRadius: 6,
                border: "1px solid #d1d5db", background: "#f9fafb",
                cursor: "pointer", fontSize: 11, color: "#555",
              }}
            >
              ✎ Edit
            </button>
          )}
        </div>
        <div className="ql-result-meta">
          {row.entityType && (
            <span className="ql-result-entity-badge">{row.entityType}</span>
          )}
          {row.dcType && <span>{row.dcType}</span>}
          <span>{fmtDate(row.lastModified)}</span>
        </div>
      </div>
    </div>
  );
}

function FacetBox({
  title,
  facetName,
  query,
  filters,
  selected,
  onToggle,
}: {
  title: string;
  facetName: string;
  query: string;
  filters: Record<string, string[]>;
  selected: string[];
  onToggle: (facetName: string, value: string) => void;
}) {
  const [state, setState] = React.useState<FacetData | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Stable key for filters to avoid re-fetching on object identity changes
  const filtersKey = JSON.stringify(filters);

  React.useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    fetchFacet(facetName, query, JSON.parse(filtersKey))
      .then((data) => {
        if (alive) setState(data);
      })
      .catch((e: any) => {
        if (alive) setError(e?.message ?? String(e));
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [facetName, query, filtersKey]);

  return (
    <div className="ql-facet-box">
      <div className="ql-facet-title">{title}</div>
      {loading && <div className="ql-facet-status">Loading…</div>}
      {error && <div className="ql-facet-error">{error}</div>}
      {!loading && !error && !state?.values.length && (
        <div className="ql-facet-status">No values found</div>
      )}
      <div className="ql-facet-list">
        {state?.values.map((v) => {
          const checked = selected.includes(v.label);
          return (
            <label key={v.label} className="ql-facet-label">
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggle(facetName, v.label)}
              />
              <span className="ql-facet-label-text">{v.label}</span>
              <span className="ql-facet-count">{v.count.toLocaleString()}</span>
            </label>
          );
        })}
      </div>
      {state?.hasMore && (
        <div className="ql-facet-more">More values available via Discover search</div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function QuicklinksPage({
  initialPreset,
  onOpenItem,
  onOpenWorkspaceItem,
}: Props) {
  const { canCreate } = useAuth();
  // ── Config loading (TS or Django) ───────────────────────────────────────────
  const [presets, setPresets] = React.useState<QuickPreset[]>([]);
  const [configSource, setConfigSource] = React.useState<"ts" | "django">("ts");
  const [configLoading, setConfigLoading] = React.useState(true);
  const [configError, setConfigError] = React.useState<string | null>(null);

  React.useEffect(() => {
    loadQuicklinksConfig()
      .then(({ source, presets: loaded }) => {
        setConfigSource(source);
        setPresets(loaded);
        setConfigError(null);
      })
      .catch((e: any) => setConfigError(e?.message ?? "Failed to load presets"))
      .finally(() => setConfigLoading(false));
  }, []);

  // ── Preset selection ────────────────────────────────────────────────────────
  const [presetKey, setPresetKey] = React.useState<string>(
    initialPreset ?? "",
  );

  // Once presets are loaded, ensure presetKey is valid
  React.useEffect(() => {
    if (!presets.length) return;
    const valid = presets.find((p) => p.key === presetKey);
    if (!valid) setPresetKey(presets[0].key);
  }, [presets, presetKey]);

  const preset: QuickPreset | null = React.useMemo(
    () => (presets.length ? getQuickPreset(presetKey, presets) : null),
    [presets, presetKey],
  );

  // ── Search state ────────────────────────────────────────────────────────────
  const [query, setQuery] = React.useState("");
  const [submittedQuery, setSubmittedQuery] = React.useState("");
  const [filters, setFilters] = React.useState<Record<string, string[]>>({});
  const [rows, setRows] = React.useState<ParsedItemRow[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(0);
  const [totalElements, setTotalElements] = React.useState(0);

  // Reset search when preset changes
  React.useEffect(() => {
    setFilters({});
    setQuery("");
    setSubmittedQuery("");
    setPage(0);
    setRows([]);
    setTotalPages(0);
    setTotalElements(0);
  }, [presetKey]);

  const effectiveFilters = React.useMemo(
    () => (preset ? mergeFilters(preset.baseFilters, filters) : {}),
    [preset, filters],
  );

  // Stable serialisation for effect dep
  const effectiveFiltersKey = JSON.stringify(effectiveFilters);

  React.useEffect(() => {
    if (!preset) return;
    let alive = true;
    setLoading(true);
    setError(null);
    fetchSearchResults(submittedQuery, page, JSON.parse(effectiveFiltersKey))
      .then((res) => {
        if (!alive) return;
        setRows(res.rows);
        setTotalPages(res.totalPages);
        setTotalElements(res.totalElements);
      })
      .catch((e: any) => {
        if (alive) setError(e?.message ?? String(e));
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [submittedQuery, page, effectiveFiltersKey, preset?.key]);

  // ── Interactions ────────────────────────────────────────────────────────────
  const toggleFilter = React.useCallback(
    (facetName: string, value: string) => {
      setPage(0);
      setFilters((prev) => {
        const current = prev[facetName] ?? [];
        const next = current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value];
        const out = { ...prev };
        if (next.length) out[facetName] = next;
        else delete out[facetName];
        return out;
      });
    },
    [],
  );

  const clearUserFilters = React.useCallback(() => {
    setPage(0);
    setFilters({});
  }, []);

  const submitSearch = React.useCallback(() => {
    setPage(0);
    setSubmittedQuery(query.trim());
  }, [query]);

  const activeUserFilters = Object.entries(filters).flatMap(([facet, values]) =>
    values.map((value) => ({ facet, value })),
  );

  // ── View mode (list / tree) — only relevant for archival-resource + concept-scheme presets
  const [viewMode, setViewMode] = React.useState<"list" | "tree">("list");

  // Reset to list whenever the preset changes
  React.useEffect(() => { setViewMode("list"); }, [presetKey]);

  // Determine whether this preset supports a tree view
  const supportsTree =
    preset?.baseFilters.entityType?.includes("ArchivalResource") ||
    preset?.baseFilters.entityType?.includes("ConceptScheme");

  // ── Modal state ─────────────────────────────────────────────────────────────
  const [equipmentModalOpen, setEquipmentModalOpen] = React.useState(false);
  const [fundingModalOpen, setFundingModalOpen] = React.useState(false);
  const [fundingProgrammeModalOpen, setFundingProgrammeModalOpen] = React.useState(false);
  const [conceptSchemeModalOpen, setConceptSchemeModalOpen] = React.useState(false);
  const [conceptModalOpen, setConceptModalOpen] = React.useState(false);
  const [archivalResourceModalOpen, setArchivalResourceModalOpen] = React.useState(false);
  const [orgUnitModalOpen, setOrgUnitModalOpen] = React.useState(false);

  const [editTarget, setEditTarget] = React.useState<ParsedItemRow | null>(null);

  const handleCreated = React.useCallback(
    (wsId: number) => {
      if (onOpenWorkspaceItem) onOpenWorkspaceItem(wsId);
      else window.location.hash = routes.workspaceitem(wsId);
    },
    [onOpenWorkspaceItem],
  );

  // Called when ✎ Edit is clicked on a result card
  const handleEditRow = React.useCallback(
    (row: ParsedItemRow) => {
      const et = row.entityType?.toLowerCase();
      if (et === "archivalresource") {
        setEditTarget(row);
        setArchivalResourceModalOpen(true);
      } else if (et === "conceptscheme") {
        setEditTarget(row);
        setConceptSchemeModalOpen(true);
      } else if (et === "concept") {
        setEditTarget(row);
        setConceptModalOpen(true);
      } else {
        // Fallback: navigate to item detail
        onOpenItem(row.uuid);
      }
    },
    [onOpenItem],
  );

  // Which creation buttons to show depends on the active preset AND the user's
  // submit permissions (canCreate checks collectionEntityTypes from AuthContext).
  const createButtons = React.useMemo(() => {
    if (!preset) return null;
    const btns: React.ReactNode[] = [];

    if (
      preset.baseFilters.entityType?.includes("Equipment") &&
      canCreate("Equipment")
    ) {
      btns.push(
        <button key="create-equipment" className="ql-create-btn ql-create-btn--blue" onClick={() => setEquipmentModalOpen(true)}>+ Create equipment</button>,
      );
    }

    if (
      preset.baseFilters.entityType?.includes("Funding") &&
      preset.baseFilters.itemtype?.some((t) =>
        ["Grant", "Scholarship"].includes(t),
      ) &&
      canCreate("Funding")
    ) {
      btns.push(
        <button key="create-funding" className="ql-create-btn ql-create-btn--violet" onClick={() => setFundingModalOpen(true)}>+ Create funding</button>,
      );
    }

    if (
      preset.baseFilters.entityType?.includes("Funding") &&
      preset.baseFilters.itemtype?.some((t) =>
        ["Programme", "Call", "Ongoing Call"].includes(t),
      ) &&
      canCreate("Funding")
    ) {
      btns.push(
        <button key="create-programme" className="ql-create-btn ql-create-btn--cyan" onClick={() => setFundingProgrammeModalOpen(true)}>+ Create programme / call</button>,
      );
    }

    if (
      preset.baseFilters.entityType?.includes("ConceptScheme") &&
      canCreate("ConceptScheme")
    ) {
      btns.push(
        <button key="create-concept-scheme" className="ql-create-btn ql-create-btn--teal" onClick={() => setConceptSchemeModalOpen(true)}>
          + Create concept scheme
        </button>,
      );
    }

    if (
      preset.baseFilters.entityType?.includes("Concept") &&
      canCreate("Concept")
    ) {
      btns.push(
        <button key="create-concept" className="ql-create-btn ql-create-btn--teal" onClick={() => setConceptModalOpen(true)}>
          + Create concept
        </button>,
      );
    }

    if (
      preset.baseFilters.entityType?.includes("OrgUnit") &&
      canCreate("OrgUnit")
    ) {
      btns.push(
        <button
          key="create-orgunit"
          className="ql-create-btn ql-create-btn--indigo"
          onClick={() => setOrgUnitModalOpen(true)}
        >
          + New org unit
        </button>,
      );
    }

    if (
      preset.baseFilters.entityType?.includes("ArchivalResource") &&
      canCreate("ArchivalResource")
    ) {
      btns.push(
        <button
          key="create-archival"
          className="ql-create-btn ql-create-btn--amber"
          onClick={() => setArchivalResourceModalOpen(true)}
        >
          + New archival resource
        </button>,
      );
    }

    if (
      preset.baseFilters.entityType?.includes("Place") &&
      canCreate("Place")
    ) {
      btns.push(
        <PlaceCreateOrImportButtons key="place-buttons" onCreated={handleCreated} />,
      );
    }

    return btns.length > 0 ? btns : null;
  }, [preset, canCreate]);
  if (configLoading) {
    return <div className="ql-loading-page">Loading presets…</div>;
  }

  if (configError || !preset) {
    return (
      <div className="ql-error-page">{configError ?? "No presets available."}</div>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="ql-page">
      {/* Page header */}
      <div className="ql-header">
        <div className="ql-header-title-row">
          <h2 className="ql-title">Quicklinks</h2>
          <span className="ql-config-source">source: {configSource}</span>
        </div>
        <p className="ql-description">
          Quick entry points for common CRIS searches with entity-specific facet filters.
        </p>
      </div>

      {/* Preset tabs + create buttons */}
      <div className="ql-tabs-row">
        <div className="ql-tabs">
          {presets.map((p) => (
            <button
              key={p.key}
              onClick={() => setPresetKey(p.key)}
              className={`ql-tab${p.key === presetKey ? " ql-tab--active" : ""}`}
            >
              {p.label}
            </button>
          ))}
        </div>
        {createButtons && (
          <div className="ql-create-buttons">{createButtons}</div>
        )}
      </div>

      {/* Main grid: sidebar + results */}
      <div className="ql-grid">
        {/* ── Left sidebar: preset info + facets ── */}
        <div className="ql-sidebar">
          {/* Preset card */}
          <div className="ql-preset-card">
            <div className="ql-preset-label">{preset.label}</div>
            {preset.description && (
              <div className="ql-preset-description">{preset.description}</div>
            )}
            <div className="ql-base-filters-heading">Base filters</div>
            <div className="ql-base-filters-chips">
              {Object.entries(preset.baseFilters).flatMap(([facet, values]) =>
                values.map((value) => (
                  <span key={`${facet}:${value}`} className="ql-base-filter-chip">
                    {value}
                  </span>
                )),
              )}
            </div>
          </div>

          {/* Facet boxes */}
          {preset.filters.map((filter) => (
            <FacetBox
              key={`${presetKey}:${filter.key}`}
              title={filter.label}
              facetName={filter.facetName}
              query={submittedQuery}
              filters={effectiveFilters}
              selected={filters[filter.facetName] ?? []}
              onToggle={toggleFilter}
            />
          ))}
        </div>

        {/* ── Right: search bar + results ── */}
        <div className="ql-right">
          {/* Search bar */}
          <div className="ql-search-bar">
            <div className="ql-search-controls">
              <input
                className="ql-search-input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") submitSearch(); }}
                placeholder={`Search within ${preset.label}…`}
              />
              <button className="ql-btn-search" onClick={submitSearch}>Search</button>
              <button
                className="ql-btn-reset"
                onClick={() => {
                  setQuery("");
                  setSubmittedQuery("");
                  setPage(0);
                  setFilters({});
                }}
              >
                Reset
              </button>
            </div>

            {/* Active filter chips */}
            {activeUserFilters.length > 0 && (
              <div className="ql-active-filters">
                <span className="ql-active-filters-label">Active:</span>
                {activeUserFilters.map(({ facet, value }) => (
                  <button
                    key={`${facet}:${value}`}
                    className="ql-active-chip"
                    onClick={() => toggleFilter(facet, value)}
                  >
                    {value} ×
                  </button>
                ))}
                <button className="ql-clear-all" onClick={clearUserFilters}>
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* Results panel */}
          <div className="ql-results-panel">
            <div className="ql-results-header-with-toggle">
              <div>
                {viewMode === "list" && (
                  <>
                    <span className="ql-results-title">Results</span>
                    <span className="ql-results-count">
                      {totalElements.toLocaleString()} match{totalElements !== 1 ? "es" : ""}
                    </span>
                  </>
                )}
                {viewMode === "tree" && (
                  <span className="ql-results-title">
                    {preset.baseFilters.entityType?.includes("ArchivalResource")
                      ? "Archival hierarchy"
                      : "Concept scheme browser"}
                  </span>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {viewMode === "list" && (
                  <span className="ql-results-page">
                    Page {Math.min(page + 1, Math.max(totalPages, 1))} / {Math.max(totalPages, 1)}
                  </span>
                )}
                {supportsTree && (
                  <div className="ql-view-tabs">
                    <button
                      className={`ql-view-tab${viewMode === "list" ? " ql-view-tab--active" : ""}`}
                      onClick={() => setViewMode("list")}
                    >
                      ☰ List
                    </button>
                    <button
                      className={`ql-view-tab${viewMode === "tree" ? " ql-view-tab--active" : ""}`}
                      onClick={() => setViewMode("tree")}
                    >
                      🌲 Tree
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* ── List view ── */}
            {viewMode === "list" && (
              <>
                {loading && <div className="ql-results-status">Loading…</div>}
                {!loading && error && <div className="ql-results-error">{error}</div>}
                {!loading && !error && rows.length === 0 && (
                  <div className="ql-results-status">No results found.</div>
                )}
                {!loading && !error && rows.map((row) => (
                  <ResultCard
                    key={row.uuid}
                    row={row}
                    onOpen={onOpenItem}
                    onEdit={
                      ["archivalresource","conceptscheme","concept"]
                        .includes(row.entityType?.toLowerCase() ?? "")
                        ? handleEditRow
                        : undefined
                    }
                  />
                ))}

                {/* Pagination */}
                <div className="ql-pagination">
                  <button
                    className="ql-page-btn"
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page <= 0}
                  >
                    ← Prev
                  </button>
                  <button
                    className="ql-page-btn"
                    onClick={() => setPage((p) => (p < totalPages - 1 ? p + 1 : p))}
                    disabled={page >= totalPages - 1 || totalPages === 0}
                  >
                    Next →
                  </button>
                </div>
              </>
            )}

            {/* ── Tree view: ArchivalResource ── */}
            {viewMode === "tree" && preset.baseFilters.entityType?.includes("ArchivalResource") && (
              <ArchivalResourceTreePanel
                effectiveFilters={effectiveFilters}
                query={submittedQuery}
                onOpen={onOpenItem}
              />
            )}

            {/* ── Tree view: ConceptScheme — shows scheme browser with concept children ── */}
            {viewMode === "tree" && preset.baseFilters.entityType?.includes("ConceptScheme") && (
              <ConceptSchemeTreePanel
                schemes={rows.map((r) => ({ uuid: r.uuid, name: r.name }))}
                schemesLoading={loading}
                onOpenItem={onOpenItem}
                onFilterByScheme={(schemeName) => {
                  // Flip to list view and apply skos.inScheme filter
                  setViewMode("list");
                  setFilters((prev) => ({
                    ...prev,
                    "skos.inScheme": [schemeName],
                  }));
                  setPage(0);
                }}
              />
            )}
          </div>

          <div className="ql-footer-note">
            Facet names must match the DSpace Discover configuration. If a
            facet returns no values, verify the backend facet configuration.
          </div>
        </div>
      </div>

      {/* ── Creation modals ── */}
      <EquipmentCreationModal
        open={equipmentModalOpen}
        onClose={() => setEquipmentModalOpen(false)}
        onCreated={handleCreated}
      />
      <FundingCreationModal
        open={fundingModalOpen}
        onClose={() => setFundingModalOpen(false)}
        onCreated={handleCreated}
      />
      <FundingProgrammeModal
        open={fundingProgrammeModalOpen}
        onClose={() => setFundingProgrammeModalOpen(false)}
        onCreated={handleCreated}
      />
      {/* Place modals are rendered inside PlaceCreateOrImportButtons (in createButtons) */}
      <ConceptSchemeModal
        open={conceptSchemeModalOpen}
        onClose={() => { setConceptSchemeModalOpen(false); setEditTarget(null); }}
        onCreated={handleCreated}
      />
      <ConceptModal
        open={conceptModalOpen}
        onClose={() => { setConceptModalOpen(false); setEditTarget(null); }}
        onCreated={handleCreated}
      />
      {/* ArchivalResource create modal */}
      <ArchivalResourceModal
        mode="create"
        open={archivalResourceModalOpen && !editTarget}
        onClose={() => setArchivalResourceModalOpen(false)}
        onSaved={(id) => {
          setArchivalResourceModalOpen(false);
          if (typeof id === "number") handleCreated(id);
        }}
      />
      {/* OrgUnit creation modal */}
      <OrgUnitCreationModal
        open={orgUnitModalOpen}
        onClose={() => setOrgUnitModalOpen(false)}
        onCreated={(wsId) => {
          setOrgUnitModalOpen(false);
          handleCreated(wsId);
        }}
      />

      {/* ArchivalResource edit modal (archived item) */}
      {editTarget && archivalResourceModalOpen && (
        <ArchivalResourceModal
          mode="editItem"
          uuid={editTarget.uuid}
          open
          onClose={() => { setArchivalResourceModalOpen(false); setEditTarget(null); }}
          onSaved={() => {
            setArchivalResourceModalOpen(false);
            setEditTarget(null);
            // Refresh results
            setSubmittedQuery((q) => q);
          }}
        />
      )}
    </div>
  );
}

export default QuicklinksPage;
