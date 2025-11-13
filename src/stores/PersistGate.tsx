import type { Component, JSX } from "solid-js";
import { createResource, Show, Suspense } from "solid-js";

interface PersistGateProps {
  init: (string | Promise<string> | null)[];
  fallback: JSX.Element;
  children: JSX.Element;
}

export const PersistGate: Component<PersistGateProps> = (
  props: PersistGateProps,
) => {
  const [ready] = createResource(
    async () => {
      const tasks = props.init
        .map((v) => (v instanceof Promise ? Promise.resolve(v) : null))
        .filter((p) => p !== null);
      await Promise.all(tasks);
      return true;
    },
    { initialValue: false },
  );

  return (
    <Suspense fallback={props.fallback}>
      <Show when={ready()}>{props.children}</Show>
    </Suspense>
  );
};
