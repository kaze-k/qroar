const notify = {
  ERROR: "notify_error",
  NO_QRCODE_DETECTED: "notify_noQRCodeDetected",
  UNABLE_TO_RECOGNIZE_CLIPBOARD: "notify_unableToRecognizeClipboard",
  CLIPBOARD_NOT_IMAGE_LINK: "notify_clipboardNotImageLink",
  DOWNLOAD_QRCODE_SUCCESS: "notify_downloadQRCodeSuccess",
  DOWNLOAD_QRCODE_FAIL: "notify_downloadQRCodeFail",
  COPY_QRCODE_FAIL: "notify_copyQRCodeFail",
  UPDATE_COMPLETED: "notify_updateCompleted",
  NO_CURRENT_URL: "notify_noCurrentUrl",
  SYNC_FAILED: "notify_syncFailed",
} as const satisfies Record<string, string>;

const tip = {
  EXCEED_LIMIT: "tip_exceedLimit",
  WINDOW_TOO_SMALL: "tip_windowTooSmall",
} as const satisfies Record<string, string>;

const placeholder = {
  INPUT: "placeholder_input",
  EMPTY: "placeholder_empty",
  SELECT: "placeholder_select",
} as const satisfies Record<string, string>;

const title = {
  EXTNAME: "title_extName",
  SETUP: "title_setup",
  IDENTIFY: "title_identify",
  GENERATE: "title_generate",
  IDENTIFY_RESULT: "title_identifyResult",
  SCAN_QRCODE: "title_scanQRCode",
} as const satisfies Record<string, string>;

const button = {
  SCAN: "button_scan",
  STOP: "button_stop",
  GENERATE: "button_generate",
  IDENTIFY: "button_identify",
  COPY: "button_copy",
  PASTE: "button_paste",
  CLEAR: "button_clear",
  CURRENT_URL: "button_currentUrl",
  RESET: "button_reset",
  SEARCH_WEB: "button_searchWeb",
  COPY_RESULT: "button_copyResult",
} as const satisfies Record<string, string>;

const opened = {
  TITLE: "opened_title",
  GENERATE_CURRENT_PAGE_QRCODE: "opened_generateCurrentPageQRCode",
} as const satisfies Record<string, string>;

const contextMenu = {
  TITLE: "contextMenu_title",
  ADD_MENU: "contextMenu_addMenu",
  IDENTIFY_IMAGE_QRCODE: "contextMenu_identifyImageQRCode",
  GENERATE_IMAGE_QRCODE: "contextMenu_generateImageQRCode",
  GENERATE_SELECTION_QRCODE: "contextMenu_generateSelectedTextQRCode",
  GENERATE_PAGE_QRCODE: "contextMenu_generatePageQRCode",
  GENERATE_LINK_QRCODE: "contextMenu_generateLinkQRCode",
} as const satisfies Record<string, string>;

const appearance = {
  TITLE: "appearance_title",
  FOLLOW_SYSTEM: "appearance_followSystem",
  DARKMODE: "appearance_darkMode",
} as const satisfies Record<string, string>;

const synchronization = {
  TITLE: "synchronization_title",
  SYNC: "synchronization_sync",
} as const satisfies Record<string, string>;

export const locale = {
  notify: notify,
  tip: tip,
  placeholder: placeholder,
  title: title,
  button: button,
  opened: opened,
  contextMenu: contextMenu,
  appearance: appearance,
  synchronization: synchronization,
};
