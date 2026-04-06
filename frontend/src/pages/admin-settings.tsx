import React from "react";
import { useAuth } from "../auth/AuthContext";
import {
  isCommunitiesCreationEnabled,
  isCommunitiesRoleManagementEnabled,
  isCollectionsCreationEnabled,
  getCommunitiesConfigSource,
  // fetchCommunitiesSettings,
  // patchCommunitiesSettings,
} from "../config/communities-config";
import {
  getClusterConfigSource,
  listDjangoClusters,
  createDjangoCluster,
  updateDjangoCluster,
  deleteDjangoCluster,
  addDjangoClusterEntityType,
  deleteDjangoClusterEntityType,
  type ClusterConfig,
} from "../config/dashboard-config";
import {
  isQuicklinksEnabled,
  isQuicklinksAdminOnly,
  getQuicklinksConfigSource,
  fetchSiteSettings,
  patchSiteSettings,
  listDjangoPresets,
  createDjangoPreset,
  updateDjangoPreset,
  deleteDjangoPreset,
  addDjangoPresetFilter,
  deleteDjangoPresetFilter,
  type SiteSettings,
  type QuickPresetRecord,
  type QuickPresetFilter,
} from "../config/quicklinks-config";

// ─────────────────────────────────────────────────────────────────────────────
// Shared primitives
// ─────────────────────────────────────────────────────────────────────────────

function slugify(s: string): string {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "item";
}

const S = {
  card: {
    border: "1px solid #e5e7eb", borderRadius: 10,
    background: "#fff", padding: 16,
  } as React.CSSProperties,
  input: {
    width: "100%", padding: "7px 10px", border: "1px solid #d1d5db",
    borderRadius: 6, fontSize: 13, boxSizing: "border-box" as const,
  } as React.CSSProperties,
  btn: {
    padding: "7px 12px", border: "1px solid #d1d5db", borderRadius: 6,
    background: "#f9fafb", cursor: "pointer", fontSize: 13,
  } as React.CSSProperties,
  label: { fontSize: 12, color: "#6b7280", marginBottom: 4 } as React.CSSProperties,
  hint:  { fontSize: 12, color: "#9ca3af", marginTop: 3 } as React.CSSProperties,
  sectionHeading: {
    fontSize: 11, fontWeight: 600, color: "#9ca3af",
    textTransform: "uppercase" as const, letterSpacing: "0.05em", marginBottom: 8,
  } as React.CSSProperties,
};

function Notice({ text, type }: { text: string; type: "success" | "error" }) {
  const ok = type === "success";
  return (
    <div style={{
      padding: "8px 12px", borderRadius: 6, fontSize: 13,
      background: ok ? "#f0fdf4" : "#fef2f2",
      border: `1px solid ${ok ? "#bbf7d0" : "#fecaca"}`,
      color: ok ? "#166534" : "#b91c1c",
    }}>{text}</div>
  );
}

function Toggle({ checked, onChange, disabled, id }: {
  checked: boolean; onChange: (v: boolean) => void; disabled?: boolean; id: string;
}) {
  return (
    <label htmlFor={id} style={{ display: "inline-flex", alignItems: "center", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1, userSelect: "none" }}>
      <span style={{ position: "relative", display: "inline-block", width: 36, height: 20, borderRadius: 999, background: checked ? "#2563eb" : "#d1d5db", transition: "background 0.2s", flexShrink: 0 }}>
        <span style={{ position: "absolute", top: 3, left: checked ? 19 : 3, width: 14, height: 14, borderRadius: "50%", background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,.2)" }} />
      </span>
      <input id={id} type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} disabled={disabled} style={{ position: "absolute", opacity: 0, width: 0, height: 0 }} />
    </label>
  );
}

function EnvBadge({ value }: { value: string }) {
  return (
    <code style={{ fontSize: 12, padding: "2px 8px", borderRadius: 4, background: "#f1f5f9", color: "#334155", whiteSpace: "nowrap" }}>
      {value}
    </code>
  );
}

function useAutoClear<T>(value: T, clear: () => void, ms = 4000) {
  React.useEffect(() => { if (!value) return; const t = setTimeout(clear, ms); return () => clearTimeout(t); }, [value]);
}

// ─────────────────────────────────────────────────────────────────────────────
// Tab: General settings
// ─────────────────────────────────────────────────────────────────────────────

function TabGeneral({
  onQuicklinksToggle,
  onCommunitiesCreationToggle,
  onCommunitiesRoleManagementToggle,
  onCollectionsCreationToggle,
}: {
  onQuicklinksToggle?: (v: boolean) => void;
  onCommunitiesCreationToggle?: (v: boolean) => void;
  onCommunitiesRoleManagementToggle?: (v: boolean) => void;
  onCollectionsCreationToggle?: (v: boolean) => void;
}) {
  const { isAdmin } = useAuth();

  // ── Quicklinks ──────────────────────────────────────────────────────────────
  const qlDjangoMode  = getQuicklinksConfigSource() === "django";
  const envQlEnabled  = isQuicklinksEnabled();
  const envQlAdminOnly = isQuicklinksAdminOnly();

  // ── Communities ─────────────────────────────────────────────────────────────
  const comDjangoMode = getCommunitiesConfigSource() === "django";
  const envComCreation    = isCommunitiesCreationEnabled();
  const envComRoleManagement = isCommunitiesRoleManagementEnabled();
  const envColCreation    = isCollectionsCreationEnabled();

  // Single SiteSettings load covers all runtime toggles
  const djangoMode = qlDjangoMode || comDjangoMode;

  const [settings,  setSettings]  = React.useState<SiteSettings | null>(null);
  const [loading,   setLoading]   = React.useState(djangoMode);
  const [saving,    setSaving]    = React.useState(false);
  const [error,     setError]     = React.useState<string | null>(null);
  const [notice,    setNotice]    = React.useState<string | null>(null);
  useAutoClear(notice, () => setNotice(null));

  React.useEffect(() => {
    if (!djangoMode || !isAdmin) { setLoading(false); return; }
    // SiteSettings covers all flags — one fetch is enough
    fetchSiteSettings()
      .then(s => { setSettings(s); setError(null); })
      .catch(e => setError(e?.message || "Failed to load settings."))
      .finally(() => setLoading(false));
  }, [djangoMode, isAdmin]);

  async function handlePatch(patch: Record<string, boolean>, notice: string, callback?: (v: boolean) => void, value?: boolean) {
    setSaving(true); setError(null);
    try {
      const updated = await patchSiteSettings(patch);
      setSettings(prev => prev ? { ...prev, ...updated } : updated as any);
      callback?.(value!);
      setNotice(notice);
    } catch (e: any) {
      setError(e?.message || "Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  // ── Row helpers ──────────────────────────────────────────────────────────────

  function EnvSection({ rows }: { rows: Array<{ label: string; value: string; desc: string }> }) {
    return (
      <div style={{ marginBottom: 16 }}>
        <div style={S.sectionHeading}>Build-time flags (.env)</div>
        {rows.map(row => (
          <div key={row.label} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "9px 0", borderBottom: "1px solid #f3f4f6" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{row.label}</div>
              <div style={S.hint}>{row.desc}</div>
            </div>
            <EnvBadge value={row.value} />
          </div>
        ))}
      </div>
    );
  }

  function RuntimeToggleRow({
    id, label, fieldKey, envEnabled, hint,
    callback,
  }: {
    id: string;
    label: string;
    fieldKey: keyof SiteSettings;
    envEnabled: boolean;
    hint: string;
    callback?: (v: boolean) => void;
  }) {
    const currentValue = settings != null ? (settings[fieldKey] as boolean) : true;
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "12px 14px", borderRadius: 8, background: "#f8fafc", border: "1px solid #e2e8f0", opacity: !envEnabled ? 0.55 : 1, marginBottom: 8 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>
            {label}
            {settings != null && (
              <span style={{ marginLeft: 8, padding: "1px 8px", borderRadius: 999, fontSize: 11, fontWeight: 600, background: currentValue ? "#dcfce7" : "#f3f4f6", color: currentValue ? "#166534" : "#6b7280" }}>
                {currentValue ? "On" : "Off"}
              </span>
            )}
          </div>
          <div style={S.hint}>
            {!envEnabled ? `Has no effect while the .env flag is false. Enable the build flag first.` : hint}
          </div>
        </div>
        {loading ? (
          <span style={{ fontSize: 12, color: "#9ca3af" }}>Loading…</span>
        ) : settings != null ? (
          <Toggle
            id={id}
            checked={currentValue}
            onChange={v => handlePatch({ [fieldKey]: v }, `${label} ${v ? "enabled" : "disabled"}.`, callback, v)}
            disabled={saving || !envEnabled}
          />
        ) : null}
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: 20 }}>
      {notice && <Notice text={notice} type="success" />}
      {error  && <Notice text={error}  type="error" />}

      {/* ── Quicklinks card ── */}
      <div style={S.card}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 4 }}>Quicklinks</div>
        <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 16 }}>
          Controls visibility of the Quicklinks tab in the navigation.
        </div>
        <EnvSection rows={[
          { label: "VITE_QUICKLINKS_ENABLED", value: envQlEnabled ? "true" : "false",
            desc: envQlEnabled ? "Feature is enabled at the build level." : "Feature is OFF. Set to true and redeploy to activate." },
          { label: "VITE_QUICKLINKS_ADMIN_ONLY", value: envQlAdminOnly ? "true" : "false",
            desc: envQlAdminOnly ? "Tab restricted to DSpace Administrators." : "Tab visible to all authenticated users." },
          { label: "VITE_QUICKLINKS_CONFIG_SOURCE", value: qlDjangoMode ? "django" : "ts",
            desc: qlDjangoMode ? "Presets and runtime toggle stored in Django." : "Presets defined in quicklinks-config.ts. Runtime toggle unavailable." },
        ]} />
        <div style={{ marginTop: 4 }}>
          <div style={S.sectionHeading}>Runtime toggle {qlDjangoMode ? "(Django)" : ""}</div>
          {!qlDjangoMode ? (
            <div style={{ padding: "10px 14px", borderRadius: 8, background: "#f8fafc", border: "1px solid #e2e8f0", fontSize: 13, color: "#64748b" }}>
              <strong>Not available in ts mode.</strong>{" "}
              Set <code style={{ background: "#f1f5f9", padding: "1px 5px", borderRadius: 3 }}>VITE_QUICKLINKS_CONFIG_SOURCE=django</code> to enable live control without redeploying.
            </div>
          ) : (
            <RuntimeToggleRow
              id="ql-runtime" label="Quicklinks enabled" fieldKey="quicklinks_enabled"
              envEnabled={envQlEnabled} hint="Hide the tab immediately without redeploying."
              callback={onQuicklinksToggle}
            />
          )}
        </div>
        {settings?.updated_at && qlDjangoMode && (
          <div style={{ ...S.hint, marginTop: 8 }}>Last changed: {new Date(settings.updated_at).toLocaleString()}</div>
        )}
      </div>

      {/* ── Communities card ── */}
      <div style={S.card}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 4 }}>Communities</div>
        <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 16 }}>
          Controls which admin actions are available on the Communities page.
        </div>
        <EnvSection rows={[
          { label: "VITE_COMMUNITIES_CREATION_ENABLED", value: envComCreation ? "true" : "false",
            desc: envComCreation ? "Community and subcommunity creation enabled for admins." : "Creation UI hidden. Set to true and redeploy to activate." },
          { label: "VITE_COMMUNITIES_ROLE_MANAGEMENT_ENABLED", value: envComRoleManagement ? "true" : "false",
            desc: envComRoleManagement ? "Community role management (admin groups) enabled for admins." : "Role management UI hidden. Set to true and redeploy to activate." },
          { label: "VITE_COLLECTIONS_CREATION_ENABLED", value: envColCreation ? "true" : "false",
            desc: envColCreation ? "Collection creation and permission management enabled for admins." : "Collection creation UI hidden. Set to true and redeploy to activate." },
          { label: "VITE_CLUSTER_CONFIG_SOURCE", value: comDjangoMode ? "django" : "ts",
            desc: comDjangoMode ? "Runtime toggles below stored in Django." : "Runtime toggles not available in ts mode." },
        ]} />
        <div style={{ marginTop: 4 }}>
          <div style={S.sectionHeading}>Runtime toggles {comDjangoMode ? "(Django)" : ""}</div>
          {!comDjangoMode ? (
            <div style={{ padding: "10px 14px", borderRadius: 8, background: "#f8fafc", border: "1px solid #e2e8f0", fontSize: 13, color: "#64748b" }}>
              <strong>Not available in ts mode.</strong>{" "}
              Set <code style={{ background: "#f1f5f9", padding: "1px 5px", borderRadius: 3 }}>VITE_CLUSTER_CONFIG_SOURCE=django</code> to enable live control without redeploying.
            </div>
          ) : (
            <>
              <RuntimeToggleRow
                id="com-creation-runtime" label="Community creation"
                fieldKey="communities_creation_enabled" envEnabled={envComCreation}
                hint='Show the "+ Create community" button and subcommunity actions on tree nodes.'
                callback={onCommunitiesCreationToggle}
              />
              <RuntimeToggleRow
                id="com-roles-runtime" label="Role management"
                fieldKey="communities_role_management_enabled" envEnabled={envComRoleManagement}
                hint='Show the "👥 Admins" button on community tree nodes.'
                callback={onCommunitiesRoleManagementToggle}
              />
              <RuntimeToggleRow
                id="col-creation-runtime" label="Collection creation"
                fieldKey="collections_creation_enabled" envEnabled={envColCreation}
                hint='Show the "+ collection" button on community tree nodes and the "🔐 Permissions" button on collection nodes.'
                callback={onCollectionsCreationToggle}
              />
            </>
          )}
        </div>
        {settings?.updated_at && comDjangoMode && (
          <div style={{ ...S.hint, marginTop: 8 }}>Last changed: {new Date(settings.updated_at).toLocaleString()}</div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Tab: Dashboard Clusters
// ─────────────────────────────────────────────────────────────────────────────

function TabClusters() {
  const { isAdmin, entityTypes } = useAuth();
  const djangoMode = getClusterConfigSource() === "django";

  const [clusters, setClusters] = React.useState<ClusterConfig[]>([]);
  const [loading,  setLoading]  = React.useState(true);
  const [error,    setError]    = React.useState<string | null>(null);
  const [notice,   setNotice]   = React.useState<string | null>(null);
  const [newLabel, setNewLabel] = React.useState("");
  const [newDesc,  setNewDesc]  = React.useState("");
  const [selET,    setSelET]    = React.useState<Record<string, string>>({});
  useAutoClear(notice, () => setNotice(null));

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await listDjangoClusters();
      setClusters([...data].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)));
      setError(null);
    } catch (e: any) {
      setError(e?.message || "Failed to load clusters.");
    } finally { setLoading(false); }
  }, []);

  React.useEffect(() => { if (djangoMode && isAdmin) load(); else setLoading(false); }, [djangoMode, isAdmin, load]);

  const availableET = React.useMemo(() => [...entityTypes].sort((a, b) => a.label.localeCompare(b.label)), [entityTypes]);

  async function onCreate() {
    const label = newLabel.trim(); if (!label) return;
    try {
      const c = await createDjangoCluster({ key: slugify(label), label, description: newDesc.trim() || undefined, sort_order: (clusters.length + 1) * 10, enabled: true });
      setClusters(prev => [...prev, c].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)));
      setNewLabel(""); setNewDesc(""); setNotice(`Created "${label}".`); setError(null);
    } catch (e: any) { setError(e?.message || "Failed to create."); }
  }

  async function onUpdate(cluster: ClusterConfig, patch: Partial<ClusterConfig>) {
    try {
      const updated = await updateDjangoCluster(cluster.id!, patch);
      setClusters(prev => prev.map(c => c.id === cluster.id ? { ...c, ...updated } : c));
      setNotice(`Saved "${updated.label}".`); setError(null);
    } catch (e: any) { setError(e?.message || "Failed to save."); }
  }

  async function onDelete(cluster: ClusterConfig) {
    if (!window.confirm(`Delete cluster "${cluster.label}"?`)) return;
    try {
      await deleteDjangoCluster(cluster.id!);
      setClusters(prev => prev.filter(c => c.id !== cluster.id));
      setNotice(`Deleted "${cluster.label}".`); setError(null);
    } catch (e: any) { setError(e?.message || "Failed to delete."); }
  }

  async function onAddET(cluster: ClusterConfig) {
    const picked = selET[String(cluster.id)] || ""; if (!picked) return;
    try {
      await addDjangoClusterEntityType(cluster.id!, picked, (cluster.entity_types?.length ?? 0) + 1);
      await load();
      setSelET(prev => ({ ...prev, [String(cluster.id)]: "" }));
      setNotice(`Added "${picked}" to "${cluster.label}".`); setError(null);
    } catch (e: any) { setError(e?.message || "Failed to add."); }
  }

  async function onRemoveET(id: number | string, label: string) {
    try {
      await deleteDjangoClusterEntityType(id);
      await load();
      setNotice(`Removed "${label}".`); setError(null);
    } catch (e: any) { setError(e?.message || "Failed to remove."); }
  }

  if (!djangoMode) return (
    <div style={{ color: "#6b7280", fontSize: 14, padding: "4px 0" }}>
      Cluster management requires <code>VITE_CLUSTER_CONFIG_SOURCE=django</code>.
    </div>
  );

  return (
    <div style={{ display: "grid", gap: 16 }}>
      {notice && <Notice text={notice} type="success" />}
      {error  && <Notice text={error}  type="error" />}

      {/* New cluster form */}
      <div style={S.card}>
        <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 14, color: "#111827" }}>New cluster</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr auto", gap: 10, alignItems: "end" }}>
          <div>
            <div style={S.label}>Label</div>
            <input value={newLabel} onChange={e => setNewLabel(e.target.value)} onKeyDown={e => e.key === "Enter" && onCreate()} style={S.input} placeholder="Research" />
          </div>
          <div>
            <div style={S.label}>Description</div>
            <input value={newDesc} onChange={e => setNewDesc(e.target.value)} onKeyDown={e => e.key === "Enter" && onCreate()} style={S.input} placeholder="Optional description" />
          </div>
          <button onClick={onCreate} disabled={!newLabel.trim()} style={{ ...S.btn, background: newLabel.trim() ? "#1d4ed8" : "#e5e7eb", color: newLabel.trim() ? "#fff" : "#9ca3af", border: "none", fontWeight: 600, height: 36 }}>
            Add
          </button>
        </div>
      </div>

      {/* Cluster list */}
      {loading ? <div style={{ color: "#9ca3af", fontSize: 14 }}>Loading…</div>
        : clusters.length === 0 ? <div style={{ color: "#9ca3af", fontSize: 14 }}>No clusters yet.</div>
        : clusters.map((cluster, idx) => {
          const usedLabels = new Set((cluster.entity_types ?? []).map(e => e.entity_type_label));
          const remaining  = availableET.filter(et => !usedLabels.has(et.label));
          const cid = String(cluster.id);
          return (
            <div key={cid} style={S.card}>
              {/* Header row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 100px auto", gap: 10, alignItems: "end" }}>
                <div>
                  <div style={S.label}>Label</div>
                  <input value={cluster.label}
                    onChange={e => setClusters(prev => prev.map(c => c.id === cluster.id ? { ...c, label: e.target.value } : c))}
                    onBlur={() => onUpdate(cluster, { label: cluster.label, key: cluster.key || slugify(cluster.label) })}
                    style={S.input} />
                </div>
                <div>
                  <div style={S.label}>Order</div>
                  <input type="number" value={cluster.sort_order ?? idx + 1}
                    onChange={e => setClusters(prev => prev.map(c => c.id === cluster.id ? { ...c, sort_order: Number(e.target.value) } : c))}
                    onBlur={() => onUpdate(cluster, { sort_order: cluster.sort_order })}
                    style={{ ...S.input, width: "100%" }} />
                </div>
                <div style={{ display: "flex", gap: 6, alignItems: "flex-end" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#374151", cursor: "pointer", paddingBottom: 4 }}>
                    <Toggle id={`cluster-enabled-${cid}`} checked={cluster.enabled ?? true}
                      onChange={v => { setClusters(prev => prev.map(c => c.id === cluster.id ? { ...c, enabled: v } : c)); onUpdate(cluster, { enabled: v }); }} />
                    Active
                  </label>
                  <button onClick={() => onDelete(cluster)} style={{ ...S.btn, color: "#b91c1c", borderColor: "#fecaca", background: "#fff7f7", height: 36 }}>
                    Delete
                  </button>
                </div>
              </div>

              {/* Description */}
              <div style={{ marginTop: 10 }}>
                <div style={S.label}>Description</div>
                <input value={cluster.description ?? ""}
                  onChange={e => setClusters(prev => prev.map(c => c.id === cluster.id ? { ...c, description: e.target.value } : c))}
                  onBlur={() => onUpdate(cluster, { description: cluster.description ?? "" })}
                  style={S.input} placeholder="Optional" />
              </div>

              {/* Entity types */}
              <div style={{ marginTop: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 7 }}>Entity types</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
                  {(cluster.entity_types ?? []).sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)).map(et => (
                    <span key={String(et.id ?? et.entity_type_label)} style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, padding: "3px 8px", borderRadius: 999, background: "#eef2ff", color: "#3730a3", fontWeight: 500 }}>
                      {et.entity_type_label}
                      {et.id != null && (
                        <button onClick={() => onRemoveET(et.id!, et.entity_type_label)} style={{ background: "none", border: "none", color: "#6366f1", cursor: "pointer", fontSize: 13, lineHeight: 1, padding: 0 }}>×</button>
                      )}
                    </span>
                  ))}
                  {(cluster.entity_types?.length ?? 0) === 0 && <span style={{ fontSize: 12, color: "#9ca3af" }}>None assigned.</span>}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <select value={selET[cid] || ""} onChange={e => setSelET(prev => ({ ...prev, [cid]: e.target.value }))} style={{ ...S.input, maxWidth: 260 }}>
                    <option value="">Add entity type…</option>
                    {remaining.map(et => <option key={et.id} value={et.label}>{et.label}</option>)}
                  </select>
                  <button onClick={() => onAddET(cluster)} disabled={!selET[cid]} style={{ ...S.btn, background: selET[cid] ? "#1d4ed8" : "#e5e7eb", color: selET[cid] ? "#fff" : "#9ca3af", border: "none", fontWeight: 600 }}>
                    Assign
                  </button>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Tab: Quicklinks Presets
// ─────────────────────────────────────────────────────────────────────────────

const FILTER_KINDS: Array<"text" | "date"> = ["text", "date"];

function TabQuicklinks() {
  const { isAdmin } = useAuth();
  const djangoMode  = getQuicklinksConfigSource() === "django";

  const [presets,  setPresets]  = React.useState<QuickPresetRecord[]>([]);
  const [loading,  setLoading]  = React.useState(true);
  const [error,    setError]    = React.useState<string | null>(null);
  const [notice,   setNotice]   = React.useState<string | null>(null);

  // new-preset form
  const [newLabel, setNewLabel] = React.useState("");
  const [newDesc,  setNewDesc]  = React.useState("");

  // per-preset new-filter draft: Record<presetId, draft filter fields>
  const [newFilter, setNewFilter] = React.useState<Record<string, Partial<QuickPresetFilter>>>({});

  // base_filters JSON editing: Record<presetId, raw string>
  const [bfDraft,   setBfDraft]  = React.useState<Record<string, string>>({});
  const [bfError,   setBfError]  = React.useState<Record<string, string>>({});

  useAutoClear(notice, () => setNotice(null));

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await listDjangoPresets();
      setPresets([...data].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)));
      setError(null);
    } catch (e: any) { setError(e?.message || "Failed to load presets."); }
    finally { setLoading(false); }
  }, []);

  React.useEffect(() => { if (djangoMode && isAdmin) load(); else setLoading(false); }, [djangoMode, isAdmin, load]);

  // Sync bfDraft when presets load
  React.useEffect(() => {
    const drafts: Record<string, string> = {};
    for (const p of presets) {
      if (p.id != null && !(String(p.id) in bfDraft))
        drafts[String(p.id)] = JSON.stringify(p.base_filters ?? {}, null, 2);
    }
    if (Object.keys(drafts).length) setBfDraft(prev => ({ ...drafts, ...prev }));
  }, [presets]);

  async function onCreatePreset() {
    const label = newLabel.trim(); if (!label) return;
    try {
      const p = await createDjangoPreset({ key: slugify(label), label, description: newDesc.trim() || undefined, base_filters: {}, sort_order: (presets.length + 1) * 10, enabled: true });
      setPresets(prev => [...prev, p].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)));
      setBfDraft(prev => ({ ...prev, [String(p.id)]: "{}" }));
      setNewLabel(""); setNewDesc(""); setNotice(`Created "${label}".`); setError(null);
    } catch (e: any) { setError(e?.message || "Failed to create."); }
  }

  async function onUpdatePreset(preset: QuickPresetRecord, patch: Partial<QuickPresetRecord>) {
    try {
      const updated = await updateDjangoPreset(preset.id!, patch);
      setPresets(prev => prev.map(p => p.id === preset.id ? { ...p, ...updated } : p));
      setNotice(`Saved "${updated.label}".`); setError(null);
    } catch (e: any) { setError(e?.message || "Failed to save."); }
  }

  async function onDeletePreset(preset: QuickPresetRecord) {
    if (!window.confirm(`Delete preset "${preset.label}"?`)) return;
    try {
      await deleteDjangoPreset(preset.id!);
      setPresets(prev => prev.filter(p => p.id !== preset.id));
      setNotice(`Deleted "${preset.label}".`); setError(null);
    } catch (e: any) { setError(e?.message || "Failed to delete."); }
  }

  async function onSaveBaseFilters(preset: QuickPresetRecord) {
    const pid = String(preset.id);
    const raw = bfDraft[pid] ?? "{}";
    try {
      const parsed = JSON.parse(raw);
      setBfError(prev => ({ ...prev, [pid]: "" }));
      await onUpdatePreset(preset, { base_filters: parsed });
    } catch {
      setBfError(prev => ({ ...prev, [pid]: "Invalid JSON." }));
    }
  }

  async function onAddFilter(preset: QuickPresetRecord) {
    const pid = String(preset.id);
    const draft = newFilter[pid] ?? {};
    const key        = (draft.key        ?? "").trim();
    const label      = (draft.label      ?? "").trim();
    const facet_name = (draft.facet_name ?? "").trim();
    if (!key || !label || !facet_name) return;
    try {
      await addDjangoPresetFilter(preset.id!, {
        key, label, facet_name,
        kind:        draft.kind        ?? "text",
        placeholder: draft.placeholder ?? "",
        sort_order:  (preset.filters?.length ?? 0) + 1,
      });
      await load();
      setNewFilter(prev => ({ ...prev, [pid]: {} }));
      setNotice(`Added filter "${label}".`); setError(null);
    } catch (e: any) { setError(e?.message || "Failed to add filter."); }
  }

  async function onDeleteFilter(id: number, label: string) {
    try {
      await deleteDjangoPresetFilter(id);
      await load();
      setNotice(`Removed filter "${label}".`); setError(null);
    } catch (e: any) { setError(e?.message || "Failed to remove filter."); }
  }

  if (!djangoMode) return (
    <div style={{ color: "#6b7280", fontSize: 14, padding: "4px 0" }}>
      Quicklinks preset management requires <code>VITE_QUICKLINKS_CONFIG_SOURCE=django</code>.
    </div>
  );

  return (
    <div style={{ display: "grid", gap: 16 }}>
      {notice && <Notice text={notice} type="success" />}
      {error  && <Notice text={error}  type="error" />}

      {/* New preset form */}
      <div style={S.card}>
        <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 14, color: "#111827" }}>New preset</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr auto", gap: 10, alignItems: "end" }}>
          <div>
            <div style={S.label}>Label</div>
            <input value={newLabel} onChange={e => setNewLabel(e.target.value)} onKeyDown={e => e.key === "Enter" && onCreatePreset()} style={S.input} placeholder="Equipment" />
          </div>
          <div>
            <div style={S.label}>Description</div>
            <input value={newDesc} onChange={e => setNewDesc(e.target.value)} onKeyDown={e => e.key === "Enter" && onCreatePreset()} style={S.input} placeholder="Optional description" />
          </div>
          <button onClick={onCreatePreset} disabled={!newLabel.trim()} style={{ ...S.btn, background: newLabel.trim() ? "#1d4ed8" : "#e5e7eb", color: newLabel.trim() ? "#fff" : "#9ca3af", border: "none", fontWeight: 600, height: 36 }}>
            Add
          </button>
        </div>
      </div>

      {/* Preset list */}
      {loading ? <div style={{ color: "#9ca3af", fontSize: 14 }}>Loading…</div>
        : presets.length === 0 ? <div style={{ color: "#9ca3af", fontSize: 14 }}>No presets yet.</div>
        : presets.map((preset, idx) => {
          const pid = String(preset.id);
          const nf  = newFilter[pid] ?? {};
          const bfRaw   = bfDraft[pid] ?? "{}";
          const bfErrMsg = bfError[pid] ?? "";

          return (
            <div key={pid} style={S.card}>
              {/* Header row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 100px auto", gap: 10, alignItems: "end" }}>
                <div>
                  <div style={S.label}>Label</div>
                  <input value={preset.label}
                    onChange={e => setPresets(prev => prev.map(p => p.id === preset.id ? { ...p, label: e.target.value } : p))}
                    onBlur={() => onUpdatePreset(preset, { label: preset.label, key: preset.key || slugify(preset.label) })}
                    style={S.input} />
                </div>
                <div>
                  <div style={S.label}>Order</div>
                  <input type="number" value={preset.sort_order ?? idx + 1}
                    onChange={e => setPresets(prev => prev.map(p => p.id === preset.id ? { ...p, sort_order: Number(e.target.value) } : p))}
                    onBlur={() => onUpdatePreset(preset, { sort_order: preset.sort_order })}
                    style={{ ...S.input, width: "100%" }} />
                </div>
                <div style={{ display: "flex", gap: 6, alignItems: "flex-end" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#374151", cursor: "pointer", paddingBottom: 4 }}>
                    <Toggle id={`preset-enabled-${pid}`} checked={preset.enabled ?? true}
                      onChange={v => { setPresets(prev => prev.map(p => p.id === preset.id ? { ...p, enabled: v } : p)); onUpdatePreset(preset, { enabled: v }); }} />
                    Active
                  </label>
                  <button onClick={() => onDeletePreset(preset)} style={{ ...S.btn, color: "#b91c1c", borderColor: "#fecaca", background: "#fff7f7", height: 36 }}>
                    Delete
                  </button>
                </div>
              </div>

              {/* Description */}
              <div style={{ marginTop: 10 }}>
                <div style={S.label}>Description</div>
                <input value={preset.description ?? ""}
                  onChange={e => setPresets(prev => prev.map(p => p.id === preset.id ? { ...p, description: e.target.value } : p))}
                  onBlur={() => onUpdatePreset(preset, { description: preset.description ?? "" })}
                  style={S.input} placeholder="Optional" />
              </div>

              {/* Base filters JSON */}
              <div style={{ marginTop: 14 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>
                    Base filters
                    <span style={S.hint as React.CSSProperties}> — always-applied DSpace facet filters (JSON)</span>
                  </div>
                  <button onClick={() => onSaveBaseFilters(preset)} style={{ ...S.btn, fontSize: 12, padding: "4px 10px" }}>Save</button>
                </div>
                <textarea value={bfRaw}
                  onChange={e => setBfDraft(prev => ({ ...prev, [pid]: e.target.value }))}
                  spellCheck={false}
                  style={{ ...S.input, fontFamily: "monospace", fontSize: 12, minHeight: 80, resize: "vertical", width: "100%" }}
                />
                {bfErrMsg && <div style={{ color: "#b91c1c", fontSize: 12, marginTop: 3 }}>{bfErrMsg}</div>}
                <div style={S.hint}>Example: <code style={{ background: "#f1f5f9", padding: "1px 4px", borderRadius: 3 }}>{`{"entityType": ["Equipment"]}`}</code></div>
              </div>

              {/* Filters */}
              <div style={{ marginTop: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Interactive facet filters</div>

                {/* Existing filters */}
                {(preset.filters ?? []).length > 0 && (
                  <div style={{ display: "grid", gap: 6, marginBottom: 10 }}>
                    {(preset.filters ?? []).sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)).map(f => (
                      <div key={f.id} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 8, padding: "8px 10px", background: "#f8fafc", borderRadius: 6, border: "1px solid #e5e7eb", alignItems: "center", fontSize: 13 }}>
                        <span><span style={{ fontWeight: 600 }}>{f.label}</span> <span style={{ color: "#9ca3af", fontSize: 11 }}>({f.key})</span></span>
                        <span style={{ color: "#6b7280", fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.facet_name}</span>
                        <span style={{ color: "#9ca3af", fontSize: 12 }}>{f.kind ?? "text"}{f.placeholder ? ` · "${f.placeholder}"` : ""}</span>
                        <button onClick={() => onDeleteFilter(f.id!, f.label)} style={{ ...S.btn, color: "#b91c1c", borderColor: "#fecaca", background: "#fff7f7", padding: "3px 8px", fontSize: 12 }}>×</button>
                      </div>
                    ))}
                  </div>
                )}
                {(preset.filters ?? []).length === 0 && <div style={{ ...S.hint, marginBottom: 8 }}>No filters yet.</div>}

                {/* Add filter */}
                <div style={{ padding: "12px", background: "#f8fafc", borderRadius: 8, border: "1px solid #e5e7eb" }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Add filter</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginBottom: 8 }}>
                    <div>
                      <div style={S.label}>Key <span style={{ color: "#9ca3af" }}>(unique)</span></div>
                      <input value={nf.key ?? ""} onChange={e => setNewFilter(prev => ({ ...prev, [pid]: { ...prev[pid], key: e.target.value } }))} style={S.input} placeholder="itemtype" />
                    </div>
                    <div>
                      <div style={S.label}>Label</div>
                      <input value={nf.label ?? ""} onChange={e => setNewFilter(prev => ({ ...prev, [pid]: { ...prev[pid], label: e.target.value } }))} style={S.input} placeholder="Type" />
                    </div>
                    <div>
                      <div style={S.label}>Facet name</div>
                      <input value={nf.facet_name ?? ""} onChange={e => setNewFilter(prev => ({ ...prev, [pid]: { ...prev[pid], facet_name: e.target.value } }))} style={S.input} placeholder="itemtype" />
                    </div>
                    <div>
                      <div style={S.label}>Kind</div>
                      <select value={nf.kind ?? "text"} onChange={e => setNewFilter(prev => ({ ...prev, [pid]: { ...prev[pid], kind: e.target.value as "text" | "date" } }))} style={S.input}>
                        {FILTER_KINDS.map(k => <option key={k} value={k}>{k}</option>)}
                      </select>
                    </div>
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <div style={S.label}>Placeholder <span style={{ color: "#9ca3af" }}>(optional)</span></div>
                    <input value={nf.placeholder ?? ""} onChange={e => setNewFilter(prev => ({ ...prev, [pid]: { ...prev[pid], placeholder: e.target.value } }))} style={{ ...S.input, maxWidth: 320 }} placeholder="Search…" />
                  </div>
                  <button
                    onClick={() => onAddFilter(preset)}
                    disabled={!(nf.key?.trim() && nf.label?.trim() && nf.facet_name?.trim())}
                    style={{ ...S.btn, background: (nf.key?.trim() && nf.label?.trim() && nf.facet_name?.trim()) ? "#1d4ed8" : "#e5e7eb", color: (nf.key?.trim() && nf.label?.trim() && nf.facet_name?.trim()) ? "#fff" : "#9ca3af", border: "none", fontWeight: 600 }}
                  >
                    Add filter
                  </button>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Root page
// ─────────────────────────────────────────────────────────────────────────────

type Tab = "general" | "clusters" | "quicklinks";

type AdminSettingsProps = {
  onQuicklinksToggle?: (enabled: boolean) => void;
  onCommunitiesCreationToggle?: (enabled: boolean) => void;
  onCommunitiesRoleManagementToggle?: (enabled: boolean) => void;
  onCollectionsCreationToggle?: (enabled: boolean) => void;
};

export function AdminSettingsPage({
  onQuicklinksToggle,
  onCommunitiesCreationToggle,
  onCommunitiesRoleManagementToggle,
  onCollectionsCreationToggle,
}: AdminSettingsProps) {
  const { isAdmin } = useAuth();
  const [tab, setTab] = React.useState<Tab>("general");

  if (!isAdmin) return (
    <div style={{ padding: "20px 24px", maxWidth: 900 }}>
      <h2 style={{ marginTop: 0 }}>Admin Settings</h2>
      <div style={{ color: "#b91c1c", fontSize: 14 }}>You must be a DSpace Administrator to access this page.</div>
    </div>
  );

  const TABS: Array<{ key: Tab; label: string }> = [
    { key: "general",    label: "General" },
    { key: "clusters",   label: "Dashboard Clusters" },
    { key: "quicklinks", label: "Quicklinks Presets" },
  ];

  return (
    <div style={{ padding: "20px 24px", maxWidth: 1100 }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#1a1a2e" }}>Admin Settings</h2>
        <p style={{ color: "#6b7280", marginTop: 6, marginBottom: 0, fontSize: 14 }}>
          Manage feature flags and configuration stored in Django.
        </p>
      </div>

      <div style={{ display: "flex", gap: 2, marginBottom: 24, borderBottom: "2px solid #e5e7eb", paddingBottom: 0 }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: "8px 18px", border: "none", borderRadius: "6px 6px 0 0",
            cursor: "pointer", fontSize: 13, fontWeight: tab === t.key ? 700 : 500,
            background: tab === t.key ? "#fff" : "transparent",
            color: tab === t.key ? "#1d4ed8" : "#6b7280",
            borderBottom: tab === t.key ? "2px solid #1d4ed8" : "2px solid transparent",
            marginBottom: -2,
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "general" && (
        <TabGeneral
          onQuicklinksToggle={onQuicklinksToggle}
          onCommunitiesCreationToggle={onCommunitiesCreationToggle}
          onCommunitiesRoleManagementToggle={onCommunitiesRoleManagementToggle}
          onCollectionsCreationToggle={onCollectionsCreationToggle}
        />
      )}
      {tab === "clusters"   && <TabClusters />}
      {tab === "quicklinks" && <TabQuicklinks />}
    </div>
  );
}
