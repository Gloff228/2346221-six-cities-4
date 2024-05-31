import { test, expect } from '@playwright/test';

test.describe('Comment', () => {
  test('Checking the functionality of the comment submission form', async ({ page }) => {
    const reviewText = 'This is a place for dreamers to reset, reflect, and create.';
    const rating = 'good';

    await page.goto('http://localhost:5173/');

    await page.waitForSelector('.header__nav-link');
    const linkButton = await page.$('.header__nav-link');
    const loginButton = await page.$('.header__login');

    if (loginButton) {
      await linkButton?.click();

      await page.fill('input[name="email"]', 'CorrectEmail@gmail.com');
      await page.fill('input[name="password"]', 'сorrectPassword123');

      await page.click('button[type="submit"]');
      await page.waitForURL('http://localhost:5173/');
    }

    await page.waitForSelector('.cities__card');
    await page.locator('.cities__card').last().click();

    await page.waitForSelector('.reviews__form');
    const isCommentFormExist = await page.isVisible('.reviews__form');
    expect(isCommentFormExist).toBeTruthy();

    await page.fill('[name="review"]', reviewText);
    await page.getByTitle(rating).click();

    await page.click('button[type="submit"]');
    await page.waitForTimeout(500);

    const newReview = await page.$('.reviews__item');

    const newReviewText = await newReview?.$eval('.reviews__text', (el) => el.textContent?.trim());
    const newReviewAuthor = await newReview?.$eval('.reviews__user-name', (el) => el.textContent?.trim());
    const newReviewRating = await newReview?.$eval('.reviews__stars>span', (el) => el.getAttribute('style'))

    expect(newReviewText).toBe(reviewText);
    expect(newReviewAuthor).toBe('CorrectEmail');
    expect(newReviewRating).toBe('width: 80%;');
  });

  test('Checking that there is no form for submitting comments without logging', async ({ page }) => {
    await page.goto('http://localhost:5173/');

    await page.waitForSelector('.header__nav-link');
    const linkButton = page.locator('.header__nav-link');
    const loginButton = page.locator('.header__login');

    if (!loginButton) {
      await linkButton.click();
    }

    await page.locator('.cities__card').last().click();

    const isCommentFormExist = await page.locator('.reviews__form').isVisible();
    expect(isCommentFormExist).toBeFalsy();
  });
});
