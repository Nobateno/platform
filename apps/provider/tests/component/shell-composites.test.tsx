import { act, render, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";
import i18n from "@/app/i18n";
import { canAccessProviderTarget } from "@/app/navigation";
import ActivitiesPanel from "@/shared/ui/components/ActivitiesPanel";
import NotificationsPanel from "@/shared/ui/components/NotificationsPanel";
import QuickSearch from "@/shared/ui/components/QuickSearch";

const reservationOnly = (target: string) =>
  canAccessProviderTarget("staff", target);

function expectLink(target: string, present: boolean) {
  const link = document.querySelector(`a[href="${target}"]`);
  if (present) expect(link).toBeInTheDocument();
  else expect(link).not.toBeInTheDocument();
}

describe("role-aware shell composites", () => {
  beforeEach(async () => {
    await act(() => i18n.changeLanguage("en"));
  });

  it("maps detail and query targets to their provider permission area", () => {
    expect(
      canAccessProviderTarget("staff", "/transaction-detail/NOB-2049"),
    ).toBe(true);
    expect(
      canAccessProviderTarget(
        "receptionist",
        "/transaction-list?status=pending",
      ),
    ).toBe(true);
    expect(
      canAccessProviderTarget("receptionist", "/users/customer-1024"),
    ).toBe(true);
    expect(canAccessProviderTarget("receptionist", "/availability")).toBe(
      false,
    );
    expect(canAccessProviderTarget("staff", "/users")).toBe(false);
    expect(canAccessProviderTarget("owner", "/not-a-provider-target")).toBe(
      false,
    );
  });

  it("hides unauthorized quick-search destinations", async () => {
    render(
      <MemoryRouter>
        <QuickSearch
          quickSearch
          setQuickSearch={() => undefined}
          canNavigateTo={reservationOnly}
        />
      </MemoryRouter>,
    );

    await waitFor(() =>
      expectLink("/transaction-detail/NOB-2049", true),
    );
    expectLink("/transaction-list", true);
    expectLink("/users", false);
    expectLink("/product-list", false);
    expectLink("/communications", false);
    expectLink("/availability", false);
    expectLink("/team", false);
    expectLink("/reports", false);
  });

  it("hides unauthorized activity destinations", async () => {
    render(
      <MemoryRouter>
        <ActivitiesPanel
          activitiesPanel
          setActivitiesPanel={() => undefined}
          canNavigateTo={reservationOnly}
        />
      </MemoryRouter>,
    );

    await waitFor(() =>
      expectLink("/transaction-detail/NOB-2049", true),
    );
    expectLink("/availability", false);
    expectLink("/product-list", false);
  });

  it("hides unauthorized notification destinations", async () => {
    render(
      <MemoryRouter>
        <NotificationsPanel
          notificationsPanel
          setNotificationsPanel={() => undefined}
          canNavigateTo={reservationOnly}
        />
      </MemoryRouter>,
    );

    await waitFor(() =>
      expectLink("/transaction-list?status=pending", true),
    );
    expectLink("/availability", false);
    expectLink("/communications", false);
  });
});
