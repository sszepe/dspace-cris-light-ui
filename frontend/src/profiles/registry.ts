/**
 * src/profiles/registry.ts
 *
 * Maps VITE_PROFILE env values to their ProfileConfig modules.
 * Import this only from ProfileProvider — everywhere else use useProfile().
 *
 * Active profile is selected via the VITE_PROFILE env variable:
 *   VITE_PROFILE=plain   (default — generic DSpace CRIS)
 *
 * Adding a new profile
 * --------------------
 * 1. Create src/profiles/<key>/index.ts  exporting a default ProfileConfig.
 * 2. Import it below and add it to PROFILES.
 * 3. Add the key to ProfileKey in profile-config.ts.
 * 4. Set VITE_PROFILE=<key> in .env.local.
 */

import type { ProfileConfig } from "./profile-config";
import plainProfile from "./plain/index";

const PROFILES: Record<string, ProfileConfig> = {
  plain: plainProfile,
};

export function getProfile(key: string): ProfileConfig {
  if (key in PROFILES) {
    return PROFILES[key];
  }
  console.warn(
    `[ProfileRegistry] Unknown profile key "${key}". Falling back to "plain".`
  );
  return PROFILES.plain;
}

/**
 * Reads VITE_PROFILE from the environment and returns the matching profile.
 * Falls back to "plain" if the env var is unset or unrecognised.
 */
export function getActiveProfile(): ProfileConfig {
  const key = (import.meta.env.VITE_PROFILE ?? "plain").trim().toLowerCase();
  return getProfile(key);
}
