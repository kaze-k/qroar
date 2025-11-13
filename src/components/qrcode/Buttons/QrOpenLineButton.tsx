import { Icon } from "@iconify-icon/solid";
import openInNewIcon from "@iconify-icons/mdi/open-in-new";
import type { Component, JSX } from "solid-js";
import { isURL } from "validator";
import { Button } from "@/components/common/Button";
import { useAppRuntime } from "@/stores";

const handleText = (text: string): void => {
  const win = window.open("", "_blank");

  if (win) win.document.body.innerText = text;
};

const handleLink = (link: string): void => {
  const url =
    link.startsWith("http") || link.startsWith("https")
      ? link
      : `https://${link}`;
  window.open(url, "_blank");
};

export const QrOpenLineButton: Component = () => {
  const { result } = useAppRuntime();

  const handleClick: JSX.EventHandlerUnion<
    HTMLButtonElement,
    MouseEvent
  > = () => {
    const res = result();
    if (isURL(res)) handleLink(res);
    else handleText(res);
  };

  return (
    <Button
      size={24}
      onClick={handleClick}
      disabled={!result()}
    >
      <Icon
        icon={openInNewIcon}
        width={24}
        height={24}
      />
    </Button>
  );
};
