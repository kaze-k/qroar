import syncIcon from "@iconify-icons/iconoir/cloud-sync";
import codeScanIcon from "@iconify-icons/solar/code-scan-bold-duotone";
import galleryIcon from "@iconify-icons/solar/gallery-round-bold-duotone";
import linkIcon from "@iconify-icons/solar/link-round-bold-duotone";
import moonIcon from "@iconify-icons/solar/moon-bold-duotone";
import mouseIcon from "@iconify-icons/solar/mouse-bold-duotone";
import scannerIcon from "@iconify-icons/solar/scanner-line-duotone";
import settingsIcon from "@iconify-icons/solar/settings-bold-duotone";
import textSelectionIcon from "@iconify-icons/solar/text-selection-bold-duotone";
import windowFrameIcon from "@iconify-icons/solar/window-frame-line-duotone";
import { createMemo } from "solid-js";
import type { RowData } from "#/components";
import { Row } from "@/components/common/Row";
import { Switch } from "@/components/common/Switch";
import { QrResetButton } from "@/components/qrcode/Buttons";
import { QrAppCard } from "@/components/qrcode/Cards";
import { locale } from "@/constants";
import {
  useAppContextMenuActions,
  useAppSettingsActions,
  useAppStore,
  useAppSyncActions,
  useAppThemeActions,
} from "@/stores";
import { i18n } from "@/utils";

const { setGenCurrentCode } = useAppSettingsActions();
const { setTheme } = useAppThemeActions();
const {
  setEnable,
  setIdentifyImageQrcode,
  setGenerateImageQrcode,
  setGenerateSelectionQrcode,
  setGeneratePageQrcode,
  setGenerateLinkQrcode,
  getEnable,
} = useAppContextMenuActions();
const { toggleSync } = useAppSyncActions();

function Qrsetup() {
  const { settings, theme, contextMenu, sync } = useAppStore();
  const { genCurrentCode } = settings;
  const { auto, dark } = theme;
  const {
    identifyImageQrcode,
    generateImageQrcode,
    generateSelectionQrcode,
    generatePageQrcode,
    generateLinkQrcode,
  } = contextMenu;

  const enable = createMemo<boolean>(getEnable);

  const toggleDarkTheme = (next: boolean): void => {
    if (next) {
      setTheme({
        auto: false,
        dark: true,
      });
    } else {
      setTheme({
        auto: false,
        dark: false,
      });
    }
  };

  const toggleAutoTheme = (next: boolean): void => {
    if (next) {
      setTheme({
        auto: true,
        dark: window.matchMedia("(prefers-color-scheme: dark)").matches,
      });
    } else {
      setTheme({
        auto: false,
      });
    }
  };

  const openedData: RowData[] = [
    {
      icon: codeScanIcon,
      iconColor: "lightseagreen",
      text: i18n(locale.opened.GENERATE_CURRENT_PAGE_QRCODE),
      children: (
        <Switch
          checked={genCurrentCode()}
          toggle={setGenCurrentCode}
        />
      ),
      visible: () => true,
    },
  ];

  const contextMenusData: RowData[] = [
    {
      icon: mouseIcon,
      iconColor: "green",
      text: i18n(locale.contextMenu.ADD_MENU),
      children: (
        <Switch
          checked={enable}
          toggle={setEnable}
        />
      ),
      visible: () => true,
    },
    {
      icon: scannerIcon,
      iconColor: "cyan",
      text: i18n(locale.contextMenu.IDENTIFY_IMAGE_QRCODE),
      children: (
        <Switch
          checked={identifyImageQrcode}
          toggle={setIdentifyImageQrcode}
        />
      ),
      visible: enable,
    },
    {
      icon: galleryIcon,
      iconColor: "orange",
      text: i18n(locale.contextMenu.GENERATE_IMAGE_QRCODE),
      children: (
        <Switch
          checked={generateImageQrcode}
          toggle={setGenerateImageQrcode}
        />
      ),
      visible: enable,
    },
    {
      icon: textSelectionIcon,
      iconColor: "red",
      text: i18n(locale.contextMenu.GENERATE_SELECTION_QRCODE),
      children: (
        <Switch
          checked={generateSelectionQrcode}
          toggle={setGenerateSelectionQrcode}
        />
      ),
      visible: enable,
    },
    {
      icon: windowFrameIcon,
      iconColor: "tomato",
      text: i18n(locale.contextMenu.GENERATE_PAGE_QRCODE),
      children: (
        <Switch
          checked={generatePageQrcode}
          toggle={setGeneratePageQrcode}
        />
      ),
      visible: enable,
    },
    {
      icon: linkIcon,
      iconColor: "deepskyblue",
      text: i18n(locale.contextMenu.GENERATE_LINK_QRCODE),
      children: (
        <Switch
          checked={generateLinkQrcode}
          toggle={setGenerateLinkQrcode}
        />
      ),
      visible: enable,
    },
  ];

  const themeData: RowData[] = [
    {
      icon: settingsIcon,
      text: i18n(locale.appearance.FOLLOW_SYSTEM),
      children: (
        <Switch
          checked={auto}
          toggle={toggleAutoTheme}
        />
      ),
      visible: () => true,
    },
    {
      icon: moonIcon,
      text: i18n(locale.appearance.DARKMODE),
      children: (
        <Switch
          checked={dark}
          toggle={toggleDarkTheme}
        />
      ),
      visible: () => true,
    },
  ];

  const syncData: RowData[] = [
    {
      icon: syncIcon,
      text: i18n(locale.synchronization.SYNC),
      children: (
        <Switch
          checked={sync}
          toggle={toggleSync}
        />
      ),
      visible: () => true,
    },
  ];

  return (
    <main class="max-w-3xl w-full h-full overflow-auto scrollbar-none bg-bg">
      <div class="px-4 pb-10 pt-16 flex flex-col gap-6">
        <QrAppCard />

        <Row
          title={i18n(locale.opened.TITLE)}
          data={openedData}
        />

        <Row
          title={i18n(locale.contextMenu.TITLE)}
          data={contextMenusData}
        />
        <Row
          title={i18n(locale.appearance.TITLE)}
          data={themeData}
        />
        <Row
          title={i18n(locale.synchronization.TITLE)}
          data={syncData}
        />

        <QrResetButton />
      </div>
    </main>
  );
}

export default Qrsetup;
