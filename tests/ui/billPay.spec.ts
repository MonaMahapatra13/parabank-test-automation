import { test } from "./fixtures";
import { BillPayPage } from "../pages/BillPayPage";
import { AccountPage } from "../pages/AccountPage";

test.describe("Bill Payment", () => {
  test("Pay a bill from the newly created account", async ({
    page,
    loggedInPage,
  }) => {
    console.log("Starting bill payment test...");
    const billPayPage = new BillPayPage(page);

    console.log("Creating new account for bill payment...");
    const accountPage = new AccountPage(page);
    const accountNumber = await accountPage.openNewSavingsAccount();
    console.log(`New account created: ${accountNumber}`);

    // Navigate to bill pay and complete payment
    console.log("Initiating bill payment...");
    await billPayPage.payBill(accountNumber);
    console.log("Bill payment completed successfully");
  });
});
