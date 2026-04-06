/**
 * concept-modal.tsx
 *
 * Creation modal for SKOS Concept entities.
 * Covers all six submission form sections:
 *   concept, concept_documentation, concept_semantic_relations,
 *   concept_mappings, concept_notations
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
  createConceptWorkspaceItem,
  defaultConceptValues,
  type ConceptValues,
  type LangValue,
} from "../api/skos-creation-api";

// ── ISO language options (subset for the dropdown) ────────────────────────────

const COMMON_LANGS = [
  { value: "", label: "— none —" },
  { value: "en", label: "English (en)" },
  { value: "de", label: "German (de)" },
  { value: "fr", label: "French (fr)" },
  { value: "es", label: "Spanish (es)" },
  { value: "it", label: "Italian (it)" },
  { value: "pt", label: "Portuguese (pt)" },
  { value: "nl", label: "Dutch (nl)" },
  { value: "pl", label: "Polish (pl)" },
  { value: "ru", label: "Russian (ru)" },
  { value: "zh", label: "Chinese (zh)" },
  { value: "ja", label: "Japanese (ja)" },
  { value: "ar", label: "Arabic (ar)" },
  { value: "la", label: "Latin (la)" },
];

// ── LangRepeatableField ───────────────────────────────────────────────────────
// Renders a repeatable inline-group: text input + language dropdown

function LangRepeatableField({
  label,
  hint,
  values,
  onChange,
  placeholder,
  multiline = false,
  span,
}: {
  label: string;
  hint?: string;
  values: LangValue[];
  onChange: (next: LangValue[]) => void;
  placeholder?: string;
  multiline?: boolean;
  span?: "full";
}) {
  const add = () => onChange([...values, { value: "", language: "" }]);
  const update = (i: number, patch: Partial<LangValue>) => {
    const next = [...values];
    next[i] = { ...next[i], ...patch };
    onChange(next);
  };
  const remove = (i: number) => onChange(values.filter((_, idx) => idx !== i));

  return (
    <div style={{ gridColumn: span === "full" ? "1 / -1" : undefined, display: "grid", gap: 6 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#374151" }}>
        <span>{label}</span>
        {hint && <span style={{ color: "#9ca3af", fontSize: 11 }}>{hint}</span>}
      </div>
      <div style={{ display: "grid", gap: 8 }}>
        {values.map((v, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 160px auto", gap: 6, alignItems: "start" }}>
            {multiline ? (
              <textarea
                style={{ ...inputStyle, minHeight: 70, resize: "vertical" }}
                value={v.value}
                onChange={(e) => update(i, { value: e.target.value })}
                placeholder={placeholder}
              />
            ) : (
              <input
                style={inputStyle}
                value={v.value}
                onChange={(e) => update(i, { value: e.target.value })}
                placeholder={placeholder}
              />
            )}
            <select
              style={{ ...inputStyle, height: multiline ? undefined : undefined }}
              value={v.language ?? ""}
              onChange={(e) => update(i, { language: e.target.value })}
            >
              {COMMON_LANGS.map((l) => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => remove(i)}
              style={{
                padding: "8px 10px",
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                background: "#fff",
                cursor: "pointer",
                color: "#9ca3af",
                fontSize: 16,
                marginTop: 1,
              }}
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={add}
          style={{
            alignSelf: "start",
            padding: "5px 10px",
            borderRadius: 6,
            border: "1px dashed #d1d5db",
            background: "#f9fafb",
            cursor: "pointer",
            fontSize: 12,
            color: "#6b7280",
          }}
        >
          + Add {label.toLowerCase()}
        </button>
      </div>
    </div>
  );
}

// ── RepeatableField ───────────────────────────────────────────────────────────

function RepeatableField({
  label,
  hint,
  values,
  onChange,
  placeholder,
  span,
}: {
  label: string;
  hint?: string;
  values: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  span?: "full";
}) {
  const add = () => onChange([...values, ""]);
  const update = (i: number, v: string) => {
    const next = [...values];
    next[i] = v;
    onChange(next);
  };
  const remove = (i: number) => onChange(values.filter((_, idx) => idx !== i));

  return (
    <div style={{ gridColumn: span === "full" ? "1 / -1" : undefined, display: "grid", gap: 6 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#374151" }}>
        <span>{label}</span>
        {hint && <span style={{ color: "#9ca3af", fontSize: 11 }}>{hint}</span>}
      </div>
      <div style={{ display: "grid", gap: 6 }}>
        {values.map((v, i) => (
          <div key={i} style={{ display: "flex", gap: 6 }}>
            <input
              style={{ ...inputStyle, flex: 1 }}
              value={v}
              onChange={(e) => update(i, e.target.value)}
              placeholder={placeholder}
            />
            <button
              type="button"
              onClick={() => remove(i)}
              style={{
                padding: "0 10px",
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                background: "#fff",
                cursor: "pointer",
                color: "#9ca3af",
                fontSize: 16,
              }}
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={add}
          style={{
            alignSelf: "start",
            padding: "5px 10px",
            borderRadius: 6,
            border: "1px dashed #d1d5db",
            background: "#f9fafb",
            cursor: "pointer",
            fontSize: 12,
            color: "#6b7280",
          }}
        >
          + Add {label.toLowerCase()}
        </button>
      </div>
    </div>
  );
}

// ── Tab bar ───────────────────────────────────────────────────────────────────

const TABS = [
  { key: "core", label: "Core" },
  { key: "labels", label: "Labels" },
  { key: "documentation", label: "Documentation" },
  { key: "relations", label: "Relations" },
  { key: "mappings", label: "Mappings" },
] as const;

type Tab = typeof TABS[number]["key"];

function TabBar({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 4,
        borderBottom: "1px solid #e5e7eb",
        marginBottom: 16,
        flexWrap: "wrap",
      }}
    >
      {TABS.map((t) => (
        <button
          key={t.key}
          type="button"
          onClick={() => onChange(t.key)}
          style={{
            padding: "7px 14px",
            border: "none",
            background: "none",
            borderBottom: active === t.key ? "2px solid #2563eb" : "2px solid transparent",
            color: active === t.key ? "#1d4ed8" : "#6b7280",
            fontWeight: active === t.key ? 700 : 400,
            fontSize: 13,
            cursor: "pointer",
            marginBottom: -1,
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated?: (wsId: number) => void;
};

export default function ConceptModal({ open, onClose, onCreated }: Props) {
  const [values, setValues] = React.useState<ConceptValues>(defaultConceptValues);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [touched, setTouched] = React.useState(false);
  const [tab, setTab] = React.useState<Tab>("core");

  React.useEffect(() => {
    if (open) {
      setValues(defaultConceptValues());
      setError(null);
      setTouched(false);
      setTab("core");
    }
  }, [open]);

  if (!open) return null;

  const titleMissing = touched && !values.title.trim();

  const set = <K extends keyof ConceptValues>(key: K, val: ConceptValues[K]) =>
    setValues((prev) => ({ ...prev, [key]: val }));

  const submit = async () => {
    setTouched(true);
    if (!values.title.trim()) {
      setTab("core");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const wsId = await createConceptWorkspaceItem(values);
      onCreated?.(wsId);
      onClose();
    } catch (e: any) {
      setError(e?.message ?? String(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalShell
      title="Create Concept"
      subtitle="Creates a new SKOS Concept workspace item across concept, labels, documentation, relations, and mappings."
      onClose={onClose}
      width={920}
      footer={
        <>
          <Button onClick={onClose} disabled={saving}>Cancel</Button>
          <Button kind="primary" disabled={saving} onClick={() => void submit()}>
            {saving ? "Creating…" : "Create draft"}
          </Button>
        </>
      }
    >
      <TabBar active={tab} onChange={setTab} />

      {/* ── Core tab ── */}
      {tab === "core" && (
        <FormGrid>
          <SectionHeading>Identity · section: concept</SectionHeading>

          <Labeled
            label="Title (Preferred label)"
            required
            hint="dc.title"
            error={titleMissing ? "Title is required." : null}
            span="full"
          >
            <input
              style={{ ...inputStyle, borderColor: titleMissing ? "#dc2626" : "#d1d5db" }}
              value={values.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Primary label for this concept"
            />
          </Labeled>

          <Labeled label="In scheme" hint="skos.inScheme · ConceptSchemeAuthority">
            <input
              style={inputStyle}
              value={values.inScheme}
              onChange={(e) => set("inScheme", e.target.value)}
              placeholder="Scheme name or UUID"
            />
          </Labeled>

          <Labeled label="Top concept of" hint="skos.topConceptOf · ConceptSchemeAuthority">
            <input
              style={inputStyle}
              value={values.topConceptOf}
              onChange={(e) => set("topConceptOf", e.target.value)}
              placeholder="Scheme name or UUID"
            />
          </Labeled>

          <SectionHeading>Notations · section: concept_notations</SectionHeading>

          <RepeatableField
            label="Notations"
            hint="skos.notation"
            values={values.notations}
            onChange={(v) => set("notations", v)}
            placeholder="Notation string"
            span="full"
          />
        </FormGrid>
      )}

      {/* ── Labels tab ── */}
      {tab === "labels" && (
        <FormGrid>
          <SectionHeading>Labels · section: concept</SectionHeading>

          <LangRepeatableField
            label="Preferred labels"
            hint="skos.prefLabel + skos.prefLabel.language"
            values={values.prefLabels}
            onChange={(v) => set("prefLabels", v)}
            placeholder="Preferred label text"
            span="full"
          />

          <LangRepeatableField
            label="Alternative labels"
            hint="skos.altLabel + skos.altLabel.language"
            values={values.altLabels}
            onChange={(v) => set("altLabels", v)}
            placeholder="Alternative label text"
            span="full"
          />

          <LangRepeatableField
            label="Hidden labels"
            hint="skos.hiddenLabel + skos.hiddenLabel.language"
            values={values.hiddenLabels}
            onChange={(v) => set("hiddenLabels", v)}
            placeholder="Hidden label text"
            span="full"
          />
        </FormGrid>
      )}

      {/* ── Documentation tab ── */}
      {tab === "documentation" && (
        <FormGrid>
          <SectionHeading>Documentation · section: concept_documentation</SectionHeading>

          <LangRepeatableField
            label="Definitions"
            hint="skos.definition"
            values={values.definitions}
            onChange={(v) => set("definitions", v)}
            placeholder="Definition text"
            multiline
            span="full"
          />

          <LangRepeatableField
            label="Scope notes"
            hint="skos.scopeNote"
            values={values.scopeNotes}
            onChange={(v) => set("scopeNotes", v)}
            placeholder="Scope note text"
            multiline
            span="full"
          />

          <LangRepeatableField
            label="Examples"
            hint="skos.example"
            values={values.examples}
            onChange={(v) => set("examples", v)}
            placeholder="Example text"
            multiline
            span="full"
          />

          <LangRepeatableField
            label="Change notes"
            hint="skos.changeNote"
            values={values.changeNotes}
            onChange={(v) => set("changeNotes", v)}
            placeholder="Change note text"
            multiline
            span="full"
          />

          <LangRepeatableField
            label="Editorial notes"
            hint="skos.editorialNote"
            values={values.editorialNotes}
            onChange={(v) => set("editorialNotes", v)}
            placeholder="Editorial note text"
            multiline
            span="full"
          />

          <LangRepeatableField
            label="History notes"
            hint="skos.historyNote"
            values={values.historyNotes}
            onChange={(v) => set("historyNotes", v)}
            placeholder="History note text"
            multiline
            span="full"
          />

          <LangRepeatableField
            label="Notes"
            hint="skos.note"
            values={values.notes}
            onChange={(v) => set("notes", v)}
            placeholder="Note text"
            multiline
            span="full"
          />
        </FormGrid>
      )}

      {/* ── Relations tab ── */}
      {tab === "relations" && (
        <FormGrid>
          <SectionHeading>Semantic relations · section: concept_semantic_relations</SectionHeading>

          <RepeatableField
            label="Broader"
            hint="skos.broader · ConceptAuthority"
            values={values.broader}
            onChange={(v) => set("broader", v)}
            placeholder="Broader concept name or UUID"
            span="full"
          />

          <RepeatableField
            label="Narrower"
            hint="skos.narrower · ConceptAuthority"
            values={values.narrower}
            onChange={(v) => set("narrower", v)}
            placeholder="Narrower concept name or UUID"
            span="full"
          />

          <RepeatableField
            label="Related"
            hint="skos.related · ConceptAuthority"
            values={values.related}
            onChange={(v) => set("related", v)}
            placeholder="Related concept name or UUID"
            span="full"
          />

          <RepeatableField
            label="Broader transitive"
            hint="skos.broaderTransitive · ConceptAuthority"
            values={values.broaderTransitive}
            onChange={(v) => set("broaderTransitive", v)}
            placeholder="Concept name or UUID"
          />

          <RepeatableField
            label="Narrower transitive"
            hint="skos.narrowerTransitive · ConceptAuthority"
            values={values.narrowerTransitive}
            onChange={(v) => set("narrowerTransitive", v)}
            placeholder="Concept name or UUID"
          />
        </FormGrid>
      )}

      {/* ── Mappings tab ── */}
      {tab === "mappings" && (
        <FormGrid>
          <SectionHeading>Mapping relations · section: concept_mappings</SectionHeading>

          <RepeatableField
            label="Exact match"
            hint="skos.exactMatch · ConceptAuthority"
            values={values.exactMatch}
            onChange={(v) => set("exactMatch", v)}
            placeholder="Concept name or UUID"
          />

          <RepeatableField
            label="Close match"
            hint="skos.closeMatch · ConceptAuthority"
            values={values.closeMatch}
            onChange={(v) => set("closeMatch", v)}
            placeholder="Concept name or UUID"
          />

          <RepeatableField
            label="Broad match"
            hint="skos.broadMatch · ConceptAuthority"
            values={values.broadMatch}
            onChange={(v) => set("broadMatch", v)}
            placeholder="Concept name or UUID"
          />

          <RepeatableField
            label="Narrow match"
            hint="skos.narrowMatch · ConceptAuthority"
            values={values.narrowMatch}
            onChange={(v) => set("narrowMatch", v)}
            placeholder="Concept name or UUID"
          />

          <RepeatableField
            label="Related match"
            hint="skos.relatedMatch · ConceptAuthority"
            values={values.relatedMatch}
            onChange={(v) => set("relatedMatch", v)}
            placeholder="Concept name or UUID"
            span="full"
          />
        </FormGrid>
      )}

      {error && <ErrorBox message={error} />}

      <div
        style={{
          fontSize: 12,
          color: "#6b7280",
          background: "#f9fafb",
          border: "1px solid #e5e7eb",
          borderRadius: 8,
          padding: "10px 12px",
        }}
      >
        Sections: <strong>concept</strong>, <strong>concept_documentation</strong>,{" "}
        <strong>concept_semantic_relations</strong>, <strong>concept_mappings</strong>,{" "}
        <strong>concept_notations</strong>.
      </div>
    </ModalShell>
  );
}
