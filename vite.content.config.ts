import { resolve } from 'node:path';

import { defineConfig } from 'vite';

import { shared } from './vite.config.ts';

// Content scripts can't be ES modules -> single IIFE bundle
export default defineConfig(({ mode }) => ({
  ...shared,
  publicDir: false,
  build: {
    outDir: '../dist',
    emptyOutDir: false,
    sourcemap: mode === 'development' ? 'inline' : false,
    lib: {
      entry: resolve(import.meta.dirname, 'src/contentScript/contentScript.ts'),
      formats: ['iife'],
      name: 'openViaMenlo',
      fileName: () => 'contentScript.js',
    },
  },
}));
