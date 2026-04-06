/**
 * place-creation-modal.tsx
 *
 * Creates a DSpace Place workspace item.
 *
 * Features:
 * - dc.type dropdown populated from the place_types vocabulary API
 * - mdwrepo.isActive populated from the truefalse vocabulary API
 * - Type-aware field visibility:
 *     schema_Country  → hide country field (it IS the country)
 *     Venue types     → show address block
 *     All types       → lat/lon, identifiers, hierarchy
 * - Repeatable variant name groups (variant + language + note)
 * - Parent place and containedInPlace typeahead (Place authority search)
 * - Pre-fill from PlaceImportCandidate (authority import workflow)
 */

import React from "react";
import {
  Button,
  ErrorBox,
  FormGrid,
  Labeled,
  ModalShell,
  SectionHeading,
  TypeaheadField,
  // type AuthorityOption,
  inputStyle,
} from "./modal-shared";
import {
  createPlaceWorkspaceItem,
  defaultPlaceValues,
  loadIsActiveOptions,
  loadPlaceTypeOptions,
  searchPlaceAuthorities,
  type NameVariant,
  type PlaceCreationValues,
  type VocabularyEntry,
} from "../api/place-creation-api";

// ── Type visibility helpers ───────────────────────────────────────────────────

/** Types where the entity itself IS a country → no separate country field. */
const COUNTRY_TYPE = "schema_Country";

/** Venue-like types that benefit from a full address block. */
const VENUE_TYPES = new Set([
  "schema_EventVenue",
  "schema_MusicVenue",
  "schema_MovieTheater",
  "schema_Museum",
  "schema_LocalBusiness",
  "schema_EducationalOrganization",
  "schema_PerformingArtsTheater",
  "schema_SportsActivityLocation",
  "schema_LodgingBusiness",
  "schema_FoodEstablishment",
]);

const isVenueType = (t: string) => VENUE_TYPES.has(t);
const isCountryType = (t: string) => t === COUNTRY_TYPE;

// ── NameVariantRow ────────────────────────────────────────────────────────────

function NameVariantRow({
  nv,
  index,
  onChange,
  onRemove,
}: {
  nv: NameVariant;
  index: number;
  onChange: (updated: NameVariant) => void;
  onRemove: () => void;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 120px 1fr auto",
        gap: 8,
        alignItems: "end",
        padding: "10px 12px",
        background: "#f9fafb",
        border: "1px solid #e5e7eb",
        borderRadius: 8,
      }}
    >
      <Labeled label={index === 0 ? "Variant name" : ""}>
        <input
          style={inputStyle}
          value={nv.variant}
          placeholder="Name variant"
          onChange={(e) => onChange({ ...nv, variant: e.target.value })}
        />
      </Labeled>
      <Labeled label={index === 0 ? "Language" : ""}>
        <input
          style={inputStyle}
          value={nv.language}
          placeholder="e.g. de"
          onChange={(e) => onChange({ ...nv, language: e.target.value })}
          maxLength={10}
        />
      </Labeled>
      <Labeled label={index === 0 ? "Note" : ""}>
        <input
          style={inputStyle}
          value={nv.note}
          placeholder="Optional note"
          onChange={(e) => onChange({ ...nv, note: e.target.value })}
        />
      </Labeled>
      <button
        type="button"
        onClick={onRemove}
        style={{
          alignSelf: index === 0 ? "end" : "center",
          marginBottom: index === 0 ? 0 : 0,
          padding: "8px 10px",
          border: "1px solid #fecaca",
          borderRadius: 8,
          background: "#fff7f7",
          color: "#dc2626",
          cursor: "pointer",
          fontSize: 14,
        }}
        title="Remove variant"
      >
        ✕
      </button>
    </div>
  );
}

// ── Prefill adapter ───────────────────────────────────────────────────────────
// Converts a PlaceImportPayload (from place-import-api.ts) into PlaceCreationValues.
// Kept as a separate exported interface so the import modal can pass data in
// without a direct dependency on PlaceCreationValues internals.

export interface PlaceImportPrefill {
  // Identity
  authorized_name?: string;
  other_names?: Array<{ variant: string; language: string; note: string }> | string[];

  // Identifiers
  wikidataId?: string;
  geoNamesId?: string;
  gnd?: string;
  viaf?: string;

  // Location (extracted from authority source)
  country?: string;
  city?: string;
  latitude?: string;
  longitude?: string;
  featureClass?: string;
  featureCode?: string;

  // External URL
  url?: string;
}

function normaliseOtherNames(
  raw?: Array<{ variant: string; language: string; note: string }> | string[],
): NameVariant[] {
  if (!raw?.length) return [];
  // Already-structured variant objects
  if (typeof raw[0] === "object") {
    return (raw as Array<{ variant: string; language: string; note: string }>).map(
      (v) => ({ variant: v.variant ?? "", language: v.language ?? "", note: v.note ?? "" }),
    );
  }
  // Plain strings (legacy)
  return (raw as string[]).filter(Boolean).map((v) => ({
    variant: v,
    language: "",
    note: "",
  }));
}

function prefillToValues(prefill: PlaceImportPrefill): Partial<PlaceCreationValues> {
  return {
    title: prefill.authorized_name ?? "",
    nameVariants: normaliseOtherNames(prefill.other_names),
    wikidataId: prefill.wikidataId ?? "",
    geoNamesId: prefill.geoNamesId ?? "",
    gnd: prefill.gnd ?? "",
    viaf: prefill.viaf ?? "",
    country: prefill.country ?? "",
    city: prefill.city ?? "",
    latitude: prefill.latitude ?? "",
    longitude: prefill.longitude ?? "",
    featureClass: prefill.featureClass ?? "",
    featureCode: prefill.featureCode ?? "",
    url: prefill.url ?? "",
  };
}

// ── Component ─────────────────────────────────────────────────────────────────

type Props = {
  open: boolean;
  /** Pre-fill from an authority import (Wikidata / GND / GeoNames) */
  importPrefill?: PlaceImportPrefill | null;
  onClose: () => void;
  onCreated?: (wsId: number) => void;
};

export default function PlaceCreationModal({
  open,
  importPrefill,
  onClose,
  onCreated,
}: Props) {
  const [values, setValues] = React.useState<PlaceCreationValues>(defaultPlaceValues());
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [touched, setTouched] = React.useState(false);

  // Vocabulary options
  const [typeOptions, setTypeOptions] = React.useState<VocabularyEntry[]>([]);
  const [isActiveOptions, setIsActiveOptions] = React.useState<VocabularyEntry[]>([]);
  const [vocabLoading, setVocabLoading] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;

    // Reset
    const base = defaultPlaceValues();
    const prefilled = importPrefill ? { ...base, ...prefillToValues(importPrefill) } : base;
    setValues(prefilled);
    setError(null);
    setTouched(false);

    // Load vocabularies
    setVocabLoading(true);
    Promise.all([
      loadPlaceTypeOptions().catch(() => []),
      loadIsActiveOptions().catch(() => []),
    ]).then(([types, isActive]) => {
      setTypeOptions(types);
      setIsActiveOptions(isActive);
    }).finally(() => setVocabLoading(false));
  }, [open]);

  if (!open) return null;

  const set = <K extends keyof PlaceCreationValues>(
    key: K,
    val: PlaceCreationValues[K],
  ) => setValues((prev) => ({ ...prev, [key]: val }));

  // Type-aware visibility
  const isCountry = isCountryType(values.dcType);
  const isVenue = isVenueType(values.dcType);

  // Validation
  const titleMissing = touched && !values.title.trim();

  const submit = async () => {
    setTouched(true);
    if (!values.title.trim()) {
      setError("Title is required.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const wsId = await createPlaceWorkspaceItem(values);
      onCreated?.(wsId);
      onClose();
    } catch (e: any) {
      setError(e?.message ?? String(e));
    } finally {
      setSaving(false);
    }
  };

  // Variant name helpers
  const addVariant = () =>
    set("nameVariants", [...values.nameVariants, { variant: "", language: "", note: "" }]);

  const updateVariant = (i: number, updated: NameVariant) =>
    set(
      "nameVariants",
      values.nameVariants.map((nv, idx) => (idx === i ? updated : nv)),
    );

  const removeVariant = (i: number) =>
    set(
      "nameVariants",
      values.nameVariants.filter((_, idx) => idx !== i),
    );

  const isPrefill = Boolean(importPrefill);

  return (
    <ModalShell
      title={isPrefill ? "Import place — review & save" : "Create place"}
      subtitle={
        isPrefill
          ? "Fields pre-filled from authority data. Review everything before saving."
          : "Creates a new DSpace Place workspace item using the place submission definition."
      }
      onClose={onClose}
      width={1020}
      footer={
        <>
          <Button onClick={onClose} disabled={saving}>Cancel</Button>
          <Button kind="primary" disabled={saving || vocabLoading} onClick={() => void submit()}>
            {saving ? "Creating…" : "Create draft"}
          </Button>
        </>
      }
    >
      {isPrefill && (
        <div
          style={{
            background: "#f0f7ff",
            border: "1px solid #c5d8f7",
            borderRadius: 8,
            padding: "8px 12px",
            fontSize: 12,
            color: "#2a5db0",
          }}
        >
          ℹ️ Fields pre-filled from authority data. Review all fields before saving — especially
          the place type and country.
        </div>
      )}

      <FormGrid>
        {/* ── Identity ── */}
        <SectionHeading>Identity</SectionHeading>

        <Labeled label="Title" required error={titleMissing ? "Title is required." : null}>
          <input
            style={{ ...inputStyle, borderColor: titleMissing ? "#dc2626" : "#d1d5db" }}
            value={values.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Official / authorized name"
          />
        </Labeled>

        <Labeled label="Type" hint="dc.type">
          <select
            style={inputStyle}
            value={values.dcType}
            disabled={vocabLoading}
            onChange={(e) => {
              set("dcType", e.target.value);
              // Country type: clear country field (it would be redundant)
              if (e.target.value === COUNTRY_TYPE) set("country", "");
            }}
          >
            <option value="">— Select type —</option>
            {typeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.display}</option>
            ))}
          </select>
        </Labeled>

        <Labeled label="Active" hint="mdwrepo.isActive">
          <select
            style={inputStyle}
            value={values.isActive}
            disabled={vocabLoading}
            onChange={(e) => set("isActive", e.target.value)}
          >
            <option value="">— Not specified —</option>
            {isActiveOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.display}</option>
            ))}
          </select>
        </Labeled>

        <Labeled label="Description" span="full">
          <textarea
            style={{ ...inputStyle, minHeight: 80, resize: "vertical" }}
            value={values.description}
            onChange={(e) => set("description", e.target.value)}
          />
        </Labeled>
      </FormGrid>

      {/* ── Variant names ── */}
      <div>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "#6b7280",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            paddingBottom: 8,
            borderBottom: "1px solid #e5e7eb",
            marginBottom: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span>Variant names</span>
          <button
            type="button"
            onClick={addVariant}
            style={{
              fontSize: 12,
              fontWeight: 600,
              padding: "3px 10px",
              borderRadius: 6,
              border: "1px solid #d1d5db",
              background: "#fff",
              cursor: "pointer",
              color: "#374151",
            }}
          >
            + Add variant
          </button>
        </div>

        {values.nameVariants.length === 0 ? (
          <div style={{ fontSize: 12, color: "#9ca3af" }}>
            No variant names — click "+ Add variant" to add alternate or parallel forms.
          </div>
        ) : (
          <div style={{ display: "grid", gap: 8 }}>
            {values.nameVariants.map((nv, i) => (
              <NameVariantRow
                key={i}
                nv={nv}
                index={i}
                onChange={(updated) => updateVariant(i, updated)}
                onRemove={() => removeVariant(i)}
              />
            ))}
          </div>
        )}
      </div>

      <FormGrid>
        {/* ── Location ── */}
        <SectionHeading>Location</SectionHeading>

        {/* Country hidden when type IS country */}
        {!isCountry && (
          <Labeled label="Country" hint="mdwrepo.place.country">
            <input
              style={inputStyle}
              value={values.country}
              onChange={(e) => set("country", e.target.value)}
              placeholder="e.g. Austria"
            />
          </Labeled>
        )}

        <Labeled label="City" hint="mdwrepo.place.city">
          <input
            style={inputStyle}
            value={values.city}
            onChange={(e) => set("city", e.target.value)}
            placeholder="City name"
          />
        </Labeled>

        {/* Address block — shown for venue types */}
        {isVenue && (
          <>
            <Labeled label="Street address" hint="place.address.streetAddress">
              <input
                style={inputStyle}
                value={values.addressStreet}
                onChange={(e) => set("addressStreet", e.target.value)}
                placeholder="Street and number"
              />
            </Labeled>
            <Labeled label="Postal code" hint="place.address.postalCode">
              <input
                style={inputStyle}
                value={values.addressPostalCode}
                onChange={(e) => set("addressPostalCode", e.target.value)}
                placeholder="e.g. 1010"
              />
            </Labeled>
            <Labeled label="Region / state" hint="place.address.addressRegion">
              <input
                style={inputStyle}
                value={values.addressRegion}
                onChange={(e) => set("addressRegion", e.target.value)}
                placeholder="Province, state, or Bundesland"
              />
            </Labeled>
          </>
        )}

        <Labeled label="Latitude" hint="place.latitude">
          <input
            style={inputStyle}
            value={values.latitude}
            onChange={(e) => set("latitude", e.target.value)}
            placeholder="e.g. 48.2082"
            type="text"
            inputMode="decimal"
          />
        </Labeled>
        <Labeled label="Longitude" hint="place.longitude">
          <input
            style={inputStyle}
            value={values.longitude}
            onChange={(e) => set("longitude", e.target.value)}
            placeholder="e.g. 16.3738"
            type="text"
            inputMode="decimal"
          />
        </Labeled>

        {/* ── Hierarchy ── */}
        <SectionHeading>Hierarchy</SectionHeading>

        <TypeaheadField
          label="Parent place"
          hint="mdwrepo.place.parentPlace"
          placeholder="Search Place…"
          value={values.parentPlace}
          onChange={(next) => set("parentPlace", next)}
          onSearch={searchPlaceAuthorities}
        />
        <TypeaheadField
          label="Contained in place"
          hint="place.containedInPlace"
          placeholder="Search Place…"
          value={values.containedInPlace}
          onChange={(next) => set("containedInPlace", next)}
          onSearch={searchPlaceAuthorities}
        />

        {/* ── GeoNames feature classification ── */}
        <SectionHeading>Feature classification (GeoNames)</SectionHeading>

        <Labeled label="Feature class" hint="mdwrepo.place.featureClass">
          <input
            style={inputStyle}
            value={values.featureClass}
            onChange={(e) => set("featureClass", e.target.value)}
            placeholder="e.g. P"
          />
        </Labeled>
        <Labeled label="Feature code" hint="mdwrepo.place.featureCode">
          <input
            style={inputStyle}
            value={values.featureCode}
            onChange={(e) => set("featureCode", e.target.value)}
            placeholder="e.g. PPLA3"
          />
        </Labeled>

        {/* ── Identifiers ── */}
        <SectionHeading>Identifiers</SectionHeading>

        <Labeled label="GeoNames ID" hint="place.identifier.geoNames">
          <input
            style={inputStyle}
            value={values.geoNamesId}
            onChange={(e) => set("geoNamesId", e.target.value)}
            placeholder="e.g. 2761369"
          />
        </Labeled>
        <Labeled label="Wikidata QID" hint="dc.identifier.wikidata">
          <input
            style={inputStyle}
            value={values.wikidataId}
            onChange={(e) => set("wikidataId", e.target.value)}
            placeholder="e.g. Q1741"
          />
        </Labeled>
        <Labeled label="GND identifier" hint="mdwrepo.identifier.gnd">
          <input
            style={inputStyle}
            value={values.gnd}
            onChange={(e) => set("gnd", e.target.value)}
            placeholder="e.g. 4066009-6"
          />
        </Labeled>
        <Labeled label="VIAF identifier" hint="mdwrepo.identifier.viaf">
          <input
            style={inputStyle}
            value={values.viaf}
            onChange={(e) => set("viaf", e.target.value)}
            placeholder="e.g. 147006617"
          />
        </Labeled>
        <Labeled label="Global Location Number (GLN)" hint="place.identifier.globalLocationNumber">
          <input
            style={inputStyle}
            value={values.gln}
            onChange={(e) => set("gln", e.target.value)}
          />
        </Labeled>

        {/* ── External URLs ── */}
        <SectionHeading>External URL</SectionHeading>

        <Labeled label="URL" hint="oairecerif.identifier.url" span="full">
          <input
            style={inputStyle}
            value={values.url}
            onChange={(e) => set("url", e.target.value)}
            placeholder="https://…"
            type="url"
          />
        </Labeled>
      </FormGrid>

      {error && <ErrorBox message={error} />}

      <div
        style={{
          fontSize: 11,
          color: "#9ca3af",
          background: "#f9fafb",
          border: "1px solid #e5e7eb",
          borderRadius: 8,
          padding: "9px 12px",
          lineHeight: 1.6,
        }}
      >
        Fields written: <strong>dc.title</strong>, <strong>dc.type</strong>,{" "}
        <strong>mdwrepo.isActive</strong>, <strong>dc.description</strong>,{" "}
        <strong>mdwrepo.name.variant</strong> (repeatable),{" "}
        <strong>mdwrepo.place.city/country</strong>,{" "}
        {isVenue && <><strong>place.address.*</strong>, </>}
        <strong>place.latitude/longitude</strong>,{" "}
        <strong>mdwrepo.place.parentPlace</strong>,{" "}
        <strong>place.containedInPlace</strong>,{" "}
        <strong>place.identifier.geoNames</strong>,{" "}
        <strong>dc.identifier.wikidata</strong>,{" "}
        <strong>mdwrepo.identifier.gnd/viaf</strong>,{" "}
        <strong>oairecerif.identifier.url</strong>.
      </div>
    </ModalShell>
  );
}
