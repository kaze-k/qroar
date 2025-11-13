import { Icon } from "@iconify-icon/solid";
import checkIcon from "@iconify-icons/line-md/check-all";
import loadingIcon from "@iconify-icons/svg-spinners/ring-resize";
import type { Component, JSX } from "solid-js";
import { Show } from "solid-js";

interface ButtonProps {
  children: JSX.Element;
  onClick?: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>;
  size: number;
  text?: string;
  loading?: boolean;
  checked?: boolean;
  disabled?: boolean;
}

export const Button: Component<ButtonProps> = (props) => {
  return (
    <button
      class="p-0 font-size-3 font-bold text-text text-center pointer-events-auto cursor-pointer line-height-none rounded-full glass-style transition-property-transform animate-transform btn-active-hover disabled:cursor-not-allowed disabled:opacity-60 disabled:transform-none disabled:transition-none"
      classList={{
        "pointer-events-none": props.loading || props.checked,
      }}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      <div
        class="flex justify-center items-center"
        classList={{
          "p-1": !Boolean(props.text),
          "p-2 gap-1": Boolean(props.text),
        }}
      >
        <Show
          when={props.checked || props.loading}
          fallback={props.children}
        >
          <Icon
            icon={props.loading ? loadingIcon : checkIcon}
            width={props.size}
            height={props.size}
            classList={{
              "text-green": props.checked,
            }}
          />
        </Show>

        <Show when={props.text}>
          <span class="will-change-transform">{props.text}</span>
        </Show>
      </div>
    </button>
  );
};
