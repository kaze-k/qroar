import type { UserConfig } from "vite";
import { defineConfig } from "vite";

export default (_target: "firefox" | "chrome"): UserConfig =>
  defineConfig({
    mode: "development",
    css: {
      devSourcemap: true,
    },
    build: {
      sourcemap: true,
      minify: false,
    },
  });
