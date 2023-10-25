/* eslint-disable no-restricted-syntax */
import { ExcludeSetting } from '~/recoil/atoms/excludeSetting';
import { constants } from '~/utils/constants';
import { getNewHref, isExcluded, prependAllLinks } from '~/utils/helpers';

/// XXX: How to reduce duplicated code?
(async () => {
  try {
    const savedValue = (
      await chrome.storage.sync.get(constants.STORAGE_SETTING_KEY)
    )[constants.STORAGE_SETTING_KEY] as ExcludeSetting;
    if (!savedValue) {
      return;
    }

    const { autoReplaceEnabled, excludeType, excludePatterns } = savedValue;
    if (!autoReplaceEnabled) {
      return;
    }

    // empty string or string starting with # will be ignored
    const excludePatternsFiltered = excludePatterns.filter(
      (pattern) => pattern && !pattern.startsWith('#'),
    );

    await prependAllLinks(excludeType, excludePatternsFiltered);
  } catch (e) {
    console.log(e);
  }
})();

// watch for DOM changes
const observer = new MutationObserver(async (mutationRecords) => {
  // console.log('** MutationRecords', mutationRecords);

  try {
    const savedValue = (
      await chrome.storage.sync.get(constants.STORAGE_SETTING_KEY)
    )[constants.STORAGE_SETTING_KEY] as ExcludeSetting;
    if (!savedValue) {
      return;
    }

    const { autoReplaceEnabled, excludeType, excludePatterns } = savedValue;
    if (!autoReplaceEnabled) {
      return;
    }
    const isCurrentPageExcluded = isExcluded(
      window.location.href,
      excludeType,
      excludePatterns,
    );

    // empty string or string starting with # will be ignored
    const excludePatternsFiltered = excludePatterns.filter(
      (pattern) => pattern && !pattern.startsWith('#'),
    );

    for (const mutation of mutationRecords) {
      // examine new nodes, is there any anchor tags to modify href?

      for (const node of mutation.addedNodes) {
        // we track only elements, skip other nodes (e.g. text nodes)
        if (!(node instanceof HTMLElement)) continue;

        // find all anchor tags
        const anchors = node.getElementsByTagName('a');
        if (!anchors.length) continue;

        // console.log('** anchors', anchors);

        for (const anchor of anchors) {
          const href = anchor.getAttribute('href');
          if (!href) {
            continue;
          }
          const newHref = getNewHref(
            href,
            excludeType,
            excludePatternsFiltered,
            isCurrentPageExcluded,
            window.location.origin,
          );
          anchor.setAttribute('href', newHref);

          // console.log('** newHref', newHref);
        }
      }
    }
  } catch (e) {
    console.log(e);
  }
});

observer.observe(document, { childList: true, subtree: true });
