/**
 * bitstream-viewer.tsx
 *
 * Inline viewer panel for DSpace bitstreams. Opened via a "👁 View" button on
 * each bitstream row. The correct viewer is auto-selected from:
 *
 *   1. Bundle name   PROXY → Video.js (video or audio)
 *                    THUMBNAIL → simple <img> lightbox
 *   2. MIME type     video/* → Video.js
 *                    audio/* → Video.js (audio skin)
 *                    application/pdf → PDF.js embed
 *                    image/* → Mirador (if IIIF manifest available) or <img>
 *   3. Extension     .pdf → PDF.js
 *                    .mp4 / .webm / .ogv / .mov → Video.js
 *                    .mp3 / .ogg / .wav / .flac / .m4a → Video.js audio
 *                    .jpg / .jpeg / .png / .gif / .webp / .tif → image
 *
 * All three viewers are loaded lazily from cdnjs at first use so the main
 * bundle stays small.
 *
 * CDN URLs (pinned versions):
 *   Video.js   7.21.5  https://cdnjs.cloudflare.com/ajax/libs/video.js/7.21.5/
 *   PDF.js     3.11.174 https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/
 *   Mirador    3.3.0   https://cdnjs.cloudflare.com/ajax/libs/mirador/3.3.0/
 *
 * Props:
 *   bs          — the BitstreamRecord to view
 *   bundleName  — name of the owning bundle (ORIGINAL, PROXY, THUMBNAIL, …)
 *   iiifManifestUrl — optional IIIF manifest URL for Mirador; if absent and
 *                     the file is an image the viewer falls back to <img>
 *   onClose     — called when the user dismisses the viewer
 */

import React from "react";
import type { BitstreamRecord } from "../api/bitstream-api";

// ── CDN asset URLs ────────────────────────────────────────────────────────────

const VJS_VERSION = "7.21.5";
const VJS_CSS = `https://cdnjs.cloudflare.com/ajax/libs/video.js/${VJS_VERSION}/video-js.min.css`;
const VJS_JS  = `https://cdnjs.cloudflare.com/ajax/libs/video.js/${VJS_VERSION}/video.min.js`;

const PDFJS_VERSION = "3.11.174";
const PDFJS_WORKER = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.worker.min.js`;

// Mirador 3 is a large bundle (~2 MB); we lazy-load it via script tag
const MIRADOR_VERSION = "3.3.0";
const MIRADOR_JS  = `https://unpkg.com/mirador@${MIRADOR_VERSION}/dist/mirador.min.js`;

// ── Type classification ───────────────────────────────────────────────────────

type ViewerKind = "videojs" | "audiojs" | "pdfjs" | "mirador" | "image" | "none";

const VIDEO_EXTS  = new Set(["mp4", "webm", "ogv", "mov", "ogg"]);
const AUDIO_EXTS  = new Set(["mp3", "ogg", "wav", "flac", "m4a", "aac"]);
const IMAGE_EXTS  = new Set(["jpg", "jpeg", "png", "gif", "webp", "tif", "tiff", "bmp"]);
const PDF_EXTS    = new Set(["pdf"]);

function ext(name: string | null): string {
  if (!name) return "";
  const parts = name.split(".");
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "";
}

export function classifyViewer(
  bs: BitstreamRecord,
  bundleName: string,
  iiifManifestUrl?: string | null,
): ViewerKind {
  const mime = (bs.metadata?.["dc.type"]?.[0]?.value ?? "").toLowerCase();
  const name = bs.name ?? "";
  const e = ext(name);

  // PROXY bundle → always media player
  if (bundleName === "PROXY") {
    if (mime.startsWith("audio/") || AUDIO_EXTS.has(e)) return "audiojs";
    return "videojs"; // default for PROXY
  }

  // THUMBNAIL bundle → always plain image
  if (bundleName === "THUMBNAIL") return "image";

  // MIME-based
  if (mime.startsWith("video/"))                             return "videojs";
  if (mime.startsWith("audio/"))                             return "audiojs";
  if (mime === "application/pdf" || PDF_EXTS.has(e))        return "pdfjs";
  if (mime.startsWith("image/") || IMAGE_EXTS.has(e)) {
    return iiifManifestUrl ? "mirador" : "image";
  }

  // Extension-based fallback
  if (VIDEO_EXTS.has(e))  return "videojs";
  if (AUDIO_EXTS.has(e))  return "audiojs";
  if (PDF_EXTS.has(e))    return "pdfjs";
  if (IMAGE_EXTS.has(e))  return "image";

  return "none";
}

// ── Script/link loader helpers ────────────────────────────────────────────────

const loadedScripts = new Set<string>();
const loadedStyles  = new Set<string>();

function loadScript(src: string): Promise<void> {
  if (loadedScripts.has(src)) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.onload = () => { loadedScripts.add(src); resolve(); };
    s.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(s);
  });
}

function loadStyle(href: string): Promise<void> {
  if (loadedStyles.has(href)) return Promise.resolve();
  return new Promise((resolve) => {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = href;
    l.onload = () => { loadedStyles.add(href); resolve(); };
    l.onerror = () => resolve(); // style failure is non-fatal
    document.head.appendChild(l);
  });
}

// ── Video.js viewer ───────────────────────────────────────────────────────────

function VideoJsViewer({
  url, name, isAudio,
}: { url: string; name: string; isAudio: boolean }) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const playerRef    = React.useRef<any>(null);
  const [ready, setReady] = React.useState(false);
  const [err, setErr]     = React.useState<string | null>(null);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        await Promise.all([loadStyle(VJS_CSS), loadScript(VJS_JS)]);
        if (!alive || !containerRef.current) return;

        const videojs = (window as any).videojs;
        if (!videojs) throw new Error("Video.js did not load.");

        // Create video element
        const el = document.createElement(isAudio ? "audio" : "video");
        el.className = "video-js vjs-default-skin vjs-big-play-centered";
        el.setAttribute("controls", "");
        el.setAttribute("preload", "auto");
        el.style.width = "100%";
        el.style.maxHeight = isAudio ? "80px" : "480px";
        containerRef.current.appendChild(el);

        playerRef.current = videojs(el, {
          fluid: !isAudio,
          responsive: true,
          sources: [{ src: url, type: guessMime(name) }],
        });
        if (alive) setReady(true);
      } catch (e: any) {
        if (alive) setErr(e?.message ?? "Failed to load player.");
      }
    })();

    return () => {
      alive = false;
      try { playerRef.current?.dispose(); } catch { /* ignore */ }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  if (err) return <ViewerError message={err} />;
  return (
    <div style={{ background: "#000", borderRadius: 6, overflow: "hidden", minHeight: isAudio ? 60 : 200 }}>
      {!ready && <ViewerLoading label={isAudio ? "Loading audio player…" : "Loading video player…"} />}
      <div ref={containerRef} style={{ width: "100%" }} />
    </div>
  );
}

function guessMime(name: string): string {
  const e = ext(name);
  const map: Record<string, string> = {
    mp4: "video/mp4", webm: "video/webm", ogv: "video/ogg", mov: "video/quicktime",
    mp3: "audio/mpeg", ogg: "audio/ogg", wav: "audio/wav",
    flac: "audio/flac", m4a: "audio/mp4", aac: "audio/aac",
  };
  return map[e] ?? "";
}

// ── PDF.js viewer ─────────────────────────────────────────────────────────────

function PdfJsViewer({ url }: { url: string }) {
  const canvasRef  = React.useRef<HTMLCanvasElement>(null);
  const [pages, setPages]       = React.useState(0);
  const [current, setCurrent]   = React.useState(1);
  const [scale, setScale]       = React.useState(1.4);
  const [loading, setLoading]   = React.useState(true);
  const [err, setErr]           = React.useState<string | null>(null);
  const pdfRef = React.useRef<any>(null);

  // Load PDF.js worker + lib
  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        await loadScript(`https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.min.js`);
        const pdfjsLib = (window as any).pdfjsLib;
        if (!pdfjsLib) throw new Error("PDF.js did not load.");
        pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;

        const pdf = await pdfjsLib.getDocument(url).promise;
        if (!alive) return;
        pdfRef.current = pdf;
        setPages(pdf.numPages);
        setLoading(false);
      } catch (e: any) {
        if (alive) setErr(e?.message ?? "Failed to load PDF.");
      }
    })();
    return () => { alive = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  // Render current page
  React.useEffect(() => {
    if (!pdfRef.current || !canvasRef.current || loading) return;
    let alive = true;
    (async () => {
      try {
        const page = await pdfRef.current.getPage(current);
        const viewport = page.getViewport({ scale });
        const canvas = canvasRef.current!;
        canvas.width  = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d");
        if (!ctx || !alive) return;
        await page.render({ canvasContext: ctx, viewport }).promise;
      } catch {/* ignore */}
    })();
    return () => { alive = false; };
  }, [current, scale, loading]);

  if (err) return <ViewerError message={err} />;

  return (
    <div style={{ display: "grid", gap: 8 }}>
      {/* Toolbar */}
      {!loading && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 10px", background: "#1e293b", borderRadius: "6px 6px 0 0", flexWrap: "wrap" }}>
          <button type="button" onClick={() => setCurrent((p) => Math.max(1, p - 1))} disabled={current <= 1}
            style={toolBtn}>← Prev</button>
          <span style={{ fontSize: 12, color: "#94a3b8" }}>Page {current} / {pages}</span>
          <button type="button" onClick={() => setCurrent((p) => Math.min(pages, p + 1))} disabled={current >= pages}
            style={toolBtn}>Next →</button>
          <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
            <button type="button" onClick={() => setScale((s) => Math.max(0.5, s - 0.2))} style={toolBtn}>−</button>
            <span style={{ fontSize: 12, color: "#94a3b8", minWidth: 40, textAlign: "center" }}>{Math.round(scale * 100)}%</span>
            <button type="button" onClick={() => setScale((s) => Math.min(4, s + 0.2))} style={toolBtn}>+</button>
          </div>
        </div>
      )}

      <div style={{ background: "#374151", borderRadius: loading ? 6 : "0 0 6px 6px", minHeight: 300, overflow: "auto", display: "flex", justifyContent: "center", alignItems: loading ? "center" : "flex-start", padding: 12 }}>
        {loading
          ? <ViewerLoading label="Loading PDF…" dark />
          : <canvas ref={canvasRef} style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.5)", borderRadius: 2 }} />
        }
      </div>
    </div>
  );
}

const toolBtn: React.CSSProperties = {
  padding: "3px 8px", fontSize: 12, background: "#334155",
  border: "1px solid #475569", borderRadius: 4, color: "#e2e8f0",
  cursor: "pointer",
};

// ── Mirador IIIF viewer ───────────────────────────────────────────────────────

function MiradorViewer({
  manifestUrl, containerId,
}: { manifestUrl: string; containerId: string }) {
  const [err, setErr]     = React.useState<string | null>(null);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        await loadScript(MIRADOR_JS);
        const Mirador = (window as any).Mirador;
        if (!Mirador) throw new Error("Mirador did not load.");
        if (!alive) return;

        Mirador.viewer({
          id: containerId,
          manifests: { [manifestUrl]: {} },
          windows: [{ manifestId: manifestUrl }],
          workspace: { showZoomControls: true },
          workspaceControlPanel: { enabled: false },
        });
        if (alive) setReady(true);
      } catch (e: any) {
        if (alive) setErr(e?.message ?? "Failed to load Mirador.");
      }
    })();

    return () => { alive = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manifestUrl, containerId]);

  if (err) return <ViewerError message={err} />;
  return (
    <div style={{ position: "relative", minHeight: 480, borderRadius: 6, overflow: "hidden", background: "#111" }}>
      {!ready && <ViewerLoading label="Loading IIIF viewer…" dark />}
      <div id={containerId} style={{ width: "100%", height: 480 }} />
    </div>
  );
}

// ── Simple image viewer (lightbox) ────────────────────────────────────────────

function ImageViewer({ url, name }: { url: string; name: string }) {
  const [zoom, setZoom] = React.useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: 12, background: "#111", borderRadius: 6 }}>
      <img
        src={url}
        alt={name}
        onClick={() => setZoom((v) => !v)}
        style={{
          maxWidth: zoom ? "100%" : "min(100%, 800px)",
          maxHeight: zoom ? "none" : 480,
          objectFit: "contain",
          cursor: "zoom-in",
          borderRadius: 4,
          transition: "max-height 0.2s",
        }}
      />
      <div style={{ fontSize: 11, color: "#6b7280" }}>Click image to {zoom ? "shrink" : "expand"}</div>
    </div>
  );
}

// ── Utility sub-components ────────────────────────────────────────────────────

function ViewerLoading({ label, dark }: { label: string; dark?: boolean }) {
  return (
    <div style={{ padding: 32, textAlign: "center", color: dark ? "#94a3b8" : "#6b7280", fontSize: 13 }}>
      <div style={{ fontSize: 24, marginBottom: 8 }}>⏳</div>
      {label}
    </div>
  );
}

function ViewerError({ message }: { message: string }) {
  return (
    <div style={{ padding: "12px 14px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 6, fontSize: 13, color: "#b91c1c" }}>
      ⚠ {message}
    </div>
  );
}

// ── Viewer badge — shown on the bitstream row ─────────────────────────────────

const VIEWER_LABELS: Record<ViewerKind, string | null> = {
  videojs:  "▶ Video",
  audiojs:  "♪ Audio",
  pdfjs:    "📄 PDF",
  mirador:  "🖼 IIIF",
  image:    "🖼 Image",
  none:     null,
};

export function ViewerBadge({ kind }: { kind: ViewerKind }) {
  const label = VIEWER_LABELS[kind];
  if (!label) return null;
  const colors: Record<ViewerKind, [string, string]> = {
    videojs:  ["#fef3c7", "#92400e"],
    audiojs:  ["#fef3c7", "#92400e"],
    pdfjs:    ["#fef2f2", "#b91c1c"],
    mirador:  ["#eff6ff", "#1d4ed8"],
    image:    ["#f0fdf4", "#166534"],
    none:     ["#f3f4f6", "#6b7280"],
  };
  const [bg, color] = colors[kind];
  return (
    <span style={{ fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 3, background: bg, color, border: `1px solid ${color}22`, whiteSpace: "nowrap" }}>
      {label}
    </span>
  );
}

// ── Main exported viewer component ────────────────────────────────────────────

type Props = {
  bs: BitstreamRecord;
  bundleName: string;
  /** IIIF manifest URL for Mirador — if absent, image viewer falls back to <img> */
  iiifManifestUrl?: string | null;
  onClose: () => void;
};

export function BitstreamViewer({ bs, bundleName, iiifManifestUrl, onClose }: Props) {
  const kind = classifyViewer(bs, bundleName, iiifManifestUrl);
  const url  = bs.contentHref;
  const name = bs.name ?? "file";

  // Stable ID for Mirador container
  const miradorId = React.useMemo(() => `mirador-${bs.id}`, [bs.id]);

  const viewerTitle: Record<ViewerKind, string> = {
    videojs: "Video player",
    audiojs: "Audio player",
    pdfjs:   "PDF viewer",
    mirador: "IIIF image viewer",
    image:   "Image viewer",
    none:    "File preview",
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.75)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 16,
    }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: "#fff", borderRadius: 10, width: "100%",
        maxWidth: kind === "pdfjs" ? 900 : kind === "mirador" ? 1000 : 860,
        maxHeight: "95vh", overflow: "hidden",
        display: "flex", flexDirection: "column",
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderBottom: "1px solid #e5e7eb", flexShrink: 0 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {name}
            </div>
            <div style={{ fontSize: 11, color: "#6b7280", marginTop: 1 }}>
              {viewerTitle[kind]} · {bundleName} bundle
            </div>
          </div>
          <ViewerBadge kind={kind} />
          {url && (
            <a href={url} target="_blank" rel="noopener noreferrer" download
              style={{ padding: "4px 10px", fontSize: 12, border: "1px solid #d1d5db", borderRadius: 6, background: "#f9fafb", color: "#374151", textDecoration: "none", whiteSpace: "nowrap" }}>
              ↓ Download
            </a>
          )}
          <button type="button" onClick={onClose}
            style={{ padding: "4px 10px", fontSize: 18, border: "none", background: "none", cursor: "pointer", color: "#6b7280", lineHeight: 1, flexShrink: 0 }}>
            ✕
          </button>
        </div>

        {/* Viewer body */}
        <div style={{ flex: 1, overflow: "auto", padding: kind === "pdfjs" || kind === "mirador" ? 0 : 16 }}>
          {!url && <ViewerError message="No content URL available for this bitstream." />}

          {url && kind === "videojs"  && <VideoJsViewer url={url} name={name} isAudio={false} />}
          {url && kind === "audiojs"  && <VideoJsViewer url={url} name={name} isAudio={true} />}
          {url && kind === "pdfjs"    && <PdfJsViewer url={url} />}
          {url && kind === "mirador"  && iiifManifestUrl && (
            <MiradorViewer manifestUrl={iiifManifestUrl} containerId={miradorId} />
          )}
          {url && kind === "image"    && <ImageViewer url={url} name={name} />}
          {url && kind === "none"     && (
            <div style={{ padding: 20, textAlign: "center", color: "#6b7280", fontSize: 13 }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📎</div>
              No inline viewer available for this file type.
              <div style={{ marginTop: 12 }}>
                <a href={url} target="_blank" rel="noopener noreferrer" download
                  style={{ padding: "7px 16px", border: "1px solid #d1d5db", borderRadius: 6, background: "#f9fafb", color: "#374151", textDecoration: "none", fontWeight: 600, fontSize: 13 }}>
                  ↓ Download file
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
