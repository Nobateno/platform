import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ReportsPage, reportsNamespace, reportsResources } from "@/domains/reports";
import { renderWithDomainI18n } from "../helpers/render-with-domain-i18n";

describe("ReportsPage", () => {
  it("changes the accessible sample report period without implying live data", async () => {
    const user = userEvent.setup();
    await renderWithDomainI18n(<ReportsPage />, reportsNamespace, reportsResources);

    expect(screen.getByText("Sample data only; these figures are not connected to a provider account.")).toBeVisible();
    expect(screen.getByText("42")).toBeVisible();

    await user.selectOptions(screen.getByRole("combobox", { name: "Reporting period" }), "30");
    expect(screen.getByText("184")).toBeVisible();
    expect(screen.getByText("Available on eligible plans")).toBeVisible();
  });
});
