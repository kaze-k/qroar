import { Icon } from "@iconify-icon/solid";
import searchIcon from "@iconify-icons/material-symbols/search-rounded";
import copyIcon from "@iconify-icons/solar/copy-bold-duotone";
import type { Component, JSX } from "solid-js";
import { onMount } from "solid-js";
import { isURL } from "validator";
import Browser from "webextension-polyfill";
import { Button } from "@/components/common/Button";
import { locale } from "@/constants";
import { i18n, notify } from "@/utils";

interface QrResultCardProps {
  text?: string;
  ref?: (el: HTMLElement) => void;
  onClose?: () => void;
}

export const QrResultCard: Component<QrResultCardProps> = (props) => {
  let el: HTMLDivElement | undefined;

  const handleSearch: JSX.EventHandlerUnion<
    HTMLButtonElement,
    MouseEvent
  > = async () => {
    const text = props.text;
    if (!text) return;

    try {
      if (isURL(text)) {
        window.open(text, "_blank");
        return;
      }

      await Browser.search.query({
        text: text,
        disposition: "NEW_TAB",
      });
    } catch (error) {
      console.error(error);

      if (error instanceof Error)
        notify(i18n(locale.notify.ERROR), error.message);
    } finally {
      props.onClose?.();
    }
  };

  const handleCopy: JSX.EventHandlerUnion<
    HTMLButtonElement,
    MouseEvent
  > = async () => {
    const text = props.text;
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error(error);

      if (error instanceof Error)
        notify(i18n(locale.notify.ERROR), error.message);
    } finally {
      props.onClose?.();
    }
  };

  onMount(() => {
    if (el && props.ref) props.ref(el);
  });

  return (
    <div
      ref={el}
      class="fixed bottom-4 w-full h-50% z-1 flex justify-center items-center"
    >
      <div class="relative w-full max-w-xl h-full p-4 mx-8 box-border flex flex-col rounded-3xl glass-style">
        <header class="text-center border-b-1 border-b-solid border-b-border flex-shrink-0">
          <div class="font-size-4 text-text mb-4">
            {i18n(locale.title.IDENTIFY_RESULT)}
          </div>
        </header>

        <main class="flex-1 py-4 overflow-auto scrollbar-gutter-stable-both-edges hover:scrollbar-hover">
          <span class="text-text break-all line-height-normal">
            {props.text}
          </span>
        </main>

        <footer class="w-full py-4 flex justify-around items-center flex-shrink-0">
          <Button
            size={24}
            text={i18n(locale.button.SEARCH_WEB)}
            onClick={handleSearch}
          >
            <Icon
              icon={searchIcon}
              width={24}
              height={24}
            />
          </Button>

          <Button
            size={24}
            text={i18n(locale.button.COPY_RESULT)}
            onClick={handleCopy}
          >
            <Icon
              icon={copyIcon}
              width={24}
              height={24}
            />
          </Button>
        </footer>
      </div>
    </div>
  );
};
