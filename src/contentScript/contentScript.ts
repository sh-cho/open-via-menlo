import { constants } from '~/utils/constants';
import { getActivePatterns, prependLinks } from '~/utils/helpers';
import type { ExcludeSetting } from '~/utils/types';

const KEY = constants.STORAGE_SETTING_KEY;

const collectAnchors = (records: MutationRecord[]): HTMLAnchorElement[] => {
  const anchors: HTMLAnchorElement[] = [];
  for (const { addedNodes } of records) {
    for (const node of addedNodes) {
      if (!(node instanceof HTMLElement)) continue;
      if (node instanceof HTMLAnchorElement) anchors.push(node);
      anchors.push(...node.getElementsByTagName('a'));
    }
  }
  return anchors;
};

const main = async () => {
  const setting = (await chrome.storage.sync.get(KEY))[KEY] as ExcludeSetting | undefined;
  // Setting changes require page refresh, so read once.
  if (!setting?.autoReplaceEnabled) return;

  const { excludeType } = setting;
  const patterns = getActivePatterns(setting.excludePatterns);

  prependLinks(document.getElementsByTagName('a'), excludeType, patterns);

  new MutationObserver((records) => {
    const anchors = collectAnchors(records);
    if (anchors.length) prependLinks(anchors, excludeType, patterns);
  }).observe(document, { childList: true, subtree: true });
};

main().catch(console.error);
