import Browser from "webextension-polyfill";
import type { Locale } from "#/constants";
import logo from "@/assets/logo.png";
import { notification } from "@/constants";

const displayName = Browser.runtime.getManifest().name;

export function notify(title: string, message: string): void {
  Browser.notifications.create({
    type: "basic",
    iconUrl: logo,
    title: title,
    message: message,
    contextMessage: displayName,
  });
}

export function downloadNotice(
  downloadId: number,
  title: string,
  message: string,
): void {
  Browser.notifications.create(`${notification.id.DOWNLOAD}:${downloadId}`, {
    type: "basic",
    iconUrl: logo,
    title: title,
    message: message,
    contextMessage: displayName,
  });
}

export function i18n(key: Locale): string {
  return Browser.i18n.getMessage(key);
}
