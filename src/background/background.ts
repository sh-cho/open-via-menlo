chrome.runtime.onInstalled.addListener(() => {
  // set "autoReplace" to true by default
  chrome.storage.sync.set({autoReplace: true})

  chrome.contextMenus.create({
    id: "open-via-menlo",
    title: "Open via Menlo",
    contexts: ["link", "page"],
    documentUrlPatterns: ["http://*/*", "https://*/*"],
    // targetUrlPatterns: ["http://*/*", "https://*/*"],
    visible: true,
  });
})

// chrome.contextMenus.onClicked.addListener((info) => {
//   if (info.menuItemId === "open-via-menlo") {
//     const newUrl = `https://safe.menlosecurity.com/${info.linkUrl}`;
//     chrome.tabs.create({url: newUrl});
//   }
// });
