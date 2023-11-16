import { expect, test } from '@playwright/test';

const testRoute = '/text-field';

test('text input changes textStore context in parent component', async ({ page }) => {
	await page.goto(testRoute);

	await page.type('#N-1 input', 'test');

	await expect(page.locator('#N-2')).toHaveText('test');
});
