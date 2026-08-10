import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import {
  BusinessSettingsPage,
  businessSettingsI18nResources,
  businessSettingsNamespace,
} from "@/domains/business-settings";
import {
  BillingPage,
  billingNamespace,
  billingResources,
} from "@/domains/plan-billing";
import { renderWithDomainI18n } from "../helpers/render-with-domain-i18n";

async function renderSettings(entry = "/settings") {
  return renderWithDomainI18n(
    <MemoryRouter initialEntries={[entry]}>
      <BusinessSettingsPage />
    </MemoryRouter>,
    businessSettingsNamespace,
    businessSettingsI18nResources,
  );
}

async function renderBilling() {
  return renderWithDomainI18n(
    <MemoryRouter initialEntries={["/billing"]}>
      <BillingPage />
    </MemoryRouter>,
    billingNamespace,
    billingResources,
  );
}

describe("BusinessSettingsPage", () => {
  it("keeps the original section navigation while saving provider policy and locale state", async () => {
    const user = userEvent.setup();
    await renderSettings();

    expect(screen.getByRole("link", { name: "Booking policy" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    const bookingMode = screen.getByRole("checkbox", {
      name: "New booking handling",
    });
    expect(bookingMode).not.toBeChecked();
    await user.click(bookingMode);
    expect(bookingMode).toBeChecked();

    await user.click(screen.getByRole("button", { name: "Save booking policy" }));
    expect(screen.getByText("Booking policy saved in this workspace.")).toBeVisible();

    await user.click(screen.getByRole("link", { name: "Locale and time zone" }));
    expect(
      screen.getByRole("heading", { name: "Locale and time zone", level: 2 }),
    ).toBeVisible();
    expect(screen.getByRole("link", { name: "Locale and time zone" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await user.selectOptions(screen.getByLabelText("Business language"), "en");
    await user.click(screen.getByRole("button", { name: "Save locale settings" }));
    expect(screen.getByText("Locale settings saved in this workspace.")).toBeVisible();
  });

  it("retains password validation and guarded business deletion", async () => {
    const user = userEvent.setup();
    await renderSettings("/settings?page=security");

    await user.click(screen.getByRole("button", { name: "Change password" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Complete all password fields.");

    await user.click(screen.getByRole("link", { name: "Delete business" }));
    const deleteButton = screen.getByRole("button", {
      name: "Request business deletion",
    });
    expect(deleteButton).toBeDisabled();

    await user.click(
      screen.getByRole("checkbox", {
        name: "I understand this action may permanently remove business data.",
      }),
    );
    await user.type(screen.getByLabelText("Type DELETE to continue"), "DELETE");
    expect(deleteButton).toBeEnabled();
    await user.click(deleteButton);
    expect(
      screen.getByText(
        "Confirmation accepted. The development preview does not delete data.",
      ),
    ).toBeVisible();
  });
});

describe("BillingPage", () => {
  it("keeps deterministic plan actions, real links, and keyboard-capable boxed tabs", async () => {
    const user = userEvent.setup();
    const billingView = await renderBilling();

    expect(screen.getByRole("heading", { name: "Plan & billing", level: 1 })).toBeVisible();
    expect(
      screen.getByRole("link", { name: "Open booking page settings" }),
    ).toHaveAttribute("href", "/booking-page");
    expect(
      screen.getByRole("link", { name: "Open communication tokens" }),
    ).toHaveAttribute("href", "/communications");

    await user.click(screen.getByRole("button", { name: "Actions: Growth" }));
    await user.click(screen.getByRole("menuitem", { name: "Review Growth" }));
    expect(
      screen.getByText(
        "Growth selected for review. Checkout requires current server pricing and payment state.",
      ),
    ).toBeVisible();

    billingView.unmount();
    await renderBilling();

    const receiptsTab = screen.getByRole("tab", { name: "Invoices and receipts" });
    receiptsTab.focus();
    expect(receiptsTab).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(screen.getByText("No receipts during the active trial.")).toBeVisible();
  });
});
