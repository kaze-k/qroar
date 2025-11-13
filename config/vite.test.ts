import path from "node:path";
import type { UserConfig } from "vite";
import { defineConfig } from "vite";

export default (target: "firefox" | "chrome"): UserConfig =>
  defineConfig({
    mode: "test",
    css: {
      devSourcemap: true,
    },
    build: {
      sourcemap: true,
      minify: false,
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
  });
