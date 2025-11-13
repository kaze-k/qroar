import { Icon } from "@iconify-icon/solid";
import scanIcon from "@iconify-icons/solar/scanner-linear";
import stopIcon from "@iconify-icons/solar/stop-bold";
import type { Component, JSX } from "solid-js";
import { Button } from "@/components/common/Button";
import { useAppRuntime, useAppRuntimeActions } from "@/stores";

const { setScan } = useAppRuntimeActions();

export const QrScanButton: Component = () => {
  const { scan } = useAppRuntime();

  const handleClick: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> = (
    _e,
  ) => {
    setScan(!scan());
  };

  return (
    <Button
      size={24}
      onClick={handleClick}
    >
      <Icon
        icon={scan() ? stopIcon : scanIcon}
        width={24}
        height={24}
        classList={{
          "animate-pulse text-red-500": scan(),
        }}
      />
    </Button>
  );
};
