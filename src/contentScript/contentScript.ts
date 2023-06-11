import { ExcludeSetting } from '~/recoil/atoms/excludeSetting';
import { constants } from '~/utils/constants';
import { prependAllLinks } from '~/utils/helpers';

/// XXX: is this the right way to do this?
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
