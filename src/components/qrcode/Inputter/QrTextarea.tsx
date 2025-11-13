import { Icon } from "@iconify-icon/solid";
import clipboardIcon from "@iconify-icons/solar/clipboard-linear";
import copyIcon from "@iconify-icons/solar/copy-linear";
import qrcode from "@iconify-icons/solar/qr-code-outline";
import scanner from "@iconify-icons/solar/scanner-outline";
import trashIcon from "@iconify-icons/solar/trash-bin-minimalistic-linear";
import type { Component, JSX } from "solid-js";
import { createEffect, createSignal, onMount, Show } from "solid-js";
import { isURL } from "validator";
import Browser from "webextension-polyfill";
import logo from "@/assets/logo.png";
import { Button } from "@/components/common/Button";
import { locale } from "@/constants";
import { ZoomTransition } from "@/transitions";
import { getByteLength, i18n, notify } from "@/utils";

const MAXBYTELENGTH = 1000;

const KEYFRAME_ANIMATION_OPTIONS = {
  duration: 300,
  easing: "ease-in-out",
};

interface TextareaHeaderProps {
  readonly?: boolean;
  byteLength: number;
}

const TextareaHeader: Component<TextareaHeaderProps> = (props) => {
  return (
    <div class="flex justify-between items-center">
      <div class="flex items-center gap-1 rounded-full p-2">
        <Icon
          icon={props.readonly ? scanner : qrcode}
          width={24}
          height={24}
        />
        <span class="text-base font-semibold text-text">
          {props.readonly
            ? i18n(locale.title.IDENTIFY)
            : i18n(locale.title.GENERATE)}
        </span>
      </div>

      <div class="p-2">
        <span class="text-sm text-gray-500">
          {props.byteLength}/{MAXBYTELENGTH}
        </span>
      </div>
    </div>
  );
};

interface TextareaProps {
  value: string;
  placeholder?: string;
  readonly?: boolean;
  onInput?: JSX.InputEventHandler<HTMLTextAreaElement, InputEvent>;
}

const Textarea: Component<TextareaProps> = (props) => {
  return (
    <div class="p2 box-border flex flex-col items-center border-2 border-solid border-border rounded-3xl">
      <div class="w-full">
        <textarea
          class="w-full resize-none border-none outline-none bg-transparent text-text line-height-normal break-all scrollbar-gutter-stable-both-edges hover:scrollbar-hover"
          onInput={props.onInput}
          value={props.value}
          readonly={props.readonly}
          placeholder={props.placeholder}
          rows={6}
          autofocus
        />
      </div>
    </div>
  );
};

interface QrTextareaProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  readonly?: boolean;
}

export const QrTextarea: Component<QrTextareaProps> = (props) => {
  const [isLoading, setIsLoading] = createSignal<boolean>(true);
  const [favIcon, setFavIcon] = createSignal<string>(logo);
  const [url, setUrl] = createSignal<string>("");
  const [byteLength, setByteLength] = createSignal<number>(0);

  const handleInput: JSX.InputEventHandler<HTMLTextAreaElement, InputEvent> = (
    e,
  ) => {
    const textValue = e.currentTarget.value;
    const byteLen = getByteLength(textValue);
    if (byteLen > MAXBYTELENGTH) {
      e.currentTarget.value = props.value;
      return;
    }
    props.onValueChange(textValue);
    setByteLength<number>(byteLen);
  };

  const handleClear: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> = (
    _e,
  ) => {
    props.onValueChange("");
    setByteLength<number>(0);
  };

  const handlePaste: JSX.EventHandlerUnion<
    HTMLButtonElement,
    MouseEvent
  > = async (_e) => {
    try {
      const text = await navigator.clipboard.readText();
      props.onValueChange(text);
      setByteLength<number>(getByteLength(text));
    } catch (error) {
      console.error(error);

      if (error instanceof Error)
        notify(i18n(locale.notify.ERROR), error.message);
    }
  };

  const handleCopy: JSX.EventHandlerUnion<
    HTMLButtonElement,
    MouseEvent
  > = async (_e) => {
    if (props.value === "") return;

    try {
      await navigator.clipboard.writeText(props.value);
    } catch (error) {
      console.error(error);

      if (error instanceof Error)
        notify(i18n(locale.notify.ERROR), error.message);
    }
  };

  const handleGetCurrentUrl: JSX.EventHandlerUnion<
    HTMLButtonElement,
    MouseEvent
  > = (_e) => {
    if (!url())
      notify(i18n(locale.notify.ERROR), i18n(locale.notify.NO_CURRENT_URL));

    props.onValueChange(url());
    setByteLength<number>(getByteLength(url()));
  };

  const getCurrentTab = async (): Promise<void> => {
    setIsLoading<boolean>(true);

    try {
      const tabs = await Browser.tabs.query({
        active: true,
        currentWindow: true,
      });
      if (!tabs[0]) return;

      setUrl<string>(tabs[0].url ?? "");

      const favicon = tabs[0].favIconUrl;
      if (favicon && isURL(favicon)) {
        const blob = await fetch(favicon).then((res) => res.blob());
        const url = URL.createObjectURL(blob);
        setFavIcon<string>((oldUrl) => {
          URL.revokeObjectURL(oldUrl);
          return url;
        });
      } else if (favicon && !isURL(favicon)) {
        setFavIcon<string>((oldUrl) => {
          URL.revokeObjectURL(oldUrl);
          return logo;
        });
      } else {
        setFavIcon<string>((oldUrl) => {
          URL.revokeObjectURL(oldUrl);
          return logo;
        });
      }
    } catch (error) {
      console.error(error);

      if (error instanceof Error)
        notify(i18n(locale.notify.ERROR), error.message);
      setUrl<string>("");
      setFavIcon<string>((oldUrl) => {
        URL.revokeObjectURL(oldUrl);
        return logo;
      });
    } finally {
      setIsLoading<boolean>(false);
    }
  };

  onMount(() => {
    getCurrentTab();
    Browser.tabs.onActivated.addListener(getCurrentTab);
  });

  createEffect(() => {
    setByteLength<number>(getByteLength(props.value));
  });

  return (
    <>
      <TextareaHeader
        readonly={props.readonly}
        byteLength={byteLength()}
      />
      <Textarea
        value={props.value}
        onInput={handleInput}
        readonly={props.readonly}
        placeholder={props.placeholder}
      />

      <div class="w-full flex justify-between">
        <div class="m-2 flex gap-2">
          <ZoomTransition
            enterKeyframeAnimationOptions={KEYFRAME_ANIMATION_OPTIONS}
            exitKeyframeAnimationOptions={KEYFRAME_ANIMATION_OPTIONS}
          >
            <Show
              when={props.readonly}
              fallback={
                <Button
                  size={16}
                  text={i18n(locale.button.CLEAR)}
                  onClick={handleClear}
                >
                  <Icon
                    icon={trashIcon}
                    width={16}
                    height={16}
                  />
                </Button>
              }
            >
              <Button
                size={16}
                text={i18n(locale.button.CLEAR)}
                onClick={handleClear}
              >
                <Icon
                  icon={trashIcon}
                  width={16}
                  height={16}
                />
              </Button>
            </Show>
          </ZoomTransition>

          <ZoomTransition
            enterKeyframeAnimationOptions={KEYFRAME_ANIMATION_OPTIONS}
            exitKeyframeAnimationOptions={KEYFRAME_ANIMATION_OPTIONS}
          >
            <Show
              when={props.readonly}
              fallback={
                <Button
                  size={16}
                  text={i18n(locale.button.PASTE)}
                  onClick={handlePaste}
                >
                  <Icon
                    icon={clipboardIcon}
                    width={16}
                    height={16}
                  />
                </Button>
              }
            >
              <Button
                size={16}
                text={i18n(locale.button.COPY)}
                onClick={handleCopy}
              >
                <Icon
                  icon={copyIcon}
                  width={16}
                  height={16}
                />
              </Button>
            </Show>
          </ZoomTransition>
        </div>

        <ZoomTransition
          enterKeyframeAnimationOptions={{
            delay: KEYFRAME_ANIMATION_OPTIONS.duration,
            duration: KEYFRAME_ANIMATION_OPTIONS.duration,
            easing: KEYFRAME_ANIMATION_OPTIONS.easing,
            fill: "both",
          }}
          exitKeyframeAnimationOptions={{
            duration: KEYFRAME_ANIMATION_OPTIONS.duration,
            easing: KEYFRAME_ANIMATION_OPTIONS.easing,
          }}
        >
          <Show when={!props.readonly}>
            <span class="m-2">
              <Button
                size={16}
                text={i18n(locale.button.CURRENT_URL)}
                loading={isLoading()}
                onClick={handleGetCurrentUrl}
              >
                <img
                  class="size-4 dark:invert"
                  src={favIcon()}
                />
              </Button>
            </span>
          </Show>
        </ZoomTransition>
      </div>
    </>
  );
};
