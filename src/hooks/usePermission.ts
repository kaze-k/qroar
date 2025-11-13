import type { Accessor } from "solid-js";
import { onMount } from "solid-js";
import type { PermissionType } from "#/constants";
import { useAppRuntime, useAppRuntimeActions } from "@/stores";

interface PermissionState {
  permission: Accessor<PermissionType>;
}

const { setPermission } = useAppRuntimeActions();

export function usePermission(): PermissionState {
  const { permission } = useAppRuntime();

  onMount(() => {
    navigator.permissions.query({ name: "camera" }).then((status) => {
      setPermission(status.state);
      status.addEventListener("change", () => {
        setPermission(status.state);
      });
    });
  });

  return { permission };
}
