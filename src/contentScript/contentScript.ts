chrome.storage.sync.get("autoReplace").then((result) => {
  console.log("🔎 Checking autoReplace setting", result);

  if (!result.autoReplace) {
    return;
  }

  prependAllLinks();
});

const MENLO_URL = "https://safe.menlosecurity.com";

function prependAllLinks() {
  // Get all anchor tags on the page
  const links = document.getElementsByTagName("a");

  // Loop through each link and modify its href attribute
  for (let i = 0; i < links.length; i++) {
    const href = links[i].getAttribute("href");
    if (
      !href ||
      href.startsWith("#") ||
      href.startsWith(MENLO_URL) ||
      href.startsWith("mailto:")
    ) {
      continue;
    }

    const newHref = href.startsWith("/")
      ? `${MENLO_URL}${href}`
      : `${MENLO_URL}/${href}`;

    links[i].setAttribute("href", newHref);
  }
}
