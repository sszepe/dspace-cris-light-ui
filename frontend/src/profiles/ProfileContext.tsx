/**
 * src/profiles/ProfileContext.tsx
 *
 * Provides the active ProfileConfig to the entire component tree.
 *
 * Usage
 * -----
 * // In app root (already has AuthProvider above it):
 * import { ProfileProvider } from "../profiles/ProfileContext";
 *
 * <ProfileProvider>
 *   <AppInner />
 * </ProfileProvider>
 *
 * // In any component:
 * import { useProfile } from "../profiles/ProfileContext";
 * const { profile, fieldLabel, modal } = useProfile();
 *
 * Resolved helpers on the context
 * --------------------------------
 * fieldLabel(field)         — looks up a field name, applying profile
 *                             overrides on top of the shared base labels.
 * modal(entityType)         — returns the ModalRegistryEntry for an entity
 *                             type, or undefined if none is registered.
 * hasFeature(flag)          — returns the boolean feature flag value.
 */

import React from "react";
import { FIELD_LABELS } from "../config/field-labels";
import type { ModalRegistryEntry, ProfileConfig } from "./profile-config";
import { getActiveProfile } from "./registry";

// ── Context type ──────────────────────────────────────────────────────────────

type ProfileContextValue = {
  profile: ProfileConfig;
  /** Resolves a metadata field name to a display label. */
  fieldLabel: (field: string) => string;
  /** Returns the modal registry entry for an entity type, if any. */
  modal: (entityType: string) => ModalRegistryEntry | undefined;
  /** Returns the value of a feature flag. */
  hasFeature: (flag: keyof ProfileConfig["features"]) => boolean;
};

// ── Context ───────────────────────────────────────────────────────────────────

const ProfileContext = React.createContext<ProfileContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────

type ProfileProviderProps = {
  children: React.ReactNode;
  /** Override the active profile (useful in tests / Storybook). */
  profile?: ProfileConfig;
};

export function ProfileProvider({ children, profile: overrideProfile }: ProfileProviderProps) {
  const profile = overrideProfile ?? getActiveProfile();

  // Merged label map: base labels, then profile overrides (profile wins).
  const mergedLabels = React.useMemo(
    () => ({ ...FIELD_LABELS, ...profile.fieldLabelOverrides }),
    [profile]
  );

  // Modal registry index keyed by entityType for O(1) lookup.
  const modalIndex = React.useMemo(
    () =>
      new Map<string, ModalRegistryEntry>(
        profile.modalRegistry.map((m) => [m.entityType, m])
      ),
    [profile]
  );

  const fieldLabel = React.useCallback(
    (field: string): string => mergedLabels[field.toLowerCase()] ?? field,
    [mergedLabels]
  );

  const modal = React.useCallback(
    (entityType: string): ModalRegistryEntry | undefined =>
      modalIndex.get(entityType),
    [modalIndex]
  );

  const hasFeature = React.useCallback(
    (flag: keyof ProfileConfig["features"]): boolean =>
      profile.features[flag],
    [profile]
  );

  const value = React.useMemo(
    () => ({ profile, fieldLabel, modal, hasFeature }),
    [profile, fieldLabel, modal, hasFeature]
  );

  // Apply theme CSS vars to :root
  React.useLayoutEffect(() => {
    const vars = profile.theme.cssVars ?? {};
    const root = document.documentElement;
    for (const [prop, val] of Object.entries(vars)) {
      root.style.setProperty(prop, val);
    }
    return () => {
      for (const prop of Object.keys(vars)) {
        root.style.removeProperty(prop);
      }
    };
  }, [profile.theme.cssVars]);

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useProfile(): ProfileContextValue {
  const ctx = React.useContext(ProfileContext);
  if (!ctx) {
    throw new Error("useProfile must be used inside <ProfileProvider>");
  }
  return ctx;
}
