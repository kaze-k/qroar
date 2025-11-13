import type { Component } from "solid-js";

interface LinkProps {
  href?: string;
  children: string | string[];
}

export const Link: Component<LinkProps> = (props) => {
  return (
    <a
      class="group px-2 pb-1 relative inline-block font-bold text-inherit no-underline"
      href={props.href}
      target="_blank"
      rel="noopener noreferrer"
      draggable={false}
    >
      <span class="relative inline-block text-transparent bg-clip-text gradient group-hover:animate-spread">
        {props.children}
      </span>
      <span class="absolute left-50% bottom-0 -translate-x-50% w-0 h-1 rounded-full gradient transition-property-width duration-500 ease-in-out group-hover:w-full group-hover:animate-spread" />
    </a>
  );
};
