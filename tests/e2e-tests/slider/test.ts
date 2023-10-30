import { expect, test } from '@playwright/test';

const testRoute = '/slider-tests';

test('slider functionality transmits data', async ({ page }) => {
	await page.goto(testRoute);

	const outputNum = page.locator('#output-num');

	// transmits initial value
	await expect(outputNum).toHaveText('10');

	// get buttons
	const buttons = await page.$$('.button');

	// plus button increments value
	const plusBtn = buttons[1];
	await plusBtn.click();
	await expect(outputNum).toHaveText('11');

	// minus button decrements value
	const minusBtn = buttons[0];
	await minusBtn.click();
	await expect(outputNum).toHaveText('10');

	// value changes on drag
	await page.locator('#slider-input').hover();
	await page.mouse.down();
	await outputNum.hover();
	await page.mouse.up();
	await expect(outputNum).toHaveText('100');

	// can double click to type new value
	await page.locator('#slider-input').dblclick();
	await page.keyboard.press('Digit5');
	await page.keyboard.press('Enter');
	await expect(outputNum).toHaveText('5');
});
