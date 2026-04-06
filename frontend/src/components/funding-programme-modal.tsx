import React from "react";
import {
  Button,
  ErrorBox,
  FormGrid,
  Labeled,
  ModalShell,
  SectionHeading,
  TypeaheadField,
  type AuthorityOption,
  inputStyle,
} from "./modal-shared";
import {
  createFundingProgrammeWorkspaceItem,
  fetchFundingTypeOptions,
  searchFundingParentAuthorities,
  searchOrgUnitAuthorities,
  type FundingProgrammeCreateValues,
  type FundingTypeOption,
} from "../api/funding-programme-api";

// ── Default values ────────────────────────────────────────────────────────────

function defaultValues(initial?: Partial<FundingProgrammeCreateValues> | null): FundingProgrammeCreateValues {
  return {
    fundingTypeAuthority: initial?.fundingTypeAuthority ?? "funding-types:mdw_fu006",
    fundingTypeValue: initial?.fundingTypeValue ?? "Programme",
    title: initial?.title ?? "",
    funderUuid: initial?.funderUuid ?? "",
    funderLabel: initial?.funderLabel ?? "",
    acronym: initial?.acronym ?? "",
    parentFundingUuid: initial?.parentFundingUuid ?? "",
    parentFundingLabel: initial?.parentFundingLabel ?? "",
    description: initial?.description ?? "",
    identifierCrossrefGrantId: initial?.identifierCrossrefGrantId ?? "",
    identifierProjectNumber: initial?.identifierProjectNumber ?? "",
    identifierApplicationNumber: initial?.identifierApplicationNumber ?? "",
    identifierRisSynergy: initial?.identifierRisSynergy ?? "",
    url: initial?.url ?? "",
    applicationDeadline: initial?.applicationDeadline ?? "",
    fundingStartDate: initial?.fundingStartDate ?? "",
    fundingEndDate: initial?.fundingEndDate ?? "",
  };
}

// ── Component ─────────────────────────────────────────────────────────────────

type Props = {
  open: boolean;
  initialValue?: Partial<FundingProgrammeCreateValues> | null;
  onClose: () => void;
  onCreated?: (wsId: number) => void;
};

export default function FundingProgrammeModal({
  open,
  initialValue,
  onClose,
  onCreated,
}: Props) {
  const [values, setValues] = React.useState<FundingProgrammeCreateValues>(
    defaultValues(initialValue),
  );
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [touched, setTouched] = React.useState(false);
  const [types, setTypes] = React.useState<FundingTypeOption[]>([]);
  const [typesLoading, setTypesLoading] = React.useState(false);

  // Funder and parent as AuthorityOption objects for TypeaheadField
  const [funder, setFunder] = React.useState<AuthorityOption | null>(
    values.funderUuid ? { id: values.funderUuid, label: values.funderLabel } : null,
  );
  const [parent, setParent] = React.useState<AuthorityOption | null>(
    values.parentFundingUuid
      ? { id: values.parentFundingUuid, label: values.parentFundingLabel }
      : null,
  );

  React.useEffect(() => {
    if (!open) return;
    const init = defaultValues(initialValue);
    setValues(init);
    setFunder(init.funderUuid ? { id: init.funderUuid, label: init.funderLabel } : null);
    setParent(init.parentFundingUuid ? { id: init.parentFundingUuid, label: init.parentFundingLabel } : null);
    setError(null);
    setTouched(false);

    let alive = true;
    setTypesLoading(true);
    fetchFundingTypeOptions()
      .then((rows) => {
        if (!alive) return;
        setTypes(rows);
        const found = rows.find((r) => r.authority === init.fundingTypeAuthority) ?? rows[0];
        if (found) {
          setValues((prev) => ({
            ...prev,
            fundingTypeAuthority: found.authority,
            fundingTypeValue: found.value,
          }));
        }
      })
      .finally(() => {
        if (alive) setTypesLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [open]);

  if (!open) return null;

  const set = <K extends keyof FundingProgrammeCreateValues>(
    key: K,
    val: FundingProgrammeCreateValues[K],
  ) => setValues((prev) => ({ ...prev, [key]: val }));

  // A Call/Ongoing Call requires a parent programme
  const isCallLike =
    values.fundingTypeAuthority === "funding-types:mdw_fu007" ||
    values.fundingTypeAuthority === "funding-types:mdw_fu008";

  const titleMissing = touched && !values.title.trim();
  const funderMissing = touched && !values.funderUuid.trim();
  const parentMissing = touched && isCallLike && !values.parentFundingUuid.trim();

  // Stable searcher for parent that passes current type authority
  const searchParent = React.useCallback(
    (q: string) => searchFundingParentAuthorities(q, values.fundingTypeAuthority),
    [values.fundingTypeAuthority],
  );

  const submit = async () => {
    setTouched(true);
    if (!values.title.trim() || !values.funderUuid.trim()) return;
    if (isCallLike && !values.parentFundingUuid.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const wsId = await createFundingProgrammeWorkspaceItem(values);
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
      title="Create funding programme / call"
      subtitle="Creates a new DSpace funding programme, call, or ongoing call workspace item."
      onClose={onClose}
      footer={
        <>
          <Button onClick={onClose} disabled={saving}>Cancel</Button>
          <Button
            kind="primary"
            disabled={saving || typesLoading}
            onClick={() => void submit()}
          >
            {saving ? "Creating…" : "Create draft"}
          </Button>
        </>
      }
    >
      <FormGrid>
        {/* ── Type & mandatory ── */}
        <SectionHeading>Type &amp; mandatory fields</SectionHeading>

        <Labeled label="Type" required>
          <select
            style={inputStyle}
            value={values.fundingTypeAuthority}
            disabled={typesLoading}
            onChange={(e) => {
              const sel = types.find((t) => t.authority === e.target.value);
              set("fundingTypeAuthority", sel?.authority ?? e.target.value);
              set("fundingTypeValue", sel?.value ?? "");
            }}
          >
            {types.map((t) => (
              <option key={t.authority} value={t.authority}>{t.display}</option>
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

        <TypeaheadField
          label="Funder"
          required
          placeholder="Search OrgUnit funder…"
          value={funder}
          onChange={(next) => {
            setFunder(next);
            set("funderUuid", next?.id ?? "");
            set("funderLabel", next?.label ?? "");
          }}
          onSearch={searchOrgUnitAuthorities}
          error={funderMissing ? "Funder is required." : null}
        />

        <Labeled label="Acronym">
          <input style={inputStyle} value={values.acronym} onChange={(e) => set("acronym", e.target.value)} />
        </Labeled>

        <TypeaheadField
          label={isCallLike ? "Programme" : "Parent programme"}
          required={isCallLike}
          placeholder={isCallLike ? "Search parent programme…" : "Optional parent programme…"}
          value={parent}
          onChange={(next) => {
            setParent(next);
            set("parentFundingUuid", next?.id ?? "");
            set("parentFundingLabel", next?.label ?? "");
          }}
          onSearch={searchParent}
          error={
            parentMissing
              ? "Programme relation is required for Call and Ongoing Call."
              : null
          }
          hint={isCallLike ? "Calls should be linked to a Programme" : undefined}
        />

        <Labeled label="URL">
          <input style={inputStyle} value={values.url} onChange={(e) => set("url", e.target.value)} placeholder="https://…" />
        </Labeled>

        {/* ── Identifiers ── */}
        <SectionHeading>Identifiers</SectionHeading>

        <Labeled label="Crossref Grant ID">
          <input style={inputStyle} value={values.identifierCrossrefGrantId} onChange={(e) => set("identifierCrossrefGrantId", e.target.value)} />
        </Labeled>
        <Labeled label="Project number">
          <input style={inputStyle} value={values.identifierProjectNumber} onChange={(e) => set("identifierProjectNumber", e.target.value)} />
        </Labeled>
        <Labeled label="Application number">
          <input style={inputStyle} value={values.identifierApplicationNumber} onChange={(e) => set("identifierApplicationNumber", e.target.value)} />
        </Labeled>
        <Labeled label="RIS Synergy ID">
          <input style={inputStyle} value={values.identifierRisSynergy} onChange={(e) => set("identifierRisSynergy", e.target.value)} />
        </Labeled>

        {/* ── Dates ── */}
        <SectionHeading>Dates</SectionHeading>

        <Labeled label="Application deadline">
          <input type="date" style={inputStyle} value={values.applicationDeadline} onChange={(e) => set("applicationDeadline", e.target.value)} />
        </Labeled>
        <Labeled label="Funding start date">
          <input type="date" style={inputStyle} value={values.fundingStartDate} onChange={(e) => set("fundingStartDate", e.target.value)} />
        </Labeled>
        <Labeled label="Funding end date">
          <input type="date" style={inputStyle} value={values.fundingEndDate} onChange={(e) => set("fundingEndDate", e.target.value)} />
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
