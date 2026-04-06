/**
 * bitstream-upload-panel.tsx
 *
 * Self-contained panel for viewing, uploading, and managing bitstreams on a
 * DSpace item or workspace item.
 *
 * Features:
 *   • Shows existing bundles + bitstreams, grouped by bundle name
 *   • Drag-and-drop or file picker upload
 *   • Local MD5 computation before upload (streamed, chunked)
 *   • Upload progress bar (via XHR)
 *   • Server-side MD5 comparison after upload — shows ✓ match or ✗ mismatch
 *   • Bundle picker: ORIGINAL / THUMBNAIL / LICENSE + extras from VITE_BUNDLE_TYPES
 *   • Inline bitstream metadata editor (description, dc.type, bitstream.hide)
 *   • Set primary bitstream (ORIGINAL bundle)
 *   • Delete bitstream
 *
 * Props:
 *   itemId   — the DSpace item UUID (used for bundle fetch / create)
 *   readOnly — when true, hides all mutating actions (view mode for archived items)
 *   onChanged — called after any mutation so the parent can refetch
 */

import React from "react";
import {
  getAvailableBundleTypes,
  computeFileMd5,
  verifyChecksum,
  fetchBundles,
  getOrCreateBundle,
  uploadBitstream,
  patchBitstreamMetadata,
  setPrimaryBitstream,
  deleteBitstream,
  fetchBundleBitstreams,
  type BundleRecord,
  type BitstreamRecord,
  type ChecksumVerification,
} from "../api/bitstream-api";
import {
  BitstreamViewer,
  ViewerBadge,
  classifyViewer,
} from "./bitstream-viewer";

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "7px 10px",
  border: "1px solid #d1d5db",
  borderRadius: 6,
  fontSize: 13,
  boxSizing: "border-box",
  background: "#fff",
};

// ── File upload state machine ─────────────────────────────────────────────────

type UploadPhase =
  | "idle"
  | "hashing"      // computing local MD5
  | "uploading"    // XHR in progress
  | "verifying"    // comparing checksums
  | "done"         // success
  | "error";

interface UploadEntry {
  id: string; // client-side key
  file: File;
  targetBundle: string;
  phase: UploadPhase;
  hashProgress: number;   // 0-100 during hashing
  uploadProgress: number; // 0-100 during upload
  localMd5: string | null;
  verification: ChecksumVerification | null;
  result: BitstreamRecord | null;
  error: string | null;
}

// ── BitstreamRow ──────────────────────────────────────────────────────────────

function ExistingBitstreamRow({
  bs,
  bundle,
  readOnly,
  isPrimary,
  onSetPrimary,
  onDelete,
  onMetaSaved,
}: {
  bs: BitstreamRecord;
  bundle: BundleRecord;
  readOnly: boolean;
  isPrimary: boolean;
  onSetPrimary: () => Promise<void>;
  onDelete: () => Promise<void>;
  onMetaSaved: (updated: BitstreamRecord) => void;
}) {
  const [expanded, setExpanded] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const [settingPrimary, setSettingPrimary] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Viewer state
  const [viewerOpen, setViewerOpen] = React.useState(false);
  const viewerKind = classifyViewer(bs, bundle.name, null);
  const canView = viewerKind !== "none" && !!bs.contentHref;

  // Metadata edit
  const [editing, setEditing] = React.useState(false);
  const [editDesc, setEditDesc] = React.useState(bs.metadata?.["dc.description"]?.[0]?.value ?? "");
  const [editType, setEditType] = React.useState(bs.metadata?.["dc.type"]?.[0]?.value ?? "");
  const [editHide, setEditHide] = React.useState(bs.metadata?.["bitstream.hide"]?.[0]?.value ?? "false");
  const [saving, setSaving] = React.useState(false);

  const handleDelete = async () => {
    if (!confirm(`Delete "${bs.name ?? bs.id}"?`)) return;
    setDeleting(true);
    setError(null);
    try {
      await onDelete();
    } catch (e: any) {
      setError(e?.message ?? "Delete failed.");
      setDeleting(false);
    }
  };

  const handleSetPrimary = async () => {
    setSettingPrimary(true);
    setError(null);
    try {
      await onSetPrimary();
    } catch (e: any) {
      setError(e?.message ?? "Failed to set primary.");
      setSettingPrimary(false);
    }
  };

  const handleSaveMeta = async () => {
    setSaving(true);
    setError(null);
    try {
      const updated = await patchBitstreamMetadata(bs.id, {
        description: editDesc || undefined,
        dcType: editType || undefined,
        hide: editHide,
      });
      onMetaSaved(updated);
      setEditing(false);
    } catch (e: any) {
      setError(e?.message ?? "Metadata save failed.");
    } finally {
      setSaving(false);
    }
  };

  const description = bs.metadata?.["dc.description"]?.[0]?.value ?? null;
  const dcType = bs.metadata?.["dc.type"]?.[0]?.value ?? null;
  const hidden = bs.metadata?.["bitstream.hide"]?.[0]?.value === "true";

  return (
    <div style={{
      border: "1px solid #e5e7eb",
      borderRadius: 8,
      background: hidden ? "#fafafa" : "#fff",
      overflow: "hidden",
    }}>
      {/* Main row */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "10px 12px",
      }}>
        <span style={{ fontSize: 18, flexShrink: 0 }}>
          {bundle.name === "THUMBNAIL" ? "🖼" : bundle.name === "LICENSE" ? "📜" : "📄"}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <span style={{ fontWeight: 600, fontSize: 13, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {bs.name ?? "(unnamed)"}
            </span>
            <ViewerBadge kind={viewerKind} />
            {isPrimary && (
              <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 3, background: "#fef3c7", color: "#92400e", border: "1px solid #fde68a", whiteSpace: "nowrap" }}>
                PRIMARY
              </span>
            )}
            {hidden && (
              <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 3, background: "#f3f4f6", color: "#6b7280", whiteSpace: "nowrap" }}>
                HIDDEN
              </span>
            )}
          </div>
          <div style={{ fontSize: 11, color: "#6b7280", marginTop: 1, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <span>{fmtBytes(bs.sizeBytes)}</span>
            {bs.checkSum?.value && (
              <span style={{ fontFamily: "monospace" }}>
                {bs.checkSum.checkSumAlgorithm}: {bs.checkSum.value.slice(0, 12)}…
              </span>
            )}
            {dcType && <span>{dcType}</span>}
            {description && <span style={{ color: "#9ca3af" }}>{description}</span>}
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, flexShrink: 0, flexWrap: "wrap" }}>
          {canView && (
            <button type="button" onClick={() => setViewerOpen(true)}
              style={{ padding: "3px 8px", fontSize: 11, border: "1px solid #c7d2fe", borderRadius: 5, background: "#eef2ff", color: "#4338ca", cursor: "pointer", whiteSpace: "nowrap", fontWeight: 600 }}>
              👁 View
            </button>
          )}
          {bs.contentHref && (
            <a href={bs.contentHref} target="_blank" rel="noopener noreferrer"
              style={{ padding: "3px 8px", fontSize: 11, border: "1px solid #d1d5db", borderRadius: 5, background: "#f9fafb", color: "#374151", textDecoration: "none", whiteSpace: "nowrap" }}>
              ↓
            </a>
          )}
          {!readOnly && (
            <>
              <button type="button" onClick={() => setExpanded((v) => !v)}
                style={{ padding: "3px 8px", fontSize: 11, border: "1px solid #d1d5db", borderRadius: 5, background: "#f9fafb", cursor: "pointer", color: "#374151" }}>
                {expanded ? "▲" : "⚙"}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Viewer modal */}
      {viewerOpen && (
        <BitstreamViewer
          bs={bs}
          bundleName={bundle.name}
          iiifManifestUrl={null}
          onClose={() => setViewerOpen(false)}
        />
      )}

      {/* Expanded admin panel */}
      {!readOnly && expanded && (
        <div style={{ padding: "10px 12px", borderTop: "1px solid #f3f4f6", display: "grid", gap: 10, background: "#f8fafc" }}>
          {error && (
            <div style={{ fontSize: 12, color: "#b91c1c", background: "#fef2f2", padding: "6px 10px", borderRadius: 6, border: "1px solid #fecaca" }}>
              {error}
            </div>
          )}

          {!editing ? (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {/* Set primary — only for ORIGINAL bundle */}
              {bundle.name === "ORIGINAL" && !isPrimary && (
                <button type="button" onClick={() => void handleSetPrimary()} disabled={settingPrimary}
                  style={{ padding: "4px 10px", fontSize: 12, border: "1px solid #fde68a", borderRadius: 6, background: "#fffbeb", color: "#92400e", cursor: settingPrimary ? "not-allowed" : "pointer", fontWeight: 600 }}>
                  {settingPrimary ? "Setting…" : "★ Set primary"}
                </button>
              )}
              <button type="button" onClick={() => setEditing(true)}
                style={{ padding: "4px 10px", fontSize: 12, border: "1px solid #c7d2fe", borderRadius: 6, background: "#eef2ff", color: "#4338ca", cursor: "pointer", fontWeight: 600 }}>
                ✎ Edit metadata
              </button>
              <button type="button" onClick={() => void handleDelete()} disabled={deleting}
                style={{ padding: "4px 10px", fontSize: 12, border: "1px solid #fecaca", borderRadius: 6, background: "#fff7f7", color: "#dc2626", cursor: deleting ? "not-allowed" : "pointer", fontWeight: 600 }}>
                {deleting ? "Deleting…" : "🗑 Delete"}
              </button>
            </div>
          ) : (
            <div style={{ display: "grid", gap: 10 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 4 }}>Description</div>
                  <input style={inputStyle} value={editDesc} onChange={(e) => setEditDesc(e.target.value)} placeholder="Optional description" />
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 4 }}>Type (dc.type / MIME hint)</div>
                  <input style={inputStyle} value={editType} onChange={(e) => setEditType(e.target.value)} placeholder="e.g. application/pdf" />
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 4 }}>Visibility (bitstream.hide)</div>
                <select value={editHide} onChange={(e) => setEditHide(e.target.value)} style={{ ...inputStyle, width: "auto" }}>
                  <option value="false">Visible</option>
                  <option value="true">Hidden</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button type="button" onClick={() => void handleSaveMeta()} disabled={saving}
                  style={{ padding: "5px 12px", fontSize: 12, border: "1px solid #bfdbfe", borderRadius: 6, background: "#eff6ff", color: "#1d4ed8", cursor: saving ? "not-allowed" : "pointer", fontWeight: 600 }}>
                  {saving ? "Saving…" : "Save metadata"}
                </button>
                <button type="button" onClick={() => setEditing(false)}
                  style={{ padding: "5px 12px", fontSize: 12, border: "1px solid #d1d5db", borderRadius: 6, background: "#f9fafb", color: "#374151", cursor: "pointer" }}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Upload entry row ──────────────────────────────────────────────────────────

function UploadEntryRow({ entry }: { entry: UploadEntry }) {
  const phaseLabel: Record<UploadPhase, string> = {
    idle: "Queued",
    hashing: "Computing checksum…",
    uploading: "Uploading…",
    verifying: "Verifying checksum…",
    done: "✓ Complete",
    error: "✗ Failed",
  };

  const phaseBg: Record<UploadPhase, string> = {
    idle: "#f3f4f6",
    hashing: "#eff6ff",
    uploading: "#eff6ff",
    verifying: "#fef3c7",
    done: "#f0fdf4",
    error: "#fef2f2",
  };
  const phaseColor: Record<UploadPhase, string> = {
    idle: "#6b7280",
    hashing: "#1d4ed8",
    uploading: "#1d4ed8",
    verifying: "#92400e",
    done: "#166534",
    error: "#b91c1c",
  };

  const progress = entry.phase === "hashing"
    ? entry.hashProgress
    : entry.phase === "uploading"
    ? entry.uploadProgress
    : entry.phase === "done" || entry.phase === "verifying" ? 100 : 0;

  const showBar = entry.phase === "hashing" || entry.phase === "uploading";

  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden", background: phaseBg[entry.phase] }}>
      <div style={{ padding: "10px 12px", display: "flex", alignItems: "flex-start", gap: 10 }}>
        <span style={{ fontSize: 18, flexShrink: 0 }}>📄</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 13, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {entry.file.name}
          </div>
          <div style={{ fontSize: 11, color: "#6b7280", marginTop: 1, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span>{fmtBytes(entry.file.size)}</span>
            <span style={{ color: "#6366f1", fontWeight: 500 }}>{entry.targetBundle}</span>
            <span style={{ color: phaseColor[entry.phase], fontWeight: 600 }}>{phaseLabel[entry.phase]}</span>
          </div>

          {showBar && (
            <div style={{ marginTop: 6, height: 4, borderRadius: 2, background: "#dbeafe", overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: 2, background: "#2563eb", width: `${progress}%`, transition: "width 0.2s" }} />
            </div>
          )}

          {entry.phase === "done" && entry.verification && (
            <div style={{ marginTop: 6, fontSize: 11, fontFamily: "monospace", color: entry.verification.match ? "#166534" : "#b91c1c" }}>
              {entry.verification.match ? "✓" : "✗"} {entry.verification.algorithm}:{" "}
              local <strong>{entry.verification.localHash.slice(0, 12)}…</strong>{" "}
              {entry.verification.match ? "=" : "≠"}{" "}
              server <strong>{entry.verification.serverHash.slice(0, 12)}…</strong>
              {!entry.verification.match && " — CHECKSUM MISMATCH — file may be corrupted"}
            </div>
          )}

          {entry.error && (
            <div style={{ marginTop: 6, fontSize: 12, color: "#b91c1c" }}>{entry.error}</div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main panel ────────────────────────────────────────────────────────────────

type Props = {
  itemId: string;
  readOnly?: boolean;
  onChanged?: () => void;
};

export function BitstreamUploadPanel({ itemId, readOnly = false, onChanged }: Props) {
  const bundleTypes = getAvailableBundleTypes();

  // Existing bundles + bitstreams
  const [bundles, setBundles] = React.useState<BundleRecord[]>([]);
  const [bitstreamsByBundle, setBitstreamsByBundle] = React.useState<Record<string, BitstreamRecord[]>>({});
  const [loading, setLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState<string | null>(null);

  // Upload queue
  const [queue, setQueue] = React.useState<UploadEntry[]>([]);
  const [targetBundle, setTargetBundle] = React.useState<string>(bundleTypes[0] ?? "ORIGINAL");
  const [dragOver, setDragOver] = React.useState(false);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const fetchedBundles = await fetchBundles(itemId);
      setBundles(fetchedBundles);
      // Load bitstreams for each bundle in parallel
      const entries = await Promise.all(
        fetchedBundles.map(async (b) => {
          const bss = await fetchBundleBitstreams(b.id).catch(() => []);
          return [b.id, bss] as [string, BitstreamRecord[]];
        }),
      );
      setBitstreamsByBundle(Object.fromEntries(entries));
    } catch (e: any) {
      setLoadError(e?.message ?? "Failed to load files.");
    } finally {
      setLoading(false);
    }
  }, [itemId]);

  React.useEffect(() => { void load(); }, [load]);

  // ── Upload a single file ────────────────────────────────────────────────────

  const runUpload = React.useCallback(async (entry: UploadEntry) => {
    const update = (patch: Partial<UploadEntry>) =>
      setQueue((prev) => prev.map((e) => e.id === entry.id ? { ...e, ...patch } : e));

    try {
      // Phase 1: local MD5
      update({ phase: "hashing", hashProgress: 0 });
      const localMd5 = await computeFileMd5(entry.file, (pct) =>
        update({ hashProgress: pct }),
      );
      update({ localMd5, hashProgress: 100 });

      // Phase 2: ensure bundle exists, then upload
      update({ phase: "uploading", uploadProgress: 0 });
      const bundle = await getOrCreateBundle(itemId, entry.targetBundle);
      const bs = await uploadBitstream(bundle.id, entry.file, (pct) =>
        update({ uploadProgress: pct }),
      );

      // Phase 3: verify checksum
      update({ phase: "verifying" });
      const serverHash = bs.checkSum?.value ?? "";
      const algorithm = bs.checkSum?.checkSumAlgorithm ?? "MD5";
      const verification = verifyChecksum(algorithm, localMd5, serverHash);

      update({ phase: "done", result: bs, verification });
      onChanged?.();
      void load(); // refresh file list
    } catch (e: any) {
      update({ phase: "error", error: e?.message ?? "Upload failed." });
    }
  }, [itemId, load, onChanged]);

  // ── Add files to queue and start uploading ─────────────────────────────────

  const enqueueFiles = React.useCallback((files: FileList | File[]) => {
    const arr = Array.from(files);
    const newEntries: UploadEntry[] = arr.map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      targetBundle,
      phase: "idle" as UploadPhase,
      hashProgress: 0,
      uploadProgress: 0,
      localMd5: null,
      verification: null,
      result: null,
      error: null,
    }));
    setQueue((prev) => [...prev, ...newEntries]);
    // Start uploading each
    for (const entry of newEntries) {
      void runUpload(entry);
    }
  }, [targetBundle, runUpload]);

  const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) enqueueFiles(e.target.files);
    e.target.value = ""; // reset so the same file can be re-picked
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) enqueueFiles(e.dataTransfer.files);
  };

  // ── Per-bitstream actions ──────────────────────────────────────────────────

  const handleSetPrimary = async (bundle: BundleRecord, bs: BitstreamRecord) => {
    await setPrimaryBitstream(bundle.id, bs.selfHref);
    onChanged?.();
    void load();
  };

  const handleDelete = async (bs: BitstreamRecord) => {
    await deleteBitstream(bs.id);
    onChanged?.();
    void load();
  };

  const handleMetaSaved = (bundleId: string, updated: BitstreamRecord) => {
    setBitstreamsByBundle((prev) => ({
      ...prev,
      [bundleId]: (prev[bundleId] ?? []).map((b) => b.id === updated.id ? updated : b),
    }));
    onChanged?.();
  };

  // ── Determine primary bitstream per bundle ─────────────────────────────────
  // We derive it from the bundle's primaryBitstreamHref if we track the primary
  // id — but the bundle REST response only gives us the href not the id directly.
  // We track it by looking at which bitstream has sequenceId === 1 when
  // primaryBitstream is set, OR we store it after set-primary calls.
  // Simple heuristic: after loading, we could check primaryBitstream endpoint,
  // but to keep it light we just let the server re-tell us via load().
  // For now we track a local override set.
  const [primaryIds, setPrimaryIds] = React.useState<Record<string, string>>({});

  const handleSetPrimaryWrapped = async (bundle: BundleRecord, bs: BitstreamRecord) => {
    await handleSetPrimary(bundle, bs);
    setPrimaryIds((prev) => ({ ...prev, [bundle.id]: bs.id }));
  };

  // Count total existing bitstreams
  const totalExisting = Object.values(bitstreamsByBundle).reduce((s, arr) => s + arr.length, 0);
  const pendingCount = queue.filter((e) => e.phase !== "done" && e.phase !== "error").length;

  return (
    <div style={{ display: "grid", gap: 16 }}>
      {loadError && (
        <div style={{ fontSize: 13, color: "#b91c1c", background: "#fef2f2", padding: "8px 12px", borderRadius: 6, border: "1px solid #fecaca" }}>
          {loadError}
        </div>
      )}

      {loading && <div style={{ fontSize: 13, color: "#9ca3af" }}>Loading files…</div>}

      {/* ── Existing bundles + bitstreams ── */}
      {!loading && totalExisting === 0 && queue.length === 0 && (
        <p style={{ color: "#aaa", fontSize: 13, margin: 0 }}>No files attached to this item.</p>
      )}

      {!loading && bundles.map((bundle) => {
        const bss = bitstreamsByBundle[bundle.id] ?? [];
        if (bss.length === 0) return null;
        return (
          <div key={bundle.id}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
              Bundle: {bundle.name}
              <span style={{ fontWeight: 500, background: "#f3f4f6", borderRadius: 10, padding: "1px 7px", color: "#555" }}>{bss.length}</span>
            </div>
            <div style={{ display: "grid", gap: 6 }}>
              {bss.map((bs) => (
                <ExistingBitstreamRow
                  key={bs.id}
                  bs={bs}
                  bundle={bundle}
                  readOnly={readOnly}
                  isPrimary={primaryIds[bundle.id] === bs.id}
                  onSetPrimary={() => handleSetPrimaryWrapped(bundle, bs)}
                  onDelete={() => handleDelete(bs)}
                  onMetaSaved={(updated) => handleMetaSaved(bundle.id, updated)}
                />
              ))}
            </div>
          </div>
        );
      })}

      {/* ── Upload queue ── */}
      {queue.length > 0 && (
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
            Uploads
            {pendingCount > 0 && (
              <span style={{ fontWeight: 500, background: "#eef2ff", borderRadius: 10, padding: "1px 7px", color: "#4338ca" }}>{pendingCount} active</span>
            )}
          </div>
          <div style={{ display: "grid", gap: 6 }}>
            {queue.map((entry) => <UploadEntryRow key={entry.id} entry={entry} />)}
          </div>
          <button type="button"
            onClick={() => setQueue((q) => q.filter((e) => e.phase !== "done" && e.phase !== "error"))}
            style={{ marginTop: 8, fontSize: 12, color: "#6b7280", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            Clear completed
          </button>
        </div>
      )}

      {/* ── Upload controls ── */}
      {!readOnly && (
        <div style={{ display: "grid", gap: 10 }}>
          {/* Bundle picker */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <div style={{ fontSize: 12, color: "#6b7280", whiteSpace: "nowrap" }}>Upload to bundle:</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {bundleTypes.map((bt) => (
                <button key={bt} type="button"
                  onClick={() => setTargetBundle(bt)}
                  style={{
                    padding: "4px 10px", fontSize: 12, fontWeight: targetBundle === bt ? 700 : 500,
                    borderRadius: 6,
                    border: targetBundle === bt ? "2px solid #2563eb" : "1px solid #d1d5db",
                    background: targetBundle === bt ? "#eff6ff" : "#f9fafb",
                    color: targetBundle === bt ? "#1d4ed8" : "#374151",
                    cursor: "pointer",
                  }}>
                  {bt}
                </button>
              ))}
            </div>
          </div>

          {/* Drop zone */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: `2px dashed ${dragOver ? "#2563eb" : "#d1d5db"}`,
              borderRadius: 10,
              padding: "28px 20px",
              textAlign: "center",
              background: dragOver ? "#eff6ff" : "#f8fafc",
              cursor: "pointer",
              transition: "border-color 0.15s, background 0.15s",
            }}
          >
            <div style={{ fontSize: 28, marginBottom: 8 }}>📁</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>
              Drop files here or click to browse
            </div>
            <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>
              Files will be uploaded to <strong>{targetBundle}</strong> bundle
              with local MD5 checksum verification
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              style={{ display: "none" }}
              onChange={handleFilePick}
            />
          </div>
        </div>
      )}
    </div>
  );
}
