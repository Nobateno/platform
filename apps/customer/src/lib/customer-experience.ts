"use client";

import {
  resolveCustomerExperienceConfig,
  type CustomerExperienceOverride,
} from "@nobateno/ui-kit/customer-experience";
import { customerExperience } from "@/data/customer-fixture";
import type { ReadonlyURLSearchParams } from "next/navigation";

declare global {
  interface Window {
    /**
     * Provider host integration point. The shell should inject values resolved
     * for the current tenant; this keeps themes and language provider-scoped.
     */
    __NOBATENO_CUSTOMER_EXPERIENCE__?: CustomerExperienceOverride;
  }
}

function previewOverride(searchParams: ReadonlyURLSearchParams): CustomerExperienceOverride {
  const locale = searchParams.get("lang") ?? searchParams.get("locale");
  const theme = searchParams.get("theme");
  const primary = searchParams.get("primary");
  const bookingEntry = searchParams.get("entry");
  const bookingConfirmation = searchParams.get("bookingMode");

  return {
    ...(locale ? { locale } : {}),
    ...(theme ? { theme } : {}),
    ...(primary ? { primary } : {}),
    ...(bookingEntry ? { bookingEntry } : {}),
    ...(bookingConfirmation === "instant" || bookingConfirmation === "approval"
      ? { bookingConfirmation }
      : {}),
  } as CustomerExperienceOverride;
}

/**
 * Runtime tenant settings win over the fixture; URL parameters then let the
 * provider preview a theme or locale without changing persisted settings.
 */
export function getCustomerExperience(searchParams: ReadonlyURLSearchParams) {
  const runtimeOverride = typeof window === "undefined"
    ? undefined
    : window.__NOBATENO_CUSTOMER_EXPERIENCE__;

  return resolveCustomerExperienceConfig(
    customerExperience,
    runtimeOverride,
    previewOverride(searchParams),
  );
}
