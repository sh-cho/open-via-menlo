import { afterEach, describe, expect, it, vi } from 'vitest';

import { stubChrome } from '~/test/chrome';
import { constants } from '~/utils/constants';
import type { ExcludeSetting } from '~/utils/types';

const MENLO = constants.MENLO_URL;

const run = async (setting?: Partial<ExcludeSetting>) => {
  stubChrome(setting);
  vi.resetModules();
  await import('./contentScript');
  await vi.waitFor(() => expect(chrome.storage.sync.get).toHaveBeenCalled());
  await new Promise((r) => setTimeout(r));
};

const hrefs = () =>
  [...document.querySelectorAll('a')].map((a) => a.getAttribute('href'));

describe('contentScript', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('does nothing when disabled', async () => {
    document.body.innerHTML = '<a href="https://example.com"></a>';
    await run({ autoReplaceEnabled: false });
    expect(hrefs()).toEqual(['https://example.com']);
  });

  it('does nothing without saved setting', async () => {
    document.body.innerHTML = '<a href="https://example.com"></a>';
    await run();
    expect(hrefs()).toEqual(['https://example.com']);
  });

  it('rewrites existing and dynamically added links', async () => {
    document.body.innerHTML =
      '<a href="https://example.com"></a><a href="https://google.com"></a>';
    await run({
      autoReplaceEnabled: true,
      excludePatterns: ['', '# c', 'google.com'],
    });
    expect(hrefs()).toEqual([
      `${MENLO}/https://example.com`,
      'https://google.com',
    ]);

    const a = document.createElement('a');
    a.href = 'https://added.com/';
    const div = document.createElement('div');
    div.innerHTML = '<a href="https://nested.com"></a>';
    document.body.append(a, div);

    await vi.waitFor(() =>
      expect(hrefs().slice(2)).toEqual([
        `${MENLO}/https://added.com/`,
        `${MENLO}/https://nested.com`,
      ]),
    );
  });

  it('ignores blank/comment patterns when checking current page', async () => {
    // a blank line used to exclude every page (''.includes match)
    document.body.innerHTML = '<a href="/path"></a>';
    await run({ autoReplaceEnabled: true, excludePatterns: [''] });
    expect(hrefs()).toEqual([`${MENLO}/https://abcde.com/path`]);
  });
});
