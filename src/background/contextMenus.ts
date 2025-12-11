import Browser from "webextension-polyfill";
import type { ContextMenuId } from "#/constants";
import { contextMenu, locale, persistent } from "@/constants";

class Menus {
  private static readonly orders: ContextMenuId[] = [
    contextMenu.id.IDENTIFY_IMAGE,
    contextMenu.id.SEPARATOR,
    contextMenu.id.GENERATE_IMAGE,
    contextMenu.id.GENERATE_SELECTION,
    contextMenu.id.GENERATE_PAGE,
    contextMenu.id.GENERATE_LINK,
  ] as const;

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

  private static queue = Promise.resolve();

  private constructor() {}

  private static async set(items: ContextMenuId[]): Promise<boolean> {
    if (!Array.isArray(items)) return false;

    await Browser.storage.local.set({
      [persistent.MENUS]: JSON.stringify(items),
    });

    return true;
  }

  private static async get(): Promise<ContextMenuId[]> {
    const res = await Browser.storage.local.get(persistent.MENUS);
    if (typeof res !== "object") return [];
    if (typeof res[persistent.MENUS] === "undefined") return [];

    const items: ContextMenuId[] = JSON.parse(res[persistent.MENUS] as string);

    return items;
  }

  public static init(): void {
    this.orders.forEach((id) => this.add(id));
  }

  public static async update(): Promise<void> {
    const menus = await this.get();

    menus.forEach((id) => {
      if (id === null) return;
      Browser.contextMenus.create(this.menuConfigs[id]);
    });
  }

  public static add(
    id: ContextMenuId,
    fallback?: (error: unknown) => void,
  ): void {
    this.enqueue(async () => {
      const menus = await this.get();

      if (menus.includes(id)) return;

      const order = this.getOrder(id);
      const menuItemsLength = this.getMenuItemsLogicalLength(menus);

      if (order >= menuItemsLength - 1) await this.addItem(menus, id);
      else await this.rebuild(menus, id);
    }, fallback);
  }

  public static remove(
    id: ContextMenuId,
    fallback?: (error: unknown) => void,
  ): void {
    this.enqueue(async () => {
      const menus = await this.get();

      if (!menus.includes(id)) return;

      await this.removeItem(menus, id);
    }, fallback);
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

  private static getMenuItemsLogicalLength(menus: ContextMenuId[]): number {
    return menus.findLastIndex(Boolean) + 1;
  }

  private static async addItem(
    menus: ContextMenuId[],
    id: ContextMenuId,
  ): Promise<void> {
    if (
      id !== contextMenu.id.SEPARATOR &&
      id !== contextMenu.id.IDENTIFY_IMAGE &&
      menus.includes(contextMenu.id.IDENTIFY_IMAGE) &&
      !menus.includes(contextMenu.id.SEPARATOR)
    )
      await this.addItem(menus, contextMenu.id.SEPARATOR);

    const config = this.menuConfigs[id];
    Browser.contextMenus.create(config);

    const order = this.getOrder(id);
    menus[order] = id;

    await this.set(menus);
  }

  private static async removeItem(
    menus: ContextMenuId[],
    id: ContextMenuId,
  ): Promise<void> {
    await Browser.contextMenus.remove(id);

    const order = this.getOrder(id);
    delete menus[order];
    await this.set(menus);

    if (
      (id === contextMenu.id.IDENTIFY_IMAGE &&
        menus.includes(contextMenu.id.SEPARATOR)) ||
      (this.getMenuItemsLogicalLength(menus) === 2 &&
        menus.includes(contextMenu.id.IDENTIFY_IMAGE) &&
        menus.includes(contextMenu.id.SEPARATOR))
    )
      await this.removeItem(menus, contextMenu.id.SEPARATOR);
  }

  private static async rebuild(
    menus: ContextMenuId[],
    id: ContextMenuId,
  ): Promise<void> {
    await Browser.contextMenus.removeAll();

    const menuItems = [...menus];
    menus = [];

    const order = this.getOrder(id);
    menuItems[order] = id;

    this.orders.forEach((menuId) => {
      if (menuItems.includes(menuId)) this.addItem(menus, menuId);
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
