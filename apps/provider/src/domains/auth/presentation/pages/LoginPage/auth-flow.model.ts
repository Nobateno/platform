import type {
  AuthErrorCode,
  OtpPurpose,
} from "@/domains/auth/application/auth-store";
import type {
  AuthFlow,
  AuthScreen,
  AuthScreenCopy,
  AuthServerFieldError,
} from "./auth-flow.types";

export const providerPhoneRegion = "IR" as const;

export function getInitialAuthScreen(flow: AuthFlow): AuthScreen {
  return { type: "phone", flow };
}

export function getVerifiedAuthScreen(purpose: OtpPurpose): AuthScreen {
  return purpose === "registration"
    ? { type: "registration" }
    : { type: "resetPassword" };
}

export function getAuthScreenCopy(screen: AuthScreen): AuthScreenCopy {
  switch (screen.type) {
    case "phone":
      return screen.flow === "recovery"
        ? { title: "recoveryTitle", subtitle: "recoverySubtitle" }
        : { title: "phoneTitle", subtitle: "phoneSubtitle" };
    case "password":
      return { title: "passwordTitle", subtitle: "passwordSubtitle" };
    case "otp":
      return { title: "otpTitle", subtitle: "otpSubtitle" };
    case "registration":
      return { title: "onboardingTitle", subtitle: "onboardingSubtitle" };
    case "resetPassword":
      return { title: "resetTitle", subtitle: "resetSubtitle" };
    case "resetComplete":
      return {
        title: "resetCompleteTitle",
        subtitle: "resetComplete",
      };
  }
}

export function getServerFieldError(
  screen: AuthScreen,
  error?: AuthErrorCode,
): AuthServerFieldError | undefined {
  if (screen.type === "password" && error === "invalidCredentials") {
    return error;
  }
  if (screen.type === "otp" && error === "invalidOtp") return error;
  return undefined;
}

export function safeReturnPath(value: unknown): string | undefined {
  return typeof value === "string" &&
    value.startsWith("/") &&
    !value.startsWith("//")
    ? value
    : undefined;
}
