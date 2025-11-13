import { Icon } from "@iconify-icon/solid";
import clipboardIcon from "@iconify-icons/mdi/clipboard-outline";
import { NotFoundException } from "@zxing/library";
import type { Component, JSX } from "solid-js";
import { createSignal } from "solid-js";
import { isURL } from "validator";
import { Button } from "@/components/common/Button";
import { locale } from "@/constants";
import { useAppRuntimeActions } from "@/stores";
import { decodeFromSource, i18n, notify } from "@/utils";

const { setObjectUrl, setResult } = useAppRuntimeActions();

const handleImageBlob = async (blob: Blob): Promise<void> => {
  setObjectUrl(blob);
  const result = await decodeFromSource(blob);
  setResult(result);
};

const handleClipboardImage = async (): Promise<boolean> => {
  const clipboardItems = await navigator.clipboard.read();
  const imageItem = clipboardItems.find((item) =>
    item.types.some((type) => type.startsWith("image/")),
  );

  if (!imageItem) return false;

  const type = imageItem.types.find((type) => type.startsWith("image/"));
  const blob = await imageItem.getType(type!);
  await handleImageBlob(blob);
  return true;
};

const handleClipboardText = async (): Promise<void> => {
  const text = await navigator.clipboard.readText();

  if (isURL(text)) {
    const blob = await fetch(text).then((res) => res.blob());
    if (blob.type.startsWith("image/")) {
      await handleImageBlob(blob);
      return;
    }
  }

  notify(
    i18n(locale.notify.UNABLE_TO_RECOGNIZE_CLIPBOARD),
    i18n(locale.notify.CLIPBOARD_NOT_IMAGE_LINK),
  );
};

export const QrIdentifyClipboardButton: Component = () => {
  const [loading, setLoading] = createSignal<boolean>(false);

  const handleClick: JSX.EventHandlerUnion<
    HTMLButtonElement,
    MouseEvent
  > = async () => {
    setLoading<boolean>(true);

    try {
      const handled = await handleClipboardImage();
      if (!handled) await handleClipboardText();
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
  };

  return (
    <Button
      size={24}
      onClick={handleClick}
      loading={loading()}
    >
      <Icon
        icon={clipboardIcon}
        width={24}
        height={24}
      />
    </Button>
  );
};
