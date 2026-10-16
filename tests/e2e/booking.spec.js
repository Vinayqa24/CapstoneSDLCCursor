const { test, expect } = require("@playwright/test");

async function stubTiles(page) {
  await page.route("**/*.tile.openstreetmap.org/**", (route) =>
    route.fulfill({ status: 204, body: "" })
  );
}

test("results shows list and map", async ({ page }) => {
  await stubTiles(page);
  await page.goto("/results");
  await expect(page.locator('[data-testid="results-map"]')).toBeVisible();
  await expect(page.locator('[data-testid="hotel-card"]').first()).toBeVisible();
  await expect(page.locator('[data-testid="map-marker"]').first()).toBeVisible();
});

test("marker popup shows details and opens hotel page", async ({ page }) => {
  await stubTiles(page);
  await page.goto("/results");
  await page.locator('[data-testid="map-marker"]').first().click();
  const popup = page.locator('[data-testid="map-popup"]');
  await expect(popup).toBeVisible();
  await expect(popup).toContainText("/ night");
  await popup.locator('[data-testid="map-view-details"]').click();
  await expect(page).toHaveURL(/\/hotels\//);
  await expect(page.locator('[data-testid="hotel-name"]')).not.toHaveText("");
});

test("marker book opens room step", async ({ page }) => {
  await stubTiles(page);
  await page.goto("/results");
  await page.locator('[data-testid="map-marker"]').first().click();
  await page.locator('[data-testid="map-book"]').click();
  await expect(page).toHaveURL(/\/book\/.+\/room/);
  await expect(page.locator('[data-testid="room-step"]')).toBeVisible();
  await expect(page.locator('[data-testid="room-hotel"]')).not.toHaveText("");
});

test("empty search shows map-empty", async ({ page }) => {
  await stubTiles(page);
  await page.goto("/results");
  await page.locator('[data-testid="filter-q"]').fill("zzz-no-hotels");
  await expect(page.locator('[data-testid="map-empty"]')).toBeVisible();
  await expect(page.locator('[data-testid="map-marker"]')).toHaveCount(0);
});

test("offshore area shows map-no-coords", async ({ page }) => {
  await stubTiles(page);
  await page.goto("/results");
  await page.locator('[data-testid="filter-area"]').selectOption("Offshore");
  await expect(page.locator('[data-testid="map-no-coords"]')).toBeVisible();
  await expect(page.locator('[data-testid="hotel-card"]')).toHaveCount(1);
  await expect(page.locator('[data-testid="map-marker"]')).toHaveCount(0);
});

test("unknown hotel shows not-found", async ({ page }) => {
  await page.goto("/hotels/not-a-hotel");
  await expect(page.locator('[data-testid="hotel-missing"]')).toBeVisible();
});

test("guest validation error", async ({ page }) => {
  await stubTiles(page);
  await page.goto("/results");
  await page.locator('[data-testid="map-marker"]').first().click();
  await page.locator('[data-testid="map-book"]').click();
  await page.locator('[data-testid="room-continue"]').click();
  await page.locator('[data-testid="guest-name"]').fill("A");
  await page.locator('[data-testid="guest-email"]').fill("guest@example.com");
  await page.locator('[data-testid="guest-continue"]').click();
  await expect(page.locator('[data-testid="guest-error"]')).toBeVisible();
});
