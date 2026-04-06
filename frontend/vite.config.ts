import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 4000,
    proxy: {
      // ── DSpace REST API ──────────────────────────────────────────────────
      "/server": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on("proxyRes", (proxyRes) => {
            const c = proxyRes.headers["set-cookie"];
            if (c) proxyRes.headers["set-cookie"] = c.map((s: string) =>
              s.replace(/;\s*Secure/gi, "").replace(/;\s*SameSite=None/gi, "; SameSite=Lax"));
          });
        },
      },
      // ── Django config API + admin + schema ───────────────────────────────
      // Matches /api/dspace-config/*, /admin/*, /api/schema/*
      "/api": {
        target: "http://localhost:5189",
        changeOrigin: true,
        secure: false,
      },
      "/admin": {
        target: "http://localhost:5189",
        changeOrigin: true,
        secure: false,
      },
      "/static": {
        target: "http://localhost:5189",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: { outDir: "dist", sourcemap: false },
});
