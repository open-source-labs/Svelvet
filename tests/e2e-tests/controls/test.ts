import { expect, test } from '@playwright/test';

const testRoute = '/tests';

test.fixme('Skipping due to graph issues is zoomable via controls', async ({ page }) => {
	await page.goto(testRoute);

	const graphWrapper = page.locator('.svelvet-graph-wrapper');

	await expect(graphWrapper).toHaveAttribute('style', 'transform: translate(0px, 0px) scale(1);');

	const controls = page.locator('.graph-controls');
	await controls.waitFor(); // Wait for controls to be present

	// if (!controls) throw new Error('Controls not found');
	const zoomIn = await page.locator('.zoom-in');
	// const zoomIn = await page.waitForSelector('.zoom-in');
	await zoomIn.waitFor({ state: 'visible' }); // Wait for zoom button to be visible

	if (!zoomIn) throw new Error('Zoom in not found');
	await zoomIn.click();

	// Check if the scale value has increased
	await expect(graphWrapper).toHaveAttribute(
		'style',
		/^transform: translate\(0px, 0px\) scale\((\d+\.\d+)\);$/
	);
});

test('lock button prevents nodes from moving', async ({ page }) => {
	await page.goto(testRoute);
	const controls = page.locator('.graph-controls');
	if (!controls) throw new Error('Controls not found');
	const lock = await page.waitForSelector('.lock');
	if (!lock) throw new Error('lock button not found');
	await lock.click();

	const node1 = page.locator('#N-node1');
	const node2 = page.locator('#N-node2');
	await expect(node1).toHaveCSS('left', '0px');
	await expect(node1).toHaveCSS('top', '0px');
	await node1.dragTo(node2);
	await expect(node1).toHaveCSS('left', '0px');
	await expect(node1).toHaveCSS('top', '0px');
});

test('fitView/reset button centers nodes', async ({ page }) => {
	await page.goto(testRoute);

	const graphWrapper = await page.locator('.svelvet-graph-wrapper');
	const svelvet = await page.locator('.svelvet-wrapper');
	await expect(graphWrapper).toHaveAttribute('style', 'transform: translate(0px, 0px) scale(1);');

	const node1 = await page.locator('#N-node1');
	const node2 = await page.locator('#N-node2');

	await expect(node1).toHaveCSS('left', '0px');
	await expect(node1).toHaveCSS('top', '0px');

	const controls = await page.locator('.graph-controls');
	if (!controls) throw new Error('Controls not found');
	const reset = await page.waitForSelector('.reset');
	if (!reset) throw new Error('reset button not found');
	await reset.click();

	// Check that nodes didn't move
	await expect(node1).toHaveCSS('left', '0px');
	await expect(node1).toHaveCSS('top', '0px');

	await expect(graphWrapper).toHaveAttribute(
		'style',
		'transform: translate(45.7143px, 45.7143px) scale(0.914286);'
	);

	const node1Bounds = await node1.boundingBox();
	const node3Bounds = await node2.boundingBox();
	if (!node1Bounds || !node3Bounds) throw new Error('issue retrieving node bounds');

	const viewportBounds = await svelvet.boundingBox();
	if (!viewportBounds) throw new Error('Issue retrieiving graph bounds');
	const graphLeft = viewportBounds.x;
	const graphRight = viewportBounds.x + viewportBounds.width;
	const graphTop = viewportBounds.y;
	const graphBottom = viewportBounds.y + viewportBounds.height;

	const node1Left = node1Bounds.x;
	const node1Top = node1Bounds.y;

	const node3Right = node3Bounds.x + node3Bounds.width;
	const node3Bottom = node3Bounds.y + node3Bounds.height;

	const node1XDelta = node1Left - graphLeft;
	const node1YDelta = node1Top - graphTop;
	const node3XDelta = graphRight - node3Right;

	await expect(node1XDelta).toBeCloseTo(node3XDelta, 3);
	await expect(node1YDelta).toBeCloseTo(graphBottom - node3Bottom, 3);
});
