

// TODO: background script
chrome.runtime.onInstalled.addListener(() => {
  // TODO: on installed function
  chrome.storage.sync.set({"use": true})
})
