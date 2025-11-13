import { createEffect, createSignal, onCleanup, onMount, Show } from "solid-js";
import type { Option } from "#/components";
import { Select } from "@/components/common/Select/indext";
import { Title } from "@/components/common/Title";
import {
  QrCameraButton,
  QrFullScreenButton,
  QrScanButton,
} from "@/components/qrcode/Buttons";
import { QrResultCard } from "@/components/qrcode/Cards";
import { QrSizeLimitPage } from "@/components/qrcode/Pager";
import { QrScanViewer } from "@/components/qrcode/Viewer";
import { locale, permissionType } from "@/constants";
import { usePermission, useSyncStates, useTheme } from "@/hooks";
import { useAppRuntime, useAppRuntimeActions } from "@/stores";
import { AirDropTransition } from "@/transitions";
import { i18n, listVideoInputDevices } from "@/utils";

const MIN_WINDOW_SIZE = 320;

const { setScan, setResult } = useAppRuntimeActions();

function View() {
  useTheme();
  useSyncStates();
  const { permission } = usePermission();

  const { result } = useAppRuntime();

  const [resultCardRef, setResultCardRef] = createSignal<HTMLElement>();
  const [options, setOptions] = createSignal<Option[]>([]);
  const [selected, setSelected] = createSignal<Option["value"]>("");
  const [visible, setVisible] = createSignal<boolean>(true);

  const handleChange = (value: string): void => {
    setSelected<Option["value"]>(value);
  };

  const resetResult = (): void => setResult("");

  const handleResize = (): void => {
    if (
      window.innerWidth < MIN_WINDOW_SIZE ||
      window.innerHeight < MIN_WINDOW_SIZE
    )
      setVisible<boolean>(false);
    else setVisible<boolean>(true);
  };

  const handleClickOutside = (e: MouseEvent): void => {
    if (!resultCardRef()?.contains(e.target as Node)) resetResult();
  };

  onMount(() => {
    window.addEventListener("resize", handleResize);
    document.addEventListener("click", handleClickOutside);

    onCleanup(() => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("click", handleClickOutside);
    });
  });

  createEffect(() => {
    if (permission() !== permissionType.GRANTED) return;

    listVideoInputDevices().then((devices) => {
      setOptions<Option[]>(
        devices.map(
          (device): Option => ({
            label: device.label,
            value: device.deviceId,
            disabled: false,
          }),
        ),
      );
    });
  });

  createEffect(() => {
    if (!visible()) setScan(false);
  });

  return (
    <Show
      when={visible()}
      fallback={<QrSizeLimitPage />}
    >
      <header class="fixed top-0 left-0 w-full p-4 z-1 box-border flex justify-center items-center">
        <div class="w-full max-w-prose mx-2 px-2 flex justify-between items-center gap-5">
          <QrCameraButton />
          <Title>{i18n(locale.title.SCAN_QRCODE)}</Title>
          <QrFullScreenButton />
        </div>
      </header>
      <main class="w-screen h-screen box-border">
        <QrScanViewer deviceId={selected()} />
      </main>
      <footer class="fixed bottom-0 left-0 w-full p-4 z-1 box-border flex justify-around items-center">
        <div class="w-full max-w-prose m-2 px-2 flex items-center gap-5">
          <Select
            options={options()}
            defaultOption={options()[0]}
            placeholder={i18n(locale.placeholder.SELECT)}
            onChange={handleChange}
          />
          <QrScanButton />
        </div>
      </footer>

      <AirDropTransition>
        <Show when={result()}>
          <QrResultCard
            text={result()}
            ref={setResultCardRef<HTMLElement>}
            onClose={resetResult}
          />
        </Show>
      </AirDropTransition>
    </Show>
  );
}

export default View;
