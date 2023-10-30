import { expect, test } from '@playwright/test';

const testRoute = '/flowchart';
const mermaidStr = `A(Coffee machine not working) --> B{Machine has power?} 
B{Machine has power?} --> C(Test Node 1)
B{Machine has power?} --> D(Test Node 2)
C(Test Node 1) --> E(Test Node 3)`;

test('flowchart renders the correct nodes', async ({ page }) => {
	await page.goto(testRoute);

	const node1 = page.locator('[id="N-ACoffee machine not working"]');
	const node2 = page.locator('[id="N-BMachine has power?"]');
	const node3 = page.locator('[id="N-CTest Node 1"]');
	const node4 = page.locator('[id="N-DTest Node 2"]');
	const node5 = page.locator('[id="N-ETest Node 3"]');

	await expect(node1).toBeVisible();
	await expect(node1).toHaveClass(/^svelvet-node/);
	await expect(node1).toHaveText('ACoffee machine not working');

	await expect(node2).toBeVisible();
	await expect(node2).toHaveClass(/^svelvet-node/);
	await expect(node2).toHaveText('BMachine has power?');

	await expect(node3).toBeVisible();
	await expect(node3).toHaveClass(/^svelvet-node/);
	await expect(node3).toHaveText('CTest Node 1');

	await expect(node4).toBeVisible();
	await expect(node4).toHaveClass(/^svelvet-node/);
	await expect(node4).toHaveText('DTest Node 2');

	await expect(node5).toBeVisible();
	await expect(node5).toHaveClass(/^svelvet-node/);
	await expect(node5).toHaveText('ETest Node 3');
});

test('flowchart renders the correct edges', async ({ page }) => {
	await page.goto(testRoute);

	await expect(page.locator('.edge')).toHaveCount(4);

	// to add specific edge id's, unexpected error occurring when doing this
});
