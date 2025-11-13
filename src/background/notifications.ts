import Browser from "webextension-polyfill";
import logo from "@/assets/logo.png?inline";
import { locale, notification } from "@/constants";

class Creator {
  private static readonly displayName = Browser.runtime.getManifest().name;
  private static readonly version = Browser.runtime.getManifest().version;

  private constructor() {}

  public static updateNotice(previousVersion: string): void {
    if (previousVersion === this.version) return;

    Browser.notifications.create(notification.id.UPDATE, {
      type: "basic",
      iconUrl: logo,
      title: Browser.i18n.getMessage(locale.notify.UPDATE_COMPLETED),
      message: `v${previousVersion} ~ v${this.version}`,
      contextMessage: this.displayName,
    });
  }

  public static basicNotice(title: string, message: string): void {
    Browser.notifications.create({
      type: "basic",
      iconUrl: logo,
      title: title,
      message: message,
      contextMessage: this.displayName,
    });
  }
}

export const notifications = {
  creator: Creator,
};
