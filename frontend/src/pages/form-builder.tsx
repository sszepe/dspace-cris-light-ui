/**
 * src/pages/form-builder.tsx
 *
 * Form Builder — two-tab admin page.
 *
 * Tab 1 — Submission Forms
 *   List → click row → FormEditor (3-panel drag-and-drop)
 *   Left palette: "Form fields" (from the form's own fields, grouped by row)
 *                 OR "All metadata" (from /metadata-fields/ API, searchable)
 *   Centre: Canvas rows, 1–2 columns, drag/drop/reorder
 *   Right:  Field inspector — label/hint overrides, hidden flag
 *
 * Tab 2 — Submission Processes
 *   List → click row → ProcessEditor
 *   Upload allowed toggle + collapsible per form-type step with:
 *     - helper text above/below
 *     - read-only field preview (shows the form's rows/cols)
 */

import React, { useEffect, useMemo, useRef, useState } from "react";
import { djangoFetch } from "../api/django-client";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type BaseField = {
  id: number; row: number; col: number;
  field: string; label: string; input_type: string;
  is_required: boolean; required_msg?: string; repeatable?: boolean;
  vocabulary: string; vocabulary_closed?: boolean;
  value_pairs_name: string; hint: string;
  style?: string; regex?: string; language_codes?: string[]; type_binds?: string[];
  child_form_name?: string; child_form?: number | null; child_form_name_resolved?: string | null;
};

type MetaField = {
  id: number; field: string; element: string; qualifier: string;
  schema_name: string; scope_note: string;
};

type CanvasRow  = { id: string; cols: CanvasCell[] };
type CanvasCell = { field_name: string; label_override: string; hint_override: string; hidden: boolean };

type FormListItem    = { id: number; name: string; field_count: number; contains_required: boolean; imported_at: string };
type ProcessListItem = { id: number; name: string; step_count: number; imported_at: string };
type ProcessStep     = { id: number; sort_order: number; step_id: string; type: string | null; mandatory: boolean; heading: string; processing_class: string };
type ProcessDetail   = { id: number; name: string; step_count: number; steps: ProcessStep[]; imported_at: string };

// ─────────────────────────────────────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────────────────────────────────────

function uid() { return Math.random().toString(36).slice(2, 9); }

const INPUT_ICONS: Record<string, string> = {
  onebox:"T", textarea:"¶", dropdown:"▾", date:"📅",
  name:"👤", tag:"#", group:"⊞", "inline-group":"⊟",
  qualdrop_value:":", series:"≡", link:"🔗", lookup:"🔍", list:"≣",
};
const inputIcon = (t: string) => INPUT_ICONS[t] ?? "?";

function badgeColor(f: BaseField): string {
  if (f.is_required) return "#fde68a";
  if (f.input_type === "group" || f.input_type === "inline-group") return "#e9d5ff";
  if (f.vocabulary) return "#bfdbfe";
  if (f.value_pairs_name) return "#d9f99d";
  if (f.repeatable) return "#fed7aa";
  return "#f1f5f9";
}

function buildCanvas(fields: BaseField[]): CanvasRow[] {
  const byRow = new Map<number, BaseField[]>();
  for (const f of fields) { if (!byRow.has(f.row)) byRow.set(f.row, []); byRow.get(f.row)!.push(f); }
  return Array.from(byRow.entries()).sort(([a],[b]) => a-b).map(([,rf]) => ({
    id: uid(),
    cols: [...rf].sort((a,b) => a.col-b.col).map(f => ({ field_name:f.field, label_override:"", hint_override:"", hidden:false })),
  }));
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared atoms
// ─────────────────────────────────────────────────────────────────────────────

const iSt: React.CSSProperties = { width:"100%", padding:"5px 8px", borderRadius:5, border:"1px solid #e5e7eb", fontSize:12, outline:"none", boxSizing:"border-box", marginBottom:6 };

function Lbl({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize:10, fontWeight:700, color:"#9ca3af", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:2, marginTop:8 }}>{children}</div>;
}

function InfoRow({ label, value }: { label:string; value:string }) {
  return <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
    <span style={{ color:"#9ca3af" }}>{label}</span>
    <span style={{ color:"#374151", fontFamily:"monospace", maxWidth:"60%", textAlign:"right", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{value}</span>
  </div>;
}

function EmptyState({ icon,title,body }: { icon:string; title:string; body:string }) {
  return <div style={{ padding:60, textAlign:"center", color:"#9ca3af" }}>
    <div style={{ fontSize:36, marginBottom:10 }}>{icon}</div>
    <div style={{ fontSize:14, fontWeight:600, color:"#6b7280", marginBottom:4 }}>{title}</div>
    <div style={{ fontSize:12 }}>{body}</div>
  </div>;
}

function TabBtn({ label,active,onClick }: { label:string; active:boolean; onClick:() => void }) {
  return <button onClick={onClick} style={{ padding:"7px 18px", fontSize:13, fontWeight:active?600:400, color:active?"#7c3aed":"#6b7280", background:"none", border:"none", borderBottom:active?"2px solid #7c3aed":"2px solid transparent", cursor:"pointer", marginBottom:-1, outline:"none" }}>{label}</button>;
}

// ─────────────────────────────────────────────────────────────────────────────
// FieldChip
// ─────────────────────────────────────────────────────────────────────────────

function FieldChip({ base,override,selected,placed,onDragStart,onClick,compact }: {
  base:BaseField; override?:CanvasCell; selected?:boolean; placed?:boolean;
  onDragStart?:(e:React.DragEvent) => void; onClick?:() => void; compact?:boolean;
}) {
  const label = override?.label_override || base.label || base.field;
  const hidden = override?.hidden ?? false;
  const isGroup = base.input_type==="group" || base.input_type==="inline-group";
  return (
    <div draggable={!!onDragStart} onDragStart={onDragStart} onClick={onClick}
      title={`${base.field}\nType: ${base.input_type}${base.hint?"\n"+base.hint:""}`}
      style={{ display:"flex", alignItems:"center", gap:5, padding:compact?"4px 8px":"6px 10px", borderRadius:6,
        background:selected?"#ede9fe":"#fff", border:`1.5px solid ${selected?"#7c3aed":isGroup?"#c4b5fd":"#e5e7eb"}`,
        cursor:onDragStart?"grab":onClick?"pointer":"default", opacity:hidden?0.5:(placed&&!onDragStart)?0.4:1,
        fontSize:11, fontFamily:"monospace", userSelect:"none",
        boxShadow:selected?"0 0 0 2px #ede9fe":"none", minWidth:0, overflow:"hidden" }}>
      <span style={{ width:17, height:17, borderRadius:3, background:badgeColor(base), display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:700, flexShrink:0 }}>
        {inputIcon(base.input_type)}
      </span>
      <span style={{ flex:1, minWidth:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", color:"#374151" }}>{label}</span>
      <span style={{ color:"#9ca3af", fontSize:9, flexShrink:0, maxWidth:80, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
        {base.field.split(".").slice(-1)[0]}
      </span>
      {base.is_required && <span style={{ color:"#b45309", fontWeight:800, fontSize:10, flexShrink:0 }}>*</span>}
      {hidden && <span style={{ color:"#cbd5e1", fontSize:9, flexShrink:0 }}>⊘</span>}
      {base.repeatable && <span style={{ color:"#fb923c", fontSize:9, flexShrink:0 }}>+</span>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DropZone
// ─────────────────────────────────────────────────────────────────────────────

function DropZone({ onDrop, vertical }: {
  onDrop:(fn:string, src:"palette"|"meta"|"canvas", sr?:number, sc?:number) => void;
  vertical?:boolean;
}) {
  const [over, setOver] = useState(false);
  return (
    <div onDragOver={e => { e.preventDefault(); e.stopPropagation(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={e => {
        e.preventDefault(); e.stopPropagation(); setOver(false);
        const r = e.dataTransfer.getData("text/plain");
        if (r.startsWith("palette:")) onDrop(r.slice(8), "palette");
        else if (r.startsWith("meta:")) onDrop(r.slice(5), "meta");
        else if (r.startsWith("canvas:")) { const [,rs,cs]=r.split(":"); onDrop("","canvas",parseInt(rs),parseInt(cs)); }
      }}
      style={{ transition:"all 0.12s", ...(vertical
        ? { width:over?32:8, minHeight:40, background:over?"#ede9fe":"transparent", border:over?"2px dashed #7c3aed":"2px dashed transparent", borderRadius:6, flexShrink:0, alignSelf:"stretch" }
        : { height:over?28:5, margin:"1px 0", background:over?"#ede9fe":"transparent", border:over?"2px dashed #7c3aed":"2px dashed transparent", borderRadius:6 }) }}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CanvasRowCard
// ─────────────────────────────────────────────────────────────────────────────

function CanvasRowCard({ rowIdx,row,fieldMap,sel,onSelect,onMove,canUp,canDown,onDropCell,onDropBetween,onRemove,onAddCol,childFormMap }: {
  rowIdx:number; row:CanvasRow; fieldMap:Map<string,BaseField>;
  sel:{ row:number; col:number }|null; onSelect:(r:number,c:number) => void;
  onMove:(f:number,t:number) => void; canUp:boolean; canDown:boolean;
  onDropCell:(tr:number,tc:number,fn:string,src:"palette"|"meta"|"canvas",sr?:number,sc?:number) => void;
  onDropBetween:(tr:number,fn:string,src:"palette"|"meta"|"canvas",sr?:number,sc?:number) => void;
  onRemove:(r:number,c:number) => void;
  onAddCol:(ri:number) => void;
  childFormMap:Map<string,BaseField[]>;
}) {
  const [rOver, setROver] = useState(false);
  return (
    <div style={{ display:"flex", alignItems:"stretch", gap:4, marginBottom:2 }}>
      {/* Handle */}
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:1, width:20, flexShrink:0 }}>
        <div draggable onDragStart={e => { e.dataTransfer.setData("text/plain",`row:${rowIdx}`); e.dataTransfer.effectAllowed="move"; }}
          style={{ cursor:"grab", color:"#d1d5db", fontSize:12, userSelect:"none", lineHeight:1 }}>⠿</div>
        <button onClick={() => canUp && onMove(rowIdx,rowIdx-1)} disabled={!canUp}
          style={{ background:"none", border:"none", cursor:canUp?"pointer":"default", color:canUp?"#94a3b8":"#e2e8f0", fontSize:10, padding:"1px", lineHeight:1 }}>▲</button>
        <button onClick={() => canDown && onMove(rowIdx,rowIdx+1)} disabled={!canDown}
          style={{ background:"none", border:"none", cursor:canDown?"pointer":"default", color:canDown?"#94a3b8":"#e2e8f0", fontSize:10, padding:"1px", lineHeight:1 }}>▼</button>
      </div>
      {/* Body */}
      <div onDragOver={e => { e.preventDefault(); setROver(true); }} onDragLeave={() => setROver(false)}
        onDrop={e => {
          e.preventDefault(); setROver(false);
          const r = e.dataTransfer.getData("text/plain");
          if (r.startsWith("row:")) { const fr=parseInt(r.slice(4)); if(fr!==rowIdx) onMove(fr,rowIdx); }
        }}
        style={{ flex:1, display:"flex", alignItems:"stretch", border:`1.5px solid ${rOver?"#7c3aed":"#e5e7eb"}`, borderRadius:7, background:"#fff", overflow:"hidden", minHeight:44, transition:"border-color 0.12s" }}>
        {row.cols.map((cf,ci) => {
          const base = fieldMap.get(cf.field_name);
          const isSelected = sel?.row===rowIdx && sel?.col===ci;
          return (
            <React.Fragment key={ci}>
              {ci > 0 && <DropZone vertical onDrop={(fn,src,sr,sc) => onDropBetween(rowIdx,fn||cf.field_name,src,sr,sc)} />}
              <div draggable onDragStart={e => { e.dataTransfer.setData("text/plain",`canvas:${rowIdx}:${ci}`); e.dataTransfer.effectAllowed="move"; }}
                onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
                onDrop={e => {
                  e.preventDefault(); e.stopPropagation();
                  const r = e.dataTransfer.getData("text/plain");
                  if (r.startsWith("palette:")) onDropCell(rowIdx,ci,r.slice(8),"palette");
                  else if (r.startsWith("meta:")) onDropCell(rowIdx,ci,r.slice(5),"meta");
                  else if (r.startsWith("canvas:")) { const [,rs,cs]=r.split(":"); onDropCell(rowIdx,ci,"","canvas",parseInt(rs),parseInt(cs)); }
                }}
                onClick={() => onSelect(rowIdx,ci)}
                style={{ flex:1, padding:"6px 8px", cursor:"pointer", minWidth:0, background:isSelected?"#faf5ff":ci%2===1?"#fafafa":"#fff", borderLeft:ci>0?"1px solid #f1f5f9":"none", transition:"background 0.1s" }}>
                {base
                  ? <FieldChip base={base} override={cf} selected={isSelected} compact />
                  : <span style={{ fontSize:10, color:"#fca5a5", fontFamily:"monospace" }}>⚠ {cf.field_name}</span>}
              </div>
            </React.Fragment>
          );
        })}
        {row.cols.length === 1 && (
          <>
            <DropZone vertical onDrop={(fn,src,sr,sc) => { if(fn) onDropCell(rowIdx,1,fn,src); else onDropCell(rowIdx,1,"",src,sr,sc); }} />
            <div
              onClick={() => onAddCol(rowIdx)}
              style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", color:"#c4b5fd", fontSize:11, padding:"6px", borderLeft:"1px solid #f1f5f9", minWidth:48, cursor:"pointer", userSelect:"none", fontWeight:600 }}
              title="Click to add a second column (you can also drag a field here)"
            >+ col</div>
          </>
        )}
      </div>
      {/* Remove */}
      <div style={{ display:"flex", flexDirection:"column", justifyContent:"center", gap:2, width:20, flexShrink:0 }}>
        {row.cols.map((_,ci) => (
          <button key={ci} onClick={() => onRemove(rowIdx,ci)}
            style={{ background:"none", border:"none", cursor:"pointer", color:"#fca5a5", fontSize:13, padding:"0 2px", lineHeight:1, fontWeight:600 }}>×</button>
        ))}
      </div>
    </div>
  );
}

// ── Child form sub-rows (group / inline-group fields expand their child form) ─
function ChildFormRows({ cols, fieldMap, childFormMap }: {
  cols: CanvasCell[]; fieldMap: Map<string,BaseField>; childFormMap: Map<string,BaseField[]>;
}) {
  const childEntries: Array<{ parentField:string; parentLabel:string; childFields:BaseField[] }> = [];
  for (const cf of cols) {
    const base = fieldMap.get(cf.field_name);
    if (!base) continue;
    const isGroup = base.input_type==="group" || base.input_type==="inline-group";
    if (!isGroup) continue;
    const childName = base.child_form_name_resolved || base.child_form_name || "";
    if (!childName) continue;
    const childFields = childFormMap.get(childName);
    if (!childFields || childFields.length === 0) continue;
    childEntries.push({ parentField:base.field, parentLabel:cf.label_override||base.label||base.field, childFields });
  }
  if (childEntries.length === 0) return null;
  return (
    <>
      {childEntries.map(({ parentField, parentLabel, childFields }) => (
        <div key={parentField} style={{ marginLeft:44, marginBottom:2, borderLeft:"2px solid #e9d5ff", paddingLeft:10 }}>
          <div style={{ fontSize:9, color:"#a78bfa", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:3 }}>
            {parentLabel} — child form
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
            {buildCanvas(childFields).map((row, ri) => (
              <div key={ri} style={{ display:"flex", gap:4 }}>
                {row.cols.map((ccf, ci) => {
                  const cb = childFields.find(f => f.field===ccf.field_name);
                  if (!cb) return null;
                  return <div key={ci} style={{ flex:1, opacity:0.75 }}><FieldChip base={cb} compact /></div>;
                })}
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AppendDrop
// ─────────────────────────────────────────────────────────────────────────────

function AppendDrop({ onDrop }: { onDrop:(fn:string,src:"palette"|"meta"|"canvas",sr?:number,sc?:number) => void }) {
  const [over,setOver] = useState(false);
  return (
    <div onDragOver={e => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)}
      onDrop={e => {
        e.preventDefault(); setOver(false);
        const r=e.dataTransfer.getData("text/plain");
        if(r.startsWith("palette:")) onDrop(r.slice(8),"palette");
        else if(r.startsWith("meta:")) onDrop(r.slice(5),"meta");
        else if(r.startsWith("row:")) { const fr=parseInt(r.slice(4)); onDrop("","canvas",fr,0); }
      }}
      style={{ marginTop:4, height:over?48:32, border:over?"2px dashed #7c3aed":"2px dashed #e2e8f0", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", color:over?"#7c3aed":"#d1d5db", fontSize:12, fontWeight:600, background:over?"#faf5ff":"transparent", transition:"all 0.12s" }}>
      {over?"Add as new row":"+ Drop field here to add a new row"}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FieldInspector
// ─────────────────────────────────────────────────────────────────────────────

function FieldInspector({ base,cf,rowIdx,colIdx,onUpdate,onRemove,onMoveUp,onMoveDown,canUp,canDown }: {
  base:BaseField; cf:CanvasCell; rowIdx:number; colIdx:number;
  onUpdate:(p:Partial<CanvasCell>) => void; onRemove:() => void;
  onMoveUp:() => void; onMoveDown:() => void; canUp:boolean; canDown:boolean;
}) {
  const isGroup = base.input_type==="group"||base.input_type==="inline-group";
  return (
    <div>
      <div style={{ padding:"10px 12px", borderBottom:"1px solid #f1f5f9", background:"#faf5ff" }}>
        <div style={{ fontSize:10, fontWeight:700, color:"#7c3aed", textTransform:"uppercase", letterSpacing:"0.07em" }}>Field</div>
        <div style={{ fontSize:11, fontFamily:"monospace", color:"#374151", marginTop:2, wordBreak:"break-all" }}>{base.field}</div>
        <div style={{ fontSize:10, color:"#9ca3af", marginTop:2 }}>Row {rowIdx} · Col {colIdx} · {base.input_type}</div>
      </div>
      <div style={{ padding:"10px 12px" }}>
        <div style={{ display:"flex", gap:4, marginBottom:10 }}>
          <button onClick={onMoveUp} disabled={!canUp} style={{ flex:1, padding:"4px 0", borderRadius:5, border:"1px solid #e5e7eb", background:canUp?"#f8fafc":"#f9fafb", cursor:canUp?"pointer":"default", fontSize:12, color:canUp?"#374151":"#d1d5db" }}>↑ Up</button>
          <button onClick={onMoveDown} disabled={!canDown} style={{ flex:1, padding:"4px 0", borderRadius:5, border:"1px solid #e5e7eb", background:canDown?"#f8fafc":"#f9fafb", cursor:canDown?"pointer":"default", fontSize:12, color:canDown?"#374151":"#d1d5db" }}>↓ Down</button>
        </div>
        <Lbl>Label override</Lbl>
        <input value={cf.label_override} onChange={e => onUpdate({ label_override:e.target.value })} placeholder={base.label||base.field} style={iSt} />
        <Lbl>Hint override</Lbl>
        <textarea value={cf.hint_override} onChange={e => onUpdate({ hint_override:e.target.value })} placeholder={base.hint||"No hint"} rows={3} style={{ ...iSt, resize:"vertical" as const }} />
        <label style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", marginTop:4 }}>
          <input type="checkbox" checked={cf.hidden} onChange={e => onUpdate({ hidden:e.target.checked })} />
          <span style={{ fontSize:12, color:"#374151" }}>Hidden<span style={{ display:"block", fontSize:10, color:"#9ca3af" }}>Still submits to DSpace</span></span>
        </label>
        <div style={{ marginTop:12, padding:"8px 10px", background:"#f8fafc", borderRadius:6, fontSize:11 }}>
          <InfoRow label="Type" value={base.input_type} />
          <InfoRow label="Required" value={base.is_required?"Yes":"No"} />
          {base.repeatable && <InfoRow label="Repeatable" value="Yes" />}
          {base.vocabulary && <InfoRow label="Vocabulary" value={base.vocabulary} />}
          {base.value_pairs_name && <InfoRow label="Pairs" value={base.value_pairs_name} />}
          {isGroup && base.child_form_name_resolved && <InfoRow label="Child form" value={base.child_form_name_resolved} />}
          {(base.type_binds?.length ?? 0) > 0 && <InfoRow label="Type binds" value={base.type_binds!.join(", ")} />}
        </div>
        <button onClick={onRemove} style={{ marginTop:10, width:"100%", padding:"5px 0", borderRadius:5, border:"1px solid #fecaca", background:"#fff", color:"#dc2626", fontSize:11, cursor:"pointer" }}>
          Remove from canvas
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FormEditor
// ─────────────────────────────────────────────────────────────────────────────


// ─────────────────────────────────────────────────────────────────────────────
// XML generators
// ─────────────────────────────────────────────────────────────────────────────

function esc(s: string): string {
  return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

/** Generate submission-forms.xml <form> fragment for a single form */
function generateFormXml(formName: string, canvasRows: CanvasRow[], fieldMap: Map<string,BaseField>): string {
  const lines: string[] = [];
  lines.push(`<form name="${esc(formName)}">`);

  for (const row of canvasRows) {
    // Each CanvasRow maps to one or two <field> elements inside a <row>
    lines.push(`  <row>`);
    for (const cell of row.cols) {
      const base = fieldMap.get(cell.field_name);
      if (!base) continue;

      // Parse schema/element/qualifier from dotted field name if not on base
      const parts = (base.field || cell.field_name).split(".");
      const schema    = parts[0] ?? "";
      const element   = parts[1] ?? "";
      const qualifier = parts.slice(2).join(".") ?? "";

      const label       = cell.label_override || base.label || base.field;
      const hint        = cell.hint_override  || base.hint  || "";
      const inputType   = base.input_type     || "onebox";
      const repeatable  = base.repeatable     ?? false;
      const isRequired  = base.is_required    ?? false;
      const vocabulary  = base.vocabulary     || "";
      const valuePairs  = base.value_pairs_name || "";
      const childForm   = base.child_form_name_resolved || base.child_form_name || "";
      const style       = base.style || "";
      const regex       = base.regex || "";
      const hidden      = cell.hidden;

      lines.push(`    <field>`);
      if (schema)    lines.push(`      <dc-schema>${esc(schema)}</dc-schema>`);
      if (element)   lines.push(`      <dc-element>${esc(element)}</dc-element>`);
      if (qualifier) lines.push(`      <dc-qualifier>${esc(qualifier)}</dc-qualifier>`);
      lines.push(`      <label>${esc(label)}</label>`);

      // input-type: value-pairs-name attr if set
      if (valuePairs) {
        lines.push(`      <input-type value-pairs-name="${esc(valuePairs)}">${esc(inputType)}</input-type>`);
      } else if (vocabulary) {
        lines.push(`      <input-type>${esc(inputType)}</input-type>`);
      } else {
        lines.push(`      <input-type>${esc(inputType)}</input-type>`);
      }

      lines.push(`      <repeatable>${repeatable ? "true" : "false"}</repeatable>`);
      lines.push(isRequired ? `      <required>This field is required.</required>` : `      <required />`);
      if (hint)      lines.push(`      <hint>${esc(hint)}</hint>`);
      if (vocabulary) lines.push(`      <vocabulary closed="${base.vocabulary_closed ? "true" : "false"}">${esc(vocabulary)}</vocabulary>`);
      if (childForm) lines.push(`      <child-form>${esc(childForm)}</child-form>`);
      if (style)     lines.push(`      <style>${esc(style)}</style>`);
      if (regex)     lines.push(`      <regex>${esc(regex)}</regex>`);
      if (hidden)    lines.push(`      <visibility>hidden</visibility>`);
      if (base.type_binds && base.type_binds.length > 0) {
        for (const tb of base.type_binds) lines.push(`      <type-bind>${esc(tb)}</type-bind>`);
      }
      if (base.language_codes && base.language_codes.length > 0) {
        lines.push(`      <language-codes>${base.language_codes.map(esc).join(",")}</language-codes>`);
      }
      lines.push(`    </field>`);
    }
    lines.push(`  </row>`);
  }

  lines.push(`</form>`);
  return lines.join("\n");
}

/** Generate item-submission.xml fragments for a process:
 *  - <step-definition> blocks for all form-type steps
 *  - <submission-process> block
 */
function generateProcessXml(
  processName: string,
  steps: ProcessStep[],
  uploadAllowed: boolean,
): string {
  const lines: string[] = [];

  // Step-definition fragments (only for submission-form type steps that need one)
  const formSteps = steps.filter(s => s.type === "submission-form");
  if (formSteps.length > 0) {
    lines.push(`<!-- Step definitions (paste into <step-definitions> section) -->`);
    for (const s of formSteps) {
      const heading = s.heading || `submit.progressbar.describe.${s.step_id}`;
      const mandatory = s.mandatory !== false;
      lines.push(`<step-definition id="${esc(s.step_id)}" mandatory="${mandatory}">`);
      lines.push(`  <heading>${esc(heading)}</heading>`);
      lines.push(`  <processing-class>org.dspace.app.rest.submit.step.DescribeStep</processing-class>`);
      lines.push(`  <type>submission-form</type>`);
      lines.push(`</step-definition>`);
    }
    lines.push(``);
  }

  // Submission-process block
  lines.push(`<!-- Submission process (paste into <submission-definitions> section) -->`);
  lines.push(`<submission-process name="${esc(processName)}">`);

  for (const s of steps) {
    // Skip upload if not allowed
    if (s.type === "upload" && !uploadAllowed) {
      lines.push(`  <!-- <step id="${esc(s.step_id)}" /> (upload disabled) -->`);
      continue;
    }
    lines.push(`  <step id="${esc(s.step_id)}" />`);
  }

  lines.push(`</submission-process>`);
  return lines.join("\n");
}

// ─────────────────────────────────────────────────────────────────────────────
// XmlModal — shows generated XML with copy button
// ─────────────────────────────────────────────────────────────────────────────

function XmlModal({ title, xml, onClose }: { title: string; xml: string; onClose: () => void }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(xml).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div
      style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", zIndex:2000, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}
      onClick={onClose}
    >
      <div
        style={{ background:"#1e1e2e", borderRadius:12, width:"100%", maxWidth:740, maxHeight:"80vh", display:"flex", flexDirection:"column", boxShadow:"0 24px 80px rgba(0,0,0,0.4)" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 20px", borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:"#e2e8f0" }}>{title}</div>
            <div style={{ fontSize:11, color:"#64748b", marginTop:2 }}>Copy and paste into your DSpace config file</div>
          </div>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <button
              onClick={copy}
              style={{ padding:"6px 14px", borderRadius:6, border:"none", background:copied?"#22c55e":"#7c3aed", color:"#fff", fontSize:12, fontWeight:600, cursor:"pointer", transition:"background 0.2s" }}
            >
              {copied ? "✓ Copied!" : "Copy XML"}
            </button>
            <button
              onClick={onClose}
              style={{ padding:"6px 10px", borderRadius:6, border:"1px solid rgba(255,255,255,0.12)", background:"transparent", color:"#94a3b8", fontSize:13, cursor:"pointer" }}
            >✕</button>
          </div>
        </div>
        {/* Code */}
        <pre style={{
          flex:1, overflowY:"auto", margin:0, padding:"16px 20px",
          fontFamily:"'JetBrains Mono','Fira Code',monospace", fontSize:12, lineHeight:1.6,
          color:"#a5f3fc", background:"transparent", whiteSpace:"pre-wrap", wordBreak:"break-all",
        }}>
          {xml}
        </pre>
      </div>
    </div>
  );
}

function FormEditor({ formId,formName,onBack }: { formId:number; formName:string; onBack:() => void }) {
  const [baseFields, setBaseFields] = useState<BaseField[]>([]);
  const [loading, setLoading] = useState(true);
  const [metaFields, setMetaFields] = useState<MetaField[]>([]);
  const [metaLoading, setMetaLoading] = useState(true);
  const [paletteMode, setPaletteMode] = useState<"form"|"meta">("form");
  const [search, setSearch] = useState("");
  const [metaSearch, setMetaSearch] = useState("");
  const [canvasRows, setCanvasRows] = useState<CanvasRow[]>([]);
  const [sel, setSel] = useState<{ row:number; col:number }|null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showXml, setShowXml] = useState(false);

  useEffect(() => {
    setLoading(true);
    djangoFetch(`/submission-forms/${formId}/`)
      .then((d:any) => { const f=d.fields??[]; setBaseFields(f); setCanvasRows(buildCanvas(f)); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [formId]);

  const [metaPage, setMetaPage] = useState(0);
  const [metaTotal, setMetaTotal] = useState(0);
  const META_PAGE_SIZE = 200;

  // Debounced search effect: reload metadata when search changes (back to page 0)
  const metaSearchRef = React.useRef(metaSearch);
  useEffect(() => { metaSearchRef.current = metaSearch; }, [metaSearch]);

  useEffect(() => {
    setMetaLoading(true);
    const q = encodeURIComponent(metaSearch);
    djangoFetch(`/metadata-fields/?q=${q}&page=${metaPage}&page_size=${META_PAGE_SIZE}`)
      .then((d:any) => {
        const results = d?.results ?? (Array.isArray(d) ? d : []);
        if (metaPage === 0) setMetaFields(results);
        else setMetaFields(prev => [...prev, ...results]);
        setMetaTotal(d?.total ?? results.length);
      })
      .catch(() => {})
      .finally(() => setMetaLoading(false));
  }, [metaPage]); // eslint-disable-line

  // Reset to page 0 when search changes
  const prevMetaSearch = React.useRef(metaSearch);
  useEffect(() => {
    if (metaSearch !== prevMetaSearch.current) {
      prevMetaSearch.current = metaSearch;
      setMetaPage(0);
      setMetaFields([]);
    }
  }, [metaSearch]);

  const fieldMap = useMemo(() => {
    const m = new Map<string,BaseField>(baseFields.map(f => [f.field,f]));
    // Also include synthetic entries for meta-dropped fields
    for (const cf of canvasRows.flatMap(r=>r.cols)) {
      if (!m.has(cf.field_name)) {
        const meta = metaFields.find(mf => mf.field===cf.field_name);
        if (meta) m.set(cf.field_name, { id:-1,row:-1,col:-1,field:meta.field,label:meta.field,input_type:"onebox",is_required:false,vocabulary:"",value_pairs_name:"",hint:meta.scope_note||"" });
      }
    }
    return m;
  }, [baseFields, metaFields, canvasRows]);

  const placed = useMemo(() => new Set(canvasRows.flatMap(r=>r.cols.map(c=>c.field_name))), [canvasRows]);

  // childFormMap: childFormName → BaseField[] (loaded lazily when canvas has group fields)
  const [childFormMap, setChildFormMap] = useState<Map<string,BaseField[]>>(new Map());
  useEffect(() => {
    const childNames = new Set<string>();
    for (const f of baseFields) {
      if ((f.input_type==="group"||f.input_type==="inline-group") && (f.child_form_name_resolved||f.child_form_name))
        childNames.add(f.child_form_name_resolved||f.child_form_name||"");
    }
    if (childNames.size===0) return;
    djangoFetch("/submission-forms/").then((data:any) => {
      const forms: FormListItem[] = data;
      const toLoad = forms.filter(f => childNames.has(f.name));
      toLoad.forEach(form => {
        djangoFetch(`/submission-forms/${form.id}/`).then((d:any) => {
          setChildFormMap(prev => new Map([...prev, [form.name, d.fields??[]]]));
        }).catch(() => {});
      });
    }).catch(() => {});
  }, [baseFields]); // eslint-disable-line

  const filteredForm = useMemo(() => baseFields.filter(f => f.field.toLowerCase().includes(search.toLowerCase())||f.label.toLowerCase().includes(search.toLowerCase())), [baseFields,search]);
  const filteredMeta = useMemo(() => metaFields, [metaFields]);  // search is handled server-side via metaPage reset

  const selRow = sel ? canvasRows[sel.row] : null;
  const selCF  = selRow?.cols[sel?.col??0] ?? null;
  const selBase = selCF ? (fieldMap.get(selCF.field_name)??null) : null;

  function moveRow(from:number,to:number) {
    setCanvasRows(prev => { const rows=[...prev]; const [m]=rows.splice(from,1); rows.splice(to,0,m); return rows; });
    if (sel) {
      if (sel.row===from) setSel({...sel,row:to});
      else if (from<to && sel.row>from && sel.row<=to) setSel({...sel,row:sel.row-1});
      else if (from>to && sel.row>=to && sel.row<from) setSel({...sel,row:sel.row+1});
    }
  }
  function removeField(ri:number,ci:number) {
    setCanvasRows(prev => { const rows=[...prev]; const row={...rows[ri],cols:[...rows[ri].cols]}; if(row.cols.length===1){rows.splice(ri,1);}else{row.cols.splice(ci,1);rows[ri]=row;} return rows; });
    if (sel?.row===ri && sel?.col===ci) setSel(null);
  }
  function addColumnToRow(ri:number) {
    // Prompt user to pick a field name if they didn't drag
    const fn = window.prompt("Enter field name to add as second column (e.g. dc.date.issued):");
    if (!fn || placed.has(fn)) return;
    setCanvasRows(prev => {
      const rows=[...prev];
      const row={...rows[ri],cols:[...rows[ri].cols]};
      row.cols=[...row.cols,{field_name:fn.trim(),label_override:"",hint_override:"",hidden:false}];
      rows[ri]=row;
      return rows;
    });
  }

  function dropOnCell(tr:number,tc:number,fn:string) {
    if (!fn||placed.has(fn)) return;
    setCanvasRows(prev => { const rows=[...prev]; const row={...rows[tr],cols:[...rows[tr].cols]}; const nc:CanvasCell={field_name:fn,label_override:"",hint_override:"",hidden:false}; if(tc>=row.cols.length)row.cols=[...row.cols,nc]; else row.cols[tc]=nc; rows[tr]=row; return rows; });
  }
  function dropAsNewRow(fn:string,after?:number) {
    if (!fn||placed.has(fn)) return;
    const nr:CanvasRow={id:uid(),cols:[{field_name:fn,label_override:"",hint_override:"",hidden:false}]};
    setCanvasRows(prev => { const rows=[...prev]; if(after!=null)rows.splice(after+1,0,nr); else rows.push(nr); return rows; });
  }
  function swapCells(sr:number,sc:number,dr:number,dc:number) {
    if(sr===dr&&sc===dc) return;
    setCanvasRows(prev => { const rows=prev.map(r=>({...r,cols:[...r.cols]})); const sCF=rows[sr]?.cols[sc]; const dCF=rows[dr]?.cols[dc]; if(!sCF)return prev; if(dCF){rows[sr].cols[sc]=dCF;rows[dr].cols[dc]=sCF;}else{rows[dr].cols[dc]=sCF;if(rows[sr].cols.length===1)rows.splice(sr,1);else rows[sr].cols.splice(sc,1);} return rows; });
    setSel({row:dr,col:dc});
  }
  function handleDropCell(tr:number,tc:number,fn:string,src:"palette"|"meta"|"canvas",sr?:number,sc?:number) {
    if(src==="palette"||src==="meta") dropOnCell(tr,tc,fn);
    else if(sr!=null&&sc!=null) swapCells(sr,sc,tr,tc);
  }
  function handleDropBetween(tr:number,fn:string,src:"palette"|"meta"|"canvas",sr?:number,sc?:number) {
    if(src==="palette"||src==="meta") dropOnCell(tr,1,fn);
    else if(sr!=null&&sc!=null) swapCells(sr,sc,tr,1);
  }
  function updateOverride(patch:Partial<CanvasCell>) {
    if(!sel) return;
    setCanvasRows(prev => prev.map((row,ri) => ri!==sel.row?row:{ ...row, cols:row.cols.map((cf,ci) => ci!==sel.col?cf:{...cf,...patch}) }));
  }

  async function handleSave() {
    setSaving(true); setSaved(false);
    try {
      await djangoFetch("/form-layouts/", {
        method:"POST", body:{
          form_name:formName, profile:(import.meta as any).env?.VITE_PROFILE??"plain", collection:null, label:`${formName} layout`,
          sections:[{ key:"main", label:formName, sort_order:0, collapsed_by_default:false, helper_text_above:"", helper_text_below:"",
            field_overrides:canvasRows.flatMap((row,ri) => row.cols.map((cf,ci) => ({ field_name:cf.field_name, sort_order:ri*10+ci, label_override:cf.label_override, hint_override:cf.hint_override, hidden:cf.hidden }))),
          }], conditional_blocks:[],
        },
      } as any);
      setSaved(true); setTimeout(() => setSaved(false),2500);
    } catch(e) { console.error(e); }
    finally { setSaving(false); }
  }

  // Between-row zone — defined inside to capture mutations via closure
  function BetweenRowZone({ afterIdx }:{ afterIdx:number }) {
    const [ov,setOv]=useState(false);
    return <div onDragOver={e=>{e.preventDefault();setOv(true);}} onDragLeave={()=>setOv(false)}
      onDrop={e=>{
        e.preventDefault();setOv(false);
        const r=e.dataTransfer.getData("text/plain");
        if(r.startsWith("palette:")) dropAsNewRow(r.slice(8),afterIdx);
        else if(r.startsWith("meta:")) dropAsNewRow(r.slice(5),afterIdx);
        else if(r.startsWith("row:")) { const fr=parseInt(r.slice(4)); const to=fr<=afterIdx?afterIdx:afterIdx+1; if(fr!==to)moveRow(fr,to); }
      }}
      style={{ height:ov?26:5, margin:"2px 24px", borderRadius:5, background:ov?"#ede9fe":"transparent", border:ov?"2px dashed #7c3aed":"2px dashed transparent", transition:"all 0.12s", display:"flex", alignItems:"center", justifyContent:"center" }}>
      {ov&&<span style={{ fontSize:10, color:"#7c3aed", fontWeight:600 }}>Insert row here</span>}
    </div>;
  }

  if (loading) return <div style={{ padding:40, color:"#9ca3af", fontSize:13 }}>Loading form…</div>;

  return (
    <div style={{ display:"flex", flexDirection:"column", flex:1, overflow:"hidden" }}>
      {/* Sub-header */}
      <div style={{ height:46, background:"#fff", borderBottom:"1px solid #e5e7eb", display:"flex", alignItems:"center", padding:"0 16px", gap:10, flexShrink:0 }}>
        <button onClick={onBack} style={{ background:"none", border:"none", cursor:"pointer", color:"#7c3aed", fontSize:13, fontWeight:600, padding:"4px 8px", borderRadius:5 }}>← Forms</button>
        <span style={{ color:"#d1d5db" }}>·</span>
        <span style={{ fontFamily:"monospace", fontSize:13, fontWeight:600, color:"#111827" }}>{formName}</span>
        <div style={{ flex:1 }} />
        <span style={{ fontSize:11, color:"#9ca3af" }}>{canvasRows.length} rows · {placed.size} fields</span>
        <button onClick={() => setShowXml(true)} style={{ padding:"5px 12px", borderRadius:6, border:"1px solid #e5e7eb", background:"#f8fafc", color:"#374151", fontSize:12, cursor:"pointer", fontWeight:500 }}>
          &lt;/&gt; Show XML
        </button>
        <button onClick={handleSave} disabled={saving} style={{ padding:"5px 14px", borderRadius:6, background:saved?"#d1fae5":saving?"#ede9fe":"#7c3aed", color:saved?"#065f46":saving?"#7c3aed":"#fff", border:"none", fontSize:12, fontWeight:600, cursor:"pointer" }}>
          {saved?"✓ Saved":saving?"Saving…":"Save Layout"}
        </button>
      </div>
      {showXml && (
        <XmlModal
          title={`submission-forms.xml — <form name="${formName}">`}
          xml={generateFormXml(formName, canvasRows, fieldMap)}
          onClose={() => setShowXml(false)}
        />
      )}

      {/* 3-panel */}
      <div style={{ display:"flex", flex:1, overflow:"hidden" }}>

        {/* LEFT: Palette */}
        <div style={{ width:230, borderRight:"1px solid #e5e7eb", background:"#fff", display:"flex", flexDirection:"column", flexShrink:0 }}>
          {/* Toggle */}
          <div style={{ display:"flex", borderBottom:"1px solid #f1f5f9", flexShrink:0 }}>
            {(["form","meta"] as const).map(m => (
              <button key={m} onClick={() => setPaletteMode(m)} style={{ flex:1, padding:"7px 0", fontSize:11, fontWeight:paletteMode===m?600:400, color:paletteMode===m?"#7c3aed":"#6b7280", background:"none", border:"none", borderBottom:paletteMode===m?"2px solid #7c3aed":"2px solid transparent", cursor:"pointer" }}>
                {m==="form"?`Form (${baseFields.length})`:"All fields"}
              </button>
            ))}
          </div>

          {paletteMode === "form" ? (
            <>
              <div style={{ padding:"8px 10px 4px" }}>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search…" style={{ width:"100%", padding:"4px 8px", borderRadius:5, border:"1px solid #e5e7eb", fontSize:11, outline:"none", boxSizing:"border-box" }} />
              </div>
              <div style={{ flex:1, overflowY:"auto", padding:"4px 8px" }}>
                {Object.entries(filteredForm.reduce((acc,f) => { const k=String(f.row); if(!acc[k])acc[k]=[]; acc[k].push(f); return acc; }, {} as Record<string,BaseField[]>)).map(([rk,fields]) => (
                  <div key={rk} style={{ marginBottom:6 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:4, marginBottom:3 }}>
                      <div style={{ flex:1, height:1, background:"#f1f5f9" }} />
                      <span style={{ fontSize:9, color:"#cbd5e1", fontFamily:"monospace" }}>row {rk}</span>
                      <div style={{ flex:1, height:1, background:"#f1f5f9" }} />
                    </div>
                    {fields.map(f => (
                      <div key={f.field} draggable={!placed.has(f.field)} onDragStart={e => e.dataTransfer.setData("text/plain",`palette:${f.field}`)}
                        style={{ width:"100%", opacity:placed.has(f.field)?0.4:1, cursor:placed.has(f.field)?"default":"grab", marginBottom:2 }}>
                        <FieldChip base={f} compact />
                      </div>
                    ))}
                  </div>
                ))}
                {filteredForm.length===0 && <div style={{ color:"#d1d5db", fontSize:11, textAlign:"center", paddingTop:16 }}>No fields</div>}
              </div>
              {/* Legend */}
              <div style={{ padding:"6px 10px", borderTop:"1px solid #f1f5f9", fontSize:9, color:"#9ca3af" }}>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  {[["#fde68a","Req"],["#e9d5ff","Group"],["#bfdbfe","Auth"],["#d9f99d","Pairs"],["#fed7aa","Multi"]].map(([c,l]) => (
                    <span key={l} style={{ display:"flex", alignItems:"center", gap:2 }}>
                      <span style={{ width:7, height:7, borderRadius:2, background:c, display:"inline-block" }}/>{l}
                    </span>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <div style={{ padding:"8px 10px 4px" }}>
                <input value={metaSearch} onChange={e=>setMetaSearch(e.target.value)} placeholder="Search all metadata fields…" style={{ width:"100%", padding:"4px 8px", borderRadius:5, border:"1px solid #e5e7eb", fontSize:11, outline:"none", boxSizing:"border-box" }} />
                <div style={{ fontSize:10, color:"#9ca3af", marginTop:4 }}>Drag to canvas to add fields</div>
              </div>
              <div style={{ flex:1, overflowY:"auto", padding:"4px 8px" }}>
                {metaLoading ? <div style={{ color:"#d1d5db", fontSize:11, padding:8 }}>Loading…</div> :
                  filteredMeta.map(f => (
                    <div key={f.id} draggable={!placed.has(f.field)} onDragStart={e => e.dataTransfer.setData("text/plain",`meta:${f.field}`)}
                      title={`${f.field}${f.scope_note?"\n"+f.scope_note:""}`}
                      style={{ display:"flex", alignItems:"center", gap:5, padding:"4px 8px", borderRadius:5, background:placed.has(f.field)?"#f9fafb":"#fff", border:"1px solid #e5e7eb", cursor:placed.has(f.field)?"default":"grab", opacity:placed.has(f.field)?0.4:1, fontSize:11, fontFamily:"monospace", userSelect:"none", marginBottom:2 }}>
                      <span style={{ width:14, height:14, borderRadius:2, background:"#e0e7ff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:8, fontWeight:700, color:"#4338ca", flexShrink:0 }}>M</span>
                      <span style={{ flex:1, minWidth:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", color:"#374151" }}>{f.field}</span>
                    </div>
                  ))}
                {!metaLoading&&filteredMeta.length===0 && <div style={{ color:"#d1d5db", fontSize:11, textAlign:"center", paddingTop:16 }}>No fields found</div>}
                {!metaLoading && metaFields.length < metaTotal && (
                  <button onClick={() => setMetaPage(p => p+1)} style={{ width:"100%", marginTop:6, padding:"5px 0", borderRadius:5, border:"1px solid #e5e7eb", background:"#f9fafb", fontSize:11, color:"#7c3aed", cursor:"pointer", fontWeight:600 }}>
                    Load more ({metaTotal - metaFields.length} remaining)
                  </button>
                )}
                {metaLoading && metaPage > 0 && <div style={{ color:"#9ca3af", fontSize:11, textAlign:"center", padding:"6px 0" }}>Loading…</div>}
              </div>
            </>
          )}
        </div>

        {/* CENTRE: Canvas */}
        <div style={{ flex:1, overflowY:"auto", padding:"12px 16px" }}>
          <div style={{ maxWidth:620, margin:"0 auto" }}>
            <BetweenRowZone afterIdx={-1} />
            {canvasRows.length===0 && (
              <div style={{ border:"2px dashed #e2e8f0", borderRadius:10, padding:"40px 20px", textAlign:"center", color:"#94a3b8" }}>
                <div style={{ fontSize:32, marginBottom:8 }}>⊞</div>
                <div style={{ fontSize:13, fontWeight:600, marginBottom:4 }}>Canvas is empty</div>
                <div style={{ fontSize:12 }}>Drag fields from the palette on the left.</div>
              </div>
            )}
            {canvasRows.map((row,ri) => (
              <React.Fragment key={row.id}>
                <CanvasRowCard rowIdx={ri} row={row} fieldMap={fieldMap} sel={sel} onSelect={(r,c) => setSel({row:r,col:c})} onMove={moveRow} canUp={ri>0} canDown={ri<canvasRows.length-1} onDropCell={handleDropCell} onDropBetween={handleDropBetween} onRemove={removeField} onAddCol={addColumnToRow} childFormMap={childFormMap} />
                <ChildFormRows cols={row.cols} fieldMap={fieldMap} childFormMap={childFormMap} />
                <BetweenRowZone afterIdx={ri} />
              </React.Fragment>
            ))}
            <AppendDrop onDrop={(fn,src,sr) => { if(src!=="canvas")dropAsNewRow(fn); else if(sr!=null)moveRow(sr,canvasRows.length-1); }} />
          </div>
        </div>

        {/* RIGHT: Inspector */}
        <div style={{ width:248, borderLeft:"1px solid #e5e7eb", background:"#fff", overflowY:"auto", flexShrink:0 }}>
          {sel&&selCF&&selBase
            ? <FieldInspector base={selBase} cf={selCF} rowIdx={sel.row} colIdx={sel.col} onUpdate={updateOverride} onRemove={() => removeField(sel.row,sel.col)} onMoveUp={() => sel.row>0&&moveRow(sel.row,sel.row-1)} onMoveDown={() => sel.row<canvasRows.length-1&&moveRow(sel.row,sel.row+1)} canUp={sel.row>0} canDown={sel.row<canvasRows.length-1} />
            : <div style={{ padding:20, color:"#9ca3af", fontSize:12, textAlign:"center", marginTop:32 }}><div style={{ fontSize:28, marginBottom:8 }}>←</div>Click a field to edit its properties.</div>
          }
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CollapsibleFormStep
// ─────────────────────────────────────────────────────────────────────────────

type StepState = { stepId:string; formName:string; helperAbove:string; helperBelow:string; open:boolean; fields:BaseField[]; fieldsLoading:boolean };

function CollapsibleFormStep({ idx,total,ss,onUpdate,onEditForm }: {
  idx:number; total:number; ss:StepState; onUpdate:(p:Partial<StepState>) => void;
  onEditForm?:(formName:string) => void;
}) {
  const req = ss.fields.filter(f=>f.is_required).length;
  return (
    <div style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:10, marginBottom:10, overflow:"hidden" }}>
      {/* Header */}
      <div onClick={() => onUpdate({ open:!ss.open })} style={{ padding:"12px 16px", cursor:"pointer", background:ss.open?"#faf5ff":"#fff", borderBottom:ss.open?"1px solid #e5e7eb":"none", display:"flex", alignItems:"center", gap:10, transition:"background 0.12s" }}>
        <div style={{ width:26, height:26, borderRadius:"50%", background:"#7c3aed", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, flexShrink:0 }}>{idx+1}</div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontFamily:"monospace", fontSize:13, fontWeight:600, color:"#111827" }}>{ss.stepId}</div>
          <div style={{ fontSize:11, color:"#9ca3af", marginTop:1 }}>
            {ss.fieldsLoading?"Loading…":`${ss.fields.length} field${ss.fields.length!==1?"s":""}${req>0?` · ${req} required`:""}`}
          </div>
        </div>
        {(ss.helperAbove||ss.helperBelow) && <span style={{ fontSize:10, padding:"2px 7px", borderRadius:999, background:"#fef9c3", color:"#854d0e", fontWeight:600 }}>has text</span>}
        {onEditForm && ss.fields.length>0 && (
          <button
            onClick={e => { e.stopPropagation(); onEditForm(ss.formName||ss.stepId); }}
            style={{ padding:"3px 10px", borderRadius:5, border:"1px solid #c4b5fd", background:"#faf5ff", color:"#7c3aed", fontSize:11, cursor:"pointer", fontWeight:600, flexShrink:0 }}
          >✏ Edit form</button>
        )}
        <span style={{ color:"#9ca3af", fontSize:14, flexShrink:0 }}>{ss.open?"▾":"▸"}</span>
      </div>

      {ss.open && (
        <div style={{ padding:"14px 16px" }}>
          {/* Helper above */}
          <Lbl>Helper text above (shown to users before this form step)</Lbl>
          <textarea value={ss.helperAbove} onChange={e => onUpdate({ helperAbove:e.target.value })} placeholder="Optional instructions shown above this section…" rows={2} style={{ ...iSt, resize:"vertical" as const }} />

          {/* Fields preview */}
          <Lbl>Fields ({ss.fields.length})</Lbl>
          {ss.fieldsLoading
            ? <div style={{ color:"#9ca3af", fontSize:12, padding:"6px 0" }}>Loading fields…</div>
            : ss.fields.length===0
              ? <div style={{ color:"#d1d5db", fontSize:12, fontStyle:"italic" }}>No fields found for "{ss.stepId}".</div>
              : <div style={{ marginBottom:10 }}>
                  {Object.entries(ss.fields.reduce((acc,f) => { const k=String(f.row); if(!acc[k])acc[k]=[]; acc[k].push(f); return acc; }, {} as Record<string,BaseField[]>)).map(([rk,rf]) => (
                    <div key={rk} style={{ display:"flex", gap:6, marginBottom:4 }}>
                      {[...rf].sort((a,b)=>a.col-b.col).map(f => <div key={f.field} style={{ flex:1, minWidth:0 }}><FieldChip base={f} compact /></div>)}
                    </div>
                  ))}
                </div>
          }

          {/* Helper below */}
          <Lbl>Helper text below (shown to users after this form step)</Lbl>
          <textarea value={ss.helperBelow} onChange={e => onUpdate({ helperBelow:e.target.value })} placeholder="Optional notes shown below this section…" rows={2} style={{ ...iSt, resize:"vertical" as const }} />
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ProcessEditor
// ─────────────────────────────────────────────────────────────────────────────

function ProcessEditor({ process,onBack,onEditForm }: { process:ProcessDetail; onBack:() => void; onEditForm?:(formName:string) => void }) {
  const formSteps  = useMemo(() => process.steps.filter(s=>s.type==="submission-form"), [process.steps]);
  const otherSteps = useMemo(() => process.steps.filter(s=>s.type!=="submission-form"), [process.steps]);
  const hasUpload  = useMemo(() => process.steps.some(s=>s.type==="upload"), [process.steps]);

  const [uploadAllowed, setUploadAllowed] = useState(hasUpload);
  const [steps, setSteps] = useState<StepState[]>(() =>
    formSteps.map(s => ({ stepId:s.step_id, formName:s.step_id, helperAbove:"", helperBelow:"", open:false, fields:[], fieldsLoading:false }))
  );
  const [saved, setSaved] = useState(false);
  const [showXml, setShowXml] = useState(false);

  // Load fields for each form step
  useEffect(() => {
    if (formSteps.length===0) return;
    // First get all forms to resolve step_id → form id
    djangoFetch("/submission-forms/").then((data:any) => {
      const forms: FormListItem[] = data;
      formSteps.forEach((step,idx) => {
        const match = forms.find(f => f.name===step.step_id);
        if (!match) return;
        setSteps(prev => prev.map((s,i) => i===idx?{...s,fieldsLoading:true}:s));
        djangoFetch(`/submission-forms/${match.id}/`).then((fd:any) => {
          setSteps(prev => prev.map((s,i) => i===idx?{...s,fields:fd.fields??[],fieldsLoading:false,formName:match.name}:s));
        }).catch(() => setSteps(prev => prev.map((s,i) => i===idx?{...s,fieldsLoading:false}:s)));
      });
    }).catch(() => {});
  }, [process.id]); // eslint-disable-line

  function updateStep(idx:number,patch:Partial<StepState>) { setSteps(prev => prev.map((s,i) => i===idx?{...s,...patch}:s)); }

  function handleSave() {
    setSaved(true); setTimeout(() => setSaved(false),2000);
    console.log("Process layout (local):", { process:process.name, uploadAllowed, steps:steps.map(s => ({ stepId:s.stepId, helperAbove:s.helperAbove, helperBelow:s.helperBelow })) });
  }

  const stepTypeColors: Record<string,{bg:string;text:string}> = {
    upload:{bg:"#dbeafe",text:"#1d4ed8"}, license:{bg:"#d1fae5",text:"#065f46"},
    collection:{bg:"#fef9c3",text:"#854d0e"}, correction:{bg:"#fff7ed",text:"#c2410c"},
    extract:{bg:"#fee2e2",text:"#991b1b"}, identifiers:{bg:"#f0f9ff",text:"#0369a1"},
    "detect-duplicate":{bg:"#f3f4f6",text:"#374151"}, "custom-url":{bg:"#f3f4f6",text:"#374151"},
    cclicense:{bg:"#f0fdf4",text:"#15803d"}, coarnotify:{bg:"#fdf4ff",text:"#7e22ce"},
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", flex:1, overflow:"hidden" }}>
      {/* Sub-header */}
      <div style={{ height:46, background:"#fff", borderBottom:"1px solid #e5e7eb", display:"flex", alignItems:"center", padding:"0 16px", gap:10, flexShrink:0 }}>
        <button onClick={onBack} style={{ background:"none", border:"none", cursor:"pointer", color:"#7c3aed", fontSize:13, fontWeight:600, padding:"4px 8px", borderRadius:5 }}>← Processes</button>
        <span style={{ color:"#d1d5db" }}>·</span>
        <span style={{ fontFamily:"monospace", fontSize:13, fontWeight:600, color:"#111827" }}>{process.name}</span>
        <span style={{ fontSize:11, color:"#9ca3af" }}>{formSteps.length} form step{formSteps.length!==1?"s":""}</span>
        <div style={{ flex:1 }} />
        <button onClick={() => setShowXml(true)} style={{ padding:"5px 12px", borderRadius:6, border:"1px solid #e5e7eb", background:"#f8fafc", color:"#374151", fontSize:12, cursor:"pointer", fontWeight:500 }}>
          &lt;/&gt; Show XML
        </button>
        <button onClick={handleSave} style={{ padding:"5px 14px", borderRadius:6, background:saved?"#d1fae5":"#7c3aed", color:saved?"#065f46":"#fff", border:"none", fontSize:12, fontWeight:600, cursor:"pointer" }}>
          {saved?"✓ Saved":"Save Layout"}
        </button>
      </div>
      {showXml && (
        <XmlModal
          title={`item-submission.xml — <submission-process name="${process.name}">`}
          xml={generateProcessXml(process.name, process.steps, uploadAllowed)}
          onClose={() => setShowXml(false)}
        />
      )}

      <div style={{ flex:1, overflowY:"auto", padding:"20px 24px" }}>
        <div style={{ maxWidth:760, margin:"0 auto" }}>

          {/* Options */}
          <div style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:10, padding:"14px 18px", marginBottom:20 }}>
            <div style={{ fontSize:12, fontWeight:600, color:"#374151", marginBottom:10 }}>Process options</div>
            <label style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer" }}>
              <input type="checkbox" checked={uploadAllowed} onChange={e => setUploadAllowed(e.target.checked)} style={{ width:15, height:15 }} />
              <div>
                <div style={{ fontSize:13, fontWeight:500, color:"#111827" }}>Allow file upload</div>
                <div style={{ fontSize:11, color:"#9ca3af" }}>{hasUpload?"Upload step is present in this process":"Upload step is not in the original process"}</div>
              </div>
            </label>
          </div>

          {/* Other steps */}
          {otherSteps.length>0 && (
            <div style={{ background:"#f8fafc", border:"1px solid #e5e7eb", borderRadius:10, padding:"12px 18px", marginBottom:20 }}>
              <div style={{ fontSize:11, fontWeight:600, color:"#9ca3af", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:8 }}>Other steps (read-only)</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                {otherSteps.map(s => {
                  const {bg,text}=stepTypeColors[s.type??""  ]??{bg:"#f3f4f6",text:"#6b7280"};
                  return <span key={s.id} style={{ fontSize:11, padding:"3px 10px", borderRadius:999, background:bg, color:text, fontWeight:500 }}>{s.step_id}</span>;
                })}
              </div>
            </div>
          )}

          {/* Form steps */}
          {formSteps.length===0
            ? <EmptyState icon="📋" title="No form steps" body="This process has no submission-form type steps." />
            : steps.map((ss,idx) => <CollapsibleFormStep key={ss.stepId} idx={idx} total={steps.length} ss={ss} onUpdate={p => updateStep(idx,p)} onEditForm={onEditForm} />)
          }
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SubmissionFormsTab
// ─────────────────────────────────────────────────────────────────────────────

// Thin wrapper used when navigating from ProcessEditor → FormEditor
function SubmissionFormsTabInner({ forms: initialForms, initialFormName, onBack, externalBack }: {
  forms: FormListItem[]; initialFormName?: string; onBack?:() => void; externalBack?:boolean;
}) {
  const [forms, setForms] = useState<FormListItem[]>(initialForms);
  const [loading, setLoading] = useState(initialForms.length===0);
  const [error, setError] = useState<string|null>(null);

  useEffect(() => {
    if (forms.length>0) return;
    djangoFetch("/submission-forms/")
      .then((d:any) => setForms(d))
      .catch(() => setError("Could not load forms."))
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line

  if (loading) return <div style={{ padding:40, color:"#9ca3af", fontSize:13 }}>Loading…</div>;
  if (error)   return <div style={{ padding:40, color:"#dc2626", fontSize:13 }}>{error}</div>;

  const match = forms.find(f => f.name===initialFormName);
  if (!match) return <div style={{ padding:40, color:"#9ca3af", fontSize:13 }}>Form "{initialFormName}" not found.</div>;

  return <FormEditor formId={match.id} formName={match.name} onBack={onBack??(() => {})} />;
}

function SubmissionFormsTab({ initialFormName }: { initialFormName?:string }) {
  const [forms, setForms] = useState<FormListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<FormListItem|null>(null);
  const [newFormOpen, setNewFormOpen] = useState(false);

  useEffect(() => {
    djangoFetch("/submission-forms/")
      .then((d:any) => {
        setForms(d);
        if (initialFormName) { const m=d.find((f:FormListItem) => f.name===initialFormName); if(m) setEditing(m); }
      })
      .catch(() => setError("Could not load submission forms."))
      .finally(() => setLoading(false));
  }, [initialFormName]);

  if (editing) return <FormEditor formId={editing.id} formName={editing.name} onBack={() => setEditing(null)} />;
  if (loading) return <div style={{ padding:40, color:"#9ca3af", fontSize:13 }}>Loading…</div>;
  if (error)   return <div style={{ padding:40, color:"#dc2626", fontSize:13 }}>{error}</div>;
  if (forms.length===0) return <EmptyState icon="📭" title="No submission forms imported" body="Run python manage.py import_plain_config to populate them." />;

  const filtered = forms.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ display:"flex", flexDirection:"column", flex:1, overflow:"hidden", background:"#f8fafc" }}>
      <div style={{ padding:"12px 20px", background:"#fff", borderBottom:"1px solid #e5e7eb", display:"flex", alignItems:"center", gap:12, flexShrink:0 }}>
        <div style={{ fontSize:13, fontWeight:600, color:"#374151" }}>{forms.length} form{forms.length!==1?"s":""} imported</div>
        <div style={{ flex:1 }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Filter forms…" style={{ padding:"5px 10px", borderRadius:6, border:"1px solid #e5e7eb", fontSize:12, width:200, outline:"none", background:"#f9fafb" }} />
        <button onClick={() => setNewFormOpen(true)} style={{ padding:"5px 12px", borderRadius:6, border:"1px solid #e5e7eb", background:"#fff", fontSize:12, color:"#374151", cursor:"pointer", fontWeight:500 }}>+ New form</button>
      </div>
      {newFormOpen && <NewFormModal forms={forms} onClose={() => setNewFormOpen(false)} onCreated={f => { setForms(prev => [...prev,f]); setNewFormOpen(false); setEditing(f); }} />}
      <div style={{ flex:1, overflowY:"auto", padding:"16px 20px" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
          <thead>
            <tr style={{ borderBottom:"2px solid #e5e7eb" }}>
              {["Form name","Fields","Has required fields","Imported"].map(h => (
                <th key={h} style={{ textAlign:"left", padding:"8px 12px", fontSize:11, fontWeight:600, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.07em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((f,idx) => (
              <tr key={f.id} onClick={() => setEditing(f)}
                style={{ borderBottom:"1px solid #f3f4f6", background:idx%2===0?"#fff":"#fafafa", cursor:"pointer" }}
                onMouseEnter={e => (e.currentTarget.style.background="#f5f3ff")}
                onMouseLeave={e => (e.currentTarget.style.background=idx%2===0?"#fff":"#fafafa")}
              >
                <td style={{ padding:"10px 12px" }}>
                  <span style={{ fontFamily:"monospace", fontSize:13, fontWeight:600, color:"#111827" }}>{f.name}</span>
                </td>
                <td style={{ padding:"10px 12px" }}>
                  <span style={{ display:"inline-block", minWidth:32, textAlign:"center", padding:"2px 8px", borderRadius:999, background:"#f3f4f6", fontWeight:600, fontSize:12, color:"#374151" }}>{f.field_count}</span>
                </td>
                <td style={{ padding:"10px 12px" }}>
                  {f.contains_required
                    ? <span style={{ fontSize:11, color:"#b45309", fontWeight:600 }}>✓ yes</span>
                    : <span style={{ fontSize:11, color:"#9ca3af" }}>—</span>}
                </td>
                <td style={{ padding:"10px 12px", color:"#9ca3af", fontSize:11 }}>
                  {new Date(f.imported_at).toLocaleDateString()}
                </td>
                <td style={{ padding:"10px 12px", textAlign:"right" }} onClick={e => e.stopPropagation()}>
                  <button onClick={() => {
                    const name = window.prompt(`Clone "${f.name}" as:`, f.name+"-copy");
                    if (!name||!name.trim()) return;
                    const clone = { ...f, id: Date.now(), name: name.trim(), imported_at: new Date().toISOString() };
                    setForms(prev => [...prev, clone]);
                    setEditing(clone);
                  }} style={{ padding:"3px 8px", borderRadius:5, border:"1px solid #e5e7eb", background:"#f9fafb", fontSize:11, color:"#6b7280", cursor:"pointer" }}>
                    Clone
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length===0 && <div style={{ textAlign:"center", padding:"32px 0", color:"#d1d5db", fontSize:13 }}>No forms match "{search}"</div>}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SubmissionProcessesTab
// ─────────────────────────────────────────────────────────────────────────────

function SubmissionProcessesTab() {
  const [processes, setProcesses] = useState<ProcessListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<ProcessDetail|null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [newProcOpen, setNewProcOpen] = useState(false);

  useEffect(() => {
    djangoFetch("/submission-processes/")
      .then((d:any) => setProcesses(d))
      .catch(() => setError("Could not load submission processes."))
      .finally(() => setLoading(false));
  }, []);

  function openProcess(p:ProcessListItem) {
    setDetailLoading(true);
    djangoFetch(`/submission-processes/${p.id}/`)
      .then((d:any) => setEditing(d))
      .catch(() => setError("Could not load process."))
      .finally(() => setDetailLoading(false));
  }

  const [editFormName, setEditFormName] = useState<string|null>(null);
  if (editFormName) {
    return <SubmissionFormsTabInner forms={[]} initialFormName={editFormName} onBack={() => setEditFormName(null)} externalBack />;
  }
  if (editing) return <ProcessEditor process={editing} onBack={() => setEditing(null)} onEditForm={fn => { setEditing(null); setEditFormName(fn); }} />;
  if (loading||detailLoading) return <div style={{ padding:40, color:"#9ca3af", fontSize:13 }}>Loading…</div>;
  if (error)   return <div style={{ padding:40, color:"#dc2626", fontSize:13 }}>{error}</div>;
  if (processes.length===0) return <EmptyState icon="📭" title="No submission processes imported" body="Run python manage.py import_plain_config to populate them." />;

  const filtered = processes.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  const full = filtered.filter(p => !p.name.endsWith("-edit")&&!p.name.startsWith("admin-"));
  const edit = filtered.filter(p => p.name.endsWith("-edit")||p.name.startsWith("admin-"));

  function Group({ items,label }:{ items:ProcessListItem[]; label:string }) {
    if (items.length===0) return null;
    return <>
      <tr><td colSpan={3} style={{ padding:"16px 12px 6px", fontSize:10, fontWeight:700, color:"#9ca3af", textTransform:"uppercase", letterSpacing:"0.1em", background:"#f8fafc" }}>{label}</td></tr>
      {items.map(p => (
        <tr key={p.id} onClick={() => openProcess(p)}
          style={{ borderBottom:"1px solid #f3f4f6", background:"#fff", cursor:"pointer" }}
          onMouseEnter={e => (e.currentTarget.style.background="#f5f3ff")}
          onMouseLeave={e => (e.currentTarget.style.background="#fff")}
        >
          <td style={{ padding:"12px 12px" }}>
            <span style={{ fontFamily:"monospace", fontSize:13, fontWeight:600, color:"#111827" }}>{p.name}</span>
            <div style={{ fontSize:11, color:"#9ca3af", marginTop:2 }}>{p.step_count} step{p.step_count!==1?"s":""}</div>
          </td>
          <td style={{ padding:"12px 12px", color:"#9ca3af", fontSize:11 }}>{new Date(p.imported_at).toLocaleDateString()}</td>
          <td style={{ padding:"12px 12px", textAlign:"right", display:"flex", gap:8, alignItems:"center", justifyContent:"flex-end" }} onClick={e => e.stopPropagation()}>
            <button onClick={e => { e.stopPropagation(); const n=window.prompt(`Clone "${p.name}" as:`,p.name+"-copy"); if(!n||!n.trim())return; const c={...p,id:Date.now(),name:n.trim(),imported_at:new Date().toISOString()}; setProcesses(prev=>[...prev,c]); openProcess(c); }}
              style={{ padding:"3px 8px", borderRadius:5, border:"1px solid #e5e7eb", background:"#f9fafb", fontSize:11, color:"#6b7280", cursor:"pointer" }}>Clone</button>
            <span style={{ fontSize:11, color:"#7c3aed", fontWeight:600 }}>Edit →</span>
          </td>
        </tr>
      ))}
    </>;
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", flex:1, overflow:"hidden", background:"#f8fafc" }}>
      <div style={{ padding:"12px 20px", background:"#fff", borderBottom:"1px solid #e5e7eb", display:"flex", alignItems:"center", gap:12, flexShrink:0 }}>
        <div style={{ fontSize:13, fontWeight:600, color:"#374151" }}>{processes.length} process{processes.length!==1?"es":""} imported</div>
        <div style={{ flex:1 }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Filter processes…" style={{ padding:"5px 10px", borderRadius:6, border:"1px solid #e5e7eb", fontSize:12, width:200, outline:"none", background:"#f9fafb" }} />
        <button onClick={() => setNewProcOpen(true)} style={{ padding:"5px 12px", borderRadius:6, border:"1px solid #e5e7eb", background:"#fff", fontSize:12, color:"#374151", cursor:"pointer", fontWeight:500 }}>+ New process</button>
      </div>
      {newProcOpen && <NewProcessModal processes={processes} onClose={() => setNewProcOpen(false)} onCreated={p => { setProcesses(prev => [...prev,p]); setNewProcOpen(false); openProcess(p); }} />}
      <div style={{ flex:1, overflowY:"auto", padding:"0 20px 20px" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
          <thead>
            <tr style={{ borderBottom:"2px solid #e5e7eb" }}>
              {["Process","Imported",""].map((h,i) => (
                <th key={i} style={{ textAlign:i===2?"right":"left", padding:"12px 12px 8px", fontSize:11, fontWeight:600, color:"#6b7280", textTransform:"uppercase", letterSpacing:"0.07em" } as React.CSSProperties}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <Group items={full} label="Full submission" />
            <Group items={edit} label="Edit / Admin" />
          </tbody>
        </table>
        {filtered.length===0 && <div style={{ textAlign:"center", padding:"32px 0", color:"#d1d5db", fontSize:13 }}>No processes match "{search}"</div>}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NewFormModal — create or clone a submission form
// ─────────────────────────────────────────────────────────────────────────────

function NewFormModal({ forms, onClose, onCreated }: {
  forms: FormListItem[]; onClose:() => void; onCreated:(f:FormListItem) => void;
}) {
  const [name, setName] = useState("");
  const [cloneFrom, setCloneFrom] = useState<number|"">("");
  const nameExists = forms.some(f => f.name===name.trim());

  function handleCreate() {
    if (!name.trim()||nameExists) return;
    const base = cloneFrom ? forms.find(f=>f.id===cloneFrom) : null;
    const newForm: FormListItem = {
      id: Date.now(), name: name.trim(),
      field_count: base?.field_count??0,
      contains_required: base?.contains_required??false,
      imported_at: new Date().toISOString(),
    };
    onCreated(newForm);
  }

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.3)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center" }} onClick={onClose}>
      <div style={{ background:"#fff", borderRadius:12, padding:24, width:420, boxShadow:"0 20px 60px rgba(0,0,0,0.15)" }} onClick={e=>e.stopPropagation()}>
        <div style={{ fontSize:15, fontWeight:700, color:"#111827", marginBottom:16 }}>Create new form</div>
        <Lbl>Form name</Lbl>
        <input autoFocus value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleCreate()} placeholder="e.g. my-custom-publication" style={{ ...iSt, border: nameExists?"1px solid #fca5a5":iSt.border }} />
        {nameExists && <div style={{ fontSize:11, color:"#dc2626", marginTop:-4, marginBottom:6 }}>A form with this name already exists.</div>}
        <Lbl>Clone fields from (optional)</Lbl>
        <select value={cloneFrom} onChange={e=>setCloneFrom(e.target.value?Number(e.target.value):"")} style={{ ...iSt }}>
          <option value="">— start empty —</option>
          {forms.map(f=><option key={f.id} value={f.id}>{f.name} ({f.field_count} fields)</option>)}
        </select>
        <div style={{ display:"flex", gap:8, marginTop:16, justifyContent:"flex-end" }}>
          <button onClick={onClose} style={{ padding:"6px 14px", borderRadius:6, border:"1px solid #e5e7eb", background:"#fff", fontSize:12, color:"#6b7280", cursor:"pointer" }}>Cancel</button>
          <button onClick={handleCreate} disabled={!name.trim()||nameExists} style={{ padding:"6px 14px", borderRadius:6, border:"none", background:(!name.trim()||nameExists)?"#e5e7eb":"#7c3aed", color:(!name.trim()||nameExists)?"#9ca3af":"#fff", fontSize:12, fontWeight:600, cursor:(!name.trim()||nameExists)?"default":"pointer" }}>Create & Edit</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NewProcessModal — create or clone a submission process
// ─────────────────────────────────────────────────────────────────────────────

function NewProcessModal({ processes, onClose, onCreated }: {
  processes: ProcessListItem[]; onClose:() => void; onCreated:(p:ProcessListItem) => void;
}) {
  const [name, setName] = useState("");
  const nameExists = processes.some(p => p.name===name.trim());

  function handleCreate() {
    if (!name.trim()||nameExists) return;
    const newProc: ProcessListItem = {
      id: Date.now(), name: name.trim(), step_count: 0, imported_at: new Date().toISOString(),
    };
    onCreated(newProc);
  }

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.3)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center" }} onClick={onClose}>
      <div style={{ background:"#fff", borderRadius:12, padding:24, width:420, boxShadow:"0 20px 60px rgba(0,0,0,0.15)" }} onClick={e=>e.stopPropagation()}>
        <div style={{ fontSize:15, fontWeight:700, color:"#111827", marginBottom:16 }}>Create new process</div>
        <Lbl>Process name</Lbl>
        <input autoFocus value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleCreate()} placeholder="e.g. my-entity" style={{ ...iSt, border: nameExists?"1px solid #fca5a5":iSt.border }} />
        {nameExists && <div style={{ fontSize:11, color:"#dc2626", marginTop:-4, marginBottom:6 }}>A process with this name already exists.</div>}
        <div style={{ fontSize:11, color:"#9ca3af", marginTop:4 }}>You'll configure the steps after creation.</div>
        <div style={{ display:"flex", gap:8, marginTop:16, justifyContent:"flex-end" }}>
          <button onClick={onClose} style={{ padding:"6px 14px", borderRadius:6, border:"1px solid #e5e7eb", background:"#fff", fontSize:12, color:"#6b7280", cursor:"pointer" }}>Cancel</button>
          <button onClick={handleCreate} disabled={!name.trim()||nameExists} style={{ padding:"6px 14px", borderRadius:6, border:"none", background:(!name.trim()||nameExists)?"#e5e7eb":"#7c3aed", color:(!name.trim()||nameExists)?"#9ca3af":"#fff", fontSize:12, fontWeight:600, cursor:(!name.trim()||nameExists)?"default":"pointer" }}>Create & Configure</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FormBuilderPage — shell
// ─────────────────────────────────────────────────────────────────────────────

type ActiveTab = "forms"|"processes";

export function FormBuilderPage({ initialProcess }:{ initialProcess?:string }) {
  const [tab, setTab] = useState<ActiveTab>("forms");
  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100vh", fontFamily:"'IBM Plex Sans',system-ui,sans-serif", background:"#f8fafc", color:"#111827" }}>
      <div style={{ height:48, background:"#fff", borderBottom:"1px solid #e5e7eb", display:"flex", alignItems:"center", padding:"0 16px", flexShrink:0 }}>
        <span style={{ fontWeight:700, fontSize:15, color:"#111827" }}>🗂 Form Builder</span>
      </div>
      <div style={{ height:40, background:"#fff", borderBottom:"1px solid #e5e7eb", display:"flex", alignItems:"flex-end", padding:"0 16px", flexShrink:0 }}>
        <TabBtn label="Submission Forms"     active={tab==="forms"}     onClick={() => setTab("forms")} />
        <TabBtn label="Submission Processes" active={tab==="processes"} onClick={() => setTab("processes")} />
      </div>
      <div style={{ display:"flex", flex:1, overflow:"hidden" }}>
        {tab==="forms"     && <SubmissionFormsTab initialFormName={initialProcess} />}
        {tab==="processes" && <SubmissionProcessesTab />}
      </div>
    </div>
  );
}
