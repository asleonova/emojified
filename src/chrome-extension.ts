import { emojifyContent, resetContent } from "./webPageEmojify";

export interface StorageService {
  set(records: Record<string, any>): Promise<void>;
  get<T = any>(key: string): Promise<T | undefined>;
}

const ACTIVE_KEY = "active";

export class ChromeExtenstion {
  constructor(private readonly storageService: StorageService) {
    this.setup();
  }

  private setup() {
    chrome.runtime.onInstalled.addListener(async () => {
      await this.storageService.set({ [ACTIVE_KEY]: false });
      console.info("emojified installation done");
    });

    chrome.action.onClicked.addListener(async (tab) => {
      try {
        const previouslyActive =
          (await this.storageService.get(ACTIVE_KEY)) ?? false;
        const active = !previouslyActive;
        const script = active ? emojifyContent : resetContent;
        await Promise.all([
          this.storageService.set({ active }),
          chrome.scripting.executeScript({
            target: { tabId: tab.id ? tab.id : -1 },
            func: script,
            args: [],
          }),
        ]);
        console.log("action done");
      } catch (e) {
        console.error(e);
      }
    });
  }
}
