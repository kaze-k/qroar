import { defineManifest } from "@crxjs/vite-plugin";
import pkg from "../package.json";

export default defineManifest({
  manifest_version: 3,
  name: pkg.name,
  version: pkg.version,
  description: "__MSG_description__",
  default_locale: "en",
  icons: {
    16: "icons/color/icon-16.png",
    32: "icons/color/icon-32.png",
    48: "icons/color/icon-48.png",
    64: "icons/color/icon-64.png",
    128: "icons/color/icon-128.png",
  },
  action: {
    default_icon: {
      16: "icons/color/icon-16.png",
      32: "icons/color/icon-32.png",
      48: "icons/color/icon-48.png",
      64: "icons/color/icon-64.png",
      128: "icons/color/icon-128.png",
    },
    default_popup: "src/popup/index.html",
  },
  side_panel: {
    default_path: "src/panel/index.html",
  },
  background: {
    service_worker: "src/background/index.ts",
    type: "module",
  },
  options_page: "src/options/index.html",
  permissions: [
    "search",
    "downloads",
    "storage",
    "notifications",
    "sidePanel",
    "activeTab",
    "tabs",
    "clipboardRead",
    "clipboardWrite",
    "contextMenus",
  ],
  host_permissions: ["https://*/*", "http://*/*"],
});
