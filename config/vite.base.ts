import path from "node:path";
import { crx } from "@crxjs/vite-plugin";
import Unocss from "unocss/vite";
import type { UserConfig } from "vite";
import { defineConfig } from "vite";
import Solid from "vite-plugin-solid";
import manifestChrome from "../manifests/manifest.chrome";
import manifestFirefox from "../manifests/manifest.firefox";

export default (target: "firefox" | "chrome"): UserConfig =>
  defineConfig({
    root: process.cwd(),
    base: "/",
    publicDir: "public",
    cacheDir: "node_modules/.vite",
    envDir: "root",
    envPrefix: ["VITE_"],
    appType: "mpa",
    logLevel: "info",
    clearScreen: true,
    json: {
      namedExports: true,
      stringify: "auto",
    },
    build: {
      target: "ES2020",
      outDir: target === "firefox" ? "dist/firefox" : "dist/chrome",
      assetsDir: "static",
      assetsInlineLimit: 0,
      cssCodeSplit: true,
      cssTarget: "ES2020",
      cssMinify: "esbuild",
      manifest: ".vite/manifest.json",
      emitAssets: true,
      emptyOutDir: true,
      copyPublicDir: true,
      reportCompressedSize: true,
      chunkSizeWarningLimit: 500,
      modulePreload: {
        polyfill: true,
      },
      rollupOptions: {
        cache: true,
        output: {
          chunkFileNames: "assets/scripts/chunks/[name].js",
          entryFileNames: (chunkInfo) => {
            const name = chunkInfo.name;
            if (name === "background") {
              return "background.js";
            }
            return "assets/scripts/entries/[name].js";
          },
          assetFileNames: (assetInfo) => {
            const names = assetInfo.names || [];
            const firstName = names[0] || "";
            const ext = firstName.split(".").pop();
            if (ext === "css") {
              return "assets/styles/[name][extname]";
            }
            return "assets/[ext]/[name][extname]";
          },
          manualChunks: (id) => {
            if (!id.includes("node_modules")) return;
            const parts = id.split("node_modules/");
            const pkgPath = parts[parts.length - 1];
            const segments = pkgPath.split("/");
            const name = segments[0].startsWith("@")
              ? `${segments[0]}-${segments[1]}`
              : segments[0];
            return `${name.replace("@", "")}`;
          },
        },
      },
    },
    define: {
      __TARGET__: JSON.stringify(target),
    },
    plugins: [
      Unocss(),
      Solid(),
      crx({
        manifest: target === "firefox" ? manifestFirefox : manifestChrome,
        browser: target === "firefox" ? "firefox" : "chrome",
      }),
    ],
    resolve: {
      alias: {
        "~": path.resolve(__dirname, "../"),
        "@": path.resolve(__dirname, "../src"),
        "#": path.resolve(__dirname, "../types"),
      },
    },
    preview: {
      host: true,
      port: 4174,
      strictPort: true,
      open: false,
    },
    server: {
      host: true,
      port: 5173,
      strictPort: true,
      open: false,
      hmr: {
        host: "localhost",
        port: 5173,
        protocol: "ws",
      },
    },
    worker: {
      format: "iife",
    },
  });
