import _ from 'lodash';

import { ExcludeSetting } from '~/recoil/atoms/excludeSetting';
import { constants } from '~/utils/constants';
import { onClickedListener, onInstalledListener } from '~/utils/listeners';

chrome.runtime.onInstalled.addListener(onInstalledListener);
chrome.contextMenus.onClicked.addListener(onClickedListener);

const saveThrottled = _.throttle((key: string, value: ExcludeSetting) => {
  chrome.storage.sync.set({ [key]: value });
  console.log('** saved', value);
}, 2000);

chrome.runtime.onMessage.addListener(
  async (message, sender: chrome.runtime.MessageSender, sendResponse) => {
    console.log('🔎 Message received', message, sender);
    // await updateBadgeText(message.url, message.on);

    saveThrottled(
      constants.STORAGE_SETTING_KEY,
      message[constants.STORAGE_SETTING_KEY],
    );
  },
);
