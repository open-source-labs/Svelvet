/// <reference types="vitest" />
import { defineConfig, loadEnv } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: 'tests/setupTests.ts',
  },
  alias: {
    $lib: '/src/lib',
    $libOld: '/src/libOld',
  },
  plugins: [
    svelte({
      configFile: './svelte.config.js',
      hot: !process.env.VITEST,
      compilerOptions: { dev: true },
    }),
  ],
});
