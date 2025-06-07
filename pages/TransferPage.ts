import { Page, expect } from "@playwright/test";

export class TransferPage {
  constructor(private page: Page) {}

  async transferFunds(fromAcc: string, toAcc: string, amount: number) {
    // Navigate to transfer page
    await this.page.getByRole("link", { name: "Transfer Funds" }).click();
    await this.page.waitForLoadState("networkidle");

    // Wait for form elements
    console.log("Waiting for transfer form to be ready...");
    await this.page.waitForSelector("#fromAccountId", {
      state: "visible",
      timeout: 10000,
    });
    await this.page.waitForSelector("#toAccountId", {
      state: "visible",
      timeout: 10000,
    });

    // Get available accounts and verify
    const fromAccounts = await this.page.$$eval(
      "#fromAccountId option",
      (options: HTMLOptionElement[]) =>
        options.map((opt) => ({ value: opt.value, text: opt.textContent }))
    );
    console.log("Available source accounts:", fromAccounts);

    const toAccounts = await this.page.$$eval(
      "#toAccountId option",
      (options: HTMLOptionElement[]) =>
        options.map((opt) => ({ value: opt.value, text: opt.textContent }))
    );
    console.log("Available destination accounts:", toAccounts);

    // Verify both accounts exist in the dropdowns
    const fromAccExists = fromAccounts.some((acc) => acc.value === fromAcc);
    const toAccExists = toAccounts.some((acc) => acc.value === toAcc);

    if (!fromAccExists || !toAccExists) {
      throw new Error(
        `Account(s) not found in dropdowns. ` +
          `From account ${fromAcc} exists: ${fromAccExists}. ` +
          `To account ${toAcc} exists: ${toAccExists}. ` +
          `Available from accounts: ${JSON.stringify(fromAccounts)}. ` +
          `Available to accounts: ${JSON.stringify(toAccounts)}`
      );
    }

    // Fill in transfer details
    console.log(`Entering transfer amount: $${amount}`);
    await this.page.fill("#amount", amount.toString());

    // Select accounts
    console.log(`Selecting from account: ${fromAcc}`);
    await this.page.selectOption("#fromAccountId", fromAcc);

    console.log(`Selecting to account: ${toAcc}`);
    await this.page.selectOption("#toAccountId", toAcc);

    // Submit the transfer
    console.log("Submitting transfer...");
    await this.page.click('input[value="Transfer"]');

    // Wait for success message with retry logic
    const maxAttempts = 3;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        await expect(this.page.getByText("Transfer Complete!")).toBeVisible({
          timeout: 10000,
        });
        console.log("Transfer completed successfully");
        return;
      } catch (err) {
        if (attempt === maxAttempts) {
          throw new Error(
            "Failed to verify transfer completion after multiple attempts"
          );
        }
        console.log(`Attempt ${attempt} failed, retrying...`);
        await this.page.waitForTimeout(2000);
      }
    }
  }
}
