import type { UserConfig } from "vite";
import { defineConfig, mergeConfig } from "vite";

import baseConfig from "./config/vite.base";
import devConfig from "./config/vite.dev";
import proConfig from "./config/vite.pro";
import testConfig from "./config/vite.test";

function getTarget(): "firefox" | "chrome" {
  const arg = process.argv.find((v) => v.startsWith("--target="));
  if (typeof arg === "undefined") throw new Error("target not found");
  const target = arg.split("=")[1];
  if (target !== "firefox" && target !== "chrome")
    throw new Error("target must be firefox or chrome");
  return target;
}

const target = getTarget();

// https://vite.dev/config/
const viteConfig = ({ mode }: { mode: string }): UserConfig => {
  const base = baseConfig(target);

  if (mode === "production") {
    const pro = proConfig(target);
    return mergeConfig(base, pro);
  } else if (mode === "development") {
    const dev = devConfig(target);
    return mergeConfig(base, dev);
  } else if (mode === "test") {
    const test = testConfig(target);
    return mergeConfig(base, test);
  } else {
    const pro = proConfig(target);
    return mergeConfig(base, pro);
  }
};

export default defineConfig(viteConfig);
