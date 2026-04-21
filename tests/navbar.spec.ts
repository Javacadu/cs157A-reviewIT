import { test, expect } from '@playwright/test';

test.describe('Navbar Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Clear sessionStorage before each test
    await page.addInitScript(() => {
      sessionStorage.clear();
    });
    // Navigate to home page first
    await page.goto('/');
  });

  test.describe('1. Nav button navigation', () => {
    test('Click "Home" → goes to "/"', async ({ page }) => {
      // Already on home, click the Home link
      await page.click('nav >> text=Home');
      await expect(page).toHaveURL('http://localhost:3000/');
      // Should still show the home page content
      await expect(page.locator('h1')).toContainText('Rate. Review. Discover.');
    });

    test('Click "Browse" → goes to "/search"', async ({ page }) => {
      await page.click('nav >> text=Browse');
      await expect(page).toHaveURL('http://localhost:3000/search');
    });

    test('Click "Sign in" → goes to "/auth"', async ({ page }) => {
      await page.click('nav >> text=Sign in');
      await expect(page).toHaveURL('http://localhost:3000/auth');
    });
  });

  test.describe('2. Back button functionality', () => {
    test('Navigate from Home → Browse → Sign in, then back to Browse, then Home', async ({ page }) => {
      // Start at Home
      await expect(page).toHaveURL('http://localhost:3000/');
      
      // Navigate to Browse
      await page.click('nav >> text=Browse');
      await expect(page).toHaveURL('http://localhost:3000/search');
      
      // Navigate to Sign in
      await page.click('nav >> text=Sign in');
      await expect(page).toHaveURL('http://localhost:3000/auth');
      
      // Click Back button - should go to Browse
      await page.click('button:has-text("← Back")');
      await expect(page).toHaveURL('http://localhost:3000/search');
      
      // Click Back button again - should go to Home
      await page.click('button:has-text("← Back")');
      await expect(page).toHaveURL('http://localhost:3000/');
    });
  });

  test.describe('3. Edge cases', () => {
    test('On Home page, Back button should be disabled', async ({ page }) => {
      // Start at Home
      await expect(page).toHaveURL('http://localhost:3000/');
      
      // Back button should be disabled
      const backButton = page.locator('button:has-text("← Back")');
      await expect(backButton).toBeDisabled();
      
      // Should have the disabled styling class
      await expect(backButton).toHaveClass(/cursor-not-allowed/);
    });

    test('Refresh page → history persists via sessionStorage', async ({ page }) => {
      // Navigate Home → Browse → Sign in
      await page.click('nav >> text=Browse');
      await expect(page).toHaveURL('http://localhost:3000/search');
      
      await page.click('nav >> text=Sign in');
      await expect(page).toHaveURL('http://localhost:3000/auth');
      
      // Refresh the page
      await page.reload();
      await expect(page).toHaveURL('http://localhost:3000/auth');
      
      // Back button should still work - click it
      await page.click('button:has-text("← Back")');
      await expect(page).toHaveURL('http://localhost:3000/search');
      
      // Back again
      await page.click('button:has-text("← Back")');
      await expect(page).toHaveURL('http://localhost:3000/');
    });

    test('Use browser back button → should work correctly', async ({ page }) => {
      // Navigate using nav links
      await page.click('nav >> text=Browse');
      await expect(page).toHaveURL('http://localhost:3000/search');
      
      await page.click('nav >> text=Sign in');
      await expect(page).toHaveURL('http://localhost:3000/auth');
      
      // Use browser's back button
      await page.goBack();
      await expect(page).toHaveURL('http://localhost:3000/search');
      
      // Use browser's back button again
      await page.goBack();
      await expect(page).toHaveURL('http://localhost:3000/');
    });

    test('Back button enables after navigating away from home', async ({ page }) => {
      // Initially on Home - back button disabled
      const backButton = page.locator('button:has-text("← Back")');
      await expect(backButton).toBeDisabled();
      
      // Navigate to Browse
      await page.click('nav >> text=Browse');
      
      // Now back button should be enabled
      await expect(backButton).toBeEnabled();
    });
  });
});
