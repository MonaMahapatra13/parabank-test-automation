import { Locator, Page } from "@playwright/test";

export class RegisterPage {
  readonly page: Page;
  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.successMessage = page.locator(
      "text=Your account was created successfully. You are now logged in."
    );
  }

  private validateUsername(username: string): void {
    if (!username.match(/^testUser\d{3}$/)) {
      throw new Error(
        'Username must follow the format "testUser" followed by 3 digits'
      );
    }
  }

  async registerUser(username: string, password: string) {
    this.validateUsername(username);

    // Make sure we're on the registration page using a specific selector
    const registerLink = this.page.getByRole("link", { name: "Register" });
    await registerLink.waitFor({ state: "visible", timeout: 10000 });
    await registerLink.click();

    // Wait for page load and form to be ready
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForSelector("#customerForm", {
      state: "visible",
      timeout: 10000,
    });

    console.log("Registration form is ready, filling details...");

    // Fill personal information
    await this.page.fill('input[name="customer.firstName"]', "John");
    await this.page.fill('input[name="customer.lastName"]', "Doe");
    await this.page.fill('input[name="customer.address.street"]', "123 Elm St");
    await this.page.fill('input[name="customer.address.city"]', "Los Angeles");
    await this.page.fill('input[name="customer.address.state"]', "CA");
    await this.page.fill('input[name="customer.address.zipCode"]', "90001");
    await this.page.fill('input[name="customer.phoneNumber"]', "1234567890");
    await this.page.fill('input[name="customer.ssn"]', "123-45-6789");

    console.log("Setting username and password...");
    await this.page.fill('input[name="customer.username"]', username);
    await this.page.fill('input[name="customer.password"]', password);
    await this.page.fill('input[name="repeatedPassword"]', password);

    console.log("Submitting registration form...");
    await this.page.click('input[value="Register"]');
    await this.page.waitForLoadState("networkidle");
  }

  async isRegistrationSuccessful(): Promise<boolean> {
    try {
      await this.successMessage.waitFor({ timeout: 10000 });
      return true;
    } catch {
      console.log(
        "Registration success message NOT found. Current page content:"
      );
      const pageText = await this.page.locator("body").innerText();
      console.log(pageText);
      return false;
    }
  }
}
