import Browser from "webextension-polyfill";
import { errorHandler } from "./error";
import { setIcon } from "./handlers";
import {
  onContextMenusClickedListenerCallback,
  onInstalledListenerCallback,
  onMessageListenerCallback,
  onNotificationClickedListenerCallback,
  onStartupListenerCallback,
  onStorageChangedListenerCallback,
  onWindowsRemovedListenerCallback,
} from "./listeners";

errorHandler(async () => {
  await setIcon();
});

Browser.runtime.onInstalled.addListener(onInstalledListenerCallback);

Browser.runtime.onStartup.addListener(onStartupListenerCallback);

Browser.contextMenus.onClicked.addListener(
  onContextMenusClickedListenerCallback,
);

Browser.runtime.onMessage.addListener(onMessageListenerCallback);

Browser.notifications.onClicked.addListener(
  onNotificationClickedListenerCallback,
);

Browser.storage.onChanged.addListener(onStorageChangedListenerCallback);

Browser.windows.onRemoved.addListener(onWindowsRemovedListenerCallback);
