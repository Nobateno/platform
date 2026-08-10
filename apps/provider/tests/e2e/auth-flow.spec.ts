import { expect, test, type Page } from "@playwright/test";

async function useEnglish(page: Page) {
  await page.locator('select:has(option[value="en"])').selectOption("en");
}

async function enterOtp(page: Page, code: string) {
  await page.getByLabel("Code digit 1").fill(code);
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });
});

test("keeps the phone-first entry usable on a mobile viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/login");
  await useEnglish(page);

  await expect(
    page.getByRole("heading", { name: "Welcome to Nobateno" }),
  ).toBeVisible();
  await expect(
    page.getByRole("textbox", { name: "Mobile number" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Country or region: Iran +98" }),
  ).toBeDisabled();
  await expect(
    page.getByRole("complementary", {
      name: "Every appointment, clearly organized",
    }),
  ).toBeHidden();
  await page
    .getByRole("textbox", { name: "Mobile number" })
    .fill("091234567890");
  await expect(
    page.getByRole("textbox", { name: "Mobile number" }),
  ).toHaveValue("09123456789");
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390);
});

test("shows the supporting content beside the login card on desktop", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/login");
  await useEnglish(page);

  await expect(
    page.getByRole("complementary", {
      name: "Every appointment, clearly organized",
    }),
  ).toBeVisible();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(1280);
});

test("preserves the desktop order in dark LTR mode", async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem(
      "nobateno-ui",
      JSON.stringify({
        state: {
          darkMode: { value: true },
          compactMenu: { value: true },
        },
        version: 0,
      }),
    );
  });
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/login");
  await useEnglish(page);

  await expect(page.locator("html")).toHaveClass(/dark/);
  const loginCard = await page
    .getByRole("region", { name: "Welcome to Nobateno" })
    .boundingBox();
  const heroContent = await page
    .getByRole("complementary", {
      name: "Every appointment, clearly organized",
    })
    .boundingBox();

  expect(loginCard).not.toBeNull();
  expect(heroContent).not.toBeNull();
  if (!loginCard || !heroContent) {
    throw new Error("The desktop authentication regions must be visible");
  }
  expect(loginCard.x).toBeLessThan(heroContent.x);
});

test("branches an existing provider phone to password sign-in", async ({
  page,
}) => {
  await page.goto("/login");
  await useEnglish(page);
  await page.getByRole("textbox", { name: "Mobile number" }).fill("09120000001");
  await page.getByRole("button", { name: "Continue", exact: true }).click();

  await expect(
    page.getByRole("heading", { name: "Enter your password" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Forgot your password?" }),
  ).toHaveAttribute("href", "/forgot-password");
});

test("verifies a new provider phone before account onboarding", async ({
  page,
}) => {
  await page.goto("/login");
  await useEnglish(page);
  await page.getByRole("textbox", { name: "Mobile number" }).fill("09121111111");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await enterOtp(page, "123456");
  await page.getByRole("button", { name: "Verify code" }).click();

  await expect(
    page.getByRole("heading", { name: "Create your business account" }),
  ).toBeVisible();
  await expect(page.locator('input[name="newPassword"]')).toBeVisible();
});

test("requires OTP before showing password reset fields", async ({ page }) => {
  await page.goto("/forgot-password");
  await useEnglish(page);
  await page.getByRole("textbox", { name: "Mobile number" }).fill("09120000001");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await enterOtp(page, "123456");
  await page.getByRole("button", { name: "Verify code" }).click();

  await expect(
    page.getByRole("heading", { name: "Choose a new password" }),
  ).toBeVisible();
  await expect(page.locator('input[name="newPassword"]')).toBeVisible();
});
