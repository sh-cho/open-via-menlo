import { constants } from "../utils/constants";

chrome.runtime.onInstalled.addListener(() => {
  // set "autoReplace" to false by default
  chrome.storage.sync.set({ autoReplace: false });

  chrome.contextMenus.create({
    id: "open-via-menlo",
    title: "Open via Menlo",
    contexts: ["link", "page"],
    documentUrlPatterns: ["http://*/*", "https://*/*"],
    visible: true,
  });
});

chrome.contextMenus.onClicked.addListener((data) => {
  if (data.menuItemId === "open-via-menlo") {
    const newUrl = `${constants.MENLO_URL}/${data.linkUrl || data.pageUrl}`;
    console.log(`💬 Opening ${newUrl}`);
    chrome.tabs.create({ url: newUrl });
  }
});
