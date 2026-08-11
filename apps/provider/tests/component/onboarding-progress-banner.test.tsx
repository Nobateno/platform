import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import {
  OnboardingJourneyProvider,
  OnboardingProgressBanner,
  useOnboardingJourney,
} from "@/app/onboarding";
import {
  onboardingNamespace,
  onboardingResources,
} from "@/domains/onboarding";
import { renderWithDomainI18n } from "../helpers/render-with-domain-i18n";

function BannerControls() {
  const { activate, updateStep } = useOnboardingJourney();
  return (
    <>
      <button type="button" onClick={activate}>
        Activate setup
      </button>
      <button
        type="button"
        onClick={() => updateStep("activeService", true)}
      >
        Complete service
      </button>
      <OnboardingProgressBanner />
    </>
  );
}

describe("OnboardingProgressBanner", () => {
  it("appears after a deferred setup and takes the owner to the next incomplete area", async () => {
    const user = userEvent.setup();
    await renderWithDomainI18n(
      <MemoryRouter>
        <OnboardingJourneyProvider>
          <BannerControls />
        </OnboardingJourneyProvider>
      </MemoryRouter>,
      onboardingNamespace,
      onboardingResources,
    );

    expect(screen.queryByRole("heading", { name: "Required progress" })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Activate setup" }));

    expect(screen.getByText("0 of 5 required items")).toBeVisible();
    expect(
      screen.getByRole("link", { name: "At least one service is active" }),
    ).toHaveAttribute("href", "/add-product");

    await user.click(screen.getByRole("button", { name: "Complete service" }));

    expect(screen.getByText("1 of 5 required items")).toBeVisible();
    expect(
      screen.getByRole("link", { name: "Business profile is complete" }),
    ).toHaveAttribute("href", "/booking-page");
  });
});
