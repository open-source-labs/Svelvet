// the knob is an accessible,flexible component that directly interfaces w
// svelte's custom input and output stores. Controlled via keyboard input,
// arrow keys, scroll and click and drag.

import { page } from '$app/stores';
import { expect, test } from '@playwright/test';

const testRoute = '/knob-test';

test('knob component should be draggable', async ({ page }) => {
	await page.goto(testRoute);

	// Define the label associated with the knob you want to test (selecting N-1 id which correlates to Volume )
	const knobID = 'knob';

	await page.waitForSelector(`#${knobID}`);

	// Find the draggable element with a specific aria-label attribute
	const draggableElement = await page.locator('[id="knob"]');

	// Calculate the target position for the drag (adjust as needed)
	const initialPosition = await draggableElement.boundingBox();

	const targetX = initialPosition.x + 100; // Adjust as needed
	const targetY = initialPosition.y + 100; // Adjust as needed

	// Simulate a mouse press (mousedown)
	await page.mouse.down(initialPosition.x, initialPosition.y);

	// Simulate dragging by moving the mouse
	await page.mouse.move(targetX, targetY);

	// Simulate a mouse release (mouseup)
	await page.mouse.up({ x: targetX, y: targetY });
	const updatedPosition = await draggableElement.boundingBox();

	// Check if the position and value have changed
	const positionChanged =
		initialPosition.x !== updatedPosition.x || initialPosition.y !== updatedPosition.y;

	expect(positionChanged).toBe(true);
});

test('Knob component test', async ({ page }) => {
	// Navigate to the page with the knob component
	await page.goto(testRoute);
	// Find the knob component
	const knob = await page.locator('.knob-value');
	await page.waitForTimeout(3000);
	//target position / move mouse
	await page.mouse.click(138.38, 370);

	await expect(knob).not.toHaveText('10');
});
