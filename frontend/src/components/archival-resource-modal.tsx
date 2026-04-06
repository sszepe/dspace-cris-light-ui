/**
 * archival-resource-modal.tsx
 *
 * Creation and editing modal for ArchivalResource (dspace.entity.type = ArchivalResource).
 * Implements all ISAD(G) sections as collapsible panels.
 *
 * Works in three modes:
 *   create       → creates a new DSpace workspace item
 *   editWorkspace → PATCHes an existing workspace item
 *   editItem      → PUTs metadata to an archived item
 *
 * The form structure mirrors the archival cockpit's ArchivalFormModal
 * but writes to DSpace submission sections (ara.* schema).
 */

import React from "react";
import {
  createArchivalResourceWorkspaceItem,
  saveArchivalResourceToWorkspace,
  saveArchivalResourceToItem,
  readArchivalResourceValues,
  readArchivalResourceFromSections,
  defaultArchivalResourceValues,
  type ArchivalResourceValues,
} from "../api/archival-resource-api";
import type { Metadata } from "../api/dspace";

// ── Design tokens ─────────────────────────────────────────────────────────────

const OVERLAY: React.CSSProperties = {
  position: "fixed", inset: 0,
  background: "rgba(0,0,0,0.45)",
  display: "flex", alignItems: "center", justifyContent: "center",
  zIndex: 1000,
};
const CARD: React.CSSProperties = {
  background: "#fff", borderRadius: 16,
  width: "min(780px, 97vw)", maxHeight: "92vh",
  display: "flex", flexDirection: "column",
  boxShadow: "0 20px 60px rgba(0,0,0,0.22)",
};
const INPUT: React.CSSProperties = {
  padding: "8px 10px", borderRadius: 8, border: "1px solid #ddd",
  fontSize: 13, width: "100%", boxSizing: "border-box",
  fontFamily: "inherit", background: "#fafafa",
};
const TEXTAREA: React.CSSProperties = {
  ...INPUT, resize: "vertical", minHeight: 80, lineHeight: 1.5,
};
const GRID2: React.CSSProperties = {
  display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12,
};

// ── Primitives ────────────────────────────────────────────────────────────────

function Field({
  label, required, hint, children,
}: {
  label: string; required?: boolean; hint?: string; children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 13 }}>
      <div style={{ fontWeight: 600, color: "#444", display: "flex", gap: 6, alignItems: "center" }}>
        {label}
        {required && <span style={{ color: "#d9534f", fontSize: 11 }}>*</span>}
        {hint && <span style={{ fontWeight: 400, color: "#bbb", fontSize: 10 }}>{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div style={GRID2}>{children}</div>;
}

function Section({
  title, isadRef, defaultOpen = false, badge, accent = false, children,
}: {
  title: string; isadRef?: string; defaultOpen?: boolean;
  badge?: number; accent?: boolean; children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  const headerBg  = open ? (accent ? "#fdf6ef" : "#f5f5f5") : (accent ? "#fdf6ef" : "#f9f9f9");
  const borderCol = accent ? "#f0d9b5" : "#e4e4e4";

  return (
    <div style={{ border: `1px solid ${borderCol}`, borderRadius: 12 }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "100%", display: "flex", alignItems: "center",
          justifyContent: "space-between", padding: "11px 14px",
          background: headerBg, border: "none", cursor: "pointer", textAlign: "left",
          borderRadius: open ? "12px 12px 0 0" : 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {accent
            ? <span style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.07em", color: "#e67e00" }}>{title}</span>
            : <span style={{ fontSize: 13, fontWeight: 700, color: "#333" }}>{title}</span>}
          {isadRef && <span style={{ fontSize: 10, color: "#ccc", fontFamily: "monospace" }}>{isadRef}</span>}
          {badge !== undefined && badge > 0 && (
            <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 7px", borderRadius: 999, background: "#e67e00", color: "#fff" }}>
              {badge}
            </span>
          )}
        </div>
        <span style={{
          fontSize: 13, color: "#aaa", lineHeight: 1,
          transform: open ? "scaleY(-1)" : "none",
          display: "inline-block", transition: "transform 0.15s",
        }}>▾</span>
      </button>

      {open && (
        <div style={{
          padding: "14px 14px 16px",
          display: "flex", flexDirection: "column", gap: 12,
          borderTop: `1px solid ${borderCol}`,
          borderRadius: "0 0 12px 12px",
        }}>
          {children}
        </div>
      )}
    </div>
  );
}

// ── ISAD levels ───────────────────────────────────────────────────────────────

const ISAD_LEVELS = ["fonds", "subfonds", "series", "subseries", "file", "item"];

// ── Props ─────────────────────────────────────────────────────────────────────

type CreateMode = {
  mode: "create";
};
type EditWorkspaceMode = {
  mode: "editWorkspace";
  wsId: number;
  /** Pass wsDetail.sections to pre-populate the form */
  sections?: Record<string, any>;
};
type EditItemMode = {
  mode: "editItem";
  uuid: string;
  /** Pass item.metadata to pre-populate the form */
  metadata?: Metadata;
};

export type ArchivalResourceModalProps = (CreateMode | EditWorkspaceMode | EditItemMode) & {
  open: boolean;
  onClose: () => void;
  /** Called with the wsId (create / editWorkspace) or uuid (editItem) after success */
  onSaved: (id: string | number) => void;
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function ArchivalResourceModal(props: ArchivalResourceModalProps) {
  const { open, onClose, onSaved } = props;

  const isCreate        = props.mode === "create";
  const isEditWorkspace = props.mode === "editWorkspace";
  const isEditItem      = props.mode === "editItem";

  // ── Initialise form values ─────────────────────────────────────────────────
  const initialValues = React.useMemo<ArchivalResourceValues>(() => {
    if (isEditWorkspace && (props as EditWorkspaceMode).sections) {
      return readArchivalResourceFromSections((props as EditWorkspaceMode).sections!);
    }
    if (isEditItem && (props as EditItemMode).metadata) {
      return readArchivalResourceValues((props as EditItemMode).metadata!);
    }
    return defaultArchivalResourceValues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const [values, setValues] = React.useState<ArchivalResourceValues>(initialValues);
  const [saving,   setSaving]   = React.useState(false);
  const [error,    setError]    = React.useState<string | null>(null);
  const [touched,  setTouched]  = React.useState(false);

  // Re-populate when reopened
  React.useEffect(() => {
    if (open) {
      setValues(initialValues);
      setError(null);
      setTouched(false);
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

  // ── Helpers ────────────────────────────────────────────────────────────────
  const set = <K extends keyof ArchivalResourceValues>(
    key: K, val: ArchivalResourceValues[K],
  ) => setValues((prev) => ({ ...prev, [key]: val }));

  const titleMissing = touched && !values.title.trim();

  // Badge counts — count non-empty fields per section
  function filled(...vals: string[]) { return vals.filter((v) => v.trim()).length; }

  const contextBadge    = filled(values.adminBioHistory, values.archivalHistory, values.sourceOfAcquisition);
  const contentBadge    = filled(values.scopeAndContent, values.appraisal, values.accruals, values.systemOfArrangement);
  const condBadge       = filled(values.accessRestrictions, values.conditionsOfReproduction, values.languageScripts, values.physicalCharacteristics, values.findingAids);
  const alliedBadge     = filled(values.locationOfOriginals, values.locationOfCopies, values.relatedUnits, values.publicationNote);
  const notesBadge      = filled(values.generalNotes, values.archivistsNote, values.dateOfDescription, values.descriptionIdentifier);

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    setTouched(true);
    if (!values.title.trim()) return;
    setSaving(true);
    setError(null);
    try {
      if (isCreate) {
        const wsId = await createArchivalResourceWorkspaceItem(values);
        onSaved(wsId);
      } else if (isEditWorkspace) {
        await saveArchivalResourceToWorkspace((props as EditWorkspaceMode).wsId, values);
        onSaved((props as EditWorkspaceMode).wsId);
      } else if (isEditItem) {
        await saveArchivalResourceToItem((props as EditItemMode).uuid, values);
        onSaved((props as EditItemMode).uuid);
      }
      onClose();
    } catch (e: any) {
      setError(e?.message ?? String(e));
    } finally {
      setSaving(false);
    }
  };

  // ── Modal header title ─────────────────────────────────────────────────────
  const modalTitle = isCreate
    ? "New archival resource"
    : isEditWorkspace
      ? `Edit workspace item #${(props as EditWorkspaceMode).wsId}`
      : `Edit archived item`;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={OVERLAY} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={CARD}>

        {/* Fixed header */}
        <div style={{
          padding: "16px 20px 12px", borderBottom: "1px solid #eee",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexShrink: 0,
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>{modalTitle}</h3>
            <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>
              dspace.entity.type = ArchivalResource · ISAD(G) structured description
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ padding: "7px 12px", borderRadius: 8, border: "1px solid #ddd", background: "#f5f5f5", cursor: "pointer", fontSize: 13 }}
          >
            ✕
          </button>
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px", display: "flex", flexDirection: "column", gap: 8 }}>

          {/* Error banner */}
          {error && (
            <div style={{ padding: "10px 12px", borderRadius: 8, background: "#fff1f0", border: "1px solid #ffa39e", color: "#cf1322", fontSize: 13 }}>
              {error}
            </div>
          )}

          {/* ── 1. Identity statement ── */}
          <Section title="Identity statement" isadRef="ISAD(G) 3.1" defaultOpen accent>
            <Row>
              <Field label="Title" required>
                <input
                  style={{ ...INPUT, borderColor: titleMissing ? "#d9534f" : "#ddd" }}
                  value={values.title}
                  onChange={(e) => set("title", e.target.value)}
                  placeholder="e.g. Personnel records"
                  autoFocus={isCreate}
                />
                {titleMissing && (
                  <span style={{ color: "#d9534f", fontSize: 11 }}>Title is required.</span>
                )}
              </Field>
              <Field label="Level" required hint="3.1.4">
                <select style={INPUT} value={values.level} onChange={(e) => set("level", e.target.value)}>
                  {ISAD_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </Field>
            </Row>
            <Row>
              <Field label="Reference code" hint="3.1.1">
                <input
                  style={INPUT}
                  value={values.referenceCode}
                  onChange={(e) => set("referenceCode", e.target.value)}
                  placeholder="e.g. AT-OeStA/AVA-E VI"
                />
              </Field>
              <Field label="Dates" hint="3.1.3">
                <input
                  style={INPUT}
                  value={values.dates}
                  onChange={(e) => set("dates", e.target.value)}
                  placeholder="e.g. 1900–1950"
                />
              </Field>
            </Row>
            <Field label="Extent and medium" hint="3.1.5">
              <input
                style={INPUT}
                value={values.extentAndMedium}
                onChange={(e) => set("extentAndMedium", e.target.value)}
                placeholder="e.g. 12 boxes (3 linear metres)"
              />
            </Field>
            <Row>
              <Field label="Repository" hint="ara.item.repository">
                <input
                  style={INPUT}
                  value={values.repository}
                  onChange={(e) => set("repository", e.target.value)}
                  placeholder="Holding institution name"
                />
              </Field>
              <Field label="Parent unit UUID" hint="mdwrepo.archivalresource.parent">
                <input
                  style={INPUT}
                  value={values.parentId}
                  onChange={(e) => set("parentId", e.target.value)}
                  placeholder="UUID of parent archival unit"
                />
              </Field>
            </Row>
            {values.level === "item" && (
              <Row>
                <Field label="Item type" hint="ara.item.type">
                  <input
                    style={INPUT}
                    value={values.itemType}
                    onChange={(e) => set("itemType", e.target.value)}
                    placeholder="e.g. Photograph, Field Research Audio"
                  />
                </Field>
                <Field label="Type node ID" hint="ara.type.nodeId">
                  <input
                    style={INPUT}
                    value={values.itemTypeNodeId}
                    onChange={(e) => set("itemTypeNodeId", e.target.value)}
                    placeholder="e.g. mdw_ara05"
                  />
                </Field>
              </Row>
            )}
          </Section>

          {/* ── 2. Content & structure ── */}
          <Section title="Content & structure" isadRef="ISAD(G) 3.3"
            defaultOpen={!!values.scopeAndContent}
            badge={contentBadge}
          >
            <Field label="Scope and content" hint="3.3.1">
              <textarea
                style={TEXTAREA}
                value={values.scopeAndContent}
                onChange={(e) => set("scopeAndContent", e.target.value)}
                placeholder="Describe the subject matter, time periods, geography…"
              />
            </Field>
            <Row>
              <Field label="Appraisal, destruction & scheduling" hint="3.3.2">
                <textarea style={{ ...TEXTAREA, minHeight: 60 }}
                  value={values.appraisal}
                  onChange={(e) => set("appraisal", e.target.value)} />
              </Field>
              <Field label="Accruals" hint="3.3.3">
                <textarea style={{ ...TEXTAREA, minHeight: 60 }}
                  value={values.accruals}
                  onChange={(e) => set("accruals", e.target.value)} />
              </Field>
            </Row>
            <Field label="System of arrangement" hint="3.3.4">
              <textarea style={{ ...TEXTAREA, minHeight: 60 }}
                value={values.systemOfArrangement}
                onChange={(e) => set("systemOfArrangement", e.target.value)} />
            </Field>
          </Section>

          {/* ── 3. Context ── */}
          <Section title="Context" isadRef="ISAD(G) 3.2" badge={contextBadge}>
            <Field label="Administrative / biographical history" hint="3.2.2">
              <textarea style={TEXTAREA}
                value={values.adminBioHistory}
                onChange={(e) => set("adminBioHistory", e.target.value)}
                placeholder="History of the creating body or individual…" />
            </Field>
            <Field label="Archival history" hint="3.2.3">
              <textarea style={{ ...TEXTAREA, minHeight: 60 }}
                value={values.archivalHistory}
                onChange={(e) => set("archivalHistory", e.target.value)} />
            </Field>
            <Field label="Immediate source of acquisition" hint="3.2.4">
              <textarea style={{ ...TEXTAREA, minHeight: 60 }}
                value={values.sourceOfAcquisition}
                onChange={(e) => set("sourceOfAcquisition", e.target.value)} />
            </Field>
          </Section>

          {/* ── 4. Conditions of access & use ── */}
          <Section title="Conditions of access & use" isadRef="ISAD(G) 3.4" badge={condBadge}>
            <Field label="Access restrictions" hint="3.4.1">
              <textarea style={{ ...TEXTAREA, minHeight: 60 }}
                value={values.accessRestrictions}
                onChange={(e) => set("accessRestrictions", e.target.value)} />
            </Field>
            <Field label="Conditions of reproduction" hint="3.4.2">
              <textarea style={{ ...TEXTAREA, minHeight: 60 }}
                value={values.conditionsOfReproduction}
                onChange={(e) => set("conditionsOfReproduction", e.target.value)} />
            </Field>
            <Row>
              <Field label="Language(s) / scripts of material" hint="3.4.3">
                <input style={INPUT} value={values.languageScripts}
                  onChange={(e) => set("languageScripts", e.target.value)}
                  placeholder="e.g. German (Latin script)" />
              </Field>
              <Field label="Physical characteristics" hint="3.4.4">
                <input style={INPUT} value={values.physicalCharacteristics}
                  onChange={(e) => set("physicalCharacteristics", e.target.value)}
                  placeholder="e.g. Fragile, faded ink" />
              </Field>
            </Row>
            <Field label="Finding aids" hint="3.4.5">
              <textarea style={{ ...TEXTAREA, minHeight: 60 }}
                value={values.findingAids}
                onChange={(e) => set("findingAids", e.target.value)} />
            </Field>
          </Section>

          {/* ── 5. Allied materials ── */}
          <Section title="Allied materials" isadRef="ISAD(G) 3.5" badge={alliedBadge}>
            <Row>
              <Field label="Location of originals" hint="3.5.1">
                <textarea style={{ ...TEXTAREA, minHeight: 60 }}
                  value={values.locationOfOriginals}
                  onChange={(e) => set("locationOfOriginals", e.target.value)} />
              </Field>
              <Field label="Location of copies" hint="3.5.2">
                <textarea style={{ ...TEXTAREA, minHeight: 60 }}
                  value={values.locationOfCopies}
                  onChange={(e) => set("locationOfCopies", e.target.value)} />
              </Field>
            </Row>
            <Field label="Related units of description" hint="3.5.3">
              <textarea style={{ ...TEXTAREA, minHeight: 60 }}
                value={values.relatedUnits}
                onChange={(e) => set("relatedUnits", e.target.value)} />
            </Field>
            <Field label="Publication note" hint="3.5.4">
              <textarea style={{ ...TEXTAREA, minHeight: 60 }}
                value={values.publicationNote}
                onChange={(e) => set("publicationNote", e.target.value)} />
            </Field>
          </Section>

          {/* ── 6. Notes & description control ── */}
          <Section title="Notes & description control" isadRef="ISAD(G) 3.6–3.7" badge={notesBadge}>
            <Field label="General notes" hint="3.6.1">
              <textarea style={TEXTAREA}
                value={values.generalNotes}
                onChange={(e) => set("generalNotes", e.target.value)} />
            </Field>
            <Field label="Archivist's note" hint="3.7.1">
              <textarea style={{ ...TEXTAREA, minHeight: 60 }}
                value={values.archivistsNote}
                onChange={(e) => set("archivistsNote", e.target.value)}
                placeholder="Internal processing notes…" />
            </Field>
            <Row>
              <Field label="Rules / conventions" hint="3.7.2">
                <input style={INPUT} value={values.rulesConventions}
                  onChange={(e) => set("rulesConventions", e.target.value)}
                  placeholder="e.g. ISAD(G), DACS" />
              </Field>
              <Field label="Date of description" hint="3.7.3">
                <input style={INPUT} type="date" value={values.dateOfDescription}
                  onChange={(e) => set("dateOfDescription", e.target.value)} />
              </Field>
            </Row>
            <Row>
              <Field label="Description identifier" hint="3.7.4">
                <input style={INPUT} value={values.descriptionIdentifier}
                  onChange={(e) => set("descriptionIdentifier", e.target.value)} />
              </Field>
              <Field label="Description language" hint="3.7.5">
                <input style={INPUT} value={values.descriptionLanguage}
                  onChange={(e) => set("descriptionLanguage", e.target.value)}
                  placeholder="e.g. en, de" />
              </Field>
            </Row>
          </Section>

        </div>

        {/* Fixed footer */}
        <div style={{
          padding: "12px 20px", borderTop: "1px solid #eee",
          display: "flex", justifyContent: "flex-end", gap: 8,
          flexShrink: 0, background: "#fafafa",
        }}>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            style={{ padding: "9px 16px", borderRadius: 10, border: "1px solid #ddd", background: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600 }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={saving || !values.title.trim()}
            style={{
              padding: "9px 22px", borderRadius: 10, border: "none",
              background: saving || !values.title.trim() ? "#ccc" : "#e67e00",
              color: "#fff", fontWeight: 700, fontSize: 13,
              cursor: saving || !values.title.trim() ? "not-allowed" : "pointer",
            }}
          >
            {saving
              ? "Saving…"
              : isCreate
                ? "Create draft"
                : "Save changes"}
          </button>
        </div>

      </div>
    </div>
  );
}
