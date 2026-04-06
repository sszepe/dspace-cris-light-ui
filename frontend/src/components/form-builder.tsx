/**
 * src/pages/form-builder.tsx
 *
 * Form Layout Builder — visual editor for FormLayout overrides.
 *
 * Left panel:   Base fields from the generated submission form (read-only source)
 * Centre panel: Layout canvas — sections with draggable field cards
 * Right panel:  Inspector — edit selected section or field properties
 *
 * Conditional blocks are managed via a collapsible panel below the canvas.
 *
 * Data flow:
 *   - Loads base form from GET /api/dspace-config/submission-forms/<name>/
 *   - Loads existing layout from GET /api/dspace-config/form-layouts/?process=X&profile=Y&collection=Z
 *   - Saves layout via POST/PATCH /api/dspace-config/form-layouts/
 */

import React, {
  useMemo,
  useState,
} from "react";
import { djangoFetch } from "../api/django-client";

// ---------------------------------------------------------------------------
// Types (mirrors Django models)
// ---------------------------------------------------------------------------

type BaseField = {
  id: number;
  row: number;
  col: number;
  field: string;
  label: string;
  input_type: string;
  is_required: boolean;
  vocabulary: string;
  value_pairs_name: string;
  hint: string;
};

type FieldOverride = {
  id?: number;
  field_name: string;
  sort_order: number;
  label_override: string;
  hint_override: string;
  hidden: boolean;
};

type Section = {
  id?: number;
  key: string;
  label: string;
  sort_order: number;
  collapsed_by_default: boolean;
  helper_text_above: string;
  helper_text_below: string;
  field_overrides: FieldOverride[];
};

type ConditionalBlock = {
  id?: number;
  sort_order: number;
  trigger_field: string;
  trigger_value: string;
  revealed_fields: string[];
  revealed_section?: number | null;
};

// ---------------------------------------------------------------------------
// Mock API — replace with real fetch calls
// ---------------------------------------------------------------------------

const MOCK_BASE_FIELDS: BaseField[] = [
  { id: 1,  row: 0, col: 0, field: "dc.title",                label: "Title",                input_type: "onebox",   is_required: true,  vocabulary: "",        value_pairs_name: "",         hint: "" },
  { id: 2,  row: 1, col: 0, field: "dc.description.abstract", label: "Abstract",             input_type: "textarea", is_required: false, vocabulary: "",        value_pairs_name: "",         hint: "" },
  { id: 3,  row: 2, col: 0, field: "dc.type",                 label: "Type",                 input_type: "dropdown", is_required: false, vocabulary: "",        value_pairs_name: "dc_type",  hint: "" },
  { id: 4,  row: 3, col: 0, field: "dc.date.issued",          label: "Date Issued",          input_type: "date",     is_required: false, vocabulary: "",        value_pairs_name: "",         hint: "" },
  { id: 5,  row: 4, col: 0, field: "dc.contributor.author",   label: "Author",               input_type: "onebox",   is_required: false, vocabulary: "RPAuthority", value_pairs_name: "",    hint: "" },
  { id: 6,  row: 5, col: 0, field: "dc.language.iso",         label: "Language",             input_type: "dropdown", is_required: false, vocabulary: "",        value_pairs_name: "common_iso_languages", hint: "" },
  { id: 7,  row: 6, col: 0, field: "dc.subject",              label: "Subject Keywords",     input_type: "onebox",   is_required: false, vocabulary: "",        value_pairs_name: "",         hint: "Separate keywords with commas." },
  { id: 8,  row: 7, col: 0, field: "oairecerif.project.startDate", label: "Project Start", input_type: "date",     is_required: false, vocabulary: "",        value_pairs_name: "",         hint: "" },
  { id: 9,  row: 8, col: 0, field: "oairecerif.project.endDate",   label: "Project End",   input_type: "date",     is_required: false, vocabulary: "",        value_pairs_name: "",         hint: "" },
  { id: 10, row: 9, col: 0, field: "dc.rights",               label: "Rights",               input_type: "onebox",   is_required: false, vocabulary: "",        value_pairs_name: "",         hint: "" },
];

// ---------------------------------------------------------------------------
// Utility
// ---------------------------------------------------------------------------

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function inputTypeIcon(t: string) {
  const icons: Record<string, string> = {
    onebox: "T", textarea: "¶", dropdown: "▾", date: "📅",
    checkbox: "☑", group: "⊞", "inline-group": "⊟",
  };
  return icons[t] ?? "?";
}

function fieldBadgeColor(f: BaseField): string {
  if (f.is_required) return "#fde68a";
  if (f.vocabulary) return "#bfdbfe";
  if (f.value_pairs_name) return "#d9f99d";
  return "#f3f4f6";
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function FieldPill({
  field,
  inCanvas,
  isDragging,
  onDragStart,
  onClick,
  selected,
  hidden,
}: {
  field: BaseField;
  inCanvas?: boolean;
  isDragging?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onClick?: () => void;
  selected?: boolean;
  hidden?: boolean;
}) {
  return (
    <div
      draggable={!!onDragStart}
      onDragStart={onDragStart}
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 10px",
        borderRadius: 6,
        background: selected ? "#ede9fe" : inCanvas ? "#fff" : "#f9fafb",
        border: `1.5px solid ${selected ? "#7c3aed" : "#e5e7eb"}`,
        cursor: onDragStart ? "grab" : "default",
        opacity: isDragging ? 0.4 : hidden ? 0.45 : 1,
        fontSize: 12,
        fontFamily: "monospace",
        userSelect: "none",
        boxShadow: inCanvas ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
        transition: "border-color 0.15s, box-shadow 0.15s",
        marginBottom: inCanvas ? 4 : 0,
      }}
    >
      <span style={{
        width: 18, height: 18, borderRadius: 4,
        background: fieldBadgeColor(field),
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 10, fontWeight: 600, flexShrink: 0,
      }}>
        {inputTypeIcon(field.input_type)}
      </span>
      <span style={{ color: "#374151", flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {field.field}
      </span>
      {field.is_required && (
        <span style={{ color: "#b45309", fontWeight: 700, fontSize: 11 }}>*</span>
      )}
      {hidden && (
        <span title="Hidden" style={{ color: "#9ca3af", fontSize: 10 }}>👁</span>
      )}
    </div>
  );
}

function SectionCard({
  section,
  baseFields,
  selected,
  onSelect,
  onSelectField,
  selectedField,
  onDrop,
  onReorderField,
  onRemoveField,
}: {
  section: Section;
  baseFields: BaseField[];
  selected: boolean;
  onSelect: () => void;
  onSelectField: (f: string | null) => void;
  selectedField: string | null;
  onDrop: (fieldName: string) => void;
  onReorderField: (from: number, to: number) => void;
  onRemoveField: (fieldName: string) => void;
}) {
  const [dragOver, setDragOver] = useState(false);

  const fieldMap = useMemo(
    () => new Map(baseFields.map((f) => [f.field, f])),
    [baseFields]
  );

  return (
    <div
      style={{
        border: `2px solid ${selected ? "#7c3aed" : dragOver ? "#a78bfa" : "#e5e7eb"}`,
        borderRadius: 10,
        marginBottom: 10,
        background: "#fff",
        transition: "border-color 0.15s",
        overflow: "hidden",
      }}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        const data = e.dataTransfer.getData("text/plain");
        if (data.startsWith("base:")) {
          onDrop(data.slice(5));
        }
      }}
    >
      {/* Section header */}
      <div
        onClick={onSelect}
        style={{
          padding: "8px 12px",
          background: selected ? "#ede9fe" : "#f9fafb",
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          alignItems: "center",
          gap: 8,
          cursor: "pointer",
        }}
      >
        <span style={{ fontSize: 12, color: "#6b7280" }}>§</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#111827", flex: 1 }}>
          {section.label || <em style={{ color: "#9ca3af" }}>Untitled section</em>}
        </span>
        <span style={{ fontSize: 11, color: "#9ca3af", fontFamily: "monospace" }}>
          {section.key}
        </span>
        {section.collapsed_by_default && (
          <span title="Collapsed by default" style={{ fontSize: 11, color: "#6b7280" }}>⊟</span>
        )}
      </div>

      {/* Helper text above */}
      {section.helper_text_above && (
        <div style={{ padding: "6px 12px", fontSize: 11, color: "#6b7280", borderBottom: "1px solid #f3f4f6", background: "#fffbeb" }}>
          ↑ {section.helper_text_above}
        </div>
      )}

      {/* Fields */}
      <div style={{ padding: "8px 10px", minHeight: 40 }}>
        {section.field_overrides.length === 0 && (
          <div style={{ textAlign: "center", padding: "12px 0", color: "#d1d5db", fontSize: 12 }}>
            Drop fields here
          </div>
        )}
        {section.field_overrides.map((fo, idx) => {
          const base = fieldMap.get(fo.field_name);
          if (!base) return null;
          return (
            <div
              key={fo.field_name}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("text/plain", `reorder:${idx}`);
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.stopPropagation();
                const d = e.dataTransfer.getData("text/plain");
                if (d.startsWith("reorder:")) {
                  const fromIdx = parseInt(d.slice(8));
                  if (fromIdx !== idx) onReorderField(fromIdx, idx);
                }
              }}
              style={{ display: "flex", alignItems: "center", gap: 4 }}
            >
              <span style={{ color: "#d1d5db", cursor: "grab", fontSize: 14, paddingRight: 2 }}>⠿</span>
              <div style={{ flex: 1 }}>
                <FieldPill
                  field={{
                    ...base,
                    label: fo.label_override || base.label,
                  }}
                  inCanvas
                  selected={selectedField === fo.field_name}
                  hidden={fo.hidden}
                  onClick={() => onSelectField(fo.field_name)}
                />
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); onRemoveField(fo.field_name); }}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: "#e5e7eb", fontSize: 14, padding: "0 2px",
                  lineHeight: 1,
                }}
                title="Remove from section"
              >
                ×
              </button>
            </div>
          );
        })}
      </div>

      {/* Helper text below */}
      {section.helper_text_below && (
        <div style={{ padding: "6px 12px", fontSize: 11, color: "#6b7280", borderTop: "1px solid #f3f4f6", background: "#fffbeb" }}>
          ↓ {section.helper_text_below}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Form Builder
// ---------------------------------------------------------------------------

export function FormBuilderPage({ initialProcess }: { initialProcess?: string }) {
  const processName = initialProcess ?? "traditionaldescribe";
  const [baseFields] = useState<BaseField[]>(MOCK_BASE_FIELDS);
  const [sections, setSections] = useState<Section[]>([
    {
      key: "basic",
      label: "Basic Information",
      sort_order: 0,
      collapsed_by_default: false,
      helper_text_above: "",
      helper_text_below: "",
      field_overrides: [
        { field_name: "dc.title", sort_order: 0, label_override: "", hint_override: "", hidden: false },
        { field_name: "dc.type",  sort_order: 1, label_override: "", hint_override: "", hidden: false },
        { field_name: "dc.date.issued", sort_order: 2, label_override: "", hint_override: "", hidden: false },
      ],
    },
    {
      key: "description",
      label: "Description",
      sort_order: 1,
      collapsed_by_default: false,
      helper_text_above: "",
      helper_text_below: "",
      field_overrides: [
        { field_name: "dc.description.abstract", sort_order: 0, label_override: "", hint_override: "", hidden: false },
        { field_name: "dc.subject", sort_order: 1, label_override: "", hint_override: "", hidden: false },
      ],
    },
  ]);
  const [conditionals, setConditionals] = useState<ConditionalBlock[]>([]);

  const [selectedSectionKey, setSelectedSectionKey] = useState<string | null>("basic");
  const [selectedFieldName, setSelectedFieldName] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showConditionals, setShowConditionals] = useState(false);

  // Derive placed fields set
  const placedFields = useMemo(
    () => new Set(sections.flatMap((s) => s.field_overrides.map((f) => f.field_name))),
    [sections]
  );

  const filteredBaseFields = useMemo(
    () => baseFields.filter(
      (f) =>
        f.field.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.label.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [baseFields, searchQuery]
  );

  // Selected section / field
  const selectedSection = sections.find((s) => s.key === selectedSectionKey) ?? null;
  const selectedFieldOverride = selectedSection?.field_overrides.find(
    (f) => f.field_name === selectedFieldName
  ) ?? null;
  const selectedBaseField = selectedFieldOverride
    ? baseFields.find((f) => f.field === selectedFieldOverride.field_name) ?? null
    : null;

  // Mutators
  const addSection = () => {
    const key = `section-${uid()}`;
    setSections((prev) => [
      ...prev,
      {
        key,
        label: "New Section",
        sort_order: prev.length,
        collapsed_by_default: false,
        helper_text_above: "",
        helper_text_below: "",
        field_overrides: [],
      },
    ]);
    setSelectedSectionKey(key);
    setSelectedFieldName(null);
  };

  const updateSection = (key: string, patch: Partial<Section>) => {
    setSections((prev) =>
      prev.map((s) => (s.key === key ? { ...s, ...patch } : s))
    );
  };

  const removeSection = (key: string) => {
    setSections((prev) => prev.filter((s) => s.key !== key));
    if (selectedSectionKey === key) setSelectedSectionKey(null);
  };

  const dropFieldOnSection = (sectionKey: string, fieldName: string) => {
    if (placedFields.has(fieldName)) return; // already placed
    setSections((prev) =>
      prev.map((s) => {
        if (s.key !== sectionKey) return s;
        return {
          ...s,
          field_overrides: [
            ...s.field_overrides,
            {
              field_name: fieldName,
              sort_order: s.field_overrides.length,
              label_override: "",
              hint_override: "",
              hidden: false,
            },
          ],
        };
      })
    );
  };

  const reorderFieldInSection = (sectionKey: string, from: number, to: number) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.key !== sectionKey) return s;
        const fos = [...s.field_overrides];
        const [moved] = fos.splice(from, 1);
        fos.splice(to, 0, moved);
        return { ...s, field_overrides: fos.map((f, i) => ({ ...f, sort_order: i })) };
      })
    );
  };

  const removeFieldFromSection = (sectionKey: string, fieldName: string) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.key !== sectionKey) return s;
        return {
          ...s,
          field_overrides: s.field_overrides.filter((f) => f.field_name !== fieldName),
        };
      })
    );
    if (selectedFieldName === fieldName) setSelectedFieldName(null);
  };

  const updateFieldOverride = (
    sectionKey: string,
    fieldName: string,
    patch: Partial<FieldOverride>
  ) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.key !== sectionKey) return s;
        return {
          ...s,
          field_overrides: s.field_overrides.map((f) =>
            f.field_name === fieldName ? { ...f, ...patch } : f
          ),
        };
      })
    );
  };

  const reorderSections = (from: number, to: number) => {
    setSections((prev) => {
      const arr = [...prev];
      const [moved] = arr.splice(from, 1);
      arr.splice(to, 0, moved);
      return arr.map((s, i) => ({ ...s, sort_order: i }));
    });
  };

  const handleSave = async () => {
    setSaved(false);
    try {
      await djangoFetch("/api/dspace-config/form-layouts/", {
        method: "POST",
        body: {
          submission_process_name: processName,
          profile: import.meta.env.VITE_PROFILE ?? "plain",
          collection: null,
          label: `${processName} layout`,
          sections: sections.map((s) => ({
            key: s.key,
            label: s.label,
            sort_order: s.sort_order,
            collapsed_by_default: s.collapsed_by_default,
            helper_text_above: s.helper_text_above,
            helper_text_below: s.helper_text_below,
            field_overrides: s.field_overrides.map((f) => ({
              field_name: f.field_name,
              sort_order: f.sort_order,
              label_override: f.label_override,
              hint_override: f.hint_override,
              hidden: f.hidden,
            })),
          })),
          conditional_blocks: conditionals.map((c) => ({
            sort_order: c.sort_order,
            trigger_field: c.trigger_field,
            trigger_value: c.trigger_value,
            revealed_fields: c.revealed_fields,
            revealed_section: c.revealed_section ?? null,
          })),
        },
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  // ------------------------------------------------------------------ render

  return (
    <div style={{
      display: "flex", flexDirection: "column", height: "100vh",
      fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
      background: "#f8fafc", color: "#111827",
    }}>

      {/* Top bar */}
      <div style={{
        height: 52, background: "#fff", borderBottom: "1px solid #e5e7eb",
        display: "flex", alignItems: "center", padding: "0 16px", gap: 12,
        flexShrink: 0,
      }}>
        <span style={{ fontWeight: 700, fontSize: 14, color: "#111827" }}>
          Form Layout Builder
        </span>
        <span style={{ fontSize: 12, color: "#9ca3af" }}>·</span>
        <span style={{ fontSize: 12, color: "#6b7280", fontFamily: "monospace" }}>
          {processName}
        </span>
        <div style={{ flex: 1 }} />
        <button
          onClick={() => setShowConditionals((v) => !v)}
          style={{
            padding: "5px 12px", borderRadius: 6, border: "1px solid #e5e7eb",
            background: showConditionals ? "#ede9fe" : "#fff",
            color: showConditionals ? "#7c3aed" : "#374151",
            fontSize: 12, cursor: "pointer",
          }}
        >
          Conditionals ({conditionals.length})
        </button>
        <button
          onClick={handleSave}
          style={{
            padding: "6px 16px", borderRadius: 6,
            background: saved ? "#d1fae5" : "#7c3aed",
            color: saved ? "#065f46" : "#fff",
            border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer",
            transition: "background 0.2s",
          }}
        >
          {saved ? "✓ Saved" : "Save Layout"}
        </button>
      </div>

      {/* Main 3-column layout */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* ---- LEFT: Base fields palette ---- */}
        <div style={{
          width: 240, borderRight: "1px solid #e5e7eb",
          background: "#fff", display: "flex", flexDirection: "column",
          flexShrink: 0,
        }}>
          <div style={{ padding: "10px 12px", borderBottom: "1px solid #f3f4f6" }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
              Base Fields
            </div>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search…"
              style={{
                width: "100%", padding: "5px 8px", borderRadius: 5,
                border: "1px solid #e5e7eb", fontSize: 12,
                outline: "none", boxSizing: "border-box",
              }}
            />
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "8px 10px" }}>
            {filteredBaseFields.map((f) => {
              const isPlaced = placedFields.has(f.field);
              return (
                <div
                  key={f.field}
                  draggable={!isPlaced}
                  onDragStart={(e) => {
                    e.dataTransfer.setData("text/plain", `base:${f.field}`);
                  }}
                  style={{
                    marginBottom: 4,
                    opacity: isPlaced ? 0.4 : 1,
                    cursor: isPlaced ? "default" : "grab",
                  }}
                  title={isPlaced ? "Already placed in a section" : "Drag to a section"}
                >
                  <FieldPill field={f} />
                </div>
              );
            })}
            {filteredBaseFields.length === 0 && (
              <div style={{ color: "#d1d5db", fontSize: 12, textAlign: "center", paddingTop: 20 }}>
                No fields found
              </div>
            )}
          </div>
          {/* Legend */}
          <div style={{ padding: "8px 12px", borderTop: "1px solid #f3f4f6", fontSize: 10, color: "#9ca3af" }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[
                { color: "#fde68a", label: "Required" },
                { color: "#bfdbfe", label: "Authority" },
                { color: "#d9f99d", label: "Value pairs" },
              ].map(({ color, label }) => (
                <span key={label} style={{ display: "flex", alignItems: "center", gap: 3 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: color, display: "inline-block" }} />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ---- CENTRE: Canvas ---- */}
        <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
          <div style={{ maxWidth: 560, margin: "0 auto" }}>

            {sections.map((section, idx) => (
              <div
                key={section.key}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData("text/plain", `section:${idx}`);
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  const d = e.dataTransfer.getData("text/plain");
                  if (d.startsWith("section:")) {
                    const fromIdx = parseInt(d.slice(8));
                    if (fromIdx !== idx) reorderSections(fromIdx, idx);
                  }
                }}
              >
                <SectionCard
                  section={section}
                  baseFields={baseFields}
                  selected={selectedSectionKey === section.key}
                  onSelect={() => {
                    setSelectedSectionKey(section.key);
                    setSelectedFieldName(null);
                  }}
                  onSelectField={(f) => {
                    setSelectedSectionKey(section.key);
                    setSelectedFieldName(f);
                  }}
                  selectedField={selectedSectionKey === section.key ? selectedFieldName : null}
                  onDrop={(fieldName) => dropFieldOnSection(section.key, fieldName)}
                  onReorderField={(from, to) => reorderFieldInSection(section.key, from, to)}
                  onRemoveField={(fieldName) => removeFieldFromSection(section.key, fieldName)}
                />
              </div>
            ))}

            <button
              onClick={addSection}
              style={{
                width: "100%", padding: "10px 0", borderRadius: 8,
                border: "2px dashed #e5e7eb", background: "transparent",
                color: "#9ca3af", fontSize: 13, cursor: "pointer",
                transition: "border-color 0.15s, color 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.borderColor = "#7c3aed";
                (e.target as HTMLButtonElement).style.color = "#7c3aed";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.borderColor = "#e5e7eb";
                (e.target as HTMLButtonElement).style.color = "#9ca3af";
              }}
            >
              + Add Section
            </button>

            {/* Conditionals panel */}
            {showConditionals && (
              <div style={{
                marginTop: 16, border: "1px solid #e5e7eb", borderRadius: 10,
                background: "#fff", overflow: "hidden",
              }}>
                <div style={{
                  padding: "8px 12px", background: "#faf5ff",
                  borderBottom: "1px solid #e5e7eb", display: "flex",
                  alignItems: "center", justifyContent: "space-between",
                }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#6d28d9" }}>
                    Conditional Rules
                  </span>
                  <button
                    onClick={() =>
                      setConditionals((prev) => [
                        ...prev,
                        {
                          sort_order: prev.length,
                          trigger_field: "",
                          trigger_value: "",
                          revealed_fields: [],
                          revealed_section: null,
                        },
                      ])
                    }
                    style={{
                      padding: "3px 10px", borderRadius: 5,
                      background: "#7c3aed", color: "#fff",
                      border: "none", fontSize: 11, cursor: "pointer",
                    }}
                  >
                    + Rule
                  </button>
                </div>
                {conditionals.length === 0 && (
                  <div style={{ padding: 16, color: "#9ca3af", fontSize: 12, textAlign: "center" }}>
                    No conditional rules. Add a rule to show fields based on a field value.
                  </div>
                )}
                {conditionals.map((cond, i) => (
                  <div key={i} style={{
                    padding: "10px 12px", borderBottom: "1px solid #f3f4f6",
                    display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto",
                    gap: 8, alignItems: "center",
                  }}>
                    <div>
                      <div style={{ fontSize: 10, color: "#9ca3af", marginBottom: 2 }}>If field</div>
                      <select
                        value={cond.trigger_field}
                        onChange={(e) => setConditionals((prev) =>
                          prev.map((c, j) => j === i ? { ...c, trigger_field: e.target.value } : c)
                        )}
                        style={{ width: "100%", padding: "4px 6px", borderRadius: 4, border: "1px solid #e5e7eb", fontSize: 11 }}
                      >
                        <option value="">Select field…</option>
                        {baseFields
                          .filter((f) => f.input_type === "dropdown" || f.value_pairs_name)
                          .map((f) => (
                            <option key={f.field} value={f.field}>{f.field}</option>
                          ))}
                      </select>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: "#9ca3af", marginBottom: 2 }}>equals</div>
                      <input
                        value={cond.trigger_value}
                        onChange={(e) => setConditionals((prev) =>
                          prev.map((c, j) => j === i ? { ...c, trigger_value: e.target.value } : c)
                        )}
                        placeholder="stored value…"
                        style={{ width: "100%", padding: "4px 6px", borderRadius: 4, border: "1px solid #e5e7eb", fontSize: 11 }}
                      />
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: "#9ca3af", marginBottom: 2 }}>reveal section</div>
                      <select
                        value={cond.revealed_section ?? ""}
                        onChange={(e) => setConditionals((prev) =>
                          prev.map((c, j) =>
                            j === i ? { ...c, revealed_section: e.target.value ? Number(e.target.value) : null } : c
                          )
                        )}
                        style={{ width: "100%", padding: "4px 6px", borderRadius: 4, border: "1px solid #e5e7eb", fontSize: 11 }}
                      >
                        <option value="">None</option>
                        {sections.map((s) => (
                          <option key={s.key} value={s.id ?? s.key}>{s.label}</option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={() => setConditionals((prev) => prev.filter((_, j) => j !== i))}
                      style={{ background: "none", border: "none", color: "#e5e7eb", cursor: "pointer", fontSize: 16, padding: "0 4px" }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ---- RIGHT: Inspector ---- */}
        <div style={{
          width: 256, borderLeft: "1px solid #e5e7eb",
          background: "#fff", overflowY: "auto", flexShrink: 0,
        }}>
          {/* Field inspector */}
          {selectedFieldOverride && selectedBaseField && selectedSection && (
            <div>
              <div style={{ padding: "10px 12px", borderBottom: "1px solid #f3f4f6", background: "#faf5ff" }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#7c3aed", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Field
                </div>
                <div style={{ fontSize: 12, fontFamily: "monospace", color: "#374151", marginTop: 2 }}>
                  {selectedBaseField.field}
                </div>
              </div>
              <div style={{ padding: "12px" }}>
                <Label>Label override</Label>
                <input
                  value={selectedFieldOverride.label_override}
                  onChange={(e) =>
                    updateFieldOverride(selectedSection.key, selectedBaseField.field, {
                      label_override: e.target.value,
                    })
                  }
                  placeholder={selectedBaseField.label}
                  style={inputStyle}
                />
                <Label>Hint override</Label>
                <textarea
                  value={selectedFieldOverride.hint_override}
                  onChange={(e) =>
                    updateFieldOverride(selectedSection.key, selectedBaseField.field, {
                      hint_override: e.target.value,
                    })
                  }
                  placeholder={selectedBaseField.hint || "No hint"}
                  rows={3}
                  style={{ ...inputStyle, resize: "vertical" as const }}
                />
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", marginTop: 8 }}>
                  <input
                    type="checkbox"
                    checked={selectedFieldOverride.hidden}
                    onChange={(e) =>
                      updateFieldOverride(selectedSection.key, selectedBaseField.field, {
                        hidden: e.target.checked,
                      })
                    }
                  />
                  <span style={{ fontSize: 12, color: "#374151" }}>
                    Visually hidden
                    <span style={{ display: "block", fontSize: 11, color: "#9ca3af" }}>
                      Still submitted to DSpace
                    </span>
                  </span>
                </label>
                {/* Read-only info */}
                <div style={{ marginTop: 16, padding: "10px", background: "#f9fafb", borderRadius: 6 }}>
                  <Row label="Input type" value={selectedBaseField.input_type} />
                  <Row label="Required" value={selectedBaseField.is_required ? "Yes" : "No"} />
                  {selectedBaseField.vocabulary && <Row label="Vocabulary" value={selectedBaseField.vocabulary} />}
                  {selectedBaseField.value_pairs_name && <Row label="Value pairs" value={selectedBaseField.value_pairs_name} />}
                </div>
              </div>
            </div>
          )}

          {/* Section inspector */}
          {selectedSection && !selectedFieldOverride && (
            <div>
              <div style={{ padding: "10px 12px", borderBottom: "1px solid #f3f4f6", background: "#f0fdf4" }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#15803d", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Section
                </div>
              </div>
              <div style={{ padding: "12px" }}>
                <Label>Label</Label>
                <input
                  value={selectedSection.label}
                  onChange={(e) => updateSection(selectedSection.key, { label: e.target.value })}
                  style={inputStyle}
                />
                <Label>Key</Label>
                <input
                  value={selectedSection.key}
                  readOnly
                  style={{ ...inputStyle, background: "#f9fafb", color: "#9ca3af" }}
                />
                <Label>Helper text above</Label>
                <textarea
                  value={selectedSection.helper_text_above}
                  onChange={(e) => updateSection(selectedSection.key, { helper_text_above: e.target.value })}
                  rows={2}
                  placeholder="Shown above the section…"
                  style={{ ...inputStyle, resize: "vertical" as const }}
                />
                <Label>Helper text below</Label>
                <textarea
                  value={selectedSection.helper_text_below}
                  onChange={(e) => updateSection(selectedSection.key, { helper_text_below: e.target.value })}
                  rows={2}
                  placeholder="Shown below the section…"
                  style={{ ...inputStyle, resize: "vertical" as const }}
                />
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", marginTop: 8 }}>
                  <input
                    type="checkbox"
                    checked={selectedSection.collapsed_by_default}
                    onChange={(e) => updateSection(selectedSection.key, { collapsed_by_default: e.target.checked })}
                  />
                  <span style={{ fontSize: 12, color: "#374151" }}>Collapsed by default</span>
                </label>
                <button
                  onClick={() => removeSection(selectedSection.key)}
                  style={{
                    marginTop: 16, width: "100%", padding: "6px 0",
                    borderRadius: 6, border: "1px solid #fecaca",
                    background: "#fff", color: "#dc2626", fontSize: 12, cursor: "pointer",
                  }}
                >
                  Remove section
                </button>
              </div>
            </div>
          )}

          {/* Empty state */}
          {!selectedSection && !selectedFieldOverride && (
            <div style={{ padding: 24, color: "#9ca3af", fontSize: 12, textAlign: "center" }}>
              Click a section or field to edit its properties.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "6px 8px",
  borderRadius: 5,
  border: "1px solid #e5e7eb",
  fontSize: 12,
  outline: "none",
  boxSizing: "border-box",
  marginBottom: 8,
};

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 10, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3, marginTop: 8 }}>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 3 }}>
      <span style={{ color: "#9ca3af" }}>{label}</span>
      <span style={{ color: "#374151", fontFamily: "monospace" }}>{value}</span>
    </div>
  );
}
