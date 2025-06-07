import { test } from "./fixtures";
import { AccountPage } from "../pages/AccountPage";

test.describe("Account Creation and Overview", () => {
  test("Create savings account and verify in overview", async ({
    page,
    loggedInPage,
  }) => {
    console.log("Starting account creation test...");

    // Create new account
    console.log("Creating new savings account...");
    const accountPage = new AccountPage(page);
    const accountNumber = await accountPage.openNewSavingsAccount();
    console.log(`Account created successfully: ${accountNumber}`);

    // Verify the account
    console.log("Verifying account in overview...");
    await accountPage.verifyAccountInOverview(accountNumber);
    console.log("Account verification completed");
  });
});
