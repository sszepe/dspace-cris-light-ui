/**
 * place-creation-api.ts
 *
 * DSpace API helpers for Place workspace item creation.
 * Collection routing is handled by collection-mapping.ts.
 */

import { apiFetch } from "../auth/client";
import type { AuthorityOption } from "../components/modal-shared";
import type { ParsedItemRow, SearchResponse } from "../api/dspace";
import { parseItemRow } from "../api/dspace";
import { resolveCollectionId } from "../config/collection-mapping";

export type { AuthorityOption };

export interface VocabularyEntry { display: string; value: string; }
export interface NameVariant { variant: string; language: string; note: string; }

export interface PlaceCreationValues {
  title: string; dcType: string; isActive: string; description: string;
  nameVariants: NameVariant[];
  city: string; country: string; addressStreet: string; addressPostalCode: string; addressRegion: string;
  latitude: string; longitude: string;
  parentPlace: AuthorityOption | null; containedInPlace: AuthorityOption | null;
  featureClass: string; featureCode: string;
  geoNamesId: string; wikidataId: string; gln: string; gnd: string; viaf: string; url: string;
}

function makeMeta(value: string, authority?: string | null, confidence = -1) {
  return { value, language: null, authority: authority ?? null, confidence, place: 0 };
}

type Op = { op: string; path: string; value: any };

function addSimple(ops: Op[], section: string, field: string, raw?: string | null) {
  const v = (raw ?? "").trim(); if (!v) return;
  ops.push({ op: "add", path: `/sections/${section}/${field}`, value: [makeMeta(v)] });
}

function addControlled(ops: Op[], section: string, field: string, label?: string | null, authority?: string | null) {
  const v = (label ?? "").trim(); if (!v) return;
  const auth = (authority ?? "").trim() || null;
  ops.push({ op: "add", path: `/sections/${section}/${field}`, value: [makeMeta(v, auth, auth ? 600 : -1)] });
}

// The place collection UUID is used as context for vocabulary API calls.
// Must match the UUID in STATIC_COLLECTION_RULES in collection-mapping.ts.
const PLACE_COLLECTION_UUID = "1fbf6e10-d661-40b5-a957-4dab2e44df84";

async function loadVocabularyEntries(vocabulary: string, metadata: string, collectionId: string): Promise<VocabularyEntry[]> {
  const all: VocabularyEntry[] = [];
  let page = 0;
  for (;;) {
    const params = new URLSearchParams({ page: String(page), size: "100", metadata, collection: collectionId });
    const data = await apiFetch<any>(`/api/submission/vocabularies/${vocabulary}/entries?${params}`);
    const entries: any[] = data?._embedded?.entries ?? [];
    all.push(...entries.map((e) => ({ display: e.display ?? e.value, value: e.value })));
    const totalPages: number = data?.page?.totalPages ?? 1;
    if (page >= totalPages - 1) break;
    page += 1;
  }
  return all;
}

export async function loadPlaceTypeOptions(): Promise<VocabularyEntry[]> {
  return loadVocabularyEntries("place_types", "dc.type", PLACE_COLLECTION_UUID);
}

export async function loadIsActiveOptions(): Promise<VocabularyEntry[]> {
  return loadVocabularyEntries("truefalse", "mdwrepo.isActive", PLACE_COLLECTION_UUID);
}

export async function searchPlaceAuthorities(query: string): Promise<AuthorityOption[]> {
  const params = new URLSearchParams({ query: query.trim() || "*", page: "0", size: "10", projection: "preventMetadataSecurity" });
  params.append("f.entityType", "Place,equals");
  const data = await apiFetch<SearchResponse>(`/api/discover/search/objects?${params}`);
  const rows = (data?._embedded?.searchResult?._embedded?.objects ?? []).map(parseItemRow).filter(Boolean) as ParsedItemRow[];
  return rows.map((row) => ({ id: row.uuid!, label: row.name, subtitle: row.dcType ?? undefined, entityType: row.entityType }));
}

export function defaultPlaceValues(): PlaceCreationValues {
  return {
    title: "", dcType: "", isActive: "", description: "", nameVariants: [],
    city: "", country: "", addressStreet: "", addressPostalCode: "", addressRegion: "",
    latitude: "", longitude: "", parentPlace: null, containedInPlace: null,
    featureClass: "", featureCode: "", geoNamesId: "", wikidataId: "", gln: "", gnd: "", viaf: "", url: "",
  };
}

export async function createPlaceWorkspaceItem(values: PlaceCreationValues): Promise<number> {
  const collectionId = await resolveCollectionId("Place");

  const created = await apiFetch<any>(
    `/api/submission/workspaceitems?owningCollection=${encodeURIComponent(collectionId)}`,
    { method: "POST", headers: { "Content-Type": "application/json" } },
  );
  const newId: number = created?.id;
  if (!newId) throw new Error("Workspace item creation failed.");

  const ops: Op[] = [];
  const s = "place";

  addSimple(ops, s, "dc.title", values.title);
  addSimple(ops, s, "dc.type", values.dcType);
  addSimple(ops, s, "mdwrepo.isActive", values.isActive);
  addSimple(ops, s, "dc.description", values.description);

  values.nameVariants.forEach((nv, i) => {
    if (!nv.variant.trim()) return;
    ops.push({ op: "add", path: `/sections/${s}/mdwrepo.name.variant`, value: [{
      value: nv.variant.trim(), language: nv.language.trim() || null, authority: null, confidence: -1, place: i,
      otherInformation: nv.note.trim() ? { note: nv.note.trim() } : {},
    }]});
  });

  addSimple(ops, s, "mdwrepo.place.city", values.city);
  addSimple(ops, s, "mdwrepo.place.country", values.country);
  addSimple(ops, s, "place.address.streetAddress", values.addressStreet);
  addSimple(ops, s, "place.address.postalCode", values.addressPostalCode);
  addSimple(ops, s, "place.address.addressRegion", values.addressRegion);
  addSimple(ops, s, "place.latitude", values.latitude);
  addSimple(ops, s, "place.longitude", values.longitude);
  addControlled(ops, s, "mdwrepo.place.parentPlace", values.parentPlace?.label, values.parentPlace?.id);
  addControlled(ops, s, "place.containedInPlace", values.containedInPlace?.label, values.containedInPlace?.id);
  addSimple(ops, s, "mdwrepo.place.featureClass", values.featureClass);
  addSimple(ops, s, "mdwrepo.place.featureCode", values.featureCode);
  addSimple(ops, s, "place.identifier.geoNames", values.geoNamesId);
  addSimple(ops, s, "dc.identifier.wikidata", values.wikidataId);
  addSimple(ops, s, "place.identifier.globalLocationNumber", values.gln);
  addSimple(ops, s, "mdwrepo.identifier.gnd", values.gnd);
  addSimple(ops, s, "mdwrepo.identifier.viaf", values.viaf);
  addSimple(ops, s, "oairecerif.identifier.url", values.url);

  if (ops.length > 0) {
    await apiFetch<any>(`/api/submission/workspaceitems/${newId}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(ops),
    });
  }
  return newId;
}
