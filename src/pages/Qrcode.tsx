import { NotFoundException } from "@zxing/library";
import type { JSX } from "solid-js";
import { createEffect, on, onMount, Show } from "solid-js";
import Browser from "webextension-polyfill";
import { QrInputter } from "@/components/qrcode/Inputter";
import { QrImagePicker } from "@/components/qrcode/Picker";
import { QrCodeViewer } from "@/components/qrcode/Viewer";
import { locale } from "@/constants";
import { useMessages } from "@/hooks";
import { useAppRuntime, useAppRuntimeActions, useAppSettings } from "@/stores";
import { decodeFromSource, getByteLength, i18n, notify } from "@/utils";

const MAXBYTELENGTH = 1000;

const {
  clearObjectUrl,
  setObjectUrl,
  setResult,
  setText,
  setError,
  setExecuted,
} = useAppRuntimeActions();

function Qrcode() {
  const { genCurrentCode } = useAppSettings();
  const { result, identify, url, text, error, executed } = useAppRuntime();

  const { loading } = useMessages();

  const handleInput: JSX.InputEventHandler<HTMLInputElement, InputEvent> = (
    e,
  ) => {
    const textValue = e.currentTarget.value;
    const byteLength = getByteLength(textValue);
    setError(byteLength > MAXBYTELENGTH);
    if (byteLength < MAXBYTELENGTH) setText(textValue);
  };

  const handleFileChange: JSX.ChangeEventHandlerUnion<
    HTMLInputElement,
    Event
  > = async (e) => {
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

  const handleClear: JSX.EventHandlerUnion<
    HTMLButtonElement,
    MouseEvent
  > = () => {
    clearObjectUrl();
    setResult("");
  };

  const getCurrentUrl = (): void => {
    Browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      if (!tabs[0]) return;
      setText(tabs[0].url ?? "");
    });
  };

  onMount(() => {
    if (genCurrentCode() && !executed()) getCurrentUrl();
    if (!executed()) setExecuted();
  });

  createEffect(
    on([() => result().length, identify], ([length]) => {
      if (length === 0) clearObjectUrl();
    }),
  );

  return (
    <main class="w-full h-full flex justify-center items-center bg-bg">
      <div class="pb-4 flex flex-col gap-5">
        <Show when={identify()}>
          <QrImagePicker
            src={url()}
            loading={loading()}
            onFileChange={handleFileChange}
            onClear={handleClear}
          />
          <QrInputter
            value={result()}
            readonly
          />
        </Show>

        <Show when={!identify()}>
          <QrCodeViewer value={!error() ? text() : ""} />
          <QrInputter
            value={text()}
            borderColor={error() ? "rgba(255, 0, 0, 0.3)" : ""}
            onInput={handleInput}
            tip={error() ? i18n(locale.tip.EXCEED_LIMIT) : ""}
          />
        </Show>
      </div>
    </main>
  );
}

export default Qrcode;
