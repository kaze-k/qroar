import { Icon } from "@iconify-icon/solid";
import fullScreenIcon from "@iconify-icons/solar/full-screen-outline";
import quitFullScreenIcon from "@iconify-icons/solar/quit-full-screen-outline";
import type { Component, JSX } from "solid-js";
import { createSignal, onCleanup, onMount } from "solid-js";
import { Button } from "@/components/common/Button";

export const QrFullScreenButton: Component = () => {
  const [full, setFull] = createSignal<boolean>(false);

  const handleClick: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> = (
    _e,
  ) => {
    if (full()) document.exitFullscreen();
    else document.documentElement.requestFullscreen();
    setFull<boolean>(!full());
  };

  const handleFullScreenChange = (): void => {
    setFull<boolean>(document.fullscreenElement !== null);
  };

  onMount(() => {
    document.addEventListener("fullscreenchange", handleFullScreenChange);

    onCleanup(() => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    });
  });

  return (
    <Button
      size={24}
      onClick={handleClick}
    >
      <Icon
        icon={full() ? quitFullScreenIcon : fullScreenIcon}
        width={24}
        height={24}
      />
    </Button>
  );
};
