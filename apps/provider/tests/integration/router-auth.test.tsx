import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import "@/app/i18n";
import App from "@/app/router";
import { useStore, type PanelRole } from "@/domains/auth/store";

vi.mock("@/app/shell", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <main data-testid="app-shell">{children}</main>
  ),
}));

vi.mock("@/domains/auth", () => ({
  LoginPage: () => <h1>login page</h1>,
  ForgotPasswordPage: () => <h1>forgot password page</h1>,
}));
vi.mock("@/domains/overview", () => ({ OverviewPage: () => <h1>overview page</h1> }));
vi.mock("@/domains/customers", () => ({
  CustomerListPage: () => <h1>customer list page</h1>,
  CreateCustomerPage: () => <h1>create customer page</h1>,
  CustomerDetailPage: () => <h1>customer detail page</h1>,
}));
vi.mock("@/domains/reservations", () => ({
  ReservationListPage: () => <h1>reservation list page</h1>,
  ReservationDetailPage: () => <h1>reservation detail page</h1>,
}));

function authenticate(roleId: PanelRole) {
  useStore.setState({
    currentUser: {
      id: `test-${roleId}`,
      fullName: `Test ${roleId}`,
      roleId,
      active: true,
    },
    status: "authenticated",
    pending: false,
    error: undefined,
  });
}

describe("authenticated, role-aware routing", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    useStore.setState({
      currentUser: undefined,
      status: "anonymous",
      pending: false,
      error: undefined,
    });
  });

  it.each(["/", "/users", "/transaction-list", "/invoice", "/settings"])(
    "redirects a signed-out visit to %s to login",
    async (path) => {
      render(
        <MemoryRouter initialEntries={[path]}>
          <App />
        </MemoryRouter>,
      );
      expect(await screen.findByRole("heading", { name: "login page" })).toBeInTheDocument();
      expect(screen.queryByTestId("app-shell")).not.toBeInTheDocument();
    },
  );

  it("keeps password recovery public for signed-out providers", async () => {
    render(
      <MemoryRouter initialEntries={["/forgot-password"]}>
        <App />
      </MemoryRouter>,
    );
    expect(
      await screen.findByRole("heading", { name: "forgot password page" }),
    ).toBeInTheDocument();
    expect(screen.queryByTestId("app-shell")).not.toBeInTheDocument();
  });

  it("allows an owner to open customer management", async () => {
    authenticate("owner");
    render(
      <MemoryRouter initialEntries={["/users"]}>
        <App />
      </MemoryRouter>,
    );
    expect(await screen.findByRole("heading", { name: "customer list page" })).toBeInTheDocument();
    expect(screen.getByTestId("app-shell")).toBeInTheDocument();
  });

  it("keeps the legacy reservation detail route available", async () => {
    authenticate("owner");
    render(
      <MemoryRouter initialEntries={["/transaction-detail?source=legacy#summary"]}>
        <App />
      </MemoryRouter>,
    );
    expect(
      await screen.findByRole("heading", { name: "reservation detail page" }),
    ).toBeInTheDocument();
  });

  it("redirects a receptionist away from owner-only billing", async () => {
    authenticate("receptionist");
    render(
      <MemoryRouter initialEntries={["/invoice"]}>
        <App />
      </MemoryRouter>,
    );
    expect(await screen.findByRole("heading", { name: "reservation list page" })).toBeInTheDocument();
    expect(screen.queryByText("customer list page")).not.toBeInTheDocument();
  });

  it("redirects staff away from the business-wide customer list", async () => {
    authenticate("staff");
    render(
      <MemoryRouter initialEntries={["/users"]}>
        <App />
      </MemoryRouter>,
    );
    expect(await screen.findByRole("heading", { name: "reservation list page" })).toBeInTheDocument();
  });

  it("routes an unknown signed-out URL through the protected overview", async () => {
    render(
      <MemoryRouter initialEntries={["/does-not-exist"]}>
        <App />
      </MemoryRouter>,
    );
    expect(await screen.findByRole("heading", { name: "login page" })).toBeInTheDocument();
  });
});
