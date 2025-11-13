import type { DeepSpread } from "@solid-primitives/destructure";
import type { Accessor } from "solid-js";
import { createContext, createRoot, useContext } from "solid-js";
import type {
  AppContextMenuStore,
  AppHistoryStore,
  AppRuntimeStore,
  AppSettingsStore,
  AppThemeStore,
} from "#/stores";
import {
  createAppContextMenuActions,
  createAppContextMenuInit,
  createAppContextMenuStore,
} from "./contextMenu";
import {
  createAppHistoryActions,
  createAppHistoryInit,
  createAppHistoryStore,
} from "./history";
import { createAppRuntimeActions, createAppRuntimeStore } from "./runtime";
import {
  createAppSettingsActions,
  createAppSettingsInit,
  createAppSettingsStore,
} from "./settings";
import {
  createAppSyncActions,
  createAppSyncInit,
  createAppSyncStore,
} from "./sync";
import {
  createAppThemeActions,
  createAppThemeInit,
  createAppThemeStore,
} from "./theme";

interface AppStore {
  settings: DeepSpread<AppSettingsStore>;
  theme: DeepSpread<AppThemeStore>;
  runtime: DeepSpread<AppRuntimeStore>;
  contextMenu: DeepSpread<AppContextMenuStore>;
  history: DeepSpread<AppHistoryStore>;
  sync: Accessor<boolean>;
}

type AppStoreInit = string | Promise<string> | null;

function createAppStore(): AppStore {
  return {
    settings: createAppSettingsStore(),
    theme: createAppThemeStore(),
    runtime: createAppRuntimeStore(),
    contextMenu: createAppContextMenuStore(),
    history: createAppHistoryStore(),
    sync: createAppSyncStore(),
  };
}

function createPersistedInit(): AppStoreInit[] {
  return [
    createAppSettingsInit(),
    createAppThemeInit(),
    createAppContextMenuInit(),
    createAppHistoryInit(),
    createAppSyncInit(),
  ];
}

export const appStore = createRoot<AppStore>(createAppStore);

export const appStoreInit = createRoot<AppStoreInit[]>(createPersistedInit);

export const AppContext = createContext<AppStore>(appStore);

export const useAppStore = (): AppStore => useContext<AppStore>(AppContext);

export const useAppSettings = () => {
  const { settings } = useAppStore();
  return settings;
};

export const useAppSettingsActions = createAppSettingsActions;

export const useAppTheme = () => {
  const { theme } = useAppStore();
  return theme;
};

export const useAppThemeActions = createAppThemeActions;

export const useAppRuntime = () => {
  const { runtime } = useAppStore();
  return runtime;
};

export const useAppRuntimeActions = createAppRuntimeActions;

export const useAppContextMenu = () => {
  const { contextMenu } = useAppStore();
  return contextMenu;
};

export const useAppContextMenuActions = createAppContextMenuActions;

export const useAppHistory = () => {
  const { history } = useAppStore();
  return history;
};

export const useAppHistoryActions = createAppHistoryActions;

export const useAppSync = () => {
  const { sync } = useAppStore();
  return sync;
};

export const useAppSyncActions = createAppSyncActions;
