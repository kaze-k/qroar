import type { DeepSpread } from "@solid-primitives/destructure";
import { destructure } from "@solid-primitives/destructure";
import { createStore } from "solid-js/store";
import type { PermissionType } from "#/constants";
import type { AppRuntimeActions, AppRuntimeStore } from "#/stores";
import { permissionType } from "@/constants";

const store: AppRuntimeStore = {
  text: "",
  identify: false,
  result: "",
  url: "",
  error: false,
  executed: false,
  scan: false,
  permission: permissionType.PROMPT,
};

const [runtime, setRuntime] = createStore<AppRuntimeStore>(
  structuredClone(store),
);

const actions: AppRuntimeActions = {
  setText: (value: string): void => setRuntime("text", value),

  setIdentify: (value: boolean): void => setRuntime("identify", value),

  setResult: (value: string): void => setRuntime("result", value),

  setObjectUrl: (value: Blob | MediaSource): void =>
    setRuntime("url", (old) => {
      if (old) URL.revokeObjectURL(old);
      return URL.createObjectURL(value);
    }),

  clearObjectUrl: (): void =>
    setRuntime("url", (old) => {
      URL.revokeObjectURL(old);
      return "";
    }),

  setError: (value: boolean): void => setRuntime("error", value),

  setExecuted: (): void => setRuntime("executed", true),

  setScan: (value: boolean): void => setRuntime("scan", value),

  setPermission: (value: PermissionType): void =>
    setRuntime("permission", value),
};

export const createAppRuntimeStore = (): DeepSpread<AppRuntimeStore> =>
  destructure(runtime, { deep: true });
export const createAppRuntimeActions = (): AppRuntimeActions => actions;
