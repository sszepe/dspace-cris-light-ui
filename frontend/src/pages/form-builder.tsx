/**
 * src/pages/form-builder.tsx
 *
 * Form Layout Builder — visual editor for FormLayout overrides.
 *
 * Mirrors DSpace CRIS submission form structure exactly:
 *   - A form has ROWs
 *   - Each row has 1–2 COLUMNs (fields side by side)
 *   - Group / inline-group fields expand into sub-rows
 *
 * Left panel:   Base fields palette (from Django, grouped by row/col)
 * Centre panel: Canvas — rows with drop zones between and within them
 * Right panel:  Inspector — field / section properties
 *
 * Drag-and-drop:
 *   - Drag from palette → drop into a row slot or the "new row" zone
 *   - Drag a canvas field → reorder rows or swap columns
 *   - Arrow buttons (↑ ↓) always available as keyboard-friendly fallback
 */

import React, { useMemo, useState, useRef } from "react";
import { djangoFetch } from "../api/django-client";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A field as returned by the Django submission-forms API */
type BaseField = {
  id: number;
  row: number;
  col: number;
  field: string;
  label: string;
  input_type: string;
  is_required: boolean;
  required_msg?: string;
  repeatable?: boolean;
  vocabulary: string;
  vocabulary_closed?: boolean;
  value_pairs_name: string;
  hint: string;
  style?: string;
  regex?: string;
  language_codes?: string[];
  type_binds?: string[];
  child_form_name?: string;
  child_form?: number | null;
  child_form_name_resolved?: string | null;
};

/** A row in the canvas — 1 or 2 fields side by side */
type CanvasRow = {
  id: string;           // stable local id
  cols: CanvasField[];  // 1 or 2 entries
};

/** One field cell in the canvas */
type CanvasField = {
  field_name: string;
  label_override: string;
  hint_override: string;
  hidden: boolean;
};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MOCK_BASE_FIELDS: BaseField[] = [
  { id:1, row:0, col:0, field:"dc.title",               label:"Title",         input_type:"onebox",   is_required:true,  vocabulary:"", value_pairs_name:"", hint:"" },
  { id:2, row:1, col:0, field:"dc.description.abstract",label:"Abstract",      input_type:"textarea", is_required:false, vocabulary:"", value_pairs_name:"", hint:"" },
  { id:3, row:2, col:0, field:"dc.type",                label:"Type",          input_type:"dropdown", is_required:false, vocabulary:"", value_pairs_name:"dc_type", hint:"" },
  { id:4, row:3, col:0, field:"dc.date.issued",         label:"Date Issued",   input_type:"date",     is_required:false, vocabulary:"", value_pairs_name:"", hint:"" },
  { id:5, row:4, col:0, field:"dc.contributor.author",  label:"Author",        input_type:"onebox",   is_required:false, vocabulary:"RPAuthority", value_pairs_name:"", hint:"" },
  { id:6, row:5, col:0, field:"dc.language.iso",        label:"Language",      input_type:"dropdown", is_required:false, vocabulary:"", value_pairs_name:"common_iso_languages", hint:"" },
  { id:7, row:6, col:0, field:"dc.subject",             label:"Keywords",      input_type:"onebox",   is_required:false, vocabulary:"", value_pairs_name:"", hint:"" },
  { id:8, row:7, col:0, field:"dc.rights",              label:"Rights",        input_type:"onebox",   is_required:false, vocabulary:"", value_pairs_name:"", hint:"" },
];

const INPUT_ICONS: Record<string, string> = {
  onebox:"T", textarea:"¶", dropdown:"▾", date:"📅",
  name:"👤", tag:"#", group:"⊞", "inline-group":"⊟",
  qualdrop_value:":", series:"≡", link:"🔗", lookup:"🔍",
};

function uid() { return Math.random().toString(36).slice(2, 9); }
function inputIcon(t: string) { return INPUT_ICONS[t] ?? "?"; }

function badgeColor(f: BaseField): string {
  if (f.is_required) return "#fde68a";
  if (f.input_type === "group" || f.input_type === "inline-group") return "#e9d5ff";
  if (f.vocabulary) return "#bfdbfe";
  if (f.value_pairs_name) return "#d9f99d";
  if (f.repeatable) return "#fed7aa";
  return "#f1f5f9";
}

// ---------------------------------------------------------------------------
// Small UI helpers
// ---------------------------------------------------------------------------

const iStyle: React.CSSProperties = {
  width:"100%", padding:"5px 8px", borderRadius:5,
  border:"1px solid #e5e7eb", fontSize:12, outline:"none",
  boxSizing:"border-box", marginBottom:6,
};

function Lbl({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize:10, fontWeight:700, color:"#9ca3af", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:2, marginTop:8 }}>{children}</div>;
}

function FieldChip({
  base, override, selected, placed, onDragStart, onClick, compact,
}: {
  base: BaseField;
  override?: CanvasField;
  selected?: boolean;
  placed?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onClick?: () => void;
  compact?: boolean;
}) {
  const label = override?.label_override || base.label || base.field;
  const isHidden = override?.hidden ?? false;
  const isGroup = base.input_type === "group" || base.input_type === "inline-group";

  return (
    <div
      draggable={!!onDragStart}
      onDragStart={onDragStart}
      onClick={onClick}
      title={`${base.field}\nType: ${base.input_type}${base.hint ? "\n" + base.hint : ""}`}
      style={{
        display:"flex", alignItems:"center", gap:5,
        padding: compact ? "4px 8px" : "6px 10px",
        borderRadius:6,
        background: selected ? "#ede9fe" : "#fff",
        border:`1.5px solid ${selected ? "#7c3aed" : isGroup ? "#c4b5fd" : "#e5e7eb"}`,
        cursor: onDragStart ? "grab" : onClick ? "pointer" : "default",
        opacity: isHidden ? 0.5 : placed && !onDragStart ? 0.4 : 1,
        fontSize:11, fontFamily:"monospace",
        userSelect:"none",
        boxShadow: selected ? "0 0 0 2px #ede9fe" : "none",
        transition:"border-color 0.12s, box-shadow 0.12s",
        minWidth:0, overflow:"hidden",
      }}
    >
      <span style={{
        width:17, height:17, borderRadius:3,
        background: badgeColor(base),
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:9, fontWeight:700, flexShrink:0,
      }}>
        {inputIcon(base.input_type)}
      </span>
      <span style={{ flex:1, minWidth:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", color:"#374151" }}>
        {label}
      </span>
      <span style={{ color:"#9ca3af", fontSize:9, flexShrink:0, maxWidth:80, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
        {base.field.split(".").slice(-1)[0]}
      </span>
      {base.is_required && <span style={{ color:"#b45309", fontWeight:800, fontSize:10, flexShrink:0 }}>*</span>}
      {isHidden && <span title="Hidden" style={{ color:"#cbd5e1", fontSize:9, flexShrink:0 }}>⊘</span>}
      {base.repeatable && <span title="Repeatable" style={{ color:"#fb923c", fontSize:9, flexShrink:0 }}>+</span>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Drop zone
// ---------------------------------------------------------------------------

function DropZone({
  onDrop, active, vertical,
}: {
  onDrop: (fieldName: string, src: "palette" | "canvas", srcRow?: number, srcCol?: number) => void;
  active?: boolean;
  vertical?: boolean;
}) {
  const [over, setOver] = useState(false);

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault(); e.stopPropagation(); setOver(false);
        const raw = e.dataTransfer.getData("text/plain");
        if (raw.startsWith("palette:")) {
          onDrop(raw.slice(8), "palette");
        } else if (raw.startsWith("canvas:")) {
          const [,rowStr, colStr] = raw.split(":");
          onDrop("", "canvas", parseInt(rowStr), parseInt(colStr));
        }
      }}
      style={{
        transition:"all 0.12s",
        ...(vertical ? {
          width: over ? 32 : 8,
          minHeight: 40,
          background: over ? "#ede9fe" : "transparent",
          border: over ? "2px dashed #7c3aed" : "2px dashed transparent",
          borderRadius:6, flexShrink:0, alignSelf:"stretch",
        } : {
          height: over ? 28 : 6,
          margin: "1px 0",
          background: over ? "#ede9fe" : "transparent",
          border: over ? "2px dashed #7c3aed" : "2px dashed transparent",
          borderRadius:6,
        }),
      }}
    />
  );
}

// ---------------------------------------------------------------------------
// Canvas Row component
// ---------------------------------------------------------------------------

function CanvasRowCard({
  rowIdx, row, fieldMap, selectedField, onSelectField,
  onMoveRow, canMoveUp, canMoveDown,
  onDropOnRow, onDropBetweenCols, onRemoveField,
  totalRows,
}: {
  rowIdx: number;
  row: CanvasRow;
  fieldMap: Map<string, BaseField>;
  selectedField: { row: number; col: number } | null;
  onSelectField: (row: number, col: number) => void;
  onMoveRow: (from: number, to: number) => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onDropOnRow: (targetRow: number, targetCol: number, fieldName: string, src: "palette" | "canvas", srcRow?: number, srcCol?: number) => void;
  onDropBetweenCols: (targetRow: number, fieldName: string, src: "palette" | "canvas", srcRow?: number, srcCol?: number) => void;
  onRemoveField: (rowIdx: number, colIdx: number) => void;
  totalRows: number;
}) {
  const [rowDragOver, setRowDragOver] = useState(false);
  const dragRef = useRef<{ rowIdx: number }>({ rowIdx });
  dragRef.current.rowIdx = rowIdx;

  return (
    <div
      style={{
        display:"flex", alignItems:"stretch", gap:4,
        marginBottom:2, position:"relative",
      }}
    >
      {/* Row drag handle + move buttons */}
      <div style={{
        display:"flex", flexDirection:"column", alignItems:"center",
        justifyContent:"center", gap:1, width:20, flexShrink:0,
      }}>
        <div
          draggable
          onDragStart={(e) => {
            e.dataTransfer.setData("text/plain", `row:${rowIdx}`);
            e.dataTransfer.effectAllowed = "move";
          }}
          title="Drag to reorder row"
          style={{ cursor:"grab", color:"#d1d5db", fontSize:12, userSelect:"none", lineHeight:1 }}
        >⠿</div>
        <button
          onClick={() => canMoveUp && onMoveRow(rowIdx, rowIdx - 1)}
          disabled={!canMoveUp}
          title="Move row up"
          style={{
            background:"none", border:"none", cursor: canMoveUp ? "pointer" : "default",
            color: canMoveUp ? "#94a3b8" : "#e2e8f0", fontSize:10, padding:"1px", lineHeight:1,
          }}
        >▲</button>
        <button
          onClick={() => canMoveDown && onMoveRow(rowIdx, rowIdx + 1)}
          disabled={!canMoveDown}
          title="Move row down"
          style={{
            background:"none", border:"none", cursor: canMoveDown ? "pointer" : "default",
            color: canMoveDown ? "#94a3b8" : "#e2e8f0", fontSize:10, padding:"1px", lineHeight:1,
          }}
        >▼</button>
      </div>

      {/* Row body */}
      <div
        onDragOver={(e) => { e.preventDefault(); setRowDragOver(true); }}
        onDragLeave={() => setRowDragOver(false)}
        onDrop={(e) => {
          e.preventDefault(); setRowDragOver(false);
          const raw = e.dataTransfer.getData("text/plain");
          if (raw.startsWith("row:")) {
            const fromRow = parseInt(raw.slice(4));
            if (fromRow !== rowIdx) onMoveRow(fromRow, rowIdx);
          }
        }}
        style={{
          flex:1, display:"flex", alignItems:"stretch",
          border:`1.5px solid ${rowDragOver ? "#7c3aed" : "#e5e7eb"}`,
          borderRadius:7, background:"#fff",
          overflow:"hidden", minHeight:44,
          transition:"border-color 0.12s",
        }}
      >
        {row.cols.map((cf, colIdx) => {
          const base = fieldMap.get(cf.field_name);
          const isSelected = selectedField?.row === rowIdx && selectedField?.col === colIdx;
          return (
            <React.Fragment key={colIdx}>
              {/* Drop zone between columns */}
              {colIdx > 0 && (
                <DropZone
                  vertical
                  onDrop={(fn, src, sr, sc) => onDropBetweenCols(rowIdx, fn || cf.field_name, src, sr, sc)}
                />
              )}
              {/* Column cell */}
              <div
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData("text/plain", `canvas:${rowIdx}:${colIdx}`);
                  e.dataTransfer.effectAllowed = "move";
                }}
                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                onDrop={(e) => {
                  e.preventDefault(); e.stopPropagation();
                  const raw = e.dataTransfer.getData("text/plain");
                  if (raw.startsWith("palette:")) {
                    onDropOnRow(rowIdx, colIdx, raw.slice(8), "palette");
                  } else if (raw.startsWith("canvas:")) {
                    const [,rowStr,colStr] = raw.split(":");
                    onDropOnRow(rowIdx, colIdx, "", "canvas", parseInt(rowStr), parseInt(colStr));
                  }
                }}
                onClick={() => onSelectField(rowIdx, colIdx)}
                style={{
                  flex:1, padding:"6px 8px", cursor:"pointer", minWidth:0,
                  background: isSelected ? "#faf5ff" : colIdx % 2 === 1 ? "#fafafa" : "#fff",
                  borderLeft: colIdx > 0 ? "1px solid #f1f5f9" : "none",
                  transition:"background 0.1s",
                }}
              >
                {base ? (
                  <FieldChip
                    base={base}
                    override={cf}
                    selected={isSelected}
                    compact
                  />
                ) : (
                  <span style={{ fontSize:10, color:"#fca5a5", fontFamily:"monospace" }}>
                    ⚠ {cf.field_name} (not in form)
                  </span>
                )}
              </div>
            </React.Fragment>
          );
        })}

        {/* Empty second column slot — shown when row has only 1 col */}
        {row.cols.length === 1 && (
          <>
            <DropZone
              vertical
              onDrop={(fn, src, sr, sc) => {
                if (fn) onDropOnRow(rowIdx, 1, fn, src);
                else    onDropOnRow(rowIdx, 1, "", src, sr, sc);
              }}
            />
            <div style={{
              flex:1, display:"flex", alignItems:"center", justifyContent:"center",
              color:"#e2e8f0", fontSize:10, padding:"6px", borderLeft:"1px solid #f1f5f9",
            }}>
              + col
            </div>
          </>
        )}
      </div>

      {/* Remove buttons */}
      <div style={{ display:"flex", flexDirection:"column", justifyContent:"center", gap:2, width:20, flexShrink:0 }}>
        {row.cols.map((_, colIdx) => (
          <button
            key={colIdx}
            onClick={() => onRemoveField(rowIdx, colIdx)}
            title={`Remove ${colIdx === 0 ? "left" : "right"} field`}
            style={{
              background:"none", border:"none", cursor:"pointer",
              color:"#fca5a5", fontSize:13, padding:"0 2px", lineHeight:1,
              fontWeight:600,
            }}
          >×</button>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function FormBuilderPage({ initialProcess }: { initialProcess?: string }) {
  // ── Form loading ───────────────────────────────────────────────────────────
  const [availableForms, setAvailableForms] = useState<Array<{ id: number; name: string }>>([]);
  const [selectedFormId, setSelectedFormId] = useState<number | null>(null);
  const [baseFields, setBaseFields] = useState<BaseField[]>(MOCK_BASE_FIELDS);
  const [formsLoading, setFormsLoading] = useState(true);

  const processName = availableForms.find(f => f.id === selectedFormId)?.name
    ?? initialProcess ?? "traditionaldescribe";

  React.useEffect(() => {
    setFormsLoading(true);
    djangoFetch<Array<{ id: number; name: string }>>("/submission-forms/")
      .then(forms => {
        setAvailableForms(forms);
        if (forms.length > 0) setSelectedFormId(forms[0].id);
      })
      .catch(() => setAvailableForms([]))
      .finally(() => setFormsLoading(false));
  }, []);

  React.useEffect(() => {
    if (!selectedFormId) return;
    djangoFetch<{ id: number; name: string; fields: BaseField[] }>(`/submission-forms/${selectedFormId}/`)
      .then(form => setBaseFields(form.fields?.length ? form.fields : MOCK_BASE_FIELDS))
      .catch(() => setBaseFields(MOCK_BASE_FIELDS));
  }, [selectedFormId]);

  // ── Canvas rows state ──────────────────────────────────────────────────────
  // Initialise canvas from baseFields row/col structure
  const [canvasRows, setCanvasRows] = useState<CanvasRow[]>(() =>
    buildInitialCanvas(MOCK_BASE_FIELDS)
  );

  // When form changes, reset canvas to reflect that form's row/col layout
  React.useEffect(() => {
    setCanvasRows(buildInitialCanvas(baseFields));
    setSelectedCell(null);
  }, [baseFields]);

  // ── Selection ──────────────────────────────────────────────────────────────
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);

  // ── Search / filter ────────────────────────────────────────────────────────
  const [search, setSearch] = useState("");

  // ── Save state ─────────────────────────────────────────────────────────────
  const [saved, setSaved] = useState(false);

  // Derived maps
  const fieldMap = useMemo(() => new Map(baseFields.map(f => [f.field, f])), [baseFields]);
  const placedFields = useMemo(() =>
    new Set(canvasRows.flatMap(r => r.cols.map(c => c.field_name))),
    [canvasRows]
  );
  const filteredPalette = useMemo(() =>
    baseFields.filter(f =>
      f.field.toLowerCase().includes(search.toLowerCase()) ||
      (f.label || "").toLowerCase().includes(search.toLowerCase())
    ),
    [baseFields, search]
  );

  // Selected cell data
  const selectedRow = selectedCell != null ? canvasRows[selectedCell.row] : null;
  const selectedCF  = selectedRow?.cols[selectedCell?.col ?? 0] ?? null;
  const selectedBase = selectedCF ? fieldMap.get(selectedCF.field_name) : null;

  // ── Canvas mutations ───────────────────────────────────────────────────────

  function moveRow(from: number, to: number) {
    setCanvasRows(prev => {
      const rows = [...prev];
      const [moved] = rows.splice(from, 1);
      rows.splice(to, 0, moved);
      return rows.map((r, i) => ({ ...r, id: r.id })); // stable ids
    });
    // Update selection if needed
    if (selectedCell) {
      if (selectedCell.row === from) setSelectedCell({ ...selectedCell, row: to });
      else if (from < to && selectedCell.row > from && selectedCell.row <= to)
        setSelectedCell({ ...selectedCell, row: selectedCell.row - 1 });
      else if (from > to && selectedCell.row >= to && selectedCell.row < from)
        setSelectedCell({ ...selectedCell, row: selectedCell.row + 1 });
    }
  }

  function removeField(rowIdx: number, colIdx: number) {
    setCanvasRows(prev => {
      const rows = [...prev];
      const row = { ...rows[rowIdx], cols: [...rows[rowIdx].cols] };
      if (row.cols.length === 1) {
        // Remove the whole row
        rows.splice(rowIdx, 1);
      } else {
        row.cols.splice(colIdx, 1);
        rows[rowIdx] = row;
      }
      return rows;
    });
    if (selectedCell?.row === rowIdx && selectedCell?.col === colIdx) setSelectedCell(null);
  }

  /** Add a field from the palette into a specific row/col slot. */
  function dropOnCell(targetRow: number, targetCol: number, fieldName: string) {
    if (!fieldName || placedFields.has(fieldName)) return;
    const base = fieldMap.get(fieldName);
    if (!base) return;

    setCanvasRows(prev => {
      const rows = [...prev];
      const row = { ...rows[targetRow], cols: [...rows[targetRow].cols] };
      const newCF: CanvasField = { field_name: fieldName, label_override: "", hint_override: "", hidden: false };
      if (targetCol >= row.cols.length) {
        row.cols = [...row.cols, newCF];
      } else {
        row.cols[targetCol] = newCF;
      }
      rows[targetRow] = row;
      return rows;
    });
  }

  /** Add a field from palette as a new row at the bottom (or at a specific position). */
  function dropAsNewRow(fieldName: string, afterRowIdx?: number) {
    if (!fieldName || placedFields.has(fieldName)) return;
    const newRow: CanvasRow = {
      id: uid(),
      cols: [{ field_name: fieldName, label_override: "", hint_override: "", hidden: false }],
    };
    setCanvasRows(prev => {
      const rows = [...prev];
      if (afterRowIdx != null) {
        rows.splice(afterRowIdx + 1, 0, newRow);
      } else {
        rows.push(newRow);
      }
      return rows;
    });
  }

  /** Swap two canvas cells (both already placed). */
  function swapCells(srcRow: number, srcCol: number, dstRow: number, dstCol: number) {
    if (srcRow === dstRow && srcCol === dstCol) return;
    setCanvasRows(prev => {
      const rows = prev.map(r => ({ ...r, cols: [...r.cols] }));
      const srcCF = rows[srcRow]?.cols[srcCol];
      const dstCF = rows[dstRow]?.cols[dstCol];
      if (!srcCF) return prev;
      if (dstCF) {
        // Swap
        rows[srcRow].cols[srcCol] = dstCF;
        rows[dstRow].cols[dstCol] = srcCF;
      } else {
        // Move to empty col slot (second column of a single-col row)
        rows[dstRow].cols[dstCol] = srcCF;
        // Remove from source
        if (rows[srcRow].cols.length === 1) {
          rows.splice(srcRow, 1);
        } else {
          rows[srcRow].cols.splice(srcCol, 1);
        }
      }
      return rows;
    });
    setSelectedCell({ row: dstRow, col: dstCol });
  }

  /** Handler for drops on a row/col cell — distinguishes palette vs canvas drag. */
  function handleDropOnCell(
    targetRow: number, targetCol: number,
    fieldName: string, src: "palette" | "canvas",
    srcRow?: number, srcCol?: number
  ) {
    if (src === "palette") dropOnCell(targetRow, targetCol, fieldName);
    else if (srcRow != null && srcCol != null) swapCells(srcRow, srcCol, targetRow, targetCol);
  }

  /** Handler for drops between column slots (vertical divider). */
  function handleDropBetweenCols(
    targetRow: number, fieldName: string, src: "palette" | "canvas",
    srcRow?: number, srcCol?: number
  ) {
    if (src === "palette") dropOnCell(targetRow, 1, fieldName);
    else if (srcRow != null && srcCol != null) swapCells(srcRow, srcCol, targetRow, 1);
  }

  function updateOverride(patch: Partial<CanvasField>) {
    if (!selectedCell) return;
    const { row: r, col: c } = selectedCell;
    setCanvasRows(prev =>
      prev.map((row, ri) =>
        ri !== r ? row : {
          ...row,
          cols: row.cols.map((cf, ci) => ci !== c ? cf : { ...cf, ...patch }),
        }
      )
    );
  }

  // ── Save ───────────────────────────────────────────────────────────────────

  async function handleSave() {
    setSaved(false);
    // Flatten canvas into field_overrides with sort_order = rowIdx * 10 + colIdx
    const overrides = canvasRows.flatMap((row, ri) =>
      row.cols.map((cf, ci) => ({
        field_name: cf.field_name,
        sort_order: ri * 10 + ci,
        label_override: cf.label_override,
        hint_override: cf.hint_override,
        hidden: cf.hidden,
      }))
    );
    try {
      await djangoFetch("/form-layouts/", {
        method: "POST",
        body: {
          form_name: processName,
          profile: import.meta.env.VITE_PROFILE ?? "plain",
          collection: null,
          label: `${processName} layout`,
          sections: [{
            key: "main",
            label: processName,
            sort_order: 0,
            collapsed_by_default: false,
            helper_text_above: "",
            helper_text_below: "",
            field_overrides: overrides,
          }],
          conditional_blocks: [],
        },
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error("Save failed:", err);
    }
  }

  // ── Between-row drop zone ──────────────────────────────────────────────────

  function BetweenRowZone({ afterIdx }: { afterIdx: number }) {
    const [over, setOver] = useState(false);
    return (
      <div
        onDragOver={(e) => { e.preventDefault(); setOver(true); }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault(); setOver(false);
          const raw = e.dataTransfer.getData("text/plain");
          if (raw.startsWith("palette:")) dropAsNewRow(raw.slice(8), afterIdx);
          else if (raw.startsWith("row:")) {
            const fromRow = parseInt(raw.slice(4));
            const toRow = fromRow <= afterIdx ? afterIdx : afterIdx + 1;
            if (fromRow !== toRow) moveRow(fromRow, toRow);
          }
        }}
        style={{
          height: over ? 26 : 5,
          margin: "2px 24px 2px 24px",
          borderRadius: 5,
          background: over ? "#ede9fe" : "transparent",
          border: over ? "2px dashed #7c3aed" : "2px dashed transparent",
          transition: "all 0.12s",
          display:"flex", alignItems:"center", justifyContent:"center",
        }}
      >
        {over && <span style={{ fontSize:10, color:"#7c3aed", fontWeight:600 }}>Insert row here</span>}
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div style={{
      display:"flex", flexDirection:"column", height:"100vh",
      fontFamily:"'IBM Plex Sans', system-ui, sans-serif",
      background:"#f8fafc", color:"#111827",
    }}>

      {/* ── Top bar ── */}
      <div style={{
        height:50, background:"#fff", borderBottom:"1px solid #e5e7eb",
        display:"flex", alignItems:"center", padding:"0 16px", gap:10,
        flexShrink:0,
      }}>
        <span style={{ fontWeight:700, fontSize:14 }}>Form Builder</span>
        <span style={{ color:"#d1d5db" }}>·</span>
        <select
          value={selectedFormId ?? ""}
          onChange={e => setSelectedFormId(Number(e.target.value))}
          style={{ fontSize:12, padding:"3px 8px", borderRadius:5, border:"1px solid #d1d5db" }}
        >
          {formsLoading
            ? <option>Loading…</option>
            : availableForms.length === 0
              ? <option value="">No forms imported</option>
              : availableForms.map(f => <option key={f.id} value={f.id}>{f.name}</option>)
          }
        </select>
        <span style={{ fontSize:11, color:"#9ca3af", fontFamily:"monospace" }}>{processName}</span>
        <div style={{ flex:1 }} />
        <span style={{ fontSize:11, color:"#9ca3af" }}>
          {canvasRows.length} rows · {placedFields.size} fields
        </span>
        <button
          onClick={handleSave}
          style={{
            padding:"5px 14px", borderRadius:6,
            background: saved ? "#d1fae5" : "#7c3aed",
            color: saved ? "#065f46" : "#fff",
            border:"none", fontSize:12, fontWeight:600, cursor:"pointer",
          }}
        >
          {saved ? "✓ Saved" : "Save Layout"}
        </button>
      </div>

      {/* ── Main 3-panel layout ── */}
      <div style={{ display:"flex", flex:1, overflow:"hidden" }}>

        {/* ── LEFT: Palette ── */}
        <div style={{
          width:220, borderRight:"1px solid #e5e7eb",
          background:"#fff", display:"flex", flexDirection:"column", flexShrink:0,
        }}>
          <div style={{ padding:"10px 10px 6px" }}>
            <div style={{ fontSize:10, fontWeight:700, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:5 }}>
              Fields ({baseFields.length})
            </div>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search fields…"
              style={{ width:"100%", padding:"4px 8px", borderRadius:5, border:"1px solid #e5e7eb", fontSize:11, outline:"none", boxSizing:"border-box" }}
            />
          </div>
          <div style={{ flex:1, overflowY:"auto", padding:"4px 8px" }}>
            {/* Group by DSpace row */}
            {Object.entries(
              filteredPalette.reduce((acc, f) => {
                const key = String(f.row);
                if (!acc[key]) acc[key] = [];
                acc[key].push(f);
                return acc;
              }, {} as Record<string, BaseField[]>)
            ).map(([rowKey, fields]) => (
              <div key={rowKey} style={{ marginBottom:6 }}>
                {/* Row indicator */}
                <div style={{ display:"flex", alignItems:"center", gap:4, marginBottom:3 }}>
                  <div style={{ flex:1, height:1, background:"#f1f5f9" }} />
                  <span style={{ fontSize:9, color:"#cbd5e1", fontFamily:"monospace" }}>row {rowKey}</span>
                  <div style={{ flex:1, height:1, background:"#f1f5f9" }} />
                </div>
                {/* Fields in this row */}
                <div style={{ display:"flex", gap:2, flexWrap:"wrap" }}>
                  {fields.map(f => {
                    const isPlaced = placedFields.has(f.field);
                    return (
                      <div
                        key={f.field}
                        draggable={!isPlaced}
                        onDragStart={e => e.dataTransfer.setData("text/plain", `palette:${f.field}`)}
                        style={{ width:"100%", opacity: isPlaced ? 0.4 : 1, cursor: isPlaced ? "default" : "grab", marginBottom:2 }}
                        title={isPlaced ? "Already placed" : `Drag to canvas\nRow ${f.row}, Col ${f.col}\nType: ${f.input_type}`}
                      >
                        <FieldChip base={f} compact />
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            {filteredPalette.length === 0 && (
              <div style={{ color:"#d1d5db", fontSize:11, textAlign:"center", paddingTop:16 }}>No fields</div>
            )}
          </div>

          {/* Legend */}
          <div style={{ padding:"6px 10px", borderTop:"1px solid #f1f5f9", fontSize:9, color:"#9ca3af" }}>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              {[["#fde68a","Required"],["#e9d5ff","Group"],["#bfdbfe","Authority"],["#d9f99d","Pairs"],["#fed7aa","Multiple"]].map(([c,l])=>(
                <span key={l} style={{ display:"flex", alignItems:"center", gap:2 }}>
                  <span style={{ width:7, height:7, borderRadius:2, background:c, display:"inline-block" }} />{l}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── CENTRE: Canvas ── */}
        <div style={{ flex:1, overflowY:"auto", padding:"12px 16px" }}>
          <div style={{ maxWidth:620, margin:"0 auto" }}>

            {/* Header */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
              <span style={{ fontSize:12, fontWeight:600, color:"#374151" }}>Layout Canvas</span>
              <span style={{ fontSize:11, color:"#9ca3af" }}>
                Drag fields from the palette · ↑↓ buttons to reorder · drag rows to rearrange
              </span>
            </div>

            {/* Initial drop zone (above first row) */}
            <BetweenRowZone afterIdx={-1} />

            {canvasRows.length === 0 && (
              <EmptyCanvas />
            )}

            {canvasRows.map((row, rowIdx) => (
              <React.Fragment key={row.id}>
                <CanvasRowCard
                  rowIdx={rowIdx}
                  row={row}
                  fieldMap={fieldMap}
                  selectedField={selectedCell}
                  onSelectField={(r, c) => setSelectedCell({ row: r, col: c })}
                  onMoveRow={moveRow}
                  canMoveUp={rowIdx > 0}
                  canMoveDown={rowIdx < canvasRows.length - 1}
                  onDropOnRow={handleDropOnCell}
                  onDropBetweenCols={handleDropBetweenCols}
                  onRemoveField={removeField}
                  totalRows={canvasRows.length}
                />
                <BetweenRowZone afterIdx={rowIdx} />
              </React.Fragment>
            ))}

            {/* Append-to-end drop zone */}
            <AppendDropZone onDrop={(fn, src, sr, sc) => {
              if (src === "palette") dropAsNewRow(fn);
              else if (sr != null && sc != null) moveRow(sr, canvasRows.length - 1);
            }} />
          </div>
        </div>

        {/* ── RIGHT: Inspector ── */}
        <div style={{
          width:248, borderLeft:"1px solid #e5e7eb",
          background:"#fff", overflowY:"auto", flexShrink:0,
        }}>
          {selectedCell && selectedCF && selectedBase ? (
            <FieldInspector
              base={selectedBase}
              cf={selectedCF}
              rowIdx={selectedCell.row}
              colIdx={selectedCell.col}
              totalCols={canvasRows[selectedCell.row]?.cols.length ?? 1}
              onUpdate={updateOverride}
              onRemove={() => removeField(selectedCell.row, selectedCell.col)}
              onMoveUp={() => selectedCell.row > 0 && moveRow(selectedCell.row, selectedCell.row - 1)}
              onMoveDown={() => selectedCell.row < canvasRows.length - 1 && moveRow(selectedCell.row, selectedCell.row + 1)}
              canMoveUp={selectedCell.row > 0}
              canMoveDown={selectedCell.row < canvasRows.length - 1}
            />
          ) : (
            <div style={{ padding:20, color:"#9ca3af", fontSize:12, textAlign:"center", marginTop:32 }}>
              <div style={{ fontSize:28, marginBottom:8 }}>←</div>
              Click a field in the canvas to edit its properties, or drag fields from the palette.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Empty canvas prompt
// ---------------------------------------------------------------------------

function EmptyCanvas() {
  return (
    <div style={{
      border:"2px dashed #e2e8f0", borderRadius:10,
      padding:"40px 20px", textAlign:"center", color:"#94a3b8",
    }}>
      <div style={{ fontSize:32, marginBottom:8 }}>⊞</div>
      <div style={{ fontSize:13, fontWeight:600, marginBottom:4 }}>Canvas is empty</div>
      <div style={{ fontSize:12 }}>Drag fields from the palette on the left, or they will load from the selected form.</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Append drop zone (bottom of canvas)
// ---------------------------------------------------------------------------

function AppendDropZone({ onDrop }: {
  onDrop: (fn: string, src: "palette" | "canvas", sr?: number, sc?: number) => void;
}) {
  const [over, setOver] = useState(false);
  return (
    <div
      onDragOver={e => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={e => {
        e.preventDefault(); setOver(false);
        const raw = e.dataTransfer.getData("text/plain");
        if (raw.startsWith("palette:")) onDrop(raw.slice(8), "palette");
        else if (raw.startsWith("row:")) {
          const fr = parseInt(raw.slice(4));
          onDrop("", "canvas", fr, 0);
        }
      }}
      style={{
        marginTop:4, height: over ? 48 : 32,
        border: over ? "2px dashed #7c3aed" : "2px dashed #e2e8f0",
        borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center",
        color: over ? "#7c3aed" : "#d1d5db", fontSize:12, fontWeight:600,
        background: over ? "#faf5ff" : "transparent",
        transition:"all 0.12s", cursor:"default",
      }}
    >
      {over ? "Add as new row" : "+ Drop field here to add a new row"}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Field inspector panel
// ---------------------------------------------------------------------------

function FieldInspector({
  base, cf, rowIdx, colIdx, totalCols,
  onUpdate, onRemove, onMoveUp, onMoveDown, canMoveUp, canMoveDown,
}: {
  base: BaseField;
  cf: CanvasField;
  rowIdx: number;
  colIdx: number;
  totalCols: number;
  onUpdate: (patch: Partial<CanvasField>) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}) {
  const isGroup = base.input_type === "group" || base.input_type === "inline-group";

  return (
    <div>
      {/* Header */}
      <div style={{ padding:"10px 12px", borderBottom:"1px solid #f1f5f9", background:"#faf5ff" }}>
        <div style={{ fontSize:10, fontWeight:700, color:"#7c3aed", textTransform:"uppercase", letterSpacing:"0.07em" }}>Field</div>
        <div style={{ fontSize:11, fontFamily:"monospace", color:"#374151", marginTop:2, wordBreak:"break-all" }}>{base.field}</div>
        <div style={{ fontSize:10, color:"#9ca3af", marginTop:2 }}>
          Row {rowIdx} · Col {colIdx} · {base.input_type}
        </div>
      </div>

      <div style={{ padding:"10px 12px" }}>
        {/* Row move buttons */}
        <div style={{ display:"flex", gap:4, marginBottom:10 }}>
          <button
            onClick={onMoveUp} disabled={!canMoveUp}
            style={{ flex:1, padding:"4px 0", borderRadius:5, border:"1px solid #e5e7eb", background: canMoveUp ? "#f8fafc" : "#f9fafb", cursor: canMoveUp ? "pointer" : "default", fontSize:12, color: canMoveUp ? "#374151" : "#d1d5db" }}
          >↑ Row up</button>
          <button
            onClick={onMoveDown} disabled={!canMoveDown}
            style={{ flex:1, padding:"4px 0", borderRadius:5, border:"1px solid #e5e7eb", background: canMoveDown ? "#f8fafc" : "#f9fafb", cursor: canMoveDown ? "pointer" : "default", fontSize:12, color: canMoveDown ? "#374151" : "#d1d5db" }}
          >↓ Row down</button>
        </div>

        {/* Overrides */}
        <Lbl>Label override</Lbl>
        <input
          value={cf.label_override}
          onChange={e => onUpdate({ label_override: e.target.value })}
          placeholder={base.label || base.field}
          style={iStyle}
        />

        <Lbl>Hint override</Lbl>
        <textarea
          value={cf.hint_override}
          onChange={e => onUpdate({ hint_override: e.target.value })}
          placeholder={base.hint || "No hint"}
          rows={3}
          style={{ ...iStyle, resize:"vertical" as const }}
        />

        <label style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", marginTop:4 }}>
          <input
            type="checkbox"
            checked={cf.hidden}
            onChange={e => onUpdate({ hidden: e.target.checked })}
          />
          <span style={{ fontSize:12, color:"#374151" }}>
            Visually hidden
            <span style={{ display:"block", fontSize:10, color:"#9ca3af" }}>Field still submits to DSpace</span>
          </span>
        </label>

        {/* Read-only info */}
        <div style={{ marginTop:12, padding:"8px 10px", background:"#f8fafc", borderRadius:6, fontSize:11 }}>
          <InfoRow label="Type" value={base.input_type} />
          <InfoRow label="Required" value={base.is_required ? "Yes" : "No"} />
          {base.repeatable && <InfoRow label="Repeatable" value="Yes" />}
          {base.vocabulary && <InfoRow label="Vocabulary" value={base.vocabulary} />}
          {base.value_pairs_name && <InfoRow label="Pairs" value={base.value_pairs_name} />}
          {isGroup && base.child_form_name_resolved && (
            <InfoRow label="Child form" value={base.child_form_name_resolved} />
          )}
          {base.type_binds && base.type_binds.length > 0 && (
            <InfoRow label="Type binds" value={base.type_binds.join(", ")} />
          )}
          {base.language_codes && base.language_codes.length > 0 && (
            <InfoRow label="Languages" value={base.language_codes.join(", ")} />
          )}
        </div>

        {/* Remove */}
        <button
          onClick={onRemove}
          style={{
            marginTop:10, width:"100%", padding:"5px 0",
            borderRadius:5, border:"1px solid #fecaca",
            background:"#fff", color:"#dc2626", fontSize:11, cursor:"pointer",
          }}
        >
          Remove from canvas
        </button>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
      <span style={{ color:"#9ca3af" }}>{label}</span>
      <span style={{ color:"#374151", fontFamily:"monospace", maxWidth:"60%", textAlign:"right", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{value}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helper: build initial canvas from baseFields row/col structure
// ---------------------------------------------------------------------------

function buildInitialCanvas(fields: BaseField[]): CanvasRow[] {
  // Group by row, then sort cols within each row
  const byRow = new Map<number, BaseField[]>();
  for (const f of fields) {
    if (!byRow.has(f.row)) byRow.set(f.row, []);
    byRow.get(f.row)!.push(f);
  }

  const sortedRows = Array.from(byRow.entries())
    .sort(([a], [b]) => a - b);

  return sortedRows.map(([, rowFields]) => {
    const sorted = [...rowFields].sort((a, b) => a.col - b.col);
    return {
      id: uid(),
      cols: sorted.map(f => ({
        field_name: f.field,
        label_override: "",
        hint_override: "",
        hidden: false,
      })),
    };
  });
}
