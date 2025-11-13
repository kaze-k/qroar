export const persistent = {
  SETTINGS: "settings",
  THEME: "theme",
  SYNC: "sync",
  CONTEXT_MENU: "context-menu",
  HISTORY: "history",
} as const satisfies Record<string, string>;

export const sessionKey = {
  WINID: "WINID",
} as const satisfies Record<string, string>;
