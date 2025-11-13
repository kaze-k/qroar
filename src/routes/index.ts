import type { RouteDefinition } from "@solidjs/router";
import { useNavigate } from "@solidjs/router";
import { lazy } from "solid-js";
import type { Path } from "#/constants";
import { path } from "@/constants";
import { Layout } from "@/layouts";
import { FireFoxPopupLayout } from "@/layouts/FirefoxPopupLayout";

const redirect = (to: Path) => {
  const navigate = useNavigate();
  navigate(to, { replace: true });
};

export const optionsRoutes: RouteDefinition[] = [
  {
    path: path.ROOT,
    children: [
      {
        path: path.ROOT,
        preload: () => redirect(path.SETUP),
      },
      {
        path: path.SETUP,
        component: lazy(() => import("@/pages/Qrsetup")),
      },
      {
        path: path.OTHER,
        preload: () => redirect(path.SETUP),
      },
    ],
  },
];

export const panelRoutes: RouteDefinition[] = [
  {
    path: path.ROOT,
    component: Layout,
    children: [
      {
        path: path.ROOT,
        preload: () => redirect(path.QRCODE),
      },
      {
        path: path.QRCODE,
        component: lazy(() => import("@/pages/Qrpanel")),
      },
      {
        path: path.SETUP,
        component: lazy(() => import("@/pages/Qrsetup")),
      },
      {
        path: path.OTHER,
        preload: () => redirect(path.QRCODE),
      },
    ],
  },
];

export const popupRoutes: RouteDefinition[] = [
  {
    path: path.ROOT,
    component: __TARGET__ === "firefox" ? FireFoxPopupLayout : Layout,
    children: [
      {
        path: path.ROOT,
        preload: () => redirect(path.QRCODE),
      },
      {
        path: path.QRCODE,
        component: lazy(() => import("@/pages/Qrcode")),
      },
      {
        path: path.SETUP,
        component: lazy(() => import("@/pages/Qrsetup")),
      },
      {
        path: path.OTHER,
        preload: () => redirect(path.QRCODE),
      },
    ],
  },
];
