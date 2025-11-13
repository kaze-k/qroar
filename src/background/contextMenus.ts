import Browser from "webextension-polyfill";
import type { ContextMenuId } from "#/constants";
import type { AppContextMenuStore } from "#/stores";
import { contextMenu, locale } from "@/constants";

class Menus {
  private static readonly orders: ContextMenuId[] = [
    contextMenu.id.IDENTIFY_IMAGE,
    contextMenu.id.SEPARATOR,
    contextMenu.id.GENERATE_IMAGE,
    contextMenu.id.GENERATE_SELECTION,
    contextMenu.id.GENERATE_PAGE,
    contextMenu.id.GENERATE_LINK,
  ] as const;

  private static readonly tranformMap: Record<
    keyof AppContextMenuStore,
    ContextMenuId
  > = {
    identifyImageQrcode: contextMenu.id.IDENTIFY_IMAGE,
    generateImageQrcode: contextMenu.id.GENERATE_IMAGE,
    generateSelectionQrcode: contextMenu.id.GENERATE_SELECTION,
    generatePageQrcode: contextMenu.id.GENERATE_PAGE,
    generateLinkQrcode: contextMenu.id.GENERATE_LINK,
  } as const;

  private static readonly orderMap = Object.fromEntries(
    Menus.orders.map((id, i) => [id, i]),
  ) as Record<ContextMenuId, number>;

  private static readonly menuConfigs: Record<
    ContextMenuId,
    Browser.Menus.CreateCreatePropertiesType
  > = {
    [contextMenu.id.IDENTIFY_IMAGE]: {
      id: contextMenu.id.IDENTIFY_IMAGE,
      title: Browser.i18n.getMessage(locale.contextMenu.IDENTIFY_IMAGE_QRCODE),
      contexts: ["image"],
    },
    [contextMenu.id.SEPARATOR]: {
      id: contextMenu.id.SEPARATOR,
      type: "separator",
      contexts: ["image"],
    },
    [contextMenu.id.GENERATE_IMAGE]: {
      id: contextMenu.id.GENERATE_IMAGE,
      title: Browser.i18n.getMessage(locale.contextMenu.GENERATE_IMAGE_QRCODE),
      contexts: ["image"],
      targetUrlPatterns: ["http://*/*", "https://*/*"],
    },
    [contextMenu.id.GENERATE_SELECTION]: {
      id: contextMenu.id.GENERATE_SELECTION,
      title: Browser.i18n.getMessage(
        locale.contextMenu.GENERATE_SELECTION_QRCODE,
      ),
      contexts: ["selection"],
    },
    [contextMenu.id.GENERATE_PAGE]: {
      id: contextMenu.id.GENERATE_PAGE,
      title: Browser.i18n.getMessage(locale.contextMenu.GENERATE_PAGE_QRCODE),
      contexts: ["page"],
    },
    [contextMenu.id.GENERATE_LINK]: {
      id: contextMenu.id.GENERATE_LINK,
      title: Browser.i18n.getMessage(locale.contextMenu.GENERATE_LINK_QRCODE),
      contexts: ["link"],
    },
  };

  private static menuItems: ContextMenuId[] = [];

  private static queue = Promise.resolve();

  private constructor() {}

  public static setMenuItems(items: (keyof AppContextMenuStore)[]): void {
    const tranformItems = items.map((id) => this.tranformMap[id]);

    tranformItems.forEach((id) => {
      const order = this.getOrder(id);
      this.menuItems[order] = id;
    });

    if (
      this.menuItems.includes(contextMenu.id.IDENTIFY_IMAGE) &&
      !this.menuItems.includes(contextMenu.id.SEPARATOR) &&
      this.menuItems.length > 2
    ) {
      const order = this.getOrder(contextMenu.id.SEPARATOR);
      this.menuItems[order] = contextMenu.id.SEPARATOR;
    }
  }

  public static add(
    id: ContextMenuId,
    fallback?: (error: unknown) => void,
  ): void {
    this.enqueue(async () => {
      if (this.menuItems.includes(id)) return;

      const order = this.getOrder(id);
      const menuItemsLength = this.getMenuItemsLogicalLength();

      if (order >= menuItemsLength - 1) this.addItem(id);
      else await this.rebuild(id);
    }, fallback);
  }

  public static remove(
    id: ContextMenuId,
    fallback?: (error: unknown) => void,
  ): void {
    this.enqueue(() => this.removeItem(id), fallback);
  }

  private static enqueue(
    task: () => Promise<void> | void,
    fallback?: (error: unknown) => void,
  ): void {
    this.queue = this.queue.then(task).catch(fallback);
  }

  private static getOrder(id: ContextMenuId): number {
    return this.orderMap[id];
  }

  private static getMenuItemsLogicalLength(): number {
    return this.menuItems.findLastIndex(Boolean) + 1;
  }

  private static addItem(id: ContextMenuId): void {
    if (this.menuItems.includes(id)) return;

    if (
      id !== contextMenu.id.SEPARATOR &&
      id !== contextMenu.id.IDENTIFY_IMAGE &&
      this.menuItems.includes(contextMenu.id.IDENTIFY_IMAGE) &&
      !this.menuItems.includes(contextMenu.id.SEPARATOR)
    )
      this.addItem(contextMenu.id.SEPARATOR);

    const config = this.menuConfigs[id];
    Browser.contextMenus.create(config);

    const order = this.getOrder(id);
    this.menuItems[order] = id;
  }

  private static removeItem(id: ContextMenuId): void {
    if (!this.menuItems.includes(id)) return;

    Browser.contextMenus
      .remove(id)
      .then(() => {
        const order = this.getOrder(id);
        delete this.menuItems[order];
      })
      .then(() => {
        if (
          (id === contextMenu.id.IDENTIFY_IMAGE &&
            this.menuItems.includes(contextMenu.id.SEPARATOR)) ||
          (this.getMenuItemsLogicalLength() === 2 &&
            this.menuItems.includes(contextMenu.id.IDENTIFY_IMAGE) &&
            this.menuItems.includes(contextMenu.id.SEPARATOR))
        )
          this.removeItem(contextMenu.id.SEPARATOR);
      });
  }

  private static async rebuild(id: ContextMenuId): Promise<void> {
    await Browser.contextMenus.removeAll();

    const menuItems = [...this.menuItems];
    this.menuItems = [];

    const order = this.getOrder(id);
    menuItems[order] = id;

    this.orders.forEach((menuId) => {
      if (menuItems.includes(menuId)) this.addItem(menuId);
    });
  }
}

class Handler {
  public static selectionText: string | null = null;
  public static srcUrl: string | null = null;
  public static srcText: string | null = null;
  public static pageUrl: string | null = null;
  public static linkUrl: string | null = null;

  public static setSelectionText(text: string): void {
    this.selectionText = text;
  }

  public static setSrcUrl(url: string): void {
    this.srcUrl = url;
  }

  public static setSrcText(text: string): void {
    this.srcText = text;
  }

  public static setPageUrl(url: string): void {
    this.pageUrl = url;
  }

  public static setLinkUrl(url: string): void {
    this.linkUrl = url;
  }

  public static done(): void {
    this.selectionText = null;
    this.srcUrl = null;
    this.srcText = null;
    this.pageUrl = null;
    this.linkUrl = null;
  }
}

export const contextMenus = {
  menus: Menus,
  handler: Handler,
};
