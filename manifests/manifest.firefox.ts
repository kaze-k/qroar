import pkg from "../package.json";

export default {
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
  background: {
    scripts: ["src/background/index.ts"],
    type: "module",
  },
  options_page: "src/options/index.html",
  sidebar_action: {
    default_panel: "src/panel/index.html",
    default_title: pkg.name,
    default_icon: {
      16: "icons/color/icon-16.png",
      32: "icons/color/icon-32.png",
      48: "icons/color/icon-48.png",
      64: "icons/color/icon-64.png",
      128: "icons/color/icon-128.png",
    },
    open_at_install: false,
  },
  permissions: [
    "search",
    "downloads",
    "storage",
    "notifications",
    "activeTab",
    "tabs",
    "clipboardRead",
    "clipboardWrite",
    "contextMenus",
  ],
  host_permissions: ["https://*/*", "http://*/*"],
  browser_specific_settings: {
    gecko: {
      id: "{2ad49e2b-cdf1-4ac5-8391-4377b5be8114}",
      strict_min_version: "126.0",
      data_collection_permissions: {
        required: ["none"],
      },
    },
  },
};
