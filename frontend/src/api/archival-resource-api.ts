/**
 * archival-resource-api.ts
 *
 * DSpace workspace-item + archived-item CRUD for ArchivalResource entities.
 *
 * Submission form sections (mapped from the ara.* schema design):
 *   archivalresource_identity   → ISAD(G) 3.1 + item-type classifier
 *   archivalresource_context    → ISAD(G) 3.2
 *   archivalresource_content    → ISAD(G) 3.3
 *   archivalresource_conditions → ISAD(G) 3.4
 *   archivalresource_allied     → ISAD(G) 3.5
 *   archivalresource_notes      → ISAD(G) 3.6–3.7
 *
 * Save strategies:
 *   Workspace item → PATCH /api/submission/workspaceitems/{id}  (JSON Patch add)
 *   Archived item  → PUT  /api/core/items/{uuid}/metadata       (full replace)
 */

import { apiFetch } from "../auth/client";
import { resolveCollectionId } from "../config/collection-mapping";
import type { Metadata, MetaValue } from "../api/dspace";

// ── Value types ───────────────────────────────────────────────────────────────

export interface ArchivalResourceValues {
  // ── Identity (archivalresource_identity section) ──────────────────────────
  title: string;                // dc.title — mandatory
  level: string;                // ara.isad.level
  referenceCode: string;        // ara.isad.referenceCode
  dates: string;                // ara.isad.dates
  extentAndMedium: string;      // ara.isad.extentAndMedium
  parentId: string;             // mdwrepo.archivalresource.parent (UUID)
  repository: string;           // ara.item.repository
  itemType: string;             // ara.item.type (vocabulary label)
  itemTypeNodeId: string;       // ara.type.nodeId

  // ── Context (archivalresource_context section) ────────────────────────────
  adminBioHistory: string;      // ara.context.adminBiographicalHistory
  archivalHistory: string;      // ara.context.archivalHistory
  sourceOfAcquisition: string;  // ara.context.immediateSourceOfAcquisition

  // ── Content & structure (archivalresource_content section) ────────────────
  scopeAndContent: string;      // ara.content.scopeAndContent
  appraisal: string;            // ara.content.appraisalDestructionScheduling
  accruals: string;             // ara.content.accruals
  systemOfArrangement: string;  // ara.content.systemOfArrangement

  // ── Conditions (archivalresource_conditions section) ──────────────────────
  accessRestrictions: string;   // ara.conditions.accessRestrictions
  conditionsOfReproduction: string; // ara.conditions.conditionsOfReproduction
  languageScripts: string;      // ara.conditions.languageScripts
  physicalCharacteristics: string;  // ara.conditions.physicalCharacteristics
  findingAids: string;          // ara.conditions.findingAids

  // ── Allied materials (archivalresource_allied section) ────────────────────
  locationOfOriginals: string;  // ara.allied.locationOfOriginals
  locationOfCopies: string;     // ara.allied.locationOfCopies
  relatedUnits: string;         // ara.allied.relatedUnitsOfDescription
  publicationNote: string;      // ara.allied.publicationNote

  // ── Notes & description control (archivalresource_notes section) ──────────
  generalNotes: string;         // ara.notes.general
  archivistsNote: string;       // ara.notes.archivistsNote
  rulesConventions: string;     // ara.notes.rulesConventions
  dateOfDescription: string;    // ara.notes.dateOfDescription
  descriptionIdentifier: string;// ara.notes.descriptionIdentifier
  descriptionLanguage: string;  // ara.notes.descriptionLanguage
}

export function defaultArchivalResourceValues(): ArchivalResourceValues {
  return {
    title: "",
    level: "item",
    referenceCode: "",
    dates: "",
    extentAndMedium: "",
    parentId: "",
    repository: "",
    itemType: "",
    itemTypeNodeId: "",
    adminBioHistory: "",
    archivalHistory: "",
    sourceOfAcquisition: "",
    scopeAndContent: "",
    appraisal: "",
    accruals: "",
    systemOfArrangement: "",
    accessRestrictions: "",
    conditionsOfReproduction: "",
    languageScripts: "",
    physicalCharacteristics: "",
    findingAids: "",
    locationOfOriginals: "",
    locationOfCopies: "",
    relatedUnits: "",
    publicationNote: "",
    generalNotes: "",
    archivistsNote: "",
    rulesConventions: "ISAD(G)",
    dateOfDescription: "",
    descriptionIdentifier: "",
    descriptionLanguage: "",
  };
}

// ── Read: extract values from flat DSpace metadata ────────────────────────────

function first(meta: Metadata, field: string): string {
  return meta[field]?.[0]?.value ?? "";
}

export function readArchivalResourceValues(meta: Metadata): ArchivalResourceValues {
  return {
    title:                    first(meta, "dc.title"),
    level:                    first(meta, "ara.isad.level"),
    referenceCode:            first(meta, "ara.isad.referenceCode"),
    dates:                    first(meta, "ara.isad.dates"),
    extentAndMedium:          first(meta, "ara.isad.extentAndMedium"),
    parentId:                 first(meta, "mdwrepo.archivalresource.parent"),
    repository:               first(meta, "ara.item.repository"),
    itemType:                 first(meta, "ara.item.type"),
    itemTypeNodeId:           first(meta, "ara.type.nodeId"),
    adminBioHistory:          first(meta, "ara.context.adminBiographicalHistory"),
    archivalHistory:          first(meta, "ara.context.archivalHistory"),
    sourceOfAcquisition:      first(meta, "ara.context.immediateSourceOfAcquisition"),
    scopeAndContent:          first(meta, "ara.content.scopeAndContent"),
    appraisal:                first(meta, "ara.content.appraisalDestructionScheduling"),
    accruals:                 first(meta, "ara.content.accruals"),
    systemOfArrangement:      first(meta, "ara.content.systemOfArrangement"),
    accessRestrictions:       first(meta, "ara.conditions.accessRestrictions"),
    conditionsOfReproduction: first(meta, "ara.conditions.conditionsOfReproduction"),
    languageScripts:          first(meta, "ara.conditions.languageScripts"),
    physicalCharacteristics:  first(meta, "ara.conditions.physicalCharacteristics"),
    findingAids:              first(meta, "ara.conditions.findingAids"),
    locationOfOriginals:      first(meta, "ara.allied.locationOfOriginals"),
    locationOfCopies:         first(meta, "ara.allied.locationOfCopies"),
    relatedUnits:             first(meta, "ara.allied.relatedUnitsOfDescription"),
    publicationNote:          first(meta, "ara.allied.publicationNote"),
    generalNotes:             first(meta, "ara.notes.general"),
    archivistsNote:           first(meta, "ara.notes.archivistsNote"),
    rulesConventions:         first(meta, "ara.notes.rulesConventions") || "ISAD(G)",
    dateOfDescription:        first(meta, "ara.notes.dateOfDescription"),
    descriptionIdentifier:    first(meta, "ara.notes.descriptionIdentifier"),
    descriptionLanguage:      first(meta, "ara.notes.descriptionLanguage"),
  };
}

// ── Read from workspace-item sections object ──────────────────────────────────

export function readArchivalResourceFromSections(
  sections: Record<string, any>,
): ArchivalResourceValues {
  // Merge all section metadata into one flat object then re-use readArchivalResourceValues
  const merged: Metadata = {};
  for (const sectionData of Object.values(sections)) {
    if (!sectionData || typeof sectionData !== "object" || Array.isArray(sectionData)) continue;
    for (const [field, vals] of Object.entries(sectionData as Record<string, any>)) {
      if (!Array.isArray(vals)) continue;
      merged[field] = vals as MetaValue[];
    }
  }
  return readArchivalResourceValues(merged);
}

// ── Op builder helpers ────────────────────────────────────────────────────────

type Op = { op: string; path: string; value?: any };

function mv(value: string): MetaValue {
  return { value, language: null, authority: null, confidence: -1, place: 0 };
}

function addOp(
  ops: Op[],
  section: string,
  field: string,
  raw: string,
): void {
  const v = raw.trim();
  if (!v) return;
  ops.push({ op: "add", path: `/sections/${section}/${field}`, value: [mv(v)] });
}

function buildOps(values: ArchivalResourceValues): Op[] {
  const ops: Op[] = [];
  const add = (section: string, field: string, raw: string) =>
    addOp(ops, section, field, raw);

  // Identity section
  add("archivalresource_identity", "dc.title",                     values.title);
  add("archivalresource_identity", "ara.isad.level",               values.level);
  add("archivalresource_identity", "ara.isad.referenceCode",        values.referenceCode);
  add("archivalresource_identity", "ara.isad.dates",               values.dates);
  add("archivalresource_identity", "ara.isad.extentAndMedium",     values.extentAndMedium);
  add("archivalresource_identity", "ara.item.repository",          values.repository);
  add("archivalresource_identity", "ara.item.type",                values.itemType);
  add("archivalresource_identity", "ara.type.nodeId",              values.itemTypeNodeId);
  add("archivalresource_identity", "mdwrepo.archivalresource.parent", values.parentId);

  // Context section
  add("archivalresource_context",  "ara.context.adminBiographicalHistory",    values.adminBioHistory);
  add("archivalresource_context",  "ara.context.archivalHistory",             values.archivalHistory);
  add("archivalresource_context",  "ara.context.immediateSourceOfAcquisition",values.sourceOfAcquisition);

  // Content section
  add("archivalresource_content",  "ara.content.scopeAndContent",              values.scopeAndContent);
  add("archivalresource_content",  "ara.content.appraisalDestructionScheduling",values.appraisal);
  add("archivalresource_content",  "ara.content.accruals",                    values.accruals);
  add("archivalresource_content",  "ara.content.systemOfArrangement",         values.systemOfArrangement);

  // Conditions section
  add("archivalresource_conditions","ara.conditions.accessRestrictions",       values.accessRestrictions);
  add("archivalresource_conditions","ara.conditions.conditionsOfReproduction", values.conditionsOfReproduction);
  add("archivalresource_conditions","ara.conditions.languageScripts",          values.languageScripts);
  add("archivalresource_conditions","ara.conditions.physicalCharacteristics",  values.physicalCharacteristics);
  add("archivalresource_conditions","ara.conditions.findingAids",              values.findingAids);

  // Allied section
  add("archivalresource_allied",   "ara.allied.locationOfOriginals",          values.locationOfOriginals);
  add("archivalresource_allied",   "ara.allied.locationOfCopies",             values.locationOfCopies);
  add("archivalresource_allied",   "ara.allied.relatedUnitsOfDescription",    values.relatedUnits);
  add("archivalresource_allied",   "ara.allied.publicationNote",              values.publicationNote);

  // Notes section
  add("archivalresource_notes",    "ara.notes.general",                       values.generalNotes);
  add("archivalresource_notes",    "ara.notes.archivistsNote",                values.archivistsNote);
  add("archivalresource_notes",    "ara.notes.rulesConventions",              values.rulesConventions);
  add("archivalresource_notes",    "ara.notes.dateOfDescription",             values.dateOfDescription);
  add("archivalresource_notes",    "ara.notes.descriptionIdentifier",         values.descriptionIdentifier);
  add("archivalresource_notes",    "ara.notes.descriptionLanguage",           values.descriptionLanguage);

  return ops;
}

// ── Create workspace item ─────────────────────────────────────────────────────

export async function createArchivalResourceWorkspaceItem(
  values: ArchivalResourceValues,
): Promise<number> {
  const collectionId = await resolveCollectionId("ArchivalResource");

  const created = await apiFetch<any>(
    `/api/submission/workspaceitems?owningCollection=${encodeURIComponent(collectionId)}`,
    { method: "POST", headers: { "Content-Type": "application/json" } },
  );

  const newId: number = created?.id;
  if (!newId) throw new Error("ArchivalResource workspace item creation failed.");

  const ops = buildOps(values);
  if (ops.length > 0) {
    await apiFetch<any>(`/api/submission/workspaceitems/${newId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ops),
    });
  }

  return newId;
}

// ── Save: workspace item (PATCH) ──────────────────────────────────────────────

export async function saveArchivalResourceToWorkspace(
  wsId: number,
  values: ArchivalResourceValues,
): Promise<void> {
  const ops = buildOps(values);
  if (!ops.length) return;
  await apiFetch<any>(`/api/submission/workspaceitems/${wsId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ops),
  });
}

// ── Save: archived item (PUT full metadata) ───────────────────────────────────

const ARA_FIELDS = [
  "dc.title",
  "ara.isad.level", "ara.isad.referenceCode", "ara.isad.dates", "ara.isad.extentAndMedium",
  "ara.item.repository", "ara.item.type", "ara.type.nodeId",
  "mdwrepo.archivalresource.parent",
  "ara.context.adminBiographicalHistory", "ara.context.archivalHistory",
  "ara.context.immediateSourceOfAcquisition",
  "ara.content.scopeAndContent", "ara.content.appraisalDestructionScheduling",
  "ara.content.accruals", "ara.content.systemOfArrangement",
  "ara.conditions.accessRestrictions", "ara.conditions.conditionsOfReproduction",
  "ara.conditions.languageScripts", "ara.conditions.physicalCharacteristics",
  "ara.conditions.findingAids",
  "ara.allied.locationOfOriginals", "ara.allied.locationOfCopies",
  "ara.allied.relatedUnitsOfDescription", "ara.allied.publicationNote",
  "ara.notes.general", "ara.notes.archivistsNote", "ara.notes.rulesConventions",
  "ara.notes.dateOfDescription", "ara.notes.descriptionIdentifier",
  "ara.notes.descriptionLanguage",
];

function buildFlatMeta(values: ArchivalResourceValues): Metadata {
  const meta: Metadata = {};
  const set = (field: string, raw: string) => {
    const v = raw.trim();
    if (v) meta[field] = [mv(v)];
  };

  set("dc.title",                                   values.title);
  set("ara.isad.level",                             values.level);
  set("ara.isad.referenceCode",                      values.referenceCode);
  set("ara.isad.dates",                             values.dates);
  set("ara.isad.extentAndMedium",                   values.extentAndMedium);
  set("ara.item.repository",                        values.repository);
  set("ara.item.type",                              values.itemType);
  set("ara.type.nodeId",                            values.itemTypeNodeId);
  set("mdwrepo.archivalresource.parent",             values.parentId);
  set("ara.context.adminBiographicalHistory",        values.adminBioHistory);
  set("ara.context.archivalHistory",                values.archivalHistory);
  set("ara.context.immediateSourceOfAcquisition",   values.sourceOfAcquisition);
  set("ara.content.scopeAndContent",                values.scopeAndContent);
  set("ara.content.appraisalDestructionScheduling", values.appraisal);
  set("ara.content.accruals",                       values.accruals);
  set("ara.content.systemOfArrangement",            values.systemOfArrangement);
  set("ara.conditions.accessRestrictions",           values.accessRestrictions);
  set("ara.conditions.conditionsOfReproduction",    values.conditionsOfReproduction);
  set("ara.conditions.languageScripts",             values.languageScripts);
  set("ara.conditions.physicalCharacteristics",     values.physicalCharacteristics);
  set("ara.conditions.findingAids",                 values.findingAids);
  set("ara.allied.locationOfOriginals",             values.locationOfOriginals);
  set("ara.allied.locationOfCopies",                values.locationOfCopies);
  set("ara.allied.relatedUnitsOfDescription",       values.relatedUnits);
  set("ara.allied.publicationNote",                 values.publicationNote);
  set("ara.notes.general",                          values.generalNotes);
  set("ara.notes.archivistsNote",                   values.archivistsNote);
  set("ara.notes.rulesConventions",                 values.rulesConventions);
  set("ara.notes.dateOfDescription",                values.dateOfDescription);
  set("ara.notes.descriptionIdentifier",            values.descriptionIdentifier);
  set("ara.notes.descriptionLanguage",              values.descriptionLanguage);

  return meta;
}

export async function saveArchivalResourceToItem(
  itemUuid: string,
  values: ArchivalResourceValues,
): Promise<void> {
  // Fetch current metadata, keep non-ARA fields, replace ARA fields
  const current = await apiFetch<any>(`/api/core/items/${itemUuid}`);
  const currentMeta: Metadata = current?.metadata ?? {};
  const araSet = new Set(ARA_FIELDS);
  const merged: Metadata = {};

  for (const [field, vals] of Object.entries(currentMeta)) {
    if (!araSet.has(field)) merged[field] = vals;
  }
  for (const [field, vals] of Object.entries(buildFlatMeta(values))) {
    if (vals.length) merged[field] = vals;
  }

  await apiFetch<any>(`/api/core/items/${itemUuid}/metadata`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(merged),
  });
}

// ── Delete archived item ──────────────────────────────────────────────────────

export async function deleteArchivalResourceItem(itemUuid: string): Promise<void> {
  await apiFetch<void>(`/api/core/items/${itemUuid}`, { method: "DELETE" });
}

// ── Delete workspace item ─────────────────────────────────────────────────────

export async function deleteArchivalResourceWorkspaceItem(wsId: number): Promise<void> {
  await apiFetch<void>(`/api/submission/workspaceitems/${wsId}`, { method: "DELETE" });
}
