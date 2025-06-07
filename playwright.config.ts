import { PlaywrightTestConfig, devices } from "@playwright/test";

const config: PlaywrightTestConfig = {
  globalSetup: require.resolve("./global-setup"),
  use: {
    baseURL: "https://parabank.parasoft.com/parabank/",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 15000, // Timeout for individual actions like click
    navigationTimeout: 30000, // Timeout for page loads
    trace: "retain-on-failure",
    viewport: { width: 1280, height: 720 },
  },
  timeout: 60000, // Increased global timeout
  workers: 1, // Reduced to 1 to avoid race conditions with shared test user
  retries: 1, // Add retry on failure
  reporter: [["list"], ["html", { open: "never" }]],
  projects: [
    {
      name: "ui",
      testDir: "./tests/ui",
      use: {
        ...devices["Desktop Chrome"],
        // Add UI specific configuration
        screenshot: "only-on-failure",
        video: "retain-on-failure",
        trace: "retain-on-failure",
      },
    },
    {
      name: "api",
      testDir: "./tests/api",
      use: {
        // API specific configuration
        baseURL: "https://parabank.parasoft.com/parabank/services/",
        extraHTTPHeaders: {
          Accept: "application/json",
        },
      },
    },
  ],
  expect: {
    timeout: 10000, // Timeout for expect assertions
  },
  fullyParallel: false, // Disable parallel execution to avoid shared user conflicts
};

export default config;
