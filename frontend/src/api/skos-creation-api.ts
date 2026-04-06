/**
 * skos-creation-api.ts
 *
 * DSpace workspace-item creation for SKOS ConceptScheme and Concept entities.
 *
 * Submission form sections used:
 *   ConceptScheme  → section "conceptscheme"
 *   Concept core   → section "concept"
 *   Concept docs   → section "concept_documentation"
 *   Concept rels   → section "concept_semantic_relations"
 *   Concept maps   → section "concept_mappings"
 *   Concept notes  → section "concept_notations"
 */

import { apiFetch } from "../auth/client";
import { resolveCollectionId } from "../config/collection-mapping";

// ── Types ─────────────────────────────────────────────────────────────────────

export type AuthorityRef = { id: string; label: string };

/** A plain text value, optionally with a language tag. */
export type LangValue = { value: string; language?: string };

export interface ConceptSchemeValues {
  // conceptscheme section
  title: string;               // dc.title — mandatory
  description: string;         // dc.description — mandatory
  creator: string;             // dc.creator — optional, authority: CustomPersonAuthority
  contributors: string[];      // dc.contributor — repeatable
  subjects: string[];          // dc.subject — repeatable
  publisher: string;           // dc.publisher — authority: OrgUnitAuthority
  dateIssued: string;          // dc.date.issued — date
  hasTopConcepts: string[];    // skos.hasTopConcept — repeatable, authority: ConceptAuthority
  notations: string[];         // skos.notation — repeatable
}

export interface ConceptValues {
  // concept section
  title: string;               // dc.title — mandatory
  inScheme: string;            // skos.inScheme — authority: ConceptSchemeAuthority
  topConceptOf: string;        // skos.topConceptOf — authority: ConceptSchemeAuthority

  // Labels (concept section, inline-group repeatable: value + language)
  prefLabels: LangValue[];     // skos.prefLabel + skos.prefLabel.language
  altLabels: LangValue[];      // skos.altLabel + skos.altLabel.language
  hiddenLabels: LangValue[];   // skos.hiddenLabel + skos.hiddenLabel.language

  // concept_documentation section (all inline-group repeatable: value + language)
  definitions: LangValue[];    // skos.definition
  scopeNotes: LangValue[];     // skos.scopeNote
  examples: LangValue[];       // skos.example
  changeNotes: LangValue[];    // skos.changeNote
  editorialNotes: LangValue[]; // skos.editorialNote
  historyNotes: LangValue[];   // skos.historyNote
  notes: LangValue[];          // skos.note

  // concept_semantic_relations section (repeatable authority refs)
  broader: string[];           // skos.broader — authority: ConceptAuthority
  narrower: string[];          // skos.narrower — authority: ConceptAuthority
  related: string[];           // skos.related — authority: ConceptAuthority
  broaderTransitive: string[]; // skos.broaderTransitive — authority: ConceptAuthority
  narrowerTransitive: string[];// skos.narrowerTransitive — authority: ConceptAuthority

  // concept_mappings section (repeatable authority refs)
  exactMatch: string[];        // skos.exactMatch
  closeMatch: string[];        // skos.closeMatch
  broadMatch: string[];        // skos.broadMatch
  narrowMatch: string[];       // skos.narrowMatch
  relatedMatch: string[];      // skos.relatedMatch

  // concept_notations section
  notations: string[];         // skos.notation — repeatable
}

// ── Default values ────────────────────────────────────────────────────────────

export function defaultConceptSchemeValues(): ConceptSchemeValues {
  return {
    title: "",
    description: "",
    creator: "",
    contributors: [],
    subjects: [],
    publisher: "",
    dateIssued: "",
    hasTopConcepts: [],
    notations: [],
  };
}

export function defaultConceptValues(): ConceptValues {
  return {
    title: "",
    inScheme: "",
    topConceptOf: "",
    prefLabels: [],
    altLabels: [],
    hiddenLabels: [],
    definitions: [],
    scopeNotes: [],
    examples: [],
    changeNotes: [],
    editorialNotes: [],
    historyNotes: [],
    notes: [],
    broader: [],
    narrower: [],
    related: [],
    broaderTransitive: [],
    narrowerTransitive: [],
    exactMatch: [],
    closeMatch: [],
    broadMatch: [],
    narrowMatch: [],
    relatedMatch: [],
    notations: [],
  };
}

// ── Op helpers ────────────────────────────────────────────────────────────────

type Op = { op: string; path: string; value: any };

function makeMeta(value: string, authority?: string | null, language?: string | null) {
  return {
    value,
    language: language ?? null,
    authority: authority ?? null,
    confidence: authority ? 600 : -1,
    place: 0,
  };
}

/** Append a single-value field if non-empty. */
function addSingle(
  ops: Op[],
  section: string,
  field: string,
  raw: string,
  authority?: string | null,
) {
  const v = raw.trim();
  if (!v) return;
  ops.push({
    op: "add",
    path: `/sections/${section}/${field}`,
    value: [makeMeta(v, authority)],
  });
}

/** Append a repeatable plain-text field (array of strings). */
function addRepeatable(ops: Op[], section: string, field: string, values: string[]) {
  const trimmed = values.map((v) => v.trim()).filter(Boolean);
  if (!trimmed.length) return;
  ops.push({
    op: "add",
    path: `/sections/${section}/${field}`,
    value: trimmed.map((v, i) => ({ ...makeMeta(v), place: i })),
  });
}

/**
 * Append a repeatable inline-group field (value + optional language).
 * DSpace represents the language as a separate metadata field ending in ".language".
 * We emit both as parallel arrays of the same length so they stay in sync.
 */
function addLangRepeatable(
  ops: Op[],
  section: string,
  field: string,
  langField: string,
  values: LangValue[],
) {
  const clean = values.filter((v) => v.value.trim());
  if (!clean.length) return;

  ops.push({
    op: "add",
    path: `/sections/${section}/${field}`,
    value: clean.map((v, i) => ({ ...makeMeta(v.value.trim()), place: i })),
  });

  const withLang = clean.filter((v) => v.language?.trim());
  if (withLang.length) {
    // Only emit language entries where a language was actually set
    const langValues = clean.map((v, i) => ({
      ...makeMeta(v.language?.trim() ?? ""),
      place: i,
    })).filter((_, i) => clean[i].language?.trim());
    if (langValues.length) {
      ops.push({
        op: "add",
        path: `/sections/${section}/${langField}`,
        value: langValues,
      });
    }
  }
}

// ── ConceptScheme creation ────────────────────────────────────────────────────

export async function createConceptSchemeWorkspaceItem(
  values: ConceptSchemeValues,
): Promise<number> {
  const collectionId = await resolveCollectionId("ConceptScheme");

  const created = await apiFetch<any>(
    `/api/submission/workspaceitems?owningCollection=${encodeURIComponent(collectionId)}`,
    { method: "POST", headers: { "Content-Type": "application/json" } },
  );
  const newId: number = created?.id;
  if (!newId) throw new Error("ConceptScheme workspace item creation failed.");

  const ops: Op[] = [];

  addSingle(ops, "conceptscheme", "dc.title", values.title);
  addSingle(ops, "conceptscheme", "dc.description", values.description);
  addSingle(ops, "conceptscheme", "dc.creator", values.creator);
  addRepeatable(ops, "conceptscheme", "dc.contributor", values.contributors);
  addRepeatable(ops, "conceptscheme", "dc.subject", values.subjects);
  addSingle(ops, "conceptscheme", "dc.publisher", values.publisher);
  addSingle(ops, "conceptscheme", "dc.date.issued", values.dateIssued);
  addRepeatable(ops, "conceptscheme", "skos.hasTopConcept", values.hasTopConcepts);
  addRepeatable(ops, "conceptscheme", "skos.notation", values.notations);

  if (ops.length > 0) {
    await apiFetch<any>(`/api/submission/workspaceitems/${newId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ops),
    });
  }

  return newId;
}

// ── Concept creation ──────────────────────────────────────────────────────────

export async function createConceptWorkspaceItem(
  values: ConceptValues,
): Promise<number> {
  const collectionId = await resolveCollectionId("Concept");

  const created = await apiFetch<any>(
    `/api/submission/workspaceitems?owningCollection=${encodeURIComponent(collectionId)}`,
    { method: "POST", headers: { "Content-Type": "application/json" } },
  );
  const newId: number = created?.id;
  if (!newId) throw new Error("Concept workspace item creation failed.");

  const ops: Op[] = [];

  // concept section
  addSingle(ops, "concept", "dc.title", values.title);
  addSingle(ops, "concept", "skos.inScheme", values.inScheme);
  addSingle(ops, "concept", "skos.topConceptOf", values.topConceptOf);

  addLangRepeatable(ops, "concept", "skos.prefLabel", "skos.prefLabel.language", values.prefLabels);
  addLangRepeatable(ops, "concept", "skos.altLabel", "skos.altLabel.language", values.altLabels);
  addLangRepeatable(ops, "concept", "skos.hiddenLabel", "skos.hiddenLabel.language", values.hiddenLabels);

  // concept_documentation section
  addLangRepeatable(ops, "concept_documentation", "skos.definition", "skos.definition.language", values.definitions);
  addLangRepeatable(ops, "concept_documentation", "skos.scopeNote", "skos.scopeNote.language", values.scopeNotes);
  addLangRepeatable(ops, "concept_documentation", "skos.example", "skos.example.language", values.examples);
  addLangRepeatable(ops, "concept_documentation", "skos.changeNote", "skos.changeNote.language", values.changeNotes);
  addLangRepeatable(ops, "concept_documentation", "skos.editorialNote", "skos.editorialNote.language", values.editorialNotes);
  addLangRepeatable(ops, "concept_documentation", "skos.historyNote", "skos.historyNote.language", values.historyNotes);
  addLangRepeatable(ops, "concept_documentation", "skos.note", "skos.note.language", values.notes);

  // concept_semantic_relations section
  addRepeatable(ops, "concept_semantic_relations", "skos.broader", values.broader);
  addRepeatable(ops, "concept_semantic_relations", "skos.narrower", values.narrower);
  addRepeatable(ops, "concept_semantic_relations", "skos.related", values.related);
  addRepeatable(ops, "concept_semantic_relations", "skos.broaderTransitive", values.broaderTransitive);
  addRepeatable(ops, "concept_semantic_relations", "skos.narrowerTransitive", values.narrowerTransitive);

  // concept_mappings section
  addRepeatable(ops, "concept_mappings", "skos.exactMatch", values.exactMatch);
  addRepeatable(ops, "concept_mappings", "skos.closeMatch", values.closeMatch);
  addRepeatable(ops, "concept_mappings", "skos.broadMatch", values.broadMatch);
  addRepeatable(ops, "concept_mappings", "skos.narrowMatch", values.narrowMatch);
  addRepeatable(ops, "concept_mappings", "skos.relatedMatch", values.relatedMatch);

  // concept_notations section
  addRepeatable(ops, "concept_notations", "skos.notation", values.notations);

  if (ops.length > 0) {
    await apiFetch<any>(`/api/submission/workspaceitems/${newId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ops),
    });
  }

  return newId;
}

// ── Authority searches ────────────────────────────────────────────────────────

async function discoverSearch(
  entityType: string,
  query: string,
): Promise<Array<{ id: string; label: string; entityType: string }>> {
  const params = new URLSearchParams({
    query: query.trim() || "*",
    page: "0",
    size: "8",
    sort: "score,DESC",
  });
  params.append("f.entityType", `${entityType},equals`);
  const data = await apiFetch<any>(`/api/discover/search/objects?${params}`);
  const objects: any[] = data?._embedded?.searchResult?._embedded?.objects ?? [];
  return objects
    .map((row) => row?._embedded?.indexableObject)
    .filter(Boolean)
    .map((item: any) => ({
      id: item.uuid ?? item.id,
      label: item.name ?? item.metadata?.["dc.title"]?.[0]?.value ?? item.id,
      entityType,
    }));
}

export const searchConceptSchemes = (q: string) => discoverSearch("ConceptScheme", q);
export const searchConcepts = (q: string) => discoverSearch("Concept", q);
