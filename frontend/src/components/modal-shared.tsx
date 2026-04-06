/**
 * modal-shared.tsx
 *
 * Shared UI primitives for creation modals: Button, Labeled, inputStyle,
 * TypeaheadField, and a reusable modal shell (ModalShell).
 *
 * All modals import from here to stay consistent.
 */

import React from "react";

// ── Styles ────────────────────────────────────────────────────────────────────

export const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  border: "1px solid #d1d5db",
  borderRadius: 8,
  padding: "9px 10px",
  fontSize: 14,
  background: "#fff",
  outline: "none",
};

export const labelStyle: React.CSSProperties = {
  display: "grid",
  gap: 6,
  fontSize: 13,
  color: "#374151",
};

// ── Button ────────────────────────────────────────────────────────────────────

export function Button({
  children,
  onClick,
  kind = "default",
  disabled = false,
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  kind?: "default" | "primary" | "danger";
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  const bg =
    kind === "primary" ? "#2563eb" : kind === "danger" ? "#dc2626" : "#fff";
  const border =
    kind === "primary"
      ? "1px solid #2563eb"
      : kind === "danger"
        ? "1px solid #dc2626"
        : "1px solid #d1d5db";
  const color = kind !== "default" ? "#fff" : "#374151";

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={{
        padding: "9px 14px",
        borderRadius: 8,
        border,
        background: bg,
        color,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.65 : 1,
        fontSize: 13,
        fontWeight: 600,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </button>
  );
}

// ── Labeled ───────────────────────────────────────────────────────────────────

export function Labeled({
  label,
  required,
  hint,
  error,
  children,
  span,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string | null;
  children: React.ReactNode;
  /** gridColumn span — pass "full" for 1 / -1 */
  span?: "full";
}) {
  return (
    <label
      style={{
        ...labelStyle,
        gridColumn: span === "full" ? "1 / -1" : undefined,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <span>
          {label}
          {required && (
            <span style={{ color: "#dc2626", marginLeft: 2 }}>*</span>
          )}
        </span>
        {hint && (
          <span style={{ color: "#9ca3af", fontSize: 11 }}>{hint}</span>
        )}
      </div>
      {children}
      {error && (
        <div style={{ color: "#dc2626", fontSize: 12 }}>{error}</div>
      )}
    </label>
  );
}

// ── TypeaheadField ────────────────────────────────────────────────────────────

export type AuthorityOption = {
  id: string;
  label: string;
  subtitle?: string;
  entityType?: string | null;
  dcType?: string | null;
};

export function TypeaheadField({
  label,
  required,
  placeholder,
  value,
  onChange,
  onSearch,
  error,
  span,
  hint,
}: {
  label: string;
  required?: boolean;
  placeholder: string;
  value: AuthorityOption | null;
  onChange: (next: AuthorityOption | null) => void;
  onSearch: (query: string) => Promise<AuthorityOption[]>;
  error?: string | null;
  span?: "full";
  hint?: string;
}) {
  const [query, setQuery] = React.useState(value?.label ?? "");
  const [results, setResults] = React.useState<AuthorityOption[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep query in sync when value is set externally (e.g. from initialValue)
  React.useEffect(() => {
    setQuery(value?.label ?? "");
  }, [value?.id]);

  const runSearch = React.useCallback(
    (q: string) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (!q.trim()) {
        setResults([]);
        return;
      }
      timerRef.current = setTimeout(() => {
        setLoading(true);
        onSearch(q)
          .then(setResults)
          .catch(() => setResults([]))
          .finally(() => setLoading(false));
      }, 250);
    },
    [onSearch],
  );

  return (
    <div
      style={{
        display: "grid",
        gap: 6,
        gridColumn: span === "full" ? "1 / -1" : undefined,
        position: "relative",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "#374151" }}>
        <span>
          {label}
          {required && (
            <span style={{ color: "#dc2626", marginLeft: 2 }}>*</span>
          )}
        </span>
        {hint && (
          <span style={{ color: "#9ca3af", fontSize: 11 }}>{hint}</span>
        )}
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        <input
          style={{
            ...inputStyle,
            borderColor: error ? "#dc2626" : "#d1d5db",
            flex: 1,
          }}
          value={query}
          placeholder={placeholder}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            if (!e.target.value.trim()) onChange(null);
            runSearch(e.target.value);
          }}
          onFocus={() => {
            setOpen(true);
            if (query.trim() && !results.length) runSearch(query);
          }}
          onBlur={() => setTimeout(() => setOpen(false), 160)}
        />
        {value && (
          <button
            type="button"
            onClick={() => {
              onChange(null);
              setQuery("");
              setResults([]);
            }}
            style={{
              padding: "0 10px",
              borderRadius: 8,
              border: "1px solid #d1d5db",
              background: "#fff",
              cursor: "pointer",
              fontSize: 16,
              color: "#6b7280",
            }}
          >
            ✕
          </button>
        )}
      </div>
      {error && (
        <div style={{ color: "#dc2626", fontSize: 12 }}>{error}</div>
      )}
      {/* Selected badge */}
      {value && (
        <div
          style={{
            fontSize: 11,
            color: "#4338ca",
            background: "#eef2ff",
            borderRadius: 4,
            padding: "2px 6px",
            display: "inline-flex",
            alignSelf: "start",
          }}
        >
          {value.entityType ?? "linked"} · {value.id.slice(0, 8)}…
        </div>
      )}
      {/* Dropdown */}
      {open && (loading || results.length > 0) && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            zIndex: 200,
            background: "#fff",
            border: "1px solid #d1d5db",
            borderRadius: 8,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            maxHeight: 220,
            overflowY: "auto",
          }}
        >
          {loading && (
            <div style={{ padding: "10px 12px", fontSize: 12, color: "#9ca3af" }}>
              Searching…
            </div>
          )}
          {!loading &&
            results.map((row) => (
              <button
                key={row.id}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onChange(row);
                  setQuery(row.label);
                  setResults([]);
                  setOpen(false);
                }}
                style={{
                  width: "100%",
                  textAlign: "left",
                  border: "none",
                  borderBottom: "1px solid #f3f4f6",
                  background: "#fff",
                  cursor: "pointer",
                  padding: "9px 12px",
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>
                  {row.label}
                </div>
                {(row.subtitle || row.entityType) && (
                  <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>
                    {row.subtitle ?? row.entityType}
                  </div>
                )}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}

// ── ModalShell ────────────────────────────────────────────────────────────────

export function ModalShell({
  title,
  subtitle,
  onClose,
  children,
  footer,
  width = 980,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  footer: React.ReactNode;
  width?: number;
}) {
  // Close on backdrop click
  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Close on Escape
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      onClick={handleBackdrop}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "grid",
        placeItems: "center",
        padding: 24,
        zIndex: 1000,
      }}
    >
      <div
        style={{
          width: `min(${width}px, 100%)`,
          maxHeight: "92vh",
          overflowY: "auto",
          background: "#fff",
          borderRadius: 16,
          padding: 24,
          display: "grid",
          gap: 16,
          boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 12,
          }}
        >
          <div>
            <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>{title}</h3>
            {subtitle && (
              <div style={{ marginTop: 4, color: "#6b7280", fontSize: 13 }}>
                {subtitle}
              </div>
            )}
          </div>
          <Button onClick={onClose}>✕</Button>
        </div>

        {/* Body */}
        {children}

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
            borderTop: "1px solid #f3f4f6",
            paddingTop: 12,
          }}
        >
          {footer}
        </div>
      </div>
    </div>
  );
}

// ── SectionHeading ────────────────────────────────────────────────────────────

export function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 700,
        color: "#6b7280",
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        paddingBottom: 4,
        borderBottom: "1px solid #e5e7eb",
        gridColumn: "1 / -1",
      }}
    >
      {children}
    </div>
  );
}

// ── ErrorBox ──────────────────────────────────────────────────────────────────

export function ErrorBox({ message }: { message: string }) {
  return (
    <div
      style={{
        fontSize: 13,
        color: "#b91c1c",
        background: "#fef2f2",
        border: "1px solid #fecaca",
        borderRadius: 8,
        padding: "10px 12px",
      }}
    >
      {message}
    </div>
  );
}

// ── FormGrid ──────────────────────────────────────────────────────────────────

export function FormGrid({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        gap: 14,
      }}
    >
      {children}
    </div>
  );
}
