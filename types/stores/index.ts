import type { Setter } from "solid-js";
import type { SetStoreFunction } from "solid-js/store";
import type { PermissionType } from "#/constants";

export interface AppSettingsStore {
  genCurrentCode: boolean;
}

export interface AppSettingsActions {
  setSettings: SetStoreFunction<AppSettingsStore>;
  setGenCurrentCode: (value: boolean) => void;
  resetSettings: VoidFunction;
}

export interface AppThemeStore {
  auto: boolean;
  dark: boolean;
}

export interface AppThemeActions {
  setTheme: SetStoreFunction<AppThemeStore>;
  toggleAutoTheme: VoidFunction;
  toggleDarkTheme: VoidFunction;
  setDarkTheme: (value: boolean) => void;
  resetTheme: VoidFunction;
}

export interface AppRuntimeStore {
  text: string;
  identify: boolean;
  result: string;
  url: string;
  error: boolean;
  executed: boolean;
  scan: boolean;
  permission: PermissionType;
}

export interface AppRuntimeActions {
  setText: (value: string) => void;
  setIdentify: (value: boolean) => void;
  setResult: (value: string) => void;
  setObjectUrl: (value: Blob | MediaSource) => void;
  clearObjectUrl: VoidFunction;
  setError: (value: boolean) => void;
  setExecuted: VoidFunction;
  setScan: (value: boolean) => void;
  setPermission: (value: PermissionType) => void;
}

export interface AppSyncStore {
  sync: boolean;
}

export interface AppSyncActions {
  setSync: Setter<boolean>;
  toggleSync: VoidFunction;
  resetSync: VoidFunction;
}

export interface AppContextMenuStore {
  identifyImageQrcode: boolean;
  generateImageQrcode: boolean;
  generateSelectionQrcode: boolean;
  generatePageQrcode: boolean;
  generateLinkQrcode: boolean;
}

export interface AppContextMenuActions {
  setContextMenu: SetStoreFunction<AppContextMenuStore>;
  setEnable: (value: boolean) => void;
  getEnable: () => boolean;
  setIdentifyImageQrcode: (value: boolean) => void;
  setGenerateImageQrcode: (value: boolean) => void;
  setGenerateSelectionQrcode: (value: boolean) => void;
  setGeneratePageQrcode: (value: boolean) => void;
  setGenerateLinkQrcode: (value: boolean) => void;
  resetContextMenu: VoidFunction;
}

export interface AppHistoryStore {
  last: string;
}

export interface AppHistoryActions {
  setLast: (value: string) => void;
}
