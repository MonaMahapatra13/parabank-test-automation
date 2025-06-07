import { test } from "./fixtures";
import { AccountPage } from "../pages/AccountPage";
import { TransferPage } from "../pages/TransferPage";
import { BillPayPage } from "../pages/BillPayPage";

test("Full User Journey in ParaBank UI", async ({ page, loggedInPage }) => {
  // Create first account
  const account = new AccountPage(page);
  const firstAccount = await account.openNewSavingsAccount();
  await account.verifyAccountInOverview(firstAccount);

  // Create second account
  const secondAccount = await account.openNewSavingsAccount();
  await account.verifyAccountInOverview(secondAccount);

  // Transfer funds between accounts
  const transfer = new TransferPage(page);
  await transfer.transferFunds(firstAccount, secondAccount, 50);

  // Pay a bill from the second account
  const billPay = new BillPayPage(page);
  await billPay.payBill(secondAccount);
});
