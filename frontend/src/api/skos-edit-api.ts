/**
 * skos-edit-api.ts
 *
 * Read and save SKOS metadata for ConceptScheme and Concept items.
 *
 * Supports two targets:
 *   - Workspace item  → PATCH /api/submission/workspaceitems/{id}  (JSON Patch)
 *   - Archived item   → PUT  /api/core/items/{uuid}/metadata        (full replace)
 */

import { apiFetch } from "../auth/client";
import type { Metadata, MetaValue } from "../api/dspace";
import type { ConceptSchemeValues, ConceptValues, LangValue } from "../api/skos-creation-api";

// ── Re-export so callers only need one import ─────────────────────────────────

export type { ConceptSchemeValues, ConceptValues, LangValue };

// ── Metadata reading helpers ──────────────────────────────────────────────────

function first(meta: Metadata, field: string): string {
  return meta[field]?.[0]?.value ?? "";
}

function all(meta: Metadata, field: string): string[] {
  return (meta[field] ?? []).map((v) => v.value);
}

function langValues(meta: Metadata, valueField: string, langField: string): LangValue[] {
  const vals = meta[valueField] ?? [];
  const langs = meta[langField] ?? [];
  return vals.map((v, i) => ({
    value: v.value,
    language: langs[i]?.value ?? "",
  }));
}

// ── Read: extract ConceptScheme values from flat metadata ─────────────────────

export function readConceptSchemeValues(meta: Metadata): ConceptSchemeValues {
  return {
    title:          first(meta, "dc.title"),
    description:    first(meta, "dc.description"),
    creator:        first(meta, "dc.creator"),
    contributors:   all(meta, "dc.contributor"),
    subjects:       all(meta, "dc.subject"),
    publisher:      first(meta, "dc.publisher"),
    dateIssued:     first(meta, "dc.date.issued"),
    hasTopConcepts: all(meta, "skos.hasTopConcept"),
    notations:      all(meta, "skos.notation"),
  };
}

// ── Read: extract Concept values from flat metadata ───────────────────────────

export function readConceptValues(meta: Metadata): ConceptValues {
  return {
    title:              first(meta, "dc.title"),
    inScheme:           first(meta, "skos.inScheme"),
    topConceptOf:       first(meta, "skos.topConceptOf"),
    prefLabels:         langValues(meta, "skos.prefLabel",    "skos.prefLabel.language"),
    altLabels:          langValues(meta, "skos.altLabel",     "skos.altLabel.language"),
    hiddenLabels:       langValues(meta, "skos.hiddenLabel",  "skos.hiddenLabel.language"),
    definitions:        langValues(meta, "skos.definition",   "skos.definition.language"),
    scopeNotes:         langValues(meta, "skos.scopeNote",    "skos.scopeNote.language"),
    examples:           langValues(meta, "skos.example",      "skos.example.language"),
    changeNotes:        langValues(meta, "skos.changeNote",   "skos.changeNote.language"),
    editorialNotes:     langValues(meta, "skos.editorialNote","skos.editorialNote.language"),
    historyNotes:       langValues(meta, "skos.historyNote",  "skos.historyNote.language"),
    notes:              langValues(meta, "skos.note",         "skos.note.language"),
    broader:            all(meta, "skos.broader"),
    narrower:           all(meta, "skos.narrower"),
    related:            all(meta, "skos.related"),
    broaderTransitive:  all(meta, "skos.broaderTransitive"),
    narrowerTransitive: all(meta, "skos.narrowerTransitive"),
    exactMatch:         all(meta, "skos.exactMatch"),
    closeMatch:         all(meta, "skos.closeMatch"),
    broadMatch:         all(meta, "skos.broadMatch"),
    narrowMatch:        all(meta, "skos.narrowMatch"),
    relatedMatch:       all(meta, "skos.relatedMatch"),
    notations:          all(meta, "skos.notation"),
  };
}

// ── Metadata builder helpers ──────────────────────────────────────────────────

function mv(value: string, language?: string | null, authority?: string | null): MetaValue {
  return {
    value,
    language: language ?? null,
    authority: authority ?? null,
    confidence: authority ? 600 : -1,
    place: 0,
  };
}

function fromStrings(values: string[]): MetaValue[] {
  return values
    .map((v) => v.trim())
    .filter(Boolean)
    .map((v, i) => ({ ...mv(v), place: i }));
}

function fromLangValues(values: LangValue[]): MetaValue[] {
  return values
    .filter((v) => v.value.trim())
    .map((v, i) => ({ ...mv(v.value.trim(), v.language?.trim() || null), place: i }));
}

function fromLangValuesLangOnly(values: LangValue[]): MetaValue[] {
  return values
    .filter((v) => v.value.trim() && v.language?.trim())
    .map((v, i) => ({ ...mv(v.language!.trim()), place: i }));
}

// ── Build flat metadata object for a ConceptScheme ────────────────────────────

function buildConceptSchemeMeta(values: ConceptSchemeValues): Metadata {
  const meta: Metadata = {};

  const set = (field: string, arr: MetaValue[]) => {
    if (arr.length) meta[field] = arr;
  };

  set("dc.title",          fromStrings([values.title]));
  set("dc.description",    fromStrings([values.description]));
  set("dc.creator",        fromStrings([values.creator]));
  set("dc.contributor",    fromStrings(values.contributors));
  set("dc.subject",        fromStrings(values.subjects));
  set("dc.publisher",      fromStrings([values.publisher]));
  set("dc.date.issued",    fromStrings([values.dateIssued]));
  set("skos.hasTopConcept",fromStrings(values.hasTopConcepts));
  set("skos.notation",     fromStrings(values.notations));

  return meta;
}

// ── Build flat metadata object for a Concept ─────────────────────────────────

function buildConceptMeta(values: ConceptValues): Metadata {
  const meta: Metadata = {};

  const set = (field: string, arr: MetaValue[]) => {
    if (arr.length) meta[field] = arr;
  };

  set("dc.title",               fromStrings([values.title]));
  set("skos.inScheme",          fromStrings([values.inScheme]));
  set("skos.topConceptOf",      fromStrings([values.topConceptOf]));

  // Labels: value array + parallel language array
  const setLang = (vf: string, lf: string, vals: LangValue[]) => {
    set(vf, fromLangValues(vals));
    set(lf, fromLangValuesLangOnly(vals));
  };

  setLang("skos.prefLabel",    "skos.prefLabel.language",    values.prefLabels);
  setLang("skos.altLabel",     "skos.altLabel.language",     values.altLabels);
  setLang("skos.hiddenLabel",  "skos.hiddenLabel.language",  values.hiddenLabels);
  setLang("skos.definition",   "skos.definition.language",   values.definitions);
  setLang("skos.scopeNote",    "skos.scopeNote.language",    values.scopeNotes);
  setLang("skos.example",      "skos.example.language",      values.examples);
  setLang("skos.changeNote",   "skos.changeNote.language",   values.changeNotes);
  setLang("skos.editorialNote","skos.editorialNote.language",values.editorialNotes);
  setLang("skos.historyNote",  "skos.historyNote.language",  values.historyNotes);
  setLang("skos.note",         "skos.note.language",         values.notes);

  set("skos.broader",           fromStrings(values.broader));
  set("skos.narrower",          fromStrings(values.narrower));
  set("skos.related",           fromStrings(values.related));
  set("skos.broaderTransitive", fromStrings(values.broaderTransitive));
  set("skos.narrowerTransitive",fromStrings(values.narrowerTransitive));
  set("skos.exactMatch",        fromStrings(values.exactMatch));
  set("skos.closeMatch",        fromStrings(values.closeMatch));
  set("skos.broadMatch",        fromStrings(values.broadMatch));
  set("skos.narrowMatch",       fromStrings(values.narrowMatch));
  set("skos.relatedMatch",      fromStrings(values.relatedMatch));
  set("skos.notation",          fromStrings(values.notations));

  return meta;
}

// ── SKOS field sets (to know what to replace in workspace PATCH) ──────────────

const CONCEPT_SCHEME_FIELDS = [
  "dc.title", "dc.description", "dc.creator", "dc.contributor",
  "dc.subject", "dc.publisher", "dc.date.issued",
  "skos.hasTopConcept", "skos.notation",
];

const CONCEPT_FIELDS = [
  "dc.title", "skos.inScheme", "skos.topConceptOf",
  "skos.prefLabel", "skos.prefLabel.language",
  "skos.altLabel", "skos.altLabel.language",
  "skos.hiddenLabel", "skos.hiddenLabel.language",
  "skos.definition", "skos.definition.language",
  "skos.scopeNote", "skos.scopeNote.language",
  "skos.example", "skos.example.language",
  "skos.changeNote", "skos.changeNote.language",
  "skos.editorialNote", "skos.editorialNote.language",
  "skos.historyNote", "skos.historyNote.language",
  "skos.note", "skos.note.language",
  "skos.broader", "skos.narrower", "skos.related",
  "skos.broaderTransitive", "skos.narrowerTransitive",
  "skos.exactMatch", "skos.closeMatch", "skos.broadMatch",
  "skos.narrowMatch", "skos.relatedMatch",
  "skos.notation",
];

// ── Section routing for workspace PATCH ──────────────────────────────────────

// Maps metadata field → submission section name (for JSON Patch path building)
const FIELD_TO_SECTION: Record<string, string> = {
  "dc.title":                "conceptscheme",
  "dc.description":          "conceptscheme",
  "dc.creator":              "conceptscheme",
  "dc.contributor":          "conceptscheme",
  "dc.subject":              "conceptscheme",
  "dc.publisher":            "conceptscheme",
  "dc.date.issued":          "conceptscheme",
  "skos.hasTopConcept":      "conceptscheme",
  "skos.inScheme":           "concept",
  "skos.topConceptOf":       "concept",
  "skos.prefLabel":          "concept",
  "skos.prefLabel.language": "concept",
  "skos.altLabel":           "concept",
  "skos.altLabel.language":  "concept",
  "skos.hiddenLabel":        "concept",
  "skos.hiddenLabel.language":"concept",
  "skos.definition":         "concept_documentation",
  "skos.definition.language":"concept_documentation",
  "skos.scopeNote":          "concept_documentation",
  "skos.scopeNote.language": "concept_documentation",
  "skos.example":            "concept_documentation",
  "skos.example.language":   "concept_documentation",
  "skos.changeNote":         "concept_documentation",
  "skos.changeNote.language":"concept_documentation",
  "skos.editorialNote":      "concept_documentation",
  "skos.editorialNote.language":"concept_documentation",
  "skos.historyNote":        "concept_documentation",
  "skos.historyNote.language":"concept_documentation",
  "skos.note":               "concept_documentation",
  "skos.note.language":      "concept_documentation",
  "skos.broader":            "concept_semantic_relations",
  "skos.narrower":           "concept_semantic_relations",
  "skos.related":            "concept_semantic_relations",
  "skos.broaderTransitive":  "concept_semantic_relations",
  "skos.narrowerTransitive": "concept_semantic_relations",
  "skos.exactMatch":         "concept_mappings",
  "skos.closeMatch":         "concept_mappings",
  "skos.broadMatch":         "concept_mappings",
  "skos.narrowMatch":        "concept_mappings",
  "skos.relatedMatch":       "concept_mappings",
  "skos.notation":           "concept_notations",
};

function sectionFor(field: string, entityType: "ConceptScheme" | "Concept"): string {
  if (FIELD_TO_SECTION[field]) return FIELD_TO_SECTION[field];
  // dc.title is shared — use the right section per entity type
  if (field === "dc.title") return entityType === "ConceptScheme" ? "conceptscheme" : "concept";
  return entityType === "ConceptScheme" ? "conceptscheme" : "concept";
}

// ── Save: workspace item (PATCH with JSON Patch replace/add ops) ──────────────

/**
 * Saves SKOS fields on a workspace item via JSON Patch.
 * Uses "replace" for each field (removes then sets in one op).
 */
async function saveWorkspaceItem(
  wsId: number,
  meta: Metadata,
  fields: string[],
  entityType: "ConceptScheme" | "Concept",
): Promise<void> {
  type Op = { op: string; path: string; value?: any };
  const ops: Op[] = [];

  for (const field of fields) {
    const section = sectionFor(field, entityType);
    const path = `/sections/${section}/${field}`;
    const vals = meta[field];

    if (vals?.length) {
      ops.push({ op: "replace", path, value: vals });
    } else {
      // remove only if the field might already exist
      ops.push({ op: "remove", path });
    }
  }

  // DSpace will 422 on remove of non-existent path, so we use a two-pass approach:
  // send replace ops (which will add if absent), then ignore 422 on remove.
  // Simpler: just send the add ops for non-empty and accept the replace for empty.
  // Actually the cleanest pattern is: replace for non-empty, skip empty (DSpace
  // treats absent field as empty, and we can't easily remove individual fields
  // without knowing if they exist). We'll use "add" for non-empty, which
  // replaces any existing values in DSpace submission.
  const safeOps: Op[] = fields.flatMap((field) => {
    const section = sectionFor(field, entityType);
    const vals = meta[field];
    if (!vals?.length) return [];
    return [{ op: "add", path: `/sections/${section}/${field}`, value: vals }];
  });

  if (!safeOps.length) return;

  await apiFetch<any>(`/api/submission/workspaceitems/${wsId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(safeOps),
  });
}

// ── Save: archived item (PUT full metadata replacement) ───────────────────────

/**
 * Saves SKOS fields on an archived item.
 * Fetches current full metadata first, merges the edited SKOS fields in,
 * then PUT the entire metadata object back.
 */
async function saveArchivedItem(
  itemUuid: string,
  newSkosFields: Metadata,
  skosFieldNames: string[],
): Promise<void> {
  // Fetch current full metadata
  const current = await apiFetch<any>(`/api/core/items/${itemUuid}`);
  const currentMeta: Metadata = current?.metadata ?? {};

  // Build merged metadata: keep all non-SKOS fields, replace SKOS fields
  const skosSet = new Set(skosFieldNames);
  const merged: Metadata = {};

  // Keep existing non-SKOS fields
  for (const [field, vals] of Object.entries(currentMeta)) {
    if (!skosSet.has(field)) {
      merged[field] = vals;
    }
  }

  // Inject new SKOS fields (only non-empty)
  for (const field of skosFieldNames) {
    const vals = newSkosFields[field];
    if (vals?.length) {
      merged[field] = vals;
    }
  }

  await apiFetch<any>(`/api/core/items/${itemUuid}/metadata`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(merged),
  });
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function saveConceptScheme(
  target: { kind: "workspace"; wsId: number } | { kind: "item"; uuid: string },
  values: ConceptSchemeValues,
): Promise<void> {
  const meta = buildConceptSchemeMeta(values);
  if (target.kind === "workspace") {
    await saveWorkspaceItem(target.wsId, meta, CONCEPT_SCHEME_FIELDS, "ConceptScheme");
  } else {
    await saveArchivedItem(target.uuid, meta, CONCEPT_SCHEME_FIELDS);
  }
}

export async function saveConcept(
  target: { kind: "workspace"; wsId: number } | { kind: "item"; uuid: string },
  values: ConceptValues,
): Promise<void> {
  const meta = buildConceptMeta(values);
  if (target.kind === "workspace") {
    await saveWorkspaceItem(target.wsId, meta, CONCEPT_FIELDS, "Concept");
  } else {
    await saveArchivedItem(target.uuid, meta, CONCEPT_FIELDS);
  }
}
