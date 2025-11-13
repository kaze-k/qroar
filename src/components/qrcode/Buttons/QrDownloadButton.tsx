import { Icon } from "@iconify-icon/solid";
import downloadIcon from "@iconify-icons/solar/download-minimalistic-bold-duotone";
import type { Component, JSX } from "solid-js";
import { onCleanup, onMount } from "solid-js";
import Browser from "webextension-polyfill";
import { Button } from "@/components/common/Button";
import { locale } from "@/constants";
import { useAppStore } from "@/stores";
import { downloadNotice, i18n, notify, qrcodeToBlob } from "@/utils";

export const QrDownloadButton: Component = () => {
  const app = useAppStore();

  const { dark } = app.theme;
  const { text, error } = app.runtime;

  const handleClick: JSX.EventHandlerUnion<
    HTMLButtonElement,
    MouseEvent
  > = async () => {
    if (text() === "" || error()) return;
    let url: string = "";

    try {
      const blob = await qrcodeToBlob(text(), dark());
      let url = URL.createObjectURL(blob);

      await Browser.downloads.download({
        url: url,
        filename: "qroar.png",
      });
    } catch (error) {
      console.error(error);

      if (error instanceof Error)
        notify(i18n(locale.notify.DOWNLOAD_QRCODE_FAIL), error.message);
    } finally {
      URL.revokeObjectURL(url);
    }
  };

  const downloadsListener = (
    delta: Browser.Downloads.OnChangedDownloadDeltaType,
  ): void => {
    if (delta.state && delta.state.current === "complete") {
      downloadNotice(
        delta.id,
        i18n(locale.notify.DOWNLOAD_QRCODE_SUCCESS),
        "qroar.png",
      );
    }
  };

  onMount(() => {
    Browser.downloads.onChanged.addListener(downloadsListener);
    onCleanup(() =>
      Browser.downloads.onChanged.removeListener(downloadsListener),
    );
  });

  return (
    <Button
      size={24}
      onClick={handleClick}
      disabled={text() === "" || error()}
    >
      <Icon
        icon={downloadIcon}
        width={24}
        height={24}
      />
    </Button>
  );
};
