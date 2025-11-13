import { Icon } from "@iconify-icon/solid";
import leftIcon from "@iconify-icons/solar/alt-arrow-left-outline";
import { throttle } from "radash";
import type { Component, JSX } from "solid-js";
import {
  createEffect,
  createMemo,
  createSignal,
  For,
  onCleanup,
  Show,
} from "solid-js";
import type { Option } from "#/components";
import { FloatYTransition } from "@/transitions";

const KEYFRAME_ANIMATION_OPTIONS = {
  duration: 350,
  easing: "ease-in-out",
};

interface SelectProps {
  options: Option[];
  placeholder: string;
  defaultOption?: Option;
  onChange?: (value: string) => void;
}

export const Select: Component<SelectProps> = (props) => {
  let triggerRef: HTMLDivElement | undefined;
  let dropdownRef: HTMLDivElement | undefined;
  let hoverRef: HTMLDivElement | undefined;

  const [open, setOpen] = createSignal<boolean>(false);
  const [selected, setSelected] = createSignal<Option | undefined>(
    props.defaultOption,
  );
  const [activeIndex, setActiveIndex] = createSignal<number | undefined>();
  const [openUp, setOpenUp] = createSignal<boolean>(false);
  const [hoverTop, setHoverTop] = createSignal<number | undefined>();

  const options = createMemo((): Option[] =>
    props.options.length > 0
      ? props.options
      : [
          {
            label: props.placeholder,
            value: "",
            disabled: true,
          },
        ],
  );

  const throttleSetOpen = throttle(
    {
      interval: KEYFRAME_ANIMATION_OPTIONS.duration,
    },
    setOpen<boolean>,
  );

  const toggleOpen: JSX.EventHandlerUnion<HTMLDivElement, MouseEvent> = (
    _e,
  ) => {
    if (!open()) adjustDropdownPosition();
    throttleSetOpen(!open());
  };

  const selectOption = (e: MouseEvent, option: Option, index: number): void => {
    if (option.disabled) return;
    setSelected<Option>(option);
    setActiveIndex<number>(index);
    props.onChange?.(option.value);
    updateHoverPostion(e);
    throttleSetOpen(false);
  };

  const adjustDropdownPosition = (): void => {
    if (!triggerRef) return;
    const rect = triggerRef.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    queueMicrotask(() => {
      let dropdownHeight = dropdownRef?.scrollHeight ?? 0;
      setOpenUp<boolean>(
        spaceBelow < dropdownHeight && spaceAbove > spaceBelow,
      );
    });
  };

  const updateHoverPostion = (e: MouseEvent): void => {
    const target = e.currentTarget as HTMLElement;
    const { offsetTop } = target;
    setHoverTop<number>(offsetTop);
  };

  const handleClickOutside = (e: MouseEvent): void => {
    if (
      !triggerRef?.contains(e.target as Node) &&
      !dropdownRef?.contains(e.target as Node)
    )
      throttleSetOpen(false);
  };

  const scrollSelectedIntoView = (): void => {
    if (!dropdownRef) return;
    const index = activeIndex();
    if (typeof index === "undefined") return;
    const el = dropdownRef.children[index] as HTMLElement;
    if (!el) return;

    el.scrollIntoView({ block: "center", behavior: "smooth" });
  };

  createEffect(() => {
    if (!props.defaultOption) return;
    setSelected<Option>(props.defaultOption);
    setActiveIndex<number>(props.options.indexOf(props.defaultOption));
  });

  createEffect(() => {
    if (open()) {
      scrollSelectedIntoView();

      document.addEventListener("click", handleClickOutside);
      window.addEventListener("resize", adjustDropdownPosition);
      window.addEventListener("scroll", adjustDropdownPosition, true);
    } else {
      document.removeEventListener("click", handleClickOutside);
      window.removeEventListener("resize", adjustDropdownPosition);
      window.removeEventListener("scroll", adjustDropdownPosition, true);
    }
    onCleanup(() => {
      document.removeEventListener("click", handleClickOutside);
      window.removeEventListener("resize", adjustDropdownPosition);
      window.removeEventListener("scroll", adjustDropdownPosition, true);
    });
  });

  return (
    <div class="relative w-full text-center text-text font-500 cursor-pointer">
      <div
        ref={triggerRef}
        onClick={toggleOpen}
        class="p-2 inline-block flex justify-between items-center rounded-full glass-style box-border transition-property-transform animate-transform hover:scale-105"
      >
        <span class="w-full px-2 text-nowrap">
          {selected()?.label || props.placeholder}
        </span>
        <Icon
          icon={leftIcon}
          width={16}
          height={16}
          class="transition-transform"
          classList={{
            "rotate--90": open() && !openUp(),
            "rotate-90": open() && openUp(),
          }}
        />
      </div>

      <FloatYTransition
        enterKeyframeAnimationOptions={KEYFRAME_ANIMATION_OPTIONS}
        exitKeyframeAnimationOptions={KEYFRAME_ANIMATION_OPTIONS}
        reverse={openUp()}
      >
        <Show when={open()}>
          <div
            ref={dropdownRef}
            class="absolute left-0 w-full max-h-61 p-1 rounded-3xl glass-style overflow-auto box-border scrollbar-none"
            classList={{
              "bottom-full mb-2": openUp(),
              "top-full mt-2": !openUp(),
            }}
          >
            <Show when={typeof activeIndex() !== "undefined"}>
              <div
                ref={hoverRef}
                class="absolute left-0 right-0 h-5 mx-1 px-3 py-2 z-0 bg-primary opacity-20 rounded-full transition-property-top duration-150 ease-in-out"
                style={{
                  top: `${hoverTop()}px`,
                }}
              />
            </Show>

            <For each={options()}>
              {(option, idx) => (
                <div
                  class="h-5 px-3 py-2 z-1 cursor-pointer text-nowrap overflow-hidden text-ellipsis not-last:mb-1"
                  classList={{
                    "opacity-50 cursor-not-allowed": option.disabled,
                  }}
                  onClick={(e) => selectOption(e, option, idx())}
                >
                  {option.label}
                </div>
              )}
            </For>
          </div>
        </Show>
      </FloatYTransition>
    </div>
  );
};
