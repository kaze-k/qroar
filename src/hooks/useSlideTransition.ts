import type { Accessor } from "solid-js";
import { createEffect, createSignal, onCleanup } from "solid-js";

interface AnimateConfig {
  keyframes: Keyframe[] | PropertyIndexedKeyframes;
  options?: number | KeyframeAnimationOptions;
}

const UP_EXIT_ANIMATION_CONFIG = {
  keyframes: {
    transform: ["translateY(0%)", "translateY(-50%)"],
    opacity: [1, 0],
  },
  options: {
    duration: 100,
    easing: "cubic-bezier(0.25, 0.75, 0.5, 1)",
  },
};

const UP_ENTER_ANIMATION_CONFIG = {
  keyframes: {
    transform: ["translateY(50%)", "translateY(0%)"],
    opacity: [0, 1],
  },
  options: {
    duration: 300,
    easing: "cubic-bezier(0.25, 0.75, 0.5, 1)",
  },
};

const DOWN_EXIT_ANIMATION_CONFIG = {
  keyframes: {
    transform: ["translateY(0%)", "translateY(50%)"],
    opacity: [1, 0],
  },
  options: {
    duration: 100,
    easing: "cubic-bezier(0.25, 0.75, 0.5, 1)",
  },
};

const DOWN_ENTER_ANIMATION_CONFIG = {
  keyframes: {
    transform: ["translateY(-50%)", "translateY(0%)"],
    opacity: [0, 1],
  },
  options: {
    duration: 300,
    easing: "cubic-bezier(0.25, 0.75, 0.5, 1)",
  },
};

interface SlideTransitionReturn<T> {
  up: () => void;
  down: () => void;
  animating: Accessor<boolean>;
  current: Accessor<T>;
}

export function useSlideTransition<T>(
  value: Accessor<T>,
  el: Accessor<HTMLElement | undefined>,
): SlideTransitionReturn<T> {
  const [current, setCurrent] = createSignal<T>(value());
  const [animating, setAnimating] = createSignal<boolean>(false);

  let isUnmounted = false;

  const cancelAll = (): void => {
    const element = el();
    if (!element) return;

    element.getAnimations().forEach((animating) => animating.cancel());
  };

  const runTransition = (enter: AnimateConfig, exit: AnimateConfig): void => {
    const element = el();
    if (!element) return;

    if (animating()) return;
    setAnimating(true);

    cancelAll();

    element
      .animate(exit.keyframes, exit.options)
      .finished.then(() => {
        if (isUnmounted || !el()) return;

        setCurrent(value);

        return element.animate(enter.keyframes, enter.options).finished;
      })
      .catch(cancelAll)
      .finally(() => {
        if (isUnmounted || !el()) return;
        setAnimating(false);
      });
  };

  const up = (): void =>
    runTransition(UP_ENTER_ANIMATION_CONFIG, UP_EXIT_ANIMATION_CONFIG);
  const down = (): void =>
    runTransition(DOWN_ENTER_ANIMATION_CONFIG, DOWN_EXIT_ANIMATION_CONFIG);

  createEffect(() => {
    if (!el()) cancelAll();
  });

  onCleanup(() => {
    isUnmounted = true;
    cancelAll();
  });

  return { up, down, animating, current };
}
