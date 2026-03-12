import React from "react";
import { apiFetch } from "../auth/client";
import {
  type SearchResponse,
  type ParsedItemRow,
  type Collection,
  parseItemRow,
  metaFirst,
} from "../api/dspace";

const PAGE_SIZE = 20;

// ── API ───────────────────────────────────────────────────────────────────────

async function fetchCollectionItems(
  collectionId: string,
  page: number,
  query: string,
): Promise<{
  rows: ParsedItemRow[];
  totalElements: number;
  totalPages: number;
}> {
  const params = new URLSearchParams({
    sort: "dc.date.accessioned,DESC",
    page: String(page),
    size: String(PAGE_SIZE),
    configuration: "collection",
    scope: collectionId,
    projection: "preventMetadataSecurity",
  });
  params.append("embed", "thumbnail");
  params.append("embed", "item/thumbnail");
  params.append("embed", "metrics");
  if (query.trim()) params.set("query", query.trim());

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

async function fetchCollection(
  collectionId: string,
): Promise<Collection | null> {
  try {
    return await apiFetch<Collection>(`/api/core/collections/${collectionId}`);
  } catch {
    return null;
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtDate(s?: string | null): string {
  if (!s) return "—";
  const d = new Date(s);
  return isNaN(d.getTime()) ? s : d.toLocaleString();
}

const badge = (bg: string, color: string): React.CSSProperties => ({
  fontSize: 11,
  fontWeight: 600,
  padding: "2px 7px",
  borderRadius: 3,
  background: bg,
  color,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  whiteSpace: "nowrap",
});

function StatusBadge({ row }: { row: ParsedItemRow }) {
  if (row.withdrawn)
    return <span style={badge("#fff1f0", "#cf1322")}>Withdrawn</span>;
  if (row.inArchive)
    return <span style={badge("#f6ffed", "#389e0d")}>Archived</span>;
  return <span style={badge("#fffbe6", "#ad6800")}>Draft</span>;
}

// ── Props ─────────────────────────────────────────────────────────────────────

type Props = {
  /** UUID of the collection to browse */
  collectionId: string;
  onOpenItem: (uuid: string) => void;
  onBack?: () => void;
};

// ── Component ─────────────────────────────────────────────────────────────────

export function ItemListPage({ collectionId, onOpenItem, onBack }: Props) {
  const [collection, setCollection] = React.useState<Collection | null>(null);
  const [rows, setRows] = React.useState<ParsedItemRow[]>([]);
  const [totalElements, setTotal] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(0);
  const [page, setPage] = React.useState(0);
  const [q, setQ] = React.useState("");
  const [activeQ, setActiveQ] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Load collection name once
  React.useEffect(() => {
    fetchCollection(collectionId)
      .then(setCollection)
      .catch(() => null);
  }, [collectionId]);

  const load = React.useCallback(
    async (p: number, query: string) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchCollectionItems(collectionId, p, query);
        setRows(res.rows);
        setTotal(res.totalElements);
        setTotalPages(res.totalPages);
      } catch (e: any) {
        setError(e?.message ?? String(e));
      } finally {
        setLoading(false);
      }
    },
    [collectionId],
  );

  React.useEffect(() => {
    void load(page, activeQ);
  }, [load, page, activeQ]);

  const search = () => {
    setPage(0);
    setActiveQ(q.trim());
  };

  const hasPrev = page > 0;
  const hasNext = page < totalPages - 1;

  const collectionName =
    collection?.name ??
    metaFirst(collection?.metadata, "dc.title") ??
    "Collection";

  return (
    <div style={{ padding: "20px 24px", maxWidth: 1100 }}>
      {/* ── Header ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 20,
          flexWrap: "wrap",
        }}
      >
        {onBack && (
          <button
            onClick={onBack}
            style={{
              padding: "6px 12px",
              fontSize: 13,
              border: "1px solid #d1d5db",
              borderRadius: 5,
              background: "#f9fafb",
              cursor: "pointer",
            }}
          >
            ← Back
          </button>
        )}
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: 20,
              fontWeight: 600,
              color: "#1a1a2e",
            }}
          >
            {collectionName}
          </h2>
          {collection?.handle && (
            <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>
              {collection.handle}
            </div>
          )}
        </div>

        {totalElements > 0 && (
          <span
            style={{
              fontSize: 12,
              color: "#888",
              background: "#f1f3f5",
              borderRadius: 10,
              padding: "2px 8px",
            }}
          >
            {totalElements.toLocaleString()} items
          </span>
        )}

        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex" }}>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && search()}
              placeholder="Search items…"
              style={{
                padding: "6px 10px",
                fontSize: 13,
                border: "1px solid #d1d5db",
                borderRight: "none",
                borderRadius: "5px 0 0 5px",
                outline: "none",
                width: 200,
              }}
            />
            <button
              onClick={search}
              style={{
                padding: "6px 12px",
                fontSize: 13,
                border: "1px solid #d1d5db",
                borderRadius: "0 5px 5px 0",
                background: "#f9fafb",
                cursor: "pointer",
              }}
            >
              Search
            </button>
          </div>
          <button
            onClick={() => load(page, activeQ)}
            disabled={loading}
            style={{
              padding: "6px 14px",
              fontSize: 13,
              border: "1px solid #d1d5db",
              borderRadius: 5,
              background: "#f9fafb",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
            }}
          >
            ↻ Refresh
          </button>
        </div>
      </div>

      {error && (
        <div
          style={{
            padding: "10px 14px",
            background: "#fff1f0",
            border: "1px solid #ffa39e",
            borderRadius: 6,
            color: "#cf1322",
            marginBottom: 16,
            fontSize: 13,
          }}
        >
          {error}
        </div>
      )}

      {/* ── Table ── */}
      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 8,
          overflow: "hidden",
          opacity: loading ? 0.65 : 1,
          transition: "opacity 0.15s",
        }}
      >
        <table
          style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
        >
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              {[
                "",
                "Title / Handle",
                "Entity Type",
                "DC Type",
                "Status",
                "Date Accessioned",
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: "left",
                    padding: "9px 12px",
                    borderBottom: "1px solid #e5e7eb",
                    fontWeight: 600,
                    color: "#374151",
                    whiteSpace: "nowrap",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.uuid}
                style={{ borderBottom: "1px solid #f1f3f5", cursor: "pointer" }}
                onClick={() => onOpenItem(row.uuid)}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLTableRowElement).style.background =
                    "#f8fafc")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLTableRowElement).style.background =
                    "")
                }
              >
                {/* Thumbnail */}
                <td style={{ padding: "6px 8px 6px 12px", width: 40 }}>
                  {row.thumbnail ? (
                    <img
                      src={row.thumbnail}
                      alt=""
                      style={{
                        width: 36,
                        height: 36,
                        objectFit: "cover",
                        borderRadius: 4,
                        border: "1px solid #e5e7eb",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 4,
                        border: "1px solid #e5e7eb",
                        background: "#f3f4f6",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 16,
                        color: "#d1d5db",
                      }}
                    >
                      ▤
                    </div>
                  )}
                </td>
                <td style={{ padding: "9px 12px", maxWidth: 300 }}>
                  <div
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      fontWeight: 500,
                      color: "#1a1a2e",
                    }}
                    title={row.name}
                  >
                    {row.name}
                  </div>
                  {row.handle && (
                    <div style={{ fontSize: 11, color: "#888", marginTop: 1 }}>
                      {row.handle}
                    </div>
                  )}
                </td>
                <td
                  style={{
                    padding: "9px 12px",
                    whiteSpace: "nowrap",
                    color: "#555",
                  }}
                >
                  {row.entityType || "—"}
                </td>
                <td
                  style={{
                    padding: "9px 12px",
                    color: "#555",
                    maxWidth: 160,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {row.dcType || "—"}
                </td>
                <td style={{ padding: "9px 12px" }}>
                  <StatusBadge row={row} />
                </td>
                <td
                  style={{
                    padding: "9px 12px",
                    whiteSpace: "nowrap",
                    color: "#666",
                  }}
                >
                  {fmtDate(row.lastModified)}
                </td>
              </tr>
            ))}
            {!loading && rows.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    padding: "20px 12px",
                    color: "#888",
                    textAlign: "center",
                  }}
                >
                  No items found in this collection.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
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
  );
}
