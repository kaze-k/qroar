import { Icon } from "@iconify-icon/solid";
import alertIcon from "@iconify-icons/line-md/alert-twotone";
import type { Component } from "solid-js";

interface QrErrorPageProps {
  err: any;
  reset: VoidFunction;
}

export const QrErrorPage: Component<QrErrorPageProps> = (props) => {
  return (
    <main class="fixed inset-0 flex flex-col items-center justify-center w-screen h-screen text-center bg-red-900 text-white">
      <div class="flex items-center gap-2 mb-6">
        <span class="text-yellow-300">
          <Icon
            icon={alertIcon}
            width={48}
            height={48}
          />
        </span>
        <h1 class="text-3xl font-extrabold tracking-widest text-yellow-300 animate-pulse">
          WARNING
        </h1>
        <span class="text-yellow-300">
          <Icon
            icon={alertIcon}
            width={48}
            height={48}
          />
        </span>
      </div>

      <p class="text-lg tracking-wide uppercase">
        {props.err?.message ?? "SYSTEM FAILURE"}
      </p>

      <button
        class="mt-10 px-6 py-3 font-size-4 font-bold uppercase border-2 border-yellow-300 text-yellow-300 bg-red-900 transition-transform transform hover:bg-yellow-300 hover:text-red-900 active:scale-95"
        onClick={props.reset}
      >
        RETRY
      </button>
    </main>
  );
};
