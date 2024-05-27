import { test, expect } from '@playwright/test';

test.describe('Offers sorting', () => {

  test('Checking sorting by price', async ({ page }) => {

    await page.goto('http://localhost:5173/');
    await page.waitForSelector('.cities__card');

    const priceElements = await page.$$('.place-card__price-value');
    const prices: number[] = [];

    for (const element of priceElements) {
      const priceText = await element.innerText();
      prices.push(parseInt(priceText));
    }

    const expectedLowToHighPrices = prices.sort((a, b) => (a - b));
    const expectedHighToLowPrices = prices.sort((a, b) => (b - a));

    await page.click('.places__sorting-type');
    await page.click('text="Price: low to high"');

    await page.waitForSelector('.cities__card');

    const lowToHighPriceElements = await page.$$('.place-card__price-value');
    const lowToHighPrices: Number[] = [];

    for (const element of lowToHighPriceElements) {
      const priceText = await element.innerText();
      lowToHighPrices.push(parseInt(priceText));
    }

    await page.waitForSelector('.cities__card');

    const HighToLowPriceElements = await page.$$('.place-card__price-value');
    const highToLowPrices: Number[] = [];

    for (const element of HighToLowPriceElements) {
      const priceText = await element.innerText();
      highToLowPrices.push(parseInt(priceText));
    }

    expect(lowToHighPrices).toEqual(expectedLowToHighPrices);
    expect(highToLowPrices).toEqual(expectedHighToLowPrices);
  });
});
