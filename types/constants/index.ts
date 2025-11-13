import type {
  contextMenu,
  locale,
  message,
  notification,
  path,
  permissionType,
} from "@/constants";

export type Locale =
  | (typeof locale.tip)[keyof typeof locale.tip]
  | (typeof locale.placeholder)[keyof typeof locale.placeholder]
  | (typeof locale.notify)[keyof typeof locale.notify]
  | (typeof locale.title)[keyof typeof locale.title]
  | (typeof locale.button)[keyof typeof locale.button]
  | (typeof locale.opened)[keyof typeof locale.opened]
  | (typeof locale.contextMenu)[keyof typeof locale.contextMenu]
  | (typeof locale.appearance)[keyof typeof locale.appearance]
  | (typeof locale.synchronization)[keyof typeof locale.synchronization];

export type NotificationId =
  (typeof notification.id)[keyof typeof notification.id];

export type ContextMenuId =
  (typeof contextMenu.id)[keyof typeof contextMenu.id];

export type MessageType = (typeof message.type)[keyof typeof message.type];

export type SendType = (typeof message.sendType)[keyof typeof message.sendType];

export type Path = (typeof path)[keyof typeof path];

export type PermissionType =
  (typeof permissionType)[keyof typeof permissionType];
