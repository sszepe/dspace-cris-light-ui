/**
 * collection-mapping.ts
 *
 * Maps entity types + contextual fields to their target DSpace collection UUIDs.
 *
 * Sources (controlled by VITE_COLLECTION_MAPPING_SOURCE):
 *   "ts"     — static config defined in STATIC_COLLECTION_RULES below (default)
 *   "django" — fetched from the Django config API at runtime, with TS fallback
 *
 * Usage:
 *   const collectionId = await resolveCollectionId("Equipment");
 *   const collectionId = await resolveCollectionId("Funding", {
 *     dcType:          "Grant",
 *     risfundingStatus: "approved",
 *   });
 *
 * Adding a new mapping:
 *   Add an entry to STATIC_COLLECTION_RULES (and optionally to the Django API).
 *   Each rule may have optional field conditions that must ALL match (AND).
 *   Rules are evaluated in order; the first match wins.
 */

import { djangoGet, djangoFetch } from "../api/django-client";

// ── Types ─────────────────────────────────────────────────────────────────────

/**
 * Context fields used by conditional rules.
 * Pass the values you know at the time of collection resolution.
 */
export interface CollectionContext {
  /** dc.type value (or its display label) */
  dcType?: string;
  /** risfunding.status value */
  risfundingStatus?: string;
  /** dc.relation.project — present for grant/scholarship funding */
  projectId?: string;
}

/**
 * A single mapping rule.
 * conditions are optional; if absent the rule matches unconditionally.
 */
export interface CollectionRule {
  entityType: string;
  collectionId: string;
  /** Human-readable description — shown in admin UI */
  label?: string;
  conditions?: {
    /** Matches if dc.type value contains any of these strings (case-insensitive) */
    dcTypeIncludes?: string[];
    /** Matches if risfunding.status is exactly one of these values */
    risfundingStatusIn?: string[];
  };
}

// ── Static rules ──────────────────────────────────────────────────────────────
// Rules are evaluated top-to-bottom; the first match wins.
// More specific conditions must come before less specific ones.

export const STATIC_COLLECTION_RULES: CollectionRule[] = [
  // ── OrgUnit ───────────────────────────────────────────────────────────────
  {
    entityType: "OrgUnit",
    collectionId: "PLACEHOLDER_ORGUNIT_COLLECTION_UUID",
    label: "CRIS Organisational Units",
  },

  // ── ArchivalResource ──────────────────────────────────────────────────────
  {
    entityType: "ArchivalResource",
    collectionId: "PLACEHOLDER_ARCHIVAL_RESOURCE_COLLECTION_UUID",
    label: "Archival Resources",
  },

  // ── ConceptScheme ─────────────────────────────────────────────────────────
  {
    entityType: "ConceptScheme",
    collectionId: "PLACEHOLDER_CONCEPT_SCHEME_COLLECTION_UUID",
    label: "SKOS Concept Schemes",
  },

  // ── Concept ───────────────────────────────────────────────────────────────
  {
    entityType: "Concept",
    collectionId: "PLACEHOLDER_CONCEPT_COLLECTION_UUID",
    label: "SKOS Concepts",
  },

  // ── Place ──────────────────────────────────────────────────────────────────
  {
    entityType: "Place",
    collectionId: "1fbf6e10-d661-40b5-a957-4dab2e44df84",
    label: "CRIS Places",
  },

  // ── Equipment ─────────────────────────────────────────────────────────────
  {
    entityType: "Equipment",
    collectionId: "2e5b3000-84f5-43ea-b5a2-d51ad188092f",
    label: "CRIS Equipment",
  },

  // ── Funding — Programmes, Calls, Ongoing Calls ────────────────────────────
  {
    entityType: "Funding",
    collectionId: "fa18bc8e-a51b-41b9-8d2c-4f6eca762634",
    label: "CRIS Funding Programmes & Calls",
    conditions: {
      dcTypeIncludes: ["programme", "call", "ongoing call", "ongoing_call"],
    },
  },

  // ── Funding — Grants/Scholarships approved ────────────────────────────────
  {
    entityType: "Funding",
    collectionId: "87d634f1-270d-4cac-a436-e30a39f608a7",
    label: "CRIS Funding Grants (Approved)",
    conditions: {
      dcTypeIncludes: ["grant", "scholarship"],
      risfundingStatusIn: ["approved"],
    },
  },

  // ── Funding — Grants/Scholarships applied/rejected/withdrawn ─────────────
  {
    entityType: "Funding",
    collectionId: "76193153-c3dc-4a33-8c3f-66e507c8aff4",
    label: "CRIS Funding Grants (Applied/Rejected/Withdrawn)",
    conditions: {
      dcTypeIncludes: ["grant", "scholarship"],
      risfundingStatusIn: ["applied", "rejected", "withdrawn"],
    },
  },

  // ── Funding — Grants/Scholarships without status (default bucket) ─────────
  {
    entityType: "Funding",
    collectionId: "76193153-c3dc-4a33-8c3f-66e507c8aff4",
    label: "CRIS Funding Grants (Default)",
    conditions: {
      dcTypeIncludes: ["grant", "scholarship"],
    },
  },
];

// ── Rule matching ─────────────────────────────────────────────────────────────

function matchRule(rule: CollectionRule, context: CollectionContext): boolean {
  const c = rule.conditions;
  if (!c) return true;

  if (c.dcTypeIncludes?.length) {
    const dcType = (context.dcType ?? "").toLowerCase();
    const matched = c.dcTypeIncludes.some((t) => dcType.includes(t.toLowerCase()));
    if (!matched) return false;
  }

  if (c.risfundingStatusIn?.length) {
    const status = (context.risfundingStatus ?? "").toLowerCase();
    const matched = c.risfundingStatusIn.some((s) => s.toLowerCase() === status);
    if (!matched) return false;
  }

  return true;
}

function resolveFromRules(
  rules: CollectionRule[],
  entityType: string,
  context: CollectionContext = {},
): string | null {
  const normalised = entityType.toLowerCase();
  for (const rule of rules) {
    if (rule.entityType.toLowerCase() !== normalised) continue;
    if (matchRule(rule, context)) return rule.collectionId;
  }
  return null;
}

// ── Env config ────────────────────────────────────────────────────────────────

export function getCollectionMappingSource(): "ts" | "django" {
  return import.meta.env.VITE_COLLECTION_MAPPING_SOURCE === "django"
    ? "django"
    : "ts";
}

// ── Rule cache ────────────────────────────────────────────────────────────────

let _rulesCache: CollectionRule[] | null = null;
let _rulesCacheSource: "ts" | "django" | null = null;

async function loadRules(): Promise<CollectionRule[]> {
  if (getCollectionMappingSource() !== "django") {
    return STATIC_COLLECTION_RULES;
  }

  // Return cached Django rules if already loaded
  if (_rulesCache && _rulesCacheSource === "django") return _rulesCache;

  const fallback =
    String(import.meta.env.VITE_COLLECTION_MAPPING_FALLBACK ?? "true").toLowerCase() !== "false";

  try {
    const data = await djangoGet<any>("/api/collection-mappings/");
    const raw: any[] = Array.isArray(data)
      ? data
      : Array.isArray(data?.rules)
        ? data.rules
        : null;

    if (!raw) throw new Error("Unexpected collection-mappings payload");

    const rules: CollectionRule[] = raw.map((r) => ({
      entityType: r.entity_type ?? r.entityType,
      collectionId: r.collection_id ?? r.collectionId,
      label: r.label,
      conditions: r.conditions
        ? {
            dcTypeIncludes: r.conditions.dc_type_includes ?? r.conditions.dcTypeIncludes,
            risfundingStatusIn:
              r.conditions.risfunding_status_in ?? r.conditions.risfundingStatusIn,
          }
        : undefined,
    }));

    _rulesCache = rules;
    _rulesCacheSource = "django";
    return rules;
  } catch (err) {
    if (!fallback) throw err;
    console.warn("[collection-mapping] Django fetch failed, using TS fallback:", err);
    return STATIC_COLLECTION_RULES;
  }
}

/** Invalidate the rule cache (e.g. after saving changes in the admin UI). */
export function invalidateCollectionRuleCache() {
  _rulesCache = null;
  _rulesCacheSource = null;
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Resolves the target collection UUID for an entity type + optional context.
 *
 * @throws Error if no rule matches and no fallback is configured.
 */
export async function resolveCollectionId(
  entityType: string,
  context: CollectionContext = {},
): Promise<string> {
  const rules = await loadRules();
  const id = resolveFromRules(rules, entityType, context);
  if (id) return id;

  throw new Error(
    `No collection mapping found for entity type "${entityType}"` +
      (Object.keys(context).length
        ? ` with context ${JSON.stringify(context)}`
        : "") +
      ". Add a rule to collection-mapping.ts or the Django collection-mappings API.",
  );
}

/**
 * Returns all rules for an entity type (useful for admin UI / debugging).
 */
export async function getRulesForEntityType(
  entityType: string,
): Promise<CollectionRule[]> {
  const rules = await loadRules();
  return rules.filter(
    (r) => r.entityType.toLowerCase() === entityType.toLowerCase(),
  );
}

/**
 * Returns all loaded rules (useful for admin overview UI).
 */
export async function getAllCollectionRules(): Promise<CollectionRule[]> {
  return loadRules();
}

// ── Django CRUD (admin UI) ────────────────────────────────────────────────────

export async function listDjangoCollectionMappings(): Promise<CollectionRule[]> {
  const data = await djangoGet<any>("/api/collection-mappings/");
  return (Array.isArray(data) ? data : data?.rules ?? []).map((r: any) => ({
    entityType: r.entity_type ?? r.entityType,
    collectionId: r.collection_id ?? r.collectionId,
    label: r.label,
    conditions: r.conditions,
  }));
}

export async function createDjangoCollectionMapping(
  rule: Omit<CollectionRule, "label"> & { label?: string },
): Promise<CollectionRule> {
  const created = await djangoFetch<any>("/api/collection-mappings/", {
    method: "POST",
    body: {
      entity_type: rule.entityType,
      collection_id: rule.collectionId,
      label: rule.label,
      conditions: rule.conditions
        ? {
            dc_type_includes: rule.conditions.dcTypeIncludes,
            risfunding_status_in: rule.conditions.risfundingStatusIn,
          }
        : undefined,
    },
  });
  invalidateCollectionRuleCache();
  return created;
}

export async function deleteDjangoCollectionMapping(id: number | string): Promise<void> {
  await djangoFetch<void>(`/api/collection-mappings/${id}/`, { method: "DELETE" });
  invalidateCollectionRuleCache();
}
