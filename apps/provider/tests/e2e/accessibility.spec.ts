import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { loginAsOwner } from "./support/auth";

async function expectNoHighImpactViolations(page: Page) {
  const { violations } = await new AxeBuilder({ page })
    .include("#root")
    .analyze();
  const highImpactViolations = violations.filter(
    ({ impact }) => impact === "critical" || impact === "serious",
  );
  const summary = highImpactViolations
    .map(
      ({ id, help, nodes }) =>
        `${id}: ${help}\n${nodes.map(({ target }) => `  ${target.join(" ")}`).join("\n")}`,
    )
    .join("\n\n");

  expect(highImpactViolations, `${page.url()}\n${summary}`).toEqual([]);
}

const ownerRoutes = [
  "/",
  "/transaction-list",
  "/transaction-detail/NOB-2049",
  "/availability",
  "/users",
  "/add-user",
  "/users/customer-1024",
  "/product-list",
  "/add-product",
  "/categories",
  "/team",
  "/booking-page",
  "/communications",
  "/voice-booking",
  "/reports",
  "/invoice",
  "/settings",
  "/onboarding",
] as const;

test.describe("@a11y", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => window.localStorage.clear());
  });

  test("login has no serious or critical accessibility violations", async ({
    page,
  }) => {
    await page.goto("/login");
    await expectNoHighImpactViolations(page);
  });

  test("every owner page has no serious or critical accessibility violations", async ({
    page,
  }) => {
    test.setTimeout(120_000);
    await loginAsOwner(page);
    for (const route of ownerRoutes) {
      await page.goto(route);
      await expect(page.locator("#main-content")).toBeVisible();
      await expectNoHighImpactViolations(page);
    }
  });
});
