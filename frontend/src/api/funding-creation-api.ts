import { apiFetch } from "../auth/client";
import type { AuthorityOption } from "../components/modal-shared";
import { resolveCollectionId } from "../config/collection-mapping";

export type { AuthorityOption };

export type VocabularyOption = {
  id: string;
  authority: string;
  display: string;
  value: string;
};

export interface FundingCreationValues {
  fundingTypeAuthority: string;
  fundingTypeValue: string;
  legalTypeAuthority: string;
  legalTypeValue: string;
  title: string;
  applicationDate: string;
  statusAuthority?: string;
  statusValue?: string;
  acronym: string;
  alternativeTitle: string;
  translationTypeAuthority?: string;
  translationTypeValue?: string;
  crossrefGrantId: string;
  projectNumber: string;
  applicationNumber: string;
  risSynergyId: string;
  internalId: string;
  relatedProject?: AuthorityOption | null;
  funder?: AuthorityOption | null;
  relatedProgramme?: AuthorityOption | null;
  relatedCall?: AuthorityOption | null;
  oaMandate?: "true" | "false" | "";
  oaMandateUrl: string;
  fundingIdentifier: string;
  fundingStartDate: string;
  fundingEndDate: string;
  description: string;
  awardUrl: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeMeta(value: string, authority?: string | null, confidence = -1) {
  return {
    value,
    language: null,
    authority: authority ?? null,
    confidence,
    place: 0,
  };
}

type Op = { op: string; path: string; value: any };

function addSimple(ops: Op[], section: string, field: string, raw?: string | null) {
  const v = (raw ?? "").trim();
  if (!v) return;
  ops.push({ op: "add", path: `/sections/${section}/${field}`, value: [makeMeta(v)] });
}

function addControlled(
  ops: Op[],
  section: string,
  field: string,
  label?: string | null,
  authority?: string | null,
) {
  const v = (label ?? "").trim();
  if (!v) return;
  const auth = (authority ?? "").trim() || null;
  ops.push({
    op: "add",
    path: `/sections/${section}/${field}`,
    value: [makeMeta(v, auth, auth ? 600 : -1)],
  });
}

// ── Vocabulary loaders ────────────────────────────────────────────────────────

export async function loadVocabularyTop(vocabulary: string): Promise<VocabularyOption[]> {
  const data = await apiFetch<any>(
    `/api/submission/vocabularyEntryDetails/search/top?vocabulary=${encodeURIComponent(vocabulary)}`,
  );
  const entries: any[] = data?._embedded?.vocabularyEntryDetails ?? [];
  return entries
    .filter((row) => row?.selectable !== false)
    .map((row) => ({
      id: row.id,
      authority: row.authority ?? row.id,
      display: row.display ?? row.value ?? row.id,
      value: row.value ?? row.display ?? row.id,
    }));
}

// ── Authority searches ────────────────────────────────────────────────────────

async function discoverSearch(entityType: string, query: string): Promise<AuthorityOption[]> {
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
      entityType: item.entityType ?? entityType,
    }));
}

export function searchOrgUnits(query: string): Promise<AuthorityOption[]> {
  return discoverSearch("OrgUnit", query);
}

export function searchFundingProgrammes(query: string): Promise<AuthorityOption[]> {
  return discoverSearch("Funding", query);
}

export function searchProjects(query: string): Promise<AuthorityOption[]> {
  return discoverSearch("Project", query);
}

// ── Create workspace item ─────────────────────────────────────────────────────

export async function createFundingWorkspaceItem(
  values: FundingCreationValues,
): Promise<number> {
  // Route to the correct collection based on dc.type and risfunding.status.
  // The funding-type value is the vocabulary display label (e.g. "Grant").
  const fundingTypeLabel = values.fundingTypeValue || "";
  const statusLabel = values.statusValue || "";

  const collectionId = await resolveCollectionId("Funding", {
    dcType: fundingTypeLabel,
    risfundingStatus: statusLabel,
  });

  const created = await apiFetch<any>(
    `/api/submission/workspaceitems?owningCollection=${encodeURIComponent(collectionId)}`,
    { method: "POST", headers: { "Content-Type": "application/json" } },
  );

  const newId: number = created?.id;
  if (!newId) throw new Error("Workspace item creation failed.");

  const ops: Op[] = [];

  addControlled(ops, "funding_type", "dc.type", values.fundingTypeValue, values.fundingTypeAuthority);
  addControlled(ops, "funding_mandatory", "risfunding.legalType", values.legalTypeValue, values.legalTypeAuthority);
  addSimple(ops, "funding_mandatory", "dc.title", values.title);
  addSimple(ops, "funding_mandatory", "mdwfis.funding.applicationDate", values.applicationDate);

  addControlled(ops, "funding", "risfunding.status", values.statusValue, values.statusAuthority);
  addSimple(ops, "funding", "oairecerif.acronym", values.acronym);
  addSimple(ops, "funding", "dcterms.alternative", values.alternativeTitle);
  addControlled(ops, "funding", "ris.translation.type", values.translationTypeValue, values.translationTypeAuthority);
  addSimple(ops, "funding", "oairecerif.internalid", values.internalId);

  addSimple(ops, "funding", "dc.identifier.crossrefgrantid", values.crossrefGrantId);
  addSimple(ops, "funding", "dc.identifier.projectnumber", values.projectNumber);
  addSimple(ops, "funding", "dc.identifier.applicationnumber", values.applicationNumber);
  addSimple(ops, "funding", "dc.identifier.rissynergy", values.risSynergyId);

  addControlled(ops, "funding", "dc.relation.project", values.relatedProject?.label, values.relatedProject?.id);
  addControlled(ops, "funding", "oairecerif.funder", values.funder?.label, values.funder?.id);
  addControlled(ops, "funding", "dc.relation.programme", values.relatedProgramme?.label, values.relatedProgramme?.id);
  addControlled(ops, "funding", "dc.relation.call", values.relatedCall?.label, values.relatedCall?.id);

  if (values.oaMandate) addSimple(ops, "funding", "oairecerif.oamandate", values.oaMandate);
  addSimple(ops, "funding", "oairecerif.oamandate.url", values.oaMandateUrl);
  addSimple(ops, "funding", "oairecerif.funding.identifier", values.fundingIdentifier);
  addSimple(ops, "funding", "oairecerif.funding.startDate", values.fundingStartDate);
  addSimple(ops, "funding", "oairecerif.funding.endDate", values.fundingEndDate);
  addSimple(ops, "funding", "dc.description", values.description);
  addSimple(ops, "funding", "crisfund.award.url", values.awardUrl);

  if (ops.length > 0) {
    await apiFetch<any>(`/api/submission/workspaceitems/${newId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ops),
    });
  }

  return newId;
}
