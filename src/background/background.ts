import { updateBadgeText, updateBadgeTextOnTabActions } from "../utils/helpers";
import { onClickedListener, onInstalledListener } from "../utils/listeners";

chrome.runtime.onInstalled.addListener(onInstalledListener);
chrome.contextMenus.onClicked.addListener(onClickedListener);

chrome.tabs.onActivated.addListener(
  async (activeInfo: chrome.tabs.TabActiveInfo) => {
    console.log("🔎 Tab activated", activeInfo);
    const currentTab = await chrome.tabs.get(activeInfo.tabId);
    await updateBadgeTextOnTabActions(currentTab.url || "");
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
      await updateBadgeTextOnTabActions(changeInfo.url);
    }
  }
);

chrome.runtime.onMessage.addListener(
  async (message, sender: chrome.runtime.MessageSender, sendResponse) => {
    console.log("🔎 Message received", message, sender);
    await updateBadgeText(message.url, message.on);
  }
);
