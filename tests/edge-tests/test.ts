import { expect, test } from '@playwright/test';

const testRoute = '/tests';

test('custom edges are rendered correctly and labels can be interacted with', async ({ page }) => {
	await page.goto(testRoute);
	const sourceAnchor = page.locator('[id="A-2/N-node2"]');
	const targetAnchor = page.locator('[id="A-1/N-node1"]');

	await sourceAnchor.dragTo(targetAnchor);

	const newEdge = page.locator('[id="A-1/N-node1+A-2/N-node2"]');

	await expect(newEdge).toHaveAttribute('d', 'M 700, 350 C 1050, 350 -350, 50 0, 50');
	await expect(newEdge).toHaveAttribute('style', 'stroke: yellow; stroke-width: 4px;');

	// const sourcePosition = await sourceAnchor.boundingBox();
	await page.locator('.svelvet-anchor').first().click();

	// if (!sourcePosition) throw new Error('Source position not found');
	// // page.mouse.move(sourcePosition.x + 13, sourcePosition.y);
	// // await page.mouse.down();
	// await expect(newEdge).toHaveAttribute('style', 'stroke: blue; stroke-width: 4px;');

	await page.getByRole('button', { name: 'Custom Label' }).click();

	const removedEdge = page.locator('[id="A-1/N-node1+A-2/N-node2"]');
	const elementCount = await removedEdge.count();
	expect(elementCount).toBe(0);
});
