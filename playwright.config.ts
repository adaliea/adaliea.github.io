import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/browser",
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3100",
    trace: "retain-on-failure",
    launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE },
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["iPhone SE"], defaultBrowserType: "chromium" } },
  ],
  webServer: [
    {
      command: "node tests/fixtures/books-api.mjs",
      url: "http://127.0.0.1:4010",
      reuseExistingServer: !process.env.CI,
    },
    ...(process.env.PLAYWRIGHT_BASE_URL
      ? []
      : [
          {
            command: "npm run start -- --port 3100",
            url: "http://127.0.0.1:3100",
            reuseExistingServer: !process.env.CI,
            env: { BOOKS_API_URL: "http://127.0.0.1:4010" },
          },
        ]),
  ],
});
