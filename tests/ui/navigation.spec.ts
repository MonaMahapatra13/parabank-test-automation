import { test } from "./fixtures";
import { HomePage } from "../pages/HomePage";

test.describe("Global Navigation", () => {
  test("Navigation menu should be visible after login", async ({
    loggedInPage,
  }) => {
    console.log("Starting navigation test...");
    console.log("Verifying main navigation links...");
    await loggedInPage.verifyGlobalNav();
    console.log("Navigation verification completed");
  });
});
