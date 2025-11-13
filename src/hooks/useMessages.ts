import { NotFoundException } from "@zxing/library";
import type { Accessor, Setter } from "solid-js";
import { createSignal, onMount } from "solid-js";
import Browser from "webextension-polyfill";
import type { Message } from "#/background";
import type { MessageType, SendType } from "#/constants";
import { locale, message } from "@/constants";
import { useAppRuntimeActions } from "@/stores";
import { decodeFromSource, i18n, notify } from "@/utils";
import { useMessageListener } from "./useMessageListener";

const { setIdentify, setObjectUrl, setResult, setText } =
  useAppRuntimeActions();

async function identify(
  setLoading: Setter<boolean>,
  msg: Message<SendType, string>,
): Promise<void> {
  const { type, payload } = msg;
  if (!payload || type !== message.sendType.IDENTIFY) return;

  setIdentify(true);
  setLoading<boolean>(true);

  try {
    const blob = await fetch(payload).then((res) => res.blob());
    setObjectUrl(blob);
    const result = await decodeFromSource(blob);
    if (result) setResult(result);
  } catch (error) {
    console.error(error);

    if (error instanceof Error)
      notify(
        error instanceof NotFoundException
          ? i18n(locale.notify.NO_QRCODE_DETECTED)
          : i18n(locale.notify.ERROR),
        error.message,
      );
    setResult("");
  } finally {
    setLoading<boolean>(false);
  }
}

function generate(msg: Message<SendType, string>): void {
  const { type, payload } = msg;
  if (!payload || type !== message.sendType.GENERATE) return;

  setIdentify(false);
  setText(payload);
}

function sendMessages(types: MessageType[]): void {
  types.forEach((type) => {
    Browser.runtime.sendMessage<Message<MessageType>>({
      type,
    });
  });
}

interface SendMsgReturn {
  loading: Accessor<boolean>;
}

export function useMessages(): SendMsgReturn {
  const [loading, setLoading] = createSignal<boolean>(false);

  const onMessageListenerCallback: Browser.Runtime.OnMessageListenerAsync =
    async (message, _sender) => {
      const msg = message as Message<SendType, string>;

      identify(setLoading<boolean>, msg);
      generate(msg);
    };

  useMessageListener(onMessageListenerCallback);

  onMount(() => {
    sendMessages([
      message.type.GET_SRC_URL,
      message.type.GET_PAGE_URL,
      message.type.GET_LINK_URL,
      message.type.GET_SELECTION_TEXT,
      message.type.GET_SRC_TEXT,
    ]);
  });

  return { loading };
}
