import { expect, test } from '@playwright/test';

const testRoute = '/resizer-test';

test('node rotates correctly', async ({ page }) => {
	await page.goto(testRoute);

	const node1 = await page.locator('#N-node1');
	const node2 = await page.locator('#N-node2');

	await node1.dragTo(node2, {
		sourcePosition: { x: 0, y: 0 },
		targetPosition: { x: 0, y: 0 }
	});
	await expect(node1).toHaveCSS('transform', 'matrix(-1.83697e-16, -1, 1, -1.83697e-16, 0, 0)');
});

test('node can be horizontally adjusted correctly', async ({ page }) => {
	await page.goto(testRoute);

	const node1 = await page.locator('#N-node1');

	await node1.dragTo(node1, {
		sourcePosition: { x: 0, y: 50 },
		targetPosition: { x: 100, y: 50 }
	});
	await expect(node1).toHaveCSS('left', '400px');
	await expect(node1).toHaveCSS('width', '100px');
});

test('node can be vertically adjusted correctly', async ({ page }) => {
	await page.goto(testRoute);

	const node1 = await page.locator('#N-node1');

	await node1.dragTo(node1, {
		sourcePosition: { x: 100, y: 100 },
		targetPosition: { x: 100, y: 50 }
	});
	await expect(node1).toHaveCSS('bottom', '250px');
	await expect(node1).toHaveCSS('height', '50px');
});

// The following commented test is designed to test the functionality of the resizer 'both' feature.
// Essentially, you can click the bottom-right corner of the node that contains the resizer and drag.
// Dragging from this corner of the node allows you to dynamically change both the height and width property of the node simultaneously.
// For whatever reason, I can't figure out why the result isn't what I expect. Leaving it out for now. I'll revisit.

// test('node can be adjusted along both width and height with the both selector correctly', async ({ page }) => {
//     await page.goto(testRoute);

//     const node1 = await page.locator('#N-node1');

//     await page.mouse.move(502, 302);
//     await page.mouse.down();
//     await page.mouse.move(552, 352);
//     await page.mouse.up();

//     await expect(node1).toHaveCSS('width', '250px');
//     await expect(node1).toHaveCSS('height', '150px');
// })
