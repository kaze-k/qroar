import { MemoryRouter } from "@solidjs/router";
import { useSyncStates, useTheme } from "@/hooks";
import { optionsRoutes } from "@/routes";

function View() {
  useTheme();
  useSyncStates();

  return <MemoryRouter>{optionsRoutes}</MemoryRouter>;
}

export default View;
