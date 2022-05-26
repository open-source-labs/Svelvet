/// <reference types="vitest" />
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: 'tests/setupTests.ts'
	},
	plugins: [
		svelte({
			configFile: './svelte.config.js',
			hot: !process.env.VITEST
		})
	]
});
