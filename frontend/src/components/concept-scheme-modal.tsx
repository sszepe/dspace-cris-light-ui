/**
 * concept-scheme-modal.tsx
 *
 * Creation modal for SKOS ConceptScheme entities.
 * Maps to the DSpace "conceptscheme" submission form.
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
  createConceptSchemeWorkspaceItem,
  defaultConceptSchemeValues,
  type ConceptSchemeValues,
} from "../api/skos-creation-api";

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

// ── Component ─────────────────────────────────────────────────────────────────

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated?: (wsId: number) => void;
};

export default function ConceptSchemeModal({ open, onClose, onCreated }: Props) {
  const [values, setValues] = React.useState<ConceptSchemeValues>(defaultConceptSchemeValues);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [touched, setTouched] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setValues(defaultConceptSchemeValues());
      setError(null);
      setTouched(false);
    }
  }, [open]);

  if (!open) return null;

  const titleMissing = touched && !values.title.trim();
  const descMissing = touched && !values.description.trim();

  const set = <K extends keyof ConceptSchemeValues>(key: K, val: ConceptSchemeValues[K]) =>
    setValues((prev) => ({ ...prev, [key]: val }));

  const submit = async () => {
    setTouched(true);
    if (!values.title.trim() || !values.description.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const wsId = await createConceptSchemeWorkspaceItem(values);
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
      title="Create Concept Scheme"
      subtitle="Creates a new SKOS ConceptScheme workspace item using the conceptscheme submission form."
      onClose={onClose}
      width={860}
      footer={
        <>
          <Button onClick={onClose} disabled={saving}>Cancel</Button>
          <Button kind="primary" disabled={saving} onClick={() => void submit()}>
            {saving ? "Creating…" : "Create draft"}
          </Button>
        </>
      }
    >
      <FormGrid>
        <SectionHeading>Identity</SectionHeading>

        <Labeled
          label="Title"
          required
          hint="dc.title"
          error={titleMissing ? "Title is required." : null}
          span="full"
        >
          <input
            style={{ ...inputStyle, borderColor: titleMissing ? "#dc2626" : "#d1d5db" }}
            value={values.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Concept scheme name"
          />
        </Labeled>

        <Labeled
          label="Description"
          required
          hint="dc.description"
          error={descMissing ? "Description is required." : null}
          span="full"
        >
          <textarea
            style={{
              ...inputStyle,
              minHeight: 90,
              resize: "vertical",
              borderColor: descMissing ? "#dc2626" : "#d1d5db",
            }}
            value={values.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="A human-readable description of this concept scheme"
          />
        </Labeled>

        <SectionHeading>Provenance</SectionHeading>

        <Labeled label="Creator" hint="dc.creator · CustomPersonAuthority">
          <input
            style={inputStyle}
            value={values.creator}
            onChange={(e) => set("creator", e.target.value)}
            placeholder="Person name or UUID"
          />
        </Labeled>

        <Labeled label="Publisher" hint="dc.publisher · OrgUnitAuthority">
          <input
            style={inputStyle}
            value={values.publisher}
            onChange={(e) => set("publisher", e.target.value)}
            placeholder="Organisation name or UUID"
          />
        </Labeled>

        <Labeled label="Date issued" hint="dc.date.issued">
          <input
            style={inputStyle}
            type="date"
            value={values.dateIssued}
            onChange={(e) => set("dateIssued", e.target.value)}
          />
        </Labeled>

        <SectionHeading>Classification</SectionHeading>

        <RepeatableField
          label="Contributors"
          hint="dc.contributor"
          values={values.contributors}
          onChange={(v) => set("contributors", v)}
          placeholder="Contributor name"
        />

        <RepeatableField
          label="Subjects"
          hint="dc.subject"
          values={values.subjects}
          onChange={(v) => set("subjects", v)}
          placeholder="Subject keyword"
        />

        <SectionHeading>SKOS</SectionHeading>

        <RepeatableField
          label="Top concepts"
          hint="skos.hasTopConcept · ConceptAuthority"
          values={values.hasTopConcepts}
          onChange={(v) => set("hasTopConcepts", v)}
          placeholder="Concept name or UUID"
          span="full"
        />

        <RepeatableField
          label="Notations"
          hint="skos.notation"
          values={values.notations}
          onChange={(v) => set("notations", v)}
          placeholder="Notation string"
          span="full"
        />
      </FormGrid>

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
        Section: <strong>conceptscheme</strong> · Fields:{" "}
        <strong>dc.title</strong>, <strong>dc.description</strong>,{" "}
        <strong>dc.creator</strong>, <strong>dc.contributor</strong>,{" "}
        <strong>dc.subject</strong>, <strong>dc.publisher</strong>,{" "}
        <strong>dc.date.issued</strong>, <strong>skos.hasTopConcept</strong>,{" "}
        <strong>skos.notation</strong>.
      </div>
    </ModalShell>
  );
}
