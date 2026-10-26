import { resolve } from 'node:path';

import { type BrowserContext, test as base, chromium, type Worker } from '@playwright/test';

import { constants } from '../src/utils/constants.ts';
import { DEFAULT_SETTING, type ExcludeSetting } from '../src/utils/types.ts';

const DIST = resolve(import.meta.dirname, '../dist');

/** Loads built extension (`pnpm build`) into Chromium. */
export const test = base.extend<{
  context: BrowserContext;
  sw: Worker;
  extensionId: string;
  saveSetting: (setting: Partial<ExcludeSetting>) => Promise<void>;
  loadSetting: () => Promise<ExcludeSetting | undefined>;
}>({
  // oxlint-disable-next-line no-empty-pattern
  context: async ({}, use) => {
    const context = await chromium.launchPersistentContext('', {
      channel: 'chromium',
      args: [`--disable-extensions-except=${DIST}`, `--load-extension=${DIST}`],
    });
    await use(context);
    await context.close();
  },
  sw: async ({ context }, use) => {
    await use(context.serviceWorkers()[0] ?? (await context.waitForEvent('serviceworker')));
  },
  extensionId: async ({ sw }, use) => {
    await use(new URL(sw.url()).host);
  },
  saveSetting: async ({ sw }, use) => {
    await use((setting) =>
      sw.evaluate(([key, value]) => chrome.storage.sync.set({ [key]: value }), [
        constants.STORAGE_SETTING_KEY,
        { ...DEFAULT_SETTING, ...setting },
      ] as const),
    );
  },
  loadSetting: async ({ sw }, use) => {
    await use(() =>
      sw.evaluate(
        async (key) => (await chrome.storage.sync.get(key))[key] as ExcludeSetting | undefined,
        constants.STORAGE_SETTING_KEY,
      ),
    );
  },
});

export const { expect } = test;
