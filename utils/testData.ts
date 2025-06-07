import * as dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

interface TestUser {
  username: string;
  password: string;
}

// For initial user creation in global setup
export const testUser: TestUser = {
  username: `testUser${100 + Math.floor(Math.random() * 900)}`,
  password: "Password123",
};

// For subsequent test runs, read from environment variables
export function getStoredTestUser(): TestUser {
  const username = process.env.TEST_USER_USERNAME;
  const password = process.env.TEST_USER_PASSWORD;

  if (!username || !password) {
    throw new Error(
      "Test user credentials not found in .env file. Please run global setup first."
    );
  }

  return { username, password };
}
