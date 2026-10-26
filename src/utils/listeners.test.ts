import { beforeEach, describe, expect, it } from 'vitest';

import { stubChrome } from '~/test/chrome';

import { constants } from './constants';
import { onClickedListener, onInstalledListener } from './listeners';

const MENLO = constants.MENLO_URL;
const click = (data: Partial<chrome.contextMenus.OnClickData>) =>
  onClickedListener({
    editable: false,
    pageUrl: '',
    ...data,
  } as chrome.contextMenus.OnClickData);

describe('listeners', () => {
  let chrome: ReturnType<typeof stubChrome>;
  beforeEach(() => {
    chrome = stubChrome();
  });

  it('creates context menus on install', async () => {
    await onInstalledListener();
    expect(chrome.contextMenus.create.mock.calls.map(([m]) => m.id)).toEqual([
      'open-via-menlo',
      'go-back',
    ]);
  });

  it('opens link via menlo', async () => {
    await click({
      menuItemId: 'open-via-menlo',
      linkUrl: 'https://a.com',
      pageUrl: 'https://p.com',
    });
    expect(chrome.tabs.create).toHaveBeenCalledWith({
      url: `${MENLO}/https://a.com`,
    });
  });

  it('opens current page via menlo when not on a link', async () => {
    await click({ menuItemId: 'open-via-menlo', pageUrl: 'https://p.com' });
    expect(chrome.tabs.create).toHaveBeenCalledWith({
      url: `${MENLO}/https://p.com`,
    });
  });

  it('goes back to original page', async () => {
    await click({
      menuItemId: 'go-back',
      pageUrl: `${MENLO}/https://p.com/x?y=1`,
    });
    expect(chrome.tabs.update).toHaveBeenCalledWith({
      url: 'https://p.com/x?y=1',
    });
  });

  it('ignores unknown menu', async () => {
    await click({ menuItemId: 'unknown' });
    expect(chrome.tabs.create).not.toHaveBeenCalled();
    expect(chrome.tabs.update).not.toHaveBeenCalled();
  });
});
