import type { Accessor } from "solid-js";
import { createEffect, createSignal, on, onCleanup } from "solid-js";

interface IconTransitionOptions {
  enterKeyframes: Keyframe[] | PropertyIndexedKeyframes;
  exitKeyframes: Keyframe[] | PropertyIndexedKeyframes;
  enterOptions: KeyframeAnimationOptions;
  exitOptions: KeyframeAnimationOptions;
}

interface IconTransitionReturn<T> {
  animating: Accessor<boolean>;
  setElement: (el: HTMLElement) => void;
  current: Accessor<T>;
}

export function useSwitchTransition<T>(
  value: Accessor<T>,
  options: IconTransitionOptions,
): IconTransitionReturn<T> {
  const [current, setCurrent] = createSignal<T>(value());
  const [animating, setAnimating] = createSignal<boolean>(false);
  const [els, setEls] = createSignal<HTMLElement[]>([]);

  let isUnmounted = false;

  const cancelAll = (): void => {
    for (const el of els()) {
      el.getAnimations().forEach((anim) => anim.cancel());
    }
  };

  const runTransition = async (): Promise<void> => {
    const elements = els();
    if (elements.length === 0) return;

    setAnimating(true);
    cancelAll();

    const exitAnimations = elements.map((el) =>
      el.animate(options.exitKeyframes, options.exitOptions),
    );

    try {
      await Promise.all(exitAnimations.map((animation) => animation.finished));

      if (isUnmounted || els().length === 0) return;

      setCurrent(value);

      const enterAnimations = elements.map((el) =>
        el.animate(options.enterKeyframes, options.enterOptions),
      );

      await Promise.all(enterAnimations.map((animation) => animation.finished));
    } finally {
      if (isUnmounted || els().length === 0) return;
      setAnimating(false);
      cancelAll();
    }
  };

  const setElement: (el: HTMLElement) => void = (el) =>
    el &&
    setEls<HTMLElement[]>((prev) => (prev.includes(el) ? prev : [...prev, el]));

  createEffect(
    on(
      value,
      () => {
        if (animating()) return;
        runTransition();
      },
      {
        defer: true,
      },
    ),
  );

  onCleanup(() => {
    isUnmounted = true;
    cancelAll();
    setEls<HTMLElement[]>([]);
  });

  return { animating, setElement, current };
}
