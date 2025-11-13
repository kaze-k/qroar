import {
  defineConfig,
  presetWind3,
  transformerDirectives,
  transformerVariantGroup,
} from "unocss";

export default defineConfig({
  shortcuts: [
    {
      "animate-transform":
        "duration-300 ease-in-out transform-gpu will-change-transform",

      "btn-active-hover":
        "hover:scale-115 active:scale-125 active:duration-100",

      "switch-active-hover":
        "opacity-80 backdrop-brightness-200 backdrop-contrast-200 backdrop-hue-rotate-1 backdrop-saturate-220 w-6",

      "glass-style":
        "shadow-shadow dark:shadow-none border border-solid border-white/20 bg-glass dark:bg-glass-dark backdrop-blur-6 backdrop-brightness-100 backdrop-contrast-100 backdrop-hue-rotate-1 backdrop-saturate-120 drop-shadow-sm",

      "row-icon":
        "shadow-shadow dark:shadow-none border-1 border-solid border-white/20 bg-bg",
    },
  ],
  rules: [
    [
      "bg-glass",
      {
        background: "rgba(255, 255, 255, 0.4)",
      },
    ],
    [
      "bg-glass-dark",
      {
        background: "rgba(111, 111, 111, 0.4)",
      },
    ],
    [
      "gradient",
      {
        "background-image":
          "linear-gradient(45deg, var(--color-secondary), var(--color-primary))",
      },
    ],
    [
      "rainbow-gradient",
      {
        "background-image": "radial-gradient(circle at center,#4bb8ff,#b84bff)",
      },
    ],
    [
      "scan-line-bg",
      {
        "background-image":
          "radial-gradient(circle at center, rgba(9, 255, 0, 0.3), transparent)",
      },
    ],
    [
      "shadow-primary",
      {
        "box-shadow": "var(--color-primary) 0 0 0 16px inset",
      },
    ],
    [
      "transition-switch",
      {
        transition: "box-shadow, background-color",
        "transition-timing-function": "cubic-bezier(0, 0, 0, 1)",
        "transition-duration": "1000ms",
      },
    ],
    ["scrollbar-none", { "scrollbar-width": "none" }],
    [
      /^transform-(left|right|top|bottom)-(\d+)%$/,
      ([, dir, d]) => ({ [dir]: `${d}%` }),
    ],
    [
      /^gradient-(\d+)$/,
      ([, d]) => ({
        background: `linear-gradient(${d}deg, var(--color-background), transparent)`,
      }),
    ],
    [
      "scrollbar-gutter-stable-both-edges",
      { "scrollbar-gutter": "stable both-edges" },
    ],
    [
      "scrollbar-hover",
      {
        "scrollbar-color": "var(--color-scrollbar) transparent",
      },
    ],
  ],
  theme: {
    colors: {
      primary: "var(--color-primary)",
      secondary: "var(--color-secondary)",
      accent: "var(--color-accent)",
      text: "var(--color-text)",
      bg: "var(--color-background)",
      border: "var(--color-border)",
      divider: "var(--color-divider)",
      srollbar: "var(--color-scrollbar)",
    },
    boxShadow: {
      none: "rgba(0, 0, 0, 0)",
      shadow:
        "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
      uncheck: "2px 0px 2px 1px rgba(10, 10, 10, 0.1)",
      check: "-2px 0px 2px 1px rgba(10, 10, 10, 0.1)",
    },
    animation: {
      keyframes: {
        spread: `{
          0%, 100% { background-size: 100% 100%; background-position: 0% 0%; }
          50% { background-size: 200% 200%; background-position: 100% 50%; }
          75% { background-size: 200% 200%; background-position: 50% 100%; }
        }`,
        ripple: `{
          0%, 100% { background-position: 0% 50%; background-size: 150% 100%; }
          50% { background-position: 100% 50%; background-size: 150% 100%; }
        }`,
        scan: `{
          0% { transform: translateY(-100px) }
          100% { transform: translateY(100px) }
        }`,
      },
      durations: {
        spread: "3s",
        ripple: "4s",
        scan: "2s",
      },
      timingFns: {
        spread: "ease",
        ripple: "ease-in-out",
        scan: "linear",
      },
      counts: {
        spread: "infinite",
        ripple: "infinite",
        scan: "infinite",
      },
      properties: {
        spread: { "background-repeat": "no-repeat" },
        rippleLeftRight: {
          "background-repeat": "no-repeat",
          "background-size": "150% 100%",
        },
      },
    },
  },
  presets: [
    presetWind3({
      dark: {
        light: "[data-theme=light]",
        dark: "[data-theme=dark]",
      },
      preflight: "on-demand",
      variablePrefix: "qr-",
    }),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
});
