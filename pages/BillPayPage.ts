import { Page, expect } from "@playwright/test";

export class BillPayPage {
  constructor(private page: Page) {}

  async payBill(fromAccount: string) {
    // Navigate to bill pay page
    await this.page.getByRole("link", { name: "Bill Pay" }).click();
    await this.page.waitForLoadState("networkidle");

    // Fill out payee information
    await this.page.fill('input[name="payee.name"]', "Utility Company");
    await this.page.fill('input[name="payee.address.street"]', "456 Water St");
    await this.page.fill('input[name="payee.address.city"]', "Cityville");
    await this.page.fill('input[name="payee.address.state"]', "CA");
    await this.page.fill('input[name="payee.address.zipCode"]', "90002");
    await this.page.fill('input[name="payee.phoneNumber"]', "5555555555");
    await this.page.fill('input[name="payee.accountNumber"]', "999999");
    await this.page.fill('input[name="verifyAccount"]', "999999");
    await this.page.fill('input[name="amount"]', "75");

    // Wait for account dropdowns to be populated
    console.log("Waiting for account selection to be ready...");
    await this.page.waitForSelector('select[name="fromAccountId"]', {
      state: "visible",
      timeout: 10000,
    });

    // Get available accounts and log them
    const accounts = await this.page.$$eval(
      'select[name="fromAccountId"] option',
      (options: HTMLOptionElement[]) =>
        options.map((opt) => ({ value: opt.value, text: opt.textContent }))
    );
    console.log("Available accounts:", accounts);

    // Verify our account is in the list
    const accountExists = accounts.some((acc) => acc.value === fromAccount);
    if (!accountExists) {
      throw new Error(
        `Account ${fromAccount} not found in dropdown. Available accounts: ${JSON.stringify(
          accounts
        )}`
      );
    }

    // Select the account
    console.log(`Selecting account: ${fromAccount}`);
    await this.page.selectOption('select[name="fromAccountId"]', fromAccount);

    // Submit the form
    console.log("Submitting payment form...");
    await this.page.click('input[value="Send Payment"]');

    // Wait for success message with retry logic
    const maxAttempts = 3;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        await expect(this.page.getByText("Bill Payment Complete")).toBeVisible({
          timeout: 10000,
        });
        console.log("Bill payment completed successfully");
        return;
      } catch (err) {
        if (attempt === maxAttempts) {
          throw new Error(
            "Failed to verify bill payment completion after multiple attempts"
          );
        }
        console.log(`Attempt ${attempt} failed, retrying...`);
        await this.page.waitForTimeout(2000);
      }
    }
  }
}
