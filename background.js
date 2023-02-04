chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "open-via-menlo",
    title: "Open via Menlo",
    contexts: ["link"],
  });
});

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === "open-via-menlo") {
    const newUrl = `https://safe.menlosecurity.com/${info.linkUrl}`;
    chrome.tabs.create({url: newUrl});
  }
});
