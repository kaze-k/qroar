import { destructure } from "@solid-primitives/destructure";
import { makePersisted, storageSync } from "@solid-primitives/storage";
import { createStore } from "solid-js/store";
import type { AppThemeActions, AppThemeStore } from "#/stores";
import { persistent } from "@/constants";
import extensionStorage from "./storage";

const store: AppThemeStore = {
  auto: true,
  dark: false,
};

const [theme, setTheme, init] = makePersisted(
  createStore<AppThemeStore>(structuredClone(store)),
  {
    name: persistent.THEME,
    storage: extensionStorage,
    serialize: JSON.stringify,
    deserialize: JSON.parse,
    sync: storageSync,
  },
);

const actions: AppThemeActions = {
  setTheme: setTheme,

  toggleAutoTheme: (): void =>
    setTheme({
      auto: !theme.auto,
      dark: window.matchMedia("(prefers-color-scheme: dark)").matches,
    }),

  toggleDarkTheme: (): void =>
    setTheme({
      auto: false,
      dark: !theme.dark,
    }),

  setDarkTheme: (value: boolean): void => setTheme("dark", value),

  resetTheme: (): void =>
    setTheme({
      auto: true,
      dark: window.matchMedia("(prefers-color-scheme: dark)").matches,
    }),
};

export const createAppThemeStore = () => destructure(theme, { deep: true });
export const createAppThemeActions = () => actions;
export const createAppThemeInit = () => init;
