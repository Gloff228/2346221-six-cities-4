import { test, expect } from '@playwright/test';

test.describe('Offer page', () => {

  test('Checking the jump to the offer page', async ({ page }) => {
    await page.goto('http://localhost:5173/');

    await page.waitForSelector('.cities__card');

    const firstCard = await page.$('.cities__card');

    const price = await firstCard?.$eval('.place-card__price-value', el => el.textContent?.replace('€', '').trim());
    const rating = await firstCard?.$eval('.place-card__stars span', el => parseFloat(el.style.width) / 20);
    const title = await firstCard?.$eval('.place-card__name', el => el.textContent?.trim());
    const card_type = await firstCard?.$eval('.place-card__type', el => el.textContent?.trim());

    await firstCard?.click();
    await page.waitForSelector('.offer__name');

    const newPrice = await page.$eval('.offer__price-value', el => el.textContent?.replace('€', '').trim());
    const newRatingText = await page.$eval('.offer__rating-value', el => el.textContent?.trim() || '');
    const newRating = parseFloat(newRatingText);
    const newTitle = await page.$eval('.offer__name', el => el.textContent?.trim());
    const newType = await page.$eval('.offer__feature--entire', el => el.textContent?.trim());


    expect(newPrice).toBe(price);
    expect(newRating).toBe(rating);
    expect(newTitle).toBe(title);
    expect(newType).toBe(card_type);
  });
});
