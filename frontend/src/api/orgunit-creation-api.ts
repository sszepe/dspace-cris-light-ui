/**
 * orgunit-creation-api.ts
 *
 * DSpace workspace-item creation for OrgUnit (dspace.entity.type = OrgUnit).
 *
 * Submission sections used (matches the input-forms.xml shown in the prompt):
 *   orgunit_type           → dc.type (controlled vocabulary: orgunit_types)
 *   orgunit_mdwrepodspace  → mdwrepo.orgunit.hasTopOrgUnit, mdwrepo.orgunit.mdwInternal
 *   describe               → all remaining fields (organization.*, orgunit.*, dc.*, mdwrepo.*)
 *
 * Metadata field mapping (DSpace field → UI concept):
 *   dc.title                         display name / primary name
 *   dc.type                          org type (orgunit_types vocabulary)
 *   dc.description                   description
 *   dc.language.iso                  language
 *   oairecerif.acronym               acronym
 *   organization.legalName           official legal name
 *   organization.foundingDate        founding year
 *   organization.endDate             end / dissolution date
 *   organization.address.addressLocality   city
 *   organization.address.addressCountry    country ISO code
 *   organization.url                 primary website
 *   organization.alternateName       alternate names (repeatable)
 *   organization.identifier.ror      full ROR URI
 *   organization.identifier.isni     ISNI
 *   organization.identifier.rin      Ringgold
 *   organization.identifier.lei      LEI
 *   organization.identifier.crossrefid Crossref Funder
 *   mdwrepo.identifier.grid          GRID
 *   mdwrepo.identifier.wikidata      Wikidata QID
 *   mdwrepo.identifier.gnd           GND identifier
 *   mdwrepo.identifier.viaf          VIAF
 *   mdwrepo.orgunit.hasTopOrgUnit    parent OrgUnit (authority-controlled)
 *   mdwrepo.orgunit.mdwInternal      internal mdwOnline ID
 *   mdwrepo.isActive                 active flag
 *   orgunit.identifier.name          orgunit name identifier
 *   orgunit.identifier.id            orgunit numeric id
 *   orgunit.identifier.city          orgunit city
 *   orgunit.identifier.country       orgunit country
 *   orgunit.identifier.description   orgunit description (orgunit schema)
 *   mdwonline.orgTypeNr              mdwOnline org type number
 *   mdwonline.kennung                mdwOnline Kennung
 */

import { apiFetch } from "../auth/client";
import { resolveCollectionId } from "../config/collection-mapping";
import type { OrgUnitImportPayload } from "./orgunit-import-api";

// ── Value types ───────────────────────────────────────────────────────────────

export interface OrgUnitCreationValues {
  // ── Core identity ─────────────────────────────────────────────────────────
  title:        string;     // dc.title — mandatory
  dcType:       string;     // dc.type (orgunit_types vocabulary)
  acronym:      string;     // oairecerif.acronym
  legalName:    string;     // organization.legalName
  description:  string;     // dc.description
  language:     string;     // dc.language.iso

  // ── Dates ─────────────────────────────────────────────────────────────────
  foundingDate: string;     // organization.foundingDate
  endDate:      string;     // organization.endDate

  // ── Location ──────────────────────────────────────────────────────────────
  addressLocality:  string; // organization.address.addressLocality
  addressCountry:   string; // organization.address.addressCountry
  url:              string; // organization.url

  // ── Alternate names ───────────────────────────────────────────────────────
  alternateNames:   string[];  // organization.alternateName (repeatable)

  // ── Identifiers ───────────────────────────────────────────────────────────
  ror:       string;  // organization.identifier.ror
  isni:      string;  // organization.identifier.isni
  ringgold:  string;  // organization.identifier.rin
  lei:       string;  // organization.identifier.lei
  crossrefId:string;  // organization.identifier.crossrefid
  grid:      string;  // mdwrepo.identifier.grid
  wikidataId:string;  // mdwrepo.identifier.wikidata
  gnd:       string;  // mdwrepo.identifier.gnd
  viaf:      string;  // mdwrepo.identifier.viaf
  orcid:     string;  // dc.identifier.orcid (optional)

  // ── mdwrepo / mdwonline ───────────────────────────────────────────────────
  hasTopOrgUnit: string;   // mdwrepo.orgunit.hasTopOrgUnit
  mdwInternal:   string;   // mdwrepo.orgunit.mdwInternal
  isActive:      string;   // mdwrepo.isActive ("true" / "false")
  mdwOrgTypeNr:  string;   // mdwonline.orgTypeNr
  mdwKennung:    string;   // mdwonline.kennung
}

export function defaultOrgUnitValues(): OrgUnitCreationValues {
  return {
    title: "", dcType: "", acronym: "", legalName: "", description: "", language: "",
    foundingDate: "", endDate: "",
    addressLocality: "", addressCountry: "", url: "",
    alternateNames: [],
    ror: "", isni: "", ringgold: "", lei: "", crossrefId: "", grid: "",
    wikidataId: "", gnd: "", viaf: "", orcid: "",
    hasTopOrgUnit: "", mdwInternal: "", isActive: "true",
    mdwOrgTypeNr: "", mdwKennung: "",
  };
}

// ── Map import payload → creation values ─────────────────────────────────────

export function importPayloadToValues(
  p: OrgUnitImportPayload,
): OrgUnitCreationValues {
  return {
    title:           p.title,
    dcType:          p.dcType,
    acronym:         p.acronym,
    legalName:       p.legalName,
    description:     p.description,
    language:        p.language,
    foundingDate:    p.foundingDate,
    endDate:         p.endDate,
    addressLocality: p.addressLocality,
    addressCountry:  p.addressCountry,
    url:             p.url,
    alternateNames:  p.organizationAlternateNames.filter(Boolean),
    ror:             p.ror,
    isni:            p.isni,
    ringgold:        p.ringgold,
    lei:             p.lei,
    crossrefId:      p.crossrefId,
    grid:            p.grid,
    wikidataId:      p.wikidataId,
    gnd:             p.gnd,
    viaf:            p.viaf,
    orcid:           p.orcid,
    hasTopOrgUnit:   p.hasTopOrgUnit,
    mdwInternal:     p.mdwInternal,
    isActive:        p.rorStatus === "inactive" ? "false" : "true",
    mdwOrgTypeNr:    "",
    mdwKennung:      "",
  };
}

// ── API helpers ───────────────────────────────────────────────────────────────

type Op = { op: string; path: string; value: any };

function mv(value: string, authority?: string | null) {
  return {
    value,
    language: null,
    authority: authority ?? null,
    confidence: authority ? 600 : -1,
    place: 0,
  };
}

function addOp(ops: Op[], section: string, field: string, raw?: string | null) {
  const v = (raw ?? "").trim();
  if (!v) return;
  ops.push({ op: "add", path: `/sections/${section}/${field}`, value: [mv(v)] });
}

function addRepeatableOp(ops: Op[], section: string, field: string, values: string[]) {
  const filtered = values.map((v) => v.trim()).filter(Boolean);
  if (!filtered.length) return;
  ops.push({
    op: "add",
    path: `/sections/${section}/${field}`,
    value: filtered.map((v, i) => ({ ...mv(v), place: i })),
  });
}

// ── Create workspace item ─────────────────────────────────────────────────────

export async function createOrgUnitWorkspaceItem(
  values: OrgUnitCreationValues,
): Promise<number> {
  const collectionId = await resolveCollectionId("OrgUnit");

  const created = await apiFetch<any>(
    `/api/submission/workspaceitems?owningCollection=${encodeURIComponent(collectionId)}`,
    { method: "POST", headers: { "Content-Type": "application/json" } },
  );
  const wsId: number = created?.id;
  if (!wsId) throw new Error("OrgUnit workspace item creation failed.");

  const ops: Op[] = [];

  // ── orgunit_type section ──────────────────────────────────────────────────
  addOp(ops, "orgunit_type", "dc.type", values.dcType);

  // ── orgunit_mdwrepodspace section ─────────────────────────────────────────
  addOp(ops, "orgunit_mdwrepodspace", "mdwrepo.orgunit.hasTopOrgUnit", values.hasTopOrgUnit);
  addOp(ops, "orgunit_mdwrepodspace", "mdwrepo.orgunit.mdwInternal",    values.mdwInternal);

  // ── describe section — main fields ───────────────────────────────────────
  const d = "describe";
  addOp(ops, d, "dc.title",                             values.title);
  addOp(ops, d, "oairecerif.acronym",                   values.acronym);
  addOp(ops, d, "organization.legalName",               values.legalName);
  addOp(ops, d, "dc.description",                       values.description);
  addOp(ops, d, "dc.language.iso",                      values.language);
  addOp(ops, d, "organization.foundingDate",             values.foundingDate);
  addOp(ops, d, "organization.endDate",                 values.endDate);
  addOp(ops, d, "organization.address.addressLocality", values.addressLocality);
  addOp(ops, d, "organization.address.addressCountry",  values.addressCountry);
  addOp(ops, d, "organization.url",                     values.url);
  addOp(ops, d, "mdwrepo.isActive",                     values.isActive);

  // Repeatable alternate names
  addRepeatableOp(ops, d, "organization.alternateName", values.alternateNames);

  // ── Identifiers ───────────────────────────────────────────────────────────
  addOp(ops, d, "organization.identifier.ror",          values.ror);
  addOp(ops, d, "organization.identifier.isni",         values.isni);
  addOp(ops, d, "organization.identifier.rin",          values.ringgold);
  addOp(ops, d, "organization.identifier.lei",          values.lei);
  addOp(ops, d, "organization.identifier.crossrefid",   values.crossrefId);
  addOp(ops, d, "mdwrepo.identifier.grid",              values.grid);
  addOp(ops, d, "mdwrepo.identifier.wikidata",          values.wikidataId);
  addOp(ops, d, "mdwrepo.identifier.gnd",               values.gnd);
  addOp(ops, d, "mdwrepo.identifier.viaf",              values.viaf);
  addOp(ops, d, "dc.identifier.orcid",                  values.orcid);

  // ── mdwonline fields ──────────────────────────────────────────────────────
  addOp(ops, d, "mdwonline.orgTypeNr", values.mdwOrgTypeNr);
  addOp(ops, d, "mdwonline.kennung",   values.mdwKennung);

  if (ops.length > 0) {
    await apiFetch<any>(`/api/submission/workspaceitems/${wsId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ops),
    });
  }

  return wsId;
}
