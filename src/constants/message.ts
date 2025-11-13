const messageType = {
  GET_SELECTION_TEXT: "get-selection-text",
  GET_PAGE_URL: "get-page-url",
  GET_LINK_URL: "get-link-url",
  GET_SRC_URL: "get-src-url",
  GET_SRC_TEXT: "get-src-text",
} as const satisfies Record<string, string>;

const sendType = {
  GENERATE: "generate",
  IDENTIFY: "identify",
} as const satisfies Record<string, string>;

export const message = {
  type: messageType,
  sendType: sendType,
};
