import { test, expect } from '@playwright/test';

test.describe('Offers card loading', () => {

  test('Checking the loading of cards from the server', async ({ page }) => {

    await page.goto('http://localhost:5173/');
    await page.waitForSelector('.cities__card');

    const cardElements = await page.$$('.cities__card');
    expect(cardElements.length).toBeGreaterThan(0);
  });
});
