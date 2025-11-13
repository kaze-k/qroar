import Browser from "webextension-polyfill";
import type { ContextMenuId, MessageType, NotificationId } from "#/constants";
import type { AppContextMenuStore } from "#/stores";
import { contextMenu, message, notification, persistent } from "@/constants";
import { contextMenus } from "./contextMenus";
import { notifications } from "./notifications";

export interface SignalHandler<
  Data = any,
  Action extends (...args: any[]) => any = VoidFunction,
> {
  condition: (data?: Data) => boolean;
  action: Action;
}

export const installedHandlerMap: Record<
  typeof notification.id.UPDATE,
  SignalHandler<
    Browser.Runtime.OnInstalledDetailsType,
    (details: Browser.Runtime.OnInstalledDetailsType) => void
  >
> = {
  [notification.id.UPDATE]: {
    condition: (details) =>
      details?.reason === "update" && Boolean(details?.previousVersion),
    action: (details) =>
      notifications.creator.updateNotice(details.previousVersion!),
  },
};

export const contextMenuClickedHandlerMap: Record<
  Exclude<ContextMenuId, typeof contextMenu.id.SEPARATOR>,
  SignalHandler<
    Browser.Menus.OnClickData,
    (info: Browser.Menus.OnClickData) => void
  >
> = {
  [contextMenu.id.IDENTIFY_IMAGE]: {
    condition: (info) => info?.mediaType === "image" && Boolean(info?.srcUrl),
    action: (info) => contextMenus.handler.setSrcUrl(info.srcUrl!),
  },

  [contextMenu.id.GENERATE_IMAGE]: {
    condition: (info) => info?.mediaType === "image" && Boolean(info?.srcUrl),
    action: (info) => contextMenus.handler.setSrcText(info.srcUrl!),
  },

  [contextMenu.id.GENERATE_PAGE]: {
    condition: (info) => Boolean(info?.pageUrl),
    action: (info) => contextMenus.handler.setPageUrl(info.pageUrl!),
  },

  [contextMenu.id.GENERATE_LINK]: {
    condition: (info) => Boolean(info?.linkUrl),
    action: (info) => contextMenus.handler.setLinkUrl(info.linkUrl!),
  },

  [contextMenu.id.GENERATE_SELECTION]: {
    condition: (info) => Boolean(info?.selectionText),
    action: (info) =>
      contextMenus.handler.setSelectionText(info.selectionText!),
  },
};

export const messageHandleMap: Record<MessageType, SignalHandler> = {
  [message.type.GET_SRC_URL]: {
    condition: () => Boolean(contextMenus.handler.srcUrl),
    action: () =>
      Browser.runtime
        .sendMessage({
          type: message.sendType.IDENTIFY,
          payload: contextMenus.handler.srcUrl,
        })
        .then(() => contextMenus.handler.done()),
  },

  [message.type.GET_SRC_TEXT]: {
    condition: () => Boolean(contextMenus.handler.srcText),
    action: () =>
      Browser.runtime
        .sendMessage({
          type: message.sendType.GENERATE,
          payload: contextMenus.handler.srcText,
        })
        .then(() => contextMenus.handler.done()),
  },

  [message.type.GET_SELECTION_TEXT]: {
    condition: () => Boolean(contextMenus.handler.selectionText),
    action: () =>
      Browser.runtime
        .sendMessage({
          type: message.sendType.GENERATE,
          payload: contextMenus.handler.selectionText,
        })
        .then(() => contextMenus.handler.done()),
  },

  [message.type.GET_PAGE_URL]: {
    condition: () => Boolean(contextMenus.handler.pageUrl),
    action: () =>
      Browser.runtime
        .sendMessage({
          type: message.sendType.GENERATE,
          payload: contextMenus.handler.pageUrl,
        })
        .then(() => contextMenus.handler.done()),
  },

  [message.type.GET_LINK_URL]: {
    condition: () => Boolean(contextMenus.handler.linkUrl),
    action: () =>
      Browser.runtime
        .sendMessage({
          type: message.sendType.GENERATE,
          payload: contextMenus.handler.linkUrl,
        })
        .then(() => contextMenus.handler.done()),
  },
};

export const notificationHandlerMap: Record<
  NotificationId,
  SignalHandler<string, (notificationId: NotificationId) => void>
> = {
  [notification.id.UPDATE]: {
    condition: (notificationId) => notificationId === notification.id.UPDATE,
    action: () => {
      Browser.tabs.create({ url: "https://github.com/kaze-k/qroar/releases" });
    },
  },

  [notification.id.DOWNLOAD]: {
    condition: (notificationId) =>
      notificationId?.startsWith(notification.id.DOWNLOAD) ?? false,
    action: (notificationId) => {
      const downloadId = parseInt(notificationId.split(":")[1], 10);
      if (!isNaN(downloadId)) Browser.downloads.show(downloadId);
    },
  },
};

export interface multipleHandler<
  Data = any,
  Actions extends Record<string, (...args: any[]) => any> = {},
> {
  condition: (data?: Data) => boolean;
  actions: Actions;
}

export const contextMenuHandlerMap: Record<
  Exclude<ContextMenuId, typeof contextMenu.id.SEPARATOR>,
  multipleHandler<
    AppContextMenuStore | null,
    {
      create: (fallback?: (error: unknown) => void) => void;
      remove: (fallback?: (error: unknown) => void) => void;
    }
  >
> = {
  [contextMenu.id.IDENTIFY_IMAGE]: {
    condition: (ctx) => ctx === null || Boolean(ctx?.identifyImageQrcode),
    actions: {
      create: (fallback) =>
        contextMenus.menus.add(contextMenu.id.IDENTIFY_IMAGE, fallback),
      remove: (fallback) =>
        contextMenus.menus.remove(contextMenu.id.IDENTIFY_IMAGE, fallback),
    },
  },

  [contextMenu.id.GENERATE_IMAGE]: {
    condition: (ctx) => ctx === null || Boolean(ctx?.generateImageQrcode),
    actions: {
      create: (fallback) =>
        contextMenus.menus.add(contextMenu.id.GENERATE_IMAGE, fallback),
      remove: (fallback) =>
        contextMenus.menus.remove(contextMenu.id.GENERATE_IMAGE, fallback),
    },
  },

  [contextMenu.id.GENERATE_SELECTION]: {
    condition: (ctx) => ctx === null || Boolean(ctx?.generateSelectionQrcode),
    actions: {
      create: (fallback) =>
        contextMenus.menus.add(contextMenu.id.GENERATE_SELECTION, fallback),
      remove: (fallback) =>
        contextMenus.menus.remove(contextMenu.id.GENERATE_SELECTION, fallback),
    },
  },

  [contextMenu.id.GENERATE_PAGE]: {
    condition: (ctx) => ctx === null || Boolean(ctx?.generatePageQrcode),
    actions: {
      create: (fallback) =>
        contextMenus.menus.add(contextMenu.id.GENERATE_PAGE, fallback),
      remove: (fallback) =>
        contextMenus.menus.remove(contextMenu.id.GENERATE_PAGE, fallback),
    },
  },

  [contextMenu.id.GENERATE_LINK]: {
    condition: (ctx) => ctx === null || Boolean(ctx?.generateLinkQrcode),
    actions: {
      create: (fallback) =>
        contextMenus.menus.add(contextMenu.id.GENERATE_LINK, fallback),
      remove: (fallback) =>
        contextMenus.menus.remove(contextMenu.id.GENERATE_LINK, fallback),
    },
  },
};

export const setIcon = async (): Promise<void> => {
  const result = await Browser.storage.local.get(persistent.CONTEXT_MENU);

  const currentContextMenu: AppContextMenuStore | null = result[
    persistent.CONTEXT_MENU
  ]
    ? JSON.parse(result[persistent.CONTEXT_MENU] as string)
    : null;

  if (currentContextMenu === null) return;
  const allEnable = Object.values(currentContextMenu).some((v: boolean) => v);

  if (!allEnable)
    Browser.action.setIcon({
      path: {
        16: Browser.runtime.getURL("icons/gray/icon-16.png"),
        32: Browser.runtime.getURL("icons/gray/icon-32.png"),
        48: Browser.runtime.getURL("icons/gray/icon-48.png"),
        64: Browser.runtime.getURL("icons/gray/icon-64.png"),
        128: Browser.runtime.getURL("icons/gray/icon-128.png"),
      },
    });
  else
    Browser.action.setIcon({
      path: {
        16: Browser.runtime.getURL("icons/color/icon-16.png"),
        32: Browser.runtime.getURL("icons/color/icon-32.png"),
        48: Browser.runtime.getURL("icons/color/icon-48.png"),
        64: Browser.runtime.getURL("icons/color/icon-64.png"),
        128: Browser.runtime.getURL("icons/color/icon-128.png"),
      },
    });
};
