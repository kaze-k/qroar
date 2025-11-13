import { onCleanup, onMount } from "solid-js";
import Browser from "webextension-polyfill";

const callbacks: Browser.Runtime.OnMessageListenerAsync[] = [];

const onMessageListenerCallback: Browser.Runtime.OnMessageListenerAsync =
  async (message, sender) => {
    if (sender.id !== Browser.runtime.id) return;
    if (sender.url === window.location.href) return;
    callbacks.forEach((fn) => fn(message, sender));
  };

function addGlobalMessageListener(): void {
  if (Browser.runtime.onMessage.hasListener(onMessageListenerCallback)) return;
  Browser.runtime.onMessage.addListener(onMessageListenerCallback);
}

function removeGlobalMessageListener(): void {
  if (!Browser.runtime.onMessage.hasListener(onMessageListenerCallback)) return;
  Browser.runtime.onMessage.removeListener(onMessageListenerCallback);
}

export function useMessageListener(
  callback: Browser.Runtime.OnMessageListenerAsync,
): void {
  onMount(() => {
    callbacks.push(callback);
    if (callbacks.length === 1) addGlobalMessageListener();

    onCleanup(() => {
      const idx = callbacks.indexOf(callback);
      if (idx >= 0) callbacks.splice(idx, 1);
      if (callbacks.length === 0) removeGlobalMessageListener();
    });
  });
}
