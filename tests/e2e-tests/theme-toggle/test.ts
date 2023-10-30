import { expect, test } from '@playwright/test';

const testRoute = '/theme-toggle';

test('theme toggle displays the correct theme', async ({ page }) => {
	await page.goto(testRoute);

	// default theme is light, check for light theme on root element first
	const root = page.locator('html');
	await expect(root).toHaveAttribute('svelvet-theme', 'light');
	// click toggle button to change theme to dark mode
	const toggleBtn = page.locator('.material-symbols-outlined');
	await toggleBtn.click();
	await expect(root).toHaveAttribute('svelvet-theme', 'dark');
	// click toggle button again to change theme back to light mode
	await toggleBtn.click();
	await expect(root).toHaveAttribute('svelvet-theme', 'light');
});
