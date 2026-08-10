import {
  canAccessArea,
  type ProviderArea,
} from "@/domains/auth/application/permissions";
import type { PanelRole } from "@/domains/auth/store";
import type { icons } from "@/shared/ui/components/Base/Lucide";

export interface ProviderNavigationItem {
  area: ProviderArea;
  section: ProviderNavigationSection;
  path: string;
  labelKey: `nav.${string}`;
  icon: keyof typeof icons;
  legacyPrefixes?: readonly string[];
}

export type ProviderNavigationSection =
  | "schedule"
  | "business"
  | "bookingChannels"
  | "management";

export const providerNavigationSections: ReadonlyArray<{
  id: ProviderNavigationSection;
  labelKey: `nav.${string}`;
}> = [
  { id: "schedule", labelKey: "nav.schedule" },
  { id: "business", labelKey: "nav.business" },
  { id: "bookingChannels", labelKey: "nav.bookingChannels" },
  { id: "management", labelKey: "nav.management" },
];

export const providerNavigation: readonly ProviderNavigationItem[] = [
  {
    area: "overview",
    section: "schedule",
    path: "/",
    labelKey: "nav.overview",
    icon: "Presentation",
  },
  {
    area: "reservations",
    section: "schedule",
    path: "/transaction-list",
    labelKey: "nav.reservations",
    icon: "CalendarCheck2",
    legacyPrefixes: ["/transaction-detail"],
  },
  {
    area: "availability",
    section: "schedule",
    path: "/availability",
    labelKey: "nav.availability",
    icon: "Clock",
  },
  {
    area: "customers",
    section: "business",
    path: "/users",
    labelKey: "nav.customers",
    icon: "Users",
    legacyPrefixes: ["/add-user"],
  },
  {
    area: "services",
    section: "business",
    path: "/product-list",
    labelKey: "nav.services",
    icon: "BookMarked",
    legacyPrefixes: ["/add-product", "/categories"],
  },
  {
    area: "team",
    section: "business",
    path: "/team",
    labelKey: "nav.team",
    icon: "UsersRound",
  },
  {
    area: "publicPresence",
    section: "bookingChannels",
    path: "/booking-page",
    labelKey: "nav.publicPresence",
    icon: "Globe",
  },
  {
    area: "communications",
    section: "bookingChannels",
    path: "/communications",
    labelKey: "nav.communications",
    icon: "BellDot",
  },
  {
    area: "voiceBooking",
    section: "bookingChannels",
    path: "/voice-booking",
    labelKey: "nav.voiceBooking",
    icon: "Podcast",
  },
  {
    area: "reports",
    section: "management",
    path: "/reports",
    labelKey: "nav.reports",
    icon: "FileBarChart2",
  },
  {
    area: "planBilling",
    section: "management",
    path: "/invoice",
    labelKey: "nav.planBilling",
    icon: "WalletCards",
  },
  {
    area: "businessSettings",
    section: "management",
    path: "/settings",
    labelKey: "nav.businessSettings",
    icon: "Settings",
  },
] as const;

export function isNavigationItemActive(
  item: ProviderNavigationItem,
  pathname: string,
): boolean {
  if (item.path === "/") return pathname === "/";
  if (pathname === item.path || pathname.startsWith(`${item.path}/`)) return true;
  return item.legacyPrefixes?.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  ) ?? false;
}

export function getNavigationItemForPath(pathname: string) {
  return providerNavigation.find((item) => isNavigationItemActive(item, pathname));
}

export function canAccessProviderTarget(
  role: PanelRole | undefined,
  target: string,
): boolean {
  if (!role) return false;

  const pathname = target.split(/[?#]/, 1)[0] || "/";
  const item = getNavigationItemForPath(pathname);
  return item ? canAccessArea(role, item.area) : false;
}
