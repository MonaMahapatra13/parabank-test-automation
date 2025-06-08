import { test } from '../fixtures';
import { AccountPage } from '../../../pages/AccountPage';
import { TransferPage } from '../../../pages/TransferPage';
import { BillPayPage } from '../../../pages/BillPayPage';

/**
 * End-to-End Test Suite for ParaBank
 *
 * This suite validates the complete user journey through ParaBank's main features.
 * It simulates real user behavior by performing a sequence of operations that test
 * the integration between different features.
 *
 * Flow:
 * 1. Create first savings account
 * 2. Create second savings account
 * 3. Transfer funds between accounts
 * 4. Pay a bill from the second account
 *
 * Note: This test requires a clean user account state to run properly.
 */

// Mark as E2E test to run in specific CI/CD stages
test.describe('End-to-End Flows', () => {
  // Set longer timeout for E2E test
  test.setTimeout(120000);

  test('Complete user journey through ParaBank features @e2e @smoke', async ({
    page,
    loggedInPage,
  }) => {
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

    // Additional verification step for full journey completion
    await account.verifyAccountInOverview(secondAccount);
  });
});
