import React from "react";
import { apiFetch } from "../auth/client";
import {
  type SearchResponse,
  type ParsedItemRow,
  parseItemRow,
  hrefToPath,
} from "../api/dspace";
import { BNFacetSection } from "../components/bn-facet-section";
import { BNCheckboxFacet } from "../components/bn-checkbox-facet";

// ── Types ─────────────────────────────────────────────────────────────────────

interface FacetValue {
  label: string;
  count: number;
  authorityKey: string | null;
  searchHref: string;
}

interface FacetData {
  values: FacetValue[];
  hasMore: boolean;
  nextHref?: string;
}

// ── API ───────────────────────────────────────────────────────────────────────

const PAGE_SIZE = 10;

async function fetchSearchResults(
  query: string,
  page: number,
  filters: Record<string, string[]>,
): Promise<{
  rows: ParsedItemRow[];
  totalElements: number;
  totalPages: number;
}> {
  const params = new URLSearchParams({
    sort: "score,DESC",
    page: String(page),
    size: String(PAGE_SIZE),
    projection: "preventMetadataSecurity",
  });
  if (query.trim()) params.set("query", query.trim());
  params.append("embed", "thumbnail");
  params.append("embed", "item/thumbnail");
  params.append("embed", "metrics");

  // Apply active filters
  for (const [facetName, values] of Object.entries(filters)) {
    for (const val of values) {
      params.append(`f.${facetName}`, `${val},equals`);
    }
  }

  const data = await apiFetch<SearchResponse>(
    `/api/discover/search/objects?${params}`,
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
  size = 10,
): Promise<FacetData> {
  const params = new URLSearchParams({
    query: query || "*",
    size: String(size),
  });
  // Pass active filters so counts stay contextual
  for (const [fn, values] of Object.entries(filters)) {
    if (fn === facetName) continue; // don't self-filter
    for (const val of values) {
      params.append(`f.${fn}`, `${val},equals`);
    }
  }

  const data = await apiFetch<any>(
    `/api/discover/facets/${facetName}?${params}`,
  );

  const rawValues: any[] = data?._embedded?.values ?? [];
  return {
    values: rawValues.map((v) => ({
      label: v.label,
      count: v.count,
      authorityKey: v.authorityKey ?? null,
      searchHref: v._links?.search?.href ?? "",
    })),
    hasMore: !!data?._links?.next,
    nextHref: data?._links?.next?.href,
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtDate(s?: string | null): string {
  if (!s) return "—";
  const d = new Date(s);
  return isNaN(d.getTime()) ? s : d.toLocaleDateString();
}

function StatusBadge({ row }: { row: ParsedItemRow }) {
  if (row.withdrawn)
    return (
      <span
        style={{
          fontSize: 11,
          fontWeight: 600,
          padding: "1px 6px",
          borderRadius: 3,
          background: "#fff1f0",
          color: "#cf1322",
        }}
      >
        Withdrawn
      </span>
    );
  if (row.inArchive)
    return (
      <span
        style={{
          fontSize: 11,
          fontWeight: 600,
          padding: "1px 6px",
          borderRadius: 3,
          background: "#f6ffed",
          color: "#389e0d",
        }}
      >
        Archived
      </span>
    );
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 600,
        padding: "1px 6px",
        borderRadius: 3,
        background: "#fffbe6",
        color: "#ad6800",
      }}
    >
      Draft
    </span>
  );
}

// ── Result card ───────────────────────────────────────────────────────────────

function ResultCard({
  row,
  onOpen,
}: {
  row: ParsedItemRow;
  onOpen: (uuid: string) => void;
}) {
  return (
    <div
      onClick={() => onOpen(row.uuid)}
      style={{
        display: "flex",
        gap: 12,
        padding: "12px 14px",
        borderBottom: "1px solid #f1f3f5",
        cursor: "pointer",
        transition: "background 0.1s",
      }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLDivElement).style.background = "#f8fafc")
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLDivElement).style.background = "")
      }
    >
      {/* Thumbnail */}
      <div style={{ flexShrink: 0 }}>
        {row.thumbnail ? (
          <img
            src={row.thumbnail}
            alt=""
            style={{
              width: 48,
              height: 48,
              objectFit: "cover",
              borderRadius: 6,
              border: "1px solid #e5e7eb",
            }}
          />
        ) : (
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 6,
              border: "1px solid #e5e7eb",
              background: "#f3f4f6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              color: "#d1d5db",
            }}
          >
            ▤
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            flexWrap: "wrap",
            marginBottom: 3,
          }}
        >
          <span
            style={{
              fontWeight: 600,
              fontSize: 14,
              color: "#2563eb",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
            title={row.name}
          >
            {row.name}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            flexWrap: "wrap",
          }}
        >
          <StatusBadge row={row} />
          {row.entityType && (
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                padding: "1px 6px",
                borderRadius: 3,
                background: "#eef2ff",
                color: "#4338ca",
              }}
            >
              {row.entityType}
            </span>
          )}
          {row.dcType && (
            <span
              style={{
                fontSize: 11,
                padding: "1px 6px",
                borderRadius: 3,
                background: "#f3f4f6",
                color: "#555",
              }}
            >
              {row.dcType}
            </span>
          )}
          {row.handle && (
            <span style={{ fontSize: 11, color: "#9ca3af" }}>{row.handle}</span>
          )}
          {row.lastModified && (
            <span
              style={{ fontSize: 11, color: "#9ca3af", marginLeft: "auto" }}
            >
              {fmtDate(row.lastModified)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Facet sidebar ─────────────────────────────────────────────────────────────

function FacetSidebar({
  query,
  filters,
  onToggleFilter,
}: {
  query: string;
  filters: Record<string, string[]>;
  onToggleFilter: (facet: string, value: string) => void;
}) {
  const [entityFacet, setEntityFacet] = React.useState<FacetData | null>(null);
  const [itemtypeFacet, setItemtypeFacet] = React.useState<FacetData | null>(
    null,
  );
  const [loadingEntity, setLoadingEntity] = React.useState(false);
  const [loadingItemtype, setLoadingItemtype] = React.useState(false);

  React.useEffect(() => {
    setLoadingEntity(true);
    fetchFacet("entityType", query, filters, 10)
      .then(setEntityFacet)
      .catch(console.error)
      .finally(() => setLoadingEntity(false));
  }, [query, JSON.stringify(filters)]);

  React.useEffect(() => {
    setLoadingItemtype(true);
    fetchFacet("itemtype", query, filters, 10)
      .then(setItemtypeFacet)
      .catch(console.error)
      .finally(() => setLoadingItemtype(false));
  }, [query, JSON.stringify(filters)]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        width: 220,
        flexShrink: 0,
      }}
    >
      <BNFacetSection title="Entity Type" defaultOpen>
        {loadingEntity && (
          <span style={{ fontSize: 13, color: "#888" }}>Loading…</span>
        )}
        {!loadingEntity &&
          entityFacet?.values.map((v) => (
            <BNCheckboxFacet
              key={v.label}
              label={v.label}
              count={v.count}
              checked={(filters["entityType"] ?? []).includes(v.label)}
              onChange={() => onToggleFilter("entityType", v.label)}
            />
          ))}
        {!loadingEntity && !entityFacet?.values.length && (
          <span style={{ fontSize: 12, color: "#aaa" }}>No values</span>
        )}
      </BNFacetSection>

      <BNFacetSection title="Item Type (dc.type)" defaultOpen>
        {loadingItemtype && (
          <span style={{ fontSize: 13, color: "#888" }}>Loading…</span>
        )}
        {!loadingItemtype &&
          itemtypeFacet?.values.map((v) => (
            <BNCheckboxFacet
              key={v.label}
              label={v.label}
              count={v.count}
              checked={(filters["itemtype"] ?? []).includes(v.label)}
              onChange={() => onToggleFilter("itemtype", v.label)}
            />
          ))}
        {!loadingItemtype && !itemtypeFacet?.values.length && (
          <span style={{ fontSize: 12, color: "#aaa" }}>No values</span>
        )}
      </BNFacetSection>
    </div>
  );
}

// ── Active filter chips ───────────────────────────────────────────────────────

function ActiveFilters({
  filters,
  onRemove,
  onClearAll,
}: {
  filters: Record<string, string[]>;
  onRemove: (facet: string, value: string) => void;
  onClearAll: () => void;
}) {
  const chips = Object.entries(filters).flatMap(([facet, values]) =>
    values.map((v) => ({ facet, value: v })),
  );
  if (!chips.length) return null;

  const FACET_LABELS: Record<string, string> = {
    entityType: "Entity",
    itemtype: "Type",
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        flexWrap: "wrap",
        marginBottom: 12,
      }}
    >
      <span style={{ fontSize: 12, color: "#666", fontWeight: 600 }}>
        Filters:
      </span>
      {chips.map(({ facet, value }) => (
        <span
          key={`${facet}:${value}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            fontSize: 12,
            padding: "2px 8px",
            borderRadius: 12,
            background: "#dbeafe",
            color: "#1d4ed8",
            border: "1px solid #bfdbfe",
          }}
        >
          <span style={{ fontWeight: 600, opacity: 0.7 }}>
            {FACET_LABELS[facet] ?? facet}:
          </span>
          {value}
          <button
            onClick={() => onRemove(facet, value)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#1d4ed8",
              padding: 0,
              fontSize: 13,
              lineHeight: 1,
              display: "flex",
              alignItems: "center",
            }}
          >
            ×
          </button>
        </span>
      ))}
      <button
        onClick={onClearAll}
        style={{
          fontSize: 12,
          color: "#6b7280",
          background: "none",
          border: "none",
          cursor: "pointer",
          textDecoration: "underline",
          padding: 0,
        }}
      >
        Clear all
      </button>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

type Props = {
  onOpenItem: (uuid: string) => void;
  initialQuery?: string;
};

export function SearchPage({ onOpenItem, initialQuery = "" }: Props) {
  const [q, setQ] = React.useState(initialQuery);
  const [activeQ, setActiveQ] = React.useState(initialQuery);
  const [filters, setFilters] = React.useState<Record<string, string[]>>({});
  const [page, setPage] = React.useState(0);

  const [rows, setRows] = React.useState<ParsedItemRow[]>([]);
  const [totalElements, setTotal] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [hasSearched, setHasSearched] = React.useState(false);

  const load = React.useCallback(
    async (
      query: string,
      p: number,
      currentFilters: Record<string, string[]>,
    ) => {
      if (!query.trim()) return;
      setLoading(true);
      setError(null);
      setHasSearched(true);
      try {
        const res = await fetchSearchResults(query, p, currentFilters);
        setRows(res.rows);
        setTotal(res.totalElements);
        setTotalPages(res.totalPages);
      } catch (e: any) {
        setError(e?.message ?? String(e));
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  React.useEffect(() => {
    if (activeQ.trim()) load(activeQ, page, filters);
  }, [load, activeQ, page, filters]);

  const search = () => {
    setPage(0);
    setFilters({});
    setActiveQ(q.trim());
  };

  const toggleFilter = React.useCallback((facet: string, value: string) => {
    setPage(0);
    setFilters((prev) => {
      const current = prev[facet] ?? [];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return next.length
        ? { ...prev, [facet]: next }
        : Object.fromEntries(Object.entries(prev).filter(([k]) => k !== facet));
    });
  }, []);

  const removeFilter = React.useCallback(
    (facet: string, value: string) => {
      toggleFilter(facet, value);
    },
    [toggleFilter],
  );

  const clearAllFilters = React.useCallback(() => {
    setFilters({});
    setPage(0);
  }, []);

  const hasPrev = page > 0;
  const hasNext = page < totalPages - 1;

  return (
    <div style={{ padding: "20px 24px" }}>
      {/* ── Search bar ── */}
      <div style={{ display: "flex", gap: 0, marginBottom: 20, maxWidth: 700 }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && search()}
          placeholder="Search repository… (supports Solr syntax)"
          style={{
            flex: 1,
            padding: "9px 14px",
            fontSize: 14,
            border: "1px solid #d1d5db",
            borderRight: "none",
            borderRadius: "6px 0 0 6px",
            outline: "none",
          }}
        />
        <button
          onClick={search}
          style={{
            padding: "9px 20px",
            fontSize: 14,
            fontWeight: 600,
            border: "1px solid #2563eb",
            borderRadius: "0 6px 6px 0",
            background: "#2563eb",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </div>

      {/* ── Body: sidebar + results ── */}
      <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
        {/* Facets */}
        {hasSearched && (
          <FacetSidebar
            query={activeQ}
            filters={filters}
            onToggleFilter={toggleFilter}
          />
        )}

        {/* Results */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Active filters */}
          <ActiveFilters
            filters={filters}
            onRemove={removeFilter}
            onClearAll={clearAllFilters}
          />

          {/* Stats bar */}
          {hasSearched && !loading && !error && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 12,
                fontSize: 13,
                color: "#555",
              }}
            >
              {totalElements > 0 ? (
                <span>
                  <strong>{totalElements.toLocaleString()}</strong> results
                  {activeQ && (
                    <>
                      {" "}
                      for <em>"{activeQ}"</em>
                    </>
                  )}
                </span>
              ) : (
                <span>
                  No results
                  {activeQ && (
                    <>
                      {" "}
                      for <em>"{activeQ}"</em>
                    </>
                  )}
                  .
                </span>
              )}
              <span
                style={{ marginLeft: "auto", fontSize: 12, color: "#9ca3af" }}
              >
                Page {page + 1}
                {totalPages > 1 ? ` of ${totalPages}` : ""}
              </span>
            </div>
          )}

          {error && (
            <div
              style={{
                padding: "10px 14px",
                background: "#fff1f0",
                border: "1px solid #ffa39e",
                borderRadius: 6,
                color: "#cf1322",
                marginBottom: 12,
                fontSize: 13,
              }}
            >
              {error}
            </div>
          )}

          {!hasSearched && (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                color: "#9ca3af",
                fontSize: 14,
              }}
            >
              Enter a search query to get started. Supports Solr syntax, e.g.{" "}
              <code
                style={{
                  background: "#f3f4f6",
                  padding: "1px 6px",
                  borderRadius: 4,
                }}
              >
                title:waldhorn AND entityType:Publication
              </code>
            </div>
          )}

          {/* Results list */}
          {hasSearched && (
            <div
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                overflow: "hidden",
                opacity: loading ? 0.6 : 1,
                transition: "opacity 0.15s",
              }}
            >
              {rows.map((row) => (
                <ResultCard key={row.uuid} row={row} onOpen={onOpenItem} />
              ))}
              {!loading && rows.length === 0 && (
                <div
                  style={{
                    padding: "32px 20px",
                    textAlign: "center",
                    color: "#9ca3af",
                    fontSize: 14,
                  }}
                >
                  No results found.
                </div>
              )}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginTop: 16,
                fontSize: 13,
                color: "#555",
              }}
            >
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={!hasPrev || loading}
                style={{
                  padding: "5px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: 5,
                  background: "#fff",
                  cursor: hasPrev ? "pointer" : "not-allowed",
                  opacity: hasPrev ? 1 : 0.5,
                }}
              >
                ← Prev
              </button>
              <span>
                Page {page + 1} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!hasNext || loading}
                style={{
                  padding: "5px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: 5,
                  background: "#fff",
                  cursor: hasNext ? "pointer" : "not-allowed",
                  opacity: hasNext ? 1 : 0.5,
                }}
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
