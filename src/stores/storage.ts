import type { AsyncStorage } from "@solid-primitives/storage";
import Browser from "webextension-polyfill";

const extensionStorage: AsyncStorage = {
  async getItem(key: string): Promise<any> {
    let res = await Browser.storage.local.get(key);
    return res[key];
  },

  async setItem(key: string, value: any): Promise<void> {
    const obj: Record<string, any> = {};
    obj[key] = value;
    await Browser.storage.local.set(obj);
  },

  async removeItem(key: string): Promise<void> {
    await Browser.storage.local.remove(key);
  },
};

export default extensionStorage;
