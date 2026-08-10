import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import {
  PublicPresencePage,
  publicPresenceNamespace,
  publicPresenceResources,
} from "@/domains/public-presence";
import { renderWithDomainI18n } from "../helpers/render-with-domain-i18n";

describe("PublicPresencePage", () => {
  it("requires the public profile fields before publishing", async () => {
    const user = userEvent.setup();
    await renderWithDomainI18n(
      <PublicPresencePage />,
      publicPresenceNamespace,
      publicPresenceResources,
    );

    const publishButton = screen.getByRole("button", { name: "Publish page" });
    expect(publishButton).toBeDisabled();

    await user.type(screen.getByLabelText("Business name"), "Sample studio");
    await user.type(screen.getByLabelText("City or neighbourhood"), "Sample district");
    await user.type(screen.getByLabelText("Short description"), "A demonstration booking profile.");

    expect(screen.getByText("Profile completion: 100%")).toBeVisible();
    expect(publishButton).toBeEnabled();
    await user.click(publishButton);
    expect(screen.getByText("Page published and the booking destination is up to date.")).toBeVisible();
  });
});
