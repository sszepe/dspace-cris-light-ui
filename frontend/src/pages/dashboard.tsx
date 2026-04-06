import React from "react";
import { useAuth } from "../auth/AuthContext";
import {
  loadClusterConfig,
  resolveClusters,
  type ResolvedCluster,
  type DjangoAuthDiagnostics,
} from "../config/dashboard-config";
import { routes } from "../navigation/hash";

// ── Styles ────────────────────────────────────────────────────────────────────

const clusterCard: React.CSSProperties = {
  border: "1px solid #e5e7eb",
  borderRadius: 10,
  background: "#fff",
  padding: 16,
};

// ── Diagnostic panel ──────────────────────────────────────────────────────────

function DiagRow({ label, ok, value }: { label: string; ok?: boolean; value: React.ReactNode }) {
  return (
    <tr>
      <td style={{ padding: "3px 10px 3px 0", color: "#6b7280", whiteSpace: "nowrap", verticalAlign: "top" }}>
        {label}
      </td>
      <td style={{ padding: "3px 0", verticalAlign: "top" }}>
        {ok === true  && <span style={{ color: "#16a34a", marginRight: 6 }}>✅</span>}
        {ok === false && <span style={{ color: "#dc2626", marginRight: 6 }}>❌</span>}
        <span style={{ fontFamily: "monospace", fontSize: 12 }}>{value}</span>
      </td>
    </tr>
  );
}

function DiagPanel({
  source,
  error,
  diag,
}: {
  source: "ts" | "django";
  error: string | null;
  diag: DjangoAuthDiagnostics | null | undefined;
}) {
  const [open, setOpen] = React.useState(true);

  // Only show when Django mode is configured but not working
  if (source === "django" && !error) return null;

  return (
    <div
      style={{
        marginTop: 12,
        border: "1px solid #fbbf24",
        borderRadius: 8,
        background: "#fffbeb",
        fontSize: 13,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 12px",
          cursor: "pointer",
          userSelect: "none",
        }}
        onClick={() => setOpen((o) => !o)}
      >
        <strong style={{ color: "#92400e" }}>
          ⚠️ Django config API not active — fell back to TypeScript config
        </strong>
        <span style={{ color: "#92400e", fontSize: 11 }}>{open ? "▲ hide" : "▼ show"}</span>
      </div>

      {open && (
        <div style={{ padding: "0 12px 12px" }}>
          {error && (
            <div
              style={{
                marginBottom: 8,
                color: "#b91c1c",
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: 6,
                padding: "6px 10px",
                fontFamily: "monospace",
                fontSize: 12,
                wordBreak: "break-all",
              }}
            >
              {error}
            </div>
          )}

          {diag === null && (
            <p style={{ color: "#92400e", margin: "4px 0" }}>
              <code>/debug/auth/</code> endpoint not reachable — Django may be down,{" "}
              <code>DEBUG=False</code>, or the endpoint is not yet registered.
            </p>
          )}

          {diag && (
            <table style={{ borderCollapse: "collapse", width: "100%" }}>
              <tbody>
                <DiagRow label="Django reachable"       ok={diag.django_reachable}           value={String(diag.django_reachable)} />
                <DiagRow label="DSPACE_BASE_URL"                                             value={diag.dspace_base_url} />
                <DiagRow label="DSpace reachable"       ok={diag.dspace_reachable}           value={String(diag.dspace_reachable)} />
                <DiagRow label="DSpace HTTP status"                                          value={diag.dspace_status_code ?? "—"} />
                <DiagRow label="DSpace authenticated"   ok={diag.dspace_authenticated === true}
                                                                                             value={diag.dspace_authenticated === null ? "—" : String(diag.dspace_authenticated)} />
                <DiagRow label="JWT in browser"         ok={!!diag.frontend_jwt_in_storage}  value={diag.frontend_jwt_in_storage ? "yes" : "no — auth may not have completed yet"} />
                <DiagRow label="JWT received by Django" ok={diag.jwt_received}               value={diag.jwt_received ? (diag.jwt_preview ?? "yes") : "no — Authorization header missing"} />
                {diag.auth_error && (
                  <DiagRow label="Auth error"           ok={false}                           value={diag.auth_error} />
                )}
                <DiagRow label="Frontend base URL"                                           value={diag.frontend_base_url ?? "—"} />
                <DiagRow label="Settings module"                                             value={diag.settings_module ?? "—"} />
              </tbody>
            </table>
          )}

          <p style={{ marginTop: 8, marginBottom: 0, color: "#78350f", fontSize: 12 }}>
            Check <code>VITE_DJANGO_CONFIG_API_BASE_URL</code> in your <code>.env.local</code>,
            and <code>DSPACE_BASE_URL</code> in your Django container environment.
          </p>
        </div>
      )}
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

export function Dashboard() {
  const { username, entityTypes, canCreate, isAuthenticated, isLoading: authLoading } = useAuth();
  const [source, setSource] = React.useState<"ts" | "django">("ts");
  const [clusters, setClusters] = React.useState<ResolvedCluster[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [diagnostics, setDiagnostics] = React.useState<DjangoAuthDiagnostics | null | undefined>(undefined);

  React.useEffect(() => {
    // Wait until auth has finished so the JWT is in sessionStorage before we
    // call the Django API — otherwise we get 401 and silently fall back to TS.
    if (authLoading || !isAuthenticated) return;

    let cancelled = false;
    setLoading(true);
    loadClusterConfig()
      .then((result) => {
        if (cancelled) return;
        setSource(result.source);
        setClusters(resolveClusters(entityTypes, result.clusters));
        setDiagnostics(result.diagnostics);
        setError(null);
      })
      .catch((err: any) => {
        if (cancelled) return;
        setError(err?.message || "Failed to load cluster configuration");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [authLoading, isAuthenticated, entityTypes]);

  const handleCreate = (entityLabel: string) => {
    window.location.hash = routes.quicklinksPreset(entityLabel.toLowerCase());
  };

  return (
    <div style={{ padding: "20px 24px", maxWidth: 1100 }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#1a1a2e" }}>
          Dashboard
        </h2>
        <p style={{ color: "#6b7280", marginTop: 6, marginBottom: 0, fontSize: 14 }}>
          Welcome{username ? `, ${username}` : ""}. Select what you want to create.
        </p>
        <div style={{ marginTop: 6, fontSize: 12, color: "#9ca3af" }}>
          Cluster source:{" "}
          <strong style={{ color: source === "django" ? "#16a34a" : "#6b7280" }}>
            {source === "django" ? "Django ✅" : "TypeScript"}
          </strong>
        </div>

        {/* Diagnostic panel — only shown when Django mode is configured but not working */}
        {import.meta.env.VITE_CLUSTER_CONFIG_SOURCE === "django" && (
          <DiagPanel source={source} error={error} diag={diagnostics} />
        )}
      </div>

      {(authLoading || loading) ? (
        <div style={{ color: "#9ca3af", fontSize: 14 }}>Loading clusters…</div>
      ) : clusters.length === 0 ? (
        <div style={{ color: "#9ca3af", fontSize: 14 }}>
          No entity types are currently authorized for your account.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 16,
          }}
        >
          {clusters.map((cluster) => (
            <div key={cluster.key} style={clusterCard}>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 2, color: "#1a1a2e" }}>
                {cluster.label}
              </div>
              {cluster.description && (
                <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 12 }}>
                  {cluster.description}
                </div>
              )}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {cluster.items.map((entity) => {
                  const creatable = canCreate(entity.label);
                  return (
                    <button
                      key={entity.id}
                      disabled={!creatable}
                      title={
                        creatable
                          ? `Create ${entity.label}`
                          : `You don't have submit permission for ${entity.label}`
                      }
                      style={{
                        padding: "5px 10px",
                        border: creatable ? "1px solid #d1d5db" : "1px solid #e5e7eb",
                        borderRadius: 6,
                        background: creatable ? "#f9fafb" : "#f3f4f6",
                        cursor: creatable ? "pointer" : "not-allowed",
                        fontSize: 13,
                        color: creatable ? "#374151" : "#9ca3af",
                        transition: "background 0.1s",
                        opacity: creatable ? 1 : 0.65,
                      }}
                      onClick={() => creatable && handleCreate(entity.label)}
                      onMouseEnter={(e) => {
                        if (creatable)
                          (e.target as HTMLButtonElement).style.background = "#eff6ff";
                      }}
                      onMouseLeave={(e) => {
                        if (creatable)
                          (e.target as HTMLButtonElement).style.background = "#f9fafb";
                      }}
                    >
                      {entity.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
