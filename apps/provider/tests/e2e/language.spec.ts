import { expect, test } from "@playwright/test";
import { loginAsOwner } from "./support/auth";

const loginLanguageSelect = (page: Parameters<typeof loginAsOwner>[0]) =>
  page.locator('select:has(option[value="zh"])');
const settingsLanguageSelect = (page: Parameters<typeof loginAsOwner>[0]) =>
  page.getByLabel("Language", { exact: true });

test("uses Persian by default and persists an LTR language across reloads", async ({
  page,
}) => {
  await page.goto("/login");
  const select = loginLanguageSelect(page);

  await expect(select).toHaveValue("fa");
  await expect(page.locator("html")).toHaveAttribute("lang", "fa");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");

  await select.selectOption("de");
  await expect(page.locator("html")).toHaveAttribute("lang", "de");
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");

  await page.reload();
  await expect(loginLanguageSelect(page)).toHaveValue("de");
  await expect(page.locator("html")).toHaveAttribute("lang", "de");
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
});

test("updates provider content when the selected locale changes", async ({
  page,
}) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => {
    pageErrors.push(error.stack ?? error.message);
  });
  await loginAsOwner(page);
  await page.goto("/settings?page=locale");
  const select = settingsLanguageSelect(page);
  await select.selectOption("en");
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Today at Nobateno" })).toBeVisible();

  await page.goto("/settings?page=locale");
  await select.selectOption("zh");
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Nobateno 今日概览" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Today at Nobateno" })).not.toBeVisible();
  expect(pageErrors).toEqual([]);
});
