import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import {
  CommunicationsPage,
  communicationsNamespace,
  communicationsResources,
} from "@/domains/communications";
import { renderWithDomainI18n } from "../helpers/render-with-domain-i18n";

describe("CommunicationsPage", () => {
  it("updates the live token-quote boundary without inventing a cost", async () => {
    const user = userEvent.setup();
    await renderWithDomainI18n(
      <CommunicationsPage />,
      communicationsNamespace,
      communicationsResources,
    );

    expect(screen.getByText("1 enabled SMS rule(s) require a live quote for the final token cost.")).toBeVisible();
    await user.click(screen.getByRole("checkbox", { name: "1-hour customer reminder" }));
    expect(screen.getByText("2 enabled SMS rule(s) require a live quote for the final token cost.")).toBeVisible();

    await user.click(screen.getByRole("button", { name: "Save rules" }));
    expect(screen.getByText("Communication rules saved.")).toBeVisible();
  });
});
