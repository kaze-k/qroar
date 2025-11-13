import { createSignal, onCleanup, onMount } from "solid-js";
import Browser from "webextension-polyfill";
import { locale, sessionKey } from "@/constants";
import { i18n, notify } from "@/utils";

interface CreateWindowReturn {
  create: () => Promise<void>;
}

export function useCreateWindow(): CreateWindowReturn {
  const [winId, setWinId] = createSignal<number>(
    Browser.windows.WINDOW_ID_NONE,
  );

  const onStorageChangedListenerCallback: (
    changes: Browser.Storage.StorageAreaWithUsageOnChangedChangesType,
  ) => void = (changes) => {
    const winId = changes?.[sessionKey.WINID];
    if (!winId) return;
    const id = winId.newValue as number | undefined;
    setWinId<number>(id || Browser.windows.WINDOW_ID_NONE);
  };

  const create = async (): Promise<void> => {
    try {
      const id = winId();

      if (id !== Browser.windows.WINDOW_ID_NONE) {
        Browser.windows.update(id, { focused: true });
      } else {
        const win = await Browser.windows.create({
          url: Browser.runtime.getURL("src/window/index.html"),
          type: "popup",
          width: 400,
          height: 600,
          left: Math.round((screen.width - 400) / 2),
          top: Math.round((screen.height - 600) / 2),
        });

        if (!win.id) return;
        setWinId<number>(win.id);
        await Browser.storage.session.set({ [sessionKey.WINID]: win.id });
      }
    } catch (error) {
      console.error(error);

      if (error instanceof Error)
        notify(i18n(locale.notify.ERROR), error.message);
    }
  };

  onMount(() => {
    Browser.storage.session.get(sessionKey.WINID).then((session) => {
      const winId = session[sessionKey.WINID] as number | undefined;
      if (winId) setWinId<number>(winId);
    });

    Browser.storage.session.onChanged.addListener(
      onStorageChangedListenerCallback,
    );

    onCleanup(() =>
      Browser.storage.session.onChanged.removeListener(
        onStorageChangedListenerCallback,
      ),
    );
  });

  return { create };
}
