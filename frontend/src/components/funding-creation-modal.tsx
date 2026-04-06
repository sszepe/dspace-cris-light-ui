import React from "react";
import {
  Button,
  ErrorBox,
  FormGrid,
  Labeled,
  ModalShell,
  SectionHeading,
  TypeaheadField,
  inputStyle,
} from "./modal-shared";
import {
  createFundingWorkspaceItem,
  loadVocabularyTop,
  searchFundingProgrammes,
  searchOrgUnits,
  searchProjects,
  type FundingCreationValues,
  type VocabularyOption,
} from "../api/funding-creation-api";

// ── Helpers ───────────────────────────────────────────────────────────────────

function optionByAuthority(options: VocabularyOption[], authority: string) {
  return options.find((o) => o.authority === authority) ?? null;
}

function defaultValues(): FundingCreationValues {
  return {
    fundingTypeAuthority: "funding-types:mdw_fu005",
    fundingTypeValue: "Grant",
    legalTypeAuthority: "",
    legalTypeValue: "",
    title: "",
    applicationDate: "",
    statusAuthority: "",
    statusValue: "",
    acronym: "",
    alternativeTitle: "",
    translationTypeAuthority: "",
    translationTypeValue: "",
    crossrefGrantId: "",
    projectNumber: "",
    applicationNumber: "",
    risSynergyId: "",
    internalId: "",
    relatedProject: null,
    funder: null,
    relatedProgramme: null,
    relatedCall: null,
    oaMandate: "",
    oaMandateUrl: "",
    fundingIdentifier: "",
    fundingStartDate: "",
    fundingEndDate: "",
    description: "",
    awardUrl: "",
  };
}

// ── Component ─────────────────────────────────────────────────────────────────

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated?: (wsId: number) => void;
};

export default function FundingCreationModal({ open, onClose, onCreated }: Props) {
  const [values, setValues] = React.useState<FundingCreationValues>(defaultValues());
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [touched, setTouched] = React.useState(false);

  const [fundingTypeOptions, setFundingTypeOptions] = React.useState<VocabularyOption[]>([]);
  const [legalTypeOptions, setLegalTypeOptions] = React.useState<VocabularyOption[]>([]);
  const [statusOptions, setStatusOptions] = React.useState<VocabularyOption[]>([]);
  const [translationOptions, setTranslationOptions] = React.useState<VocabularyOption[]>([]);

  React.useEffect(() => {
    if (!open) return;
    setValues(defaultValues());
    setError(null);
    setTouched(false);

    Promise.all([
      loadVocabularyTop("funding-types"),
      loadVocabularyTop("rissynergy_legal_type").catch(() => []),
      loadVocabularyTop("rissynergy_funding_status").catch(() => []),
      loadVocabularyTop("rissynergy_translation").catch(() => []),
    ]).then(([fundingTypes, legalTypes, statuses, translations]) => {
      // Only Grant (mdw_fu005) and Scholarship (mdw_fu010) for this form
      const filtered = fundingTypes.filter((o) =>
        ["funding-types:mdw_fu005", "funding-types:mdw_fu010"].includes(o.authority),
      );
      setFundingTypeOptions(filtered);
      setLegalTypeOptions(legalTypes);
      setStatusOptions(statuses);
      setTranslationOptions(translations);
      const first = filtered[0];
      if (first) {
        setValues((prev) => ({
          ...prev,
          fundingTypeAuthority: first.authority,
          fundingTypeValue: first.value,
        }));
      }
    });
  }, [open]);

  if (!open) return null;

  const set = <K extends keyof FundingCreationValues>(
    key: K,
    val: FundingCreationValues[K],
  ) => setValues((prev) => ({ ...prev, [key]: val }));

  const titleMissing = touched && !values.title.trim();
  const dateMissing = touched && !values.applicationDate.trim();
  const legalMissing = touched && !values.legalTypeAuthority;

  const submit = async () => {
    setTouched(true);
    if (!values.title.trim() || !values.applicationDate.trim() || !values.legalTypeAuthority) {
      setError("Please fill all required fields: legal type, title, and application date.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const selectedFundingType = optionByAuthority(fundingTypeOptions, values.fundingTypeAuthority);
      const selectedLegalType = optionByAuthority(legalTypeOptions, values.legalTypeAuthority);
      const selectedStatus = optionByAuthority(statusOptions, values.statusAuthority ?? "");
      const selectedTranslation = optionByAuthority(translationOptions, values.translationTypeAuthority ?? "");

      const wsId = await createFundingWorkspaceItem({
        ...values,
        fundingTypeValue: selectedFundingType?.value ?? values.fundingTypeValue,
        legalTypeValue: selectedLegalType?.value ?? values.legalTypeValue,
        statusValue: selectedStatus?.value ?? values.statusValue,
        translationTypeValue: selectedTranslation?.value ?? values.translationTypeValue,
      });
      onCreated?.(wsId);
      onClose();
    } catch (e: any) {
      setError(e?.message ?? String(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalShell
      title="Create funding"
      subtitle="Creates a new funding workspace draft for grant or scholarship records."
      onClose={onClose}
      footer={
        <>
          <Button onClick={onClose} disabled={saving}>Cancel</Button>
          <Button kind="primary" disabled={saving} onClick={() => void submit()}>
            {saving ? "Creating…" : "Create draft"}
          </Button>
        </>
      }
    >
      <FormGrid>
        {/* ── Type & mandatory ── */}
        <SectionHeading>Type &amp; mandatory fields</SectionHeading>

        <Labeled label="Funding type" required>
          <select
            style={inputStyle}
            value={values.fundingTypeAuthority}
            onChange={(e) => {
              const sel = optionByAuthority(fundingTypeOptions, e.target.value);
              set("fundingTypeAuthority", e.target.value);
              set("fundingTypeValue", sel?.value ?? "");
            }}
          >
            {fundingTypeOptions.map((opt) => (
              <option key={opt.authority} value={opt.authority}>{opt.display}</option>
            ))}
          </select>
        </Labeled>

        <Labeled
          label="Legal type"
          required
          error={legalMissing ? "Legal type is required." : null}
        >
          <select
            style={{
              ...inputStyle,
              borderColor: legalMissing ? "#dc2626" : "#d1d5db",
            }}
            value={values.legalTypeAuthority}
            onChange={(e) => {
              const sel = optionByAuthority(legalTypeOptions, e.target.value);
              set("legalTypeAuthority", e.target.value);
              set("legalTypeValue", sel?.value ?? "");
            }}
          >
            <option value="">Select legal type…</option>
            {legalTypeOptions.map((opt) => (
              <option key={opt.authority} value={opt.authority}>{opt.display}</option>
            ))}
          </select>
        </Labeled>

        <Labeled
          label="Title"
          required
          error={titleMissing ? "Title is required." : null}
        >
          <input
            style={{
              ...inputStyle,
              borderColor: titleMissing ? "#dc2626" : "#d1d5db",
            }}
            value={values.title}
            onChange={(e) => set("title", e.target.value)}
          />
        </Labeled>

        <Labeled
          label="Application date"
          required
          error={dateMissing ? "Application date is required." : null}
        >
          <input
            type="date"
            style={{
              ...inputStyle,
              borderColor: dateMissing ? "#dc2626" : "#d1d5db",
            }}
            value={values.applicationDate}
            onChange={(e) => set("applicationDate", e.target.value)}
          />
        </Labeled>

        {/* ── Identifiers ── */}
        <SectionHeading>Identifiers</SectionHeading>

        <Labeled label="Acronym">
          <input style={inputStyle} value={values.acronym} onChange={(e) => set("acronym", e.target.value)} />
        </Labeled>
        <Labeled label="Alternative title">
          <input style={inputStyle} value={values.alternativeTitle} onChange={(e) => set("alternativeTitle", e.target.value)} />
        </Labeled>
        <Labeled label="Crossref Grant ID">
          <input style={inputStyle} value={values.crossrefGrantId} onChange={(e) => set("crossrefGrantId", e.target.value)} />
        </Labeled>
        <Labeled label="Project number">
          <input style={inputStyle} value={values.projectNumber} onChange={(e) => set("projectNumber", e.target.value)} />
        </Labeled>
        <Labeled label="Application number">
          <input style={inputStyle} value={values.applicationNumber} onChange={(e) => set("applicationNumber", e.target.value)} />
        </Labeled>
        <Labeled label="RIS Synergy ID">
          <input style={inputStyle} value={values.risSynergyId} onChange={(e) => set("risSynergyId", e.target.value)} />
        </Labeled>
        <Labeled label="Internal ID">
          <input style={inputStyle} value={values.internalId} onChange={(e) => set("internalId", e.target.value)} />
        </Labeled>
        <Labeled label="Funding identifier">
          <input style={inputStyle} value={values.fundingIdentifier} onChange={(e) => set("fundingIdentifier", e.target.value)} />
        </Labeled>

        {/* ── Relations ── */}
        <SectionHeading>Relations</SectionHeading>

        <TypeaheadField
          label="Funder"
          placeholder="Search OrgUnit…"
          hint="OrgUnit authority"
          value={values.funder ?? null}
          onChange={(next) => set("funder", next)}
          onSearch={searchOrgUnits}
        />
        <TypeaheadField
          label="Related project"
          placeholder="Search project…"
          value={values.relatedProject ?? null}
          onChange={(next) => set("relatedProject", next)}
          onSearch={searchProjects}
        />
        <TypeaheadField
          label="Related programme"
          placeholder="Search funding programme…"
          value={values.relatedProgramme ?? null}
          onChange={(next) => set("relatedProgramme", next)}
          onSearch={searchFundingProgrammes}
        />
        <TypeaheadField
          label="Related call"
          placeholder="Search funding call…"
          value={values.relatedCall ?? null}
          onChange={(next) => set("relatedCall", next)}
          onSearch={searchFundingProgrammes}
        />

        {/* ── Status & classification ── */}
        <SectionHeading>Status &amp; classification</SectionHeading>

        <Labeled label="Status">
          <select
            style={inputStyle}
            value={values.statusAuthority ?? ""}
            onChange={(e) => {
              const sel = optionByAuthority(statusOptions, e.target.value);
              set("statusAuthority", e.target.value);
              set("statusValue", sel?.value ?? "");
            }}
          >
            <option value="">Select status…</option>
            {statusOptions.map((opt) => (
              <option key={opt.authority} value={opt.authority}>{opt.display}</option>
            ))}
          </select>
        </Labeled>

        <Labeled label="Translation type">
          <select
            style={inputStyle}
            value={values.translationTypeAuthority ?? ""}
            onChange={(e) => {
              const sel = optionByAuthority(translationOptions, e.target.value);
              set("translationTypeAuthority", e.target.value);
              set("translationTypeValue", sel?.value ?? "");
            }}
          >
            <option value="">Select translation type…</option>
            {translationOptions.map((opt) => (
              <option key={opt.authority} value={opt.authority}>{opt.display}</option>
            ))}
          </select>
        </Labeled>

        <Labeled label="OA mandate">
          <select
            style={inputStyle}
            value={values.oaMandate ?? ""}
            onChange={(e) => set("oaMandate", e.target.value as any)}
          >
            <option value="">Not specified</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </Labeled>
        <Labeled label="OA mandate URL">
          <input style={inputStyle} value={values.oaMandateUrl} onChange={(e) => set("oaMandateUrl", e.target.value)} />
        </Labeled>

        {/* ── Dates ── */}
        <SectionHeading>Dates</SectionHeading>

        <Labeled label="Funding start date">
          <input type="date" style={inputStyle} value={values.fundingStartDate} onChange={(e) => set("fundingStartDate", e.target.value)} />
        </Labeled>
        <Labeled label="Funding end date">
          <input type="date" style={inputStyle} value={values.fundingEndDate} onChange={(e) => set("fundingEndDate", e.target.value)} />
        </Labeled>

        <Labeled label="Award URL" hint="crisfund.award.url">
          <input style={inputStyle} value={values.awardUrl} onChange={(e) => set("awardUrl", e.target.value)} />
        </Labeled>

        {/* ── Description ── */}
        <SectionHeading>Description</SectionHeading>

        <Labeled label="Description" span="full">
          <textarea
            style={{ ...inputStyle, minHeight: 100, resize: "vertical" }}
            value={values.description}
            onChange={(e) => set("description", e.target.value)}
          />
        </Labeled>
      </FormGrid>

      {error && <ErrorBox message={error} />}
    </ModalShell>
  );
}
