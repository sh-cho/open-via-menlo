import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { stubChrome } from '~/test/chrome';
import { constants } from '~/utils/constants';
import { DEFAULT_SETTING } from '~/utils/types';

const KEY = constants.STORAGE_SETTING_KEY;

describe('background', () => {
  let chrome: ReturnType<typeof stubChrome>;
  let onMessage: (message: unknown) => void;

  beforeEach(async () => {
    vi.useFakeTimers();
    chrome = stubChrome();
    vi.resetModules();
    await import('./background');
    onMessage = chrome.runtime.onMessage.addListener.mock.calls[0]![0];
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('registers listeners', () => {
    expect(chrome.runtime.onInstalled.addListener).toHaveBeenCalledOnce();
    expect(chrome.contextMenus.onClicked.addListener).toHaveBeenCalledOnce();
  });

  it('throttles saves and keeps the latest value', () => {
    const settings = [1, 2, 3].map((revision) =>
      Object.assign({}, DEFAULT_SETTING, { revision }),
    );
    settings.forEach((s) => onMessage({ [KEY]: s }));
    vi.advanceTimersByTime(2000);

    expect(chrome.storage.sync.set.mock.calls).toEqual([
      [{ [KEY]: settings[0] }],
      [{ [KEY]: settings[2] }],
    ]);
  });

  it('ignores unrelated messages', () => {
    onMessage({ foo: 1 });
    vi.advanceTimersByTime(2000);
    expect(chrome.storage.sync.set).not.toHaveBeenCalled();
  });
});
