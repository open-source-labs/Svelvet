import { expect, test } from '@playwright/test';

const testRoute = '/tests';

test('graph is zoomable via controls', async ({ page }) => {
	await page.goto(testRoute);

	const graphWrapper = page.locator('.svelvet-graph-wrapper');

	await expect(graphWrapper).toHaveAttribute('style', 'transform: translate(0px, 0px) scale(1);');

	const controls = page.locator('.graph-controls');
	if (!controls) throw new Error('Controls not found');
	const zoomIn = await page.waitForSelector('.zoom-in');

	if (!zoomIn) throw new Error('Zoom in not found');
	await zoomIn.click();

	// Check if the scale value has increased
	await expect(graphWrapper).toHaveAttribute(
		'style',
		/^transform: translate\(0px, 0px\) scale\((\d+\.\d+)\);$/
	);
});
