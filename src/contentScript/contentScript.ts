import { isExcluded, prependAllLinks } from '~/utils/helpers';

/// XXX: is this the right way to do this?
(async () => {
  try {
    const { autoReplace } = await chrome.storage.sync.get('autoReplace');
    if (!autoReplace) {
      return;
    }

    const excluded = await isExcluded(window.location.href);
    if (excluded) {
      console.log('🔎 Skipping excluded url', window.location.href);
      return;
    }

    await prependAllLinks();
  } catch (e) {
    console.log(e);
  }
})();
