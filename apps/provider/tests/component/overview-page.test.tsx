import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createInstance } from "i18next";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { overviewNamespace, overviewResources } from "@/domains/overview/i18n";
import OverviewPage from "@/domains/overview/presentation/pages/OverviewPage";
import { createSeedReservations } from "@/domains/reservations";

const renderOverview = async () => {
  const i18n = createInstance();
  await i18n.init({
    lng: "en",
    fallbackLng: "en",
    resources: { en: { [overviewNamespace]: overviewResources.en } },
  });
  return render(
    <I18nextProvider i18n={i18n}>
      <MemoryRouter>
        <OverviewPage reservations={createSeedReservations()} />
      </MemoryRouter>
    </I18nextProvider>,
  );
};

describe("OverviewPage", () => {
  it("shows the provider's daily operational summary and quick routes", async () => {
    const user = userEvent.setup();
    await renderOverview();

    expect(
      screen.getByRole("heading", { name: "Today at Nobateno" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Today's appointments")).toBeInTheDocument();
    expect(screen.getByText("Pending approval")).toBeInTheDocument();
    expect(screen.getByText("Open slots today")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Hours and availability" }),
    ).toHaveAttribute("href", "/availability");
    expect(
      screen.getAllByRole("link", { name: /Create manual booking/ })[0],
    ).toHaveAttribute("href", "/transaction-list?create=1");
    expect(
      screen.queryByRole("link", { name: "NOB-2051" }),
    ).not.toBeInTheDocument();
    await user.selectOptions(
      screen.getByRole("combobox", { name: "Today's schedule" }),
      "upcoming",
    );
    expect(screen.getByRole("link", { name: "NOB-2051" })).toBeInTheDocument();
  });
});
