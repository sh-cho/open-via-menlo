import { updateBadgeText } from "../utils/helpers";
import { onClickedListener, onInstalledListener } from "../utils/listeners";

chrome.runtime.onInstalled.addListener(onInstalledListener);
chrome.contextMenus.onClicked.addListener(onClickedListener);

chrome.tabs.onActivated.addListener(
  async (activeInfo: chrome.tabs.TabActiveInfo) => {
    console.log("🔎 Tab activated", activeInfo);
    const currentTab = await chrome.tabs.get(activeInfo.tabId);
    await updateBadgeText(currentTab.url || "");
  }
);

chrome.tabs.onUpdated.addListener(
  async (
    tabId: number,
    changeInfo: chrome.tabs.TabChangeInfo,
    tab: chrome.tabs.Tab
  ) => {
    console.log("🔎 Tab updated", tabId, changeInfo, tab);
    if (changeInfo.url) {
      await updateBadgeText(changeInfo.url);
    }
  }
);
