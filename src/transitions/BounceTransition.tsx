import type { JSX } from "solid-js";
import { Transition } from "solid-transition-group";

interface BounceTransitionProps {
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

export function BounceTransition(props: BounceTransitionProps) {
  const onEnter = (el: Element, done: VoidFunction): void => {
    addClassList(el);
    el.animate(
      {
        scale: [0.3, 1.05, 0.9, 1],
      },
      props.enterKeyframeAnimationOptions,
    )
      .finished.then(done)
      .catch(done)
      .finally(() => removeClassList(el));
  };

  const onExit = (el: Element, done: VoidFunction): void => {
    addClassList(el);
    el.animate(
      {
        scale: [1, 0],
      },
      props.exitKeyframeAnimationOptions,
    )
      .finished.then(done)
      .catch(done)
      .finally(() => removeClassList(el));
  };

  return (
    <Transition
      mode="outin"
      onEnter={onEnter}
      onExit={onExit}
    >
      {props.children}
    </Transition>
  );
}
