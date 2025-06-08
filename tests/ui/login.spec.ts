import { test, expect } from './fixtures';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { getStoredTestUser } from '../utils/testData';

test.describe('Login Functionality', () => {
  test('Login with stored test user credentials', async ({ page }) => {
    console.log('Starting login test...');
    const storedUser = getStoredTestUser();

    const home = new HomePage(page);
    const login = new LoginPage(page);

    // Navigate to home page
    await home.navigate();
    await page.waitForLoadState('networkidle');

    console.log(`Attempting login with user: ${storedUser.username}`);
    await login.login(storedUser.username, storedUser.password);

    // Verify successful login by checking navigation menu
    await home.verifyGlobalNav();

    // Additional verification - check logout link is present
    await expect(page.getByRole('link', { name: 'Log Out' })).toBeVisible();

    // Verify we landed on the overview page after login
    await expect(page.getByRole('heading', { name: 'Accounts Overview' })).toBeVisible();

    console.log('Login test completed successfully');
  });

  test('Logout functionality', async ({ page }) => {
    console.log('Starting logout test...');
    const storedUser = getStoredTestUser();

    const home = new HomePage(page);
    const login = new LoginPage(page);

    // Login first
    await home.navigate();
    await login.login(storedUser.username, storedUser.password);
    await home.verifyGlobalNav();

    // Perform logout
    console.log('Attempting to log out...');
    await home.logout();

    // Verify logged out state
    await expect(page.locator('form[name="login"]')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Log Out' })).not.toBeVisible();

    console.log('Logout test completed successfully');
  });
});
