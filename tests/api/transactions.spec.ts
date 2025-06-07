import { test, expect, chromium } from "@playwright/test";
import * as dotenv from "dotenv";

/**
 * API Test Suite for ParaBank Transactions
 *
 * Note: Due to ParaBank's architecture, we need to establish a UI session first
 * before making API calls, as the API relies on session-based authentication.
 */
test.describe("Transaction API Tests", () => {
  const baseUrl = "https://parabank.parasoft.com/parabank";
  let username: string;
  let password: string;

  test.beforeAll(() => {
    // Load test user credentials from environment
    dotenv.config();
    username = process.env.TEST_USER_USERNAME || "";
    password = process.env.TEST_USER_PASSWORD || "";

    if (!username || !password) {
      throw new Error("Test user credentials not found in .env file");
    }
  });

  /**
   * Test to verify bill payment transactions can be found via the API
   * Steps:
   * 1. Establish a session via UI login
   * 2. Get account ID from the accounts overview
   * 3. Use the API to search for transactions by amount
   * 4. Validate the transaction details in the response
   */
  test("Search transactions by amount after bill payment", async () => {
    const amount = "75.00"; // Amount used in bill payment
    let testAccountId: string;

    // Set up browser for session establishment
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
      // Step 1: UI Authentication
      console.log("Authenticating as:", username);
      await page.goto(baseUrl);
      await page.fill('input[name="username"]', username);
      await page.fill('input[name="password"]', password);
      await page.click('input[value="Log In"]');

      // Wait for account data to be available
      await page.waitForSelector("#leftPanel", { state: "visible" });
      await page.waitForSelector("#accountTable", { state: "visible" });
      await page.waitForTimeout(2000);

      // Step 2: Extract Account ID
      const accountLink = await page.locator("#accountTable a").first();
      const accountHref = await accountLink.getAttribute("href");
      const accountMatch =
        accountHref?.match(/id=(\d+)/) ||
        (await accountLink.textContent())?.match(/(\d{5})/);

      if (!accountMatch) {
        throw new Error("Could not find account ID in accounts table");
      }
      testAccountId = accountMatch[1];
      console.log("Using account ID:", testAccountId);

      // Step 3: Set up API Context with Session Cookies
      const cookies = await context.cookies();
      const apiContext = await browser.newContext({
        storageState: {
          cookies,
          origins: [],
        },
      });

      // Step 4: Make API Call
      console.log("Searching for transactions with amount:", amount);
      const apiPage = await apiContext.newPage();
      const response = await apiPage.goto(
        `${baseUrl}/services_proxy/bank/accounts/${testAccountId}/transactions/amount/${amount}`
      );

      expect(response).toBeTruthy();
      expect(response?.ok()).toBeTruthy();

      // Step 5: Parse and Validate Response
      const responseText = (await response?.text()) || "";
      console.log("API Response:", responseText);

      const transactions = JSON.parse(responseText);
      expect(Array.isArray(transactions)).toBeTruthy();

      // Validate transaction details if any found
      if (transactions.length > 0) {
        for (const transaction of transactions) {
          validateTransaction(transaction, amount);
        }
        console.log(
          "Found matching transactions:",
          JSON.stringify(transactions, null, 2)
        );
      } else {
        console.log("No transactions found for amount:", amount);
      }

      await apiContext.close();
    } finally {
      await context.close();
      await browser.close();
    }
  });
});

/**
 * Helper function to validate a transaction object
 */
function validateTransaction(transaction: any, expectedAmount: string) {
  // Required fields
  expect(transaction).toHaveProperty("id");
  expect(transaction).toHaveProperty("accountId");
  expect(transaction).toHaveProperty("type");
  expect(transaction).toHaveProperty("date");
  expect(transaction).toHaveProperty("amount");

  // Type validations
  expect(typeof transaction.id).toBe("number");
  expect(typeof transaction.accountId).toBe("number");
  expect(typeof transaction.amount).toBe("string");
  expect(parseFloat(transaction.amount)).toBe(parseFloat(expectedAmount));

  // Bill Payment specific validations
  if (transaction.type === "Bill Payment") {
    expect(transaction).toHaveProperty("description");
    expect(transaction.description).toContain(
      "Bill Payment to Utility Company"
    );
  }
}
