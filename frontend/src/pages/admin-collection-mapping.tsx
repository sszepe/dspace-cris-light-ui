import React from "react";
import { apiFetch } from "../auth/client";
import { useAuth } from "../auth/AuthContext";
import {
  getAllCollectionRules,
  createDjangoCollectionMapping,
  deleteDjangoCollectionMapping,
  invalidateCollectionRuleCache,
  getCollectionMappingSource,
  STATIC_COLLECTION_RULES,
  type CollectionRule,
} from "../config/collection-mapping";

// ── Types ─────────────────────────────────────────────────────────────────────

interface DSpaceCollection {
  uuid: string;
  name: string;
  handle?: string;
}

// ── DSpace API helpers ────────────────────────────────────────────────────────

async function fetchAllCollections(): Promise<DSpaceCollection[]> {
  const results: DSpaceCollection[] = [];
  let page = 0;
  const size = 100;

  while (true) {
    const data = await apiFetch<any>(
      `/api/core/collections?page=${page}&size=${size}&projection=preventMetadataSecurity`,
    );
    const embedded: any[] = data?._embedded?.collections ?? [];
    for (const c of embedded) {
      results.push({
        uuid: c.uuid,
        name: c.name ?? c.uuid,
        handle: c.handle,
      });
    }
    const pageInfo = data?.page;
    if (!pageInfo || page + 1 >= pageInfo.totalPages) break;
    page++;
  }

  return results.sort((a, b) => a.name.localeCompare(b.name));
}

// ── Styles ────────────────────────────────────────────────────────────────────

const card: React.CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: 10,
  background: "#fff",
  padding: 16,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 10px",
  border: "1px solid #d1d5db",
  borderRadius: 6,
  fontSize: 13,
  boxSizing: "border-box",
  background: "#fafafa",
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: "pointer",
};

const btnStyle: React.CSSProperties = {
  padding: "7px 14px",
  border: "1px solid #d1d5db",
  borderRadius: 6,
  background: "#f9fafb",
  cursor: "pointer",
  fontSize: 13,
  fontWeight: 500,
};

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  color: "#6b7280",
  marginBottom: 4,
  display: "block",
  fontWeight: 500,
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const DC_TYPE_SUGGESTIONS = [
  "Grant",
  "Scholarship",
  "Programme",
  "Call",
  "Ongoing Call",
];

const FUNDING_STATUSES = ["approved", "applied", "rejected", "withdrawn"];

function CollectionLabel({
  collectionId,
  collections,
}: {
  collectionId: string;
  collections: DSpaceCollection[];
}) {
  const found = collections.find((c) => c.uuid === collectionId);
  if (found) {
    return (
      <span>
        <span style={{ fontWeight: 500 }}>{found.name}</span>
        <span style={{ color: "#9ca3af", fontSize: 11, marginLeft: 6 }}>
          {found.uuid.slice(0, 8)}…
        </span>
      </span>
    );
  }
  return (
    <span style={{ color: "#9ca3af", fontFamily: "monospace", fontSize: 12 }}>
      {collectionId}
    </span>
  );
}

// ── New rule form ─────────────────────────────────────────────────────────────

interface NewRuleFormProps {
  entityTypes: { id: string; label: string }[];
  collections: DSpaceCollection[];
  collectionsLoading: boolean;
  onAdd: (rule: Omit<CollectionRule, "label"> & { label?: string }) => Promise<void>;
}

function NewRuleForm({
  entityTypes,
  collections,
  collectionsLoading,
  onAdd,
}: NewRuleFormProps) {
  const [entityType, setEntityType] = React.useState("");
  const [collectionId, setCollectionId] = React.useState("");
  const [label, setLabel] = React.useState("");

  // Conditions
  const [dcTypeInput, setDcTypeInput] = React.useState("");
  const [dcTypes, setDcTypes] = React.useState<string[]>([]);
  const [fundingStatuses, setFundingStatuses] = React.useState<string[]>([]);

  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  function addDcType(val: string) {
    const t = val.trim();
    if (t && !dcTypes.includes(t)) setDcTypes((prev) => [...prev, t]);
    setDcTypeInput("");
  }

  function removeDcType(t: string) {
    setDcTypes((prev) => prev.filter((x) => x !== t));
  }

  function toggleStatus(s: string) {
    setFundingStatuses((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );
  }

  const canSubmit = entityType.trim() && collectionId.trim();

  async function handleAdd() {
    if (!canSubmit) return;
    setSaving(true);
    setError(null);
    try {
      const conditions =
        dcTypes.length || fundingStatuses.length
          ? {
              dcTypeIncludes: dcTypes.length ? dcTypes : undefined,
              risfundingStatusIn: fundingStatuses.length ? fundingStatuses : undefined,
            }
          : undefined;

      await onAdd({
        entityType: entityType.trim(),
        collectionId: collectionId.trim(),
        label: label.trim() || undefined,
        conditions,
      });

      // Reset form
      setEntityType("");
      setCollectionId("");
      setLabel("");
      setDcTypes([]);
      setFundingStatuses([]);
      setDcTypeInput("");
    } catch (e: any) {
      setError(e?.message ?? "Failed to add rule");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={card}>
      <div
        style={{ fontWeight: 700, fontSize: 14, marginBottom: 14, color: "#1a1a2e" }}
      >
        Add new mapping rule
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 12,
          marginBottom: 14,
        }}
      >
        {/* Entity type */}
        <div>
          <label style={labelStyle}>Entity type *</label>
          <select
            value={entityType}
            onChange={(e) => setEntityType(e.target.value)}
            style={selectStyle}
          >
            <option value="">Select entity type…</option>
            {entityTypes.map((et) => (
              <option key={et.id} value={et.label}>
                {et.label}
              </option>
            ))}
          </select>
        </div>

        {/* Collection */}
        <div>
          <label style={labelStyle}>Target collection *</label>
          {collectionsLoading ? (
            <div style={{ ...inputStyle, color: "#9ca3af" }}>
              Loading collections…
            </div>
          ) : (
            <select
              value={collectionId}
              onChange={(e) => setCollectionId(e.target.value)}
              style={selectStyle}
            >
              <option value="">Select collection…</option>
              {collections.map((c) => (
                <option key={c.uuid} value={c.uuid}>
                  {c.name}
                  {c.handle ? ` (${c.handle})` : ""}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Label */}
        <div>
          <label style={labelStyle}>Label (optional)</label>
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            style={inputStyle}
            placeholder="Human-readable description"
          />
        </div>
      </div>

      {/* Conditions */}
      <div
        style={{
          border: "1px solid #f3f4f6",
          borderRadius: 8,
          padding: 12,
          background: "#fafafa",
          marginBottom: 14,
        }}
      >
        <div
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "#374151",
            marginBottom: 10,
          }}
        >
          Conditions (optional — leave blank to match all)
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {/* dc.type includes */}
          <div>
            <label style={labelStyle}>dc.type includes (any of)</label>
            <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
              <input
                value={dcTypeInput}
                onChange={(e) => setDcTypeInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addDcType(dcTypeInput);
                  }
                }}
                style={{ ...inputStyle, flex: 1 }}
                placeholder="e.g. Grant"
                list="dc-type-suggestions"
              />
              <datalist id="dc-type-suggestions">
                {DC_TYPE_SUGGESTIONS.map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
              <button
                type="button"
                onClick={() => addDcType(dcTypeInput)}
                disabled={!dcTypeInput.trim()}
                style={{
                  ...btnStyle,
                  background: dcTypeInput.trim() ? "#1d4ed8" : "#e5e7eb",
                  color: dcTypeInput.trim() ? "#fff" : "#9ca3af",
                  border: "none",
                  whiteSpace: "nowrap",
                }}
              >
                Add
              </button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {dcTypes.map((t) => (
                <span
                  key={t}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    fontSize: 12,
                    padding: "3px 8px",
                    borderRadius: 999,
                    background: "#dbeafe",
                    color: "#1e40af",
                    fontWeight: 500,
                  }}
                >
                  {t}
                  <button
                    type="button"
                    onClick={() => removeDcType(t)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#3b82f6",
                      padding: 0,
                      fontSize: 13,
                      lineHeight: 1,
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Funding status */}
          <div>
            <label style={labelStyle}>Funding status (any of)</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {FUNDING_STATUSES.map((s) => {
                const on = fundingStatuses.includes(s);
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleStatus(s)}
                    style={{
                      ...btnStyle,
                      background: on ? "#1d4ed8" : "#f3f4f6",
                      color: on ? "#fff" : "#374151",
                      border: on ? "1px solid #1d4ed8" : "1px solid #e5e7eb",
                      fontSize: 12,
                      padding: "4px 10px",
                    }}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button
          type="button"
          onClick={handleAdd}
          disabled={!canSubmit || saving}
          style={{
            ...btnStyle,
            background: canSubmit && !saving ? "#1d4ed8" : "#e5e7eb",
            color: canSubmit && !saving ? "#fff" : "#9ca3af",
            border: "none",
            fontWeight: 700,
            padding: "9px 20px",
          }}
        >
          {saving ? "Saving…" : "Add rule"}
        </button>
        {error && (
          <span style={{ fontSize: 13, color: "#b91c1c" }}>{error}</span>
        )}
      </div>
    </div>
  );
}

// ── Rule row ──────────────────────────────────────────────────────────────────

function RuleRow({
  rule,
  index,
  collections,
  isDjango,
  onDelete,
}: {
  rule: CollectionRule & { _djangoId?: number };
  index: number;
  collections: DSpaceCollection[];
  isDjango: boolean;
  onDelete: (rule: CollectionRule & { _djangoId?: number }) => void;
}) {
  const hasConds =
    (rule.conditions?.dcTypeIncludes?.length ?? 0) > 0 ||
    (rule.conditions?.risfundingStatusIn?.length ?? 0) > 0;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "28px 140px 1fr 1fr auto",
        gap: 10,
        alignItems: "start",
        padding: "12px 0",
        borderBottom: "1px solid #f3f4f6",
      }}
    >
      {/* Index */}
      <div
        style={{
          width: 22,
          height: 22,
          borderRadius: "50%",
          background: "#f3f4f6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 11,
          color: "#6b7280",
          fontWeight: 600,
          flexShrink: 0,
          marginTop: 2,
        }}
      >
        {index + 1}
      </div>

      {/* Entity type */}
      <div>
        <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 2 }}>
          Entity type
        </div>
        <span
          style={{
            display: "inline-block",
            fontSize: 12,
            padding: "3px 8px",
            borderRadius: 999,
            background: "#eef2ff",
            color: "#3730a3",
            fontWeight: 600,
          }}
        >
          {rule.entityType}
        </span>
      </div>

      {/* Collection */}
      <div>
        <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 2 }}>
          Target collection
        </div>
        <div style={{ fontSize: 13 }}>
          <CollectionLabel
            collectionId={rule.collectionId}
            collections={collections}
          />
        </div>
        {rule.label && (
          <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>
            {rule.label}
          </div>
        )}
      </div>

      {/* Conditions */}
      <div>
        <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 2 }}>
          Conditions
        </div>
        {!hasConds ? (
          <span style={{ fontSize: 12, color: "#9ca3af", fontStyle: "italic" }}>
            None (matches all)
          </span>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {(rule.conditions?.dcTypeIncludes ?? []).length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                <span style={{ fontSize: 11, color: "#6b7280" }}>dc.type:</span>
                {rule.conditions!.dcTypeIncludes!.map((t) => (
                  <span
                    key={t}
                    style={{
                      fontSize: 11,
                      padding: "2px 6px",
                      borderRadius: 999,
                      background: "#dbeafe",
                      color: "#1e40af",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
            {(rule.conditions?.risfundingStatusIn ?? []).length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                <span style={{ fontSize: 11, color: "#6b7280" }}>status:</span>
                {rule.conditions!.risfundingStatusIn!.map((s) => (
                  <span
                    key={s}
                    style={{
                      fontSize: 11,
                      padding: "2px 6px",
                      borderRadius: 999,
                      background: "#f0fdf4",
                      color: "#166534",
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete */}
      <div style={{ paddingTop: 18 }}>
        {isDjango && rule._djangoId != null ? (
          <button
            onClick={() => onDelete(rule)}
            style={{
              ...btnStyle,
              color: "#b91c1c",
              borderColor: "#fecaca",
              background: "#fff7f7",
              fontSize: 12,
              padding: "4px 10px",
            }}
          >
            Remove
          </button>
        ) : (
          <span
            style={{
              fontSize: 11,
              color: "#9ca3af",
              fontStyle: "italic",
            }}
          >
            static
          </span>
        )}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export function AdminCollectionMappingPage() {
  const { isAdmin, entityTypes } = useAuth();

  const isDjango = getCollectionMappingSource() === "django";

  // ── Collections from DSpace ──────────────────────────────────────────────
  const [collections, setCollections] = React.useState<DSpaceCollection[]>([]);
  const [collectionsLoading, setCollectionsLoading] = React.useState(true);
  const [collectionsError, setCollectionsError] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetchAllCollections()
      .then(setCollections)
      .catch((e: any) =>
        setCollectionsError(e?.message ?? "Failed to load collections"),
      )
      .finally(() => setCollectionsLoading(false));
  }, []);

  // ── Rules ────────────────────────────────────────────────────────────────
  const [rules, setRules] = React.useState<
    (CollectionRule & { _djangoId?: number })[]
  >([]);
  const [rulesLoading, setRulesLoading] = React.useState(true);
  const [rulesError, setRulesError] = React.useState<string | null>(null);
  const [notice, setNotice] = React.useState<string | null>(null);

  const loadRules = React.useCallback(async () => {
    setRulesLoading(true);
    try {
      const loaded = await getAllCollectionRules();
      setRules(loaded as (CollectionRule & { _djangoId?: number })[]);
      setRulesError(null);
    } catch (e: any) {
      setRulesError(e?.message ?? "Failed to load rules");
    } finally {
      setRulesLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadRules();
  }, [loadRules]);

  // Auto-clear notice
  React.useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 4000);
    return () => clearTimeout(t);
  }, [notice]);

  // Available entity types from auth context (same as clusters page)
  const availableEntityTypes = React.useMemo(
    () =>
      [...entityTypes]
        .sort((a, b) => a.label.localeCompare(b.label))
        .map((et) => ({ id: String(et.id), label: et.label })),
    [entityTypes],
  );

  // ── Actions ──────────────────────────────────────────────────────────────

  async function handleAddRule(
    rule: Omit<CollectionRule, "label"> & { label?: string },
  ) {
    if (!isDjango) {
      // In TS mode just show instructions
      return;
    }
    await createDjangoCollectionMapping(rule);
    invalidateCollectionRuleCache();
    await loadRules();
    setNotice(`Rule for "${rule.entityType}" added.`);
  }

  async function handleDeleteRule(
    rule: CollectionRule & { _djangoId?: number },
  ) {
    if (!rule._djangoId) return;
    if (
      !window.confirm(
        `Remove mapping for "${rule.entityType}"${rule.label ? ` (${rule.label})` : ""}?`,
      )
    )
      return;
    await deleteDjangoCollectionMapping(rule._djangoId);
    invalidateCollectionRuleCache();
    await loadRules();
    setNotice("Rule removed.");
  }

  // ── Guards ───────────────────────────────────────────────────────────────

  if (!isAdmin) {
    return (
      <div style={{ padding: "20px 24px", maxWidth: 900 }}>
        <h2 style={{ marginTop: 0 }}>Collection Mapping</h2>
        <div style={{ color: "#b91c1c", fontSize: 14 }}>
          You must be a DSpace Administrator to manage collection mappings.
        </div>
      </div>
    );
  }

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div style={{ padding: "20px 24px", maxWidth: 1100 }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#1a1a2e" }}>
          Collection Mapping
        </h2>
        <p
          style={{
            color: "#6b7280",
            marginTop: 6,
            marginBottom: 0,
            fontSize: 14,
            maxWidth: 680,
          }}
        >
          Maps entity types (and optional field conditions) to target DSpace
          collection UUIDs. Rules are evaluated top-to-bottom; the first match
          wins. Used by submission forms to determine where new items are
          deposited.
        </p>

        {/* Source badge */}
        <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              display: "inline-block",
              fontSize: 11,
              fontWeight: 600,
              padding: "3px 8px",
              borderRadius: 999,
              background: isDjango ? "#f0fdf4" : "#fef9c3",
              color: isDjango ? "#166534" : "#854d0e",
              border: isDjango
                ? "1px solid #bbf7d0"
                : "1px solid #fde68a",
            }}
          >
            {isDjango ? "source: django (editable)" : "source: ts (read-only)"}
          </span>
          {!isDjango && (
            <span style={{ fontSize: 12, color: "#9ca3af" }}>
              Set{" "}
              <code
                style={{
                  background: "#f3f4f6",
                  padding: "1px 4px",
                  borderRadius: 3,
                }}
              >
                VITE_COLLECTION_MAPPING_SOURCE=django
              </code>{" "}
              to enable editing
            </span>
          )}
        </div>

        {/* Notice / error */}
        {notice && (
          <div
            style={{
              marginTop: 10,
              color: "#166534",
              fontSize: 13,
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              borderRadius: 6,
              padding: "7px 12px",
            }}
          >
            {notice}
          </div>
        )}
        {(rulesError || collectionsError) && (
          <div
            style={{
              marginTop: 10,
              color: "#b91c1c",
              fontSize: 13,
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: 6,
              padding: "7px 12px",
            }}
          >
            {rulesError ?? collectionsError}
          </div>
        )}
      </div>

      {/* Add rule form — only shown in django mode */}
      {isDjango && (
        <div style={{ marginBottom: 20 }}>
          <NewRuleForm
            entityTypes={availableEntityTypes}
            collections={collections}
            collectionsLoading={collectionsLoading}
            onAdd={handleAddRule}
          />
        </div>
      )}

      {/* TS mode: instructions */}
      {!isDjango && (
        <div
          style={{
            ...card,
            background: "#fffbeb",
            borderColor: "#fde68a",
            marginBottom: 20,
            fontSize: 13,
            color: "#78350f",
          }}
        >
          <strong>Read-only mode.</strong> To add or remove rules, edit{" "}
          <code>src/config/collection-mapping.ts</code> → the{" "}
          <code>STATIC_COLLECTION_RULES</code> array. Rules are evaluated
          top-to-bottom; put more specific conditions above general ones.
        </div>
      )}

      {/* Rules table */}
      <div style={card}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 6,
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 14, color: "#1a1a2e" }}>
            Active rules{" "}
            {!rulesLoading && (
              <span
                style={{
                  fontWeight: 400,
                  fontSize: 12,
                  color: "#9ca3af",
                  marginLeft: 4,
                }}
              >
                ({rules.length})
              </span>
            )}
          </div>
          <button
            onClick={loadRules}
            style={{ ...btnStyle, fontSize: 12, padding: "4px 10px" }}
          >
            ↻ Refresh
          </button>
        </div>

        {/* Column headers */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "28px 140px 1fr 1fr auto",
            gap: 10,
            padding: "6px 0 10px",
            borderBottom: "2px solid #e5e7eb",
          }}
        >
          {["#", "Entity type", "Target collection", "Conditions", ""].map(
            (h) => (
              <div
                key={h}
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#9ca3af",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {h}
              </div>
            ),
          )}
        </div>

        {rulesLoading ? (
          <div style={{ color: "#9ca3af", fontSize: 14, padding: "16px 0" }}>
            Loading rules…
          </div>
        ) : rules.length === 0 ? (
          <div style={{ color: "#9ca3af", fontSize: 14, padding: "16px 0" }}>
            No rules configured.
          </div>
        ) : (
          rules.map((rule, i) => (
            <RuleRow
              key={`${rule.entityType}-${rule.collectionId}-${i}`}
              rule={rule}
              index={i}
              collections={collections}
              isDjango={isDjango}
              onDelete={handleDeleteRule}
            />
          ))
        )}
      </div>

      {/* Footer hint */}
      <div
        style={{
          marginTop: 14,
          fontSize: 12,
          color: "#9ca3af",
          lineHeight: 1.6,
        }}
      >
        Rules are evaluated in order. For the same entity type, put rules with
        more specific conditions (e.g. both dc.type and status) before less
        specific ones (e.g. dc.type only). The first matching rule wins.
      </div>
    </div>
  );
}
