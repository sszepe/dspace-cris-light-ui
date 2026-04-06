/**
 * archival-item-types.ts
 * ======================
 * Single source of truth for ArchivalResource item-type classification.
 *
 * Every entry here corresponds to:
 *   1. An option in the "Item type" dropdown in ArchivalFormModal
 *      (level === "item" only)
 *   2. A leaf or branch node in archival-resource-type-vocabulary.xml
 *      (nodeId links the two)
 *   3. The editor component mounted by ItemMetadataEditor (editorKey)
 *   4. The DSpace submission form section (submissionSection) that
 *      receives the structured item_json data
 *   5. The ara.item.type DSpace metadata value written at submission time
 *
 * Design notes
 * ------------
 * - value:    the internal key stored in the backend (item_type field)
 * - label:    human-readable label shown in the dropdown
 * - nodeId:   vocabulary node ID from archival-resource-type-vocabulary.xml
 * - group:    top-level grouping for the dropdown (optgroup)
 * - editorKey: key used by ItemMetadataEditor dispatcher.
 *              null = no structured editor (free-text fields only)
 * - submissionSection: DSpace submission form section name that receives
 *              the item_json payload as individual metadata fields
 * - araItemType: the value written to ara.item.type DSpace metadata field
 * - schemaNote: brief note on which XML schemas cover this type's fields
 */

export type ArchivalItemType = {
  value: string;
  label: string;
  nodeId: string;
  group: string;
  editorKey: string | null;
  submissionSection: string;
  araItemType: string;
  schemaNote?: string;
};

export const ARCHIVAL_ITEM_TYPES: ArchivalItemType[] = [

  // ── Field Research ─────────────────────────────────────────────────────────
  {
    value: "ivearchiverecording",
    label: "Field Research Audio (IVE Archive)",
    nodeId: "mdw_ara02",
    group: "Field Research",
    editorKey: "ivearchiverecording",
    submissionSection: "archivalresource_fieldresearch",
    araItemType: "Field Research Audio",
    schemaNote: "ledat.* + ara.* + mdwrepo.ivearchive.*",
  },
  {
    value: "fieldresearch_av",
    label: "Field Research Audiovisual",
    nodeId: "mdw_ara03",
    group: "Field Research",
    editorKey: "ivearchiverecording",
    submissionSection: "archivalresource_fieldresearch",
    araItemType: "Field Research Audiovisual",
    schemaNote: "ledat.* + ara.*",
  },
  {
    value: "fieldresearch_notes",
    label: "Field Research Notes",
    nodeId: "mdw_ara20",
    group: "Field Research",
    editorKey: null,
    submissionSection: "archivalresource_generic",
    araItemType: "Field Research Notes",
    schemaNote: "ara.* + dc.*",
  },
  {
    value: "fieldresearch_photos",
    label: "Field Research Photographs",
    nodeId: "mdw_ara21",
    group: "Field Research",
    editorKey: "photograph",
    submissionSection: "archivalresource_photograph",
    araItemType: "Field Research Photographs",
    schemaNote: "ara.* + dc.*",
  },

  // ── Correspondence ──────────────────────────────────────────────────────────
  {
    value: "correspondence",
    label: "Correspondence",
    nodeId: "mdw_ara04",
    group: "Correspondence",
    editorKey: "correspondence",
    submissionSection: "archivalresource_correspondence",
    araItemType: "Correspondence",
    schemaNote: "mdwrepo.correspondence.* + ara.* + CMIF/TEI correspDesc",
  },
  {
    value: "letter",
    label: "Letter",
    nodeId: "mdw_ara22",
    group: "Correspondence",
    editorKey: "correspondence",
    submissionSection: "archivalresource_correspondence",
    araItemType: "Letter",
    schemaNote: "mdwrepo.correspondence.* + ara.*",
  },
  {
    value: "postcard",
    label: "Postcard",
    nodeId: "mdw_ara23",
    group: "Correspondence",
    editorKey: "correspondence",
    submissionSection: "archivalresource_correspondence",
    araItemType: "Postcard",
    schemaNote: "mdwrepo.correspondence.* + ara.*",
  },

  // ── Graphic Materials ───────────────────────────────────────────────────────
  {
    value: "photograph",
    label: "Photograph",
    nodeId: "mdw_ara05",
    group: "Graphic Materials",
    editorKey: "photograph",
    submissionSection: "archivalresource_photograph",
    araItemType: "Photograph",
    schemaNote: "ara.* + dc.* + ara.physical.*",
  },
  {
    value: "photograph_print",
    label: "Photograph — Print",
    nodeId: "mdw_ara33",
    group: "Graphic Materials",
    editorKey: "photograph",
    submissionSection: "archivalresource_photograph",
    araItemType: "Photograph — Print",
    schemaNote: "ara.* + ara.physical.*",
  },
  {
    value: "photograph_negative_glass",
    label: "Photograph — Negative (Glass)",
    nodeId: "mdw_ara34",
    group: "Graphic Materials",
    editorKey: "photograph",
    submissionSection: "archivalresource_photograph",
    araItemType: "Photograph — Negative (Glass)",
    schemaNote: "ara.* + ara.physical.*",
  },
  {
    value: "photograph_negative_film",
    label: "Photograph — Negative (Film)",
    nodeId: "mdw_ara35",
    group: "Graphic Materials",
    editorKey: "photograph",
    submissionSection: "archivalresource_photograph",
    araItemType: "Photograph — Negative (Film)",
    schemaNote: "ara.* + ara.physical.*",
  },
  {
    value: "photograph_slide",
    label: "Photograph — Slide / Transparency",
    nodeId: "mdw_ara36",
    group: "Graphic Materials",
    editorKey: "photograph",
    submissionSection: "archivalresource_photograph",
    araItemType: "Photograph — Slide",
    schemaNote: "ara.* + ara.physical.*",
  },

  // ── Cartographic Materials ──────────────────────────────────────────────────
  {
    value: "map",
    label: "Map",
    nodeId: "mdw_ara29",
    group: "Cartographic Materials",
    editorKey: "map",
    submissionSection: "archivalresource_map",
    araItemType: "Map",
    schemaNote: "ara.* + ara.physical.* + dc.*",
  },

  // ── Manuscripts ─────────────────────────────────────────────────────────────
  {
    value: "manuscript",
    label: "Manuscript",
    nodeId: "mdw_ara013",
    group: "Manuscripts",
    editorKey: "manuscript",
    submissionSection: "archivalresource_manuscript",
    araItemType: "Manuscript",
    schemaNote: "ara.* + ara.physical.* + dc.*",
  },
  {
    value: "sheetmusic_manuscript",
    label: "Sheet Music (Manuscript)",
    nodeId: "mdw_ara14",
    group: "Manuscripts",
    editorKey: "manuscript",
    submissionSection: "archivalresource_manuscript",
    araItemType: "Sheet Music — Manuscript",
    schemaNote: "ara.* + mdwrepo.work.* + dc.*",
  },
  {
    value: "autograph",
    label: "Autograph Manuscript",
    nodeId: "mdw_ara42",
    group: "Manuscripts",
    editorKey: "manuscript",
    submissionSection: "archivalresource_manuscript",
    araItemType: "Autograph Manuscript",
    schemaNote: "ara.* + dc.*",
  },
  {
    value: "diary",
    label: "Diary / Journal",
    nodeId: "mdw_ara45",
    group: "Manuscripts",
    editorKey: null,
    submissionSection: "archivalresource_generic",
    araItemType: "Diary",
    schemaNote: "ara.* + dc.*",
  },

  // ── Published Materials ─────────────────────────────────────────────────────
  {
    value: "printed",
    label: "Printed Material / Publication",
    nodeId: "mdw_ara06",
    group: "Published Materials",
    editorKey: "printed",
    submissionSection: "archivalresource_printed",
    araItemType: "Publication",
    schemaNote: "ara.* + dc.* + mdwrepo.publication.*",
  },
  {
    value: "sheetmusic_published",
    label: "Sheet Music (Published)",
    nodeId: "mdw_ara19",
    group: "Published Materials",
    editorKey: "printed",
    submissionSection: "archivalresource_printed",
    araItemType: "Sheet Music — Published",
    schemaNote: "ara.* + mdwrepo.work.* + dc.*",
  },

  // ── Sound Recordings ────────────────────────────────────────────────────────
  {
    value: "audio",
    label: "Sound Recording",
    nodeId: "mdw_ara58",
    group: "Sound Recordings",
    editorKey: "audio",
    submissionSection: "archivalresource_audio",
    araItemType: "Sound Recording",
    schemaNote: "ara.physical.* + ledat.recording.* + dc.*",
  },
  {
    value: "audio_wax_cylinder",
    label: "Wax Cylinder",
    nodeId: "mdw_ara59",
    group: "Sound Recordings",
    editorKey: "audio",
    submissionSection: "archivalresource_audio",
    araItemType: "Wax Cylinder",
    schemaNote: "ara.physical.* + ledat.recording.* + dc.*",
  },
  {
    value: "audio_shellac",
    label: "Shellac Record (78 rpm)",
    nodeId: "mdw_ara60",
    group: "Sound Recordings",
    editorKey: "audio",
    submissionSection: "archivalresource_audio",
    araItemType: "Shellac Record",
    schemaNote: "ara.physical.* + dc.*",
  },
  {
    value: "audio_vinyl",
    label: "Vinyl Record",
    nodeId: "mdw_ara61",
    group: "Sound Recordings",
    editorKey: "audio",
    submissionSection: "archivalresource_audio",
    araItemType: "Vinyl Record",
    schemaNote: "ara.physical.* + dc.*",
  },
  {
    value: "audio_magnetic_tape",
    label: "Magnetic Tape (Open Reel)",
    nodeId: "mdw_ara62",
    group: "Sound Recordings",
    editorKey: "audio",
    submissionSection: "archivalresource_audio",
    araItemType: "Magnetic Tape",
    schemaNote: "ara.physical.* + dc.*",
  },
  {
    value: "audio_cassette",
    label: "Magnetic Tape (Cassette)",
    nodeId: "mdw_ara63",
    group: "Sound Recordings",
    editorKey: "audio",
    submissionSection: "archivalresource_audio",
    araItemType: "Cassette Tape",
    schemaNote: "ara.physical.* + dc.*",
  },

  // ── Audiovisual Materials ───────────────────────────────────────────────────
  {
    value: "video",
    label: "Audiovisual / Video Recording",
    nodeId: "mdw_ara08",
    group: "Audiovisual",
    editorKey: "video",
    submissionSection: "archivalresource_video",
    araItemType: "Audiovisual",
    schemaNote: "ara.physical.* + ledat.recording.* + dc.*",
  },
  {
    value: "film_analogue",
    label: "Film (Analogue)",
    nodeId: "mdw_ara55",
    group: "Audiovisual",
    editorKey: "video",
    submissionSection: "archivalresource_video",
    araItemType: "Film — Analogue",
    schemaNote: "ara.physical.* + mdwrepo.filmakademie.* + dc.*",
  },

  // ── Filmakademie Wien ───────────────────────────────────────────────────────
  {
    value: "filmakademie_fiction",
    label: "Student Film (Fiction) — Filmakademie",
    nodeId: "mdw_ara77",
    group: "Filmakademie Wien",
    editorKey: "video",
    submissionSection: "archivalresource_filmakademie",
    araItemType: "Student Film — Fiction",
    schemaNote: "mdwrepo.filmakademie.* + ara.* + dc.*",
  },
  {
    value: "filmakademie_documentary",
    label: "Student Film (Documentary) — Filmakademie",
    nodeId: "mdw_ara78",
    group: "Filmakademie Wien",
    editorKey: "video",
    submissionSection: "archivalresource_filmakademie",
    araItemType: "Student Film — Documentary",
    schemaNote: "mdwrepo.filmakademie.* + ara.*",
  },
  {
    value: "filmakademie_animation",
    label: "Student Film (Animation) — Filmakademie",
    nodeId: "mdw_ara79",
    group: "Filmakademie Wien",
    editorKey: "video",
    submissionSection: "archivalresource_filmakademie",
    araItemType: "Student Film — Animation",
    schemaNote: "mdwrepo.filmakademie.* + ara.*",
  },
  {
    value: "filmakademie_raw",
    label: "Camera Rolls / Raw Footage — Filmakademie",
    nodeId: "mdw_ara82",
    group: "Filmakademie Wien",
    editorKey: "video",
    submissionSection: "archivalresource_filmakademie",
    araItemType: "Camera Rolls",
    schemaNote: "mdwrepo.filmakademie.* + ara.*",
  },

  // ── Ethnomusicological (legacy item_type key) ───────────────────────────────
  // Kept for backwards compatibility with existing records.
  // New records should use "ivearchiverecording" or "fieldresearch_av".
  {
    value: "ethnomusicological",
    label: "Ethnomusicological Recording (legacy)",
    nodeId: "mdw_ara02",
    group: "Field Research",
    editorKey: "ethnomusicological",
    submissionSection: "archivalresource_fieldresearch",
    araItemType: "Field Research Audio",
    schemaNote: "ledat.* + ara.*",
  },
];

// ── Convenience maps ──────────────────────────────────────────────────────────

/** Fast lookup by value (item_type key). */
export const ITEM_TYPE_BY_VALUE = new Map(
  ARCHIVAL_ITEM_TYPES.map((t) => [t.value, t]),
);

/** Fast lookup by vocabulary node ID. */
export const ITEM_TYPE_BY_NODE_ID = new Map(
  ARCHIVAL_ITEM_TYPES.map((t) => [t.nodeId, t]),
);

/** Grouped list for rendering optgroup dropdowns. */
export const ITEM_TYPES_BY_GROUP: Record<string, ArchivalItemType[]> = {};
for (const t of ARCHIVAL_ITEM_TYPES) {
  if (!ITEM_TYPES_BY_GROUP[t.group]) ITEM_TYPES_BY_GROUP[t.group] = [];
  ITEM_TYPES_BY_GROUP[t.group].push(t);
}

/**
 * Legacy flat list compatible with existing ITEM_TYPES usages in
 * archival-form-modal.tsx and archival-detail.tsx.
 * Equivalent to: ARCHIVAL_ITEM_TYPES.map(({ value, label }) => ({ value, label }))
 */
export const ITEM_TYPES: Array<{ value: string; label: string }> =
  ARCHIVAL_ITEM_TYPES.map(({ value, label }) => ({ value, label }));

/**
 * Returns the editor component key for a given item_type value.
 * Returns null when no structured editor exists (generic free-text only).
 */
export function getEditorKey(itemType: string): string | null {
  return ITEM_TYPE_BY_VALUE.get(itemType)?.editorKey ?? null;
}

/**
 * Returns the DSpace submission form section name for a given item_type value.
 */
export function getSubmissionSection(itemType: string): string {
  return (
    ITEM_TYPE_BY_VALUE.get(itemType)?.submissionSection ??
    "archivalresource_generic"
  );
}

/**
 * Returns the ara.item.type metadata value for a given item_type value.
 */
export function getAraItemType(itemType: string): string {
  return ITEM_TYPE_BY_VALUE.get(itemType)?.araItemType ?? itemType;
}

/**
 * Returns the vocabulary node ID for a given item_type value.
 */
export function getNodeId(itemType: string): string | null {
  return ITEM_TYPE_BY_VALUE.get(itemType)?.nodeId ?? null;
}
