const { test, expect } = require("@playwright/test");

async function stubTiles(page) {
  await page.route("**/*.tile.openstreetmap.org/**", (route) =>
    route.fulfill({ status: 204, body: "" })
  );
}

test("marker opens details", async ({ page }) => {
  await stubTiles(page);
  await page.goto("/results");
  await page.locator('[data-testid="map-marker"]').first.click();
  const popup = page.locator('[data-testid="map-popup"]');
  await expect(popup).toBeVisible();
  await popup.locator('[data-testid="map-view-details"]').click();
  await expect(page).toHaveURL(/\/hotels\//);
  await expect(page.locator('[data-testid="hotel-name"]')).not.toHaveText("");
});

test("empty search shows map-empty", async ({ page }) => {
  await stubTiles(page);
  await page.goto("/results");
  await page.locator('[data-testid="filter-q"]').fill("zzz-no-hotels");
  await expect(page.locator('[data-testid="map-empty"]')).toBeVisible();
  await expect(page.locator('[data-testid="map-marker"]')).toHaveCount(0);
});
