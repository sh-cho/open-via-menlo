import { defineConfig } from 'vitest/config';

import { shared } from './vite.config.ts';

export default defineConfig({
  ...shared,
  root: '.',
  test: {
    include: ['src/**/*.test.{ts,tsx}'],
    environment: 'happy-dom',
    restoreMocks: true,
    unstubGlobals: true,
    environmentOptions: { happyDOM: { url: 'https://abcde.com/page' } },
  },
});
