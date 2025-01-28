import { test, expect } from '@playwright/test';

const testRoute = '/drawer';

test.describe('Svelvet Component Tests', () => {
	test.beforeEach(async ({ page }) => {
		// Navigate to the page where your Svelvet component is rendered
		await page.goto(testRoute);
	});

	test('Drag and Drop Nodes', async ({ page }) => {
		// Assume there's a way to select nodes for dragging
		// This will depend on your implementation details
		const dragSource = await page.$('.node-drag-source');
		const dropTarget = await page.$('.drop_zone');

		if (dragSource && dropTarget) {
			// Simulate drag and drop
			await dragSource.dragTo(dropTarget);

			// Verify the drop action has been handled
			// This might include checking for a change in the number of nodes,
			// a specific class name indicating a drop, or any visual change.
			await expect(dropTarget).toHaveClass('expected-class-after-drop');
		}
	});

	test('DrawerController component', async ({ page }) => {
		// shows the drawer
		await page.keyboard.press('d');
		// Open the drawer
		await page.keyboard.press('D');

		// Check if Node is displayed
		const node = await page.$('text=Node');
		expect(node).toBeTruthy();

		// Press 'T' to toggle to Anchor
		await page.keyboard.press('T');
		const anchor = await page.$('text=Anchor');
		expect(anchor).toBeTruthy();

		// Press 'T' to toggle to Edge
		await page.keyboard.press('T');
		const edge = await page.$('text=Edge');
		expect(edge).toBeTruthy();

		// Press 'T' to toggle back to Node
		await page.keyboard.press('T');
		const nodeAgain = await page.$('text=Node');
		expect(nodeAgain).toBeTruthy();

		// Close the drawer
		await page.keyboard.press('D');
	});

	// ... more tests
});
