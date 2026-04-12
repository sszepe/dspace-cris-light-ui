/**
 * collection-create-modal.tsx
 *
 * Modal for creating a new DSpace collection under a parent community.
 *
 * Fields (mirrors the DSpace Angular UI collection form):
 *   dc.title                        — required
 *   dc.description                  — introductory text (HTML allowed)
 *   dc.description.abstract         — short description
 *   dc.rights                       — copyright text (HTML allowed)
 *   dc.description.tableofcontents  — news / sidebar (HTML allowed)
 *   dc.rights.license               — license identifier
 *   dspace.entity.type              — entity type (e.g. Funding)
 *   cris.submission.definition      — submission form key
 *   cris.submission.definition-correction — correction form key
 *   cris.workspace.shared           — boolean toggle
 *
 * Props:
 *   open           — controls visibility
 *   parentCommunityId   — required; the community to create the collection under
 *   parentCommunityName — shown in the subtitle for context
 *   onClose        — called on cancel / close
 *   onCreated      — called with { id, name, parentId } after success
 */

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
  createCollection,
  type CollectionPayload,
} from "../api/collection-api";
import { DECLARED_ENTITY_TYPES } from "../profiles/plain/config/entities-config";
import { SUBMISSION_PROCESSES } from "../profiles/plain/config/submission-config";

// ── Default values ────────────────────────────────────────────────────────────

function defaultValues(): CollectionPayload {
  return {
    title: "",
    description: "",
    abstract: "",
    rights: "",
    tableOfContents: "",
    license: "",
    entityType: "",
    submissionDefinition: "",
    submissionDefinitionCorrection: "",
    workspaceShared: false,
  };
}

// ── Component ─────────────────────────────────────────────────────────────────

type Props = {
  open: boolean;
  parentCommunityId: string;
  parentCommunityName: string;
  onClose: () => void;
  onCreated?: (collection: { id: string; name: string; parentId: string }) => void;
};

export default function CollectionCreateModal({
  open,
  parentCommunityId,
  parentCommunityName,
  onClose,
  onCreated,
}: Props) {
  const [values, setValues] = React.useState<CollectionPayload>(defaultValues());
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

  const set = <K extends keyof CollectionPayload>(k: K, v: CollectionPayload[K]) =>
    setValues((prev) => ({ ...prev, [k]: v }));

  const titleMissing = touched && !values.title.trim();

  const submit = async () => {
    setTouched(true);
    if (!values.title.trim()) { setError("Title is required."); return; }
    setSaving(true);
    setError(null);
    try {
      const created = await createCollection(parentCommunityId, values);
      onCreated?.({ id: created.id, name: created.name, parentId: parentCommunityId });
      onClose();
    } catch (e: any) {
      setError(e?.message ?? String(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalShell
      title="Create collection"
      subtitle={`Creates a new DSpace collection under "${parentCommunityName}"`}
      onClose={onClose}
      width={780}
      footer={
        <>
          <Button onClick={onClose} disabled={saving}>Cancel</Button>
          <Button kind="primary" disabled={saving} onClick={() => void submit()}>
            {saving ? "Creating…" : "Create collection"}
          </Button>
        </>
      }
    >
      {error && <ErrorBox message={error} />}

      <FormGrid>
        {/* ── Title ── */}
        <SectionHeading>Title</SectionHeading>

        <Labeled
          label="Title"
          required
          error={titleMissing ? "Title is required." : null}
        >
          <input
            style={{ ...inputStyle, borderColor: titleMissing ? "#fca5a5" : undefined }}
            value={values.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Collection name"
            autoFocus
          />
        </Labeled>

        {/* ── Descriptions ── */}
        <SectionHeading>Descriptions</SectionHeading>

        <Labeled
          label="Introductory text"
          hint="Shown as the collection introduction. HTML is supported (e.g. &lt;h1&gt;, &lt;p&gt;)."
        >
          <textarea
            style={{ ...inputStyle, minHeight: 72, resize: "vertical" }}
            value={values.description ?? ""}
            onChange={(e) => set("description", e.target.value)}
            placeholder="<h1>Introduction</h1>"
          />
        </Labeled>

        <Labeled label="Short description" hint="Plain text summary shown in collection listings.">
          <input
            style={inputStyle}
            value={values.abstract ?? ""}
            onChange={(e) => set("abstract", e.target.value)}
            placeholder="Brief description of the collection"
          />
        </Labeled>

        <Labeled
          label="News / sidebar text"
          hint="HTML is supported."
        >
          <textarea
            style={{ ...inputStyle, minHeight: 60, resize: "vertical" }}
            value={values.tableOfContents ?? ""}
            onChange={(e) => set("tableOfContents", e.target.value)}
            placeholder="<h1>News</h1>"
          />
        </Labeled>

        {/* ── Rights ── */}
        <SectionHeading>Rights &amp; licence</SectionHeading>

        <Labeled
          label="Copyright text"
          hint="HTML is supported."
        >
          <textarea
            style={{ ...inputStyle, minHeight: 60, resize: "vertical" }}
            value={values.rights ?? ""}
            onChange={(e) => set("rights", e.target.value)}
            placeholder="<h1>Copyright</h1>"
          />
        </Labeled>

        <Labeled label="Licence" hint="e.g. CC-BY-NC-ND-4">
          <input
            style={inputStyle}
            value={values.license ?? ""}
            onChange={(e) => set("license", e.target.value)}
            placeholder="CC-BY-NC-ND-4"
          />
        </Labeled>

        {/* ── CRIS / submission config ── */}
        <SectionHeading>Entity &amp; submission configuration</SectionHeading>

        <Labeled label="Entity type" hint="dspace.entity.type — selects the CRIS entity this collection holds">
          <select
            style={inputStyle}
            value={values.entityType ?? ""}
            onChange={(e) => set("entityType", e.target.value)}
          >
            <option value="">— none —</option>
            {DECLARED_ENTITY_TYPES.map((et: string) => (
              <option key={et} value={et}>{et}</option>
            ))}
          </select>
        </Labeled>

        <Labeled
          label="Submission definition"
          hint="cris.submission.definition — the submission process used on creation"
        >
          <select
            style={inputStyle}
            value={values.submissionDefinition ?? ""}
            onChange={(e) => set("submissionDefinition", e.target.value)}
          >
            <option value="">— none —</option>
            {Object.keys(SUBMISSION_PROCESSES).map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </Labeled>

        <Labeled
          label="Submission definition (correction)"
          hint="cris.submission.definition-correction — the submission process used on edit"
        >
          <select
            style={inputStyle}
            value={values.submissionDefinitionCorrection ?? ""}
            onChange={(e) => set("submissionDefinitionCorrection", e.target.value)}
          >
            <option value="">— none —</option>
            {Object.keys(SUBMISSION_PROCESSES).map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </Labeled>

        <Labeled label="Shared workspace" hint="cris.workspace.shared">
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
              fontSize: 13,
              color: "#374151",
            }}
          >
            <input
              type="checkbox"
              checked={!!values.workspaceShared}
              onChange={(e) => set("workspaceShared", e.target.checked)}
            />
            Enable shared workspace for this collection
          </label>
        </Labeled>
      </FormGrid>
    </ModalShell>
  );
}
