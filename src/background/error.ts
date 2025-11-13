import Browser from "webextension-polyfill";
import { locale } from "@/constants";
import { notifications } from "./notifications";

export const fallback = (error: unknown): void => {
  if (error instanceof Error)
    notifications.creator.basicNotice(
      Browser.i18n.getMessage(locale.notify.ERROR),
      error.message,
    );

  console.error(error);
};

export const errorHandler = (callback: () => void | Promise<void>): void => {
  try {
    const result = callback();
    if (result instanceof Promise) result.catch(fallback);
  } catch (error) {
    fallback(error);
  }
};
