import { test, expect } from '@playwright/test';

/**
 * Auth Flow Test Suite
 * Tests: register, login, logout, protected routes
 */
test.describe('Auth Flow', () => {
  // Each test gets a fresh unique user
  const uniqueId = () => Date.now().toString(36) + Math.random().toString(36).slice(2);

  test.beforeEach(async ({ page }) => {
    // Clear cookies before each test
    await page.context().clearCookies();
  });

  test('1. Register new user creates account and shows username', async ({ page }) => {
    const username = `user_${uniqueId()}`;
    const email = `${username}@test.com`;
    const password = 'testpass123';

    // Go to auth and register
    await page.goto('/auth');
    await page.getByRole('button', { name: 'Create one' }).click();
    await page.fill('#register-username', username);
    await page.fill('#register-email', email);
    await page.fill('#register-password', password);
    await page.getByRole('button', { name: 'Create Account' }).click();

    // Wait for navigation
    await page.waitForLoadState('networkidle');
    
    // Should be on home page
    const url = page.url();
    expect(url).toBe('http://localhost:3000/');

    // Navbar should show username
    const nav = page.locator('header nav');
    await expect(nav).toContainText(username);
  });

  test('2. Duplicate username shows error', async ({ page }) => {
    const username = `user_${uniqueId()}`;
    const email = `${username}@test.com`;
    const password = 'testpass123';

    // First register
    await page.goto('/auth');
    await page.getByRole('button', { name: 'Create one' }).click();
    await page.fill('#register-username', username);
    await page.fill('#register-email', email);
    await page.fill('#register-password', password);
    await page.getByRole('button', { name: 'Create Account' }).click();
    await page.waitForLoadState('networkidle');

    // Try again with same username
    await page.goto('/auth');
    await page.getByRole('button', { name: 'Create one' }).click();
    await page.fill('#register-username', username);
    await page.fill('#register-email', `diff_${email}`);
    await page.fill('#register-password', 'otherpass');
    await page.getByRole('button', { name: 'Create Account' }).click();

    // Wait for error
    await page.waitForLoadState('networkidle');

    // Should show error
    await expect(page.getByText('Username taken, try another')).toBeVisible();
  });

  test('3. Login with wrong password shows error', async ({ page }) => {
    const username = `user_${uniqueId()}`;
    const email = `${username}@test.com`;
    const password = 'testpass123';

    // Register first
    await page.goto('/auth');
    await page.getByRole('button', { name: 'Create one' }).click();
    await page.fill('#register-username', username);
    await page.fill('#register-email', email);
    await page.fill('#register-password', password);
    await page.getByRole('button', { name: 'Create Account' }).click();
    await page.waitForLoadState('networkidle');

    // Try login with wrong password
    await page.goto('/auth');
    await page.fill('#login-username', username);
    await page.fill('#login-password', 'wrongpassword');
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Wait for error
    await page.waitForLoadState('networkidle');

    // Should show error
    await expect(page.getByText('Invalid username or password')).toBeVisible();
  });

  test('4. Logout button clears session', async ({ page }) => {
    const username = `user_${uniqueId()}`;
    const email = `${username}@test.com`;
    const password = 'testpass123';

    // Register (which logs in)
    await page.goto('/auth');
    await page.getByRole('button', { name: 'Create one' }).click();
    await page.fill('#register-username', username);
    await page.fill('#register-email', email);
    await page.fill('#register-password', password);
    await page.getByRole('button', { name: 'Create Account' }).click();
    await page.waitForLoadState('networkidle');

    // Verify logged in
    await expect(page.locator('header nav')).toContainText(username);

    // Click logout (case insensitive match)
    await page.locator('header nav button').filter({ hasText: /logout/i }).click();
    await page.waitForLoadState('networkidle');

    // Should show Sign in
    await expect(page.locator('header nav')).toContainText('Sign in');
  });

  test('5. Unauthenticated user redirected to /auth', async ({ page }) => {
    // Go directly to protected route
    await page.goto('/reviews');
    
    // Should redirect to auth
    await expect(page).toHaveURL(/\/auth/);
  });

  test('6. Authenticated user can access protected route', async ({ page }) => {
    const username = `user_${uniqueId()}`;
    const email = `${username}@test.com`;
    const password = 'testpass123';

    // Register first
    await page.goto('/auth');
    await page.getByRole('button', { name: 'Create one' }).click();
    await page.fill('#register-username', username);
    await page.fill('#register-email', email);
    await page.fill('#register-password', password);
    await page.getByRole('button', { name: 'Create Account' }).click();
    await page.waitForLoadState('networkidle');

    // Now try /reviews
    await page.goto('/reviews');
    
    // Should NOT redirect - may 404 but not redirect to /auth
    const url = page.url();
    expect(url).not.toContain('/auth');
  });
});