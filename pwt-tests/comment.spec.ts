import { test, expect } from '@playwright/test';

test.describe('Favorites', () => {
  test('Checking the functionality of the comment submission form', async ({ page }) => {
    await page.goto('http://localhost:5173/');

    await page.waitForSelector('.header__nav-link');
    const linkButton = await page.$('.header__nav-link');
    const loginButton = await page.$('.header__login');

    if (loginButton) {
      await linkButton?.click();

      await page.fill('input[name="email"]', 'correctEmail@gmail.com');
      await page.fill('input[name="password"]', 'correctPassword123');

      await page.click('button[type="submit"]');
      await page.waitForURL('http://localhost:5173/');
    }

    await page.waitForSelector('.cities__card');
    await page.click('.cities__card');

    const commentForm = await page.waitForSelector('.reviews__form');
    expect(commentForm).toBeTruthy();

    const reviewText = 'This is a place for dreamers to reset, reflect, and create.';
    await page.fill('[name="review"]', reviewText);

    const ratingInputs = await page.$$('.form__rating-label');
    const selectedRating = ratingInputs[3];
    await selectedRating.click();

    await page.click('button[type="submit"]');

    await page.waitForTimeout(1000);

    const newReview = await page.$('.reviews__item');

    const newReviewText = await newReview?.$eval('.reviews__text', (el) => el.textContent?.trim());

    expect(newReviewText).toBe(reviewText);
  });

  test('Checking that there is no form for submitting comments without logging', async ({ page }) => {
    await page.goto('http://localhost:5173/');

    await page.waitForSelector('.header__nav-link');
    const linkButton = await page.$('.header__nav-link');
    const loginButton = await page.$('.header__login');

    if (!loginButton) {
      await linkButton?.click();
    }

    await page.waitForSelector('.cities__card');
    await page.click('.cities__card');
    await page.waitForSelector('.reviews__list');

    const commentForm = await page.$('.reviews__form');
    expect(commentForm).toBeFalsy();
  });
});
