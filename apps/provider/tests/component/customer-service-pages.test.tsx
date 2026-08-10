import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createInstance } from "i18next";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useCustomerStore } from "@/domains/customers/application/customer-store";
import {
  customersNamespace,
  customersResources,
} from "@/domains/customers/i18n";
import CreateCustomerPage from "@/domains/customers/presentation/pages/CreateCustomerPage";
import { useServiceStore } from "@/domains/services/application/service-store";
import {
  servicesI18nResources,
  servicesNamespace,
} from "@/domains/services/i18n";
import CreateServicePage from "@/domains/services/presentation/pages/CreateServicePage";
import ServiceCategoriesPage from "@/domains/services/presentation/pages/ServiceCategoriesPage";
import ServiceListPage from "@/domains/services/presentation/pages/ServiceListPage";

const initialCustomers = structuredClone(
  useCustomerStore.getState().customers,
);
const initialServices = structuredClone(useServiceStore.getState().services);
const initialCategories = structuredClone(
  useServiceStore.getState().categories,
);

const createTestI18n = async () => {
  const i18n = createInstance();
  await i18n.init({
    lng: "en",
    fallbackLng: "en",
    resources: {
      en: {
        [customersNamespace]: customersResources.en,
        [servicesNamespace]: servicesI18nResources.en,
      },
    },
  });
  return i18n;
};

async function renderPage(page: React.ReactNode) {
  const i18n = await createTestI18n();
  return render(
    <I18nextProvider i18n={i18n}>
      <MemoryRouter>{page}</MemoryRouter>
    </I18nextProvider>,
  );
}

describe("customer and service operations", () => {
  beforeEach(() => {
    useCustomerStore.setState({
      customers: structuredClone(initialCustomers),
    });
    useServiceStore.setState({
      services: structuredClone(initialServices),
      categories: structuredClone(initialCategories),
    });
  });

  it("validates and creates a provider-scoped customer", async () => {
    const user = userEvent.setup();
    await renderPage(<CreateCustomerPage />);

    await user.click(screen.getByRole("button", { name: "Create customer" }));
    expect(screen.getByText("Enter a display name.")).toBeInTheDocument();
    expect(
      screen.getByText("Enter a valid mobile number with 10 to 15 digits."),
    ).toBeInTheDocument();

    await user.type(
      screen.getByLabelText(/Provider display name/),
      "Customer 9001",
    );
    await user.type(screen.getByLabelText(/Mobile number/), "+989120009001");
    await user.click(screen.getByLabelText("Priority follow-up"));
    await user.click(
      screen.getByLabelText("Block new reservations for this customer"),
    );
    await user.click(screen.getByRole("button", { name: "Create customer" }));

    expect(
      screen.getByText("Customer created in this workspace."),
    ).toBeInTheDocument();
    expect(useCustomerStore.getState().customers[0]).toMatchObject({
      displayName: "Customer 9001",
      tags: ["priority"],
      blocked: true,
      reservationCount: 0,
    });
    expect(useCustomerStore.getState().customers[0].maskedPhone).toMatch(
      /^\+98 \u2022\u2022\u2022 \u2022\u2022\u2022 9001$/,
    );
  });

  it("creates a provider service and toggles its bookable status", async () => {
    const user = userEvent.setup();
    await renderPage(<CreateServicePage />);

    await user.type(screen.getByLabelText(/Service name/), "Test service");
    await user.clear(screen.getByLabelText(/Price in Iranian rials/));
    await user.type(screen.getByLabelText(/Price in Iranian rials/), "500000");
    await user.click(screen.getByRole("button", { name: "Save service" }));

    expect(
      screen.getByText("Service created in this workspace."),
    ).toBeInTheDocument();
    expect(useServiceStore.getState().services[0]).toMatchObject({
      customName: "Test service",
      category: "hair",
      durationMinutes: 45,
      priceMode: "exact",
      priceRials: 500000,
      active: true,
    });

    await renderPage(<ServiceListPage />);
    const row = screen.getByRole("row", { name: /Test service/ });
    await user.click(
      within(row).getByRole("button", { name: "Actions: Test service" }),
    );
    await user.click(
      screen.getByRole("menuitem", { name: "Deactivate Test service" }),
    );
    expect(useServiceStore.getState().services[0].active).toBe(false);
  });

  it("neutralizes spreadsheet formulas in the services CSV export", async () => {
    const user = userEvent.setup();
    useServiceStore.setState({
      services: [
        {
          ...structuredClone(initialServices[0]),
          id: "formula-service",
          nameKey: undefined,
          customName: "=1+1",
        },
      ],
    });
    let exportedBlob: Blob | undefined;
    vi.spyOn(URL, "createObjectURL").mockImplementation((blob) => {
      if (!(blob instanceof Blob)) {
        throw new TypeError("Expected the services export to create a Blob");
      }
      exportedBlob = blob;
      return "blob:services-csv";
    });
    vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => undefined);
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(
      () => undefined,
    );

    await renderPage(<ServiceListPage />);
    await user.click(screen.getByRole("button", { name: "Export" }));
    await user.click(screen.getByRole("menuitem", { name: "CSV" }));

    expect(exportedBlob).toBeDefined();
    const csv = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(reader.error);
      reader.onload = () => resolve(String(reader.result));
      reader.readAsText(exportedBlob!);
    });
    expect(csv.replace(/^\uFEFF/, "").split("\n")[1]).toMatch(
      /^"'=1\+1",/,
    );
  });

  it("adds and deactivates a deterministic service category", async () => {
    const user = userEvent.setup();
    await renderPage(<ServiceCategoriesPage />);

    await user.type(
      screen.getByLabelText("New category name"),
      "Home visits",
    );
    await user.click(screen.getByRole("button", { name: "Add category" }));

    expect(screen.getByText("Home visits")).toBeInTheDocument();
    const created = useServiceStore.getState().categories.at(-1);
    expect(created).toMatchObject({
      customName: "Home visits",
      active: true,
    });

    await user.click(
      screen.getByRole("switch", {
        name: "Change availability for Home visits",
      }),
    );
    expect(useServiceStore.getState().categories.at(-1)?.active).toBe(false);
  });
});
