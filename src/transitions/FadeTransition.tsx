import type { JSX } from "solid-js";
import { Transition } from "solid-transition-group";

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

export function FadeTransition(props: FadeTransitionProps) {
  const onEnter = (el: Element, done: VoidFunction): void => {
    addClassList(el);
    el.animate(
      {
        opacity: [0, 1],
        filter: ["blur(10px)", "blur(0px)"],
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
        opacity: [1, 0],
        filter: ["blur(0px)", "blur(10px)"],
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
