# ParaBank Test Automation Framework

This repository contains an automated test suite for ParaBank using Playwright. The framework includes both UI and API tests.

## Features

- **UI Tests**: End-to-end tests covering core functionality
- **API Tests**: Integration tests for transaction verification
- **CI/CD Integration**: Automated test execution in GitHub Actions
- **Test Reports**: HTML reports generated for each test run

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

## Setup

1. Clone the repository:

```bash
git clone <your-repo-url>
cd QaCodeChallenge
```

2. Install dependencies:

```bash
npm install
```

3. Install Playwright browsers:

```bash
npx playwright install
```

## Running Tests

You can run tests using the following commands:

- Run UI tests only:

```bash
npm run test:ui
```

- Run API tests only:

```bash
npm run test:api
```

- Run all tests:

```bash
npm run test:all
```

## Environment Variables

The framework uses environment variables for configuration. Create a `.env` file based on `.env.example`:

1. Copy `.env.example` to `.env`
2. Update the values with your credentials and configuration

For CI/CD, the following secrets need to be configured in GitHub:

- `PARABANK_USERNAME`: Your ParaBank username
- `PARABANK_PASSWORD`: Your ParaBank password
- `SLACK_WEBHOOK_URL`: Webhook URL for Slack notifications

## Test Organization

The test suite is organized into three main categories:

1. **Unit Tests (`tests/ui/`)**
   - Individual feature tests
   - Quick feedback loop
   - Run on every PR and push

2. **API Tests (`tests/api/`)**
   - Test ParaBank's REST services
   - Validate data integrity
   - Run on every PR and push

3. **End-to-End Tests (`tests/ui/e2e/`)**
   - Full user journey tests
   - Integration validation
   - Run on schedule (nightly) and manual triggers
   - Tagged with `@e2e` for selective execution

## Available Scripts

- `npm run test:ui` - Run UI tests
- `npm run test:api` - Run API tests
- `npm run test:e2e` - Run E2E tests only
- `npm run test:smoke` - Run smoke tests (tagged with @smoke)
- `npm run test:all` - Run all tests (UI, API, and E2E)
- `npm run test:ci` - Run tests for CI (excludes E2E)
- `npm run test:nightly` - Run complete test suite including E2E

## CI/CD Pipeline

The project is configured with GitHub Actions for continuous integration. The pipeline:

1. Triggers on:

   - Push to main/master branch
   - Pull requests to main/master branch
   - Manual trigger (workflow_dispatch)

2. Executes the following steps:
   - Sets up Node.js environment
   - Installs dependencies
   - Runs UI tests
   - Runs API tests
   - Uploads test results as artifacts

## CI/CD Pipeline Features

The GitHub Actions workflow includes:

1. **Automated Triggers**:

   - Push to main/master branch
   - Pull requests to main/master
   - Daily runs at midnight UTC
   - Manual trigger option

2. **Enhanced Error Handling**:

   - Automatic retries (3 attempts) for failed tests
   - Separate UI and API test execution
   - Continued execution on non-critical failures

3. **Notifications and Reporting**:

   - Slack notifications for test results
   - Automatic GitHub issues for test failures
   - Detailed test reports uploaded as artifacts
   - Unique report naming with run numbers

4. **Security**:
   - Secure credential handling through GitHub Secrets
   - Environment variable management
   - No sensitive data in logs

## Debugging Failed Tests

When tests fail in the CI pipeline:

1. Check the GitHub Actions run for detailed logs
2. Download the test artifacts for screenshots and videos
3. Review the automatically created GitHub issue
4. Check Slack notifications for quick status updates

## Test Reports

Test reports are automatically generated after each test run:

- Local: Available in `playwright-report/` directory
- CI/CD: Uploaded as artifacts in GitHub Actions

## Project Structure

```
├── .github/workflows/   # CI/CD configuration
├── pages/              # Page Object Models
├── tests/
│   ├── api/           # API tests
│   └── ui/            # UI tests
├── utils/             # Utility functions
└── playwright.config.ts
```

## Contributing

1. Create a new branch for your changes
2. Make your changes and commit them
3. Create a pull request
4. Wait for the CI pipeline to complete
5. Request review

## Support

For any questions or issues, please [open an issue](your-repo-url/issues) on GitHub.
