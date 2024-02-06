// Below is a simple accessibility test to check for accessibility violations.
// I hope that you can either address the violations either manually going in and fixing or by creating a linter.
// Uncommment below and run `npm run test` in the terminal to run the accessibility test.

// import { test, expect } from '@playwright/test';
// import { injectAxe, checkA11y } from 'axe-playwright';

// // Define the URL of the page you want to test
// const testRoute = 'http://localhost:4173/';

// // Define a test using Playwright's test function
// test('Page has no accessibility violations', async ({ page }) => {
//   // Navigate to the test page
//   await page.goto(testRoute); // replace with your test page URL

//   // Inject the axe-core library into the page
//   await injectAxe(page);

//   // Run axe's accessibility checks on the page
//   const violations = await checkA11y(page);

//   // Expect that there are no accessibility violations
//   expect(violations).toHaveLength(0);
// });
