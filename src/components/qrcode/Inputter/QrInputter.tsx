import { Icon } from "@iconify-icon/solid";
import dangerIcon from "@iconify-icons/solar/danger-circle-broken";
import type { Component, JSX } from "solid-js";
import { createEffect, onMount, Show } from "solid-js";

interface QrInputterProps {
  onInput?: JSX.InputEventHandler<HTMLInputElement, InputEvent>;
  value?: string;
  readonly?: boolean;
  borderColor?: string;
  tip?: string;
}

export const QrInputter: Component<QrInputterProps> = (props) => {
  let input: HTMLInputElement | undefined;
  let hasUserInteracted: boolean = false;

  const handleInput: JSX.InputEventHandler<HTMLInputElement, InputEvent> = (
    e,
  ) => {
    hasUserInteracted = true;
    props.onInput?.(e);
  };

  const handleBlur: JSX.FocusEventHandler<HTMLInputElement, FocusEvent> = (
    _e,
  ) => {
    if (input) input.select();
  };

  onMount(() => {
    if (input) input.focus();
  });

  createEffect(() => {
    if (input && props.value && !hasUserInteracted) input.select();
  });

  return (
    <div class="relative">
      <div
        class="wrapper flex justify-center items-center h-6 px-2 border-2 border-solid border-border rounded-full animate-transform hover:scale-105 hover:border-accent focus-within:border-accent"
        style={{
          "border-color": props.borderColor,
        }}
      >
        <input
          class="w-full border-none outline-none bg-transparent text-text text-center"
          ref={input}
          value={props.value}
          onInput={handleInput}
          onBlur={handleBlur}
          readOnly={props.readonly}
        />
      </div>
      <Show when={props.tip}>
        <span class="absolute pt-0.5 flex items-center gap-1 text-red-500">
          <Icon
            icon={dangerIcon}
            width={16}
            height={16}
          />
          <span class="text-xs">{props.tip}</span>
        </span>
      </Show>
    </div>
  );
};
