import { Page, expect } from "@playwright/test";

export class HomePage {
  constructor(private page: Page) {}

  async navigate() {
    await this.page.goto("https://parabank.parasoft.com/parabank/index.htm");
  }

  async goToRegisterPage() {
    await this.page.click("text=Register");
  }

  async logout() {
    await this.page.click("text=Log Out");
  }

  async verifyGlobalNav() {
    // Use more specific selectors that match the actual structure
    await this.page.waitForLoadState("networkidle");

    // Get all navigation links and verify each one
    const navItems = [
      "Accounts Overview",
      "Open New Account",
      "Transfer Funds",
      "Bill Pay",
      "Find Transactions",
    ];

    for (const item of navItems) {
      await expect(this.page.getByRole("link", { name: item })).toBeVisible({
        timeout: 10000,
      });
    }
  }
}
