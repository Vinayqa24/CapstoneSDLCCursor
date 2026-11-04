const { test, expect } = require("@playwright/test");
const { spawn } = require("child_process");
const fs = require("fs");
const net = require("net");
const os = require("os");
const path = require("path");

const REGIONS = [
  "baseline-inventory",
  "baseline-journey",
  "baseline-validations",
  "baseline-gaps",
  "baseline-questions",
];

function waitForPort(port, timeoutMs = 20000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const tryOnce = () => {
      const socket = net.connect(port, "127.0.0.1", () => {
        socket.end();
        resolve();
      });
      socket.on("error", () => {
        socket.destroy();
        if (Date.now() - start > timeoutMs) {
          reject(new Error(`port ${port} did not open`));
        } else {
          setTimeout(tryOnce, 200);
        }
      });
    };
    tryOnce();
  });
}

test("results link opens baseline regions", async ({ page, request }) => {
  await page.goto("/results");
  await expect(page.locator('[data-testid="results-map"]')).toBeVisible();
  await page.locator('[data-testid="baseline-nav"]').click();
  await expect(page).toHaveURL(/\/baseline$/);
  for (const id of REGIONS) {
    await expect(page.locator(`[data-testid="${id}"]`)).toBeVisible();
  }
  for (const heading of ["Inventory", "Journey", "Validations", "Gaps", "Questions"]) {
    await expect(page.getByRole("heading", { name: heading, exact: true })).toBeVisible();
  }
  const inventory = page.locator('[data-testid="baseline-inventory"]');
  await expect(inventory).toContainText("Titan City House");
  await expect(inventory).toContainText("Titan Shoreline");
  await expect(inventory).toContainText("Titan Alpine Lodge");
  await expect(inventory).toContainText("Book my stay");
  await expect(page.locator('[data-testid="baseline-gaps"]')).toContainText("P0");
  await expect(page.locator('[data-testid="baseline-journey"]')).toContainText("Not Found");
  await expect(page.locator('[data-testid="baseline-evidence-missing"]')).toHaveCount(0);
  const shot = await request.get("/baseline/evidence");
  expect(shot.status()).toBe(200);
  expect(shot.headers()["content-type"] || "").toContain("image/png");
});

test("missing screenshot shows Not Found and no hotels", async ({ page }) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "baseline-missing-"));
  const port = 5099;
  const child = spawn(
    "python",
    ["-m", "flask", "--app", "wsgi:app", "run", "--port", String(port)],
    {
      env: { ...process.env, BASELINE_DIR: dir },
      cwd: process.cwd(),
      stdio: "ignore",
    }
  );
  try {
    await waitForPort(port);
    await page.goto(`http://127.0.0.1:${port}/baseline`);
    await expect(page.locator('[data-testid="baseline-evidence-missing"]')).toHaveText("Not Found");
    await expect(page.locator('[data-testid="baseline-inventory"]')).toHaveCount(0);
    const body = await page.locator("body").innerText();
    expect(body).not.toContain("Titan City House");
    expect(body).not.toContain("Book my stay");
    const shot = await page.request.get(`http://127.0.0.1:${port}/baseline/evidence`);
    expect(shot.status()).toBe(404);
  } finally {
    child.kill();
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
