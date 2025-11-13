import { createRenderEffect, onCleanup, onMount } from "solid-js";
import { useAppTheme, useAppThemeActions } from "@/stores";

const { setDarkTheme } = useAppThemeActions();

const listener = (e: MediaQueryListEvent): void => {
  setDarkTheme(e.matches);
  document.documentElement.setAttribute(
    "data-theme",
    e.matches ? "dark" : "light",
  );
};

export function useTheme(): void {
  const { auto, dark } = useAppTheme();

  const queryDark = window.matchMedia("(prefers-color-scheme: dark)");

  onMount(() => {
    if (auto()) {
      queryDark.addEventListener("change", listener);
    }

    if (auto() && queryDark.matches && !dark()) {
      setDarkTheme(queryDark.matches);
    }

    document.documentElement.setAttribute(
      "data-theme",
      (auto() ? queryDark.matches : dark()) ? "dark" : "light",
    );
  });

  onCleanup(() => queryDark.removeEventListener("change", listener));

  createRenderEffect(() => {
    if (auto()) {
      document.documentElement.setAttribute(
        "data-theme",
        queryDark.matches ? "dark" : "light",
      );
      queryDark.addEventListener("change", listener);
      onCleanup((): void => queryDark.removeEventListener("change", listener));
    } else {
      document.documentElement.setAttribute(
        "data-theme",
        dark() ? "dark" : "light",
      );
    }
  });
}
