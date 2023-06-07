import { expect, test } from '@playwright/test';

const testRoute = '/connections';

test('connections are made correctly', async ({ page }) => {
	await page.goto(testRoute);

	await expect(await page.locator('.edge')).toHaveCount(18);

	await expect(await page.locator('[id="A-1/N-1+A-1/N-2"]')).toBeVisible();
	await expect(await page.locator('[id="A-1/N-3+A-2/N-1"]')).toBeVisible();
	await expect(await page.locator('[id="A-1/N-4+A-3/N-1"]')).toBeVisible();
	await expect(await page.locator('[id="A-1/N-5+A-4/N-1"]')).toBeVisible();
	await expect(await page.locator('[id="A-1/N-1+A-1/N-6"]')).toBeVisible();
	await expect(await page.locator('[id="A-2/N-1+A-custom/N-custom"]')).toBeVisible();

	await expect(await page.locator('[id="A-1/N-2+A-2/N-8"]')).toBeVisible();
	await expect(await page.locator('[id="A-2/N-3+A-2/N-8"]')).toBeVisible();
	await expect(await page.locator('[id="A-1/N-4+A-2/N-8"]')).toBeVisible();
	await expect(await page.locator('[id="A-1/N-5+A-2/N-8"]')).toBeVisible();
	await expect(await page.locator('[id="A-1/N-6+A-2/N-8"]')).toBeVisible();
	await expect(await page.locator('[id="A-2/N-8+A-custom/N-custom"]')).toBeVisible();

	await expect(await page.locator('[id="A-5/N-5+A-custom/N-custom"]')).toBeVisible();
	await expect(await page.locator('[id="A-2/N-5+A-custom/N-custom"]')).toBeVisible();

	await expect(await page.locator('[id="A-1/N-8+A-6/N-5"]')).toBeVisible();

	await expect(await page.locator('[id="A-2/N-4+A-custom/N-custom"]')).toBeVisible();
	await expect(await page.locator('[id="A-4/N-3+A-custom2/N-custom"]')).toBeVisible();
	await expect(await page.locator('[id="A-7/N-5+A-custom2/N-custom"]')).toBeVisible();
});
