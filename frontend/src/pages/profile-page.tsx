import React from "react";
import { apiFetch } from "../auth/client";
import { useAuth } from "../auth/AuthContext";
import type { EPerson } from "../auth/client";

// ── Full EPerson detail (per epersons.md REST contract) ───────────────────────

interface EPersonDetail extends EPerson {
  type: "eperson";
  groups?: string[];
}

interface SpecialGroup {
  id: string;
  uuid: string;
  name: string;
  permanent: boolean;
  type: string;
}

interface StatusDetail {
  okay: boolean;
  authenticated: boolean;
  _embedded?: {
    eperson?: EPersonDetail;
    specialGroups?: {
      _embedded?: { specialGroups?: SpecialGroup[] };
      page?: { totalElements: number };
    };
  };
}

async function fetchFullStatus(): Promise<StatusDetail> {
  return apiFetch<StatusDetail>("/api/authn/status");
}

async function fetchEPerson(uuid: string): Promise<EPersonDetail> {
  return apiFetch<EPersonDetail>(`/api/eperson/epersons/${uuid}`);
}

// ── UI helpers ────────────────────────────────────────────────────────────────

function MetaRow({
  label,
  value,
  mono,
}: {
  label: string;
  value?: string | null;
  mono?: boolean;
}) {
  if (!value) return null;
  return (
    <>
      <dt
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: "#6b7280",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          paddingTop: 1,
        }}
      >
        {label}
      </dt>
      <dd
        style={{
          fontSize: 13,
          color: "#111827",
          margin: 0,
          wordBreak: "break-word",
          fontFamily: mono ? "monospace" : undefined,
        }}
      >
        {value}
      </dd>
    </>
  );
}

function BoolRow({ label, value }: { label: string; value: boolean }) {
  return (
    <>
      <dt
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: "#6b7280",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          paddingTop: 1,
        }}
      >
        {label}
      </dt>
      <dd style={{ margin: 0 }}>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            padding: "1px 7px",
            borderRadius: 3,
            background: value ? "#f6ffed" : "#f3f4f6",
            color: value ? "#389e0d" : "#6b7280",
          }}
        >
          {value ? "Yes" : "No"}
        </span>
      </dd>
    </>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "10px 16px",
          background: "#f8fafc",
          borderBottom: "1px solid #e5e7eb",
          fontSize: 13,
          fontWeight: 700,
          color: "#374151",
        }}
      >
        {title}
      </div>
      <div style={{ padding: "14px 16px" }}>{children}</div>
    </div>
  );
}

function MetaGrid({ children }: { children: React.ReactNode }) {
  return (
    <dl
      style={{
        display: "grid",
        gridTemplateColumns: "160px 1fr",
        gap: "8px 14px",
        margin: 0,
      }}
    >
      {children}
    </dl>
  );
}

function Avatar({ name, email }: { name?: string | null; email?: string }) {
  const initials = name
    ? name
        .split(/\s+/)
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : (email?.[0]?.toUpperCase() ?? "?");

  return (
    <div
      style={{
        width: 64,
        height: 64,
        borderRadius: "50%",
        background: "linear-gradient(135deg, #6366f1 0%, #2563eb 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 24,
        fontWeight: 700,
        color: "#fff",
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}

// ── Metadata fields from eperson record ──────────────────────────────────────

function metaVal(ep: EPersonDetail, field: string): string | null {
  return ep.metadata?.[field]?.[0]?.value ?? null;
}

function metaAll(ep: EPersonDetail, field: string): string[] {
  return (ep.metadata?.[field] ?? []).map((v) => v.value);
}

// ── Main page ─────────────────────────────────────────────────────────────────

export function ProfilePage() {
  const { eperson: ctxEperson, refreshStatus, logout } = useAuth();

  const [detail, setDetail] = React.useState<EPersonDetail | null>(null);
  const [specialGroups, setSpecialGroups] = React.useState<SpecialGroup[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [loggingOut, setLoggingOut] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch full status (for specialGroups + fresh eperson embed)
        const status = await fetchFullStatus();
        if (cancelled) return;

        const embeddedEp = status._embedded?.eperson;
        const uuid = embeddedEp?.uuid ?? ctxEperson?.uuid;

        // Fetch full EPerson record for all metadata fields
        if (uuid) {
          const full = await fetchEPerson(uuid);
          if (!cancelled) setDetail(full);
        } else if (embeddedEp) {
          setDetail(embeddedEp as EPersonDetail);
        }

        const groups =
          status._embedded?.specialGroups?._embedded?.specialGroups ?? [];
        if (!cancelled) setSpecialGroups(groups);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [ctxEperson?.uuid]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      window.location.hash = "#/login";
    } finally {
      setLoggingOut(false);
    }
  };

  // ── Loading / error ───────────────────────────────────────────────────────

  if (loading) {
    return (
      <div style={{ padding: "40px 24px", color: "#888", fontSize: 14 }}>
        Loading profile…
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "20px 24px" }}>
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

  const ep = detail ?? (ctxEperson as EPersonDetail | null);
  if (!ep) return null;

  const displayName =
    metaVal(ep, "eperson.firstname") && metaVal(ep, "eperson.lastname")
      ? `${metaVal(ep, "eperson.firstname")} ${metaVal(ep, "eperson.lastname")}`
      : (ep.name ?? ep.email ?? "Unknown user");

  const phone = metaVal(ep, "eperson.phone");
  const language = metaVal(ep, "eperson.language");
  const orcid =
    metaVal(ep, "eperson.orcid") ?? metaVal(ep, "person.identifier.orcid");
  const fmtDate = (s?: string | null) => {
    if (!s) return null;
    const d = new Date(s);
    return isNaN(d.getTime()) ? s : d.toLocaleString();
  };

  return (
    <div style={{ padding: "24px", maxWidth: 720 }}>
      {/* ── Header card ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginBottom: 20,
          padding: "16px 20px",
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 10,
        }}
      >
        <Avatar name={displayName} email={ep.email} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2
            style={{
              margin: 0,
              fontSize: 20,
              fontWeight: 700,
              color: "#111827",
            }}
          >
            {displayName}
          </h2>
          {ep.email && (
            <div style={{ fontSize: 14, color: "#6b7280", marginTop: 2 }}>
              {ep.email}
            </div>
          )}
          <div
            style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}
          >
            {ep.canLogIn && (
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  padding: "1px 7px",
                  borderRadius: 3,
                  background: "#f6ffed",
                  color: "#389e0d",
                }}
              >
                Active
              </span>
            )}
            {ep.selfRegistered && (
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  padding: "1px 7px",
                  borderRadius: 3,
                  background: "#f0f9ff",
                  color: "#0284c7",
                }}
              >
                Self-registered
              </span>
            )}
            {ep.requireCertificate && (
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  padding: "1px 7px",
                  borderRadius: 3,
                  background: "#fffbe6",
                  color: "#ad6800",
                }}
              >
                Cert. required
              </span>
            )}
          </div>
        </div>

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          style={{
            padding: "8px 16px",
            fontSize: 13,
            fontWeight: 600,
            border: "1px solid #fca5a5",
            borderRadius: 6,
            background: loggingOut ? "#fef2f2" : "#fff",
            color: "#dc2626",
            cursor: loggingOut ? "not-allowed" : "pointer",
            opacity: loggingOut ? 0.7 : 1,
            flexShrink: 0,
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => {
            if (!loggingOut)
              (e.currentTarget as HTMLButtonElement).style.background =
                "#fef2f2";
          }}
          onMouseLeave={(e) => {
            if (!loggingOut)
              (e.currentTarget as HTMLButtonElement).style.background = "#fff";
          }}
        >
          {loggingOut ? "Signing out…" : "Sign out"}
        </button>
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        {/* ── Account details ── */}
        <Card title="Account Details">
          <MetaGrid>
            <MetaRow label="UUID" value={ep.uuid} mono />
            <MetaRow label="Email" value={ep.email} />
            <MetaRow label="Net ID" value={ep.netid} />
            <MetaRow label="Language" value={language} />
            <MetaRow label="Phone" value={phone} />
            {orcid && <MetaRow label="ORCID" value={orcid} />}
            <MetaRow label="Last active" value={fmtDate(ep.lastActive)} />
            <BoolRow label="Can log in" value={ep.canLogIn} />
            <BoolRow label="Self-registered" value={ep.selfRegistered} />
            <BoolRow label="Cert. required" value={ep.requireCertificate} />
          </MetaGrid>
        </Card>

        {/* ── Name metadata (from eperson.firstname / lastname) ── */}
        {(metaVal(ep, "eperson.firstname") ||
          metaVal(ep, "eperson.lastname")) && (
          <Card title="Name">
            <MetaGrid>
              <MetaRow
                label="First name"
                value={metaVal(ep, "eperson.firstname")}
              />
              <MetaRow
                label="Last name"
                value={metaVal(ep, "eperson.lastname")}
              />
            </MetaGrid>
          </Card>
        )}

        {/* ── Special groups ── */}
        {specialGroups.length > 0 && (
          <Card title={`Special Groups (${specialGroups.length})`}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {specialGroups.map((g) => (
                <div
                  key={g.uuid}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "6px 10px",
                    borderRadius: 6,
                    background: "#f8fafc",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <span style={{ fontSize: 16 }}>👥</span>
                  <div>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: 13,
                        color: "#111827",
                      }}
                    >
                      {g.name}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "#9ca3af",
                        fontFamily: "monospace",
                      }}
                    >
                      {g.uuid}
                    </div>
                  </div>
                  {g.permanent && (
                    <span
                      style={{
                        marginLeft: "auto",
                        fontSize: 11,
                        fontWeight: 600,
                        padding: "1px 6px",
                        borderRadius: 3,
                        background: "#eef2ff",
                        color: "#4338ca",
                      }}
                    >
                      Permanent
                    </span>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* ── All metadata (raw, grouped by namespace) ── */}
        {ep.metadata && Object.keys(ep.metadata).length > 0 && (
          <AllMetadataCard ep={ep} />
        )}

        {/* ── Links ── */}
        <Card title="API Links">
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {Object.entries(ep._links ?? {}).map(([rel, link]) => (
              <div
                key={rel}
                style={{
                  display: "flex",
                  gap: 8,
                  fontSize: 12,
                  alignItems: "baseline",
                }}
              >
                <span
                  style={{
                    fontWeight: 600,
                    color: "#6366f1",
                    minWidth: 140,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    fontSize: 10,
                  }}
                >
                  {rel}
                </span>
                <a
                  href={(link as any).href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#2563eb", wordBreak: "break-all" }}
                >
                  {(link as any).href}
                </a>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ── Collapsible raw metadata section ─────────────────────────────────────────

function AllMetadataCard({ ep }: { ep: EPersonDetail }) {
  const [open, setOpen] = React.useState(false);

  // Group by namespace
  const grouped: Record<string, Array<[string, string[]]>> = {};
  for (const [field, vals] of Object.entries(ep.metadata)) {
    const prefix = field.split(".")[0];
    if (!grouped[prefix]) grouped[prefix] = [];
    grouped[prefix].push([field, (vals as any[]).map((v) => v.value)]);
  }

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
          padding: "10px 16px",
          background: open ? "#fafafa" : "#f8fafc",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>
          All Metadata
        </span>
        <span
          style={{
            fontSize: 11,
            color: "#bbb",
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 0.15s",
            display: "inline-block",
          }}
        >
          ▼
        </span>
      </button>
      {open && (
        <div style={{ padding: "12px 16px", borderTop: "1px solid #e5e7eb" }}>
          {Object.keys(grouped)
            .sort()
            .map((prefix) => (
              <div key={prefix} style={{ marginBottom: 14 }}>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#6366f1",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: 6,
                    borderBottom: "1px solid #e5e7eb",
                    paddingBottom: 3,
                  }}
                >
                  {prefix}.*
                </div>
                <dl
                  style={{
                    display: "grid",
                    gridTemplateColumns: "200px 1fr",
                    gap: "6px 12px",
                    margin: 0,
                  }}
                >
                  {grouped[prefix].map(([field, values]) => (
                    <React.Fragment key={field}>
                      <dt
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: "#6b7280",
                          paddingTop: 1,
                        }}
                      >
                        {field}
                      </dt>
                      <dd style={{ fontSize: 13, color: "#111827", margin: 0 }}>
                        {values.length === 1 ? (
                          values[0]
                        ) : (
                          <ul style={{ margin: 0, paddingLeft: 16 }}>
                            {values.map((v, i) => (
                              <li key={i}>{v}</li>
                            ))}
                          </ul>
                        )}
                      </dd>
                    </React.Fragment>
                  ))}
                </dl>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
