import { expect, test } from '@playwright/test';

const testRoute = '/tests';

test('graph is pannable', async ({ page }) => {
	await page.goto(testRoute);
	const graph = page.locator('#G-1');
	const wrapper = graph.locator('.svelvet-graph-wrapper');

	await expect(wrapper).toHaveAttribute('style', 'transform: translate(0px, 0px) scale(1);');

	// Get the bounding box of the wrapper
	const wrapperBox = await wrapper.boundingBox();
	if (!wrapperBox) throw new Error('Wrapper not found');
	// Calculate the starting position for dragging
	const startX = wrapperBox.x + wrapperBox.width / 2;
	const startY = wrapperBox.y + wrapperBox.height / 2;

	// Drag the wrapper by 100px in both x and y directions
	await page.mouse.move(startX, startY);
	await page.mouse.down();
	await page.mouse.move(startX + 100, startY + 100);
	await page.mouse.up();

	await expect(wrapper).toHaveAttribute('style', 'transform: translate(100px, 100px) scale(1);');
});

test('graph is zoomable by scrolling', async ({ page }) => {
	await page.goto(testRoute);

	const graphWrapper = page.locator('.svelvet-graph-wrapper');

	await expect(graphWrapper).toHaveAttribute('style', 'transform: translate(0px, 0px) scale(1);');

	// Get the bounding box of the wrapper
	const wrapperBox = await graphWrapper.boundingBox();
	if (!wrapperBox) throw new Error('Wrapper not found');
	// Calculate the starting position for dragging
	const startX = wrapperBox.x + wrapperBox.width / 2;
	const startY = wrapperBox.y + wrapperBox.height / 2;

	// Dispatch a wheel event on the graph wrapper to zoom in
	await page.mouse.move(startX, startY);
	await page.mouse.wheel(0, -100);

	// Check if the scale value has increased
	await expect(graphWrapper).toHaveAttribute(
		'style',
		/^transform: translate\(0px, 0px\) scale\((\d+\.\d+)\);$/
	);
});

test('the canvas is the correct size', async ({ page }) => {
	await page.goto(testRoute);

	const canvas = await page.waitForSelector('#G-1');
	if (!canvas) throw new Error('Canvas not found');

	const canvasBox = await canvas.boundingBox();

	if (!canvasBox) throw new Error('Canvas bounding box not found');

	expect(canvasBox.width).toBe(800);
	expect(canvasBox.height).toBe(500);
});
