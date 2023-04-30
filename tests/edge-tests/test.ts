import { expect, test } from '@playwright/test';

const testRoute = '/tests';

test('custom edges are rendered correctly and labels can be interacted with', async ({ page }) => {
	await page.goto(testRoute);
	const sourceAnchor = page.locator('[id="A-2/N-node2"]');
	const targetAnchor = page.locator('[id="A-1/N-node1"]');

	await sourceAnchor.dragTo(targetAnchor);

	const newEdge = page.locator('[id="A-1/N-node1+A-2/N-node2"]');

	await expect(newEdge).toHaveAttribute('d', 'M 707, 350 C 1064, 350 -364, 50 -7, 50');
	await expect(newEdge).toHaveAttribute('style', 'stroke: yellow; stroke-width: 4px;');

	await page.locator('.svelvet-anchor').first().click();

	await page.getByRole('button', { name: 'Custom Label' }).click();

	const removedEdge = page.locator('[id="A-1/N-node1+A-2/N-node2"]');
	const elementCount = await removedEdge.count();
	expect(elementCount).toBe(0);
});
