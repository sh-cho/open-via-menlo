import { constants } from "../utils/constants";
import minimatch from "minimatch";

// TODO: update badge text if skipped
// TODO: wrap and use async/await

chrome.storage.sync.get("autoReplace").then((result) => {
  console.log("🔎 Checking autoReplace setting", result);

  if (!result.autoReplace) {
    return;
  }

  // if current url is excluded, skip.
  isExcluded(window.location.href).then((isExcluded) => {
    if (isExcluded) {
      console.log("🔎 Skipping excluded url", window.location.href);
      return;
    }

    prependAllLinks();
  });
});

async function prependAllLinks() {
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

function isExcluded(url: string): Promise<boolean> {
  return chrome.storage.sync
    .get("excludeUrlPatterns")
    .then((result) => {
      const excludeUrlPatterns = result.excludeUrlPatterns;
      if (!excludeUrlPatterns || excludeUrlPatterns.length === 0) {
        return false;
      }

      for (const pattern of excludeUrlPatterns) {
        if (minimatch(url, pattern)) {
          return true;
        }
      }

      return false;
    })
    .catch((error) => {
      chrome.storage.sync.set({ excludeUrlPatterns: [] });
      return true;
    });
}
