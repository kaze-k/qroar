import { Icon } from "@iconify-icon/solid";
import addSelectionIcon from "@iconify-icons/iconoir/add-selection";
import trashIcon from "@iconify-icons/solar/trash-bin-minimalistic-linear";
import loadingIcon from "@iconify-icons/svg-spinners/12-dots-scale-rotate";
import type { Component, JSX } from "solid-js";
import { createEffect, createSignal, Show } from "solid-js";
import { locale } from "@/constants";
import { getAverageColor, i18n, notify } from "@/utils";

interface QrImagePickerProps {
  src?: string;
  loading?: boolean;
  onFileChange?: JSX.ChangeEventHandlerUnion<HTMLInputElement, Event>;
  onClear?: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>;
}

export const QrImagePicker: Component<QrImagePickerProps> = (props) => {
  let input: HTMLInputElement | undefined;

  const [src, setSrc] = createSignal<string>("");
  const [color, setColor] = createSignal<string>("transparent");

  const handleClick: JSX.EventHandlerUnion<
    HTMLButtonElement,
    MouseEvent
  > = () => {
    if (input) input.click();
  };

  createEffect(async () => {
    try {
      if (props.src) {
        const color = await getAverageColor(props.src);
        setColor<string>(color);
        setSrc<string>(props.src);
      } else {
        setColor<string>("transparent");
        setSrc<string>("");
      }
    } catch (error) {
      console.error(error);

      if (error instanceof Error)
        notify(i18n(locale.notify.ERROR), error.message);
    }
  });

  return (
    <div class="group relative size-64 flex justify-center items-center box-border rounded-3xl glass-style animate-transform hover:scale-105">
      <Show when={!src() && !props.loading}>
        <input
          ref={input}
          type="file"
          accept="image/*"
          hidden
          onchange={props.onFileChange}
        />
        <button
          class="w-full h-full color-gray border-none bg-transparent cursor-pointer"
          onClick={handleClick}
        >
          <Icon
            icon={addSelectionIcon}
            width={128}
            height={128}
          />
        </button>
      </Show>

      <Show when={src() && !props.loading}>
        <button
          class="absolute inset-0 color-red bg-transparent outline-none border-none cursor-pointer hidden backdrop-blur-sm rounded-3xl group-hover:block"
          onclick={props.onClear}
        >
          <Icon
            icon={trashIcon}
            width={128}
            height={128}
          />
        </button>
      </Show>

      <Show when={props.loading}>
        <div class="flex justify-center items-center color-secondary absolute inset-0 bg-transparent backdrop-blur-md rounded-3xl">
          <Icon
            icon={loadingIcon}
            width={128}
            height={128}
          />
        </div>
      </Show>

      <Show when={src()}>
        <img
          class="w-full h-full object-contain rounded-3xl"
          style={{ "background-color": color() }}
          src={src()}
        />
      </Show>
    </div>
  );
};
