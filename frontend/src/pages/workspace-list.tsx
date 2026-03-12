import React from "react";
import { apiFetch } from "../auth/client";
import {
  type SearchResponse,
  type ParsedWorkspaceRow,
  parseSearchObject,
} from "../api/dspace";

const PAGE_SIZE = 20;

// ── API: My Submissions ────────────────────────────────────────────────────────

async function fetchWorkspace(
  page: number,
  query: string,
): Promise<{
  rows: ParsedWorkspaceRow[];
  totalElements: number;
  totalPages: number;
}> {
  const params = new URLSearchParams({
    configuration: "workspace",
    sort: "lastModified,DESC",
    page: String(page),
    size: String(PAGE_SIZE),
  });
  if (query.trim()) params.set("query", query.trim());

  const data = await apiFetch<SearchResponse>(
    `/api/discover/search/objects?${params}`,
  );
  const sr = data?._embedded?.searchResult;
  const objects = sr?._embedded?.objects ?? [];
  const pageInfo = sr?.page;

  return {
    rows: objects
      .map(parseSearchObject as any)
      .filter(Boolean) as ParsedWorkspaceRow[],
    totalElements: pageInfo?.totalElements ?? 0,
    totalPages: pageInfo?.totalPages ?? 0,
  };
}

// ── API: Submissions by Others ─────────────────────────────────────────────────

async function fetchOtherWorkspace(
  page: number,
  query: string,
): Promise<{
  rows: ParsedOtherRow[];
  totalElements: number;
  totalPages: number;
}> {
  const params = new URLSearchParams({
    configuration: "otherworkspace",
    sort: "lastModified,DESC",
    page: String(page),
    size: String(PAGE_SIZE),
    projection: "preventMetadataSecurity",
  });
  if (query.trim()) params.set("query", query.trim());

  const data = await apiFetch<any>(`/api/discover/search/objects?${params}`);
  const sr = data?._embedded?.searchResult;
  const objects: any[] = sr?._embedded?.objects ?? [];
  const pageInfo = sr?.page;

  return {
    rows: objects.map(parseOtherRow).filter(Boolean) as ParsedOtherRow[],
    totalElements: pageInfo?.totalElements ?? 0,
    totalPages: pageInfo?.totalPages ?? 0,
  };
}

// ── API: Clone a workspace item ────────────────────────────────────────────────
//
// DSpace has no native clone endpoint. We implement it as three steps:
//   1. Fetch the source workspace item to read its sections + collection
//   2. POST to create a new blank workspace item in the same collection
//   3. PATCH the new item with all metadata values copied from the source sections
//
// Returns the numeric id of the newly created workspace item.

async function cloneWorkspaceItem(wsId: number): Promise<number> {
  // 1. Fetch source
  const src = await apiFetch<any>(
    `/api/submission/workspaceitems/${wsId}?projection=full`,
  );

  const collectionId: string | null =
    src._embedded?.collection?.id ?? src.sections?.collection ?? null;

  if (!collectionId) {
    throw new Error(
      "Cannot determine collection for workspace item — clone aborted.",
    );
  }

  // 2. Create new blank workspace item in the same collection
  const created = await apiFetch<any>(
    `/api/submission/workspaceitems?owningCollection=${collectionId}`,
    { method: "POST", headers: { "Content-Type": "application/json" } },
  );
  const newId: number = created?.id;
  if (!newId) throw new Error("Failed to create new workspace item.");

  // 3. Build JSON Patch from source sections
  //    We copy every section that contains a plain field→MetaValue[] map.
  //    Excluded: "collection" (string uuid), "detect-duplicate" (runtime state),
  //    "uploadOptional" / "upload" (files, not copyable via metadata PATCH).
  const SKIP_SECTIONS = new Set([
    "collection",
    "detect-duplicate",
    "uploadOptional",
    "upload",
  ]);

  const ops: Array<{ op: string; path: string; value: any }> = [];

  const sections: Record<string, any> = src.sections ?? {};
  for (const [sectionName, sectionData] of Object.entries(sections)) {
    if (SKIP_SECTIONS.has(sectionName)) continue;
    if (!sectionData || typeof sectionData !== "object") continue;

    for (const [field, vals] of Object.entries(
      sectionData as Record<string, any>,
    )) {
      if (!Array.isArray(vals) || vals.length === 0) continue;
      ops.push({
        op: "add",
        path: `/sections/${sectionName}/${field}`,
        value: vals,
      });
    }
  }

  if (ops.length > 0) {
    await apiFetch<any>(`/api/submission/workspaceitems/${newId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ops),
    });
  }

  return newId;
}

// ── Other-workspace row model ──────────────────────────────────────────────────

export interface ParsedOtherRow {
  key: string;
  /** Numeric workspace item id — present when rawType === "workspaceitem" */
  workspaceId: number | null;
  /** UUID — present when rawType === "item" */
  uuid: string | null;
  name: string;
  dcType: string | null;
  submissionDefinition: string | null;
  errors: string[];
  lastModified: string | null;
  /** "workspaceitem" | "item" */
  rawType: string;
}

function parseOtherRow(obj: any): ParsedOtherRow | null {
  const raw = obj?._embedded?.indexableObject;
  if (!raw) return null;

  if (raw.type === "workspaceitem") {
    const dcTypeVals: any[] =
      raw.sections?.archivalresource_type?.["dc.type"] ?? [];
    const dcType = dcTypeVals[0]?.value ?? null;
    const errors: string[] = (raw.errors ?? []).map(
      (e: any) => e.message as string,
    );
    const subDef: string | null =
      raw._embedded?.submissionDefinition?.name ?? null;
    const titleSection: any =
      raw.sections?.ive_archivalresource_mandatory ?? {};
    const titleVals: any[] = titleSection?.["dc.title"] ?? [];
    const name = titleVals[0]?.value ?? `Workspace #${raw.id}`;
    return {
      key: `other-ws-${raw.id}`,
      workspaceId: raw.id as number,
      uuid: null,
      name,
      dcType,
      submissionDefinition: subDef,
      errors,
      lastModified: raw.lastModified ?? null,
      rawType: "workspaceitem",
    };
  }

  // type === "item"
  const meta = raw.metadata ?? {};
  const titleVal = raw.name ?? meta["dc.title"]?.[0]?.value ?? "(untitled)";
  const dcType = meta["dc.type"]?.[0]?.value ?? null;
  return {
    key: `other-item-${raw.uuid ?? raw.id}`,
    workspaceId: null,
    uuid: raw.uuid ?? raw.id ?? null,
    name: titleVal,
    dcType,
    submissionDefinition: null,
    errors: [],
    lastModified: raw.lastModified ?? null,
    rawType: "item",
  };
}

// ── Shared helpers ─────────────────────────────────────────────────────────────

function fmtDate(s?: string | null): string {
  if (!s) return "—";
  const d = new Date(s);
  return isNaN(d.getTime()) ? s : d.toLocaleString();
}

const badgeStyle = (bg: string, color: string): React.CSSProperties => ({
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

function MyStatusBadge({ row }: { row: ParsedWorkspaceRow }) {
  if (row.withdrawn)
    return <span style={badgeStyle("#fff1f0", "#cf1322")}>Withdrawn</span>;
  if (row.isWorkspaceItem)
    return <span style={badgeStyle("#fffbe6", "#ad6800")}>Workspace</span>;
  if (row.inArchive)
    return <span style={badgeStyle("#f6ffed", "#389e0d")}>Archived</span>;
  return <span style={badgeStyle("#f5f5f5", "#555")}>—</span>;
}

const viewBtn: React.CSSProperties = {
  padding: "4px 10px",
  fontSize: 12,
  border: "1px solid #c7d2fe",
  borderRadius: 4,
  background: "#eef2ff",
  color: "#4338ca",
  cursor: "pointer",
  whiteSpace: "nowrap",
};

// ── Clone button — self-contained with loading / success / error state ─────────

function CloneButton({
  wsId,
  onCloned,
}: {
  wsId: number;
  /** Called with the new workspace item id on success */
  onCloned?: (newWsId: number) => void;
}) {
  const [state, setState] = React.useState<
    "idle" | "loading" | "done" | "error"
  >("idle");
  const [errMsg, setErrMsg] = React.useState("");
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset "done" back to "idle" after 3 s so the button is reusable
  React.useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const handleClone = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (state === "loading") return;
    setState("loading");
    setErrMsg("");
    try {
      const newId = await cloneWorkspaceItem(wsId);
      setState("done");
      timerRef.current = setTimeout(() => setState("idle"), 3000);
      onCloned?.(newId);
    } catch (err: any) {
      setErrMsg(err?.message ?? "Clone failed");
      setState("error");
      timerRef.current = setTimeout(() => setState("idle"), 4000);
    }
  };

  const label =
    state === "loading"
      ? "Cloning…"
      : state === "done"
        ? "✓ Cloned"
        : state === "error"
          ? "✗ Error"
          : "⎘ Clone";

  const bg =
    state === "done" ? "#f6ffed" : state === "error" ? "#fff1f0" : "#f9fafb";
  const color =
    state === "done" ? "#389e0d" : state === "error" ? "#cf1322" : "#374151";
  const border =
    state === "done"
      ? "1px solid #b7eb8f"
      : state === "error"
        ? "1px solid #ffa39e"
        : "1px solid #d1d5db";

  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={handleClone}
        disabled={state === "loading"}
        title={state === "error" ? errMsg : `Clone workspace item ws/${wsId}`}
        style={{
          padding: "4px 10px",
          fontSize: 12,
          borderRadius: 4,
          whiteSpace: "nowrap",
          cursor: state === "loading" ? "not-allowed" : "pointer",
          opacity: state === "loading" ? 0.7 : 1,
          border,
          background: bg,
          color,
        }}
      >
        {label}
      </button>
    </span>
  );
}

// ── Pagination bar ─────────────────────────────────────────────────────────────

function Pager({
  page,
  totalPages,
  loading,
  onPrev,
  onNext,
}: {
  page: number;
  totalPages: number;
  loading: boolean;
  onPrev: () => void;
  onNext: () => void;
}) {
  if (totalPages <= 1) return null;
  return (
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
        onClick={onPrev}
        disabled={page === 0 || loading}
        style={{
          padding: "5px 12px",
          border: "1px solid #d1d5db",
          borderRadius: 5,
          background: "#fff",
          cursor: page === 0 ? "not-allowed" : "pointer",
          opacity: page === 0 ? 0.5 : 1,
        }}
      >
        ← Prev
      </button>
      <span>
        Page {page + 1} of {totalPages}
      </span>
      <button
        onClick={onNext}
        disabled={page >= totalPages - 1 || loading}
        style={{
          padding: "5px 12px",
          border: "1px solid #d1d5db",
          borderRadius: 5,
          background: "#fff",
          cursor: page >= totalPages - 1 ? "not-allowed" : "pointer",
          opacity: page >= totalPages - 1 ? 0.5 : 1,
        }}
      >
        Next →
      </button>
    </div>
  );
}

// ── Search / action bar ────────────────────────────────────────────────────────

function SearchBar({
  q,
  setQ,
  onSearch,
  onRefresh,
  loading,
  total,
  placeholder,
}: {
  q: string;
  setQ: (v: string) => void;
  onSearch: () => void;
  onRefresh: () => void;
  loading: boolean;
  total: number;
  placeholder: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        marginBottom: 16,
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >
      {total > 0 && (
        <span
          style={{
            fontSize: 12,
            color: "#888",
            background: "#f1f3f5",
            borderRadius: 10,
            padding: "2px 8px",
          }}
        >
          {total.toLocaleString()} total
        </span>
      )}
      <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
        <div style={{ display: "flex" }}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
            placeholder={placeholder}
            style={{
              padding: "6px 10px",
              fontSize: 13,
              border: "1px solid #d1d5db",
              borderRight: "none",
              borderRadius: "5px 0 0 5px",
              outline: "none",
              width: 220,
            }}
          />
          <button
            onClick={onSearch}
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
          onClick={onRefresh}
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
  );
}

// ── My Submissions panel ───────────────────────────────────────────────────────

type MyProps = {
  onOpenItem?: (uuid: string) => void;
  onOpenWorkspaceItem?: (wsId: number) => void;
};

function MySubmissionsPanel({ onOpenItem, onOpenWorkspaceItem }: MyProps) {
  const [rows, setRows] = React.useState<ParsedWorkspaceRow[]>([]);
  const [totalElements, setTotal] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(0);
  const [page, setPage] = React.useState(0);
  const [q, setQ] = React.useState("");
  const [activeQ, setActiveQ] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(async (p: number, query: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchWorkspace(p, query);
      setRows(res.rows);
      setTotal(res.totalElements);
      setTotalPages(res.totalPages);
    } catch (e: any) {
      setError(e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void load(page, activeQ);
  }, [load, page, activeQ]);

  const search = () => {
    setPage(0);
    setActiveQ(q.trim());
  };

  return (
    <div>
      <SearchBar
        q={q}
        setQ={setQ}
        onSearch={search}
        onRefresh={() => load(page, activeQ)}
        loading={loading}
        total={totalElements}
        placeholder="Search workspace…"
      />

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
                "Title / Handle",
                "Entity Type",
                "DC Type",
                "Status",
                "Last Modified",
                "",
                "",
              ].map((h, i) => (
                <th
                  key={i}
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
            {rows.map((row) => {
              // Archived items → item detail. Workspace items → workspace detail.
              const canViewArchived =
                row.inArchive && !row.isWorkspaceItem && !!row.uuid;
              const canViewWorkspace =
                row.isWorkspaceItem && row.workspaceId != null;
              const isClickable = canViewArchived || canViewWorkspace;

              const handleOpen = () => {
                if (canViewArchived && onOpenItem && row.uuid)
                  onOpenItem(row.uuid);
                else if (
                  canViewWorkspace &&
                  onOpenWorkspaceItem &&
                  row.workspaceId != null
                )
                  onOpenWorkspaceItem(row.workspaceId);
              };

              return (
                <tr
                  key={row.key}
                  style={{
                    borderBottom: "1px solid #f1f3f5",
                    cursor: isClickable ? "pointer" : "default",
                  }}
                  onClick={isClickable ? handleOpen : undefined}
                  onMouseEnter={(e) => {
                    if (isClickable)
                      (e.currentTarget as HTMLElement).style.background =
                        "#f8fafc";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "";
                  }}
                >
                  <td style={{ padding: "9px 12px", maxWidth: 320 }}>
                    <div
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        fontWeight: 500,
                        color: isClickable ? "#2563eb" : "#1a1a2e",
                        textDecoration: isClickable ? "underline" : "none",
                      }}
                      title={row.name}
                    >
                      {row.name}
                    </div>
                    {row.handle && (
                      <div
                        style={{ fontSize: 11, color: "#888", marginTop: 1 }}
                      >
                        {row.handle}
                      </div>
                    )}
                    {row.workspaceId != null && (
                      <div
                        style={{ fontSize: 11, color: "#aaa", marginTop: 1 }}
                      >
                        ws/{row.workspaceId}
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
                    <MyStatusBadge row={row} />
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
                  <td style={{ padding: "9px 12px" }}>
                    {isClickable && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpen();
                        }}
                        style={viewBtn}
                      >
                        View →
                      </button>
                    )}
                  </td>
                  <td style={{ padding: "9px 12px" }}>
                    {row.workspaceId != null && (
                      <CloneButton
                        wsId={row.workspaceId}
                        onCloned={(newId) => onOpenWorkspaceItem?.(newId)}
                      />
                    )}
                  </td>
                </tr>
              );
            })}
            {!loading && rows.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  style={{
                    padding: "20px 12px",
                    color: "#888",
                    textAlign: "center",
                  }}
                >
                  No workspace items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pager
        page={page}
        totalPages={totalPages}
        loading={loading}
        onPrev={() => setPage((p) => p - 1)}
        onNext={() => setPage((p) => p + 1)}
      />
    </div>
  );
}

// ── Submissions by Others panel ────────────────────────────────────────────────

type OtherProps = {
  onOpenWorkspaceItem?: (wsId: number) => void;
  onOpenItem?: (uuid: string) => void;
};

function OtherSubmissionsPanel({
  onOpenWorkspaceItem,
  onOpenItem,
}: OtherProps) {
  const [rows, setRows] = React.useState<ParsedOtherRow[]>([]);
  const [totalElements, setTotal] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(0);
  const [page, setPage] = React.useState(0);
  const [q, setQ] = React.useState("");
  const [activeQ, setActiveQ] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(async (p: number, query: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchOtherWorkspace(p, query);
      setRows(res.rows);
      setTotal(res.totalElements);
      setTotalPages(res.totalPages);
    } catch (e: any) {
      setError(e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void load(page, activeQ);
  }, [load, page, activeQ]);

  const search = () => {
    setPage(0);
    setActiveQ(q.trim());
  };

  const handleOpen = (row: ParsedOtherRow) => {
    if (
      row.rawType === "workspaceitem" &&
      row.workspaceId != null &&
      onOpenWorkspaceItem
    )
      onOpenWorkspaceItem(row.workspaceId);
    else if (row.rawType === "item" && row.uuid && onOpenItem)
      onOpenItem(row.uuid);
  };

  return (
    <div>
      <SearchBar
        q={q}
        setQ={setQ}
        onSearch={search}
        onRefresh={() => load(page, activeQ)}
        loading={loading}
        total={totalElements}
        placeholder="Search submissions…"
      />

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
                "Title / ID",
                "Type",
                "DC Type",
                "Submission Form",
                "Validation",
                "Last Modified",
                "",
                "",
              ].map((h, i) => (
                <th
                  key={i}
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
            {rows.map((row) => {
              const isClickable =
                (row.rawType === "workspaceitem" && row.workspaceId != null) ||
                (row.rawType === "item" && !!row.uuid);
              return (
                <tr
                  key={row.key}
                  style={{
                    borderBottom: "1px solid #f1f3f5",
                    cursor: isClickable ? "pointer" : "default",
                  }}
                  onClick={isClickable ? () => handleOpen(row) : undefined}
                  onMouseEnter={(e) => {
                    if (isClickable)
                      (e.currentTarget as HTMLElement).style.background =
                        "#f8fafc";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "";
                  }}
                >
                  {/* Title / ID */}
                  <td style={{ padding: "9px 12px", maxWidth: 300 }}>
                    <div
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        fontWeight: 500,
                        color: isClickable ? "#2563eb" : "#1a1a2e",
                        textDecoration: isClickable ? "underline" : "none",
                      }}
                      title={row.name}
                    >
                      {row.name}
                    </div>
                    <div style={{ fontSize: 11, color: "#aaa", marginTop: 1 }}>
                      {row.rawType === "workspaceitem" &&
                      row.workspaceId != null
                        ? `ws/${row.workspaceId}`
                        : row.uuid
                          ? `${row.uuid.slice(0, 8)}…`
                          : null}
                    </div>
                  </td>

                  {/* Row type badge */}
                  <td style={{ padding: "9px 12px", whiteSpace: "nowrap" }}>
                    {row.rawType === "workspaceitem" ? (
                      <span style={badgeStyle("#fffbe6", "#ad6800")}>
                        Workspace
                      </span>
                    ) : (
                      <span style={badgeStyle("#f6ffed", "#389e0d")}>Item</span>
                    )}
                  </td>

                  {/* DC Type */}
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

                  {/* Submission form */}
                  <td style={{ padding: "9px 12px", whiteSpace: "nowrap" }}>
                    {row.submissionDefinition ? (
                      <span style={badgeStyle("#eef2ff", "#4338ca")}>
                        {row.submissionDefinition}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>

                  {/* Validation */}
                  <td style={{ padding: "9px 12px" }}>
                    {row.errors.length > 0 ? (
                      <span
                        style={{
                          ...badgeStyle("#fff1f0", "#cf1322"),
                          cursor: "help",
                        }}
                        title={row.errors.join("\n")}
                      >
                        {row.errors.length} error
                        {row.errors.length > 1 ? "s" : ""}
                      </span>
                    ) : row.rawType === "workspaceitem" ? (
                      <span style={badgeStyle("#f6ffed", "#389e0d")}>OK</span>
                    ) : null}
                  </td>

                  {/* Last modified */}
                  <td
                    style={{
                      padding: "9px 12px",
                      whiteSpace: "nowrap",
                      color: "#666",
                    }}
                  >
                    {fmtDate(row.lastModified)}
                  </td>

                  {/* Action */}
                  <td style={{ padding: "9px 12px" }}>
                    {isClickable && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpen(row);
                        }}
                        style={viewBtn}
                      >
                        View →
                      </button>
                    )}
                  </td>
                  {/* Clone */}
                  <td style={{ padding: "9px 12px" }}>
                    {row.workspaceId != null && (
                      <CloneButton
                        wsId={row.workspaceId}
                        onCloned={(newId) => onOpenWorkspaceItem?.(newId)}
                      />
                    )}
                  </td>
                </tr>
              );
            })}
            {!loading && rows.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  style={{
                    padding: "20px 12px",
                    color: "#888",
                    textAlign: "center",
                  }}
                >
                  No submissions by others found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pager
        page={page}
        totalPages={totalPages}
        loading={loading}
        onPrev={() => setPage((p) => p - 1)}
        onNext={() => setPage((p) => p + 1)}
      />
    </div>
  );
}

// ── Main exported page ─────────────────────────────────────────────────────────

type Props = {
  sub?: "mine" | "others";
  onOpenItem?: (uuid: string) => void;
  onOpenWorkspaceItem?: (wsId: number) => void;
};

export function WorkspaceListPage({
  sub = "mine",
  onOpenItem,
  onOpenWorkspaceItem,
}: Props) {
  return (
    <div style={{ padding: "20px 24px", maxWidth: 1100 }}>
      <div style={{ marginBottom: 20 }}>
        <h2
          style={{ margin: 0, fontSize: 20, fontWeight: 600, color: "#1a1a2e" }}
        >
          {sub === "mine" ? "My Submissions" : "Submissions by Others"}
        </h2>
      </div>

      {sub === "mine" ? (
        <MySubmissionsPanel
          onOpenItem={onOpenItem}
          onOpenWorkspaceItem={onOpenWorkspaceItem}
        />
      ) : (
        <OtherSubmissionsPanel
          onOpenItem={onOpenItem}
          onOpenWorkspaceItem={onOpenWorkspaceItem}
        />
      )}
    </div>
  );
}
