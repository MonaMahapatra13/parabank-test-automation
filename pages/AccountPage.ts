import { Page, expect } from "@playwright/test";

export class AccountPage {
  constructor(private page: Page) {}

  async openNewSavingsAccount(): Promise<string> {
    // Navigate to open account page
    await this.page.getByRole("link", { name: "Open New Account" }).click();
    await this.page.waitForLoadState("networkidle");

    // Wait for the form to be ready
    await this.page.waitForSelector("#type", { state: "visible" });

    // Select account type (SAVINGS)
    await this.page.selectOption("#type", "SAVINGS");
    await this.page.waitForTimeout(1000); // Give time for the dropdown to update

    // Find and select from account - this account should exist from registration
    await this.page.waitForSelector("#fromAccountId", { state: "visible" });
    const options = await this.page.$$eval(
      "#fromAccountId option",
      (opts: HTMLOptionElement[]) =>
        opts.filter((opt) => opt.value !== "").map((opt) => opt.value)
    );

    console.log("Available account options:", options);

    if (options.length === 0) {
      throw new Error("No existing accounts found for transfer");
    }

    // Select the first account
    await this.page.selectOption("#fromAccountId", options[0]);
    await this.page.waitForTimeout(1000); // Give time for any UI updates

    // Click open new account and wait for result
    await Promise.all([
      this.page.waitForResponse(
        (response) =>
          response.url().includes("services_proxy/bank/createAccount") &&
          response.status() === 200
      ),
      this.page.click('input[value="Open New Account"]'),
    ]);

    // Get the new account number
    await this.page.waitForSelector("#newAccountId", { state: "visible" });
    const accountNumberText = await this.page
      .locator("#newAccountId")
      .innerText();
    const accountNumber = accountNumberText.trim();

    if (!accountNumber) {
      throw new Error("Failed to get new account number");
    }

    console.log(`Account created successfully: ${accountNumber}`);
    return accountNumber;
  }

  async verifyAccountInOverview(accountNumber: string): Promise<void> {
    // Navigate to accounts overview
    await this.page.getByRole("link", { name: "Accounts Overview" }).click();
    await this.page.waitForLoadState("networkidle");

    // Wait for account table to be visible
    await this.page.waitForSelector("#accountTable", {
      state: "visible",
      timeout: 10000,
    });

    // Find account link and verify it's visible
    const accountLink = this.page.getByRole("link", { name: accountNumber });
    await expect(accountLink).toBeVisible({ timeout: 10000 });

    // Click on account to view details
    await accountLink.click();
    await this.page.waitForLoadState("networkidle");

    // Verify account details page loaded
    await this.page.waitForSelector("#balance", { state: "visible" });
    const balanceText = await this.page.locator("#balance").innerText();
    console.log(`Balance displayed: ${balanceText}`);

    // Validate balance format
    expect(balanceText).toMatch(/^\$\d+(\.\d{2})?$/);
  }
}
