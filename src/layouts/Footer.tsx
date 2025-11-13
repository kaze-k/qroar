import { Icon } from "@iconify-icon/solid";
import qrCodeIcon from "@iconify-icons/solar/qr-code-linear";
import scannerIcon from "@iconify-icons/solar/scanner-linear";
import { useLocation } from "@solidjs/router";
import type { Component } from "solid-js";
import { createMemo, Show } from "solid-js";
import type { SelectorItem } from "#/components";
import type { Path } from "#/constants";
import {
  QrCopyButton,
  QrDownloadButton,
  QrIdentifyClipboardButton,
  QrOpenLineButton,
} from "@/components/qrcode/Buttons";
import { QrSelector } from "@/components/qrcode/Selector";
import { locale, path } from "@/constants";
import { useAppRuntime, useAppRuntimeActions } from "@/stores";
import { BounceTransition, FadeTransition } from "@/transitions";
import { i18n } from "@/utils";

const FOOTER_KEYFRAME_ANIMATION_OPTIONS: KeyframeAnimationOptions = {
  duration: 500,
  easing: "ease-out",
};

const BTN_KEYFRAME_ANIMATION_OPTIONS: KeyframeAnimationOptions = {
  duration: 300,
  easing: "ease-out",
};

const { setIdentify } = useAppRuntimeActions();

export const Footer: Component = () => {
  const { identify } = useAppRuntime();

  const location = useLocation<Path>();
  const pathname = createMemo((): Path => location.pathname as Path);

  const isQrcode = createMemo((): boolean => pathname() === path.QRCODE);

  const items: SelectorItem[] = [
    {
      icon: (
        <Icon
          icon={qrCodeIcon}
          width={16}
          height={16}
        />
      ),
      text: i18n(locale.button.GENERATE),
      onClick: [setIdentify, false],
    },
    {
      icon: (
        <Icon
          icon={scannerIcon}
          width={16}
          height={16}
        />
      ),
      text: i18n(locale.button.IDENTIFY),
      onClick: [setIdentify, true],
    },
  ];

  return (
    <footer class="fixed bottom-0 w-full min-h-10 z-1 pointer-events-none gradient-360">
      <FadeTransition
        enterKeyframeAnimationOptions={FOOTER_KEYFRAME_ANIMATION_OPTIONS}
        exitKeyframeAnimationOptions={FOOTER_KEYFRAME_ANIMATION_OPTIONS}
      >
        <Show when={isQrcode()}>
          <div class="p-4 flex justify-between items-center">
            <QrSelector
              items={items}
              index={identify() ? 1 : 0}
            />

            <div class="flex justify-between gap-4">
              <BounceTransition
                enterKeyframeAnimationOptions={BTN_KEYFRAME_ANIMATION_OPTIONS}
                exitKeyframeAnimationOptions={BTN_KEYFRAME_ANIMATION_OPTIONS}
              >
                <Show
                  when={identify()}
                  fallback={<QrCopyButton />}
                >
                  <QrIdentifyClipboardButton />
                </Show>
              </BounceTransition>

              <BounceTransition
                enterKeyframeAnimationOptions={BTN_KEYFRAME_ANIMATION_OPTIONS}
                exitKeyframeAnimationOptions={BTN_KEYFRAME_ANIMATION_OPTIONS}
              >
                <Show
                  when={identify()}
                  fallback={<QrDownloadButton />}
                >
                  <QrOpenLineButton />
                </Show>
              </BounceTransition>
            </div>
          </div>
        </Show>
      </FadeTransition>
    </footer>
  );
};
