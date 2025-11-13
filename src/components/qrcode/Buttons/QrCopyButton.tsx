import { Icon } from "@iconify-icon/solid";
import copyIcon from "@iconify-icons/solar/copy-bold-duotone";
import type { Component, JSX } from "solid-js";
import { createSignal } from "solid-js";
import { Button } from "@/components/common/Button";
import { locale } from "@/constants";
import { useAppStore } from "@/stores";
import { i18n, notify, qrcodeToBlob } from "@/utils";

const DELAY = 1500;

export const QrCopyButton: Component = () => {
  const app = useAppStore();

  const { dark } = app.theme;
  const { text, error } = app.runtime;

  const [checked, setChecked] = createSignal<boolean>(false);

  const handleClick: JSX.EventHandlerUnion<
    HTMLButtonElement,
    MouseEvent
  > = async () => {
    if (text() === "" || error()) return;

    try {
      const blob = await qrcodeToBlob(text(), dark());

      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);

      setChecked<boolean>(true);
      setTimeout(() => {
        setChecked<boolean>(false);
      }, DELAY);
    } catch (error) {
      console.error(error);

      if (error instanceof Error)
        notify(i18n(locale.notify.COPY_QRCODE_FAIL), error.message);
      setChecked<boolean>(false);
    }
  };

  return (
    <Button
      size={24}
      onClick={handleClick}
      checked={checked()}
      disabled={text() === "" || error()}
    >
      <Icon
        icon={copyIcon}
        width={24}
        height={24}
      />
    </Button>
  );
};
