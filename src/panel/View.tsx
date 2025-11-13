import { MemoryRouter } from "@solidjs/router";
import { createSignal, onCleanup, onMount, Show } from "solid-js";
import { QrSizeLimitPage } from "@/components/qrcode/Pager";
import { useSyncStates, useTheme } from "@/hooks";
import { panelRoutes } from "@/routes";

const MIN_WINDOW_SIZE = 360;

function View() {
  useTheme();
  useSyncStates();

  const [visible, setVisible] = createSignal<boolean>(true);

  const handleResize = (): void => {
    if (
      window.innerWidth < MIN_WINDOW_SIZE ||
      window.innerHeight < MIN_WINDOW_SIZE
    )
      setVisible<boolean>(false);
    else setVisible<boolean>(true);
  };

  onMount(() => {
    window.addEventListener("resize", handleResize);

    onCleanup(() => {
      window.removeEventListener("resize", handleResize);
    });
  });

  return (
    <Show
      when={visible()}
      fallback={<QrSizeLimitPage />}
    >
      <MemoryRouter>{panelRoutes}</MemoryRouter>
    </Show>
  );
}

export default View;
