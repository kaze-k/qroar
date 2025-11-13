import { destructure } from "@solid-primitives/destructure";
import { makePersisted, storageSync } from "@solid-primitives/storage";
import { createStore } from "solid-js/store";
import type { AppSettingsActions, AppSettingsStore } from "#/stores";
import { persistent } from "@/constants";
import extensionStorage from "./storage";

const store: AppSettingsStore = {
  genCurrentCode: true,
};

const [settings, setSettings, init] = makePersisted(
  createStore<AppSettingsStore>(structuredClone(store)),
  {
    name: persistent.SETTINGS,
    storage: extensionStorage,
    serialize: JSON.stringify,
    deserialize: JSON.parse,
    sync: storageSync,
  },
);

const action: AppSettingsActions = {
  setSettings: setSettings,

  setGenCurrentCode: (): void =>
    setSettings({
      genCurrentCode: !settings.genCurrentCode,
    }),

  resetSettings: (): void => setSettings(store),
};

export const createAppSettingsStore = () =>
  destructure(settings, { deep: true });
export const createAppSettingsActions = () => action;
export const createAppSettingsInit = () => init;
