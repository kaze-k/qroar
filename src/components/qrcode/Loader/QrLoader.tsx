import { Icon } from "@iconify-icon/solid";
import loadingIcon from "@iconify-icons/svg-spinners/3-dots-scale-middle";
import type { Component } from "solid-js";
import { onCleanup, onMount } from "solid-js";

interface QrLoaderProps {
  screen?: boolean;
}

export const QrLoader: Component<QrLoaderProps> = (props) => {
  let el: HTMLElement | undefined;

  onMount(() => {
    if (!el || !props.screen) return;

    document.body.appendChild(el);

    onCleanup(() => {
      document.body.contains(el) && document.body.removeChild(el);
    });
  });

  return (
    <main
      class="fixed flex inset-0 justify-center items-center bg-bg"
      classList={{
        "w-screen w-screen": props.screen,
        "w-full h-full": !props.screen,
      }}
      ref={el}
    >
      <Icon
        icon={loadingIcon}
        width={props.screen ? 128 : 64}
        height={props.screen ? 128 : 64}
      />
    </main>
  );
};
