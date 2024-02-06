import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
	webServer: {
		command: 'npm run build && npm run preview',
		port: 4173
	},
	testDir: 'tests/e2e-tests',
	// add a retry to failed test
	// addresses color-picker test timing issue
	retries: 1
};

export default config;
