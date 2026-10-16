// Optional JS twin of tests/e2e/test_booking_e2e.py (Stage 7).
const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "tests/e2e",
  testMatch: "**/*.spec.js",
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:5000",
    viewport: { width: 1280, height: 800 },
  },
  webServer: {
    command: "python -m flask --app wsgi:app run --port 5000",
    url: "http://127.0.0.1:5000/results",
    reuseExistingServer: true,
    timeout: 120000,
  },
});
