import { test, expect } from "@playwright/test";
import { generateUniqueUsername } from "../utils/generateUsername";
import { HomePage } from "../pages/HomePage";
import { RegisterPage } from "../pages/RegisterPage";

test.describe("User Registration", () => {
  test("Register new user with unique username", async ({ page }) => {
    console.log("Starting registration test...");

    // Start at homepage
    const homePage = new HomePage(page);
    await homePage.navigate();
    await page.waitForLoadState("networkidle");

    console.log("Navigating to registration page...");
    const registerPage = new RegisterPage(page);

    console.log("Generating test user data...");
    const username = generateUniqueUsername();
    const password = "Test@123";
    console.log("Test user data generated");

    console.log("Submitting registration form...");
    await registerPage.registerUser(username, password);
    console.log("Registration completed successfully");

    // Verify successful registration
    console.log("Verifying registration success...");
    expect(await registerPage.isRegistrationSuccessful()).toBeTruthy();
    console.log("Registration verification completed");
  });
});
