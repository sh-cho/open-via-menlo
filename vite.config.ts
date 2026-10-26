import { execSync } from 'node:child_process';
import { resolve } from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig, type UserConfig } from 'vite';

import pkg from './package.json' with { type: 'json' };

const git = (cmd: string) => execSync(`git ${cmd}`).toString().trim();

export const shared: UserConfig = {
  root: 'src',
  publicDir: '../public',
  resolve: { alias: { '~': resolve(import.meta.dirname, 'src') } },
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
    __COMMIT_HASH__: JSON.stringify(git('rev-parse --short HEAD')),
    __COMMIT_DATE__: JSON.stringify(git('show -s --format=%ci')),
  },
};

// popup, options, background (module service worker)
export default defineConfig(({ mode }) => ({
  ...shared,
  plugins: [react()],
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    sourcemap: mode === 'development' ? 'inline' : false,
    rolldownOptions: {
      input: {
        popup: resolve(import.meta.dirname, 'src/popup/index.html'),
        options: resolve(import.meta.dirname, 'src/options/index.html'),
        background: resolve(import.meta.dirname, 'src/background/background.ts'),
      },
      output: {
        entryFileNames: ({ name }) =>
          name === 'background' ? '[name].js' : 'assets/[name]-[hash].js',
      },
    },
  },
}));
