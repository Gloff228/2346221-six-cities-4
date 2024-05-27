import { test, Locator } from '@playwright/test';

test.describe('City filter', () => {

  test('Checking card filtering', async ({ page }) => {

    await page.goto('http://localhost:5173/');
    await page.waitForSelector('.locations__item-link');

    const offersList: Locator[] = [];

    const citiesButtons = await page.locator('.locations__item-link').all();
    for (const cityButton of citiesButtons) {
      await cityButton.click();

      const cityCards = await page.locator('.cities__card').all();
      cityCards.forEach((card => {
        if (offersList.includes(card)) {
          throw new Error("Duplicate card found");
        } else {
          offersList.push(card);
        }
      }))
    }
  });
});
