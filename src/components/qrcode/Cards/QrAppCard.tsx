import type { Component } from "solid-js";
import Browser from "webextension-polyfill";
import logo from "@/assets/logo.png";
import { Link } from "@/components/common/Link";

const VERSION = Browser.runtime.getManifest().version;
const NAME = Browser.runtime.getManifest().name;

export const QrAppCard: Component = () => {
  return (
    <div class="p-4 flex flex-col items-center gap-1 bg-light-7/50 dark:bg-dark-1/50 rounded-3xl">
      <img
        src={logo}
        width={32}
        height={32}
        class="mb-2"
      />
      <span class="font-size-4 text-transparent bg-clip-text rainbow-gradient animate-ripple">
        {NAME}
      </span>
      <span class="text-center">
        <Link href="https://github.com/kaze-k/qroar">Version {VERSION}</Link>
      </span>
    </div>
  );
};
