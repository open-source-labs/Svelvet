// the knob is an accessible,flexible component that directly interfaces w
// svelte's custom input and output stores. Controlled via keyboard input,
// arrow keys, scroll and click and drag.


import { page } from '$app/stores';
import { expect, test } from '@playwright/test';


const testRoute = '/knob-test';


//example from playWright --->


//import { test, expect } from '@playwright/test';


// test('has title', async ({ page }) => {
//     await page.goto('https://playwright.dev/');


//     // Expect a title "to contain" a substring.
//     await expect(page).toHaveTitle(/Playwright/);
//   });


//   test('get started link', async ({ page }) => {
//     await page.goto('https://playwright.dev/');


//     // Click the get started link.
//     await page.getByRole('link', { name: 'Get started' }).click();


//     // Expects page to have a heading with the name of Installation.
//     await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
//   });


//example end


//the knob component should load
//the knob component should repsonse to mouse input
//the knob component should rotate when clicked


// test('should load the Svelte knob component', async ({ page }) => {
//     await page.goto(testRoute);
//     //check if component has loaded
//     const knob = await page.$('#knob');
//     expect(knob).not.toBeNull();
// }); //test passes


test('knob component should be draggable', async ({ page }) => {
    await page.goto(testRoute);


    // Define the label associated with the knob you want to test (selecting N-1 id which correlates to Volume )
    const knobID = 'knob';


    await page.waitForSelector(`#${knobID}`);


    // Find the draggable element with a specific aria-label attribute
    const draggableElement = await page.locator('[id="knob"]');
    // console.log("de",draggableElement)
    // Get the initial value of the knob
    // const initialValue = await draggableElement.getAttribute('aria-valuenow');
    // console.log("IV",initialValue);


    // Calculate the target position for the drag (adjust as needed)
    const initialPosition = await draggableElement.boundingBox();
    // console.log("Init Pos:",initialPosition);
    const targetX = initialPosition.x + 100; // Adjust as needed
    const targetY = initialPosition.y + 100; // Adjust as needed


    // Simulate a mouse press (mousedown)
    await page.mouse.down(initialPosition.x, initialPosition.y);


    // Simulate dragging by moving the mouse
    await page.mouse.move(targetX, targetY);


    // Simulate a mouse release (mouseup)
    await page.mouse.up({ x: targetX, y: targetY });
    const updatedPosition = await draggableElement.boundingBox();
    // console.log("Updated Position:", updatedPosition);


    // Get the updated value of the knob
    // const updatedValue = await draggableElement.getAttribute('aria-valuenow');
    // console.log("Updated Value:", updatedValue);


    // Check if the position and value have changed
    const positionChanged =
        initialPosition.x !== updatedPosition.x || initialPosition.y !== updatedPosition.y;
    // console.log("Position Changed:", positionChanged);


    // const valueChanged = initialValue !== updatedValue;
    // console.log("Value Changed:", valueChanged);


    // Add your assertion to verify if the value has changed
    // expect(valueChanged).toBe(true);
    expect(positionChanged).toBe(true);
});


test('Knob component test', async ({ page }) => {
    // Navigate to the page with the knob component
    await page.goto(testRoute);


    // Find the knob component
    const knob = await page.locator('.knob-value');
    console.log('beforeClick', await page.locator('#knob').boundingBox());
    //target position / move mouse
    await page.mouse.click(138.38, 370);
    // console.log(await page.locator("#knob").boundingBox())
    await expect(knob).not.toHaveText('10');
});
