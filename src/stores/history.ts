import { destructure } from "@solid-primitives/destructure";
import { makePersisted, storageSync } from "@solid-primitives/storage";
import { createStore } from "solid-js/store";
import type { AppHistoryActions, AppHistoryStore } from "#/stores";
import { persistent } from "@/constants";
import extensionStorage from "./storage";

const store: AppHistoryStore = {
  last: "",
};

const [history, setHistory, init] = makePersisted(
  createStore(structuredClone(store)),
  {
    name: persistent.HISTORY,
    storage: extensionStorage,
    serialize: JSON.stringify,
    deserialize: JSON.parse,
    sync: storageSync,
  },
);

const actions: AppHistoryActions = {
  setLast: (value: string): void => setHistory("last", value),
};

export const createAppHistoryStore = () => destructure(history, { deep: true });
export const createAppHistoryActions = () => actions;
export const createAppHistoryInit = () => init;
