import type { PanelRole } from "./auth-store";

export type ProviderArea =
  | "overview"
  | "reservations"
  | "availability"
  | "customers"
  | "services"
  | "team"
  | "publicPresence"
  | "communications"
  | "voiceBooking"
  | "reports"
  | "planBilling"
  | "businessSettings"
  | "onboarding";

const allowedAreas: Record<PanelRole, ReadonlySet<ProviderArea>> = {
  owner: new Set<ProviderArea>([
    "overview",
    "reservations",
    "availability",
    "customers",
    "services",
    "team",
    "publicPresence",
    "communications",
    "voiceBooking",
    "reports",
    "planBilling",
    "businessSettings",
    "onboarding",
  ]),
  receptionist: new Set<ProviderArea>([
    "overview",
    "reservations",
    "customers",
  ]),
  staff: new Set<ProviderArea>(["overview", "reservations"]),
};

/**
 * Client-side visibility is intentionally conservative. Optional permissions
 * from the product matrix stay hidden until the server returns explicit grants.
 * The API must enforce every authorization decision independently.
 */
export function canAccessArea(role: PanelRole, area: ProviderArea): boolean {
  return allowedAreas[role].has(area);
}

export function getDefaultAreaPath(role: PanelRole): string {
  return role === "owner" ? "/" : "/transaction-list";
}
