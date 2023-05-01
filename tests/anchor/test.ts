import { expect, test } from '@playwright/test';

const testRoute = '/tests';

test('anchors can be connected and event fires', async ({ page }) => {
	await page.goto(testRoute);
	const sourceAnchor = page.locator('[id="A-2/N-node1"]');
	const targetAnchor = page.locator('[id="A-1/N-node2"]');

	// Create a Promise that resolves when the expected console message is encountered
	// const connectedPromise = new Promise<void>((resolve, reject) => {
	// 	page.on('console', (consoleMessage) => {
	// 		const text = consoleMessage.text();
	// 		if (text === 'node2 connected') {
	// 			resolve();
	// 		}
	// 	});

	// 	// Timeout if the expected message isn't encountered within a specified time
	// 	setTimeout(() => {
	// 		reject(new Error('Connect message not found within the specified time'));
	// 	}, 5000); // Adjust the timeout duration as needed
	// });

	// const disconnectedPromise = new Promise<void>((resolve, reject) => {
	// 	page.on('console', (consoleMessage) => {
	// 		const text = consoleMessage.text();
	// 		if (text === 'node2 disconnected') {
	// 			resolve();
	// 		}
	// 	});

	// 	// Timeout if the expected message isn't encountered within a specified time
	// 	setTimeout(() => {
	// 		reject(new Error('Disconnect message not found within the specified time'));
	// 	}, 5000); // Adjust the timeout duration as needed
	// });

	await sourceAnchor.dragTo(targetAnchor);

	const newEdge = page.locator('[id="A-1/N-node2+A-2/N-node1"]');

	await expect(newEdge).toHaveAttribute('d', 'M 206, 50 C 250, 50 250, 350 294, 350');
	//await expect(newEdge).toHaveAttribute('style', 'stroke: white; stroke-width: 2px;');
	await expect(newEdge).toHaveCSS('stroke', 'rgb(255, 255, 255)');
	await expect(newEdge).toHaveCSS('stroke-width', '2px');

	// Wait for the connected message
	//await connectedPromise;

	const node = await page.locator('#N-3');

	await targetAnchor.dragTo(node);
	// Wait for the disconnected message
	//await disconnectedPromise;

	const removedEdge = page.locator('[id="A-1/N-node2+A-2/N-node1"]');
	const elementCount = await removedEdge.count();
	expect(elementCount).toBe(0);
});

test('outputs cannot be connected to outputs', async ({ page }) => {
	await page.goto(testRoute);
	const sourceAnchor = page.locator('[id="A-2/N-node1"]');
	const targetAnchor = page.locator('[id="A-2/N-node2"]');

	await sourceAnchor.dragTo(targetAnchor);

	const newEdge = page.locator('[id="A-2/N-node2+A-2/N-node1"]');

	await expect(newEdge.count()).resolves.toBe(0);
});
