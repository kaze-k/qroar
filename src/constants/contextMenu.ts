const contextMenuId = {
  SEPARATOR: "qroar-separator",
  IDENTIFY_IMAGE: "qroar-identify-image",
  GENERATE_IMAGE: "qroar-generate-image",
  GENERATE_SELECTION: "qroar-generate-selection",
  GENERATE_PAGE: "qroar-generate-page",
  GENERATE_LINK: "qroar-generate-link",
} as const satisfies Record<string, string>;

export const contextMenu = {
  id: contextMenuId,
};
