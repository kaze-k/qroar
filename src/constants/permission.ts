export const permissionType = {
  GRANTED: "granted",
  DENIED: "denied",
  PROMPT: "prompt",
} as const satisfies Record<string, string>;
