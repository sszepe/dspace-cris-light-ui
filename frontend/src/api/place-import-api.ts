/**
 * place-import-api.ts
 *
 * Client-side authority lookups for Places across three open CORS APIs:
 *   - Wikidata  (no auth required)
 *   - lobid GND (no auth required)
 *   - GeoNames  (free-tier API, requires a registered username)
 *
 * All functions return PlaceImportPayload — a richer intermediate type that
 * maps directly to PlaceCreationValues in place-creation-modal.tsx.
 * The PlacePayload / PlaceIdentifier types from the Django API are NOT used
 * here; this file is DSpace-creation-centric.
 */

// ── Types ─────────────────────────────────────────────────────────────────────

export type PlaceSource = "wikidata" | "gnd" | "geonames";

/**
 * A search result candidate before the full record is fetched.
 * Displayed in the import modal result list.
 */
export interface PlaceImportCandidate {
  source: PlaceSource;
  sourceId: string;
  label: string;
  description: string;
}

/**
 * Full payload returned after fetching the complete authority record.
 * Fields map 1-to-1 to PlaceCreationValues in place-creation-modal.tsx.
 */
export interface PlaceImportPayload {
  // Identity
  authorized_name: string;
  other_names: Array<{ variant: string; language: string; note: string }>;

  // Identifiers
  wikidataId: string;
  geoNamesId: string;
  gnd: string;
  viaf: string;

  // Location (extracted when available from the source)
  country: string;
  city: string;
  latitude: string;
  longitude: string;
  featureClass: string;
  featureCode: string;

  // External URLs
  url: string;
  extraUrls: Array<{ label: string; uri: string }>;

  /** Which source this payload came from */
  source: PlaceSource;
  sourceId: string;
}

// ── GeoNames username persistence ─────────────────────────────────────────────

const GN_USERNAME_KEY = "place_import_geonames_username";

export function getStoredGeoNamesUsername(): string {
  try {
    return localStorage.getItem(GN_USERNAME_KEY) ?? "";
  } catch {
    return "";
  }
}

export function setStoredGeoNamesUsername(username: string) {
  try {
    if (username.trim()) {
      localStorage.setItem(GN_USERNAME_KEY, username.trim());
    } else {
      localStorage.removeItem(GN_USERNAME_KEY);
    }
  } catch {
    // localStorage unavailable (e.g. private browsing) — silently ignore
  }
}

// ── Wikidata ──────────────────────────────────────────────────────────────────

const WD_API = "https://www.wikidata.org/w/api.php";
const WD_ENTITY = "https://www.wikidata.org/wiki/Special:EntityData";

/** Extract all string values for a Wikidata property claim. */
function wdStringClaims(entity: any, prop: string): string[] {
  return (entity?.claims?.[prop] ?? [])
    .filter((c: any) => c.mainsnak?.snaktype === "value")
    .map((c: any) => {
      const v = c.mainsnak?.datavalue?.value;
      return typeof v === "string" ? v : null;
    })
    .filter(Boolean) as string[];
}

/** Extract coordinate claims (P625) → { lat, lon } */
function wdCoordinates(entity: any): { lat: string; lon: string } | null {
  const claims = entity?.claims?.P625 ?? [];
  for (const c of claims) {
    if (c.mainsnak?.snaktype !== "value") continue;
    const v = c.mainsnak?.datavalue?.value;
    if (v?.latitude != null && v?.longitude != null) {
      return {
        lat: String(v.latitude),
        lon: String(v.longitude),
      };
    }
  }
  return null;
}

/**
 * Extract the English label of a linked Wikidata entity (e.g. country via P17).
 * Returns the QID string if labels are not embedded.
 */
// function wdLinkedLabel(entity: any, prop: string, lang = "en"): string {
function wdLinkedLabel(entity: any, prop: string): string {  
  const claims = entity?.claims?.[prop] ?? [];
  for (const c of claims) {
    if (c.mainsnak?.snaktype !== "value") continue;
    const qid = c.mainsnak?.datavalue?.value?.id;
    if (qid) return qid; // caller should resolve if needed
  }
  return "";
}

function mapWikidataFull(qid: string, entity: any, lang = "en"): PlaceImportPayload {
  const labels = entity?.labels ?? {};
  const aliases = entity?.aliases ?? {};
  // const descriptions = entity?.descriptions ?? {};

  const authorized_name: string =
    labels[lang]?.value ??
    (Object.values(labels)[0] as any)?.value ??
    qid;

  // Collect all label + alias strings as name variants with language codes
  const variantMap = new Map<string, string>(); // variant → lang code
  for (const [langCode, lbl] of Object.entries(labels) as [string, any][]) {
    if (lbl.value && lbl.value !== authorized_name) {
      variantMap.set(lbl.value, langCode);
    }
  }
  for (const [langCode, aliasList] of Object.entries(aliases) as [string, any[]][]) {
    for (const a of aliasList) {
      if (a.value && a.value !== authorized_name && !variantMap.has(a.value)) {
        variantMap.set(a.value, langCode);
      }
    }
  }
  const other_names = [...variantMap.entries()].map(([variant, language]) => ({
    variant,
    language,
    note: "",
  }));

  // Identifiers
  const geoNamesIds = wdStringClaims(entity, "P1566");
  const gndIds = wdStringClaims(entity, "P227");
  const viafIds = wdStringClaims(entity, "P214");
  const geoNamesId = geoNamesIds[0] ?? "";
  const gnd = gndIds[0] ?? "";
  const viaf = viafIds[0] ?? "";

  // Coordinates (P625)
  const coords = wdCoordinates(entity);

  // Country (P17) — just the QID; we show it as a hint, not resolve further
  // ISO 3166-1 alpha-2 country code (P297) is more useful if present
  const countryCode = wdStringClaims(entity, "P297")[0] ?? "";
  const countryQid = wdLinkedLabel(entity, "P17");
  // Prefer ISO code; fall back to country label from our labels if embedded
  let country = countryCode;
  if (!country && countryQid) {
    // The search response may embed some labels in simplified data
    country = countryQid; // Will be a QID like Q40 — acceptable as a prefill hint
  }

  // GeoNames feature class (P605) and feature code (P2561 / P2565)
  const featureClass = wdStringClaims(entity, "P605")[0] ?? "";
  // P2565 = GeoNames feature code in some items
  const featureCode = wdStringClaims(entity, "P2565")[0] ?? "";

  // External URLs
  const mainUrl = `https://www.wikidata.org/wiki/${qid}`;
  const extraUrls: Array<{ label: string; uri: string }> = [
    { label: "Wikidata", uri: mainUrl },
  ];
  const sitelink = entity?.sitelinks?.[`${lang}wiki`];
  if (sitelink?.title) {
    extraUrls.push({
      label: `Wikipedia (${lang})`,
      uri: `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(sitelink.title)}`,
    });
  }
  if (geoNamesId) {
    extraUrls.push({ label: "GeoNames", uri: `https://www.geonames.org/${geoNamesId}` });
  }

  return {
    authorized_name,
    other_names,
    wikidataId: qid,
    geoNamesId,
    gnd,
    viaf,
    country,
    city: "",
    latitude: coords?.lat ?? "",
    longitude: coords?.lon ?? "",
    featureClass,
    featureCode,
    url: mainUrl,
    extraUrls,
    source: "wikidata",
    sourceId: qid,
  };
}

export async function searchWikidataPlaces(
  query: string,
  lang = "en",
): Promise<PlaceImportCandidate[]> {
  const params = new URLSearchParams({
    action: "wbsearchentities",
    search: query,
    language: lang,
    type: "item",
    limit: "10",
    format: "json",
    origin: "*",
  });
  const res = await fetch(`${WD_API}?${params}`);
  if (!res.ok) throw new Error(`Wikidata search failed (${res.status})`);
  const data = await res.json();

  return (data.search ?? []).map(
    (item: any): PlaceImportCandidate => ({
      source: "wikidata",
      sourceId: item.id,
      label: item.label ?? item.id,
      description: item.description ?? "",
    }),
  );
}

export async function fetchWikidataPlaceFull(
  qid: string,
  lang = "en",
): Promise<PlaceImportPayload> {
  const res = await fetch(`${WD_ENTITY}/${qid}.json`);
  if (!res.ok) throw new Error(`Wikidata entity fetch failed (${res.status})`);
  const data = await res.json();
  return mapWikidataFull(qid, data.entities?.[qid] ?? {}, lang);
}

// ── lobid GND ─────────────────────────────────────────────────────────────────

const GND_SEARCH = "https://lobid.org/gnd/search";
const GND_BASE = "https://lobid.org/gnd/";

function mapGndFull(item: any): PlaceImportPayload {
  const gndId: string = item.gndIdentifier ?? "";

  const authorized_name: string =
    item.preferredName ??
    item.preferredNameForThePlaceOrGeographicName?.[0] ??
    gndId;

  const rawVariants: string[] = [
    ...(item.variantName ?? []),
    ...(item.variantNameForThePlaceOrGeographicName ?? []),
  ].filter((v: any) => typeof v === "string" && v !== authorized_name);

  const other_names = [...new Set(rawVariants)].map((v) => ({
    variant: v,
    language: "",
    note: "",
  }));

  // Cross-references via sameAs
  let wikidataId = "";
  let geoNamesId = "";
  const extraUrls: Array<{ label: string; uri: string }> = [
    { label: "lobid GND", uri: `${GND_BASE}${gndId}` },
    { label: "GND (DNB)", uri: `https://d-nb.info/gnd/${gndId}` },
  ];

  for (const ref of item.sameAs ?? []) {
    const uri: string = ref?.id ?? String(ref ?? "");
    if (!uri) continue;
    if (uri.includes("wikidata.org")) {
      const qid = uri.split("/").pop() ?? "";
      if (qid.startsWith("Q")) wikidataId = qid;
      extraUrls.push({ label: "Wikidata", uri });
    } else if (uri.includes("geonames.org")) {
      geoNamesId = uri.replace(/\/$/, "").split("/").pop() ?? "";
      extraUrls.push({ label: "GeoNames", uri });
    }
  }

  // Geographic coordinates if provided by lobid
  // const coords = item.geographicAreaCode?.[0]; // sometimes present
  const lat = item.latitude ? String(item.latitude) : "";
  const lon = item.longitude ? String(item.longitude) : "";

  // Country code from broaderTermGeo or geographicAreaCode
  const country = item.geographicAreaCode?.[0]?.label ?? "";

  return {
    authorized_name,
    other_names,
    wikidataId,
    geoNamesId,
    gnd: gndId,
    viaf: "",
    country,
    city: "",
    latitude: lat,
    longitude: lon,
    featureClass: "",
    featureCode: "",
    url: `${GND_BASE}${gndId}`,
    extraUrls,
    source: "gnd",
    sourceId: gndId,
  };
}

export async function searchGNDPlaces(query: string): Promise<PlaceImportCandidate[]> {
  const params = new URLSearchParams({
    q: query,
    format: "json",
    size: "10",
    filter: "type:PlaceOrGeographicName",
  });
  const res = await fetch(`${GND_SEARCH}?${params}`);
  if (!res.ok) throw new Error(`lobid GND search failed (${res.status})`);
  const data = await res.json();

  return (data.member ?? []).map(
    (item: any): PlaceImportCandidate => ({
      source: "gnd",
      sourceId: item.gndIdentifier ?? "",
      label: item.preferredName ?? item.gndIdentifier ?? "",
      description:
        (item["@type"] ?? []).find((t: string) => !t.startsWith("http")) ?? "",
    }),
  );
}

export async function fetchGNDPlaceFull(gndId: string): Promise<PlaceImportPayload> {
  const res = await fetch(`${GND_BASE}${gndId}.json`);
  if (!res.ok) throw new Error(`lobid GND fetch failed (${res.status})`);
  return mapGndFull(await res.json());
}

// ── GeoNames ──────────────────────────────────────────────────────────────────

const GN_SEARCH = "https://secure.geonames.org/searchJSON";
const GN_GET = "https://secure.geonames.org/getJSON";

function mapGeoNamesFull(item: any): PlaceImportPayload {
  const geoId = String(item.geonameId ?? "");
  const authorized_name: string = item.name ?? geoId;

  const variantSet = new Set<string>();
  if (item.toponymName && item.toponymName !== authorized_name) {
    variantSet.add(item.toponymName);
  }
  if (item.asciiName && item.asciiName !== authorized_name) {
    variantSet.add(item.asciiName);
  }
  for (const alt of item.alternateNames ?? []) {
    if (alt.name && alt.name !== authorized_name) {
      variantSet.add(alt.name);
    }
  }
  const other_names = [...variantSet].map((v) => ({
    variant: v,
    language: "",
    note: "",
  }));

  // GeoNames provides rich geographic data directly
  const country = item.countryName ?? item.countryCode ?? "";
  const city = item.adminName1 ?? ""; // admin level 1 (state / Bundesland)
  const latitude = item.lat ? String(item.lat) : "";
  const longitude = item.lng ? String(item.lng) : "";
  const featureClass = item.fcl ?? ""; // e.g. "P"
  const featureCode = item.fcode ?? ""; // e.g. "PPLA3"

  const uri = `https://www.geonames.org/${geoId}`;

  return {
    authorized_name,
    other_names,
    wikidataId: "",
    geoNamesId: geoId,
    gnd: "",
    viaf: "",
    country,
    city,
    latitude,
    longitude,
    featureClass,
    featureCode,
    url: uri,
    extraUrls: [{ label: "GeoNames", uri }],
    source: "geonames",
    sourceId: geoId,
  };
}

export async function searchGeoNames(
  query: string,
  username: string,
): Promise<PlaceImportCandidate[]> {
  const params = new URLSearchParams({
    q: query,
    maxRows: "10",
    type: "json",
    username,
  });
  const res = await fetch(`${GN_SEARCH}?${params}`);
  if (!res.ok) throw new Error(`GeoNames search failed (${res.status})`);
  const data = await res.json();
  if (data.status) throw new Error(`GeoNames: ${data.status.message}`);

  return (data.geonames ?? []).map(
    (item: any): PlaceImportCandidate => ({
      source: "geonames",
      sourceId: String(item.geonameId ?? ""),
      label: item.name ?? "",
      description: [item.fclName, item.countryName].filter(Boolean).join(" · "),
    }),
  );
}

export async function fetchGeoNamesFull(
  geoId: string,
  username: string,
): Promise<PlaceImportPayload> {
  const params = new URLSearchParams({ geonameId: geoId, username });
  const res = await fetch(`${GN_GET}?${params}`);
  if (!res.ok) throw new Error(`GeoNames fetch failed (${res.status})`);
  const data = await res.json();
  if (data.status) throw new Error(`GeoNames: ${data.status.message}`);
  return mapGeoNamesFull(data);
}

// ── Unified fetch dispatcher ───────────────────────────────────────────────────

export async function fetchPlaceFull(
  candidate: PlaceImportCandidate,
  geoNamesUsername: string,
): Promise<PlaceImportPayload> {
  switch (candidate.source) {
    case "wikidata":
      return fetchWikidataPlaceFull(candidate.sourceId);
    case "gnd":
      return fetchGNDPlaceFull(candidate.sourceId);
    case "geonames":
      return fetchGeoNamesFull(candidate.sourceId, geoNamesUsername);
  }
}
