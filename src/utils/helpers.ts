import { constants } from "./constants";
import minimatch from "minimatch";

export const prependAllLinks = async (): Promise<void> => {
  // Get all anchor tags on the page
  const links = document.getElementsByTagName("a");

  // Loop through each link and modify its href attribute
  for (let i = 0; i < links.length; i++) {
    const href = links[i].getAttribute("href");
    if (
      !href ||
      href.startsWith("#") ||
      href.startsWith(constants.MENLO_URL) ||
      href.startsWith("mailto:")
    ) {
      continue;
    }

    const newHref = href.startsWith("/")
      ? `${constants.MENLO_URL}${href}`
      : `${constants.MENLO_URL}/${href}`;

    links[i].setAttribute("href", newHref);
  }
}

export const isExcluded = async (url: string): Promise<boolean> => {
  const { excludeUrlPatterns } = await chrome.storage.sync.get("excludeUrlPatterns");
  if (!excludeUrlPatterns || excludeUrlPatterns.length === 0) {
    return false;
  }

  for (const pattern of excludeUrlPatterns) {
    if (minimatch(url, pattern)) {
      return true;
    }
  }

  return false;
}

export const updateBadgeText = async (url: string) => {
  /// XXX: how to use tabId?
  const excluded = await isExcluded(url);
  if (excluded) {
    await chrome.action.setBadgeText({ text: "Skip" });
    return;
  }

  const { autoReplace } = await chrome.storage.sync.get("autoReplace");
  await chrome.action.setBadgeText({ text: autoReplace ? "ON" : "" });
};
