/**
 * place-import-flow.tsx
 *
 * Composes PlaceImportModal + PlaceCreationModal into a single two-step flow:
 *
 *   1. PlaceImportModal  — search Wikidata / lobid GND / GeoNames, select candidate
 *   2. PlaceCreationModal — full creation form pre-filled from the import payload
 *
 * Usage:
 *
 *   <PlaceImportFlow
 *     open={open}
 *     onClose={() => setOpen(false)}
 *     onCreated={(wsId) => navigate(wsId)}
 *   />
 *
 * The parent only needs to manage one boolean.  Internally the flow manages
 * whether to show the import search or the creation form.
 *
 * Alternatively, use PlaceCreateOrImportButtons to render the two entry-point
 * buttons (Create / Import) in the Quicklinks page.
 */

import React from "react";
import PlaceImportModal from "./place-import-modal";
import PlaceCreationModal, { type PlaceImportPrefill } from "./place-creation-modal";
import type { PlaceImportPayload } from "../api/place-import-api";

// ── Adapter ───────────────────────────────────────────────────────────────────
// PlaceImportPayload → PlaceImportPrefill (PlaceCreationModal's expected shape).
// They are nearly identical; this makes the dependency explicit and type-safe.

function payloadToPrefill(p: PlaceImportPayload): PlaceImportPrefill {
  return {
    authorized_name: p.authorized_name,
    other_names: p.other_names,
    wikidataId: p.wikidataId,
    geoNamesId: p.geoNamesId,
    gnd: p.gnd,
    viaf: p.viaf,
    country: p.country,
    city: p.city,
    latitude: p.latitude,
    longitude: p.longitude,
    featureClass: p.featureClass,
    featureCode: p.featureCode,
    url: p.url,
  };
}

// ── Types ─────────────────────────────────────────────────────────────────────

type Step = "import" | "create";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated?: (wsId: number) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function PlaceImportFlow({ open, onClose, onCreated }: Props) {
  const [step, setStep] = React.useState<Step>("import");
  const [prefill, setPrefill] = React.useState<PlaceImportPrefill | null>(null);

  // Reset step when the flow is opened
  React.useEffect(() => {
    if (open) {
      setStep("import");
      setPrefill(null);
    }
  }, [open]);

  const handleImport = (payload: PlaceImportPayload) => {
    setPrefill(payloadToPrefill(payload));
    setStep("create");
  };

  const handleBackToImport = () => {
    setStep("import");
  };

  const handleCreated = (wsId: number) => {
    onCreated?.(wsId);
    onClose();
  };

  return (
    <>
      {/* Step 1 — Authority search */}
      <PlaceImportModal
        open={open && step === "import"}
        onClose={onClose}
        onImport={handleImport}
      />

      {/* Step 2 — Creation form, pre-filled */}
      <PlaceCreationModal
        open={open && step === "create"}
        importPrefill={prefill}
        onClose={handleBackToImport}   // "Close" goes back to search
        onCreated={handleCreated}
      />
    </>
  );
}

// ── PlaceCreateOrImportButtons ─────────────────────────────────────────────────
// Convenience component that renders the two action buttons for the
// Quicklinks page header bar, managing their own open/flow state internally.

interface ButtonsProps {
  onCreated?: (wsId: number) => void;
}

export function PlaceCreateOrImportButtons({ onCreated }: ButtonsProps) {
  const [createOpen, setCreateOpen] = React.useState(false);
  const [importOpen, setImportOpen] = React.useState(false);

  const btnBase: React.CSSProperties = {
    padding: "7px 12px",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 600,
    border: "none",
    whiteSpace: "nowrap",
  };

  return (
    <>
      <button
        style={{ ...btnBase, background: "#059669", color: "#fff" }}
        onClick={() => setImportOpen(true)}
      >
        ↓ Import place
      </button>
      <button
        style={{
          ...btnBase,
          background: "#fff",
          color: "#059669",
          border: "1px solid #059669",
        }}
        onClick={() => setCreateOpen(true)}
      >
        + Create place
      </button>

      <PlaceImportFlow
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onCreated={onCreated}
      />
      <PlaceCreationModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={onCreated}
      />
    </>
  );
}
