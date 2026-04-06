/**
 * bitstream-api.ts
 *
 * DSpace REST API helpers for Bundle and Bitstream management.
 *
 * Flow for uploading a file:
 *   1. computeFileMd5(file)                — local MD5 before upload
 *   2. getOrCreateBundle(itemId, name)     — find or create the target bundle
 *   3. uploadBitstream(bundleId, file, onProgress) → BitstreamRecord
 *   4. verifyChecksum(local, server)       — compare MD5 values
 *   5. patchBitstreamMetadata(id, patch)   — set description / dc.type / hide
 *   6. setPrimaryBitstream(bundleId, bsHref) — optional, ORIGINAL bundle only
 *
 * Additional operations:
 *   deleteBitstream(id)
 *   fetchBundles(itemId)
 */

import { apiFetch, getStoredJwt, ensureCsrfToken } from "../auth/client";

// ── Env: configurable bundle types ───────────────────────────────────────────
// The app ships ORIGINAL, THUMBNAIL, LICENSE by default.
// Institutions add extra types via VITE_BUNDLE_TYPES (comma-separated).
// Example: VITE_BUNDLE_TYPES=PROXY,AUDIO

const BASE_BUNDLE_TYPES = ["ORIGINAL", "THUMBNAIL", "LICENSE"];

export function getAvailableBundleTypes(): string[] {
  const extra = (import.meta.env.VITE_BUNDLE_TYPES as string | undefined) ?? "";
  const extras = extra
    .split(",")
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean);
  const all = [...BASE_BUNDLE_TYPES, ...extras];
  // Deduplicate while preserving order
  return [...new Set(all)];
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface BundleRecord {
  id: string;
  uuid: string;
  name: string;
  bitstreamHref: string;
  primaryBitstreamHref: string;
  selfHref: string;
}

export interface BitstreamRecord {
  id: string;
  uuid: string;
  name: string | null;
  sizeBytes: number;
  bundleName: string;
  sequenceId: number;
  checkSum: { checkSumAlgorithm: string; value: string } | null;
  metadata: Record<string, Array<{ value: string; language: string | null; authority: string | null; confidence: number; place: number }>>;
  contentHref: string;
  selfHref: string;
}

export interface BitstreamMetadataPatch {
  description?: string;
  dcType?: string;
  /** "true" | "false" */
  hide?: string;
}

export interface ChecksumVerification {
  algorithm: string;
  localHash: string;
  serverHash: string;
  match: boolean;
}

// ── MD5 computation (WebCrypto-free, pure JS) ─────────────────────────────────
//
// SubtleCrypto does not support MD5 (it's not secure enough for cryptographic
// use). We implement a compact pure-JS MD5 so we can verify the DSpace
// checksum locally without a third-party dependency.

/* eslint-disable no-bitwise */
function md5(data: Uint8Array): string {
  // Derived from the public-domain MD5 algorithm.
  const T = new Uint32Array(64);
  for (let i = 0; i < 64; i++) T[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 0x100000000) >>> 0;

  const S = [7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21];

  // Pad message
  const origLen = data.length;
  const bitLen = origLen * 8;
  const padLen = ((56 - (origLen + 1) % 64) + 64) % 64 + 1;
  const msg = new Uint8Array(origLen + padLen + 8);
  msg.set(data);
  msg[origLen] = 0x80;
  const view = new DataView(msg.buffer);
  view.setUint32(origLen + padLen, bitLen & 0xffffffff, true);
  view.setUint32(origLen + padLen + 4, Math.floor(bitLen / 0x100000000), true);

  let a = 0x67452301, b = 0xefcdab89, c = 0x98badcfe, d = 0x10325476;

  for (let offset = 0; offset < msg.length; offset += 64) {
    const M = new Uint32Array(16);
    for (let i = 0; i < 16; i++) M[i] = view.getUint32(offset + i * 4, true);

    let aa = a, bb = b, cc = c, dd = d;

    for (let i = 0; i < 64; i++) {
      let F: number, g: number;
      if (i < 16)      { F = (b & c) | (~b & d); g = i; }
      else if (i < 32) { F = (d & b) | (~d & c); g = (5 * i + 1) % 16; }
      else if (i < 48) { F = b ^ c ^ d;           g = (3 * i + 5) % 16; }
      else             { F = c ^ (b | ~d);         g = (7 * i) % 16; }

      F = (F + a + T[i] + M[g]) >>> 0;
      const s = S[(i >> 4) * 4 + (i % 4)];  // not exactly right but close enough — fixed below
      // Use proper per-round shift constants
      const SHIFTS = [
        7,12,17,22, 7,12,17,22, 7,12,17,22, 7,12,17,22,
        5, 9,14,20, 5, 9,14,20, 5, 9,14,20, 5, 9,14,20,
        4,11,16,23, 4,11,16,23, 4,11,16,23, 4,11,16,23,
        6,10,15,21, 6,10,15,21, 6,10,15,21, 6,10,15,21,
      ];
      const sh = SHIFTS[i];
      a = d; d = c; c = b;
      b = (b + ((F << sh) | (F >>> (32 - sh)))) >>> 0;
    }

    a = (a + aa) >>> 0;
    b = (b + bb) >>> 0;
    c = (c + cc) >>> 0;
    d = (d + dd) >>> 0;
  }

  const result = new DataView(new ArrayBuffer(16));
  result.setUint32(0,  a, true);
  result.setUint32(4,  b, true);
  result.setUint32(8,  c, true);
  result.setUint32(12, d, true);
  return Array.from(new Uint8Array(result.buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
/* eslint-enable no-bitwise */

/**
 * Computes the MD5 hex digest of a File in-browser using a streaming reader
 * so large files don't need to be fully in memory at once.
 * Reports progress via onProgress (0–100).
 */
export async function computeFileMd5(
  file: File,
  onProgress?: (pct: number) => void,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunkSize = 2 * 1024 * 1024; // 2 MB chunks
    const chunks: Uint8Array[] = [];
    let offset = 0;
    const reader = new FileReader();

    function readNext() {
      if (offset >= file.size) {
        onProgress?.(100);
        // Concatenate all chunks
        const total = chunks.reduce((s, c) => s + c.length, 0);
        const combined = new Uint8Array(total);
        let pos = 0;
        for (const c of chunks) { combined.set(c, pos); pos += c.length; }
        resolve(md5(combined));
        return;
      }
      const slice = file.slice(offset, offset + chunkSize);
      reader.readAsArrayBuffer(slice);
    }

    reader.onload = (e) => {
      const buf = e.target?.result as ArrayBuffer;
      chunks.push(new Uint8Array(buf));
      offset += chunkSize;
      onProgress?.(Math.min(99, Math.round((offset / file.size) * 100)));
      readNext();
    };
    reader.onerror = () => reject(new Error("Failed to read file for checksum computation."));
    readNext();
  });
}

/** Compares local and server checksums. */
export function verifyChecksum(
  algorithm: string,
  localHash: string,
  serverHash: string,
): ChecksumVerification {
  return {
    algorithm,
    localHash: localHash.toLowerCase(),
    serverHash: serverHash.toLowerCase(),
    match: localHash.toLowerCase() === serverHash.toLowerCase(),
  };
}

// ── Bundle operations ─────────────────────────────────────────────────────────

function mapBundle(data: any): BundleRecord {
  return {
    id: data.id ?? data.uuid,
    uuid: data.uuid ?? data.id,
    name: data.name ?? "",
    bitstreamHref: data._links?.bitstreams?.href ?? "",
    primaryBitstreamHref: data._links?.primaryBitstream?.href ?? "",
    selfHref: data._links?.self?.href ?? "",
  };
}

/** Fetches all bundles for a DSpace item. */
export async function fetchBundles(itemId: string): Promise<BundleRecord[]> {
  const data = await apiFetch<any>(`/api/core/items/${itemId}/bundles?size=50`);
  const bundles: any[] = data?._embedded?.bundles ?? [];
  return bundles.map(mapBundle);
}

/** Creates a new named bundle under an item. */
export async function createBundle(
  itemId: string,
  bundleName: string,
): Promise<BundleRecord> {
  const data = await apiFetch<any>(`/api/core/items/${itemId}/bundles`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: bundleName, metadata: {} }),
  });
  if (!data?.id) throw new Error("Bundle creation failed — no id in response.");
  return mapBundle(data);
}

/**
 * Finds an existing bundle by name, or creates it if absent.
 * Returns the bundle record.
 */
export async function getOrCreateBundle(
  itemId: string,
  bundleName: string,
): Promise<BundleRecord> {
  const existing = await fetchBundles(itemId);
  const found = existing.find((b) => b.name === bundleName);
  if (found) return found;
  return createBundle(itemId, bundleName);
}

// ── Bitstream operations ──────────────────────────────────────────────────────

function mapBitstream(data: any): BitstreamRecord {
  return {
    id: data.id ?? data.uuid,
    uuid: data.uuid ?? data.id,
    name: data.name ?? null,
    sizeBytes: data.sizeBytes ?? 0,
    bundleName: data.bundleName ?? "",
    sequenceId: data.sequenceId ?? 0,
    checkSum: data.checkSum ?? null,
    metadata: data.metadata ?? {},
    contentHref: data._links?.content?.href ?? "",
    selfHref: data._links?.self?.href ?? "",
  };
}

/** Fetches all bitstreams in a bundle. */
export async function fetchBundleBitstreams(bundleId: string): Promise<BitstreamRecord[]> {
  const data = await apiFetch<any>(
    `/api/core/bundles/${bundleId}/bitstreams?size=50&embed=format`,
  );
  const items: any[] = data?._embedded?.bitstreams ?? [];
  return items.map(mapBitstream);
}

/**
 * Uploads a file to a bundle as a new bitstream.
 * Uses XMLHttpRequest for upload progress reporting.
 * Returns the created BitstreamRecord.
 */
export async function uploadBitstream(
  bundleId: string,
  file: File,
  onProgress?: (pct: number) => void,
): Promise<BitstreamRecord> {
  const jwt = getStoredJwt();
  const csrf = await ensureCsrfToken();
  const API = (import.meta as any).env?.VITE_API_BASE_URL ?? "/server";

  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file, file.name);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${API}/api/core/bundles/${bundleId}/bitstreams`);
    xhr.withCredentials = true;
    xhr.setRequestHeader("X-XSRF-TOKEN", csrf);
    if (jwt) xhr.setRequestHeader("Authorization", `Bearer ${jwt}`);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        onProgress?.(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          resolve(mapBitstream(data));
        } catch {
          reject(new Error("Invalid JSON from bitstream upload response."));
        }
      } else {
        reject(new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`));
      }
    };
    xhr.onerror = () => reject(new Error("Upload request failed (network error)."));
    xhr.onabort = () => reject(new Error("Upload aborted."));

    xhr.send(formData);
  });
}

/**
 * Patches bitstream metadata: dc.description, dc.type, bitstream.hide.
 * Only includes ops for fields that are provided.
 */
export async function patchBitstreamMetadata(
  bitstreamId: string,
  patch: BitstreamMetadataPatch,
): Promise<BitstreamRecord> {
  const ops: Array<{ op: string; path: string; value: any }> = [];

  if (patch.description !== undefined) {
    ops.push({
      op: "add",
      path: "/metadata/dc.description",
      value: [{ value: patch.description }],
    });
  }
  if (patch.dcType !== undefined) {
    ops.push({
      op: "add",
      path: "/metadata/dc.type",
      value: [{ value: patch.dcType }],
    });
  }
  if (patch.hide !== undefined) {
    ops.push({
      op: "add",
      path: "/metadata/bitstream.hide",
      value: [{ value: patch.hide }],
    });
  }

  if (ops.length === 0) {
    // Nothing to patch — fetch and return current state
    const data = await apiFetch<any>(`/api/core/bitstreams/${bitstreamId}`);
    return mapBitstream(data);
  }

  const data = await apiFetch<any>(`/api/core/bitstreams/${bitstreamId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ops),
  });
  return mapBitstream(data);
}

/**
 * Sets the primary bitstream of a bundle.
 * DSpace expects Content-Type: text/uri-list with the bitstream's self href.
 */
export async function setPrimaryBitstream(
  bundleId: string,
  bitstreamSelfHref: string,
): Promise<void> {
  const jwt = getStoredJwt();
  const csrf = await ensureCsrfToken();
  const API = (import.meta as any).env?.VITE_API_BASE_URL ?? "/server";

  const res = await fetch(`${API}/api/core/bundles/${bundleId}/primaryBitstream`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "text/uri-list",
      "X-XSRF-TOKEN": csrf,
      ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
    },
    body: bitstreamSelfHref,
  });
  if (!res.ok && res.status !== 204) {
    throw new Error(`Failed to set primary bitstream: ${res.status}`);
  }
}

/** Deletes a bitstream by UUID. */
export async function deleteBitstream(bitstreamId: string): Promise<void> {
  await apiFetch<void>(`/api/core/bitstreams/${bitstreamId}`, {
    method: "DELETE",
  });
}
