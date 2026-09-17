import { defineConfig } from "@playwright/test";
import config from "./playwright.config";

export default defineConfig({
  ...config,
  // Local workerd can take a few seconds to compile a route on its first request.
  expect: { timeout: 10000 },
  use: { ...config.use, baseURL: "http://127.0.0.1:8788" },
  webServer: [
    {
      command: "node tests/fixtures/books-api.mjs",
      url: "http://127.0.0.1:4010",
      reuseExistingServer: !process.env.CI,
    },
    {
      command:
        "opennextjs-cloudflare preview --port 8788 --var BOOKS_API_URL:http://127.0.0.1:4010",
      url: "http://127.0.0.1:8788",
      timeout: 60000,
    },
  ],
});
