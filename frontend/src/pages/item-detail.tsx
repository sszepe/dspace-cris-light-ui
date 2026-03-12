import React from "react";
import { apiFetch } from "../auth/client";
import {
  type ItemDetailResponse,
  type WorkspaceItemDetail,
  type Bitstream,
  type Bundle,
  metaFirst,
  metaAll,
} from "../api/dspace";

// ── API ───────────────────────────────────────────────────────────────────────

async function fetchItem(uuid: string): Promise<ItemDetailResponse> {
  const params = new URLSearchParams();
  params.append("embed", "owningCollection/parentCommunity/parentCommunity");
  params.append("embed", "relationships");
  params.append("embed", "version/versionhistory");
  params.append("embed", "bundles/bitstreams");
  params.append("embed", "thumbnail");
  params.append("embed", "metrics");
  return apiFetch<ItemDetailResponse>(`/api/core/items/${uuid}?${params}`);
}

async function fetchWorkspaceItem(wsId: number): Promise<WorkspaceItemDetail> {
  return apiFetch<WorkspaceItemDetail>(
    `/api/submission/workspaceitems/${wsId}?projection=full&projection=allLanguages`,
  );
}

// ── UI helpers ────────────────────────────────────────────────────────────────

function fmtDate(s?: string | null): string {
  if (!s) return "—";
  const d = new Date(s);
  return isNaN(d.getTime()) ? s : d.toLocaleString();
}

function fmtBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

function MetaRow({
  label,
  value,
  children,
}: {
  label: string;
  value?: string | null;
  children?: React.ReactNode;
}) {
  const content = children ?? value;
  if (!content && value !== undefined) return null;
  return (
    <>
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: "#888",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          paddingTop: 2,
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 13, color: "#333", wordBreak: "break-word" }}>
        {content}
      </div>
    </>
  );
}

function MetaGrid({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "160px 1fr",
        gap: "8px 14px",
        alignItems: "start",
      }}
    >
      {children}
    </div>
  );
}

function Section({
  title,
  defaultOpen = false,
  badge,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  badge?: string | number;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        overflow: "hidden",
      }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 14px",
          background: open ? "#fafafa" : "#fff",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#333" }}>
            {title}
          </span>
          {badge !== undefined && (
            <span
              style={{
                fontSize: 11,
                background: "#e5e7eb",
                color: "#555",
                borderRadius: 10,
                padding: "1px 7px",
                fontWeight: 600,
              }}
            >
              {badge}
            </span>
          )}
        </div>
        <span
          style={{
            fontSize: 12,
            color: "#bbb",
            display: "inline-block",
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 0.15s",
          }}
        >
          ▼
        </span>
      </button>
      {open && (
        <div
          style={{
            padding: "12px 14px 14px",
            borderTop: "1px solid #e5e7eb",
            display: "grid",
            gap: 12,
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

// ── Dublin Core panel ─────────────────────────────────────────────────────────

const DC_FIELDS: Array<{ field: string; label: string; multi?: boolean }> = [
  { field: "dc.title", label: "Title", multi: true },
  { field: "dc.title.alternative", label: "Alt. Title", multi: true },
  { field: "dc.contributor.author", label: "Author", multi: true },
  { field: "dc.contributor.editor", label: "Editor", multi: true },
  { field: "dc.contributor", label: "Contributor", multi: true },
  { field: "dc.creator", label: "Creator", multi: true },
  { field: "dc.date.issued", label: "Date Issued" },
  { field: "dc.date.accessioned", label: "Date Accessioned" },
  { field: "dc.date.available", label: "Date Available" },
  { field: "dc.date.created", label: "Date Created" },
  { field: "dc.description.abstract", label: "Abstract" },
  { field: "dc.description", label: "Description", multi: true },
  { field: "dc.subject", label: "Subject", multi: true },
  { field: "dc.type", label: "Type", multi: true },
  { field: "dc.format", label: "Format", multi: true },
  { field: "dc.language.iso", label: "Language" },
  { field: "dc.language", label: "Language (alt)", multi: true },
  { field: "dc.publisher", label: "Publisher", multi: true },
  { field: "dc.identifier.issn", label: "ISSN" },
  { field: "dc.identifier.isbn", label: "ISBN" },
  { field: "dc.identifier.doi", label: "DOI" },
  { field: "dc.identifier.uri", label: "URI" },
  { field: "dc.identifier", label: "Identifier", multi: true },
  { field: "dc.relation", label: "Relation", multi: true },
  { field: "dc.relation.ispartof", label: "Part Of" },
  { field: "dc.rights", label: "Rights", multi: true },
  { field: "dc.rights.uri", label: "Rights URI" },
  { field: "dc.coverage", label: "Coverage", multi: true },
  { field: "dc.source", label: "Source", multi: true },
];

function DublinCorePanel({ metadata }: { metadata: Record<string, any> }) {
  const rows = DC_FIELDS.flatMap(({ field, label, multi }) => {
    const vals = metaAll(metadata, field);
    if (!vals.length) return [];
    const display = multi ? vals.join(" · ") : vals[0];
    return [{ field, label, display }];
  });

  if (!rows.length) {
    return (
      <p style={{ color: "#aaa", fontSize: 13, margin: 0 }}>
        No Dublin Core metadata found.
      </p>
    );
  }

  return (
    <MetaGrid>
      {rows.map(({ field, label, display }) => (
        <MetaRow key={field} label={label} value={display} />
      ))}
    </MetaGrid>
  );
}

// ── Other metadata panel ──────────────────────────────────────────────────────

function OtherMetadataPanel({ metadata }: { metadata: Record<string, any> }) {
  const grouped: Record<string, Array<[string, string[]]>> = {};

  for (const [field, vals] of Object.entries(metadata)) {
    if (field.startsWith("dc.")) continue;
    const prefix = field.split(".")[0];
    if (!grouped[prefix]) grouped[prefix] = [];
    const values = (vals as Array<{ value: string }>).map((v) => v.value);
    grouped[prefix].push([field, values]);
  }

  const prefixes = Object.keys(grouped).sort();
  if (!prefixes.length) return null;

  return (
    <Section title="Other metadata" defaultOpen={false}>
      <div style={{ display: "grid", gap: 16 }}>
        {prefixes.map((prefix) => (
          <div key={prefix}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#6366f1",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: 8,
                borderBottom: "1px solid #e5e7eb",
                paddingBottom: 4,
              }}
            >
              {prefix}.*
            </div>
            <MetaGrid>
              {grouped[prefix].map(([field, values]) => (
                <MetaRow key={field} label={field}>
                  {values.length === 1 ? (
                    values[0]
                  ) : (
                    <ul style={{ margin: 0, paddingLeft: 16 }}>
                      {values.map((v, i) => (
                        <li key={i} style={{ marginBottom: 2 }}>
                          {v}
                        </li>
                      ))}
                    </ul>
                  )}
                </MetaRow>
              ))}
            </MetaGrid>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ── Bitstreams / files ────────────────────────────────────────────────────────

function BitstreamRow({ bs }: { bs: Bitstream }) {
  const downloadUrl = (bs._links?.content as any)?.href;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 0",
        borderBottom: "1px solid #f3f4f6",
      }}
    >
      <span style={{ fontSize: 20, flexShrink: 0 }}>📄</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontWeight: 500,
            fontSize: 13,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {bs.name ?? "(unnamed)"}
        </div>
        <div style={{ fontSize: 11, color: "#888", marginTop: 1 }}>
          {fmtBytes(bs.sizeBytes)}
          {bs.checkSum?.value && (
            <span style={{ marginLeft: 8, fontFamily: "monospace" }}>
              {bs.checkSum.checkSumAlgorithm}: {bs.checkSum.value.slice(0, 12)}…
            </span>
          )}
        </div>
        {bs.description && (
          <div style={{ fontSize: 11, color: "#666", marginTop: 1 }}>
            {bs.description}
          </div>
        )}
      </div>
      {downloadUrl && (
        <a
          href={downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          style={{
            padding: "4px 10px",
            fontSize: 12,
            border: "1px solid #d1d5db",
            borderRadius: 5,
            background: "#f9fafb",
            color: "#374151",
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          ↓ Download
        </a>
      )}
    </div>
  );
}

function BundlesPanel({ bundles }: { bundles: Bundle[] }) {
  const withFiles = bundles.filter(
    (b) => (b._embedded?.bitstreams?._embedded?.bitstreams ?? []).length > 0,
  );
  if (!withFiles.length) {
    return (
      <p style={{ color: "#aaa", fontSize: 13, margin: 0 }}>
        No files attached to this item.
      </p>
    );
  }
  return (
    <div style={{ display: "grid", gap: 16 }}>
      {withFiles.map((bundle) => {
        const bitstreams =
          bundle._embedded?.bitstreams?._embedded?.bitstreams ?? [];
        return (
          <div key={bundle.id}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#888",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: 6,
              }}
            >
              Bundle: {bundle.name}
            </div>
            {bitstreams.map((bs) => (
              <BitstreamRow key={bs.id} bs={bs} />
            ))}
          </div>
        );
      })}
    </div>
  );
}

// ── Provenance breadcrumb ─────────────────────────────────────────────────────

function ProvenancePanel({ item }: { item: ItemDetailResponse }) {
  const col = item._embedded?.owningCollection;
  const parentCom = col?._embedded?.parentCommunity;
  const grandCom = parentCom?._embedded?.parentCommunity;
  const crumbs = [grandCom, parentCom, col].filter(Boolean);
  if (!crumbs.length) return null;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 4,
        fontSize: 12,
        color: "#888",
      }}
    >
      {crumbs.map((node, i) => (
        <React.Fragment key={(node as any).id ?? i}>
          {i > 0 && <span style={{ color: "#ccc" }}>›</span>}
          <span style={{ color: "#555" }}>{(node as any).name}</span>
        </React.Fragment>
      ))}
    </div>
  );
}

// ── Status badges ─────────────────────────────────────────────────────────────

function ItemStatusBadge({ item }: { item: ItemDetailResponse }) {
  if (item.withdrawn)
    return (
      <span
        style={{
          fontSize: 12,
          fontWeight: 600,
          padding: "2px 8px",
          borderRadius: 4,
          background: "#fff1f0",
          color: "#cf1322",
          border: "1px solid #ffa39e",
        }}
      >
        Withdrawn
      </span>
    );
  if (item.inArchive)
    return (
      <span
        style={{
          fontSize: 12,
          fontWeight: 600,
          padding: "2px 8px",
          borderRadius: 4,
          background: "#f6ffed",
          color: "#389e0d",
          border: "1px solid #b7eb8f",
        }}
      >
        Archived
      </span>
    );
  return (
    <span
      style={{
        fontSize: 12,
        fontWeight: 600,
        padding: "2px 8px",
        borderRadius: 4,
        background: "#fffbe6",
        color: "#ad6800",
        border: "1px solid #ffe58f",
      }}
    >
      Draft
    </span>
  );
}

// ── Workspace info banner ─────────────────────────────────────────────────────

function WorkspaceInfoPanel({ ws }: { ws: WorkspaceItemDetail }) {
  const errors: any[] = (ws as any).errors ?? [];
  return (
    <div
      style={{
        padding: "10px 14px",
        background: "#fffbe6",
        border: "1px solid #ffe58f",
        borderRadius: 8,
        fontSize: 13,
        display: "flex",
        gap: 16,
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >
      <span style={{ fontWeight: 600, color: "#ad6800" }}>⚠ In Submission</span>
      <span style={{ color: "#666" }}>Workspace ID: {ws.id}</span>
      <span style={{ color: "#666" }}>
        Last modified: {fmtDate(ws.lastModified)}
      </span>
      {ws._embedded?.collection?.name && (
        <span style={{ color: "#666" }}>
          Collection: {ws._embedded.collection.name}
        </span>
      )}
      {errors.length > 0 && (
        <span
          style={{ fontWeight: 600, color: "#cf1322" }}
          title={errors.map((e: any) => e.message).join("\n")}
        >
          {errors.length} validation error{errors.length > 1 ? "s" : ""}
        </span>
      )}
    </div>
  );
}

// ── Workspace-only metadata view ──────────────────────────────────────────────
// Used when the underlying item is not yet accessible via /api/core/items (still in submission).
// Reads metadata from ws.sections — each section value is a map of field → MetaValue[].

function WsSectionsPanel({ ws }: { ws: WorkspaceItemDetail }) {
  const sections = ws.sections ?? {};

  // Collect all dc.* values across all sections into one flat metadata map
  const dcMeta: Record<string, Array<{ value: string }>> = {};
  const otherMeta: Record<string, Array<{ value: string }>> = {};

  for (const sectionData of Object.values(sections)) {
    if (!sectionData || typeof sectionData !== "object") continue;
    for (const [field, vals] of Object.entries(
      sectionData as Record<string, any>,
    )) {
      if (!Array.isArray(vals)) continue;
      const target = field.startsWith("dc.") ? dcMeta : otherMeta;
      if (!target[field]) target[field] = [];
      target[field].push(...(vals as Array<{ value: string }>));
    }
  }

  const hasDc = Object.keys(dcMeta).length > 0;
  const hasOther = Object.keys(otherMeta).length > 0;

  return (
    <>
      <Section title="Dublin Core" defaultOpen>
        {hasDc ? (
          <DublinCorePanel metadata={dcMeta} />
        ) : (
          <p style={{ color: "#aaa", fontSize: 13, margin: 0 }}>
            No Dublin Core metadata yet.
          </p>
        )}
      </Section>
      {hasOther && (
        <Section title="Other metadata" defaultOpen={false}>
          <MetaGrid>
            {Object.entries(otherMeta).map(([field, vals]) => (
              <MetaRow key={field} label={field}>
                {vals.length === 1 ? (
                  vals[0].value
                ) : (
                  <ul style={{ margin: 0, paddingLeft: 16 }}>
                    {vals.map((v, i) => (
                      <li key={i} style={{ marginBottom: 2 }}>
                        {v.value}
                      </li>
                    ))}
                  </ul>
                )}
              </MetaRow>
            ))}
          </MetaGrid>
        </Section>
      )}
      {/* Uploaded files from uploadOptional section */}
      {(() => {
        const uploadFiles: any[] =
          sections?.uploadOptional?.files ?? sections?.upload?.files ?? [];
        if (!uploadFiles.length) return null;
        return (
          <Section title="Files" defaultOpen badge={uploadFiles.length}>
            <div style={{ display: "grid", gap: 8 }}>
              {uploadFiles.map((f: any, i: number) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "8px 0",
                    borderBottom: "1px solid #f3f4f6",
                  }}
                >
                  <span style={{ fontSize: 20 }}>📄</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, fontSize: 13 }}>
                      {f.metadata?.["dc.title"]?.[0]?.value ??
                        f.uuid ??
                        "(unnamed)"}
                    </div>
                    {f.sizeBytes != null && (
                      <div
                        style={{ fontSize: 11, color: "#888", marginTop: 1 }}
                      >
                        {fmtBytes(f.sizeBytes)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        );
      })()}
    </>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

type Props =
  | { mode: "item"; uuid: string; onBack?: () => void }
  | { mode: "workspace"; wsId: number; onBack?: () => void };

export function ItemDetailPage(props: Props) {
  const [item, setItem] = React.useState<ItemDetailResponse | null>(null);
  const [wsDetail, setWsDetail] = React.useState<WorkspaceItemDetail | null>(
    null,
  );
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [showJson, setShowJson] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setItem(null);
    setWsDetail(null);

    (async () => {
      try {
        if (props.mode === "item") {
          // ── Archived / regular item by UUID ──────────────────────────────
          const data = await fetchItem(props.uuid);
          if (!cancelled) setItem(data);
        } else {
          // ── Workspace item by numeric ID ──────────────────────────────────
          const ws = await fetchWorkspaceItem(props.wsId);
          if (!cancelled) setWsDetail(ws);

          // Try to also fetch the full item (may 403/404 if not yet archived)
          const itemUuid = ws._embedded?.item?.uuid;
          if (itemUuid) {
            const fullItem = await fetchItem(itemUuid).catch(() => null);
            if (!cancelled) {
              // Only set if we actually got a useful response
              if (fullItem?.uuid) setItem(fullItem);
              // else leave item null — we'll render from wsDetail.sections
            }
          }
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.mode, (props as any).uuid, (props as any).wsId]);

  // ── Loading / error ───────────────────────────────────────────────────────

  if (loading) {
    return (
      <div style={{ padding: "40px 24px", color: "#888", fontSize: 14 }}>
        Loading…
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "20px 24px" }}>
        {props.onBack && (
          <button
            onClick={props.onBack}
            style={{
              marginBottom: 12,
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
        <div
          style={{
            padding: "12px 14px",
            background: "#fff1f0",
            border: "1px solid #ffa39e",
            borderRadius: 6,
            color: "#cf1322",
            fontSize: 13,
          }}
        >
          {error}
        </div>
      </div>
    );
  }

  // ── Workspace-item-only view (item not yet accessible in /api/core) ───────
  // Render directly from wsDetail.sections without needing a full Item object.
  if (props.mode === "workspace" && wsDetail && !item) {
    const wsItem = wsDetail._embedded?.item;
    const title =
      wsItem?.name ??
      wsItem?.metadata?.["dc.title"]?.[0]?.value ??
      `Workspace Item #${wsDetail.id}`;

    return (
      <div style={{ padding: "20px 24px", maxWidth: 900 }}>
        {/* Top bar */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
            marginBottom: 20,
            flexWrap: "wrap",
          }}
        >
          {props.onBack && (
            <button
              onClick={props.onBack}
              style={{
                padding: "6px 12px",
                fontSize: 13,
                border: "1px solid #d1d5db",
                borderRadius: 5,
                background: "#f9fafb",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              ← Back
            </button>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                flexWrap: "wrap",
                marginBottom: 4,
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  padding: "2px 8px",
                  borderRadius: 4,
                  background: "#fffbe6",
                  color: "#ad6800",
                  border: "1px solid #ffe58f",
                }}
              >
                In Submission
              </span>
            </div>
            <h2
              style={{
                margin: 0,
                fontSize: 20,
                fontWeight: 700,
                color: "#1a1a2e",
                lineHeight: 1.3,
              }}
            >
              {title}
            </h2>
          </div>
          <button
            onClick={() => setShowJson((v) => !v)}
            style={{
              padding: "6px 12px",
              fontSize: 12,
              border: "1px solid #d1d5db",
              borderRadius: 5,
              background: "#f9fafb",
              cursor: "pointer",
              color: "#555",
              flexShrink: 0,
            }}
          >
            {showJson ? "Hide JSON" : "{ } JSON"}
          </button>
        </div>

        <div style={{ display: "grid", gap: 12 }}>
          {/* Workspace banner */}
          <WorkspaceInfoPanel ws={wsDetail} />

          {/* Identity card */}
          <div
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              padding: "12px 14px",
            }}
          >
            <MetaGrid>
              <MetaRow label="Workspace ID" value={String(wsDetail.id)} />
              {wsItem?.uuid && (
                <MetaRow label="Item UUID" value={wsItem.uuid} />
              )}
              <MetaRow
                label="Submission form"
                value={wsDetail._embedded?.submissionDefinition?.name ?? null}
              />
              <MetaRow
                label="Last modified"
                value={fmtDate(wsDetail.lastModified)}
              />
              {wsDetail._embedded?.collection?.name && (
                <MetaRow
                  label="Collection"
                  value={wsDetail._embedded.collection.name}
                />
              )}
            </MetaGrid>
          </div>

          {/* Section metadata */}
          <WsSectionsPanel ws={wsDetail} />

          {/* Raw JSON */}
          {showJson && (
            <Section title="Raw JSON" defaultOpen>
              <pre
                style={{
                  fontSize: 11,
                  background: "#f8fafc",
                  border: "1px solid #e5e7eb",
                  borderRadius: 6,
                  padding: 12,
                  overflow: "auto",
                  maxHeight: 500,
                  margin: 0,
                }}
              >
                {JSON.stringify(wsDetail, null, 2)}
              </pre>
            </Section>
          )}
        </div>
      </div>
    );
  }

  // ── Full archived-item view (also used when workspace item fetch succeeded AND item is accessible) ──

  if (!item) return null;

  const meta = item.metadata ?? {};
  const title = item.name ?? metaFirst(meta, "dc.title") ?? "(untitled)";
  const entityType =
    (item as any).entityType ?? metaFirst(meta, "dspace.entity.type");
  const bundles: Bundle[] = item._embedded?.bundles?._embedded?.bundles ?? [];
  const totalBitstreams = bundles.reduce(
    (acc, b) =>
      acc + (b._embedded?.bitstreams?._embedded?.bitstreams?.length ?? 0),
    0,
  );
  const thumbnailUrl =
    item._embedded?.thumbnail?._links?.["content"]?.href ?? null;

  return (
    <div style={{ padding: "20px 24px", maxWidth: 900 }}>
      {/* Top bar */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
          marginBottom: 20,
          flexWrap: "wrap",
        }}
      >
        {props.onBack && (
          <button
            onClick={props.onBack}
            style={{
              padding: "6px 12px",
              fontSize: 13,
              border: "1px solid #d1d5db",
              borderRadius: 5,
              background: "#f9fafb",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            ← Back
          </button>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
              marginBottom: 4,
            }}
          >
            <ItemStatusBadge item={item} />
            {entityType && (
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  padding: "2px 8px",
                  borderRadius: 4,
                  background: "#eef2ff",
                  color: "#4338ca",
                  border: "1px solid #c7d2fe",
                }}
              >
                {entityType}
              </span>
            )}
            {item.handle && (
              <code style={{ fontSize: 11, color: "#888" }}>{item.handle}</code>
            )}
          </div>
          <h2
            style={{
              margin: 0,
              fontSize: 20,
              fontWeight: 700,
              color: "#1a1a2e",
              lineHeight: 1.3,
            }}
          >
            {title}
          </h2>
          <ProvenancePanel item={item} />
        </div>
        <button
          onClick={() => setShowJson((v) => !v)}
          style={{
            padding: "6px 12px",
            fontSize: 12,
            border: "1px solid #d1d5db",
            borderRadius: 5,
            background: "#f9fafb",
            cursor: "pointer",
            color: "#555",
            flexShrink: 0,
          }}
        >
          {showJson ? "Hide JSON" : "{ } JSON"}
        </button>
      </div>

      {/* Workspace banner (when reached via workspace item route but item IS accessible) */}
      {wsDetail && <WorkspaceInfoPanel ws={wsDetail} />}

      <div style={{ display: "grid", gap: 12, marginTop: wsDetail ? 12 : 0 }}>
        {/* Identity card */}
        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            padding: "12px 14px",
            display: "flex",
            gap: 16,
            alignItems: "flex-start",
          }}
        >
          {thumbnailUrl && (
            <img
              src={thumbnailUrl}
              alt="Thumbnail"
              style={{
                width: 80,
                height: 80,
                objectFit: "cover",
                borderRadius: 6,
                border: "1px solid #e5e7eb",
                flexShrink: 0,
              }}
            />
          )}
          <MetaGrid>
            <MetaRow label="UUID" value={item.uuid} />
            <MetaRow label="Handle" value={item.handle} />
            <MetaRow label="Entity type" value={entityType} />
            <MetaRow label="Last modified" value={fmtDate(item.lastModified)} />
            {metaFirst(meta, "dc.date.issued") && (
              <MetaRow
                label="Date issued"
                value={metaFirst(meta, "dc.date.issued")}
              />
            )}
          </MetaGrid>
        </div>

        <Section title="Dublin Core" defaultOpen>
          <DublinCorePanel metadata={meta} />
        </Section>

        <OtherMetadataPanel metadata={meta} />

        <Section
          title="Files"
          defaultOpen={totalBitstreams > 0}
          badge={totalBitstreams || undefined}
        >
          <BundlesPanel bundles={bundles} />
        </Section>

        {showJson && (
          <Section title="Raw JSON" defaultOpen>
            <pre
              style={{
                fontSize: 11,
                background: "#f8fafc",
                border: "1px solid #e5e7eb",
                borderRadius: 6,
                padding: 12,
                overflow: "auto",
                maxHeight: 500,
                margin: 0,
              }}
            >
              {JSON.stringify(item, null, 2)}
            </pre>
          </Section>
        )}
      </div>
    </div>
  );
}
