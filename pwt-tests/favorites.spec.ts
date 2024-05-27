import { test, expect, ElementHandle } from '@playwright/test';

test.describe('Favorites', () => {

  test('Checking for redirection when clicking on a bookmark', async ({ page }) => {
    await page.goto('http://localhost:5173/');

    const linkButton = page.locator('.header__nav-link');
    const logoutButton = await page.locator('.header__signout').isVisible();

    if (logoutButton) {
      await linkButton.click();
    }

    await page.waitForSelector('.bookmark-button');
    await page.locator('.bookmark-button').first().click();

    const url = page.url();
    expect(url).toBe('http://localhost:5173/login');
  });

  test('Checking for redirection when going to favorites page', async ({ page }) => {
    await page.goto('http://localhost:5173/');

    const linkButton = page.locator('.header__nav-link');
    const logoutButton = await page.locator('.header__signout').isVisible();

    if (logoutButton) {
      await linkButton.click();
    }

    await page.goto('http://localhost:5173/favorites');
    await page.waitForURL('http://localhost:5173/login');
  });


  test('Checking for bookmarking with signed in', async ({ page }) => {

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

    await page.click('.header__nav-link');
    await page.waitForSelector('.header__logo-link');
    const bookmarkButtons = await page.$$('.bookmark-button');

    for (const button of bookmarkButtons) {
      await button.click();

      await page.waitForTimeout(500);
    }

    expect(await page.$('.bookmark-button')).toBeNull();
    await page.click('.header__logo-link');

    await page.waitForURL('http://localhost:5173/');
    await page.waitForSelector('.header__favorite-count');
    const initialFavoriteCount = parseInt(await page.textContent('.header__favorite-count'));

    await page.waitForSelector('.place-card');

    const firstInactiveBookmarkCard: ElementHandle<SVGElement | HTMLElement>[] = [];
    for (const card of await page.$$('.place-card')) {
      const isBookmarkActive = await card.$('.place-card__bookmark-button--active');
      if (!isBookmarkActive) {
        firstInactiveBookmarkCard.push(card);
        break;
      }
    }

    const cardNameElement = await firstInactiveBookmarkCard[0]?.$('.place-card__name');
    const cardName = await cardNameElement?.textContent();

    const btn = await firstInactiveBookmarkCard[0].$('.place-card__bookmark-button');
    await btn?.click();
    await firstInactiveBookmarkCard[0]?.waitForSelector('.place-card__bookmark-button--active');

    const newFavoriteCount = parseInt(await page.textContent('.header__favorite-count'));

    expect(newFavoriteCount).toBe(initialFavoriteCount + 1)

    await page.goto('http://localhost:5173/favorites');
    await page.waitForSelector('.favorites__card');

    const favoriteCards = await page.$$('.place-card__name');

    const matchingCards = await Promise.all(
      favoriteCards.map(async (card) => {
        const cardNameText = await card?.textContent();
        return cardNameText === cardName;
      })
    );

    const matchingCardCount = matchingCards.filter(Boolean).length;
    expect(matchingCardCount).toBe(1);
  });
});
