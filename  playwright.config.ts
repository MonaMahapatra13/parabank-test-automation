import { defineConfig } from "@playwright/test";

export default defineConfig({
  use: {
    baseURL: "https://parabank.parasoft.com", // ✅ Add this line
    headless: false,
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
});
