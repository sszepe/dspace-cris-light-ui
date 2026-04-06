/**
 * orgunit-creation-modal.tsx
 *
 * Full creation + authority-import modal for OrgUnit (dspace.entity.type = OrgUnit).
 *
 * Two top-level tabs:
 *   ① Manual   — ISAD(G)-style collapsible form (archival cockpit design system)
 *   ② Import   — Search ROR / lobid GND / Wikidata, select a candidate, review
 *                pre-filled values, then create
 *
 * Import flow:
 *   Search → candidate list (source-tagged) → fetch full record →
 *   pre-fill the manual form → user reviews & edits → create workspace item
 *
 * All fields from the ROR v2 schema sample (MDW record) are captured.
 */

import React from "react";
import {
  createOrgUnitWorkspaceItem,
  importPayloadToValues,
  defaultOrgUnitValues,
  type OrgUnitCreationValues,
} from "../api/orgunit-creation-api";
import {
  searchOrgUnits,
  fetchOrgUnitFull,
  type OrgUnitImportCandidate,
  type OrgUnitImportPayload,
  type OrgUnitSource,
} from "../api/orgunit-import-api";

// ── Design tokens (archival cockpit system) ───────────────────────────────────

const OVERLAY: React.CSSProperties = {
  position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
  display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
};
const CARD: React.CSSProperties = {
  background: "#fff", borderRadius: 16,
  width: "min(820px, 97vw)", maxHeight: "92vh",
  display: "flex", flexDirection: "column",
  boxShadow: "0 20px 60px rgba(0,0,0,0.22)",
};
const INPUT: React.CSSProperties = {
  padding: "8px 10px", borderRadius: 8, border: "1px solid #ddd",
  fontSize: 13, width: "100%", boxSizing: "border-box",
  fontFamily: "inherit", background: "#fafafa",
};
const TEXTAREA: React.CSSProperties = { ...INPUT, resize: "vertical", minHeight: 72, lineHeight: 1.5 };
const GRID2: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 };
const GRID3: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 };

// ── Source metadata ───────────────────────────────────────────────────────────

const SOURCE_META: Record<OrgUnitSource, { label: string; bg: string; color: string; border: string; accent: string }> = {
  ror:      { label: "ROR",       bg: "#fff8f0", color: "#92400e", border: "#fde68a", accent: "#d97706" },
  gnd:      { label: "lobid GND", bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0", accent: "#16a34a" },
  wikidata: { label: "Wikidata",  bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe", accent: "#2563eb" },
};

function SourceBadge({ source }: { source: OrgUnitSource }) {
  const m = SOURCE_META[source];
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 999,
      background: m.bg, color: m.color, border: `1px solid ${m.border}`,
      whiteSpace: "nowrap", flexShrink: 0,
    }}>
      {m.label}
    </span>
  );
}

// ── Shared primitives ─────────────────────────────────────────────────────────

function Field({
  label, hint, required, children,
}: { label: string; hint?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 13 }}>
      <div style={{ fontWeight: 600, color: "#444", display: "flex", gap: 6, alignItems: "center" }}>
        {label}
        {required && <span style={{ color: "#d9534f", fontSize: 11 }}>*</span>}
        {hint && <span style={{ fontWeight: 400, color: "#bbb", fontSize: 10, fontFamily: "monospace" }}>{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function Row2({ children }: { children: React.ReactNode }) { return <div style={GRID2}>{children}</div>; }
function Row3({ children }: { children: React.ReactNode }) { return <div style={GRID3}>{children}</div>; }

function Section({
  title, hint, defaultOpen = false, badge, accent = false, children,
}: { title: string; hint?: string; defaultOpen?: boolean; badge?: number; accent?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = React.useState(defaultOpen);
  const borderCol = accent ? "#f0d9b5" : "#e4e4e4";
  const headerBg  = open ? (accent ? "#fdf6ef" : "#f5f5f5") : (accent ? "#fdf6ef" : "#f9f9f9");
  return (
    <div style={{ border: `1px solid ${borderCol}`, borderRadius: 12 }}>
      <button type="button" onClick={() => setOpen((v) => !v)} style={{
        width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "11px 14px", background: headerBg, border: "none", cursor: "pointer", textAlign: "left",
        borderRadius: open ? "12px 12px 0 0" : 12,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {accent
            ? <span style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.07em", color: "#e67e00" }}>{title}</span>
            : <span style={{ fontSize: 13, fontWeight: 700, color: "#333" }}>{title}</span>}
          {hint && <span style={{ fontSize: 10, color: "#ccc", fontFamily: "monospace" }}>{hint}</span>}
          {badge !== undefined && badge > 0 && (
            <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 7px", borderRadius: 999, background: "#e67e00", color: "#fff" }}>{badge}</span>
          )}
        </div>
        <span style={{ fontSize: 13, color: "#aaa", transform: open ? "scaleY(-1)" : "none", display: "inline-block", transition: "transform 0.15s" }}>▾</span>
      </button>
      {open && (
        <div style={{ padding: "14px 14px 16px", display: "flex", flexDirection: "column", gap: 12, borderTop: `1px solid ${borderCol}` }}>
          {children}
        </div>
      )}
    </div>
  );
}

function RepeatableField({
  label, hint, values, onChange,
}: { label: string; hint?: string; values: string[]; onChange: (v: string[]) => void }) {
  function upd(i: number, v: string) {
    const n = [...values]; n[i] = v; onChange(n);
  }
  function remove(i: number) { onChange(values.filter((_, idx) => idx !== i)); }
  return (
    <Field label={label} hint={hint}>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {values.map((v, i) => (
          <div key={i} style={{ display: "flex", gap: 6 }}>
            <input style={{ ...INPUT, flex: 1 }} value={v} onChange={(e) => upd(i, e.target.value)} placeholder="…" />
            <button type="button" onClick={() => remove(i)}
              style={{ padding: "4px 9px", borderRadius: 7, border: "1px solid #f5c2c7", background: "#fff6f6", color: "#842029", cursor: "pointer", fontSize: 12, flexShrink: 0 }}>
              ✕
            </button>
          </div>
        ))}
        <button type="button" onClick={() => onChange([...values, ""])}
          style={{ alignSelf: "flex-start", padding: "4px 10px", borderRadius: 7, border: "1px dashed #ddd", background: "#f9f9f9", color: "#555", cursor: "pointer", fontSize: 12 }}>
          + Add
        </button>
      </div>
    </Field>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Manual Form
// ═══════════════════════════════════════════════════════════════════════════════

function ManualForm({
  values,
  onChange,
  touched,
}: {
  values: OrgUnitCreationValues;
  onChange: (partial: Partial<OrgUnitCreationValues>) => void;
  touched: boolean;
}) {
  const set = (k: keyof OrgUnitCreationValues, v: any) => onChange({ [k]: v });
  const filled = (...vals: string[]) => vals.filter((v) => v.trim()).length;

  const identBadge = filled(values.acronym, values.legalName, values.foundingDate, values.endDate);
  const locBadge   = filled(values.addressLocality, values.addressCountry, values.url);
  const idBadge    = filled(values.ror, values.isni, values.gnd, values.wikidataId, values.grid, values.viaf, values.ringgold, values.lei, values.crossrefId);
  const mdwBadge   = filled(values.hasTopOrgUnit, values.mdwInternal, values.mdwOrgTypeNr, values.mdwKennung);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>

      {/* ── Core identity (accent, always open) ── */}
      <Section title="Identity" accent defaultOpen>
        <Row2>
          <Field label="Name (dc.title)" required>
            <input style={{ ...INPUT, borderColor: touched && !values.title.trim() ? "#d9534f" : "#ddd" }}
              value={values.title} onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. University of Music and Performing Arts Vienna" autoFocus />
            {touched && !values.title.trim() && <span style={{ color: "#d9534f", fontSize: 11 }}>Required.</span>}
          </Field>
          <Field label="Type (dc.type)" hint="orgunit_types vocabulary" required>
            <input style={INPUT} value={values.dcType} onChange={(e) => set("dcType", e.target.value)}
              placeholder="e.g. Education, Healthcare, Company" />
          </Field>
        </Row2>
        <Row2>
          <Field label="Acronym" hint="oairecerif.acronym">
            <input style={INPUT} value={values.acronym} onChange={(e) => set("acronym", e.target.value)} placeholder="e.g. MDW" />
          </Field>
          <Field label="Active" hint="mdwrepo.isActive">
            <select style={INPUT} value={values.isActive} onChange={(e) => set("isActive", e.target.value)}>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </Field>
        </Row2>
        <Field label="Description" hint="dc.description">
          <textarea style={TEXTAREA} value={values.description} onChange={(e) => set("description", e.target.value)} placeholder="Brief description of the organisation…" />
        </Field>
      </Section>

      {/* ── Extended identity ── */}
      <Section title="Extended identity" badge={identBadge} hint="organization.*">
        <Field label="Legal name" hint="organization.legalName">
          <input style={INPUT} value={values.legalName} onChange={(e) => set("legalName", e.target.value)}
            placeholder="Official registered name" />
        </Field>
        <RepeatableField label="Alternate names" hint="organization.alternateName"
          values={values.alternateNames} onChange={(v) => set("alternateNames", v)} />
        <Row3>
          <Field label="Founding date" hint="organization.foundingDate">
            <input style={INPUT} value={values.foundingDate} onChange={(e) => set("foundingDate", e.target.value)}
              placeholder="e.g. 1817" />
          </Field>
          <Field label="End / dissolution date" hint="organization.endDate">
            <input style={INPUT} value={values.endDate} onChange={(e) => set("endDate", e.target.value)} />
          </Field>
          <Field label="Language" hint="dc.language.iso">
            <input style={INPUT} value={values.language} onChange={(e) => set("language", e.target.value)} placeholder="e.g. de, en" />
          </Field>
        </Row3>
      </Section>

      {/* ── Location & web ── */}
      <Section title="Location & web" badge={locBadge}>
        <Row2>
          <Field label="City / locality" hint="organization.address.addressLocality">
            <input style={INPUT} value={values.addressLocality} onChange={(e) => set("addressLocality", e.target.value)} placeholder="e.g. Vienna" />
          </Field>
          <Field label="Country (ISO 3166-1)" hint="organization.address.addressCountry">
            <input style={INPUT} value={values.addressCountry} onChange={(e) => set("addressCountry", e.target.value)} placeholder="e.g. AT" />
          </Field>
        </Row2>
        <Field label="Website" hint="organization.url">
          <input style={INPUT} value={values.url} onChange={(e) => set("url", e.target.value)} placeholder="https://…" />
        </Field>
      </Section>

      {/* ── External identifiers ── */}
      <Section title="External identifiers" badge={idBadge}>
        <Row2>
          <Field label="ROR" hint="organization.identifier.ror">
            <input style={INPUT} value={values.ror} onChange={(e) => set("ror", e.target.value)} placeholder="https://ror.org/…" />
          </Field>
          <Field label="ISNI" hint="organization.identifier.isni">
            <input style={INPUT} value={values.isni} onChange={(e) => set("isni", e.target.value)} placeholder="0000000086460702" />
          </Field>
        </Row2>
        <Row2>
          <Field label="GRID" hint="mdwrepo.identifier.grid">
            <input style={INPUT} value={values.grid} onChange={(e) => set("grid", e.target.value)} placeholder="grid.451995.5" />
          </Field>
          <Field label="Wikidata" hint="mdwrepo.identifier.wikidata">
            <input style={INPUT} value={values.wikidataId} onChange={(e) => set("wikidataId", e.target.value)} placeholder="Q686522" />
          </Field>
        </Row2>
        <Row2>
          <Field label="GND" hint="mdwrepo.identifier.gnd">
            <input style={INPUT} value={values.gnd} onChange={(e) => set("gnd", e.target.value)} placeholder="GND ID" />
          </Field>
          <Field label="VIAF" hint="mdwrepo.identifier.viaf">
            <input style={INPUT} value={values.viaf} onChange={(e) => set("viaf", e.target.value)} />
          </Field>
        </Row2>
        <Row3>
          <Field label="Ringgold" hint="organization.identifier.rin">
            <input style={INPUT} value={values.ringgold} onChange={(e) => set("ringgold", e.target.value)} />
          </Field>
          <Field label="LEI" hint="organization.identifier.lei">
            <input style={INPUT} value={values.lei} onChange={(e) => set("lei", e.target.value)} />
          </Field>
          <Field label="Crossref Funder" hint="organization.identifier.crossrefid">
            <input style={INPUT} value={values.crossrefId} onChange={(e) => set("crossrefId", e.target.value)} />
          </Field>
        </Row3>
        <Field label="ORCID" hint="dc.identifier.orcid (for single-person organisations)">
          <input style={INPUT} value={values.orcid} onChange={(e) => set("orcid", e.target.value)} />
        </Field>
      </Section>

      {/* ── mdw-specific ── */}
      <Section title="MDW / DSpace-CRIS fields" badge={mdwBadge} hint="mdwrepo.orgunit.* · mdwonline.*">
        <Row2>
          <Field label="Parent OrgUnit" hint="mdwrepo.orgunit.hasTopOrgUnit">
            <input style={INPUT} value={values.hasTopOrgUnit} onChange={(e) => set("hasTopOrgUnit", e.target.value)}
              placeholder="Name or authority label" />
          </Field>
          <Field label="MDW internal ID" hint="mdwrepo.orgunit.mdwInternal">
            <input style={INPUT} value={values.mdwInternal} onChange={(e) => set("mdwInternal", e.target.value)} />
          </Field>
        </Row2>
        <Row2>
          <Field label="mdwOnline org type nr" hint="mdwonline.orgTypeNr">
            <input style={INPUT} value={values.mdwOrgTypeNr} onChange={(e) => set("mdwOrgTypeNr", e.target.value)} />
          </Field>
          <Field label="mdwOnline Kennung" hint="mdwonline.kennung">
            <input style={INPUT} value={values.mdwKennung} onChange={(e) => set("mdwKennung", e.target.value)} />
          </Field>
        </Row2>
      </Section>

    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Import panel
// ═══════════════════════════════════════════════════════════════════════════════

type ImportStep = "search" | "review";

function ImportPanel({
  onImported,
}: {
  onImported: (payload: OrgUnitImportPayload) => void;
}) {
  const [query,     setQuery]     = React.useState("");
  const [sources,   setSources]   = React.useState<OrgUnitSource[]>(["ror", "gnd", "wikidata"]);
  const [searching, setSearching] = React.useState(false);
  const [candidates, setCandidates] = React.useState<OrgUnitImportCandidate[]>([]);
  const [searchError, setSearchError] = React.useState<string | null>(null);
  const [sourceFilter, setSourceFilter] = React.useState<OrgUnitSource | "all">("all");

  const [step,       setStep]     = React.useState<ImportStep>("search");
  const [selected,   setSelected] = React.useState<OrgUnitImportCandidate | null>(null);
  const [fetching,   setFetching] = React.useState(false);
  const [fetchError, setFetchError] = React.useState<string | null>(null);
  const [preview,    setPreview]  = React.useState<OrgUnitImportPayload | null>(null);

  function toggleSource(s: OrgUnitSource) {
    setSources((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );
  }

  async function handleSearch() {
    if (!query.trim() || !sources.length) return;
    setSearching(true);
    setSearchError(null);
    setCandidates([]);
    try {
      const results = await searchOrgUnits(query.trim(), sources);
      setCandidates(results);
    } catch (e: any) {
      setSearchError(e?.message ?? "Search failed");
    } finally {
      setSearching(false);
    }
  }

  async function handleSelect(candidate: OrgUnitImportCandidate) {
    setSelected(candidate);
    setFetchError(null);
    setFetching(true);
    setStep("review");
    try {
      const payload = await fetchOrgUnitFull(candidate);
      setPreview(payload);
    } catch (e: any) {
      setFetchError(e?.message ?? "Failed to fetch full record");
    } finally {
      setFetching(false);
    }
  }

  function handleUseRecord() {
    if (preview) onImported(preview);
  }

  const visible = sourceFilter === "all"
    ? candidates
    : candidates.filter((c) => c.source === sourceFilter);

  // ── Search step ──────────────────────────────────────────────────────────
  if (step === "search") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

        {/* Source toggles */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {(["ror", "gnd", "wikidata"] as OrgUnitSource[]).map((s) => {
            const m = SOURCE_META[s];
            const active = sources.includes(s);
            return (
              <button key={s} type="button" onClick={() => toggleSource(s)} style={{
                padding: "5px 12px", borderRadius: 8,
                border: `1px solid ${active ? m.accent : "#ddd"}`,
                background: active ? m.bg : "#f9f9f9",
                color: active ? m.color : "#888",
                fontWeight: active ? 700 : 400,
                cursor: "pointer", fontSize: 12,
              }}>
                {m.label}
              </button>
            );
          })}
        </div>

        {/* Search bar */}
        <div style={{ display: "flex", gap: 8 }}>
          <input
            style={{ ...INPUT, flex: 1 }}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") void handleSearch(); }}
            placeholder="Search organisations by name, acronym, city…"
            autoFocus
          />
          <button type="button" onClick={() => void handleSearch()}
            disabled={!query.trim() || !sources.length || searching}
            style={{
              padding: "8px 16px", borderRadius: 8, border: "none",
              background: searching ? "#ccc" : "#e67e00",
              color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", flexShrink: 0,
            }}>
            {searching ? "Searching…" : "Search"}
          </button>
        </div>

        {searchError && (
          <div style={{ fontSize: 12, color: "#b91c1c", padding: "8px 10px", background: "#fef2f2", borderRadius: 6 }}>
            {searchError}
          </div>
        )}

        {/* Source filter tabs */}
        {candidates.length > 0 && (
          <div style={{ display: "flex", gap: 0, borderRadius: 8, border: "1px solid #e5e7eb", overflow: "hidden", alignSelf: "flex-start" }}>
            {(["all", "ror", "gnd", "wikidata"] as const).map((s) => {
              const count = s === "all" ? candidates.length : candidates.filter((c) => c.source === s).length;
              if (s !== "all" && count === 0) return null;
              const active = sourceFilter === s;
              return (
                <button key={s} type="button" onClick={() => setSourceFilter(s)} style={{
                  padding: "5px 12px", border: "none", borderRight: "1px solid #e5e7eb",
                  background: active ? "#eff6ff" : "#fff",
                  color: active ? "#1d4ed8" : "#6b7280",
                  fontWeight: active ? 700 : 400, fontSize: 12, cursor: "pointer",
                }}>
                  {s === "all" ? `All (${count})` : `${SOURCE_META[s].label} (${count})`}
                </button>
              );
            })}
          </div>
        )}

        {/* Results */}
        {visible.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 0, border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden" }}>
            {visible.map((c, i) => (
              <button key={`${c.source}-${c.sourceId}-${i}`} type="button" onClick={() => void handleSelect(c)}
                style={{
                  display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 14px",
                  borderBottom: i < visible.length - 1 ? "1px solid #f3f4f6" : "none",
                  background: "#fff", border: "none", cursor: "pointer", textAlign: "left",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#fdf6ef")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}>
                <SourceBadge source={c.source} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a2e" }}>{c.label}</div>
                  {c.description && <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{c.description}</div>}
                  <code style={{ fontSize: 10, color: "#bbb" }}>{c.sourceId}</code>
                </div>
                <span style={{ fontSize: 11, color: "#e67e00", fontWeight: 700, flexShrink: 0 }}>Import →</span>
              </button>
            ))}
          </div>
        )}

        {!searching && candidates.length === 0 && query && (
          <div style={{ fontSize: 13, color: "#9ca3af", textAlign: "center", padding: "20px 0" }}>
            No results. Try different search terms or enable more sources.
          </div>
        )}
      </div>
    );
  }

  // ── Review step ──────────────────────────────────────────────────────────
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Back */}
      <button type="button" onClick={() => { setStep("search"); setPreview(null); setSelected(null); }}
        style={{ alignSelf: "flex-start", padding: "5px 10px", borderRadius: 7, border: "1px solid #ddd", background: "#f9f9f9", cursor: "pointer", fontSize: 12 }}>
        ← Back to search
      </button>

      {/* Header */}
      {selected && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 10, background: "#f9fafb", border: "1px solid #e5e7eb" }}>
          <SourceBadge source={selected.source} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>{selected.label}</div>
            <code style={{ fontSize: 11, color: "#9ca3af" }}>{selected.sourceId}</code>
          </div>
        </div>
      )}

      {fetching && <div style={{ fontSize: 13, color: "#9ca3af", padding: "16px 0" }}>Loading full record…</div>}
      {fetchError && <div style={{ fontSize: 12, color: "#b91c1c", padding: "8px 10px", background: "#fef2f2", borderRadius: 6 }}>{fetchError}</div>}

      {preview && !fetching && (
        <>
          {/* Preview table */}
          <div style={{ border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden", fontSize: 12 }}>
            <PreviewRow label="Name"        value={preview.title} />
            <PreviewRow label="Type"        value={preview.dcType} />
            <PreviewRow label="Acronym"     value={preview.acronym} />
            <PreviewRow label="Legal name"  value={preview.legalName} />
            <PreviewRow label="Founded"     value={preview.foundingDate} />
            <PreviewRow label="City"        value={preview.addressLocality} />
            <PreviewRow label="Country"     value={preview.addressCountry} />
            <PreviewRow label="Website"     value={preview.url} link />
            <PreviewRow label="ROR"         value={preview.ror} link />
            <PreviewRow label="ISNI"        value={preview.isni} />
            <PreviewRow label="GRID"        value={preview.grid} />
            <PreviewRow label="Wikidata"    value={preview.wikidataId} />
            <PreviewRow label="GND"         value={preview.gnd} />
            <PreviewRow label="VIAF"        value={preview.viaf} />
            <PreviewRow label="ROR status"  value={preview.rorStatus} />
            <PreviewRow label="Domains"     value={preview.domains.join(", ")} />
            <PreviewRow label="Alt names"   value={preview.organizationAlternateNames.slice(0, 5).join(", ")} />
          </div>

          <button type="button" onClick={handleUseRecord} style={{
            padding: "10px 20px", borderRadius: 10, border: "none",
            background: "#e67e00", color: "#fff", fontWeight: 700, fontSize: 13,
            cursor: "pointer", alignSelf: "flex-start",
          }}>
            Use this record → fill form
          </button>
        </>
      )}
    </div>
  );
}

function PreviewRow({ label, value, link = false }: { label: string; value: string; link?: boolean }) {
  if (!value) return null;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 8, padding: "7px 12px", borderBottom: "1px solid #f3f4f6" }}>
      <span style={{ fontWeight: 600, color: "#9ca3af" }}>{label}</span>
      {link && (value.startsWith("http") || value.startsWith("https"))
        ? <a href={value} target="_blank" rel="noreferrer" style={{ color: "#2563eb", fontSize: 12 }}>{value}</a>
        : <span style={{ color: "#1a1a2e" }}>{value}</span>
      }
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Main modal component
// ═══════════════════════════════════════════════════════════════════════════════

export interface OrgUnitCreationModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: (wsId: number) => void;
  /** Optional: pre-fill values (e.g. for "add child" with parent set) */
  initialValues?: Partial<OrgUnitCreationValues>;
}

export default function OrgUnitCreationModal({
  open,
  onClose,
  onCreated,
  initialValues,
}: OrgUnitCreationModalProps) {
  const [tab,     setTab]     = React.useState<"manual" | "import">("manual");
  const [values,  setValues]  = React.useState<OrgUnitCreationValues>({
    ...defaultOrgUnitValues(),
    ...initialValues,
  });
  const [saving,  setSaving]  = React.useState(false);
  const [error,   setError]   = React.useState<string | null>(null);
  const [touched, setTouched] = React.useState(false);

  // Reset when reopened
  React.useEffect(() => {
    if (open) {
      setValues({ ...defaultOrgUnitValues(), ...(initialValues ?? {}) });
      setError(null);
      setTouched(false);
      setTab("manual");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Escape key
  React.useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);

  if (!open) return null;

  function handleChange(partial: Partial<OrgUnitCreationValues>) {
    setValues((prev) => ({ ...prev, ...partial }));
  }

  function handleImported(payload: OrgUnitImportPayload) {
    setValues((prev) => ({
      ...prev,
      ...importPayloadToValues(payload),
      // Preserve any parent set by caller
      hasTopOrgUnit: prev.hasTopOrgUnit || "",
    }));
    setTab("manual");
  }

  async function handleSave() {
    setTouched(true);
    if (!values.title.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const wsId = await createOrgUnitWorkspaceItem(values);
      onCreated(wsId);
      onClose();
    } catch (e: any) {
      setError(e?.message ?? "Creation failed");
    } finally {
      setSaving(false);
    }
  }

  const titleMissing = touched && !values.title.trim();

  return (
    <div style={OVERLAY} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={CARD}>

        {/* Fixed header */}
        <div style={{ padding: "16px 20px 0", borderBottom: "1px solid #eee", flexShrink: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>New organisational unit</h3>
              <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>dspace.entity.type = OrgUnit</div>
            </div>
            <button type="button" onClick={onClose}
              style={{ padding: "7px 12px", borderRadius: 8, border: "1px solid #ddd", background: "#f5f5f5", cursor: "pointer", fontSize: 13 }}>
              ✕
            </button>
          </div>

          {/* Tab bar */}
          <div style={{ display: "flex", gap: 0 }}>
            {(["manual", "import"] as const).map((t) => (
              <button key={t} type="button" onClick={() => setTab(t)} style={{
                padding: "8px 18px", border: "none",
                borderBottom: tab === t ? "2px solid #e67e00" : "2px solid transparent",
                background: "none", cursor: "pointer", fontSize: 13,
                fontWeight: tab === t ? 700 : 400,
                color: tab === t ? "#e67e00" : "#6b7280",
              }}>
                {t === "manual" ? "✏ Manual" : "⬇ Import"}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px" }}>

          {error && (
            <div style={{ marginBottom: 10, padding: "10px 12px", borderRadius: 8, background: "#fff1f0", border: "1px solid #ffa39e", color: "#cf1322", fontSize: 13 }}>
              {error}
            </div>
          )}

          {tab === "manual" && (
            <ManualForm values={values} onChange={handleChange} touched={touched} />
          )}

          {tab === "import" && (
            <ImportPanel onImported={handleImported} />
          )}

        </div>

        {/* Fixed footer — only show save in manual tab */}
        {tab === "manual" && (
          <div style={{
            padding: "12px 20px", borderTop: "1px solid #eee",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            flexShrink: 0, background: "#fafafa",
          }}>
            {titleMissing && (
              <span style={{ fontSize: 12, color: "#d9534f" }}>Name is required.</span>
            )}
            {!titleMissing && <span />}
            <div style={{ display: "flex", gap: 8 }}>
              <button type="button" onClick={onClose} disabled={saving}
                style={{ padding: "9px 16px", borderRadius: 10, border: "1px solid #ddd", background: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                Cancel
              </button>
              <button type="button" onClick={() => void handleSave()}
                disabled={saving || !values.title.trim()}
                style={{
                  padding: "9px 22px", borderRadius: 10, border: "none",
                  background: saving || !values.title.trim() ? "#ccc" : "#e67e00",
                  color: "#fff", fontWeight: 700, fontSize: 13,
                  cursor: saving || !values.title.trim() ? "not-allowed" : "pointer",
                }}>
                {saving ? "Creating…" : "Create draft"}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
