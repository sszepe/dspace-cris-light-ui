import React from "react";
import {
  Button,
  ErrorBox,
  FormGrid,
  Labeled,
  ModalShell,
  SectionHeading,
  inputStyle,
} from "./modal-shared";
import {
  createEquipmentWorkspaceItem,
  type EquipmentCreationValues,
} from "../api/equipment-creation-api";

// ── Default values ────────────────────────────────────────────────────────────

function defaultValues(): EquipmentCreationValues {
  return {
    title: "",
    acronym: "",
    internalId: "",
    ownerOu: "",
    ownerRp: "",
    description: "",
  };
}

// ── Component ─────────────────────────────────────────────────────────────────

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated?: (wsId: number) => void;
};

export default function EquipmentCreationModal({
  open,
  onClose,
  onCreated,
}: Props) {
  const [values, setValues] = React.useState<EquipmentCreationValues>(defaultValues());
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [touched, setTouched] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setValues(defaultValues());
      setError(null);
      setTouched(false);
    }
  }, [open]);

  if (!open) return null;

  const titleMissing = touched && !values.title.trim();

  const set = <K extends keyof EquipmentCreationValues>(
    key: K,
    val: EquipmentCreationValues[K],
  ) => setValues((prev) => ({ ...prev, [key]: val }));

  const submit = async () => {
    setTouched(true);
    if (!values.title.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const wsId = await createEquipmentWorkspaceItem(values);
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
      title="Create equipment"
      subtitle="Creates a new DSpace equipment workspace item using the equipment submission definition."
      onClose={onClose}
      width={840}
      footer={
        <>
          <Button onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button
            kind="primary"
            disabled={saving}
            onClick={() => void submit()}
          >
            {saving ? "Creating…" : "Create draft"}
          </Button>
        </>
      }
    >
      <FormGrid>
        <SectionHeading>Identity</SectionHeading>

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
            placeholder="Equipment name"
          />
        </Labeled>

        <Labeled label="Acronym">
          <input
            style={inputStyle}
            value={values.acronym}
            onChange={(e) => set("acronym", e.target.value)}
            placeholder="Optional abbreviation"
          />
        </Labeled>

        <Labeled label="Internal ID" hint="oairecerif.internalid">
          <input
            style={inputStyle}
            value={values.internalId}
            onChange={(e) => set("internalId", e.target.value)}
          />
        </Labeled>

        <SectionHeading>Ownership</SectionHeading>

        <Labeled label="Owner OrgUnit" hint="crisequipment.ownerou">
          <input
            style={inputStyle}
            value={values.ownerOu}
            onChange={(e) => set("ownerOu", e.target.value)}
            placeholder="OrgUnit name or UUID"
          />
        </Labeled>

        <Labeled label="Owner Person" hint="crisequipment.ownerrp">
          <input
            style={inputStyle}
            value={values.ownerRp}
            onChange={(e) => set("ownerRp", e.target.value)}
            placeholder="Person name or UUID"
          />
        </Labeled>

        <SectionHeading>Additional</SectionHeading>

        <Labeled label="Description" span="full">
          <textarea
            style={{ ...inputStyle, minHeight: 100, resize: "vertical" }}
            value={values.description}
            onChange={(e) => set("description", e.target.value)}
          />
        </Labeled>
      </FormGrid>

      {error && <ErrorBox message={error} />}

      <div
        style={{
          fontSize: 12,
          color: "#6b7280",
          background: "#f9fafb",
          border: "1px solid #e5e7eb",
          borderRadius: 8,
          padding: "10px 12px",
        }}
      >
        Fields written: <strong>dc.title</strong>,{" "}
        <strong>oairecerif.acronym</strong>,{" "}
        <strong>oairecerif.internalid</strong>,{" "}
        <strong>crisequipment.ownerou</strong>,{" "}
        <strong>crisequipment.ownerrp</strong>, <strong>dc.description</strong>.
      </div>
    </ModalShell>
  );
}
