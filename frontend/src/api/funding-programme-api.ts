import { apiFetch } from "../auth/client";
import type { AuthorityOption } from "../components/modal-shared";
import type { ParsedItemRow, SearchResponse } from "../api/dspace";
import { parseItemRow } from "../api/dspace";
import { resolveCollectionId } from "../config/collection-mapping";

export type { AuthorityOption };

export type FundingTypeOption = {
  id: string;
  display: string;
  value: string;
  authority: string;
};

export interface FundingProgrammeCreateValues {
  fundingTypeAuthority: string;
  fundingTypeValue: string;
  title: string;
  funderUuid: string;
  funderLabel: string;
  acronym: string;
  parentFundingUuid: string;
  parentFundingLabel: string;
  description: string;
  identifierCrossrefGrantId: string;
  identifierProjectNumber: string;
  identifierApplicationNumber: string;
  identifierRisSynergy: string;
  url: string;
  applicationDeadline: string;
  fundingStartDate: string;
  fundingEndDate: string;
}

function makeMeta(value: string, authority?: string | null, confidence?: number) {
  return {
    value,
    language: null,
    authority: authority ?? null,
    confidence: authority ? (confidence ?? 600) : -1,
    place: 0,
  };
}

type Op = { op: string; path: string; value: any };

// ── Authority types available for programme creation ──────────────────────────
// mdw_fu006 = Programme, mdw_fu007 = Call, mdw_fu008 = Ongoing Call

const PROGRAMME_TYPE_AUTHORITIES = [
  "funding-types:mdw_fu006",
  "funding-types:mdw_fu007",
  "funding-types:mdw_fu008",
];

export async function fetchFundingTypeOptions(): Promise<FundingTypeOption[]> {
  const data = await apiFetch<any>(
    `/api/submission/vocabularyEntryDetails/search/top?vocabulary=funding-types&size=50`,
  );
  const rows: any[] = data?._embedded?.vocabularyEntryDetails ?? [];
  return rows
    .filter((row) => PROGRAMME_TYPE_AUTHORITIES.includes(row.authority))
    .map((row) => ({
      id: row.id,
      display: row.display,
      value: row.value,
      authority: row.authority,
    }));
}

async function searchAuthorityItems(
  query: string,
  entityType: string,
  itemTypes?: string[],
): Promise<AuthorityOption[]> {
  const params = new URLSearchParams({
    query: query.trim() || "*",
    page: "0",
    size: "10",
    projection: "preventMetadataSecurity",
  });
  params.append("f.entityType", `${entityType},equals`);
  if (itemTypes?.length === 1) {
    params.append("f.itemtype", `${itemTypes[0]},equals`);
  } else if (itemTypes && itemTypes.length > 1) {
    for (const t of itemTypes) {
      params.append("(f.itemtype)", `${t},OR`);
    }
  }

  const data = await apiFetch<SearchResponse>(`/api/discover/search/objects?${params}`);
  const rows = (data?._embedded?.searchResult?._embedded?.objects ?? [])
    .map(parseItemRow)
    .filter(Boolean) as ParsedItemRow[];

  return rows.map((row) => ({
    id: row.uuid!,
    label: row.name,
    subtitle: [row.entityType, row.dcType].filter(Boolean).join(" · ") || undefined,
    entityType: row.entityType,
    dcType: row.dcType,
  }));
}

export function searchOrgUnitAuthorities(query: string): Promise<AuthorityOption[]> {
  return searchAuthorityItems(query, "OrgUnit");
}

export function searchFundingParentAuthorities(
  query: string,
  childFundingTypeAuthority?: string,
): Promise<AuthorityOption[]> {
  // Calls/Ongoing Calls must link to a Programme; Programmes can link to any Funding parent
  const allowedTypes =
    childFundingTypeAuthority === "funding-types:mdw_fu007" ||
    childFundingTypeAuthority === "funding-types:mdw_fu008"
      ? ["Programme"]
      : ["Programme", "Call", "Ongoing Call"];
  return searchAuthorityItems(query, "Funding", allowedTypes);
}

// ── Create workspace item ─────────────────────────────────────────────────────

export async function createFundingProgrammeWorkspaceItem(
  values: FundingProgrammeCreateValues,
): Promise<number> {
  // The funding type value is the vocabulary display label (e.g. "Programme", "Call").
  const collectionId = await resolveCollectionId("Funding", {
    dcType: values.fundingTypeValue,
  });

  const created = await apiFetch<any>(
    `/api/submission/workspaceitems?owningCollection=${encodeURIComponent(collectionId)}`,
    { method: "POST", headers: { "Content-Type": "application/json" } },
  );

  const newId: number = created?.id;
  if (!newId) throw new Error("Workspace item creation failed.");

  const ops: Op[] = [];

  const addField = (
    section: string,
    field: string,
    rawValue: string,
    authority?: string | null,
    confidence?: number,
  ) => {
    const value = rawValue.trim();
    if (!value) return;
    ops.push({
      op: "add",
      path: `/sections/${section}/${field}`,
      value: [makeMeta(value, authority, confidence)],
    });
  };

  addField("programme_type", "dc.type", values.fundingTypeValue, values.fundingTypeAuthority, 600);
  addField("programme_mandatory", "dc.title", values.title);
  addField("programme_mandatory", "oairecerif.funder", values.funderLabel, values.funderUuid, 600);
  addField("programme", "oairecerif.acronym", values.acronym);
  addField("programme", "oairecerif.fundingParent", values.parentFundingLabel, values.parentFundingUuid, 600);
  addField("programme", "dc.description", values.description);
  addField("programme", "dc.identifier.crossrefgrantid", values.identifierCrossrefGrantId);
  addField("programme", "dc.identifier.projectnumber", values.identifierProjectNumber);
  addField("programme", "dc.identifier.applicationnumber", values.identifierApplicationNumber);
  addField("programme", "dc.identifier.rissynergy", values.identifierRisSynergy);
  addField("programme", "oairecerif.identifier.url", values.url);
  addField("programme", "mdwfis.funding.applicationDeadline", values.applicationDeadline);
  addField("programme", "risfunding.funding.startDate", values.fundingStartDate);
  addField("programme", "risfunding.funding.endDate", values.fundingEndDate);

  if (ops.length > 0) {
    await apiFetch<any>(`/api/submission/workspaceitems/${newId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ops),
    });
  }

  return newId;
}
