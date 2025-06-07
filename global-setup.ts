import { chromium, FullConfig } from "@playwright/test";
import { HomePage } from "./pages/HomePage";
import { RegisterPage } from "./pages/RegisterPage";
import { testUser } from "./utils/testData";
import { writeFile } from "fs/promises";

async function globalSetup(config: FullConfig) {
  console.log("Starting global setup...");
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    console.log(`Attempting to register test user: ${testUser.username}`);

    const home = new HomePage(page);
    const register = new RegisterPage(page);

    // Navigate to home page
    await home.navigate();
    await page.waitForLoadState("networkidle");

    // Go to register page
    await home.goToRegisterPage();
    await page.waitForLoadState("networkidle");

    // Register the test user
    await register.registerUser(testUser.username, testUser.password);
    const success = await register.isRegistrationSuccessful();

    if (!success) {
      throw new Error("Failed to register test user");
    }

    // Verify automatic login after registration
    const logoutLink = page.getByRole("link", { name: "Log Out" });
    await logoutLink.waitFor({ state: "visible", timeout: 10000 });

    // Store credentials in .env file
    const envContent = `
TEST_USER_USERNAME=${testUser.username}
TEST_USER_PASSWORD=${testUser.password}
    `.trim();

    await writeFile(".env", envContent);
    console.log("Test user credentials saved to .env file");

    console.log(
      "Test user registered and automatically logged in successfully"
    );
  } catch (error) {
    console.error("Global setup failed:", error);
    throw error;
  } finally {
    await browser.close();
    console.log("Global setup completed");
  }
}

export default globalSetup;
