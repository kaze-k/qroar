import { MemoryRouter } from "@solidjs/router";
import { useSyncStates, useTheme } from "@/hooks";
import { popupRoutes } from "@/routes";

function View() {
  useTheme();
  useSyncStates();

  return <MemoryRouter>{popupRoutes}</MemoryRouter>;
}

export default View;
