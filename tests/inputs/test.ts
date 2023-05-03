import { expect, test } from '@playwright/test';

const testRoute = '/inputs';

test('inputs can be interacted with', async ({ page }) => {
	await page.goto(testRoute);

	// Grab the input elements for testing
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

	// Chcek that the value has changed
	await expect(textField).toHaveValue('TestABC');

	// Clear the input
	await textField.press('Backspace');
	await textField.press('Backspace');
	await textField.press('Backspace');
	await textField.press('Backspace');
	await textField.press('Backspace');
	await textField.press('Backspace');
	await textField.press('Backspace');
	await textField.press('Backspace');

	// Check that it was cleared
	await expect(textField).toHaveValue('');

	await textField.press('1');
	await textField.press('Space');
	await textField.press('2');

	await expect(textField).toHaveValue('1 2');

	if (!checkBox) throw new Error('Checkbox not found');
	// Check if the checkbox is checked
	const isChecked = await checkBox.isChecked();
	await expect(isChecked).toBe(true);
	// Click the checkbox
	await checkBox.click();

	const isNowChecked = await checkBox.isChecked();

	// Check the current value of the chebox
	await expect(isNowChecked).toBe(false);

	// Grab the graph element
	const graphWrapper = page.locator('.svelvet-graph-wrapper');

	// Check the transforms
	await expect(graphWrapper).toHaveAttribute('style', 'transform: translate(0px, 0px) scale(1);');

	// These commands should not affect the graph
	await textField.press('=');
	await textField.press('=');
	await textField.press('=');

	await expect(graphWrapper).toHaveAttribute('style', 'transform: translate(0px, 0px) scale(1);');

	await textField.press('-');
	await textField.press('-');

	await expect(graphWrapper).toHaveAttribute('style', 'transform: translate(0px, 0px) scale(1);');

	await textField.press('0');
	await textField.press('0');

	await expect(graphWrapper).toHaveAttribute('style', 'transform: translate(0px, 0px) scale(1);');
});
