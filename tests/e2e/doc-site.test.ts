import { expect, test } from '@playwright/test';

test('should display the title', async ({ page }) => {
	await page.goto('/');
	expect(await page.textContent('h1')).toBe(
		'Mapping out your ideas with Svelte has never been easier'
	);
});
