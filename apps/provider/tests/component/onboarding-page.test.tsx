import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import {
  OnboardingPage,
  onboardingNamespace,
  onboardingResources,
} from "@/domains/onboarding";
import { renderWithDomainI18n } from "../helpers/render-with-domain-i18n";

describe("OnboardingPage", () => {
  it("guides the five required setup areas and keeps publishing blocked until they are complete", async () => {
    const user = userEvent.setup();
    await renderWithDomainI18n(
      <MemoryRouter>
        <OnboardingPage />
      </MemoryRouter>,
      onboardingNamespace,
      onboardingResources,
    );

    const publishButton = screen.getByRole("button", { name: "Publish booking page" });
    expect(publishButton).toBeDisabled();
    expect(screen.getAllByRole("link", { name: "Set this up" })).toHaveLength(5);
    expect(screen.getAllByRole("link", { name: "Set this up" })[0]).toHaveAttribute(
      "href",
      "/add-product",
    );
    expect(
      screen.getByRole("link", { name: "Go to dashboard for now" }),
    ).toHaveAttribute("href", "/");

    for (const label of [
      "At least one service is active",
      "Business profile is complete",
      "Bookable availability is configured",
      "Booking policy is configured",
      "Public-page preview has been reviewed",
    ]) {
      await user.click(screen.getByRole("checkbox", { name: label }));
    }

    expect(screen.getByText("5 of 5 required items")).toBeVisible();
    expect(publishButton).toBeEnabled();
    await user.click(publishButton);
    expect(screen.getByText("The booking page is ready and marked as published.")).toBeVisible();
  });
});
