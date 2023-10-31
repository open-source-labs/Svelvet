import { page } from '$app/stores';
import { expect, test } from '@playwright/test';

const testRoute = '/color-test';

test('should load the Color Picker component', async ({ page }) => {
	await page.goto(testRoute);
	//check if component has loaded
	const wheel = await page.$('.wheel');
	expect(wheel).not.toBeNull();
}); //test passes

test('should change color of the anchor when moved', async ({ page }) => {
	await page.goto(testRoute);
	//find color wheel and anchor
	await page.waitForSelector('.wheel');

	const anchor = await page.waitForSelector('.my-anchor');
	//grab anchor default color
	const defaultColor = await anchor.evaluate((anchor) =>
		getComputedStyle(anchor).getPropertyValue('--color')
	);
	// console.log('default',defaultColor)
	//now lets click on a specific location of the color wheel
	// console.log("beforeClick",await page.locator(".my-anchor").boundingBox())
	await page.mouse.click(220, 240);
	await page.waitForTimeout(1000);
	// console.log("afterClick",await page.locator(".my-anchor").boundingBox())
	const updatedColor = await anchor.evaluate((anchor) =>
		getComputedStyle(anchor).getPropertyValue('--color')
	);
	// console.log('update',updatedColor)
	expect(updatedColor).not.toBe(defaultColor);
});

//console logs here are showing that the acnhor color is indeeed changing
