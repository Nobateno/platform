import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import {
  VoiceBookingPage,
  voiceBookingNamespace,
  voiceBookingResources,
} from "@/domains/voice-booking";
import { renderWithDomainI18n } from "../helpers/render-with-domain-i18n";

describe("VoiceBookingPage", () => {
  it("reports the disconnected integration honestly and saves review policy", async () => {
    const user = userEvent.setup();
    await renderWithDomainI18n(
      <VoiceBookingPage />,
      voiceBookingNamespace,
      voiceBookingResources,
    );

    expect(screen.getByText("Not connected")).toBeVisible();
    expect(screen.getByText("CALL-DEMO-001")).toBeVisible();

    await user.click(screen.getByRole("button", { name: "Check integration" }));
    expect(screen.getByText("A live integration check becomes available after the server service is connected.")).toBeVisible();

    await user.click(screen.getByRole("checkbox", { name: "In-app alert for requests needing review" }));
    await user.click(screen.getByRole("button", { name: "Save review policy" }));
    expect(screen.getByText("Voice-booking review policy saved.")).toBeVisible();
  });
});
