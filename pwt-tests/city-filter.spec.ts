import { test, expect, ElementHandle } from '@playwright/test';

test.describe('City filter', () => {

  test('Checking card filtering', async ({ page }) => {

    await page.goto('http://localhost:5173/');
    await page.waitForSelector('.locations__item-link');

    const offersList: ElementHandle<SVGElement | HTMLElement>[] = [];

    const citiesButtons = await page.$$('.locations__item-link');
    for (const cityButton of citiesButtons) {
      await cityButton.click();
      await page.waitForSelector('.cities__card');

      const cityCards = await page.$$('.cities__card');
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
