import { describe, expect, it } from "vitest";
import { authI18n } from "@/domains/auth";
import { communicationsI18n } from "@/domains/communications";
import { onboardingI18n } from "@/domains/onboarding";
import { publicPresenceI18n } from "@/domains/public-presence";
import { reportsI18n } from "@/domains/reports";
import { teamI18n } from "@/domains/team";
import { voiceBookingI18n } from "@/domains/voice-booking";
import { supportedLanguages } from "@/shared/i18n/languages";

const domainDescriptors = [
  authI18n,
  teamI18n,
  publicPresenceI18n,
  communicationsI18n,
  voiceBookingI18n,
  reportsI18n,
  onboardingI18n,
] as const;

describe("new provider-domain translations", () => {
  it("provides the same non-empty message catalog in all nine locales", () => {
    for (const descriptor of domainDescriptors) {
      const englishKeys = Object.keys(descriptor.resources.en).sort();

      for (const language of supportedLanguages) {
        const messages = descriptor.resources[language];
        expect(Object.keys(messages).sort(), `${descriptor.namespace}:${language}`).toEqual(englishKeys);
        expect(
          Object.values(messages).every((value) => typeof value === "string" && value.trim().length > 0),
          `${descriptor.namespace}:${language}`,
        ).toBe(true);
      }
    }
  });
});
