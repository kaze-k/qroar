import type { Component, JSX } from "solid-js";
import { onMount } from "solid-js";

interface TitleProps {
  children: JSX.Element;
  ref?: (el: HTMLElement) => void;
}

export const Title: Component<TitleProps> = (props) => {
  let ref: HTMLElement | undefined;

  onMount(() => {
    if (ref && props.ref) props.ref(ref);
  });

  return (
    <h1 class="m-0 px-2 py-1 flex justify-center items-center box-border font-size-4 font-500 text-text text-center pointer-events-auto rounded-full glass-style transition-property-transform animate-transform hover:scale-115">
      <span
        ref={ref}
        class="will-change-transform"
      >
        {props.children}
      </span>
    </h1>
  );
};
