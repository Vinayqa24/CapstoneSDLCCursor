// Optional JS twin of tests/e2e/test_booking_e2e.py (Stage 7).
const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "tests/e2e",
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:5000",
    viewport: { width: 1280, height: 800 },
  },
});
