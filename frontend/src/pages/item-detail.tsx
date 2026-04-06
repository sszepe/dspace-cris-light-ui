import React from "react";
import { apiFetch } from "../auth/client";
import {
  type ItemDetailResponse,
  type WorkspaceItemDetail,
  type Bitstream,
  type Bundle,
  type MetaValue,
  type Metadata,
  metaFirst,
  // metaAll,
  metaAllFull,
} from "../api/dspace";
import { routes } from "../navigation/hash";
import {
  // isAuthorityControlledField,
  AUTHORITY_FIELDS_BY_NAME,
} from "../config/authority-relations";
import { getFieldLabel } from "../config/field-labels";
// import { SkosEditDialog, type SkosTarget, type SkosEntityType } from "../components/skos-edit-dialog";
import { SkosEditDialog, type SkosEntityType } from "../components/skos-edit-dialog";
import ArchivalResourceModal from "../components/archival-resource-modal";
import { BitstreamUploadPanel } from "../components/bitstream-upload-panel";

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
  const params = new URLSearchParams();
  params.append("embed", "item");
  params.append("embed", "collection");
  params.append("embed", "submissionDefinition");
  return apiFetch<WorkspaceItemDetail>(
    `/api/submission/workspaceitems/${wsId}?${params}`,
  );
}

// ── Authority / UUID helpers ──────────────────────────────────────────────────

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Returns the SKOS entity type if the item is a ConceptScheme or Concept, else null. */
function getSkosEntityType(entityType: string | null | undefined): SkosEntityType | null {
  if (!entityType) return null;
  const et = entityType.toLowerCase();
  if (et === "conceptscheme") return "ConceptScheme";
  if (et === "concept") return "Concept";
  return null;
}

/** Returns true when the entity type is ArchivalResource. */
function isArchivalResource(entityType: string | null | undefined): boolean {
  return entityType?.toLowerCase() === "archivalresource";
}

/** True when the string looks like a DSpace item UUID. */
function isItemUuid(s: string | null | undefined): s is string {
  return !!s && UUID_RE.test(s);
}

/**
 * Returns true when a metadata field is authority-controlled AND its plugin
 * resolves to DSpace items (not external vocabs / places / countries etc.).
 * We use the plugin name as the heuristic: plugins ending in "Authority" that
 * are NOT place / country / vocabulary / eperson / group / ZDB authorities.
 */
const NON_ITEM_PLUGINS = new Set([
  "PlaceAuthority",
  "CityPlaceAuthority",
  "CountryPlaceAuthority",
  "ActiveCountryPlaceAuthority",
  "EPersonAuthority",
  "GroupAuthority",
  "ZDBAuthority",
  "SherpaAuthority",
  "ControlledVocabularyAuthority",
  "oefos-kunstzweige",
  "ConceptIveMusicGenreAuthority",
  "ConceptIveCommunitiesAuthority",
  "ConceptIveInstrumentsAuthority",
  "ConceptIveEnsemblesAuthority",
  "ConceptIveTextTypeAuthority",
  "ConceptIveDanceTermsAuthority",
  "ConceptIveReligionAuthority",
  "ConceptIveRegionAuthority",
  "ConceptIveAnalyticalParamsAuthority",
  "ConceptIveResearchAuthority",
  "ConceptIveCultureTermsAuthority",
  "ConceptIveCultureRegionAuthority",
  "ConceptIveEpocheAuthority",
  "ConceptIveJobAuthority",
  "ConceptIveAVMediaAuthority",
  "ConceptIveDailyLifeAuthority",
  "ConceptIveLanguageAuthority",
  "ConceptSchemeAuthority",
  "ConceptAuthority",
  "ConceptHscrtAuthority",
]);

function isItemLinkField(field: string): boolean {
  const configs = AUTHORITY_FIELDS_BY_NAME[field];
  if (!configs?.length) return false;
  return configs.some((c) => !NON_ITEM_PLUGINS.has(c.plugin));
}

// ── Hierarchy config ──────────────────────────────────────────────────────────

/**
 * Defines how to detect and traverse the parent chain for each entity type.
 * parentField: the metadata field that holds the parent authority UUID.
 * entityTypes: dspace.entity.type values this config applies to.
 * sectionTitle: label for the collapsible section.
 * typeField: optional metadata field to show as a subtitle (e.g. type_uri equivalent).
 */
type HierarchyConfig = {
  entityTypes: string[];
  parentField: string;
  sectionTitle: string;
  typeField?: string;
};

const HIERARCHY_CONFIGS: HierarchyConfig[] = [
  {
    entityTypes: ["Funding"],
    parentField: "oairecerif.fundingParent",
    sectionTitle: "Funding Hierarchy",
    typeField: "dc.type",
  },
  {
    entityTypes: ["OrgUnit"],
    parentField: "organization.parentOrganization",
    sectionTitle: "OrgUnit Hierarchy",
    typeField: "dc.type",
  },
  {
    entityTypes: ["Place"],
    parentField: "mdwrepo.place.parentPlace",
    sectionTitle: "Place Hierarchy",
    typeField: "mdwrepo.place.featureCode",
  },
  {
    entityTypes: ["ArchivalResource"],
    parentField: "mdwrepo.archivalresource.parent",
    sectionTitle: "Archival Resource Hierarchy",
    typeField: "dc.type",
  },
];

function getHierarchyConfig(entityType: string | null | undefined): HierarchyConfig | null {
  if (!entityType) return null;
  return HIERARCHY_CONFIGS.find((c) =>
    c.entityTypes.some((t) => t.toLowerCase() === entityType.toLowerCase()),
  ) ?? null;
}

// ── HierarchyNode ─────────────────────────────────────────────────────────────

type HierarchyNode = {
  uuid: string;
  name: string;
  subtitle?: string;
  isCurrent: boolean;
};

async function fetchHierarchyChain(
  itemUuid: string,
  parentField: string,
  typeField?: string,
  maxDepth = 12,
): Promise<HierarchyNode[]> {
  const chain: HierarchyNode[] = [];
  const seen = new Set<string>();
  let currentUuid: string | null = itemUuid;
  let isCurrent = true;

  while (currentUuid && !seen.has(currentUuid) && chain.length < maxDepth) {
    seen.add(currentUuid);
    let item: ItemDetailResponse | null = null;
    try {
      item = await fetchItem(currentUuid);
    } catch {
      break;
    }

    const meta = item.metadata ?? {};
    const name = item.name ?? metaFirst(meta, "dc.title") ?? "(untitled)";
    const subtitle = typeField ? (metaFirst(meta, typeField) ?? undefined) : undefined;

    chain.unshift({ uuid: currentUuid, name, subtitle, isCurrent });
    isCurrent = false;

    // Follow parent link
    const parentVals = meta[parentField] ?? [];
    const parentMv = parentVals.find((v: MetaValue) => isItemUuid(v.authority));
    currentUuid = parentMv?.authority ?? null;
  }

  return chain;
}

// ── HierarchyPanel ────────────────────────────────────────────────────────────

function HierarchyPanel({
  item,
  entityType,
}: {
  item: ItemDetailResponse;
  entityType: string | null | undefined;
}) {
  const config = getHierarchyConfig(entityType);
  const [chain, setChain] = React.useState<HierarchyNode[] | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [opened, setOpened] = React.useState(false);

  // Only fetch when the section is opened for the first time
  const handleOpen = React.useCallback(() => {
    if (opened) return;
    setOpened(true);
    if (!config) return;
    setLoading(true);
    fetchHierarchyChain(item.uuid, config.parentField, config.typeField)
      .then(setChain)
      .catch((e: any) => setError(e?.message ?? "Failed to load hierarchy"))
      .finally(() => setLoading(false));
  }, [opened, config, item.uuid]);

  if (!config) return null;

  // Check whether the item actually has a parent field value (authority UUID)
  const meta = item.metadata ?? {};
  const parentVals = meta[config.parentField] ?? [];
  const hasParent = parentVals.some((v: MetaValue) => isItemUuid(v.authority));
  if (!hasParent) return null;

  return (
    <LazySection
      title={config.sectionTitle}
      onOpen={handleOpen}
      defaultOpen={false}
    >
      {loading && (
        <div style={{ color: "#9ca3af", fontSize: 13 }}>Loading hierarchy…</div>
      )}
      {error && (
        <div style={{ color: "#b91c1c", fontSize: 13 }}>{error}</div>
      )}
      {chain && chain.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {chain.map((node, i) => {
            const isLast = i === chain.length - 1;
            const indent = i * 20;
            return (
              <div
                key={node.uuid}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 8,
                  paddingLeft: indent,
                  paddingTop: i === 0 ? 0 : 6,
                  paddingBottom: isLast ? 0 : 6,
                  borderBottom: isLast ? "none" : "1px solid #f3f4f6",
                  position: "relative",
                }}
              >
                {/* Connector line */}
                {i > 0 && (
                  <div
                    style={{
                      position: "absolute",
                      left: indent - 10,
                      top: 0,
                      bottom: isLast ? "50%" : 0,
                      width: 1,
                      background: "#d1d5db",
                    }}
                  />
                )}
                {i > 0 && (
                  <div
                    style={{
                      position: "absolute",
                      left: indent - 10,
                      top: "50%",
                      width: 10,
                      height: 1,
                      background: "#d1d5db",
                    }}
                  />
                )}

                {/* Node content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  {node.isCurrent ? (
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#1a1a2e",
                      }}
                    >
                      {node.name}
                      <span
                        style={{
                          marginLeft: 6,
                          fontSize: 11,
                          fontWeight: 500,
                          padding: "1px 6px",
                          borderRadius: 4,
                          background: "#eef2ff",
                          color: "#4338ca",
                        }}
                      >
                        current
                      </span>
                    </span>
                  ) : (
                    <a
                      href={routes.item(node.uuid)}
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: "#2563eb",
                        textDecoration: "underline",
                      }}
                    >
                      {node.name}
                    </a>
                  )}
                  {node.subtitle && (
                    <span
                      style={{
                        marginLeft: 8,
                        fontSize: 11,
                        color: "#9ca3af",
                      }}
                    >
                      {node.subtitle}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </LazySection>
  );
}

// ── LazySection ───────────────────────────────────────────────────────────────
// Like Section but fires onOpen callback the first time it's expanded.

function LazySection({
  title,
  defaultOpen = false,
  badge,
  onOpen,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  badge?: string | number;
  onOpen?: () => void;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(defaultOpen);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next) onOpen?.();
  };

  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        overflow: "hidden",
      }}
    >
      <button
        onClick={toggle}
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

// ── MetaValueChip ─────────────────────────────────────────────────────────────
// Renders a single MetaValue. When the field is item-link and the authority is
// a UUID, renders a clickable link to the item detail page.
// In workspace mode, links are suppressed (the target may not be archived).

function MetaValueChip({
  mv,
  field,
  mode,
}: {
  mv: MetaValue;
  field: string;
  mode: "item" | "workspace";
}) {
  const canLink =
    mode === "item" &&
    isItemLinkField(field) &&
    isItemUuid(mv.authority);

  if (canLink) {
    return (
      <a
        href={routes.item(mv.authority!)}
        style={{
          color: "#2563eb",
          textDecoration: "underline",
          fontSize: "inherit",
          cursor: "pointer",
        }}
        title={`View item ${mv.authority}`}
      >
        {mv.value}
      </a>
    );
  }

  return <>{mv.value}</>;
}

// ── MetaValueList ─────────────────────────────────────────────────────────────
// Renders one or more MetaValues for a single field.

function MetaValueList({
  values,
  field,
  mode,
}: {
  values: MetaValue[];
  field: string;
  mode: "item" | "workspace";
}) {
  if (values.length === 0) return null;
  if (values.length === 1) {
    return (
      <MetaValueChip mv={values[0]} field={field} mode={mode} />
    );
  }
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 8px" }}>
      {values.map((mv, i) => (
        <span
          key={i}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 3,
          }}
        >
          {i > 0 && (
            <span style={{ color: "#ccc", userSelect: "none" }}>·</span>
          )}
          <MetaValueChip mv={mv} field={field} mode={mode} />
        </span>
      ))}
    </div>
  );
}

// ── MetaRow ───────────────────────────────────────────────────────────────────

function MetaRow({
  label,
  value,
  title,
  children,
}: {
  label: string;
  value?: string | null;
  title?: string;
  children?: React.ReactNode;
}) {
  const content = children ?? value;
  if (!content && value !== undefined) return null;
  return (
    <>
      <div
        title={title}
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: "#888",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          paddingTop: 2,
          cursor: title ? "help" : undefined,
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

// ── Upload step detection ─────────────────────────────────────────────────────

/**
 * Returns true when the workspace item's submissionDefinition contains at
 * least one step of type "upload" — meaning file attachments are supported
 * for this submission process.
 */
function hasUploadStep(ws: WorkspaceItemDetail): boolean {
  const steps: any[] =
    ws._embedded?.submissionDefinition?.steps ??
    ws._embedded?.submissionDefinition?._embedded?.steps ??
    [];
  return steps.some(
    (s: any) =>
      s.type === "upload" ||
      (s.processingClass ?? "").toLowerCase().includes("uploadstep"),
  );
}


const DC_FIELDS: Array<{ field: string; label: string }> = [
  { field: "dc.title", label: "Title" },
  { field: "dc.title.alternative", label: "Alt. Title" },
  { field: "dc.contributor.author", label: "Author" },
  { field: "dc.contributor.editor", label: "Editor" },
  { field: "dc.contributor", label: "Contributor" },
  { field: "dc.creator", label: "Creator" },
  { field: "dc.date.issued", label: "Date Issued" },
  { field: "dc.date.accessioned", label: "Date Accessioned" },
  { field: "dc.date.available", label: "Date Available" },
  { field: "dc.date.created", label: "Date Created" },
  { field: "dc.description.abstract", label: "Abstract" },
  { field: "dc.description", label: "Description" },
  { field: "dc.subject", label: "Subject" },
  { field: "dc.type", label: "Type" },
  { field: "dc.format", label: "Format" },
  { field: "dc.language.iso", label: "Language" },
  { field: "dc.language", label: "Language (alt)" },
  { field: "dc.publisher", label: "Publisher" },
  { field: "dc.identifier.issn", label: "ISSN" },
  { field: "dc.identifier.isbn", label: "ISBN" },
  { field: "dc.identifier.doi", label: "DOI" },
  { field: "dc.identifier.uri", label: "URI" },
  { field: "dc.identifier", label: "Identifier" },
  { field: "dc.relation", label: "Relation" },
  { field: "dc.relation.ispartof", label: "Part Of" },
  { field: "dc.relation.product", label: "Product" },
  { field: "dc.relation.publication", label: "Publication" },
  { field: "dc.relation.project", label: "Project" },
  { field: "dc.relation.funding", label: "Funding" },
  { field: "dc.relation.equipment", label: "Equipment" },
  { field: "dc.relation.event", label: "Event" },
  { field: "dc.relation.conference", label: "Conference" },
  { field: "dc.relation.work", label: "Work" },
  { field: "dc.relation.orgunit", label: "OrgUnit" },
  { field: "dc.relation.place", label: "Place" },
  { field: "dc.relation.references", label: "References" },
  { field: "dc.rights", label: "Rights" },
  { field: "dc.rights.uri", label: "Rights URI" },
  { field: "dc.coverage", label: "Coverage" },
  { field: "dc.source", label: "Source" },
];

function DublinCorePanel({
  metadata,
  mode,
}: {
  metadata: Record<string, any>;
  mode: "item" | "workspace";
}) {
  // Collect known DC fields in order, then append any dc.* fields not in the list
  const knownFields = new Set(DC_FIELDS.map((f) => f.field));
  const extraDcFields = Object.keys(metadata)
    .filter((f) => f.startsWith("dc.") && !knownFields.has(f))
    .map((field) => ({ field, label: getFieldLabel(field) }));

  const allFields = [...DC_FIELDS, ...extraDcFields];

  const rows = allFields.flatMap(({ field, label }) => {
    const vals = metaAllFull(metadata as Metadata, field);
    if (!vals.length) return [];
    return [{ field, label, vals }];
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
      {rows.map(({ field, label, vals }) => (
        <MetaRow key={field} label={label} title={field}>
          <MetaValueList values={vals} field={field} mode={mode} />
        </MetaRow>
      ))}
    </MetaGrid>
  );
}

// ── Other metadata panel ──────────────────────────────────────────────────────

function OtherMetadataPanel({
  metadata,
  mode,
}: {
  metadata: Record<string, any>;
  mode: "item" | "workspace";
}) {
  const grouped: Record<string, Array<{ field: string; vals: MetaValue[] }>> =
    {};

  for (const [field, rawVals] of Object.entries(metadata)) {
    if (field.startsWith("dc.")) continue;
    const prefix = field.split(".")[0];
    if (!grouped[prefix]) grouped[prefix] = [];
    const vals = (rawVals as MetaValue[]) ?? [];
    grouped[prefix].push({ field, vals });
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
              {grouped[prefix].map(({ field, vals }) => (
                <MetaRow key={field} label={getFieldLabel(field)} title={field}>
                  <MetaValueList values={vals} field={field} mode={mode} />
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

// ── Detect-duplicate panel ────────────────────────────────────────────────────

function DetectDuplicatePanel({ data }: { data: Record<string, any> }) {
  const matches = data?.matches ?? {};
  const entries = Object.entries(matches) as [string, any][];
  if (!entries.length) return null;

  return (
    <div
      style={{
        border: "1px solid #fecaca",
        borderRadius: 8,
        background: "#fff7f7",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "8px 12px",
          background: "#fef2f2",
          borderBottom: "1px solid #fecaca",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 700, color: "#b91c1c" }}>
          ⚠ Potential Duplicates
        </span>
        <span
          style={{
            fontSize: 11,
            background: "#fecaca",
            color: "#b91c1c",
            borderRadius: 999,
            padding: "1px 7px",
            fontWeight: 600,
          }}
        >
          {entries.length}
        </span>
      </div>
      <div style={{ padding: "10px 12px", display: "grid", gap: 10 }}>
        {entries.map(([uuid, match]) => {
          const obj = match?.matchObject;
          const title =
            obj?.metadata?.["dc.title"]?.[0]?.value ?? obj?.name ?? uuid;
          const entityType =
            obj?.metadata?.["dspace.entity.type"]?.[0]?.value ??
            obj?.entityType ??
            null;
          const handle = obj?.handle ?? null;
          const lastModified = obj?.lastModified ?? null;

          return (
            <div
              key={uuid}
              style={{
                padding: "10px 12px",
                border: "1px solid #fecaca",
                borderRadius: 6,
                background: "#fff",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  flexWrap: "wrap",
                  marginBottom: 4,
                }}
              >
                {/* Link to the duplicate item — it's in archive so UUID route works */}
                <a
                  href={routes.item(uuid)}
                  style={{
                    fontWeight: 600,
                    fontSize: 13,
                    color: "#2563eb",
                    textDecoration: "underline",
                  }}
                >
                  {title}
                </a>
                {entityType && (
                  <span
                    style={{
                      fontSize: 11,
                      padding: "1px 6px",
                      borderRadius: 4,
                      background: "#eef2ff",
                      color: "#4338ca",
                      fontWeight: 500,
                    }}
                  >
                    {entityType}
                  </span>
                )}
                {obj?.inArchive && (
                  <span
                    style={{
                      fontSize: 11,
                      padding: "1px 6px",
                      borderRadius: 4,
                      background: "#f0fdf4",
                      color: "#166534",
                      fontWeight: 500,
                    }}
                  >
                    Archived
                  </span>
                )}
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "120px 1fr",
                  gap: "3px 8px",
                  fontSize: 12,
                  color: "#6b7280",
                }}
              >
                {handle && (
                  <>
                    <span style={{ fontWeight: 500 }}>Handle</span>
                    <span>{handle}</span>
                  </>
                )}
                <span style={{ fontWeight: 500 }}>UUID</span>
                <code style={{ fontFamily: "monospace", fontSize: 11 }}>
                  {uuid}
                </code>
                {lastModified && (
                  <>
                    <span style={{ fontWeight: 500 }}>Last modified</span>
                    <span>{new Date(lastModified).toLocaleString()}</span>
                  </>
                )}
                {match?.submitterDecision != null && (
                  <>
                    <span style={{ fontWeight: 500 }}>Submitter decision</span>
                    <span>{String(match.submitterDecision)}</span>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Workspace sections panel ──────────────────────────────────────────────────

function WsSectionsPanel({
  ws,
  onChanged,
}: {
  ws: WorkspaceItemDetail;
  onChanged?: () => void;
}) {
  const sections = ws.sections ?? {};
  const detectDuplicate = sections["detect-duplicate"] ?? null;

  const SKIP_SECTIONS = new Set(["detect-duplicate"]);

  const dcMeta: Metadata = {};
  const otherMeta: Metadata = {};

  for (const [sectionKey, sectionData] of Object.entries(sections)) {
    if (SKIP_SECTIONS.has(sectionKey)) continue;
    if (!sectionData || typeof sectionData !== "object" || Array.isArray(sectionData))
      continue;
    for (const [field, vals] of Object.entries(
      sectionData as Record<string, any>,
    )) {
      if (!Array.isArray(vals)) continue;
      const target = field.startsWith("dc.") ? dcMeta : otherMeta;
      if (!target[field]) target[field] = [];
      target[field].push(...(vals as MetaValue[]));
    }
  }

  const hasDc = Object.keys(dcMeta).length > 0;
  const hasOther = Object.keys(otherMeta).length > 0;

  // Determine whether to show the upload panel
  const itemUuid = ws._embedded?.item?.uuid ?? null;
  const showUploadPanel = !!itemUuid && hasUploadStep(ws);

  // Legacy: count files in upload section data for badge
  const uploadFiles: any[] =
    sections?.uploadOptional?.files ?? sections?.upload?.files ?? [];

  return (
    <>
      {detectDuplicate && <DetectDuplicatePanel data={detectDuplicate} />}

      <Section title="Dublin Core" defaultOpen>
        {hasDc ? (
          <DublinCorePanel metadata={dcMeta} mode="workspace" />
        ) : (
          <p style={{ color: "#aaa", fontSize: 13, margin: 0 }}>
            No Dublin Core metadata yet.
          </p>
        )}
      </Section>

      {hasOther && (
        <OtherMetadataPanel metadata={otherMeta} mode="workspace" />
      )}

      {showUploadPanel ? (
        <Section
          title="Files"
          defaultOpen
          badge={uploadFiles.length > 0 ? uploadFiles.length : undefined}
        >
          <BitstreamUploadPanel
            itemId={itemUuid!}
            readOnly={false}
            onChanged={onChanged}
          />
        </Section>
      ) : uploadFiles.length > 0 ? (
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
                    <div style={{ fontSize: 11, color: "#888", marginTop: 1 }}>
                      {fmtBytes(f.sizeBytes)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Section>
      ) : null}
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
  const [editOpen, setEditOpen] = React.useState(false);
  const [archivalEditOpen, setArchivalEditOpen] = React.useState(false);
  const [refetchKey, setRefetchKey] = React.useState(0);

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setItem(null);
    setWsDetail(null);

    (async () => {
      try {
        if (props.mode === "item") {
          const data = await fetchItem(props.uuid);
          if (!cancelled) setItem(data);
        } else {
          const ws = await fetchWorkspaceItem(props.wsId);
          if (!cancelled) setWsDetail(ws);

          const itemUuid = ws._embedded?.item?.uuid;
          if (itemUuid) {
            const fullItem = await fetchItem(itemUuid).catch(() => null);
            if (!cancelled && fullItem?.uuid) setItem(fullItem);
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
  }, [props.mode, (props as any).uuid, (props as any).wsId, refetchKey]);

  const refetch = React.useCallback(() => setRefetchKey((k) => k + 1), []);

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

  // ── Workspace-item-only view (item not yet archived) ──────────────────────

  if (props.mode === "workspace" && wsDetail && !item) {
    const wsItem = wsDetail._embedded?.item;
    const title =
      wsItem?.name ??
      wsItem?.metadata?.["dc.title"]?.[0]?.value ??
      `Workspace Item #${wsDetail.id}`;

    return (
      <div style={{ padding: "20px 24px", maxWidth: 900 }}>
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
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            {(() => {
              const wsEntityType =
                wsDetail._embedded?.item?.metadata?.["dspace.entity.type"]?.[0]?.value ??
                wsDetail._embedded?.item?.entityType ?? null;
              const skosType = getSkosEntityType(wsEntityType);
              return (
                <>
                  {skosType && (
                    <button
                      onClick={() => setEditOpen(true)}
                      style={{ padding: "6px 12px", fontSize: 12, border: "1px solid #0d9488", borderRadius: 5, background: "#f0fdfa", cursor: "pointer", color: "#0f766e", flexShrink: 0, fontWeight: 600 }}
                    >
                      ✎ Edit {skosType}
                    </button>
                  )}
                  {isArchivalResource(wsEntityType) && (
                    <button
                      onClick={() => setArchivalEditOpen(true)}
                      style={{ padding: "6px 12px", fontSize: 12, border: "1px solid #d97706", borderRadius: 5, background: "#fffbeb", cursor: "pointer", color: "#92400e", flexShrink: 0, fontWeight: 600 }}
                    >
                      ✎ Edit Archival Resource
                    </button>
                  )}
                </>
              );
            })()}
            <button
              onClick={() => setShowJson((v) => !v)}
              style={{ padding: "6px 12px", fontSize: 12, border: "1px solid #d1d5db", borderRadius: 5, background: "#f9fafb", cursor: "pointer", color: "#555", flexShrink: 0 }}
            >
              {showJson ? "Hide JSON" : "{ } JSON"}
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gap: 12 }}>
          <WorkspaceInfoPanel ws={wsDetail} />

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
                value={
                  wsDetail._embedded?.submissionDefinition?.name ?? null
                }
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

          <WsSectionsPanel ws={wsDetail} onChanged={refetch} />

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

        {/* SKOS edit dialog for workspace item */}
        {(() => {
          const wsEntityType =
            wsDetail._embedded?.item?.metadata?.["dspace.entity.type"]?.[0]?.value ??
            wsDetail._embedded?.item?.entityType ?? null;
          const skosType = getSkosEntityType(wsEntityType);
          const wsMeta: Record<string, any> =
            wsDetail.sections
              ? Object.values(wsDetail.sections as Record<string, any>)
                  .filter((s) => s && typeof s === "object" && !Array.isArray(s))
                  .reduce((acc, s) => ({ ...acc, ...s }), {})
              : wsDetail._embedded?.item?.metadata ?? {};
          return skosType ? (
            <SkosEditDialog
              open={editOpen}
              onClose={() => setEditOpen(false)}
              onSaved={() => { setEditOpen(false); refetch(); }}
              entityType={skosType}
              target={{ kind: "workspace", wsId: wsDetail.id }}
              initialMeta={wsMeta}
            />
          ) : null;
        })()}

        {/* ArchivalResource edit dialog for workspace item */}
        {isArchivalResource(
          wsDetail._embedded?.item?.metadata?.["dspace.entity.type"]?.[0]?.value ??
          wsDetail._embedded?.item?.entityType
        ) && (
          <ArchivalResourceModal
            mode="editWorkspace"
            wsId={wsDetail.id}
            sections={wsDetail.sections ?? undefined}
            open={archivalEditOpen}
            onClose={() => setArchivalEditOpen(false)}
            onSaved={() => { setArchivalEditOpen(false); refetch(); }}
          />
        )}
      </div>
    );
  }

  // ── Full archived-item view ───────────────────────────────────────────────

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
        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          {getSkosEntityType(entityType) && (
            <button
              onClick={() => setEditOpen(true)}
              style={{ padding: "6px 12px", fontSize: 12, border: "1px solid #0d9488", borderRadius: 5, background: "#f0fdfa", cursor: "pointer", color: "#0f766e", flexShrink: 0, fontWeight: 600 }}
            >
              ✎ Edit {entityType}
            </button>
          )}
          {isArchivalResource(entityType) && (
            <button
              onClick={() => setArchivalEditOpen(true)}
              style={{ padding: "6px 12px", fontSize: 12, border: "1px solid #d97706", borderRadius: 5, background: "#fffbeb", cursor: "pointer", color: "#92400e", flexShrink: 0, fontWeight: 600 }}
            >
              ✎ Edit Archival Resource
            </button>
          )}
          <button
            onClick={() => setShowJson((v) => !v)}
            style={{ padding: "6px 12px", fontSize: 12, border: "1px solid #d1d5db", borderRadius: 5, background: "#f9fafb", cursor: "pointer", color: "#555", flexShrink: 0 }}
          >
            {showJson ? "Hide JSON" : "{ } JSON"}
          </button>
        </div>
      </div>

      {wsDetail && <WorkspaceInfoPanel ws={wsDetail} />}

      <div style={{ display: "grid", gap: 12, marginTop: wsDetail ? 12 : 0 }}>
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
          <DublinCorePanel metadata={meta} mode="item" />
        </Section>

        <HierarchyPanel item={item} entityType={entityType} />

        <OtherMetadataPanel metadata={meta} mode="item" />

        <Section
          title="Files"
          defaultOpen={totalBitstreams > 0}
          badge={totalBitstreams || undefined}
        >
          <BitstreamUploadPanel
            itemId={item.uuid}
            readOnly={false}
            onChanged={refetch}
          />
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

      {/* SKOS edit dialog for archived item */}
      {getSkosEntityType(entityType) && (
        <SkosEditDialog
          open={editOpen}
          onClose={() => setEditOpen(false)}
          onSaved={() => { setEditOpen(false); refetch(); }}
          entityType={getSkosEntityType(entityType)!}
          target={wsDetail
            ? { kind: "workspace", wsId: wsDetail.id }
            : { kind: "item", uuid: item.uuid }}
          initialMeta={item.metadata ?? {}}
        />
      )}

      {/* ArchivalResource edit dialog — workspace if wsDetail present, else archived item */}
      {isArchivalResource(entityType) && (
        wsDetail ? (
          <ArchivalResourceModal
            mode="editWorkspace"
            wsId={wsDetail.id}
            sections={wsDetail.sections ?? undefined}
            open={archivalEditOpen}
            onClose={() => setArchivalEditOpen(false)}
            onSaved={() => { setArchivalEditOpen(false); refetch(); }}
          />
        ) : (
          <ArchivalResourceModal
            mode="editItem"
            uuid={item.uuid}
            metadata={item.metadata ?? {}}
            open={archivalEditOpen}
            onClose={() => setArchivalEditOpen(false)}
            onSaved={() => { setArchivalEditOpen(false); refetch(); }}
          />
        )
      )}
    </div>
  );
}
