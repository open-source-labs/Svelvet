// import { test, expect } from '@playwright/test';
// import { injectAxe, checkA11y } from 'axe-playwright';

// const testRoute = '/tests';

// test('Page has no accessibility violations', async ({ page }) => {
//   await page.goto('http://localhost:5173/tests'); // replace with your test page URL

//   await injectAxe(page);
//   const violations = await checkA11y(page);

//   expect(violations).toHaveLength(0);
// });

// // import type { Browser, Page } from 'playwright';
// // import { chromium, test } from '@playwright/test';
// // import { injectAxe, checkA11y } from 'axe-playwright';

// // let browser: Browser;
// // let page: Page;

// // test.describe('Playwright web page accessibility test', () => {
// // 	test.beforeAll(async () => {
// // 		browser = await chromium.launch();
// // 		page = await browser.newPage();
// // 		await page.goto('http://localhost:5173/tests');
// // 		await injectAxe(page);
// // 	});

// // 	test('simple accessibility run', async () => {
// // 		await checkA11y(page, null, {
// // 			axeOptions: {},
// // 			detailedReport: true,
// // 			detailedReportOptions: {
// // 				html: true
// // 			}
// // 		});
// // 	});
// // });
