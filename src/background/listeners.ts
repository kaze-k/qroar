import Browser from "webextension-polyfill";
import type { Message } from "#/background";
import type { ContextMenuId, MessageType, NotificationId } from "#/constants";
import type { AppContextMenuStore } from "#/stores";
import { contextMenu, persistent, sessionKey } from "@/constants";
import { contextMenus } from "./contextMenus";
import { errorHandler, fallback } from "./error";
import type { SignalHandler } from "./handlers";
import {
  contextMenuClickedHandlerMap,
  contextMenuHandlerMap,
  iconHandler,
  installedHandler,
  messageHandleMap,
  notificationHandlerMap,
} from "./handlers";

export const onInstalledListenerCallback: (
  details: Browser.Runtime.OnInstalledDetailsType,
) => void = (details) => {
  errorHandler(() => {
    installedHandler(details);
  });
};

export const onContextMenusClickedListenerCallback: (
  info: Browser.Menus.OnClickData,
  tab?: Browser.Tabs.Tab,
) => void = (info, _tab?) => {
  errorHandler(() => {
    const handler: SignalHandler<
      Browser.Menus.OnClickData,
      (info: Browser.Menus.OnClickData) => void
    > =
      contextMenuClickedHandlerMap[
        info.menuItemId as Exclude<
          ContextMenuId,
          typeof contextMenu.id.SEPARATOR
        >
      ];

    if (handler && handler.condition(info)) handler.action(info);

    Browser.action.openPopup().catch((error) => {
      fallback(error);
      contextMenus.handler.done();
    });
  });
};

export const onMessageListenerCallback: Browser.Runtime.OnMessageListenerAsync =
  async (message, sender) => {
    errorHandler(() => {
      if (sender.id !== Browser.runtime.id) return;

      const msg = message as Message<MessageType>;

      const handler: SignalHandler = messageHandleMap[msg.type];

      if (handler && handler.condition()) return handler.action();
    });
  };

export const onNotificationClickedListenerCallback: (
  notificationId: string,
) => void = (notificationId) => {
  errorHandler(() => {
    const handler = Object.values(notificationHandlerMap).find((h) =>
      h.condition(notificationId),
    );

    if (handler) handler.action(notificationId as NotificationId);
  });
};

export const onStorageChangedListenerCallback: (
  changes: Record<string, Browser.Storage.StorageChange>,
  areaName: string,
) => void = (changes, areaName) => {
  errorHandler(async () => {
    if (areaName !== "local") return;
    if (!changes?.[persistent.CONTEXT_MENU]) return;

    const raw = changes[persistent.CONTEXT_MENU].newValue;
    const newContextMenu: AppContextMenuStore | null = raw
      ? JSON.parse(raw as string)
      : null;

    if (newContextMenu === null) return;

    Object.values(contextMenuHandlerMap).forEach((handler) =>
      handler.condition(newContextMenu)
        ? handler.actions.create(fallback)
        : handler.actions.remove(fallback),
    );

    await iconHandler();
  });
};

export const onWindowsRemovedListenerCallback: (windowId: number) => void = (
  windowId,
) => {
  errorHandler(async () => {
    const session = await Browser.storage.session.get(sessionKey.WINID);
    const winId = session[sessionKey.WINID] as number | undefined;
    if (winId !== windowId) return;
    await Browser.storage.session.remove(sessionKey.WINID);
  });
};
