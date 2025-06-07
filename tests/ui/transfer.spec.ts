import { test } from "./fixtures";
import { AccountPage } from "../pages/AccountPage";
import { TransferPage } from "../pages/TransferPage";

test.describe("Fund Transfer", () => {
  test("Transfer funds between accounts", async ({ page, loggedInPage }) => {
    console.log("Starting funds transfer test...");

    // Create source account
    console.log("Creating source account...");
    const accountPage = new AccountPage(page);
    const fromAccount = await accountPage.openNewSavingsAccount();
    console.log(`Source account created: ${fromAccount}`);

    // Create destination account
    console.log("Creating destination account...");
    const toAccount = await accountPage.openNewSavingsAccount();
    console.log(`Destination account created: ${toAccount}`);

    // Perform transfer
    console.log("Initiating fund transfer...");
    const transferPage = new TransferPage(page);
    await transferPage.transferFunds(fromAccount, toAccount, 100);
    console.log("Transfer completed successfully");

    // Verify accounts
    console.log("Verifying accounts after transfer...");
    await accountPage.verifyAccountInOverview(fromAccount);
    await accountPage.verifyAccountInOverview(toAccount);
    console.log("Account verification completed");
  });
});
