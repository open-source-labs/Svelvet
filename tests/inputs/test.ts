import { expect, test } from '@playwright/test';

const testRoute = '/inputs';

test('inputs can be interacted with', async ({ page }) => {
	await page.goto(testRoute);

	const textField = page.locator('#text-test');
	const checkBox = page.locator('#checkbox-test');

	// Check current value of text input
	await expect(textField).toHaveValue('Test');

	// Click the text field and ensure that it is focused
	await textField.click();
	await expect(textField).toBeFocused();

	// Interact with the input by issuing keydown commands
	await textField.press('A');
	await textField.press('B');
	await textField.press('C');

	await expect(textField).toHaveValue('TestABC');

	await textField.press('Backspace');
	await textField.press('Backspace');
	await textField.press('Backspace');
	await textField.press('Backspace');
	await textField.press('Backspace');
	await textField.press('Backspace');
	await textField.press('Backspace');
	await textField.press('Backspace');

	await textField.press('1');
	await textField.press('Space');
	await textField.press('2');

	await expect(textField).toHaveValue('1 2');

	// Select the checkbox element
	const checkbox = await page.$('#checkbox-test');
	if (!checkbox) throw new Error('Checkbox not found');
	// Check if the checkbox is checked
	const isChecked = await checkbox.isChecked();
	await expect(isChecked).toBe(true);
	// Click the checkbox
	await checkBox.click();

	const isNowChecked = await checkbox.isChecked();
	// Check the current value of the chebox
	await expect(isNowChecked).toBe(false);
});
