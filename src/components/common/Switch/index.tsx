import type { Component, JSX } from "solid-js";
import { createMemo, createSignal } from "solid-js";

interface SwitchProps {
  checked?: boolean | (() => boolean);
  toggle?: (next: boolean) => void;
  disabled?: boolean;
}

export const Switch: Component<SwitchProps> = (props) => {
  const [internalChecked, setInternalChecked] = createSignal<boolean>(false);
  const isControlled = (): boolean => typeof props.checked !== "undefined";

  const checked = createMemo((): boolean | undefined =>
    isControlled()
      ? typeof props.checked === "function"
        ? props.checked()
        : props.checked
      : internalChecked(),
  );

  const handleChange: JSX.EventHandlerUnion<
    HTMLButtonElement,
    MouseEvent
  > = () => {
    const next = !checked();
    if (isControlled()) {
      props.toggle?.(next);
    } else {
      setInternalChecked<boolean>(next);
      props.toggle?.(next);
    }
  };

  return (
    <button
      class="group inline-flex items-center rounded-full p-0 m-0 border-0 outline-none bg-transparent cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
      role="switch"
      aria-checked={checked()}
      onclick={handleChange}
      disabled={props.disabled}
    >
      <span
        class="relative inline-flex items-center w-10 h-6 rounded-full transition-switch"
        classList={{
          "shadow-primary bg-primary": checked(),
          "shadow-none bg-gray-300 dark:bg-white/50": !checked(),
        }}
      >
        <span
          class="absolute w-5 h-5 bg-white rounded-full transition-all duration-500 ease-in-out"
          classList={{
            "shadow-check translate-x--100% transform-left-95%": checked(),
            "shadow-uncheck translate-x-0 transform-left-5%": !checked(),
            "group-active:switch-active-hover group-hover:switch-active-hover":
              !props.disabled,
          }}
        />
      </span>
    </button>
  );
};
