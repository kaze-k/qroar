import path from "node:path";
import type { UserConfig } from "vite";
import { defineConfig } from "vite";
import zip from "vite-plugin-zip-pack";
import { name, version } from "../package.json";

export default (target: "firefox" | "chrome"): UserConfig =>
  defineConfig({
    mode: "production",
    build: {
      sourcemap: false,
      minify: true,
      rollupOptions: {
        input:
          target === "firefox"
            ? {
                options: path.resolve(__dirname, "../src/options/index.html"),
                panel: path.resolve(__dirname, "../src/panel/index.html"),
                window: path.resolve(__dirname, "../src/window/index.html"),
                background: path.resolve(
                  __dirname,
                  "../src/background/index.ts",
                ),
              }
            : {
                options: path.resolve(__dirname, "../src/options/index.html"),
                panel: path.resolve(__dirname, "../src/panel/index.html"),
                popup: path.resolve(__dirname, "../src/popup/index.html"),
                window: path.resolve(__dirname, "../src/window/index.html"),
                background: path.resolve(
                  __dirname,
                  "../src/background/index.ts",
                ),
              },
      },
    },
    esbuild: {
      drop: ["console"],
    },
    plugins: [
      zip({
        inDir: target === "firefox" ? "dist/firefox" : "dist/chrome",
        outDir: "release",
        outFileName: `${name}-${target}-v${version}.zip`,
        filter: (filename, _filePath, isDirectory) => {
          if (filename === ".vite" && isDirectory) return false;
          return true;
        },
      }),
    ],
  });
