import { expect, test } from '@playwright/test';

const testRoute = '/tests';

test('nodes exist and are draggable', async ({ page }) => {
	await page.goto(testRoute);

	const node1 = page.locator('#N-node1');
	const node2 = page.locator('#N-node2');

	const sourceAnchor = page.locator('[id="A-2/N-node2"]');
	const targetAnchor = page.locator('[id="A-1/N-node1"]');

	await expect(node1).toBeVisible();
	await expect(node1).toHaveClass(/^svelvet-node/);

	// Check node dimensions and position
	await expect(node1).toHaveCSS('left', '0px');
	await expect(node1).toHaveCSS('top', '0px');
	await expect(node1).toHaveCSS('width', '200px');
	await expect(node1).toHaveCSS('height', '100px');

	// Check node dimensions and position
	await expect(node2).toHaveCSS('left', '300px');
	await expect(node2).toHaveCSS('top', '300px');
	await expect(node2).toHaveCSS('width', '400px');
	await expect(node2).toHaveCSS('height', '100px');

	// Check that the node has the correct text
	await expect(node1).toHaveText('test');

	await expect(sourceAnchor).toBeVisible();
	await expect(targetAnchor).toBeVisible();

	await node1.dragTo(node2);

	await expect(node1).toHaveCSS('left', '400px');
	await expect(node1).toHaveCSS('top', '300px');
});

test('default node is created with correct id and inputs', async ({ page }) => {
	await page.goto(testRoute);
	const wrapper = page.locator('.svelvet-graph-wrapper');
	if (!wrapper) throw new Error('Wrapper not found');
	const node = await page.waitForSelector('#N-3');
	if (!node) throw new Error('Node not found');

	const inputs = await node.$('.input-anchors');
	if (!inputs) throw new Error('Inputs not found');

	const anchors = await inputs.$$('.anchor-wrapper');
	if (!anchors) throw new Error('Anchors not found');

	const anchor1 = page.locator('[id="A-1/N-3"]');
	const anchor2 = page.locator('[id="A-2/N-3"]');
	const anchor3 = page.locator('[id="A-3/N-3"]');

	await expect(anchor1).toBeVisible();
	await expect(anchor2).toBeVisible();
	await expect(anchor3).toBeVisible();

	await expect(anchors.length).toBe(3);
});

test('shift-click and drag selects nodes', async ({ page }) => {
	await page.goto(testRoute);

	// Locate the nodes you want to test
	const testNode = page.locator('#N-node2');
	const selectionWrapper = testNode.locator('.default-node');

	const wrapperBox = await testNode.boundingBox();

	if (!wrapperBox) throw new Error('Wrapper not found');

	const startX = wrapperBox.x - 20;
	const startY = wrapperBox.y - 20;

	const endX = wrapperBox.x + wrapperBox.width + 20;
	const endY = wrapperBox.y + wrapperBox.height + 20;

	// Perform a shift-click and drag on the first node to the second node
	await page.mouse.move(startX, startY);
	await page.mouse.down();
	await page.mouse.up();
	await page.keyboard.down('Shift');
	await page.mouse.down();
	await page.mouse.move(endX, endY);
	await page.mouse.up();

	// Check if the "selected" class is added to both nodes
	await expect(selectionWrapper).toHaveClass(/selected/);
});

test('selecting one node deselects others', async ({ page }) => {
	await page.goto(testRoute);

	const node1 = page.locator('#N-node1');
	const node2 = page.locator('#N-node2');

	const node1Selection = node1.locator('.default-node');
	const node2Selection = node2.locator('.default-node');

	await node1.click();

	await expect(node1Selection).toHaveClass(/selected/);

	await node2.click();

	await expect(node1Selection).not.toHaveClass(/selected/);
	await expect(node2Selection).toHaveClass(/selected/);
});

test('node zIndexes are incremented correctly', async ({ page }) => {
	await page.goto(testRoute);

	const node1 = page.locator('#N-node1');
	const node2 = page.locator('#N-node2');

	await node1.click();

	await expect(node1).toHaveCSS('z-index', '3');

	await node2.click();
	await expect(node2).toHaveCSS('z-index', '4');
});

test('TD prop places inputs on the top', async ({ page }) => {
	await page.goto(testRoute);

	const node = page.locator('#N-3');
	const inputs = node.locator('.input-anchors');

	await expect(inputs).toHaveClass(/top/);
	await expect(inputs).toHaveCSS('top', '0px');
	await expect(inputs).toHaveCSS('display', 'flex');
	await expect(inputs).toHaveCSS('position', 'absolute');
});

test('on:nodeClicked and on:nodeReleased events fire', async ({ page }) => {
	await page.goto(testRoute);

	const node = page.locator('#N-node1');

	// Check that the label says "test"
	await expect(node).toHaveText('test');

	// Move mouse to node
	await node.hover();

	// Mouse down on node
	await page.mouse.down();

	// Check that the label now has the node id
	await expect(node).toHaveText('N-node1');

	// Mouse up on node
	await page.mouse.up();

	await expect(node).toHaveText('release');
});
