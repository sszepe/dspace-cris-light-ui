/**
 * place-import-modal.tsx
 *
 * Two-step authority import flow for Place entities:
 *
 *   Step 1 — Search  : query Wikidata, lobid GND, and/or GeoNames simultaneously,
 *                      browse results across source tabs, select a candidate.
 *   Step 2 — Review  : fetch the full authority record, pre-fill PlaceCreationModal,
 *                      let the user review and adjust before creating the workspace item.
 *
 * The modal itself only handles step 1.  After the user clicks "Import →", it
 * calls onImport(payload) which the parent (PlaceImportFlow) uses to open the
 * PlaceCreationModal with the pre-filled data.
 *
 * GeoNames username is persisted in localStorage via place-import-api.ts so
 * users don't have to re-enter it on every session.
 */

import React from "react";
import { Button } from "./modal-shared";
import {
  searchWikidataPlaces,
  searchGNDPlaces,
  searchGeoNames,
  fetchPlaceFull,
  getStoredGeoNamesUsername,
  setStoredGeoNamesUsername,
  type PlaceImportCandidate,
  type PlaceImportPayload,
  type PlaceSource,
} from "../api/place-import-api";

// ── Source colours & labels ───────────────────────────────────────────────────

const SOURCE_META: Record<
  PlaceSource,
  { label: string; bg: string; text: string; border: string }
> = {
  wikidata: {
    label: "Wikidata",
    bg: "#f0f4ff",
    text: "#2a4db7",
    border: "#c5d2f7",
  },
  gnd: {
    label: "lobid GND",
    bg: "#f0fff4",
    text: "#1a6b3a",
    border: "#b0dfc0",
  },
  geonames: {
    label: "GeoNames",
    bg: "#fff8f0",
    text: "#8a4500",
    border: "#f5c89a",
  },
};

// ── Sub-components ────────────────────────────────────────────────────────────

function SourcePill({ source }: { source: PlaceSource }) {
  const m = SOURCE_META[source];
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 700,
        padding: "2px 8px",
        borderRadius: 999,
        background: m.bg,
        color: m.text,
        border: `1px solid ${m.border}`,
        whiteSpace: "nowrap",
      }}
    >
      {m.label}
    </span>
  );
}

function SourceTab({
  source,
  active,
  count,
  loading,
  onClick,
}: {
  source: PlaceSource;
  active: boolean;
  count?: number;
  loading?: boolean;
  onClick: () => void;
}) {
  const m = SOURCE_META[source];
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "7px 14px",
        borderRadius: 8,
        border: `1px solid ${active ? m.border : "#e5e7eb"}`,
        background: active ? m.bg : "#fff",
        color: active ? m.text : "#6b7280",
        fontWeight: active ? 700 : 500,
        fontSize: 13,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 6,
        transition: "all 0.1s",
      }}
    >
      {m.label}
      {loading && (
        <span style={{ fontSize: 11, color: "#9ca3af" }}>…</span>
      )}
      {!loading && count !== undefined && (
        <span
          style={{
            background: active ? m.border : "#e5e7eb",
            color: active ? m.text : "#6b7280",
            borderRadius: 999,
            padding: "1px 7px",
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          {count}
        </span>
      )}
    </button>
  );
}

function ResultCard({
  candidate,
  fetching,
  onSelect,
}: {
  candidate: PlaceImportCandidate;
  fetching: boolean;
  onSelect: () => void;
}) {
  const m = SOURCE_META[candidate.source];
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 10,
        padding: "12px 14px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 12,
        background: "#fafafa",
        transition: "border-color 0.1s",
      }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLElement).style.borderColor = m.border)
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLElement).style.borderColor = "#e5e7eb")
      }
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            marginBottom: 4,
            flexWrap: "wrap",
          }}
        >
          <SourcePill source={candidate.source} />
          <code style={{ fontSize: 11, color: "#9ca3af" }}>{candidate.sourceId}</code>
        </div>
        <div style={{ fontWeight: 700, fontSize: 14, color: "#111827", marginBottom: 2 }}>
          {candidate.label}
        </div>
        {candidate.description && (
          <div style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.5 }}>
            {candidate.description}
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={onSelect}
        disabled={fetching}
        style={{
          padding: "7px 14px",
          borderRadius: 8,
          border: "none",
          background: fetching ? "#e5e7eb" : "#059669",
          color: fetching ? "#9ca3af" : "#fff",
          fontWeight: 700,
          fontSize: 13,
          cursor: fetching ? "not-allowed" : "pointer",
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}
      >
        {fetching ? "Loading…" : "Import →"}
      </button>
    </div>
  );
}

// ── State types ───────────────────────────────────────────────────────────────

type SourceState = {
  results: PlaceImportCandidate[];
  error: string | null;
  loading: boolean;
};

const EMPTY_SOURCE: SourceState = { results: [], error: null, loading: false };

// ── Props ─────────────────────────────────────────────────────────────────────

export interface PlaceImportModalProps {
  open: boolean;
  onClose: () => void;
  /** Called with the full payload when the user selects a candidate. */
  onImport: (payload: PlaceImportPayload) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function PlaceImportModal({
  open,
  onClose,
  onImport,
}: PlaceImportModalProps) {
  const [query, setQuery] = React.useState("");
  const [activeTab, setActiveTab] = React.useState<PlaceSource>("wikidata");
  const [wd, setWd] = React.useState<SourceState>(EMPTY_SOURCE);
  const [gnd, setGnd] = React.useState<SourceState>(EMPTY_SOURCE);
  const [gn, setGn] = React.useState<SourceState>(EMPTY_SOURCE);
  const [fetchingId, setFetchingId] = React.useState<string | null>(null);
  const [hasSearched, setHasSearched] = React.useState(false);
  const [gnUser, setGnUser] = React.useState<string>(() => getStoredGeoNamesUsername());

  const inputRef = React.useRef<HTMLInputElement>(null);

  // Focus search input on open
  React.useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      // Reset on close
      setQuery("");
      setWd(EMPTY_SOURCE);
      setGnd(EMPTY_SOURCE);
      setGn(EMPTY_SOURCE);
      setHasSearched(false);
      setFetchingId(null);
    }
  }, [open]);

  // Escape key
  React.useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Persist GeoNames username when it changes
  React.useEffect(() => {
    setStoredGeoNamesUsername(gnUser);
  }, [gnUser]);

  if (!open) return null;

  // ── Search ────────────────────────────────────────────────────────────────

  const runSearch = async () => {
    const q = query.trim();
    if (!q) return;

    setHasSearched(true);
    setWd({ ...EMPTY_SOURCE, loading: true });
    setGnd({ ...EMPTY_SOURCE, loading: true });
    setGn(gnUser.trim() ? { ...EMPTY_SOURCE, loading: true } : EMPTY_SOURCE);

    await Promise.allSettled([
      searchWikidataPlaces(q)
        .then((r) => setWd({ results: r, error: null, loading: false }))
        .catch((e: any) =>
          setWd({ results: [], error: e?.message ?? "Search failed", loading: false }),
        ),

      searchGNDPlaces(q)
        .then((r) => setGnd({ results: r, error: null, loading: false }))
        .catch((e: any) =>
          setGnd({ results: [], error: e?.message ?? "Search failed", loading: false }),
        ),

      gnUser.trim()
        ? searchGeoNames(q, gnUser.trim())
            .then((r) => setGn({ results: r, error: null, loading: false }))
            .catch((e: any) =>
              setGn({ results: [], error: e?.message ?? "Search failed", loading: false }),
            )
        : Promise.resolve(),
    ]);
  };

  // ── Import ────────────────────────────────────────────────────────────────

  const handleImport = async (candidate: PlaceImportCandidate) => {
    setFetchingId(candidate.sourceId);
    try {
      const payload = await fetchPlaceFull(candidate, gnUser.trim());
      onImport(payload);
    } catch (e: any) {
      const err = e?.message ?? "Import failed";
      if (candidate.source === "wikidata") {
        setWd((s) => ({ ...s, error: err }));
      } else if (candidate.source === "gnd") {
        setGnd((s) => ({ ...s, error: err }));
      } else {
        setGn((s) => ({ ...s, error: err }));
      }
    } finally {
      setFetchingId(null);
    }
  };

  const current =
    activeTab === "wikidata" ? wd : activeTab === "gnd" ? gnd : gn;

  const anyLoading = wd.loading || gnd.loading || gn.loading;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1100,
        padding: 24,
      }}
    >
      <div
        style={{
          width: "min(720px, 100%)",
          maxHeight: "90vh",
          background: "#fff",
          borderRadius: 16,
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 16px 48px rgba(0,0,0,0.22)",
          overflow: "hidden",
        }}
      >
        {/* ── Header ── */}
        <div
          style={{
            padding: "18px 20px 14px",
            borderBottom: "1px solid #e5e7eb",
            display: "grid",
            gap: 12,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div>
              <div style={{ fontWeight: 800, fontSize: 17, color: "#111827" }}>
                Import place from authority
              </div>
              <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 3 }}>
                Search Wikidata, lobid GND, or GeoNames — then review before
                creating the workspace item.
              </div>
            </div>
            <Button onClick={onClose}>✕</Button>
          </div>

          {/* Search row */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input
              ref={inputRef}
              style={{
                flex: "1 1 200px",
                padding: "9px 12px",
                borderRadius: 8,
                border: "1px solid #d1d5db",
                fontSize: 14,
                outline: "none",
              }}
              placeholder="Place name, e.g. Vienna"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") void runSearch();
              }}
            />
            <input
              style={{
                flex: "0 0 180px",
                padding: "9px 12px",
                borderRadius: 8,
                border: "1px solid #d1d5db",
                fontSize: 13,
                outline: "none",
                color: gnUser ? "#111827" : "#9ca3af",
              }}
              placeholder="GeoNames username"
              value={gnUser}
              onChange={(e) => setGnUser(e.target.value)}
              title="Free GeoNames API username (geonames.org/login). Persisted locally."
            />
            <button
              type="button"
              onClick={() => void runSearch()}
              disabled={!query.trim() || anyLoading}
              style={{
                padding: "9px 18px",
                borderRadius: 8,
                border: "none",
                background: !query.trim() || anyLoading ? "#e5e7eb" : "#059669",
                color: !query.trim() || anyLoading ? "#9ca3af" : "#fff",
                fontWeight: 700,
                fontSize: 13,
                cursor:
                  !query.trim() || anyLoading ? "not-allowed" : "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {anyLoading ? "Searching…" : "Search"}
            </button>
          </div>

          {/* Source tabs — only after first search */}
          {hasSearched && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <SourceTab
                source="wikidata"
                active={activeTab === "wikidata"}
                count={wd.results.length}
                loading={wd.loading}
                onClick={() => setActiveTab("wikidata")}
              />
              <SourceTab
                source="gnd"
                active={activeTab === "gnd"}
                count={gnd.results.length}
                loading={gnd.loading}
                onClick={() => setActiveTab("gnd")}
              />
              <SourceTab
                source="geonames"
                active={activeTab === "geonames"}
                count={gnUser ? gn.results.length : undefined}
                loading={gn.loading}
                onClick={() => setActiveTab("geonames")}
              />
            </div>
          )}
        </div>

        {/* ── Results ── */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "14px 20px 16px",
          }}
        >
          {!hasSearched && (
            <div
              style={{
                textAlign: "center",
                color: "#9ca3af",
                fontSize: 13,
                marginTop: 36,
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 10 }}>🗺️</div>
              Enter a place name above and press <strong>Search</strong>.
              {!gnUser && (
                <div style={{ marginTop: 10, fontSize: 12 }}>
                  Add a GeoNames username to also search GeoNames.{" "}
                  <a
                    href="https://www.geonames.org/login"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#059669" }}
                  >
                    Register free →
                  </a>
                </div>
              )}
            </div>
          )}

          {current.loading && (
            <div
              style={{
                textAlign: "center",
                color: "#9ca3af",
                fontSize: 13,
                marginTop: 36,
              }}
            >
              Searching {SOURCE_META[activeTab].label}…
            </div>
          )}

          {activeTab === "geonames" && !gnUser && hasSearched && (
            <div
              style={{
                textAlign: "center",
                color: "#9ca3af",
                fontSize: 13,
                marginTop: 36,
              }}
            >
              Enter a GeoNames username in the search bar to enable GeoNames.{" "}
              <a
                href="https://www.geonames.org/login"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#059669" }}
              >
                Register free →
              </a>
            </div>
          )}

          {current.error && !current.loading && (
            <div
              style={{
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: 8,
                padding: "10px 12px",
                color: "#b91c1c",
                fontSize: 13,
                marginBottom: 12,
              }}
            >
              {current.error}
            </div>
          )}

          {!current.loading &&
            !current.error &&
            hasSearched &&
            current.results.length === 0 &&
            (activeTab !== "geonames" || gnUser) && (
              <div
                style={{
                  textAlign: "center",
                  color: "#9ca3af",
                  fontSize: 13,
                  marginTop: 36,
                }}
              >
                No results from {SOURCE_META[activeTab].label} for "
                {query}".
              </div>
            )}

          {!current.loading && current.results.length > 0 && (
            <div style={{ display: "grid", gap: 8 }}>
              {current.results.map((c) => (
                <ResultCard
                  key={`${c.source}:${c.sourceId}`}
                  candidate={c}
                  fetching={fetchingId === c.sourceId}
                  onSelect={() => void handleImport(c)}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div
          style={{
            padding: "10px 20px",
            borderTop: "1px solid #e5e7eb",
            fontSize: 11,
            color: "#9ca3af",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <span>
            Data from{" "}
            <a
              href="https://www.wikidata.org"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#4338ca" }}
            >
              Wikidata
            </a>
            ,{" "}
            <a
              href="https://lobid.org/gnd"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#1a6b3a" }}
            >
              lobid GND
            </a>
            ,{" "}
            <a
              href="https://www.geonames.org"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#8a4500" }}
            >
              GeoNames
            </a>{" "}
            (CC BY).
          </span>
          <span>Review all fields before saving.</span>
        </div>
      </div>
    </div>
  );
}
