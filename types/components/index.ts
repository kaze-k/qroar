import type { IconifyIcon } from "@iconify-icon/solid";
import type { JSX } from "solid-js";

export interface SelectorItem {
  icon?: JSX.Element;
  text: string;
  onClick: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>;
}

export interface RowData {
  icon: IconifyIcon;
  iconColor?: string;
  text?: string;
  children?: JSX.Element;
  visible?: () => boolean;
}

export interface Option {
  label: string;
  value: string;
  disabled?: boolean;
}
