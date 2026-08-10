import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import {
  OnboardingPage,
  onboardingNamespace,
  onboardingResources,
} from "@/domains/onboarding";
import { renderWithDomainI18n } from "../helpers/render-with-domain-i18n";

describe("OnboardingPage", () => {
  it("requires five cross-domain prerequisites but keeps team setup optional", async () => {
    const user = userEvent.setup();
    await renderWithDomainI18n(
      <OnboardingPage />,
      onboardingNamespace,
      onboardingResources,
    );

    const publishButton = screen.getByRole("button", { name: "Publish booking page" });
    expect(publishButton).toBeDisabled();
    expect(screen.getByRole("checkbox", { name: "A team member and their bookable services are configured" })).not.toBeChecked();

    for (const label of [
      "Business profile is complete",
      "At least one service is active",
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
