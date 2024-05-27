import { test, expect } from '@playwright/test';

test.describe('Login Form', () => {

  test('Verifying login with correct data', async ({ page }) => {
    await page.goto('http://localhost:5173/');

    await page.waitForSelector('.header__nav-link');
    const linkButton = await page.$('.header__nav-link');
    const logoutButton = await page.$('.header__signout');

    if (logoutButton) {
      await linkButton?.click();
      await page.waitForSelector('.header__nav-link');
    }

    await linkButton?.click();
    await page.waitForURL('http://localhost:5173/login');

    await page.fill('input[name="email"]', 'CorrectEmail@gmail.com');
    await page.fill('input[name="password"]', 'CorrectPassword123');
    await page.click('button[type="submit"]');

    const url = page.url();
    expect(url).toBe('http://localhost:5173/');
  });

  test('Checking for errors when logging in with incorrect data', async ({
    page,
  }) => {
    await page.goto('http://localhost:5173/');

    await page.waitForSelector('.header__nav-link');
    const linkButton = await page.$('.header__nav-link');
    const logoutButton = await page.$('.header__signout');

    if (logoutButton) {
      await linkButton?.click();
      await page.waitForSelector('.header__nav-link');
    }

    await linkButton?.click();
    await page.waitForURL('http://localhost:5173/login');

    await page.fill('input[name="email"]', 'CorrectEmail@gmail.com');
    await page.fill('input[name="password"]', 'IncorrectPassword');
    await page.click('button[type="submit"]');

    await page.waitForSelector('.Toastify__toast-body');

    const url = page.url();
    expect(url).toBe('http://localhost:5173/login');
  });
});
