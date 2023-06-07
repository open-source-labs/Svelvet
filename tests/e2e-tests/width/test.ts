import { expect, test } from '@playwright/test';

const testRoute = '/width-tests';

test('default node no dimensions', async ({ page }) => {
	await page.goto(testRoute);
	const node = page.locator('#N-no-dimensions');
	await expect(node).toHaveCSS('width', '200px');
	await expect(node).toHaveCSS('height', '100px');
});

test('default node with dimensions', async ({ page }) => {
	await page.goto(testRoute);
	const node = page.locator('#N-dimensions');
	await expect(node).toHaveCSS('width', '400px');
	await expect(node).toHaveCSS('height', '200px');
});

test('default node with v6 props', async ({ page }) => {
	await page.goto(testRoute);
	const node = page.locator('#N-v6-props');
	await expect(node).toHaveCSS('width', '600px');
	await expect(node).toHaveCSS('height', '300px');
});

test('default node with both', async ({ page }) => {
	await page.goto(testRoute);
	const node = page.locator('#N-both');
	await expect(node).toHaveCSS('width', '150px');
	await expect(node).toHaveCSS('height', '10px');
});

test('default node with just v6 width', async ({ page }) => {
	await page.goto(testRoute);
	const node = page.locator('#N-v6-width');
	await expect(node).toHaveCSS('width', '600px');
	await expect(node).toHaveCSS('height', '600px');
});

test('default node with just v6 height', async ({ page }) => {
	await page.goto(testRoute);
	const node = page.locator('#N-v6-height');
	await expect(node).toHaveCSS('width', '300px');
	await expect(node).toHaveCSS('height', '300px');
});

test('default node with width only', async ({ page }) => {
	await page.goto(testRoute);
	const node = page.locator('#N-width-only');
	await expect(node).toHaveCSS('width', '100px');
	await expect(node).toHaveCSS('height', '100px');
});

test('custom node fit-content', async ({ page }) => {
	await page.goto(testRoute);
	const node = page.locator('#N-8');
	await expect(node).toHaveCSS('width', '150px');
	await expect(node).toHaveCSS('height', '600px');
});

test('custom node px value', async ({ page }) => {
	await page.goto(testRoute);
	const node = page.locator('#N-9');
	await expect(node).toHaveCSS('width', '250px');
	await expect(node).toHaveCSS('height', '300px');
});

test('custom node with dimensions props and CSS 100%', async ({ page }) => {
	await page.goto(testRoute);
	const node = page.locator('#N-10');
	await expect(node).toHaveCSS('width', '220px');
	await expect(node).toHaveCSS('height', '87px');
});
