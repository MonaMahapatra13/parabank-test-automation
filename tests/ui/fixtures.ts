import { test as base } from "@playwright/test";
import { HomePage } from "../../pages/HomePage";
import { LoginPage } from "../../pages/LoginPage";
import { getStoredTestUser } from "../../utils/testData";

// Declare the types of our fixtures
type TestFixtures = {
  loggedInPage: HomePage;
};

// Extend the base test with our fixtures
export const test = base.extend<TestFixtures>({
  loggedInPage: async ({ page }, use) => {
    const home = new HomePage(page);
    const login = new LoginPage(page);
    const storedUser = getStoredTestUser();

    console.log("Logging in with stored test user:", storedUser.username);

    // Navigate to home and wait for page load
    await home.navigate();
    await page.waitForLoadState("networkidle");

    // Perform login
    await login.login(storedUser.username, storedUser.password);

    // Wait for login to complete and verify
    await page.waitForLoadState("networkidle");
    const logoutLink = page.getByRole("link", { name: "Log Out" });
    await logoutLink.waitFor({ state: "visible", timeout: 10000 });

    console.log("Login successful");

    // Use the logged-in page in the test
    await use(home);
  },
});

export { expect } from "@playwright/test";
