import type { Accessor } from "solid-js";
import { onCleanup, onMount } from "solid-js";
import Browser from "webextension-polyfill";
import type {
  AppContextMenuStore,
  AppSettingsStore,
  AppThemeStore,
} from "#/stores";
import { persistent } from "@/constants";
import {
  useAppContextMenuActions,
  useAppSettingsActions,
  useAppStore,
  useAppSyncActions,
  useAppThemeActions,
} from "@/stores";

const { resetSettings, setSettings } = useAppSettingsActions();
const { resetTheme, setTheme } = useAppThemeActions();
const { resetSync, setSync } = useAppSyncActions();
const { resetContextMenu, setContextMenu } = useAppContextMenuActions();

interface HandleStorageChangeOptions<T> {
  key: string;
  changes: Record<string, Browser.Storage.StorageChange>;
  reset: VoidFunction;
  set: (next: T) => void;
  sync?: Accessor<boolean>;
}

function handleStorageChange<T>(
  current: () => T,
  options: HandleStorageChangeOptions<T>,
): void {
  if (!options.changes?.[options.key]) return;

  const raw = options.changes[options.key].newValue;
  const newValue: T | null = raw ? JSON.parse(raw as string) : null;

  if (newValue === null) {
    options.reset();
    return;
  }

  if (options.sync?.())
    Browser.storage.sync.set({
      [options.key]: JSON.stringify(newValue),
    });

  if (JSON.stringify(current()) === JSON.stringify(newValue)) return;

  options.set(newValue);
}

export function useSyncStates(): void {
  const { settings, theme, sync, contextMenu } = useAppStore();

  const onStorageChangedListenerCallback: (
    changes: Record<string, Browser.Storage.StorageChange>,
    areaName: string,
  ) => void = (changes, areaName) => {
    if (areaName !== "local") return;

    handleStorageChange<AppSettingsStore>(
      () => ({
        genCurrentCode: settings.genCurrentCode(),
      }),
      {
        key: persistent.SETTINGS,
        changes: changes,
        reset: resetSettings,
        set: setSettings,
        sync: sync,
      },
    );

    handleStorageChange<AppThemeStore>(
      () => ({
        auto: theme.auto(),
        dark: theme.dark(),
      }),
      {
        key: persistent.THEME,
        changes: changes,
        reset: resetTheme,
        set: setTheme,
        sync: sync,
      },
    );

    handleStorageChange<boolean>(() => sync(), {
      key: persistent.SYNC,
      changes: changes,
      reset: resetSync,
      set: setSync,
    });

    handleStorageChange<AppContextMenuStore>(
      () => ({
        identifyImageQrcode: contextMenu.identifyImageQrcode(),
        generateImageQrcode: contextMenu.generateImageQrcode(),
        generateSelectionQrcode: contextMenu.generateSelectionQrcode(),
        generatePageQrcode: contextMenu.generatePageQrcode(),
        generateLinkQrcode: contextMenu.generateLinkQrcode(),
      }),
      {
        key: persistent.CONTEXT_MENU,
        changes: changes,
        reset: resetContextMenu,
        set: setContextMenu,
        sync: sync,
      },
    );
  };

  onMount(() => {
    Browser.storage.local
      .get([
        persistent.SETTINGS,
        persistent.THEME,
        persistent.SYNC,
        persistent.CONTEXT_MENU,
      ])
      .then((res) => {
        if (typeof res[persistent.SETTINGS] === "undefined") resetSettings();
        if (typeof res[persistent.THEME] === "undefined") resetTheme();
        if (typeof res[persistent.SYNC] === "undefined") resetSync();
        if (typeof res[persistent.CONTEXT_MENU] === "undefined")
          resetContextMenu();
      });

    Browser.storage.onChanged.addListener(onStorageChangedListenerCallback);
    onCleanup(() =>
      Browser.storage.onChanged.removeListener(
        onStorageChangedListenerCallback,
      ),
    );
  });
}
