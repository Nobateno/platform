/**
 * Tenant-facing display and booking policy contract.
 *
 * The provider application owns the persisted values. Customer hosts receive
 * this small, framework-neutral payload at render time; URL values are only a
 * local preview override and never the source of truth.
 */
export type CustomerLocale = "fa" | "en";
export type CustomerTheme = "light" | "dark";
export type CustomerBookingEntry = "profile" | "booking";
export type CustomerBookingConfirmation = "instant" | "approval";

export type CustomerExperienceConfig = {
  providerId: string;
  locale: CustomerLocale;
  theme: CustomerTheme;
  primary: string;
  bookingEntry: CustomerBookingEntry;
  bookingConfirmation: CustomerBookingConfirmation;
  cancellationWindowHours: number;
};

export type CustomerExperienceOverride = Partial<
  Omit<CustomerExperienceConfig, "providerId">
>;

function isLocale(value: unknown): value is CustomerLocale {
  return value === "fa" || value === "en";
}

function isTheme(value: unknown): value is CustomerTheme {
  return value === "light" || value === "dark";
}

function isBookingEntry(value: unknown): value is CustomerBookingEntry {
  return value === "profile" || value === "booking";
}

function isBookingConfirmation(value: unknown): value is CustomerBookingConfirmation {
  return value === "instant" || value === "approval";
}

export function normalizePrimaryColor(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.startsWith("#") ? value : `#${value}`;
  return /^#[0-9a-f]{6}$/i.test(normalized) ? normalized : null;
}

/**
 * Applies trusted tenant settings and then optional preview values. Invalid
 * inputs are ignored so a malformed brand setting cannot break booking.
 */
export function resolveCustomerExperienceConfig(
  base: CustomerExperienceConfig,
  ...overrides: Array<CustomerExperienceOverride | undefined>
): CustomerExperienceConfig {
  return overrides.reduce<CustomerExperienceConfig>((current, override) => {
    if (!override) return current;
    const primary = normalizePrimaryColor(override.primary);
    const cancellationWindowHours = Number.isFinite(override.cancellationWindowHours)
      ? Math.max(0, Math.min(168, Number(override.cancellationWindowHours)))
      : current.cancellationWindowHours;

    return {
      ...current,
      locale: isLocale(override.locale) ? override.locale : current.locale,
      theme: isTheme(override.theme) ? override.theme : current.theme,
      primary: primary ?? current.primary,
      bookingEntry: isBookingEntry(override.bookingEntry)
        ? override.bookingEntry
        : current.bookingEntry,
      bookingConfirmation: isBookingConfirmation(override.bookingConfirmation)
        ? override.bookingConfirmation
        : current.bookingConfirmation,
      cancellationWindowHours,
    };
  }, base);
}
