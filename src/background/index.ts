import Browser from "webextension-polyfill";
import { errorHandler } from "./error";
import { iconHandler } from "./handlers";
import {
  onContextMenusClickedListenerCallback,
  onInstalledListenerCallback,
  onMessageListenerCallback,
  onNotificationClickedListenerCallback,
  onStorageChangedListenerCallback,
  onWindowsRemovedListenerCallback,
} from "./listeners";

errorHandler(async () => {
  await iconHandler();
});

Browser.runtime.onInstalled.addListener(onInstalledListenerCallback);

Browser.contextMenus.onClicked.addListener(
  onContextMenusClickedListenerCallback,
);

Browser.runtime.onMessage.addListener(onMessageListenerCallback);

Browser.notifications.onClicked.addListener(
  onNotificationClickedListenerCallback,
);

Browser.storage.onChanged.addListener(onStorageChangedListenerCallback);

Browser.windows.onRemoved.addListener(onWindowsRemovedListenerCallback);
