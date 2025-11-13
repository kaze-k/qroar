import { NotFoundException } from "@zxing/library";
import type { JSX } from "solid-js";
import { createEffect, on, onMount, Show } from "solid-js";
import { QrTextarea } from "@/components/qrcode/Inputter";
import { QrImagePicker } from "@/components/qrcode/Picker";
import { QrCodeViewer } from "@/components/qrcode/Viewer";
import { locale } from "@/constants";
import {
  useAppHistory,
  useAppHistoryActions,
  useAppRuntime,
  useAppRuntimeActions,
} from "@/stores";
import { decodeFromSource, i18n, notify } from "@/utils";

const { clearObjectUrl, setObjectUrl, setResult, setText } =
  useAppRuntimeActions();
const { setLast } = useAppHistoryActions();

function Qrpanel() {
  const { result, identify, url, text } = useAppRuntime();
  const { last } = useAppHistory();

  const handleFileChange: JSX.ChangeEventHandlerUnion<
    HTMLInputElement,
    Event
  > = async (e): Promise<void> => {
    if (!e.target.files) return;

    const file = e.target.files[0];
    if (!file) return;

    try {
      setObjectUrl(file);
      const result = await decodeFromSource(file);
      setResult(result);
    } catch (error) {
      console.error(error);

      if (error instanceof Error)
        notify(
          error instanceof NotFoundException
            ? i18n(locale.notify.NO_QRCODE_DETECTED)
            : i18n(locale.notify.ERROR),
          error.message,
        );
    }
  };

  const handleImageClear: JSX.EventHandlerUnion<
    HTMLButtonElement,
    MouseEvent
  > = (): void => {
    clearObjectUrl();
    setResult("");
  };

  onMount(() => {
    if (last()) setText(last());
  });

  createEffect(
    on(
      text,
      (text) => {
        setLast(text);
      },
      {
        defer: true,
      },
    ),
  );

  createEffect(
    on([() => result().length, identify], ([length]) => {
      if (length === 0) clearObjectUrl();
    }),
  );

  return (
    <main class="relative w-full h-full overflow-auto scrollbar-none px-4 flex items-center gap-5 flex-col bg-bg">
      <div class="w-full pt-15">
        <QrTextarea
          value={identify() ? result() : text()}
          onValueChange={identify() ? setResult : setText}
          placeholder={
            identify()
              ? i18n(locale.placeholder.EMPTY)
              : i18n(locale.placeholder.INPUT)
          }
          readonly={identify()}
        />
      </div>

      <div class="w-full h-full pb-20 flex justify-center items-center">
        <Show
          when={identify()}
          fallback={<QrCodeViewer value={text()} />}
        >
          <QrImagePicker
            src={url()}
            onFileChange={handleFileChange}
            onClear={handleImageClear}
          />
        </Show>
      </div>
    </main>
  );
}

export default Qrpanel;
