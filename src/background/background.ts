import { throttle } from 'es-toolkit';

import { constants } from '~/utils/constants';
import { onClickedListener, onInstalledListener } from '~/utils/listeners';
import type { ExcludeSetting } from '~/utils/types';

const KEY = constants.STORAGE_SETTING_KEY;

chrome.runtime.onInstalled.addListener(onInstalledListener);
chrome.contextMenus.onClicked.addListener(onClickedListener);

// `storage.sync` has write quota
const saveThrottled = throttle((value: ExcludeSetting) => {
  void chrome.storage.sync.set({ [KEY]: value });
}, 2000);

chrome.runtime.onMessage.addListener((message: Record<string, unknown>) => {
  if (message[KEY]) saveThrottled(message[KEY] as ExcludeSetting);
});
