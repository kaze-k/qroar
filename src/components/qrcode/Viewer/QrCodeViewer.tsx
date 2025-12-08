import type { Component } from "solid-js";
import { createEffect, createSignal, Show } from "solid-js";
import Logo from "@/assets/logo.png";
import { locale } from "@/constants";
import { useAppTheme } from "@/stores";
import { i18n, notify, qrcodeToCanvas } from "@/utils";

interface QrCodeViewerProps {
  value?: string;
}

const Icon: Component = () => {
  return (
    <div class="size-64 p-6 box-border rounded-3xl glass-style animate-transform hover:scale-105">
      <img
        class="w-full"
        src={Logo}
      />
    </div>
  );
};

export const QrCodeViewer: Component<QrCodeViewerProps> = (props) => {
  const [el, setEl] = createSignal<HTMLCanvasElement>();

  const [hasError, setHasError] = createSignal<boolean>(false);

  const { dark } = useAppTheme();

  createEffect(async () => {
    try {
      const canvas = el();
      if (props.value && canvas && !hasError())
        await qrcodeToCanvas(canvas, props.value, dark());
      else setHasError<boolean>(false);
    } catch (error) {
      console.error(error);

      if (error instanceof Error)
        notify(i18n(locale.notify.ERROR), error.message);
      setHasError<boolean>(true);
    }
  });

  return (
    <Show
      when={props.value && !hasError()}
      fallback={<Icon />}
    >
      <canvas
        class="box-border rounded-3xl glass-style animate-transform hover:scale-105"
        ref={setEl}
      />
    </Show>
  );
};
