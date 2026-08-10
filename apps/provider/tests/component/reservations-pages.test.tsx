import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createInstance } from "i18next";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import {
  reservationsNamespace,
  reservationsResources,
} from "@/domains/reservations/i18n";
import ReservationListPage from "@/domains/reservations/presentation/pages/ReservationListPage";
import ReservationDetailPage from "@/domains/reservations/presentation/pages/ReservationDetailPage";
import { useReservationStore } from "@/domains/reservations/application/reservation-store";

const createTestI18n = async () => {
  const i18n = createInstance();
  await i18n.init({
    lng: "en",
    fallbackLng: "en",
    resources: { en: { [reservationsNamespace]: reservationsResources.en } },
  });
  return i18n;
};

describe("reservation operations", () => {
  beforeEach(() => useReservationStore.getState().reset());

  it("filters stable reservations and prevents a manual-booking conflict", async () => {
    const user = userEvent.setup();
    const i18n = await createTestI18n();
    render(
      <I18nextProvider i18n={i18n}>
        <MemoryRouter initialEntries={["/transaction-list?status=pending"]}>
          <ReservationListPage />
        </MemoryRouter>
      </I18nextProvider>,
    );

    expect(screen.getByText("2 appointments")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "First page" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled();
    await user.type(screen.getByRole("searchbox"), "assessment");
    expect(screen.getByText("1 appointments")).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Create manual booking" }),
    );
    const form = screen
      .getByRole("heading", { name: "New manual booking" })
      .closest("section");
    expect(form).not.toBeNull();
    const scope = within(form as HTMLElement);
    await user.type(scope.getByLabelText("Customer name"), "Sample customer");
    await user.type(scope.getByLabelText("Mobile number"), "09120000000");
    fireEvent.change(scope.getByLabelText("Time"), {
      target: { value: "09:15" },
    });
    await user.click(scope.getByRole("button", { name: "Create appointment" }));
    expect(await scope.findByRole("alert")).toHaveTextContent(
      "already has an appointment",
    );

    fireEvent.change(scope.getByLabelText("Time"), {
      target: { value: "14:00" },
    });
    await user.click(scope.getByRole("button", { name: "Create appointment" }));
    expect(
      await screen.findByText("Appointment NOB-2053 was created."),
    ).toBeInTheDocument();
    expect(
      useReservationStore
        .getState()
        .reservations.find(({ id }) => id === "NOB-2053"),
    ).toMatchObject({
      customerLabel: "Sample customer",
      customerPhone: "09120000000",
      source: "manual",
      status: "approved",
    });
  });

  it("uses the route id and enforces valid appointment status transitions", async () => {
    const user = userEvent.setup();
    const i18n = await createTestI18n();
    render(
      <I18nextProvider i18n={i18n}>
        <MemoryRouter initialEntries={["/transaction-detail/NOB-2049"]}>
          <Routes>
            <Route
              path="/transaction-detail/:id"
              element={<ReservationDetailPage />}
            />
          </Routes>
        </MemoryRouter>
      </I18nextProvider>,
    );

    expect(screen.getByText("NOB-2049")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Print appointment" }),
    ).toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: "Approve appointment" }),
    );
    expect(
      screen.getByRole("status", {
        name: "",
      }),
    ).toHaveTextContent("Appointment NOB-2049 changed to Approved.");
    await user.click(screen.getByRole("button", { name: "Mark completed" }));
    expect(screen.getByRole("status")).toHaveTextContent(
      "Appointment NOB-2049 changed to Completed.",
    );
    expect(
      screen.getByText(
        "This appointment is in a final state and has no further actions.",
      ),
    ).toBeInTheDocument();
  });
});
