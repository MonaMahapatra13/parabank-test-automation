import { Page, expect } from "@playwright/test";

export class LoginPage {
  constructor(private page: Page) {}

  async login(username: string, password: string): Promise<void> {
    try {
      // Wait for login form to be visible
      await this.page.waitForSelector('form[name="login"]', {
        state: "visible",
      });

      // Fill login form
      await this.page.fill('input[name="username"]', username);
      await this.page.fill('input[name="password"]', password);

      // Click login and wait for navigation to complete
      await Promise.all([
        this.page.waitForNavigation({ waitUntil: "networkidle" }),
        this.page.click('input[value="Log In"]'),
      ]);

      // Verify login was successful
      const errorMessage = await this.page.locator(".error").isVisible();
      if (errorMessage) {
        const error = await this.page.locator(".error").innerText();
        throw new Error(`Login failed: ${error}`);
      }

      // Wait for account overview to be visible
      await this.page.waitForSelector("h1.title", { state: "visible" });
    } catch (err) {
      const error = err as Error;
      console.error(
        "❌ Login failed:",
        error.message || "Unknown error occurred"
      );
      throw error;
    }
  }
}
