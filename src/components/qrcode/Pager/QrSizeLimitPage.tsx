import { Icon } from "@iconify-icon/solid";
import dangerIcon from "@iconify-icons/solar/danger-triangle-bold";
import type { Component } from "solid-js";
import { locale } from "@/constants";
import { i18n } from "@/utils";

export const QrSizeLimitPage: Component = () => {
  return (
    <main class="w-screen h-screen flex flex-col items-center justify-center text-center">
      <Icon
        icon={dangerIcon}
        width={128}
        height={128}
      />
      <p class="text-xl font-bold">{i18n(locale.tip.WINDOW_TOO_SMALL)}</p>
    </main>
  );
};
