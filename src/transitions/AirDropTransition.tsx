import type { JSX } from "solid-js";
import { Transition } from "solid-transition-group";

interface AirDropTransitionProps {
  children: JSX.Element;
}

const addClassList = (el: Element): void => {
  if (el instanceof HTMLElement) el.classList.add("pointer-events-none");
};

const removeClassList = (el: Element): void => {
  if (el instanceof HTMLElement) el.classList.remove("pointer-events-none");
  if (el.classList.length === 0) el.removeAttribute("class");
};

export function AirDropTransition(props: AirDropTransitionProps) {
  const onEnter = (el: Element, done: VoidFunction): void => {
    addClassList(el);
    el.animate(
      [
        {
          transform: "translateY(120%)",
          scale: 0.8,
          offset: 0,
        },
        {
          transform: "translateY(30%)",
          scale: 1.05,
          offset: 0.3,
        },
        {
          transform: "translateY(0%)",
          scale: 1,
          offset: 1,
        },
      ],
      {
        duration: 500,
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    )
      .finished.then(done)
      .catch(done)
      .finally(() => removeClassList(el));
  };

  const onExit = (el: Element, done: VoidFunction): void => {
    addClassList(el);
    el.animate(
      [
        {
          transform: "translateY(0%)",
          scale: 1,
          offset: 0,
        },
        {
          transform: "translateY(-10%)",
          scale: 0.98,
          offset: 0.2,
        },
        {
          transform: "translateY(100%)",
          scale: 0.98,
          offset: 1,
        },
      ],
      {
        duration: 300,
        easing: "cubic-bezier(0.4, 0, 1, 1)",
      },
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
