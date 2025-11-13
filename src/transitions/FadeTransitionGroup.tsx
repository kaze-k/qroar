import type { JSX } from "solid-js";
import { TransitionGroup } from "solid-transition-group";

interface FadeTransitionProps {
  enterKeyframeAnimationOptions: KeyframeAnimationOptions;
  exitKeyframeAnimationOptions: KeyframeAnimationOptions;
  children: JSX.Element;
}

const addClassList = (el: Element): void => {
  if (el instanceof HTMLElement) el.classList.add("pointer-events-none");
};

const removeClassList = (el: Element): void => {
  if (el instanceof HTMLElement) el.classList.remove("pointer-events-none");
  if (el.classList.length === 0) el.removeAttribute("class");
};

export function FadeTransitionGroup(props: FadeTransitionProps) {
  const onEnter = (el: Element, done: VoidFunction): void => {
    addClassList(el);

    const height = window.getComputedStyle(el).height;
    const padding = window.getComputedStyle(el).padding;

    el.animate(
      [
        { opacity: 0, maxHeight: "0", padding: "0", offset: 0, easing: "ease" },
        {
          opacity: 0,
          maxHeight: height,
          padding: padding,
          offset: 0.25,
          easing: "ease",
        },
        {
          opacity: 1,
          maxHeight: height,
          padding: padding,
          offset: 1,
          easing: "ease-in",
        },
      ],
      props.enterKeyframeAnimationOptions,
    )
      .finished.then(done)
      .catch(done)
      .finally(() => removeClassList(el));
  };

  const onExit = (el: Element, done: VoidFunction): void => {
    addClassList(el);

    const height = window.getComputedStyle(el).height;
    const padding = window.getComputedStyle(el).padding;

    el.animate(
      [
        {
          opacity: 1,
          maxHeight: height,
          padding: padding,
          offset: 0,
          easing: "ease",
        },
        {
          opacity: 0,
          maxHeight: height,
          padding: padding,
          offset: 0.75,
          easing: "ease",
        },
        {
          opacity: 0,
          maxHeight: "0",
          padding: "0",
          offset: 1,
          easing: "ease-out",
        },
      ],
      props.exitKeyframeAnimationOptions,
    )
      .finished.then(done)
      .catch(done)
      .finally(() => removeClassList(el));
  };

  return (
    <TransitionGroup
      onEnter={onEnter}
      onExit={onExit}
    >
      {props.children}
    </TransitionGroup>
  );
}
