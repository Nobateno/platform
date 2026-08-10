import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { TeamPage, teamNamespace, teamResources } from "@/domains/team";
import { renderWithDomainI18n } from "../helpers/render-with-domain-i18n";

describe("TeamPage", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("saves changes to existing staff access", async () => {
    const user = userEvent.setup();
    await renderWithDomainI18n(<TeamPage />, teamNamespace, teamResources);

    expect(screen.getByText("Every new staff member gets a sign-in account")).toBeVisible();
    const saveButton = screen.getByRole("button", { name: "Save team changes" });
    expect(saveButton).toBeDisabled();

    await user.selectOptions(
      screen.getByRole("combobox", { name: "Access state for Associate specialist" }),
      "invitationPending",
    );

    expect(screen.getByText("You have unsaved changes.")).toBeVisible();
    expect(saveButton).toBeEnabled();
    await user.click(saveButton);
    expect(screen.getByText("Team changes saved.")).toBeVisible();
  });

  it("requires a mobile number and password when the owner creates staff", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("offline")));
    const user = userEvent.setup();
    await renderWithDomainI18n(<TeamPage />, teamNamespace, teamResources);

    await user.click(screen.getByRole("button", { name: "Create staff account" }));
    expect(screen.getByText("Enter the staff member's name.")).toBeVisible();
    expect(screen.getByText("Enter a valid Iranian mobile number.")).toBeVisible();
    expect(screen.getByText("Password must contain at least 8 characters.")).toBeVisible();

    await user.type(screen.getByLabelText(/^Full name/), "Test Specialist");
    await user.type(screen.getByLabelText(/^Mobile number/), "۹۱۲۳۴۵۶۷۸۹");
    await user.type(screen.getByLabelText(/^Initial password/), "Staff123!");
    await user.type(screen.getByLabelText(/^Confirm password/), "Staff123!");
    await user.click(screen.getByRole("button", { name: "Create staff account" }));

    expect(await screen.findByText("Account for Test Specialist was created.")).toBeVisible();
    expect(screen.getByText("Test Specialist")).toBeVisible();
    expect(screen.getByText("09123456789")).toBeVisible();
    expect(screen.getByLabelText(/^Initial password/)).toHaveValue("");
    expect(screen.queryByDisplayValue("Staff123!")).not.toBeInTheDocument();
  });
});
