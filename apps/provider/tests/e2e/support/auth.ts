import { expect, type Page } from "@playwright/test";

export async function loginAsRole(
  page: Page,
  role: "owner" | "receptionist" | "staff",
) {
  await page.goto("/login");
  await page.locator('select:has(option[value="en"])').selectOption("en");
  const phones = {
    owner: "09120000001",
    receptionist: "09120000002",
    staff: "09120000003",
  } as const;
  await page.getByRole("textbox", { name: "Mobile number" }).fill(phones[role]);
  await page.getByRole("button", { name: "Continue" }).click();
  await page.locator('input[name="password"]').fill("Demo12345!");
  await page.getByRole("button", { name: "Sign in securely" }).click();
  await expect(page).toHaveURL(role === "owner" ? /\/$/ : /\/transaction-list$/);
}

export async function loginAsOwner(page: Page) {
  await loginAsRole(page, "owner");
}
