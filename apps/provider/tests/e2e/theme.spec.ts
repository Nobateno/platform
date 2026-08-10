import { expect, test, type Page } from "@playwright/test";
import { loginAsOwner } from "./support/auth";

async function useEnglish(page: Page) {
  await page.goto("/settings?page=locale");
  await page.getByLabel("Language", { exact: true }).selectOption("en");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
}

async function trackViewTransitions(page: Page) {
  await page.evaluate(() => {
    const root = document.documentElement;
    root.dataset.viewTransitionCalls = "0";

    if (typeof document.startViewTransition !== "function") {
      root.dataset.viewTransitionCalls = "unsupported";
      return;
    }

    const startViewTransition = document.startViewTransition.bind(document);
    document.startViewTransition = (callbackOptions) => {
      root.dataset.viewTransitionCalls = String(
        Number(root.dataset.viewTransitionCalls) + 1,
      );
      const transition = startViewTransition(callbackOptions);

      void transition.ready.then(() => {
        root.dataset.viewTransitionDuration = getComputedStyle(
          root,
          "::view-transition-group(root)",
        ).animationDuration;
      });

      return transition;
    };
  });
}

test("transitions between color modes and persists the preference", async ({
  page,
}) => {
  await loginAsOwner(page);
  await useEnglish(page);
  await trackViewTransitions(page);

  const root = page.locator("html");
  await expect(root).not.toHaveClass(/dark/);

  await page.getByRole("checkbox", { name: "Dark mode" }).click();

  await expect(root).toHaveClass(/dark/);
  await expect(page.getByRole("checkbox", { name: "Dark mode" })).toBeChecked();
  await expect(root).toHaveAttribute("data-view-transition-calls", "1");
  await expect(root).toHaveAttribute("data-view-transition-duration", "0.4s");

  await page.reload();

  await expect(root).toHaveClass(/dark/);
  await expect(page.getByRole("checkbox", { name: "Dark mode" })).toBeChecked();
});

test("changes color mode without a transition when motion is reduced", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await loginAsOwner(page);
  await useEnglish(page);
  await trackViewTransitions(page);

  const root = page.locator("html");
  await page.getByRole("checkbox", { name: "Dark mode" }).click();

  await expect(root).toHaveClass(/dark/);
  await expect(root).toHaveAttribute("data-view-transition-calls", "0");
});
