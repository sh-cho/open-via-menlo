import type { Page } from '@playwright/test';

import { constants } from '../src/utils/constants.ts';
import { expect, test } from './fixtures.ts';

const MENLO = constants.MENLO_URL;
const SITE = 'https://site.test';

const PAGE = `<!doctype html>
<a id="abs" href="https://example.com/">abs</a>
<a id="rel" href="/path">rel</a>
<a id="excluded" href="https://google.com/">excluded</a>
<a id="hash" href="#top">hash</a>
<a id="mail" href="mailto:a@b.c">mail</a>
<div id="slot"></div>`;

test.beforeEach(async ({ context }) => {
  await context.route(`${SITE}/**`, (route) =>
    route.fulfill({ contentType: 'text/html', body: PAGE }),
  );
});

const hrefOf = (page: Page, id: string) => page.locator(`#${id}`).getAttribute('href');

test.describe('content script', () => {
  test('does not touch links when disabled', async ({ context, saveSetting }) => {
    await saveSetting({ autoReplaceEnabled: false });
    const page = await context.newPage();
    await page.goto(`${SITE}/`);
    await page.waitForTimeout(300);

    expect(await hrefOf(page, 'abs')).toBe('https://example.com/');
  });

  test('rewrites links when enabled', async ({ context, saveSetting }) => {
    await saveSetting({
      autoReplaceEnabled: true,
      excludePatterns: ['', '# c', 'google.com'],
    });
    const page = await context.newPage();
    await page.goto(`${SITE}/`);

    await expect(page.locator('#abs')).toHaveAttribute('href', `${MENLO}/https://example.com/`);
    expect(await hrefOf(page, 'rel')).toBe(`${MENLO}/${SITE}/path`);
    expect(await hrefOf(page, 'excluded')).toBe('https://google.com/');
    expect(await hrefOf(page, 'hash')).toBe('#top');
    expect(await hrefOf(page, 'mail')).toBe('mailto:a@b.c');
  });

  test('rewrites dynamically added links', async ({ context, saveSetting }) => {
    await saveSetting({ autoReplaceEnabled: true });
    const page = await context.newPage();
    await page.goto(`${SITE}/`);
    await expect(page.locator('#abs')).toHaveAttribute('href', /^https:\/\/safe\./);

    await page.evaluate(() => {
      document.querySelector('#slot')!.innerHTML = '<a id="dyn" href="https://dyn.com/">dyn</a>';
    });
    await expect(page.locator('#dyn')).toHaveAttribute('href', `${MENLO}/https://dyn.com/`);
  });

  test('keeps relative links on an excluded page', async ({ context, saveSetting }) => {
    await saveSetting({
      autoReplaceEnabled: true,
      excludePatterns: ['site.test'],
    });
    const page = await context.newPage();
    await page.goto(`${SITE}/`);

    await expect(page.locator('#abs')).toHaveAttribute('href', `${MENLO}/https://example.com/`);
    expect(await hrefOf(page, 'rel')).toBe('/path');
  });

  for (const [excludeType, pattern] of [
    ['regex', '^https://(www\\.)?google\\.com'],
    ['glob', 'https://google.com/**'],
  ] as const) {
    test(`supports ${excludeType} exclusion`, async ({ context, saveSetting }) => {
      await saveSetting({
        autoReplaceEnabled: true,
        excludeType,
        excludePatterns: [pattern],
      });
      const page = await context.newPage();
      await page.goto(`${SITE}/`);

      await expect(page.locator('#abs')).toHaveAttribute('href', `${MENLO}/https://example.com/`);
      expect(await hrefOf(page, 'excluded')).toBe('https://google.com/');
    });
  }
});

test.describe('popup', () => {
  test('toggles auto replace and badge', async ({ context, extensionId, sw, loadSetting }) => {
    const page = await context.newPage();
    await page.goto(`chrome-extension://${extensionId}/popup/index.html`);

    const toggle = page.getByRole('switch');
    await expect(toggle).not.toBeChecked();

    await toggle.click();
    await expect(toggle).toBeChecked();
    await expect.poll(async () => (await loadSetting())?.autoReplaceEnabled).toBe(true);
    await expect.poll(() => sw.evaluate(() => chrome.action.getBadgeText({}))).toBe('ON');

    // persisted across reopen
    await page.reload();
    await expect(page.getByRole('switch')).toBeChecked();
  });

  test('opens options page', async ({ context, extensionId }) => {
    const page = await context.newPage();
    await page.goto(`chrome-extension://${extensionId}/popup/index.html`);

    const [options] = await Promise.all([
      context.waitForEvent('page'),
      page.getByRole('button', { name: 'Options' }).click(),
    ]);
    await expect(options).toHaveURL(/\/options\/index\.html$/);
  });
});

test.describe('options', () => {
  test('saves exclude type and patterns', async ({ context, extensionId, loadSetting }) => {
    const page = await context.newPage();
    await page.goto(`chrome-extension://${extensionId}/options/index.html`);
    await expect(page.getByRole('heading', { name: 'Open-via-menlo options' })).toBeVisible();

    await page.getByText('Regex', { exact: true }).click();
    await page.getByRole('textbox').fill('google\\.com\n# comment');

    await expect.poll(loadSetting).toMatchObject({
      excludeType: 'regex',
      excludePatterns: ['google\\.com', '# comment'],
    });

    await page.reload();
    await expect(page.getByRole('textbox')).toHaveValue('google\\.com\n# comment');
  });
});

test.describe('context menu', () => {
  test('registers menus on install', async ({ sw }) => {
    // no API to list menus; `update` fails for unknown ids. Poll since onInstalled runs async.
    const menuError = (id: string) =>
      sw.evaluate(
        (menuId) =>
          new Promise<string | undefined>((resolve) => {
            chrome.contextMenus.update(menuId, {}, () =>
              resolve(chrome.runtime.lastError?.message),
            );
          }),
        id,
      );
    await Promise.all(
      ['open-via-menlo', 'go-back'].map((id) => expect.poll(() => menuError(id)).toBeUndefined()),
    );
  });

  test('update fails for unknown menu (sanity)', async ({ sw }) => {
    const error = await sw.evaluate(
      () =>
        new Promise<string | undefined>((resolve) => {
          chrome.contextMenus.update('nope', {}, () => resolve(chrome.runtime.lastError?.message));
        }),
    );
    expect(error).toBeTruthy();
  });
});

test.describe('tabs API without `tabs` permission', () => {
  test('creates and updates tabs (used by context menu)', async ({ context, sw }) => {
    const [page] = await Promise.all([
      context.waitForEvent('page'),
      sw.evaluate((url) => chrome.tabs.create({ url }), `${SITE}/created`),
    ]);
    await expect(page).toHaveURL(`${SITE}/created`);

    await sw.evaluate((url) => chrome.tabs.update({ url }), `${SITE}/updated`);
    await expect(page).toHaveURL(`${SITE}/updated`);
  });
});
