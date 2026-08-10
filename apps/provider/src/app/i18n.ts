import i18n, { supportedLanguages } from "@/shared/i18n";
import { customersI18n } from "@/domains/customers/i18n";
import { billingI18n } from "@/domains/plan-billing/i18n";
import { overviewI18n } from "@/domains/overview/i18n";
import { reservationsI18n } from "@/domains/reservations/i18n";
import { servicesI18n } from "@/domains/services/i18n";
import { businessSettingsI18n } from "@/domains/business-settings/i18n";
import { availabilityI18n } from "@/domains/availability/i18n";
import { teamI18n } from "@/domains/team/i18n";
import { publicPresenceI18n } from "@/domains/public-presence/i18n";
import { communicationsI18n } from "@/domains/communications/i18n";
import { voiceBookingI18n } from "@/domains/voice-booking/i18n";
import { reportsI18n } from "@/domains/reports/i18n";
import { onboardingI18n } from "@/domains/onboarding/i18n";
import { observabilityI18n } from "@/app/observability/i18n";

const appNamespaces = [
  observabilityI18n,
  customersI18n,
  billingI18n,
  overviewI18n,
  reservationsI18n,
  servicesI18n,
  businessSettingsI18n,
  availabilityI18n,
  teamI18n,
  publicPresenceI18n,
  communicationsI18n,
  voiceBookingI18n,
  reportsI18n,
  onboardingI18n,
] as const;

for (const language of supportedLanguages) {
  for (const { namespace, resources } of appNamespaces) {
    i18n.addResourceBundle(
      language,
      namespace,
      resources[language],
      true,
      true,
    );
  }
}

export default i18n;
