import { useEffect, useState } from 'react';

import { constants } from '~/utils/constants';
import { DEFAULT_SETTING, type ExcludeSetting } from '~/utils/types';

const KEY = constants.STORAGE_SETTING_KEY;

/** Exclude setting backed by `chrome.storage.sync` (writes are throttled in background). */
export const useExcludeSetting = () => {
  const [setting, setSetting] = useState<ExcludeSetting>(DEFAULT_SETTING);

  useEffect(() => {
    const load = async () => {
      const saved = await chrome.storage.sync.get(KEY);
      if (saved[KEY]) setSetting(saved[KEY] as ExcludeSetting);
    };
    void load();
  }, []);

  const update = (next: ExcludeSetting) => {
    setSetting(next);
    void chrome.runtime.sendMessage({ [KEY]: next });
  };

  return [setting, update] as const;
};
