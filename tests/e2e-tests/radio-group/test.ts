import { expect, test } from '@playwright/test';

const testRoute = '/radio-group';

const options = ['subtract', 'add', 'multiply', 'divide'];

test('radio group renders the options as radio buttons', async ({ page }) => {
	await page.goto(testRoute);

	// test that radio button is rendered for each option on the node
	await expect(page.locator('#N-1 button')).toHaveCount(4);

	// test that each options is rendered in the node with the right label
	const buttons = page.locator('.radio-group button');
	// iterate through the options array and buttons
	for (let i = 0; i < options.length; i++) {
		// grab each button
		const button = buttons.nth(i);
		// check its text against options array
		await expect(button).toHaveText(options[i]);
	}
});

test('radio group selection changes parameter store', async ({ page }) => {
	await page.goto(testRoute);

	// test that click on an option selects it and changes value of param store
	// check that parameter store is storing the value of the selected radio button

	// since the first option is selected by default, check that parameter store is equal to first option
	// the second node on the page is displaying the value of the parameter store
	await expect(page.locator('#N-2')).toHaveText(options[0]);

	// grab all radio buttons
	const buttons = page.locator('.radio-group button');
	// iterate through remaining options, click corresponding button, check parameter store that it matches
	for (let i = 1; i < options.length; i++) {
		// grab each button
		const button = buttons.nth(i);
		await button.click();
		// check its text against options array
		await expect(page.locator('#N-2')).toHaveText(options[i]);
	}
});
