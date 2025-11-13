import { destructure } from "@solid-primitives/destructure";
import { makePersisted, storageSync } from "@solid-primitives/storage";
import { createStore } from "solid-js/store";
import type { AppContextMenuActions, AppContextMenuStore } from "#/stores";
import { persistent } from "@/constants";
import extensionStorage from "./storage";

const store: AppContextMenuStore = {
  identifyImageQrcode: true,
  generateImageQrcode: true,
  generateSelectionQrcode: true,
  generatePageQrcode: true,
  generateLinkQrcode: true,
};

const [contextMenu, setContextMenu, init] = makePersisted(
  createStore<AppContextMenuStore>(structuredClone(store)),
  {
    name: persistent.CONTEXT_MENU,
    storage: extensionStorage,
    serialize: JSON.stringify,
    deserialize: JSON.parse,
    sync: storageSync,
  },
);

const actions: AppContextMenuActions = {
  setContextMenu: setContextMenu,

  setEnable: (value: boolean): void => {
    if (!value)
      setContextMenu({
        identifyImageQrcode: false,
        generateImageQrcode: false,
        generateSelectionQrcode: false,
        generatePageQrcode: false,
        generateLinkQrcode: false,
      });
    else
      setContextMenu({
        identifyImageQrcode: true,
        generateImageQrcode: true,
        generateSelectionQrcode: true,
        generatePageQrcode: true,
        generateLinkQrcode: true,
      });
  },

  getEnable: (): boolean => Object.values(contextMenu).some((v) => v),

  setIdentifyImageQrcode: (value: boolean): void =>
    setContextMenu({ identifyImageQrcode: value }),

  setGenerateImageQrcode: (value: boolean): void =>
    setContextMenu({ generateImageQrcode: value }),

  setGenerateSelectionQrcode: (value: boolean): void =>
    setContextMenu({ generateSelectionQrcode: value }),

  setGeneratePageQrcode: (value: boolean): void =>
    setContextMenu({ generatePageQrcode: value }),

  setGenerateLinkQrcode: (value: boolean): void =>
    setContextMenu({ generateLinkQrcode: value }),

  resetContextMenu: (): void => setContextMenu(store),
};

export const createAppContextMenuStore = () =>
  destructure(contextMenu, { deep: true });
export const createAppContextMenuActions = () => actions;
export const createAppContextMenuInit = () => init;
