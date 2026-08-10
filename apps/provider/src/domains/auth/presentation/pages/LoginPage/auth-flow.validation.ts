import { validateValue, validators } from "@/shared/lib/validation";
import { providerPhoneRegion } from "./auth-flow.model";
import type {
  AuthFieldErrorKey,
  AuthFieldErrors,
  AuthFormValues,
} from "./auth-flow.types";

export function getPhoneError(value: string): AuthFieldErrorKey | undefined {
  const issue = validateValue(value, [
    validators.required(),
    validators.phone(providerPhoneRegion),
  ]);

  if (issue === "required") return "phoneRequired";
  return issue === "invalidPhone" ? "invalidPhone" : undefined;
}

export function getOtpError(value: string): AuthFieldErrorKey | undefined {
  const issue = validateValue(value, [
    validators.required(),
    validators.otp(),
  ]);

  if (issue === "required") return "otpRequired";
  return issue ? "invalidOtp" : undefined;
}

export function getPasswordSetupErrors(
  values: Pick<AuthFormValues, "password" | "confirmPassword">,
): AuthFieldErrors {
  const passwordIssue = validateValue(values.password, [
    validators.required(),
    validators.password(),
  ]);
  const confirmationIssue = validateValue(values.confirmPassword, [
    validators.required(),
    validators.matches(values.password),
  ]);

  return {
    password:
      passwordIssue === "required"
        ? "passwordRequired"
        : passwordIssue
          ? "weakPassword"
          : undefined,
    confirmPassword:
      confirmationIssue === "required"
        ? "confirmPasswordRequired"
        : confirmationIssue
          ? "passwordMismatch"
          : undefined,
  };
}

export function getRegistrationProfileErrors(
  values: Pick<AuthFormValues, "fullName" | "businessName">,
): AuthFieldErrors {
  return {
    fullName: values.fullName.trim() ? undefined : "fullNameRequired",
    businessName: values.businessName.trim()
      ? undefined
      : "businessNameRequired",
  };
}

export function hasFieldErrors(errors: AuthFieldErrors): boolean {
  return Object.values(errors).some(Boolean);
}
