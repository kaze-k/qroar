import { Icon } from "@iconify-icon/solid";
import type { Component } from "solid-js";
import { For, Show } from "solid-js";
import type { RowData } from "#/components";
import { FadeTransitionGroup } from "@/transitions";

const KEYFRAME_ANIMATION_OPTIONS: KeyframeAnimationOptions = {
  duration: 500,
};

interface RowProps {
  title?: string;
  data?: RowData[];
}

export const Row: Component<RowProps> = (props) => {
  return (
    <div class="flex flex-col gap-1">
      <span class="px-2 text-gray-400">{props.title}</span>
      <div class="flex flex-col rounded-3xl bg-light-7/50 dark:bg-dark-1/50">
        <For each={props.data}>
          {(item) => (
            <FadeTransitionGroup
              enterKeyframeAnimationOptions={KEYFRAME_ANIMATION_OPTIONS}
              exitKeyframeAnimationOptions={KEYFRAME_ANIMATION_OPTIONS}
            >
              <Show when={item.visible?.()}>
                <span class="py-2 mx-4 w-auto flex items-center justify-between border-b-divider not-last:border-b-1 not-last:border-b-solid">
                  <span class="inline-flex items-center gap-2">
                    <span
                      class="p-0.5 size-4 flex rounded-md row-icon"
                      style={`color: ${item.iconColor}`}
                    >
                      <Icon
                        icon={item.icon}
                        width={16}
                        height={16}
                      />
                    </span>
                    {item.text}
                  </span>
                  {item.children}
                </span>
              </Show>
            </FadeTransitionGroup>
          )}
        </For>
      </div>
    </div>
  );
};
