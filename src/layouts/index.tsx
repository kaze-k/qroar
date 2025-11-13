import type { RouteSectionProps } from "@solidjs/router";
import { useLocation } from "@solidjs/router";
import type { Component } from "solid-js";
import { createMemo } from "solid-js";
import type { Path } from "#/constants";
import { path } from "@/constants";
import { SlideRouteTransition } from "@/transitions";
import { Footer } from "./Footer";
import { Header } from "./Header";

const CLASSLIST = ["shadow-shadow", "absolute", "pointer-events-none"];
const KEYFRAME_ANIMATION_OPTIONS: KeyframeAnimationOptions = {
  duration: 600,
  easing: "ease-in-out",
};

export const Layout: Component<RouteSectionProps> = (props) => {
  const location = useLocation<Path>();
  const pathname = createMemo((): Path => location.pathname as Path);

  return (
    <>
      <Header />
      <SlideRouteTransition
        classList={CLASSLIST}
        keyframeAnimationOptions={KEYFRAME_ANIMATION_OPTIONS}
        shouldTransition={pathname() === path.SETUP}
      >
        {props.children}
      </SlideRouteTransition>
      <Footer />
    </>
  );
};
