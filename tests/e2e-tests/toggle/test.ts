import { expect, test } from '@playwright/test';

const testRoute = '/toggle';

test('toggle functionality transmits data', async ({ page }) => {
	await page.goto(testRoute);

	const input = page.locator('input');

	const node = page.locator('#N-displayNode');

	// toggle shows the default boolean, node should be red
	await expect(node).toHaveCSS('background-color', 'rgb(255, 0, 0)');

	// can select and use toggle using keys, node switches to blue
	await page.keyboard.press('Tab');
	await page.keyboard.press('Tab');
	await page.keyboard.press('Tab');
	await page.keyboard.press('Enter');
	await expect(node).toHaveCSS('background-color', 'rgb(0, 0, 255)');

	// clicking the toggle switches the boolean, node switches to red
	await input.click();
	await expect(node).toHaveCSS('background-color', 'rgb(255, 0, 0)');
});
