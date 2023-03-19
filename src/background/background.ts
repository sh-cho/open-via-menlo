chrome.runtime.onInstalled.addListener(() => {
  // set "autoReplace" to true by default
  chrome.storage.sync.set({ autoReplace: true });

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
    const newUrl = `https://safe.menlosecurity.com/${
      data.linkUrl || data.pageUrl
    }`;
    console.log(`💬 Opening ${newUrl}`);
    chrome.tabs.create({ url: newUrl });
  }
});
