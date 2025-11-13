import { makePersisted, storageSync } from "@solid-primitives/storage";
import { createSignal } from "solid-js";
import Browser from "webextension-polyfill";
import type {
  AppContextMenuStore,
  AppSettingsStore,
  AppSyncActions,
  AppSyncStore,
  AppThemeStore,
} from "#/stores";
import { locale, persistent } from "@/constants";
import { i18n, notify } from "@/utils";
import {
  createAppContextMenuActions,
  createAppContextMenuStore,
} from "./contextMenu";
import { createAppSettingsActions, createAppSettingsStore } from "./settings";
import extensionStorage from "./storage";
import { createAppThemeActions, createAppThemeStore } from "./theme";

type StorageType =
  | typeof persistent.SETTINGS
  | typeof persistent.THEME
  | typeof persistent.CONTEXT_MENU;

type DefaultStoreType = AppSettingsStore | AppThemeStore | AppContextMenuStore;

function defaultStore(type: StorageType): DefaultStoreType {
  switch (type) {
    case persistent.SETTINGS:
      const { genCurrentCode } = createAppSettingsStore();
      return {
        genCurrentCode: genCurrentCode(),
      } as AppSettingsStore;
    case persistent.THEME:
      const { auto, dark } = createAppThemeStore();
      return {
        auto: auto(),
        dark: dark(),
      } as AppThemeStore;
    case persistent.CONTEXT_MENU:
      const {
        identifyImageQrcode,
        generateImageQrcode,
        generateLinkQrcode,
        generatePageQrcode,
        generateSelectionQrcode,
      } = createAppContextMenuStore();

      return {
        identifyImageQrcode: identifyImageQrcode(),
        generateImageQrcode: generateImageQrcode(),
        generateLinkQrcode: generateLinkQrcode(),
        generatePageQrcode: generatePageQrcode(),
        generateSelectionQrcode: generateSelectionQrcode(),
      } as AppContextMenuStore;
  }
}

interface StorageItemConfig<T> {
  key: string;
  type: StorageType;
  setter: (value: T) => void;
}

async function initStorageItems(
  items: StorageItemConfig<DefaultStoreType>[],
): Promise<PromiseSettledResult<void>[]> {
  const keys = items.map((item) => item.key);

  return Browser.storage.sync.get(keys).then((store) => {
    const setPromises: Promise<void>[] = [];

    items.forEach((item) => {
      const str = store[item.key] as string | undefined;
      let value: DefaultStoreType;

      if (str) {
        value = JSON.parse(str);
      } else {
        value = defaultStore(item.type);
        setPromises.push(
          Browser.storage.sync.set({ [item.key]: JSON.stringify(value) }),
        );
      }

      item.setter(value);
    });

    return Promise.allSettled(setPromises);
  });
}

const store: AppSyncStore = {
  sync: true,
};

const [sync, setSync, init] = makePersisted(createSignal<boolean>(store.sync), {
  name: persistent.SYNC,
  storage: extensionStorage,
  serialize: JSON.stringify,
  deserialize: JSON.parse,
  sync: storageSync,
});

const actions: AppSyncActions = {
  setSync: setSync,

  toggleSync: (): void => {
    setSync<boolean>(!sync());

    if (!sync()) return;

    const { setSettings } = createAppSettingsActions();
    const { setContextMenu } = createAppContextMenuActions();
    const { setTheme } = createAppThemeActions();

    const items: StorageItemConfig<any>[] = [
      {
        key: persistent.SETTINGS,
        type: persistent.SETTINGS,
        setter: setSettings,
      },
      {
        key: persistent.CONTEXT_MENU,
        type: persistent.CONTEXT_MENU,
        setter: setContextMenu,
      },
      { key: persistent.THEME, type: persistent.THEME, setter: setTheme },
    ];

    initStorageItems(items).then((results) => {
      const hasError = results.some((result) => result.status === "rejected");
      if (hasError)
        notify(i18n(locale.notify.ERROR), i18n(locale.notify.SYNC_FAILED));
    });
  },

  resetSync: (): void => {
    setSync<boolean>(store.sync);
  },
};

export const createAppSyncStore = () => sync;
export const createAppSyncActions = () => actions;
export const createAppSyncInit = () => init;
