import type { JSX } from "solid-js";
import { Transition } from "solid-transition-group";

interface FloatYTransitionProps {
  enterKeyframeAnimationOptions: KeyframeAnimationOptions;
  exitKeyframeAnimationOptions: KeyframeAnimationOptions;
  reverse?: boolean;
  children: JSX.Element;
}

const addClassList = (el: Element): void => {
  if (el instanceof HTMLElement) el.classList.add("pointer-events-none");
};

const removeClassList = (el: Element): void => {
  if (el instanceof HTMLElement) el.classList.remove("pointer-events-none");
  if (el.classList.length === 0) el.removeAttribute("class");
};

export function FloatYTransition(props: FloatYTransitionProps) {
  const onEnter = (el: Element, done: VoidFunction): void => {
    addClassList(el);
    el.animate(
      props.reverse
        ? {
            transform: ["translateY(10%)", "translateY(0%)"],
            opacity: [0, 1],
            scale: [0.96, 1.02, 1],
            filter: ["blur(5px)", "blur(2px)", "blur(0px)"],
          }
        : {
            transform: ["translateY(-10%)", "translateY(0%)"],
            opacity: [0, 1],
            scale: [0.96, 1.02, 1],
            filter: ["blur(5px)", "blur(2px)", "blur(0px)"],
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
      props.reverse
        ? {
            transform: ["translateY(0%)", "translateY(10%)"],
            opacity: [1, 0],
            scale: [1.02, 0.96, 1],
            filter: ["blur(0px)", "blur(2px)", "blur(5px)"],
          }
        : {
            transform: ["translateY(0%)", "translateY(-10%)"],
            opacity: [1, 0],
            scale: [1.02, 0.96, 1],
            filter: ["blur(0px)", "blur(2px)", "blur(5px)"],
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
