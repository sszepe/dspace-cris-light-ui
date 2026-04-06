/**
 * src/config/profile-config.ts
 *
 * Central type definition for a DSpace CRIS UI profile.
 *
 * A profile bundles all institution-specific configuration into a single
 * typed object that the app consumes via ProfileContext.  Two layers exist:
 *
 *   Static layer   — defined in profiles/<name>/index.ts, shipped in the
 *                    bundle.  Good for clusters, nav, quicklinks presets,
 *                    field-label overrides, and modal registry.
 *
 *   Runtime layer  — loaded asynchronously from the Django config API when
 *                    VITE_*_CONFIG_SOURCE=django.  Individual loaders (e.g.
 *                    loadClusterConfig, loadQuicklinksConfig) already handle
 *                    this; ProfileConfig wires them together.
 *
 * Selecting a profile
 * -------------------
 * Set VITE_PROFILE=plain  (default)
 *             or =mdw
 * in your .env file.  The ProfileProvider picks the matching profile module
 * at startup.
 *
 * Adding a new profile
 * --------------------
 * 1.  Create src/profiles/<name>/index.ts  exporting a ProfileConfig.
 * 2.  Add the profile key to ProfileKey below.
 * 3.  Register it in src/profiles/registry.ts.
 */

import type { ComponentType } from "react";
import type { EntityCluster } from "../config/entity-clusters";
import type { QuickPreset, QuickFilterConfig } from "../config/quicklinks-config";
import type { CollectionRule } from "../config/collection-mapping";

// Re-export so consumers can import these types from one place
export type { EntityCluster };
export type { QuickPreset, QuickFilterConfig };
export type { CollectionRule };

// ── Nav ───────────────────────────────────────────────────────────────────────

export type NavTab = {
  key: string;
  label: string;
  /** Hash route, e.g. "#/search" */
  route: string;
  /** Only show this tab to admin users */
  adminOnly?: boolean;
};

// ── Modal registry ────────────────────────────────────────────────────────────

/**
 * A creation modal entry.
 * The component receives onClose + onCreated callbacks; everything else
 * (collection ID resolution, API calls) is self-contained inside the modal.
 */
export type ModalRegistryEntry = {
  /** Matches entityType strings used across the app */
  entityType: string;
  /** Human-readable label shown on the "Create …" button */
  label: string;
  /** Lazy-loadable React component */
  component: ComponentType<ModalComponentProps>;
  /**
   * Which preset keys on the quicklinks page should show a
   * "Create" button for this modal.
   */
  quicklinkPresetKeys?: string[];
};

export type ModalComponentProps = {
  /** Controls visibility — passed by the host that renders the modal. */
  open: boolean;
  onClose: () => void;
  /** Called with the workspace item ID after successful creation. */
  onCreated?: (wsId: number) => void;
};

// ── Theme ─────────────────────────────────────────────────────────────────────

export type ThemeOverrides = {
  /** CSS custom-property overrides, e.g. { "--color-primary": "#c8102e" } */
  cssVars?: Record<string, string>;
  /** Path to a logo asset (relative to /public or an absolute URL) */
  logoUrl?: string;
  /** Text shown next to the logo */
  appName?: string;
};

// ── Field labels ──────────────────────────────────────────────────────────────

/**
 * A partial override map on top of the base FIELD_LABELS from field-labels.ts.
 * Only the fields that differ from the base need to be listed.
 */
export type FieldLabelOverrides = Record<string, string>;

// ── Dashboard ─────────────────────────────────────────────────────────────────

export type DashboardConfig = {
  /**
   * "ts"    — use static entity clusters from the profile
   * "django" — load clusters from the Django config API (with TS fallback)
   */
  clusterSource: "ts" | "django";
};

// ── Quicklinks ────────────────────────────────────────────────────────────────

export type QuicklinksConfig = {
  /**
   * "ts"    — use static presets from the profile
   * "django" — load presets from the Django config API (with TS fallback)
   */
  presetSource: "ts" | "django";
};

// ── Collection mapping ────────────────────────────────────────────────────────

export type CollectionMappingConfig = {
  /**
   * "ts"    — use static rules from the profile
   * "django" — load rules from the Django config API (with TS fallback)
   */
  rulesSource: "ts" | "django";
};

// ── Feature flags ─────────────────────────────────────────────────────────────

export type FeatureFlags = {
  /** Show the Quicklinks tab in the nav */
  quicklinks: boolean;
  /** Show the Communities tab in the nav */
  communities: boolean;
  /** Show the Workspace tab in the nav */
  workspace: boolean;
  /** Enable the Admin Clusters management page */
  adminClusters: boolean;
  /** Show "Create" buttons next to entity lists */
  creationModals: boolean;
};

// ── ProfileConfig — the root type ─────────────────────────────────────────────

export type ProfileConfig = {
  /** Unique identifier, e.g. "plain" | "mdw" */
  key: string;
  /** Human-readable name shown in admin/debug UI */
  displayName: string;

  // ── Theme ──────────────────────────────────────────────────────────────────
  theme: ThemeOverrides;

  // ── Navigation ─────────────────────────────────────────────────────────────
  /** Top-level navigation tabs, in display order */
  navTabs: NavTab[];

  // ── Dashboard ──────────────────────────────────────────────────────────────
  dashboard: DashboardConfig;
  /**
   * Static entity clusters.
   * Used when dashboard.clusterSource === "ts" or as Django fallback.
   */
  entityClusters: EntityCluster[];

  // ── Quicklinks ─────────────────────────────────────────────────────────────
  quicklinks: QuicklinksConfig;
  /**
   * Static quicklink presets.
   * Used when quicklinks.presetSource === "ts" or as Django fallback.
   */
  quicklinkPresets: QuickPreset[];

  // ── Collection mapping ─────────────────────────────────────────────────────
  collectionMapping: CollectionMappingConfig;
  /**
   * Static collection rules.
   * Used when collectionMapping.rulesSource === "ts" or as Django fallback.
   */
  collectionRules: CollectionRule[];

  // ── Field labels ───────────────────────────────────────────────────────────
  /**
   * Overrides on top of the shared FIELD_LABELS base.
   * Resolved at runtime: base labels merged with these overrides,
   * profile wins on conflict.
   */
  fieldLabelOverrides: FieldLabelOverrides;

  // ── Creation modals ────────────────────────────────────────────────────────
  /**
   * Registry of entity creation modals available in this profile.
   * Profiles that don't support a given entity type simply omit it.
   */
  modalRegistry: ModalRegistryEntry[];

  // ── Feature flags ──────────────────────────────────────────────────────────
  features: FeatureFlags;
};

// ── Profile key union ─────────────────────────────────────────────────────────

export type ProfileKey = "plain";
