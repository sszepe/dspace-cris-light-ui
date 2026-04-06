import React from "react";
import { useAuth } from "../auth/AuthContext";
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

// ── Helpers ───────────────────────────────────────────────────────────────────

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "cluster";
}

function clusterEntityTypeLabels(cluster: ClusterConfig): string[] {
  return (cluster.entity_types ?? []).map((x) => x.entity_type_label);
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
  fontSize: 14,
  boxSizing: "border-box",
};

const btnStyle: React.CSSProperties = {
  padding: "7px 12px",
  border: "1px solid #d1d5db",
  borderRadius: 6,
  background: "#f9fafb",
  cursor: "pointer",
  fontSize: 13,
};

// ── Component ─────────────────────────────────────────────────────────────────

export function AdminClustersPage() {
  const { isAdmin, entityTypes } = useAuth();
  const [clusters, setClusters] = React.useState<ClusterConfig[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [notice, setNotice] = React.useState<string | null>(null);
  const [newLabel, setNewLabel] = React.useState("");
  const [newDescription, setNewDescription] = React.useState("");
  const [selectedEntityType, setSelectedEntityType] = React.useState<
    Record<string, string>
  >({});

  const djangoEnabled = getClusterConfigSource() === "django";

  // ── Load ──────────────────────────────────────────────────────────────────

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await listDjangoClusters();
      setClusters(
        [...data].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
      );
      setError(null);
    } catch (err: any) {
      setError(err?.message || "Failed to load clusters");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (djangoEnabled && isAdmin) {
      load();
    } else {
      setLoading(false);
    }
  }, [djangoEnabled, isAdmin, load]);

  const availableEntityTypes = React.useMemo(
    () => [...entityTypes].sort((a, b) => a.label.localeCompare(b.label)),
    [entityTypes],
  );

  // ── Auto-clear notice ─────────────────────────────────────────────────────

  React.useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 4000);
    return () => clearTimeout(t);
  }, [notice]);

  // ── Actions ───────────────────────────────────────────────────────────────

  async function onCreateCluster() {
    const label = newLabel.trim();
    if (!label) return;
    try {
      const created = await createDjangoCluster({
        key: slugify(label),
        label,
        description: newDescription.trim() || undefined,
        sort_order: clusters.length + 1,
        enabled: true,
      });
      setClusters((prev) =>
        [...prev, created].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
      );
      setNewLabel("");
      setNewDescription("");
      setNotice(`Created cluster "${label}".`);
      setError(null);
    } catch (err: any) {
      setError(err?.message || "Failed to create cluster");
    }
  }

  async function onUpdateCluster(cluster: ClusterConfig, patch: Partial<ClusterConfig>) {
    try {
      const updated = await updateDjangoCluster(cluster.id!, patch);
      setClusters((prev) =>
        prev.map((c) => (c.id === cluster.id ? { ...c, ...updated } : c)),
      );
      setNotice(`Updated "${updated.label}".`);
      setError(null);
    } catch (err: any) {
      setError(err?.message || "Failed to update cluster");
    }
  }

  async function onDeleteCluster(cluster: ClusterConfig) {
    if (!window.confirm(`Delete cluster "${cluster.label}"?`)) return;
    try {
      await deleteDjangoCluster(cluster.id!);
      setClusters((prev) => prev.filter((c) => c.id !== cluster.id));
      setNotice(`Deleted "${cluster.label}".`);
      setError(null);
    } catch (err: any) {
      setError(err?.message || "Failed to delete cluster");
    }
  }

  async function onAddEntityType(cluster: ClusterConfig) {
    const picked = selectedEntityType[String(cluster.id)] || "";
    if (!picked) return;
    try {
      await addDjangoClusterEntityType(
        cluster.id!,
        picked,
        (cluster.entity_types?.length ?? 0) + 1,
      );
      await load();
      setSelectedEntityType((prev) => ({ ...prev, [String(cluster.id)]: "" }));
      setNotice(`Added "${picked}" to "${cluster.label}".`);
      setError(null);
    } catch (err: any) {
      setError(err?.message || "Failed to add entity type");
    }
  }

  async function onRemoveEntityType(id: number | string, label: string) {
    try {
      await deleteDjangoClusterEntityType(id);
      await load();
      setNotice(`Removed "${label}".`);
      setError(null);
    } catch (err: any) {
      setError(err?.message || "Failed to remove entity type");
    }
  }

  // ── Guard: django disabled ─────────────────────────────────────────────────

  if (!djangoEnabled) {
    return (
      <div style={{ padding: "20px 24px", maxWidth: 900 }}>
        <h2 style={{ marginTop: 0 }}>Manage Clusters</h2>
        <div style={{ color: "#6b7280", fontSize: 14 }}>
          Cluster management requires{" "}
          <code>VITE_CLUSTER_CONFIG_SOURCE=django</code>.
        </div>
      </div>
    );
  }

  // ── Guard: not admin ───────────────────────────────────────────────────────

  if (!isAdmin) {
    return (
      <div style={{ padding: "20px 24px", maxWidth: 900 }}>
        <h2 style={{ marginTop: 0 }}>Manage Clusters</h2>
        <div style={{ color: "#b91c1c", fontSize: 14 }}>
          You must be a DSpace Administrator to manage clusters.
        </div>
      </div>
    );
  }

  // ── Main UI ────────────────────────────────────────────────────────────────

  return (
    <div style={{ padding: "20px 24px", maxWidth: 1100 }}>
      {/* Page header */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#1a1a2e" }}>
          Manage Clusters
        </h2>
        <p style={{ color: "#6b7280", marginTop: 6, marginBottom: 0, fontSize: 14 }}>
          Create dashboard clusters and assign authorized entity types. Changes
          are stored in Django.
        </p>
        {notice && (
          <div
            style={{
              marginTop: 8,
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
        {error && (
          <div
            style={{
              marginTop: 8,
              color: "#b91c1c",
              fontSize: 13,
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: 6,
              padding: "7px 12px",
            }}
          >
            {error}
          </div>
        )}
      </div>

      {/* Create form */}
      <div style={{ ...card, marginBottom: 16 }}>
        <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 14 }}>
          New cluster
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 2fr auto",
            gap: 10,
            alignItems: "end",
          }}
        >
          <div>
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 5 }}>
              Label
            </div>
            <input
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onCreateCluster()}
              style={inputStyle}
              placeholder="Research"
            />
          </div>
          <div>
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 5 }}>
              Description
            </div>
            <input
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onCreateCluster()}
              style={inputStyle}
              placeholder="Research-related outputs and activities"
            />
          </div>
          <button
            onClick={onCreateCluster}
            disabled={!newLabel.trim()}
            style={{
              ...btnStyle,
              height: 38,
              background: newLabel.trim() ? "#1d4ed8" : "#e5e7eb",
              color: newLabel.trim() ? "#fff" : "#9ca3af",
              border: "none",
              fontWeight: 600,
            }}
          >
            Add cluster
          </button>
        </div>
      </div>

      {/* Cluster list */}
      {loading ? (
        <div style={{ color: "#9ca3af", fontSize: 14 }}>Loading…</div>
      ) : clusters.length === 0 ? (
        <div style={{ color: "#9ca3af", fontSize: 14 }}>
          No clusters yet. Create one above.
        </div>
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          {clusters.map((cluster, index) => {
            const usedLabels = new Set(clusterEntityTypeLabels(cluster));
            const remaining = availableEntityTypes.filter(
              (et) => !usedLabels.has(et.label),
            );
            const clusterId = String(cluster.id);

            return (
              <div key={clusterId} style={card}>
                {/* Top row: label / order / delete */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 110px auto",
                    gap: 10,
                    alignItems: "end",
                  }}
                >
                  <div>
                    <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 5 }}>
                      Label
                    </div>
                    <input
                      value={cluster.label}
                      onChange={(e) =>
                        setClusters((prev) =>
                          prev.map((c) =>
                            c.id === cluster.id
                              ? { ...c, label: e.target.value }
                              : c,
                          ),
                        )
                      }
                      onBlur={() =>
                        onUpdateCluster(cluster, {
                          label: cluster.label,
                          key: cluster.key || slugify(cluster.label),
                        })
                      }
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 5 }}>
                      Order
                    </div>
                    <input
                      type="number"
                      value={cluster.sort_order ?? index + 1}
                      onChange={(e) =>
                        setClusters((prev) =>
                          prev.map((c) =>
                            c.id === cluster.id
                              ? { ...c, sort_order: Number(e.target.value) }
                              : c,
                          ),
                        )
                      }
                      onBlur={() =>
                        onUpdateCluster(cluster, {
                          sort_order: cluster.sort_order ?? index + 1,
                        })
                      }
                      style={{ ...inputStyle, width: "100%" }}
                    />
                  </div>
                  <button
                    onClick={() => onDeleteCluster(cluster)}
                    style={{
                      ...btnStyle,
                      color: "#b91c1c",
                      borderColor: "#fecaca",
                      background: "#fff7f7",
                      height: 38,
                      alignSelf: "end",
                    }}
                  >
                    Delete
                  </button>
                </div>

                {/* Description */}
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 5 }}>
                    Description
                  </div>
                  <input
                    value={cluster.description ?? ""}
                    onChange={(e) =>
                      setClusters((prev) =>
                        prev.map((c) =>
                          c.id === cluster.id
                            ? { ...c, description: e.target.value }
                            : c,
                        ),
                      )
                    }
                    onBlur={() =>
                      onUpdateCluster(cluster, {
                        description: cluster.description ?? "",
                      })
                    }
                    style={inputStyle}
                    placeholder="Optional description"
                  />
                </div>

                {/* Entity types */}
                <div style={{ marginTop: 16 }}>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: 13,
                      marginBottom: 8,
                      color: "#374151",
                    }}
                  >
                    Assigned entity types
                  </div>

                  {(cluster.entity_types?.length ?? 0) === 0 ? (
                    <div style={{ color: "#9ca3af", fontSize: 13 }}>
                      No entity types assigned yet.
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {(cluster.entity_types ?? [])
                        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
                        .map((entry) => (
                          <span
                            key={String(entry.id ?? entry.entity_type_label)}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 5,
                              fontSize: 12,
                              padding: "4px 8px",
                              borderRadius: 999,
                              background: "#eef2ff",
                              color: "#3730a3",
                              fontWeight: 500,
                            }}
                          >
                            {entry.entity_type_label}
                            {entry.id != null && (
                              <button
                                onClick={() =>
                                  onRemoveEntityType(
                                    entry.id!,
                                    entry.entity_type_label,
                                  )
                                }
                                style={{
                                  background: "none",
                                  border: "none",
                                  color: "#6366f1",
                                  cursor: "pointer",
                                  fontSize: 13,
                                  lineHeight: 1,
                                  padding: 0,
                                }}
                                title={`Remove ${entry.entity_type_label}`}
                              >
                                ×
                              </button>
                            )}
                          </span>
                        ))}
                    </div>
                  )}

                  {/* Add entity type row */}
                  <div
                    style={{
                      marginTop: 10,
                      display: "flex",
                      gap: 8,
                      alignItems: "center",
                    }}
                  >
                    <select
                      value={selectedEntityType[clusterId] || ""}
                      onChange={(e) =>
                        setSelectedEntityType((prev) => ({
                          ...prev,
                          [clusterId]: e.target.value,
                        }))
                      }
                      style={{ ...inputStyle, maxWidth: 280 }}
                    >
                      <option value="">Add entity type…</option>
                      {remaining.map((et) => (
                        <option key={et.id} value={et.label}>
                          {et.label}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => onAddEntityType(cluster)}
                      disabled={!selectedEntityType[clusterId]}
                      style={{
                        ...btnStyle,
                        background: selectedEntityType[clusterId]
                          ? "#1d4ed8"
                          : "#e5e7eb",
                        color: selectedEntityType[clusterId] ? "#fff" : "#9ca3af",
                        border: "none",
                        fontWeight: 600,
                      }}
                    >
                      Assign
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
