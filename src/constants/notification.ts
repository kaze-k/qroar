const notificationsId = {
  UPDATE: "update",
  DOWNLOAD: "download",
} as const satisfies Record<string, string>;

export const notification = {
  id: notificationsId,
};
