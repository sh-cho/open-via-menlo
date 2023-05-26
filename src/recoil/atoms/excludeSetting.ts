import { constants } from '~/utils/constants';

import _ from 'lodash';
import { AtomEffect, atom } from 'recoil';

export type ExcludeType = 'domain' | 'regex' | 'glob';

export interface ExcludeSetting {
  revision: number;
  excludePatterns: string[];
  excludeType: ExcludeType;
  autoReplaceEnabled: boolean;
}

const saveThrottled = _.throttle((key: string, value: ExcludeSetting) => {
  chrome.storage.sync.set({ [key]: value });
  console.log('** saved', value);
}, 2000);

const chromeStorageEffect: (key: string) => AtomEffect<ExcludeSetting> =
  (key: string) =>
  ({ setSelf, onSet }) => {
    const loadPersisted = async () => {
      const savedValue = await chrome.storage.sync.get(key);

      if (savedValue[key]) {
        setSelf(savedValue[key]);
      }
    };

    loadPersisted();

    onSet(async (newValue) => {
      // saveThrottled(key, newValue);
      await chrome.runtime.sendMessage({ [key]: newValue });
    });
  };

export const excludeSettingState = atom<ExcludeSetting>({
  key: 'excludeSettingState',
  default: {
    revision: 0,
    excludePatterns: [],
    excludeType: 'domain',
    autoReplaceEnabled: false,
  },
  effects: [chromeStorageEffect(constants.STORAGE_SETTING_KEY)],
});
