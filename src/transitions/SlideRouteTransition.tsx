import type { JSX } from "solid-js";
import { createSignal } from "solid-js";
import { Transition } from "solid-transition-group";

interface SlideRouteTransitionProps {
  classList?: string[];
  keyframeAnimationOptions?: KeyframeAnimationOptions;
  shouldTransition: boolean;
  children: JSX.Element;
}

export function SlideRouteTransition(props: SlideRouteTransitionProps) {
  const [mounted, setMounted] = createSignal<boolean>(false);

  const handleUnMount = (done: VoidFunction): void => {
    setMounted(true);
    requestAnimationFrame(() => requestAnimationFrame(done));
  };

  const addClassList = (el: Element): void => {
    if (el instanceof HTMLElement && props.classList)
      el.classList.add(...props.classList);
  };

  const removeClassList = (el: Element): void => {
    if (el instanceof HTMLElement && props.classList)
      el.classList.remove(...props.classList);
    if (el.classList.length === 0) el.removeAttribute("class");
  };

  const onEnter = (el: Element, done: VoidFunction): void => {
    addClassList(el);
    if (!mounted()) {
      handleUnMount(done);
      removeClassList(el);
    } else if (props.shouldTransition) {
      el.animate(
        {
          transform: ["translateX(100%)", "translateX(0)"],
        },
        props.keyframeAnimationOptions,
      )
        .finished.then(done)
        .catch(done)
        .finally(() => removeClassList(el));
    } else {
      if (el instanceof HTMLElement) el.classList.add("z--1");
      el.animate(
        {
          opacity: [0, 1],
        },
        props.keyframeAnimationOptions,
      )
        .finished.then(done)
        .catch(done)
        .finally(() => {
          if (el instanceof HTMLElement) el.classList.remove("z--1");
          if (el.classList.length === 0) el.removeAttribute("class");
          removeClassList(el);
        });
    }
  };

  const onExit = (el: Element, done: VoidFunction): void => {
    addClassList(el);
    if (!mounted()) {
      handleUnMount(done);
      removeClassList(el);
    } else if (props.shouldTransition) {
      if (el instanceof HTMLElement) el.classList.add("z--1");
      el.animate(
        {
          opacity: [1, 0],
        },
        props.keyframeAnimationOptions,
      )
        .finished.then(done)
        .catch(done)
        .finally(() => {
          if (el instanceof HTMLElement) el.classList.remove("z--1");
          if (el.classList.length === 0) el.removeAttribute("class");
        });
    } else {
      el.animate(
        {
          transform: ["translateX(0)", "translateX(100%)"],
        },
        props.keyframeAnimationOptions,
      )
        .finished.then(done)
        .catch(done);
    }
  };

  return (
    <Transition
      onEnter={onEnter}
      onExit={onExit}
    >
      {props.children}
    </Transition>
  );
}
