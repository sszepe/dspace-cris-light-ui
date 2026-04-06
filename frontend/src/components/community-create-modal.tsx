/**
 * community-create-modal.tsx
 *
 * Modal for creating a new DSpace community (top-level or subcommunity).
 *
 * Fields (mirrors the DSpace Angular UI community form):
 *   dc.title                    — required
 *   dc.description              — short description (shown in tree)
 *   dc.description.abstract     — long description / introductory text
 *   dc.rights                   — copyright / licence text (HTML allowed)
 *   dc.description.tableofcontents — news / sidebar text (HTML allowed)
 *
 * Parent selection:
 *   - "Top-level community" toggle — when on, no parent is set
 *   - When off: typeahead searches all editable communities via
 *     the editCommunity discover configuration
 *
 * Props:
 *   open            — controls visibility
 *   defaultParent   — pre-select a parent community (e.g. when triggered
 *                     from a "+ Add subcommunity" button on a tree node)
 *   onClose         — called on cancel / backdrop click / Escape
 *   onCreated       — called with the new community id after success
 */

import React from "react";
import {
  Button,
  ErrorBox,
  FormGrid,
  Labeled,
  ModalShell,
  SectionHeading,
  inputStyle,
} from "./modal-shared";
import {
  createCommunity,
  searchEditableCommunities,
  type CommunityOption,
  type CommunityPayload,
} from "../api/community-api";

// ── Parent picker typeahead ───────────────────────────────────────────────────
// Inlined here (not using the generic TypeaheadField) because the result type
// is CommunityOption, not AuthorityOption, and we want to show handle as subtitle.

function ParentPicker({
  value,
  onChange,
  disabled,
}: {
  value: CommunityOption | null;
  onChange: (c: CommunityOption | null) => void;
  disabled?: boolean;
}) {
  const [query, setQuery] = React.useState(value?.label ?? "");
  const [results, setResults] = React.useState<CommunityOption[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    setQuery(value?.label ?? "");
  }, [value?.id]);

  const runSearch = (q: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!q.trim()) { setResults([]); return; }
    timerRef.current = setTimeout(() => {
      setLoading(true);
      searchEditableCommunities(q)
        .then(setResults)
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, 250);
  };

  return (
    <div style={{ position: "relative" }}>
      <div style={{ display: "flex", gap: 6 }}>
        <input
          style={{
            ...inputStyle,
            flex: 1,
            opacity: disabled ? 0.5 : 1,
            cursor: disabled ? "not-allowed" : undefined,
          }}
          disabled={disabled}
          placeholder="Search community by name…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            onChange(null);
            runSearch(e.target.value);
          }}
          onFocus={() => {
            setOpen(true);
            if (query.trim() && !results.length) runSearch(query);
          }}
          onBlur={() => setTimeout(() => setOpen(false), 160)}
        />
        {value && !disabled && (
          <button
            type="button"
            onClick={() => { onChange(null); setQuery(""); setResults([]); }}
            style={{
              padding: "0 10px", borderRadius: 8, border: "1px solid #d1d5db",
              background: "#fff", cursor: "pointer", fontSize: 15, color: "#6b7280",
            }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Selected badge */}
      {value && (
        <div style={{
          marginTop: 4, fontSize: 11, color: "#4338ca", background: "#eef2ff",
          borderRadius: 4, padding: "2px 7px", display: "inline-flex",
          alignItems: "center", gap: 4,
        }}>
          <span style={{ fontWeight: 600 }}>{value.label}</span>
          {value.handle && <span style={{ color: "#9ca3af" }}>{value.handle}</span>}
        </div>
      )}

      {/* Dropdown */}
      {open && !disabled && (loading || results.length > 0) && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
          zIndex: 300, background: "#fff", border: "1px solid #d1d5db",
          borderRadius: 8, boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          maxHeight: 240, overflowY: "auto",
        }}>
          {loading && (
            <div style={{ padding: "10px 12px", fontSize: 12, color: "#9ca3af" }}>
              Searching…
            </div>
          )}
          {!loading && results.map((c) => (
            <button
              key={c.id}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => { onChange(c); setQuery(c.label); setResults([]); setOpen(false); }}
              style={{
                width: "100%", textAlign: "left", border: "none",
                borderBottom: "1px solid #f3f4f6", background: "#fff",
                cursor: "pointer", padding: "9px 12px",
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>
                {c.label}
              </div>
              {(c.handle || c.description) && (
                <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>
                  {[c.handle, c.description].filter(Boolean).join(" · ")}
                </div>
              )}
            </button>
          ))}
          {!loading && results.length === 0 && query.trim() && (
            <div style={{ padding: "10px 12px", fontSize: 12, color: "#9ca3af" }}>
              No communities found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Default values ────────────────────────────────────────────────────────────

function defaultValues(): CommunityPayload {
  return { title: "", description: "", abstract: "", rights: "", tableOfContents: "" };
}

// ── Component ─────────────────────────────────────────────────────────────────

type Props = {
  open: boolean;
  /** Pre-select a parent community (e.g. from "+ Add subcommunity" on a tree node). */
  defaultParent?: CommunityOption | null;
  onClose: () => void;
  onCreated?: (community: { id: string; name: string; isTop: boolean; parentId?: string }) => void;
};

export default function CommunityCreateModal({
  open,
  defaultParent,
  onClose,
  onCreated,
}: Props) {
  const [values, setValues] = React.useState<CommunityPayload>(defaultValues());
  const [isTop, setIsTop] = React.useState(!defaultParent);
  const [parent, setParent] = React.useState<CommunityOption | null>(
    defaultParent ?? null,
  );
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [touched, setTouched] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setValues(defaultValues());
      setIsTop(!defaultParent);
      setParent(defaultParent ?? null);
      setError(null);
      setTouched(false);
    }
  }, [open]);

  if (!open) return null;

  const set = <K extends keyof CommunityPayload>(k: K, v: CommunityPayload[K]) =>
    setValues((prev) => ({ ...prev, [k]: v }));

  const titleMissing = touched && !values.title.trim();
  const parentMissing = touched && !isTop && !parent;

  const submit = async () => {
    setTouched(true);
    if (!values.title.trim()) { setError("Title is required."); return; }
    if (!isTop && !parent) { setError("Select a parent community or switch to top-level."); return; }
    setSaving(true);
    setError(null);
    try {
      const created = await createCommunity(values, isTop ? null : parent?.id);
      onCreated?.({
        id: created.id,
        name: created.name,
        isTop,
        parentId: isTop ? undefined : parent?.id,
      });
      onClose();
    } catch (e: any) {
      setError(e?.message ?? String(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalShell
      title="Create community"
      subtitle="Creates a new DSpace community. Communities organise collections and subcommunities."
      onClose={onClose}
      width={780}
      footer={
        <>
          <Button onClick={onClose} disabled={saving}>Cancel</Button>
          <Button kind="primary" disabled={saving} onClick={() => void submit()}>
            {saving ? "Creating…" : "Create community"}
          </Button>
        </>
      }
    >
      <FormGrid>
        {/* ── Type ── */}
        <SectionHeading>Community type</SectionHeading>

        {/* Top / sub toggle */}
        <div style={{ gridColumn: "1 / -1", display: "flex", gap: 8 }}>
          <button
            type="button"
            onClick={() => setIsTop(true)}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: isTop ? "2px solid #2563eb" : "1px solid #d1d5db",
              background: isTop ? "#eff6ff" : "#fff",
              color: isTop ? "#1d4ed8" : "#374151",
              fontWeight: isTop ? 700 : 500,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            🏛 Top-level community
          </button>
          <button
            type="button"
            onClick={() => setIsTop(false)}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: !isTop ? "2px solid #2563eb" : "1px solid #d1d5db",
              background: !isTop ? "#eff6ff" : "#fff",
              color: !isTop ? "#1d4ed8" : "#374151",
              fontWeight: !isTop ? 700 : 500,
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            📂 Subcommunity
          </button>
        </div>

        {/* Parent picker — visible when subcommunity selected */}
        {!isTop && (
          <div style={{ gridColumn: "1 / -1" }}>
            <Labeled
              label="Parent community"
              required
              error={parentMissing ? "Parent community is required for a subcommunity." : null}
            >
              <ParentPicker value={parent} onChange={setParent} />
            </Labeled>
          </div>
        )}

        {/* ── Required ── */}
        <SectionHeading>Title</SectionHeading>

        <Labeled
          label="Title"
          required
          error={titleMissing ? "Title is required." : null}
          span="full"
        >
          <input
            style={{
              ...inputStyle,
              borderColor: titleMissing ? "#dc2626" : "#d1d5db",
              fontSize: 15,
            }}
            value={values.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Community name"
            autoFocus
          />
        </Labeled>

        {/* ── Descriptions ── */}
        <SectionHeading>Descriptions</SectionHeading>

        <Labeled label="Short description" hint="dc.description" span="full">
          <input
            style={inputStyle}
            value={values.description ?? ""}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Shown in the tree view below the community name"
          />
        </Labeled>

        <Labeled label="Introductory text" hint="dc.description.abstract" span="full">
          <textarea
            style={{ ...inputStyle, minHeight: 90, resize: "vertical" }}
            value={values.abstract ?? ""}
            onChange={(e) => set("abstract", e.target.value)}
            placeholder="Longer description shown on the community landing page"
          />
        </Labeled>

        {/* ── Additional metadata ── */}
        <SectionHeading>Additional metadata</SectionHeading>

        <Labeled label="Copyright / licence" hint="dc.rights" span="full">
          <textarea
            style={{ ...inputStyle, minHeight: 70, resize: "vertical" }}
            value={values.rights ?? ""}
            onChange={(e) => set("rights", e.target.value)}
            placeholder="HTML allowed"
          />
        </Labeled>

        <Labeled label="News / sidebar" hint="dc.description.tableofcontents" span="full">
          <textarea
            style={{ ...inputStyle, minHeight: 70, resize: "vertical" }}
            value={values.tableOfContents ?? ""}
            onChange={(e) => set("tableOfContents", e.target.value)}
            placeholder="HTML allowed — shown in the sidebar"
          />
        </Labeled>
      </FormGrid>

      {error && <ErrorBox message={error} />}

      <div style={{
        fontSize: 11, color: "#9ca3af", background: "#f9fafb",
        border: "1px solid #e5e7eb", borderRadius: 8, padding: "8px 12px",
      }}>
        Fields written: <strong>dc.title</strong>,{" "}
        <strong>dc.description</strong>,{" "}
        <strong>dc.description.abstract</strong>,{" "}
        <strong>dc.rights</strong>,{" "}
        <strong>dc.description.tableofcontents</strong>.
        {isTop
          ? " Creates a top-level community."
          : parent
            ? ` Creates a subcommunity under "${parent.label}".`
            : " Select a parent community above."}
      </div>
    </ModalShell>
  );
}
