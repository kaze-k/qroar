import type { Component, JSX } from "solid-js";
import { createMemo, createSignal, For } from "solid-js";
import type { SelectorItem } from "#/components";

interface QrSelectorProps {
  items: SelectorItem[];
  initialItem?: SelectorItem;
  item?: SelectorItem;
}

export const QrSelector: Component<QrSelectorProps> = (props) => {
  const [activeIndex, setActiveIndex] = createSignal<number>(
    props.items.indexOf(props.initialItem ?? props.items[0]),
  );
  const index = createMemo((): number => {
    if (props.item) return props.items.indexOf(props.item);
    return -1;
  });

  const handleClick = (
    e: Parameters<JSX.EventHandler<HTMLButtonElement, MouseEvent>>[0],
    index: number,
    callback: SelectorItem["onClick"],
  ): void => {
    if (typeof callback === "function") callback(e);

    if (Array.isArray(callback)) callback[0](...callback.slice(1));

    setActiveIndex<number>(index);
  };

  return (
    <div class="relative flex justify-center items-center pointer-events-auto rounded-full glass-style animate-transform hover:scale-105">
      <div
        class="relative grid items-center m-1 w-full"
        style={{
          "grid-template-columns": `repeat(${props.items.length}, 1fr)`,
        }}
      >
        <div
          class="absolute min-w-70px h-8 z-0 bg-primary opacity-20 rounded-full transform-gpu transition-all ease-in-out duration-500"
          classList={{
            hidden: index() === -1,
          }}
          style={{
            width: `calc(100% / ${props.items.length})`,
            transform: `translateX(calc(${index() === -1 ? activeIndex() : index()} * 100%))`,
          }}
        />
        <For each={props.items}>
          {(item, idx) => (
            <button
              class="min-w-70px h-8 z-1 outline-none border-none text-text bg-transparent cursor-pointer"
              onclick={(e) => handleClick(e, idx(), item.onClick)}
            >
              <span class="px-1 gap-1 flex justify-center items-center">
                {item.icon}
                <span class="line-height-none font-bold font-size-3 will-change-transform">
                  {item.text}
                </span>
              </span>
            </button>
          )}
        </For>
      </div>
    </div>
  );
};
