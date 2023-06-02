import { expect, test } from '@playwright/test';

const testRoute = '/tests';

test('the minimap is rendered with the correct number of nodes', async ({ page }) => {
	await page.goto(testRoute);
	const minimap = await page.locator('.minimap-wrapper');
	await expect(minimap).toBeVisible();
	const minimapNodes = await page.$$('.minimap-node');

	expect(minimapNodes.length).toBe(3);
});
