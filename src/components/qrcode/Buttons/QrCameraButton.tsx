import type { IconifyIcon } from "@iconify-icon/solid";
import { Icon } from "@iconify-icon/solid";
import cameraIcon from "@iconify-icons/solar/camera-minimalistic-bold";
import dangerIcon from "@iconify-icons/solar/danger-circle-bold";
import infoIcon from "@iconify-icons/solar/info-circle-bold";
import type { Component, JSX } from "solid-js";
import { createMemo } from "solid-js";
import { Button } from "@/components/common/Button";
import { locale, permissionType } from "@/constants";
import { useAppRuntime, useAppRuntimeActions } from "@/stores";
import { i18n, notify } from "@/utils";

const { setScan } = useAppRuntimeActions();

export const QrCameraButton: Component = () => {
  const { permission } = useAppRuntime();

  const icon = createMemo((): IconifyIcon => {
    switch (permission()) {
      case permissionType.GRANTED:
        return cameraIcon;
      case permissionType.DENIED:
        return dangerIcon;
      case permissionType.PROMPT:
        return infoIcon;
    }
  });

  const handleClick: JSX.EventHandlerUnion<
    HTMLButtonElement,
    MouseEvent
  > = async (_e) => {
    if (permission() === permissionType.PROMPT) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        stream.getTracks().forEach((track) => track.stop());
      } catch (error) {
        console.error(error);

        if (error instanceof Error)
          notify(i18n(locale.notify.ERROR), error.message);
      }
    } else if (permission() === permissionType.GRANTED) setScan(true);
  };

  return (
    <Button
      size={24}
      onClick={handleClick}
      disabled={permission() === "denied"}
    >
      <Icon
        icon={icon()}
        width={24}
        height={24}
      />
    </Button>
  );
};
