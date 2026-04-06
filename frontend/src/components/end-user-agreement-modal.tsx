import React from "react";
import { apiFetch } from "../auth/client";

// ── Feature flags ─────────────────────────────────────────────────────────────

/** Master switch — set VITE_ENABLE_END_USER_AGREEMENT=true to activate. */
export function isEndUserAgreementEnabled(): boolean {
  return (
    String(import.meta.env.VITE_ENABLE_END_USER_AGREEMENT ?? "false").toLowerCase() === "true"
  );
}

/** Set VITE_ENABLE_PRIVACY_STATEMENT=true to show the privacy notice. */
export function isPrivacyStatementEnabled(): boolean {
  return (
    String(import.meta.env.VITE_ENABLE_PRIVACY_STATEMENT ?? "false").toLowerCase() === "true"
  );
}

// ── API helpers ───────────────────────────────────────────────────────────────

/** dc.rights value from /api/core/sites — the Terms of Use text (may be markdown). */
export async function fetchTermsOfUse(lang = "en"): Promise<string | null> {
  try {
    const data = await apiFetch<any>("/api/core/sites?projection=allLanguages");
    const site = data?._embedded?.sites?.[0];
    const rights: Array<{ value: string; language: string }> =
      site?.metadata?.["dc.rights"] ?? [];

    // Try requested language first, then English, then first non-empty value
    const match =
      rights.find((r) => r.language === lang && r.value.trim()) ??
      rights.find((r) => r.language === "en" && r.value.trim()) ??
      rights.find((r) => r.value.trim());

    return match?.value.trim() || null;
  } catch {
    return null;
  }
}

/** Returns true if the eperson has already accepted the end-user agreement. */
export function hasAcceptedAgreement(
  metadata: Record<string, Array<{ value: string }>> | undefined,
): boolean {
  const val = metadata?.["dspace.agreements.end-user"]?.[0]?.value;
  return val === "true";
}

/** PATCH the eperson to record agreement acceptance. */
export async function acceptAgreement(epersonId: string): Promise<void> {
  await apiFetch(`/api/eperson/epersons/${epersonId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify([
      {
        op: "add",
        path: "/metadata/dspace.agreements.end-user",
        value: [{ value: "true" }],
      },
    ]),
  });
}

// ── Simple markdown renderer ──────────────────────────────────────────────────
// Handles headings, bold, italic, links, line breaks — no external dependency.

function renderMarkdown(text: string): React.ReactNode[] {
  const lines = text.split(/\r?\n/);
  const nodes: React.ReactNode[] = [];

  lines.forEach((line, i) => {
    // Heading
    const h = line.match(/^(#{1,4})\s+(.+)/);
    if (h) {
      const level = h[1].length as 1 | 2 | 3 | 4;
      const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4";
      nodes.push(
        <Tag key={i} style={{ margin: "12px 0 4px", fontSize: level === 1 ? 18 : level === 2 ? 16 : 14 }}>
          {inlineMarkdown(h[2])}
        </Tag>,
      );
      return;
    }
    // Blank line → spacer
    if (!line.trim()) {
      nodes.push(<div key={i} style={{ height: 8 }} />);
      return;
    }
    // Normal paragraph line
    nodes.push(
      <p key={i} style={{ margin: "2px 0", lineHeight: 1.6 }}>
        {inlineMarkdown(line)}
      </p>,
    );
  });

  return nodes;
}

function inlineMarkdown(text: string): React.ReactNode[] {
  // Split on **bold**, *italic*, [label](url)
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      return (
        <a key={i} href={link[2]} target="_blank" rel="noopener noreferrer"
           style={{ color: "var(--color-primary, #1e40af)" }}>
          {link[1]}
        </a>
      );
    }
    return part;
  });
}

// ── Modal component ───────────────────────────────────────────────────────────

type Props = {
  epersonId: string;
  onAccepted: () => void;
};

export function EndUserAgreementModal({ epersonId, onAccepted }: Props) {
  const [terms, setTerms] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [accepting, setAccepting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [checked, setChecked] = React.useState(false);

  const privacyEnabled = isPrivacyStatementEnabled();

  React.useEffect(() => {
    fetchTermsOfUse()
      .then(setTerms)
      .finally(() => setLoading(false));
  }, []);

  const handleAccept = async () => {
    setAccepting(true);
    setError(null);
    try {
      await acceptAgreement(epersonId);
      onAccepted();
    } catch (e: any) {
      setError(e?.message ?? "Failed to record agreement. Please try again.");
      setAccepting(false);
    }
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(0,0,0,0.55)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 16,
    }}>
      <div style={{
        background: "#fff",
        borderRadius: 10,
        boxShadow: "0 8px 40px rgba(0,0,0,0.22)",
        width: "100%", maxWidth: 620,
        display: "flex", flexDirection: "column",
        maxHeight: "90vh",
        overflow: "hidden",
      }}>

        {/* ── Header ── */}
        <div style={{
          padding: "20px 24px 16px",
          borderBottom: "1px solid #e5e7eb",
          flexShrink: 0,
        }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#111827" }}>
            Terms of Use
          </h2>
          <p style={{ margin: "6px 0 0", fontSize: 13, color: "#6b7280" }}>
            Please read and accept the terms of use to continue.
          </p>
        </div>

        {/* ── Terms body ── */}
        <div style={{
          flex: 1, overflowY: "auto",
          padding: "16px 24px",
          fontSize: 13, color: "#374151",
        }}>
          {loading && (
            <p style={{ color: "#6b7280" }}>Loading terms of use…</p>
          )}
          {!loading && terms && renderMarkdown(terms)}
          {!loading && !terms && (
            <p style={{ color: "#6b7280", fontStyle: "italic" }}>
              No terms of use text has been configured for this DSpace instance.
            </p>
          )}
        </div>

        {/* ── Privacy notice ── */}
        {privacyEnabled && (
          <div style={{
            padding: "10px 24px",
            background: "#f8fafc",
            borderTop: "1px solid #e5e7eb",
            fontSize: 12, color: "#6b7280",
            flexShrink: 0,
          }}>
            <strong style={{ color: "#374151" }}>Privacy notice:</strong>{" "}
            We collect and process your personal information for the following purposes:
            Authentication, Preferences, Acknowledgement and Statistics.
          </div>
        )}

        {/* ── Checkbox + actions ── */}
        <div style={{
          padding: "14px 24px 20px",
          borderTop: "1px solid #e5e7eb",
          flexShrink: 0,
        }}>
          <label style={{
            display: "flex", alignItems: "flex-start", gap: 10,
            cursor: "pointer", marginBottom: 14,
          }}>
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
              style={{ marginTop: 2, width: 16, height: 16, flexShrink: 0, cursor: "pointer" }}
            />
            <span style={{ fontSize: 13, color: "#374151" }}>
              I have read and agree to the terms of use
              {privacyEnabled && " and the privacy statement"}.
            </span>
          </label>

          {error && (
            <p style={{
              margin: "0 0 10px",
              color: "#b91c1c", fontSize: 12,
              background: "#fef2f2", border: "1px solid #fecaca",
              borderRadius: 5, padding: "6px 10px",
            }}>
              {error}
            </p>
          )}

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={handleAccept}
              disabled={!checked || accepting || loading}
              style={{
                padding: "9px 24px",
                background: checked && !accepting ? "var(--color-primary, #1e40af)" : "#d1d5db",
                color: checked && !accepting ? "#fff" : "#9ca3af",
                border: "none", borderRadius: 6,
                fontSize: 14, fontWeight: 600,
                cursor: checked && !accepting ? "pointer" : "not-allowed",
                transition: "background 0.15s",
              }}
            >
              {accepting ? "Saving…" : "Accept & Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
