import { Icon } from "@iconify-icon/solid";
import SettingsIcon from "@iconify-icons/iconoir/settings";
import checkIcon from "@iconify-icons/line-md/check-all";
import type { Component, JSX } from "solid-js";
import { createSignal, Show } from "solid-js";
import { locale } from "@/constants";
import {
  useAppContextMenuActions,
  useAppSettingsActions,
  useAppSyncActions,
  useAppThemeActions,
} from "@/stores";
import { i18n } from "@/utils";

const { resetSettings } = useAppSettingsActions();
const { resetContextMenu } = useAppContextMenuActions();
const { resetTheme } = useAppThemeActions();
const { resetSync } = useAppSyncActions();

const DELAY = 1500;

export const QrResetButton: Component = () => {
  const [checked, setChecked] = createSignal<boolean>(false);

  const handleClick: JSX.EventHandlerUnion<
    HTMLButtonElement,
    MouseEvent
  > = () => {
    resetSettings();
    resetContextMenu();
    resetTheme();
    resetSync();

    setChecked<boolean>(true);
    setTimeout(() => {
      setChecked<boolean>(false);
    }, DELAY);
  };

  return (
    <button
      class="group py-2 px-4 flex items-center justify-between text-left border-0 rounded-3xl cursor-pointer bg-light-7/50 dark:bg-dark-1/50 duration-900 transition-property-backdrop-filter hover:backdrop-brightness-90 active:backdrop-brightness-80 dark:hover:backdrop-brightness-180 dark:active:backdrop-brightness-220"
      classList={{
        "pointer-events-none opacity-80": checked(),
      }}
      onClick={handleClick}
    >
      <span class="inline-block text-red font-size-3 font-bold line-height-loose duration-500 will-change-transform group-hover:translate-x-2 group-active:scale-85">
        {i18n(locale.button.RESET)}
      </span>
      <Show
        when={!checked()}
        fallback={
          <Icon
            icon={checkIcon}
            width={20}
            height={20}
            class="text-green"
          />
        }
      >
        <Icon
          icon={SettingsIcon}
          width={20}
          height={20}
          class="text-red will-change-transform group-hover:animate-spin"
        />
      </Show>
    </button>
  );
};
