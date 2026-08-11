import { expect, test } from "@playwright/test";
import { loginAsOwner, loginAsRole } from "./support/auth";

const pages = [
  ["/", "Today at Nobateno"],
  ["/transaction-list", "Appointments"],
  ["/transaction-detail/NOB-2049", "Appointment details"],
  ["/availability", "Hours and availability"],
  ["/users", "Customers"],
  ["/add-user", "Add a customer"],
  ["/users/customer-1024", "Customer 1024"],
  ["/product-list", "Services"],
  ["/add-product", "Create a service"],
  ["/categories", "Service categories"],
  ["/team", "Staff and access"],
  ["/booking-page", "Your provider-owned booking presence"],
  ["/communications", "Operational reminders and messages"],
  ["/voice-booking", "Phone booking intake"],
  ["/reports", "Business operations snapshot"],
  ["/invoice", "Plan & billing"],
  ["/settings", "Business settings"],
  ["/onboarding", "First-publish checklist"],
] as const;

test("loads every owner page without runtime errors", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.stack ?? error.message));
  await loginAsOwner(page);

  for (const [route, heading] of pages) {
    await page.goto(route);
    await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
  }
  expect(pageErrors).toEqual([]);
});

test("keeps deferred setup visible on the owner overview", async ({ page }) => {
  await loginAsOwner(page);
  await page.goto("/onboarding");

  await expect(
    page.getByRole("heading", { name: "First-publish checklist" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Go to dashboard for now" }).click();

  await expect(page).toHaveURL(/\/$/);
  await expect(
    page.getByRole("heading", { name: "Required progress" }),
  ).toBeVisible();
  await expect(page.getByText("0 of 5 required items")).toBeVisible();
  await expect(
    page.getByRole("link", { name: "At least one service is active" }),
  ).toHaveAttribute("href", "/add-product");
});

test("creates a conflict-free manual reservation and updates its status", async ({ page }) => {
  await loginAsOwner(page);
  await page.goto("/transaction-list?create=1");
  await page.getByLabel("Customer name").fill("Test Customer 9000");
  await page.getByLabel("Mobile number").fill("+989000000000");
  await page.getByLabel("Time").fill("18:30");
  await page.getByRole("button", { name: "Create appointment" }).click();

  const feedback = page.getByRole("status");
  await expect(feedback).toContainText(/Appointment NOB-\d+ was created/);
  const reference = (await feedback.textContent())?.match(/NOB-\d+/)?.[0];
  expect(reference).toBeTruthy();

  await page.getByRole("link", { name: `View details for ${reference}` }).click();
  await expect(page.getByRole("heading", { name: "Appointment details" })).toBeVisible();
  await page.getByRole("button", { name: "Mark completed" }).click();
  await expect(page.getByText(new RegExp(`Appointment ${reference} changed to Completed`))).toBeVisible();
});

test("requires explicit confirmation before a destructive request", async ({ page }) => {
  await loginAsOwner(page);
  await page.goto("/settings?page=delete");
  const deleteButton = page.getByRole("button", { name: "Request business deletion" });
  await expect(deleteButton).toBeDisabled();
  await page.getByLabel(/I understand this action/).check();
  await page.getByLabel("Type DELETE to continue").fill("DELETE");
  await expect(deleteButton).toBeEnabled();
  await deleteButton.click();
  await expect(page.getByText("Confirmation accepted. The development preview does not delete data.")).toBeVisible();
});

test("applies conservative role navigation and deep-link guards", async ({ page }) => {
  await loginAsRole(page, "receptionist");
  const navigation = page.getByRole("navigation", { name: "Provider panel navigation" });
  await expect(navigation.getByRole("link", { name: "Reservations" })).toBeVisible();
  await expect(navigation.getByRole("link", { name: "Availability" })).toBeVisible();
  await expect(navigation.getByRole("link", { name: "Customers" })).toBeVisible();
  await expect(navigation.getByRole("link", { name: "Plan & billing" })).toHaveCount(0);

  await page.goto("/invoice");
  await expect(page).toHaveURL(/\/transaction-list$/);
  await expect(page.getByRole("heading", { level: 1, name: "Appointments" })).toBeVisible();
});

test("supports skip navigation and restores focus after the mobile drawer closes", async ({ page }) => {
  const viewportWidth = 320;
  await page.setViewportSize({ width: viewportWidth, height: 568 });
  await loginAsOwner(page);
  await page.goto("/");
  await expect(page.locator("#main-content")).toBeVisible();

  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to main content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();

  const menuButton = page.getByRole("button", { name: "Open navigation" });
  await menuButton.focus();
  await page.keyboard.press("Enter");
  const closeButton = page.getByRole("button", { name: "Close navigation" });
  await expect(closeButton).toBeVisible();
  const mobilePanel = page.locator("[data-mobile-navigation-panel]");
  await expect(mobilePanel).toHaveCSS("transform", "none");
  const themedMobileLink = mobilePanel
    .locator(".side-menu__link:not(.side-menu__link--active)")
    .first();
  await expect(themedMobileLink).toHaveCSS("padding", "12px 14px");
  await expect(
    themedMobileLink.locator(".side-menu__link__title"),
  ).toHaveCSS("color", "rgba(255, 255, 255, 0.6)");

  const panelBox = await mobilePanel.boundingBox();
  const surfaceBox = await page
    .locator("[data-mobile-navigation-surface]")
    .boundingBox();
  const closeBox = await closeButton.boundingBox();
  expect(panelBox).not.toBeNull();
  expect(surfaceBox).not.toBeNull();
  expect(closeBox).not.toBeNull();
  expect(panelBox!.x).toBeGreaterThanOrEqual(-0.5);
  expect(panelBox!.x + panelBox!.width).toBeLessThanOrEqual(
    viewportWidth + 0.5,
  );
  expect(surfaceBox!.x).toBeLessThanOrEqual(0.5);
  expect(closeBox!.x).toBeGreaterThanOrEqual(
    surfaceBox!.x + surfaceBox!.width - 0.5,
  );

  await page.keyboard.press("Escape");
  await expect(closeButton).not.toBeVisible();
  await expect(menuButton).toBeFocused();

  await expect(
    page.locator("#main-content").getByRole("navigation", { name: "Breadcrumb" }),
  ).toBeVisible();

  await page.goto("/settings?page=locale");
  await page.getByLabel("Language", { exact: true }).selectOption("fa");
  const rtlMenuButton = page.getByRole("button", { name: "باز کردن راهبری" });
  await rtlMenuButton.click();
  const rtlCloseButton = page.getByRole("button", { name: "بستن راهبری" });
  await expect(rtlCloseButton).toBeVisible();
  await expect(mobilePanel).toHaveCSS("transform", "none");

  const rtlSurfaceBox = await page
    .locator("[data-mobile-navigation-surface]")
    .boundingBox();
  const rtlCloseBox = await rtlCloseButton.boundingBox();
  expect(rtlSurfaceBox).not.toBeNull();
  expect(rtlCloseBox).not.toBeNull();
  expect(rtlSurfaceBox!.x + rtlSurfaceBox!.width).toBeGreaterThanOrEqual(
    viewportWidth - 0.5,
  );
  expect(rtlCloseBox!.x + rtlCloseBox!.width).toBeLessThanOrEqual(
    rtlSurfaceBox!.x + 0.5,
  );
  await rtlCloseButton.click();
  await expect(rtlCloseButton).not.toBeVisible();
  await expect(rtlMenuButton).toBeFocused();
});

test("keeps breadcrumbs in the navbar on desktop and above page content on tablet", async ({ page }) => {
  await loginAsOwner(page);
  const pageBreadcrumb = page
    .locator("#main-content")
    .getByRole("navigation", { name: "Breadcrumb" });

  await expect(pageBreadcrumb).not.toBeVisible();

  await page.setViewportSize({ width: 768, height: 1024 });
  await expect(pageBreadcrumb).toBeVisible();
});

test("logout clears the session before history or a direct route can reopen data", async ({ page }) => {
  await loginAsOwner(page);
  await page.getByRole("navigation", { name: "Provider panel navigation" }).getByRole("link", { name: "Customers" }).click();
  await expect(page).toHaveURL(/\/users$/);
  await page.getByRole("button", { name: "Account menu" }).click();
  await page.getByRole("menuitem", { name: "Sign out" }).click();
  await expect(page).toHaveURL(/\/login$/);

  await page.goBack();
  await expect(page).toHaveURL(/\/login$/);
  await page.goto("/users");
  await expect(page).toHaveURL(/\/login$/);
});
