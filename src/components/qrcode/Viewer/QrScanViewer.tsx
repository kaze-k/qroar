import { Icon } from "@iconify-icon/solid";
import codeScanIcon from "@iconify-icons/solar/code-scan-bold";
import loadingIcon from "@iconify-icons/svg-spinners/bouncing-ball";
import type { Component } from "solid-js";
import {
  createEffect,
  createSignal,
  on,
  onCleanup,
  onMount,
  Show,
} from "solid-js";
import { locale } from "@/constants";
import { useAppRuntime, useAppRuntimeActions } from "@/stores";
import { decodeFromVideoDevice, decodeReset, i18n, notify } from "@/utils";

interface QrScanViewerProps {
  deviceId: string;
}

const { setResult, setScan } = useAppRuntimeActions();

export const QrScanViewer: Component<QrScanViewerProps> = (props) => {
  const { scan } = useAppRuntime();

  const [videoRef, setVideoRef] = createSignal<HTMLVideoElement>();
  const [loading, setLoading] = createSignal<boolean>(false);
  const [isPlaying, setIsPlaying] = createSignal<boolean>(false);

  onMount(() => {
    const ref = videoRef();
    if (!ref) return;

    ref.addEventListener("playing", () => setIsPlaying<boolean>(true));
    ref.addEventListener("abort", () => setIsPlaying<boolean>(false));

    onCleanup(() => {
      ref.removeEventListener("playing", () => setIsPlaying<boolean>(true));
      ref.removeEventListener("abort", () => setIsPlaying<boolean>(false));
    });
  });

  createEffect(
    on(
      [scan, () => props.deviceId],
      async ([scan, deviceId]) => {
        const ref = videoRef();
        if (!ref) return;

        try {
          if (scan) {
            setLoading<boolean>(true);
            const result = await decodeFromVideoDevice(deviceId, ref);
            setResult(result);
          } else {
            decodeReset();
          }
        } catch (error) {
          console.error(error);

          if (error instanceof Error)
            notify(i18n(locale.notify.ERROR), error.message);
        } finally {
          setScan(false);
          setLoading<boolean>(false);
        }
      },
      {
        defer: true,
      },
    ),
  );

  return (
    <div class="relative w-full h-full">
      <video
        ref={setVideoRef<HTMLVideoElement>}
        class="absolute w-full h-full object-cover"
        autoplay
        playsinline
      />

      <Show
        when={isPlaying()}
        fallback={
          <Icon
            icon={loading() ? loadingIcon : codeScanIcon}
            width={128}
            height={128}
            class="absolute flex justify-center items-center w-full h-full"
          />
        }
      >
        <div class="absolute w-full h-full flex justify-center items-center">
          <span class="absolute w-50% h-full flex flex-col justify-center items-center">
            <span class="w-full h-1 scan-line-bg rounded-t-25 animate-scan" />
          </span>
        </div>
      </Show>
    </div>
  );
};
