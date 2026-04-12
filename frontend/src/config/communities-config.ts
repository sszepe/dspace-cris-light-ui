/**
 * src/config/communities-config.ts
 *
 * Build-time feature flags for the Communities page admin capabilities.
 *
 * Two independent flags follow the same two-layer model used for Quicklinks:
 *   Layer 1 — .env build-time flag  (always the outer gate)
 *   Layer 2 — SiteSettings DB field (runtime, django mode only)
 *
 * In ts mode (no Django) the .env flags are the only knobs.
 * In django mode the DB fields can be toggled live from Admin Settings.
 *
 * VITE_COMMUNITIES_CREATION_ENABLED
 *   true  (default) → "+ Create community" and subcommunity actions shown to admins.
 *   false           → creation UI hidden for everyone.
 *
 * VITE_COMMUNITIES_ROLE_MANAGEMENT_ENABLED
 *   true  (default) → "👥 Admins" button shown to admins.
 *   false           → role management UI hidden for everyone.
 *
 * Runtime fetch/patch of SiteSettings is handled by quicklinks-config.ts —
 * fetchSiteSettings / patchSiteSettings cover all runtime flags in one call.
 */

// ── Env flags ─────────────────────────────────────────────────────────────────

/** Master switch for community / subcommunity creation. Default: true. */
export function isCommunitiesCreationEnabled(): boolean {
  return (
    String(import.meta.env.VITE_COMMUNITIES_CREATION_ENABLED ?? "true").toLowerCase() !== "false"
  );
}

/** Master switch for community role management. Default: true. */
export function isCommunitiesRoleManagementEnabled(): boolean {
  return (
    String(
      import.meta.env.VITE_COMMUNITIES_ROLE_MANAGEMENT_ENABLED ?? "true",
    ).toLowerCase() !== "false"
  );
}

// ── Config source helper ──────────────────────────────────────────────────────
// Communities flags share VITE_CLUSTER_CONFIG_SOURCE with dashboard clusters —
// enabling Django for clusters also enables the live toggle for these flags.

export function getCommunitiesConfigSource(): "ts" | "django" {
  return import.meta.env.VITE_CLUSTER_CONFIG_SOURCE === "django" ? "django" : "ts";
}


/** Master switch for collection creation. Default: true. */
export function isCollectionsCreationEnabled(): boolean {
  return (
    String(
      import.meta.env.VITE_COLLECTIONS_CREATION_ENABLED ?? "true",
    ).toLowerCase() !== "false"
  );
}

/**
 * VITE_FORM_BUILDER_ENABLED
 *   true  (default) → "🗂 Form Builder" entry shown in the admin user-menu.
 *   false           → Form Builder hidden for everyone, route returns dashboard.
 *
 * Build-time only — no Django / SiteSettings runtime toggle needed because
 * the feature is admin-only and deployment-controlled.
 */
export function isFormBuilderEnabled(): boolean {
  return (
    String(import.meta.env.VITE_FORM_BUILDER_ENABLED ?? "true").toLowerCase() !== "false"
  );
}

// ── Re-export SiteSettings type for call sites that only need it for communities ──

export type { SiteSettings as CommunitiesSiteSettings } from "./quicklinks-config";
