import { vi } from 'vitest';

import { constants } from '~/utils/constants';
import { DEFAULT_SETTING, type ExcludeSetting } from '~/utils/types';

const listener = () => ({ addListener: vi.fn() });

/** Minimal `chrome` API mock. */
export const stubChrome = (setting?: Partial<ExcludeSetting>) => {
  const store: Record<string, unknown> = setting
    ? { [constants.STORAGE_SETTING_KEY]: { ...DEFAULT_SETTING, ...setting } }
    : {};
  const chrome = {
    storage: {
      sync: {
        get: vi.fn(async (key: string) => ({ [key]: store[key] })),
        set: vi.fn(async (items: Record<string, unknown>) =>
          Object.assign(store, items),
        ),
      },
    },
    runtime: {
      onInstalled: listener(),
      onMessage: listener(),
      sendMessage: vi.fn(),
    },
    contextMenus: { create: vi.fn(), onClicked: listener() },
    tabs: { create: vi.fn(), update: vi.fn() },
    action: { setBadgeText: vi.fn(), setBadgeBackgroundColor: vi.fn() },
  };
  vi.stubGlobal('chrome', chrome);
  return chrome;
};
