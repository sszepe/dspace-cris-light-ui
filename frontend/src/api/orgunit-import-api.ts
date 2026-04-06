/**
 * orgunit-import-api.ts
 *
 * Client-side authority lookups for OrgUnit entities from three open CORS APIs:
 *
 *   ROR      https://api.ror.org/v2/organizations  (no auth)
 *   lobid GND https://lobid.org/gnd/search         (no auth, CorporateBody filter)
 *   Wikidata  https://www.wikidata.org/w/api.php    (no auth)
 *
 * All importers return OrgUnitImportPayload which maps directly to the fields
 * used by OrgUnitCreationValues in orgunit-creation-api.ts.
 *
 * ROR schema v2.1 is fully supported — all fields from the sample payload are
 * extracted and mapped to the correct DSpace metadata fields.
 */

// ── Types ─────────────────────────────────────────────────────────────────────

export type OrgUnitSource = "ror" | "gnd" | "wikidata";

export interface OrgUnitImportCandidate {
  source: OrgUnitSource;
  sourceId: string;       // ROR ID / GND ID / Wikidata QID
  label: string;
  description: string;    // type / city / short description
}

/** A name with an optional language tag and name type. */
export interface OrgUnitName {
  value: string;
  lang: string;             // ISO 639-1 or "" if unknown
  types: string[];          // e.g. ["ror_display", "label"], ["acronym"]
}

/**
 * Full payload returned after fetching the complete authority record.
 * Every field maps to a DSpace metadata field in orgunit-creation-api.ts.
 */
export interface OrgUnitImportPayload {
  // ── dc.* ──────────────────────────────────────────────────────────────────
  /** Primary display name (dc.title) */
  title: string;
  /** Acronym (oairecerif.acronym or dc.alternative) */
  acronym: string;
  /** All alternative names and language-tagged labels */
  alternateNames: OrgUnitName[];
  /** dc.type — mapped from ROR types[] / GND @type / Wikidata */
  dcType: string;
  /** dc.description (from Wikidata label or GND) */
  description: string;
  /** dc.language */
  language: string;

  // ── organization.* ────────────────────────────────────────────────────────
  /** organization.legalName — official registered name */
  legalName: string;
  /** organization.foundingDate */
  foundingDate: string;
  /** organization.endDate */
  endDate: string;
  /** organization.address.addressLocality — city */
  addressLocality: string;
  /** organization.address.addressCountry — ISO 3166-1 alpha-2 */
  addressCountry: string;
  /** organization.url — primary website */
  url: string;
  /** organization.alternateName[] */
  organizationAlternateNames: string[];

  // ── Identifiers ───────────────────────────────────────────────────────────
  /** organization.identifier.ror — full ROR URI e.g. https://ror.org/000ymgt65 */
  ror: string;
  /** organization.identifier.isni — ISNI without spaces e.g. 0000000086460702 */
  isni: string;
  /** organization.identifier.rin — Ringgold */
  ringgold: string;
  /** organization.identifier.lei — LEI */
  lei: string;
  /** organization.identifier.crossrefid — Crossref Funder Registry */
  crossrefId: string;
  /** mdwrepo.identifier.grid — GRID */
  grid: string;
  /** mdwrepo.identifier.wikidata */
  wikidataId: string;
  /** mdwrepo.identifier.gnd — GND identifier */
  gnd: string;
  /** mdwrepo.identifier.viaf */
  viaf: string;
  /** dc.identifier.orcid — sometimes present for single-person orgs */
  orcid: string;

  // ── ROR-specific ──────────────────────────────────────────────────────────
  /** ROR status: "active" | "inactive" | "withdrawn" */
  rorStatus: string;
  /** ROR types[] — array of type strings */
  rorTypes: string[];
  /** ROR domains[] — e.g. ["mdw.ac.at"] */
  domains: string[];
  /** Wikipedia URL */
  wikipediaUrl: string;
  /** GeoNames location city name */
  geoNamesCity: string;
  /** Country subdivision (state/Bundesland) */
  countrySubdivision: string;
  /** GeoNames ID */
  geoNamesId: string;
  /** Latitude */
  latitude: string;
  /** Longitude */
  longitude: string;

  // ── mdwrepo.* ─────────────────────────────────────────────────────────────
  /** mdwrepo.orgunit.hasTopOrgUnit — parent org label, if present in source */
  hasTopOrgUnit: string;
  /** mdwrepo.orgunit.mdwInternal — internal mdw ID if known */
  mdwInternal: string;

  /** Import provenance */
  source: OrgUnitSource;
  sourceId: string;
}

// ── ROR type → dc.type mapping ────────────────────────────────────────────────

const ROR_TYPE_MAP: Record<string, string> = {
  education:          "Education",
  healthcare:         "Healthcare",
  company:            "Company",
  archive:            "Archive",
  nonprofit:          "Nonprofit",
  government:         "Government",
  facility:           "Facility",
  funder:             "Funder",
  other:              "Other",
};

function rorTypeToDcType(types: string[]): string {
  for (const t of types) {
    const mapped = ROR_TYPE_MAP[t.toLowerCase()];
    if (mapped) return mapped;
  }
  return types[0] ?? "";
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROR v2  (https://api.ror.org/v2/organizations)
// ═══════════════════════════════════════════════════════════════════════════════

const ROR_SEARCH = "https://api.ror.org/v2/organizations";

/**
 * Map a full ROR v2 record to OrgUnitImportPayload.
 * Covers the complete schema as shown in the sample MDW record.
 */
function mapRorFull(record: any): OrgUnitImportPayload {
  const rorId: string = record.id ?? "";

  // ── Names ─────────────────────────────────────────────────────────────────
  const names: any[] = record.names ?? [];

  // ror_display name (preferred English display label)
  const displayName =
    names.find((n: any) => n.types?.includes("ror_display"))?.value ??
    names.find((n: any) => n.types?.includes("label") && n.lang === "en")?.value ??
    names[0]?.value ??
    rorId;

  // Acronym
  const acronym =
    names.find((n: any) => n.types?.includes("acronym"))?.value ?? "";

  // All alternate names
  const alternateNames: OrgUnitName[] = names
    .filter((n: any) => n.value !== displayName)
    .map((n: any) => ({
      value:  n.value ?? "",
      lang:   n.lang  ?? "",
      types:  n.types ?? [],
    }));

  // legalName: prefer label in the org's primary language; fall back to display
  const legalName =
    names.find((n: any) => n.types?.includes("label") && !n.types.includes("ror_display"))?.value ??
    displayName;

  // ── Location ──────────────────────────────────────────────────────────────
  const location = record.locations?.[0];
  const geo = location?.geonames_details ?? {};

  const addressLocality   = geo.name ?? "";
  const addressCountry    = geo.country_code ?? "";
  const countrySubdivision= geo.country_subdivision_name ?? "";
  const geoNamesId        = location?.geonames_id ? String(location.geonames_id) : "";
  const latitude          = geo.lat  != null ? String(geo.lat)  : "";
  const longitude         = geo.lng  != null ? String(geo.lng)  : "";

  // ── External IDs ──────────────────────────────────────────────────────────
  const extIds: any[] = record.external_ids ?? [];
  function extId(type: string): string {
    const e = extIds.find((x: any) => x.type === type);
    return (e?.preferred ?? e?.all?.[0] ?? "");
  }

  const isniRaw    = extId("isni").replace(/\s+/g, "");
  const grid       = extId("grid");
  const wikidataQid= extId("wikidata");

  // ── Links ─────────────────────────────────────────────────────────────────
  const links: any[] = record.links ?? [];
  const website     = links.find((l: any) => l.type === "website")?.value   ?? "";
  const wikipediaUrl= links.find((l: any) => l.type === "wikipedia")?.value ?? "";

  // ── Types ─────────────────────────────────────────────────────────────────
  const rorTypes: string[] = record.types ?? [];
  const dcType = rorTypeToDcType(rorTypes);

  // ── Founded ───────────────────────────────────────────────────────────────
  const foundingDate = record.established ? String(record.established) : "";

  // ── Domains ───────────────────────────────────────────────────────────────
  const domains: string[] = record.domains ?? [];

  return {
    title:          displayName,
    acronym,
    alternateNames,
    dcType,
    description:    "",
    language:       "",
    legalName,
    foundingDate,
    endDate:        "",
    addressLocality,
    addressCountry,
    url:            website,
    organizationAlternateNames: alternateNames.map((n) => n.value),
    ror:            rorId,
    isni:           isniRaw,
    ringgold:       extId("ringgold"),
    lei:            "",
    crossrefId:     extId("fundref"),
    grid,
    wikidataId:     wikidataQid ? `Q${wikidataQid.replace(/^Q/i, "")}` : "",
    gnd:            "",
    viaf:           "",
    orcid:          "",
    rorStatus:      record.status ?? "active",
    rorTypes,
    domains,
    wikipediaUrl,
    geoNamesCity:   addressLocality,
    countrySubdivision,
    geoNamesId,
    latitude,
    longitude,
    hasTopOrgUnit:  "",
    mdwInternal:    "",
    source:         "ror",
    sourceId:       rorId,
  };
}

export async function searchRor(query: string): Promise<OrgUnitImportCandidate[]> {
  const params = new URLSearchParams({ query, page: "1" });
  const res = await fetch(`${ROR_SEARCH}?${params}`);
  if (!res.ok) throw new Error(`ROR search failed (${res.status})`);
  const data = await res.json();

  return (data.items ?? []).slice(0, 12).map((item: any): OrgUnitImportCandidate => {
    const names: any[] = item.names ?? [];
    const display =
      names.find((n: any) => n.types?.includes("ror_display"))?.value ??
      names[0]?.value ??
      item.id;
    const loc = item.locations?.[0]?.geonames_details;
    const desc = [
      (item.types ?? []).join(", "),
      loc?.name,
      loc?.country_code,
    ].filter(Boolean).join(" · ");

    return { source: "ror", sourceId: item.id ?? "", label: display, description: desc };
  });
}

export async function fetchRorFull(rorId: string): Promise<OrgUnitImportPayload> {
  // Accept full URI or short ID
  const id = rorId.replace("https://ror.org/", "");
  const res = await fetch(`${ROR_SEARCH}/${id}`);
  if (!res.ok) throw new Error(`ROR fetch failed (${res.status})`);
  return mapRorFull(await res.json());
}

// ═══════════════════════════════════════════════════════════════════════════════
// lobid GND  (CorporateBody / Organisation)
// ═══════════════════════════════════════════════════════════════════════════════

const GND_SEARCH = "https://lobid.org/gnd/search";
const GND_BASE   = "https://lobid.org/gnd/";

function mapGndOrgFull(item: any): OrgUnitImportPayload {
  const gndId: string = item.gndIdentifier ?? "";

  const title: string =
    item.preferredName ??
    item.preferredNameForCorporateBody?.[0] ??
    gndId;

  const rawVariants: string[] = [
    ...(item.variantName ?? []),
    ...(item.variantNameForCorporateBody ?? []),
  ].filter((v: any) => typeof v === "string" && v !== title);

  const alternateNames: OrgUnitName[] = [...new Set(rawVariants)].map((v) => ({
    value: v, lang: "", types: ["label"],
  }));

  // Acronym — first variantName that looks like an acronym (≤6 chars uppercase)
  const acronym =
    rawVariants.find((v) => v === v.toUpperCase() && v.length <= 8) ?? "";

  // Cross-references
  let wikidataId = "";
  let rorId = "";
  let viaf = "";
  const extraUrls: string[] = [];

  for (const ref of item.sameAs ?? []) {
    const uri: string = ref?.id ?? String(ref ?? "");
    if (!uri) continue;
    if (uri.includes("wikidata.org")) {
      const qid = uri.split("/").pop() ?? "";
      if (qid.startsWith("Q")) wikidataId = qid;
    } else if (uri.includes("ror.org")) {
      rorId = uri;
    } else if (uri.includes("viaf.org")) {
      viaf = uri.split("/").filter(Boolean).pop() ?? "";
    }
    extraUrls.push(uri);
  }

  // Type
  const gndTypes: string[] = (item["@type"] ?? []).filter((t: string) => !t.startsWith("http"));
  const dcType = gndTypes[0] ?? "CorporateBody";

  // Location
  const placeOfBusiness: any[] = item.placeOfBusiness ?? [];
  const city = placeOfBusiness[0]?.label ?? "";

  // Official home page
  const url: string = item.homepage?.[0]?.id ?? item.homepage?.[0] ?? "";

  // Founding / dissolution dates
  const foundingDate = item.dateOfEstablishment ?? "";
  const endDate      = item.dateOfTermination   ?? "";

  return {
    title,
    acronym,
    alternateNames,
    dcType,
    description:       gndTypes.join(", "),
    language:          item.languageCode?.[0] ?? "",
    legalName:         title,
    foundingDate,
    endDate,
    addressLocality:   city,
    addressCountry:    "",
    url,
    organizationAlternateNames: alternateNames.map((n) => n.value),
    ror:               rorId,
    isni:              "",
    ringgold:          "",
    lei:               "",
    crossrefId:        "",
    grid:              "",
    wikidataId,
    gnd:               gndId,
    viaf,
    orcid:             "",
    rorStatus:         "active",
    rorTypes:          [],
    domains:           [],
    wikipediaUrl:      "",
    geoNamesCity:      city,
    countrySubdivision:"",
    geoNamesId:        "",
    latitude:          "",
    longitude:         "",
    hasTopOrgUnit:     "",
    mdwInternal:       "",
    source:            "gnd",
    sourceId:          gndId,
  };
}

export async function searchGndOrgs(query: string): Promise<OrgUnitImportCandidate[]> {
  const params = new URLSearchParams({
    q:      query,
    format: "json",
    size:   "12",
    filter: "type:CorporateBody",
  });
  const res = await fetch(`${GND_SEARCH}?${params}`);
  if (!res.ok) throw new Error(`lobid GND search failed (${res.status})`);
  const data = await res.json();

  return (data.member ?? []).map((item: any): OrgUnitImportCandidate => {
    const types: string[] = (item["@type"] ?? []).filter((t: string) => !t.startsWith("http"));
    return {
      source:      "gnd",
      sourceId:    item.gndIdentifier ?? "",
      label:       item.preferredName ?? item.gndIdentifier ?? "",
      description: types.join(", "),
    };
  });
}

export async function fetchGndOrgFull(gndId: string): Promise<OrgUnitImportPayload> {
  const res = await fetch(`${GND_BASE}${gndId}.json`);
  if (!res.ok) throw new Error(`lobid GND fetch failed (${res.status})`);
  return mapGndOrgFull(await res.json());
}

// ═══════════════════════════════════════════════════════════════════════════════
// Wikidata  (organisation-type items)
// ═══════════════════════════════════════════════════════════════════════════════

const WD_API    = "https://www.wikidata.org/w/api.php";
const WD_ENTITY = "https://www.wikidata.org/wiki/Special:EntityData";

function wdStringClaims(entity: any, prop: string): string[] {
  return (entity?.claims?.[prop] ?? [])
    .filter((c: any) => c.mainsnak?.snaktype === "value")
    .map((c: any) => {
      const v = c.mainsnak?.datavalue?.value;
      return typeof v === "string" ? v : null;
    })
    .filter(Boolean) as string[];
}

function mapWikidataOrgFull(qid: string, entity: any): OrgUnitImportPayload {
  const labels   = entity?.labels   ?? {};
  const aliases  = entity?.aliases  ?? {};
  const descriptions = entity?.descriptions ?? {};

  const title: string =
    labels["en"]?.value ??
    (Object.values(labels)[0] as any)?.value ??
    qid;

  const description: string =
    descriptions["en"]?.value ?? "";

  // Alternate names
  const variantMap = new Map<string, string>();
  for (const [langCode, lbl] of Object.entries(labels) as [string, any][]) {
    if (lbl.value && lbl.value !== title) variantMap.set(lbl.value, langCode);
  }
  for (const [langCode, aliasList] of Object.entries(aliases) as [string, any[]][]) {
    for (const a of aliasList) {
      if (a.value && a.value !== title && !variantMap.has(a.value)) {
        variantMap.set(a.value, langCode);
      }
    }
  }
  const alternateNames: OrgUnitName[] = [...variantMap.entries()].map(([value, lang]) => ({
    value, lang, types: ["label"],
  }));

  // Identifiers
  const rorIds    = wdStringClaims(entity, "P6782");   // P6782 = ROR ID
  const gndIds    = wdStringClaims(entity, "P227");
  const isniIds   = wdStringClaims(entity, "P213");
  const viafIds   = wdStringClaims(entity, "P214");
  const gridIds   = wdStringClaims(entity, "P2427");
  const ringgolds = wdStringClaims(entity, "P3500");
  const leis      = wdStringClaims(entity, "P1278");

  // ROR URI
  const ror = rorIds[0] ? `https://ror.org/${rorIds[0]}` : "";

  // Website (P856)
  const url  = wdStringClaims(entity, "P856")[0] ?? "";

  // Founding date (P571)
  const foundingRaw  = entity?.claims?.P571?.[0]?.mainsnak?.datavalue?.value?.time ?? "";
  const foundingDate = foundingRaw ? foundingRaw.replace(/^\+/, "").slice(0, 4) : "";

  // Dissolution (P576)
  const endRaw  = entity?.claims?.P576?.[0]?.mainsnak?.datavalue?.value?.time ?? "";
  const endDate = endRaw ? endRaw.replace(/^\+/, "").slice(0, 4) : "";

  // Country (P17) — ISO alpha-2 from P297 preferred
  const countryCode = wdStringClaims(entity, "P297")[0] ?? "";
  const countryQid  = entity?.claims?.P17?.[0]?.mainsnak?.datavalue?.value?.id ?? "";

  // Location/HQ (P159 = headquarters location)
  const hqQid = entity?.claims?.P159?.[0]?.mainsnak?.datavalue?.value?.id ?? "";

  // Type from instance-of (P31)
  const instanceOf = entity?.claims?.P31 ?? [];
  const dcType = instanceOf.length ? "Organisation" : "";

  // Wikipedia link
  const sitelink = entity?.sitelinks?.enwiki;
  const wikipediaUrl = sitelink?.title
    ? `https://en.wikipedia.org/wiki/${encodeURIComponent(sitelink.title)}`
    : "";

  return {
    title,
    acronym:             "",
    alternateNames,
    dcType,
    description,
    language:            "en",
    legalName:           title,
    foundingDate,
    endDate,
    addressLocality:     hqQid,   // QID — user can correct
    addressCountry:      countryCode || countryQid,
    url,
    organizationAlternateNames: alternateNames.map((n) => n.value),
    ror,
    isni:                (isniIds[0] ?? "").replace(/\s+/g, ""),
    ringgold:            ringgolds[0] ?? "",
    lei:                 leis[0] ?? "",
    crossrefId:          "",
    grid:                gridIds[0] ?? "",
    wikidataId:          qid,
    gnd:                 gndIds[0] ?? "",
    viaf:                viafIds[0] ?? "",
    orcid:               "",
    rorStatus:           "active",
    rorTypes:            [],
    domains:             [],
    wikipediaUrl,
    geoNamesCity:        "",
    countrySubdivision:  "",
    geoNamesId:          "",
    latitude:            "",
    longitude:           "",
    hasTopOrgUnit:       "",
    mdwInternal:         "",
    source:              "wikidata",
    sourceId:            qid,
  };
}

export async function searchWikidataOrgs(
  query: string,
): Promise<OrgUnitImportCandidate[]> {
  const params = new URLSearchParams({
    action:   "wbsearchentities",
    search:   query,
    language: "en",
    type:     "item",
    limit:    "12",
    format:   "json",
    origin:   "*",
  });
  const res = await fetch(`${WD_API}?${params}`);
  if (!res.ok) throw new Error(`Wikidata search failed (${res.status})`);
  const data = await res.json();

  return (data.search ?? []).map((item: any): OrgUnitImportCandidate => ({
    source:      "wikidata",
    sourceId:    item.id ?? "",
    label:       item.label ?? item.id ?? "",
    description: item.description ?? "",
  }));
}

export async function fetchWikidataOrgFull(
  qid: string,
): Promise<OrgUnitImportPayload> {
  const res = await fetch(`${WD_ENTITY}/${qid}.json`);
  if (!res.ok) throw new Error(`Wikidata entity fetch failed (${res.status})`);
  const data = await res.json();
  return mapWikidataOrgFull(qid, data.entities?.[qid] ?? {});
}

// ── Unified dispatcher ────────────────────────────────────────────────────────

export async function fetchOrgUnitFull(
  candidate: OrgUnitImportCandidate,
): Promise<OrgUnitImportPayload> {
  switch (candidate.source) {
    case "ror":      return fetchRorFull(candidate.sourceId);
    case "gnd":      return fetchGndOrgFull(candidate.sourceId);
    case "wikidata": return fetchWikidataOrgFull(candidate.sourceId);
  }
}

export async function searchOrgUnits(
  query: string,
  sources: OrgUnitSource[],
): Promise<OrgUnitImportCandidate[]> {
  const tasks: Promise<OrgUnitImportCandidate[]>[] = [];
  if (sources.includes("ror"))      tasks.push(searchRor(query).catch(() => []));
  if (sources.includes("gnd"))      tasks.push(searchGndOrgs(query).catch(() => []));
  if (sources.includes("wikidata")) tasks.push(searchWikidataOrgs(query).catch(() => []));
  const results = await Promise.all(tasks);
  return results.flat();
}
