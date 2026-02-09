// github: https://github.com/conventional-changelog/commitlint
// options: https://commitlint.js.org/reference/configuration.html
import type { UserConfig } from "@commitlint/types";

export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "docs",
        "style",
        "refactor",
        "perf",
        "ci",
        "test",
        "chore",
        "revert",
        "merge",
        "build",
        "WIP",
      ],
    ],
  },
} satisfies UserConfig;
