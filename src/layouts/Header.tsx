import type { IconifyIcon } from "@iconify-icon/solid";
import { Icon } from "@iconify-icon/solid";
import chevronLeftIcon from "@iconify-icons/material-symbols/chevron-left-rounded";
import cameraIcon from "@iconify-icons/mdi/camera";
import moonIcon from "@iconify-icons/solar/moon-bold-duotone";
import settingsIcon from "@iconify-icons/solar/settings-bold";
import sunIcon from "@iconify-icons/solar/sun-bold-duotone";
import { useLocation, useNavigate } from "@solidjs/router";
import type { Component, JSX } from "solid-js";
import { createMemo, createSignal } from "solid-js";
import type { Path } from "#/constants";
import { Button } from "@/components/common/Button";
import { Title } from "@/components/common/Title";
import { locale, path } from "@/constants";
import {
  useCreateWindow,
  useSlideTransition,
  useSwitchTransition,
} from "@/hooks";
import { useAppTheme, useAppThemeActions } from "@/stores";
import { i18n } from "@/utils";

const TRANSITION_OPTIONS = {
  enterKeyframes: {
    scale: [0.3, 1.05, 0.9, 1],
  },
  exitKeyframes: {
    scale: [1, 0],
  },
  keyframeAnimationOptions: {
    duration: 300,
    easing: "ease-in-out",
  },
};

interface Slot {
  icon: IconifyIcon;
  size: number;
  text?: string;
}

const { toggleDarkTheme } = useAppThemeActions();

export const Header: Component = () => {
  const [titleRef, setTitleRef] = createSignal<HTMLElement>();

  const { dark } = useAppTheme();

  const location = useLocation<Path>();
  const navigate = useNavigate();

  const pathname = createMemo((): Path => location.pathname as Path);
  const isSetup = createMemo((): boolean => pathname() === path.SETUP);

  const title = createMemo((): string =>
    pathname() === path.ROOT || pathname() === path.QRCODE
      ? i18n(locale.title.EXTNAME)
      : i18n(locale.title.SETUP),
  );

  const { up, down, current } = useSlideTransition<string>(title, titleRef);

  const leftTransition = createMemo((): Slot => {
    if (isSetup()) return { icon: chevronLeftIcon, size: 24 };
    else return { icon: cameraIcon, size: 16, text: i18n(locale.button.SCAN) };
  });
  const rightTransition = createMemo((): Slot => {
    if (isSetup() && dark()) return { icon: sunIcon, size: 24 };
    else if (isSetup() && !dark()) return { icon: moonIcon, size: 24 };
    else return { icon: settingsIcon, size: 24 };
  });

  const {
    animating: animatingLeft,
    setElement: setLeftElement,
    current: currentLeft,
  } = useSwitchTransition(leftTransition, {
    enterKeyframes: TRANSITION_OPTIONS.enterKeyframes,
    exitKeyframes: TRANSITION_OPTIONS.exitKeyframes,
    enterOptions: TRANSITION_OPTIONS.keyframeAnimationOptions,
    exitOptions: TRANSITION_OPTIONS.keyframeAnimationOptions,
  });

  const {
    animating: animatingRight,
    setElement: setRightElement,
    current: currentRight,
  } = useSwitchTransition(rightTransition, {
    enterKeyframes: TRANSITION_OPTIONS.enterKeyframes,
    exitKeyframes: TRANSITION_OPTIONS.exitKeyframes,
    enterOptions: TRANSITION_OPTIONS.keyframeAnimationOptions,
    exitOptions: TRANSITION_OPTIONS.keyframeAnimationOptions,
  });

  const { create } = useCreateWindow();

  const handleLeftBtnClick: JSX.EventHandlerUnion<
    HTMLButtonElement,
    MouseEvent
  > = (_e) => {
    if (animatingLeft()) return;

    if (isSetup()) navigate("/qrcode", { replace: true });
    else create();

    if (isSetup()) down();
  };

  const handleRightBtnClick: JSX.EventHandlerUnion<
    HTMLButtonElement,
    MouseEvent
  > = (_e) => {
    if (animatingRight()) return;

    if (isSetup()) toggleDarkTheme();
    else navigate("/setup", { replace: true });

    if (!isSetup()) up();
  };

  return (
    <header class="fixed top-0 w-full z-1 pointer-events-none gradient-180">
      <div class="p-4 flex items-center">
        <div class="flex-1 flex justify-left">
          <Button
            size={currentLeft().size}
            onClick={handleLeftBtnClick}
          >
            <span
              class="flex justify-center items-center"
              classList={{
                "p-1 gap-1": Boolean(currentLeft()?.text),
              }}
            >
              <Icon
                ref={setLeftElement}
                icon={currentLeft().icon}
                width={currentLeft().size}
                height={currentLeft().size}
              />
              <span
                ref={setLeftElement}
                class="will-change-transform"
                classList={{
                  hidden: !Boolean(currentLeft().text),
                }}
              >
                {currentLeft().text && i18n(locale.button.SCAN)}
              </span>
            </span>
          </Button>
        </div>

        <Title ref={setTitleRef}>{current()}</Title>

        <div class="flex-1 flex justify-right">
          <Button
            size={24}
            onClick={handleRightBtnClick}
          >
            <Icon
              ref={setRightElement}
              icon={currentRight().icon}
              width={24}
              height={24}
            />
          </Button>
        </div>
      </div>
    </header>
  );
};
