import { describe, expect, it } from "vitest";
import {
  getAuthScreenCopy,
  getInitialAuthScreen,
  getServerFieldError,
  getVerifiedAuthScreen,
  safeReturnPath,
} from "@/domains/auth/presentation/pages/LoginPage/auth-flow.model";
import {
  getOtpError,
  getPasswordSetupErrors,
  getPhoneError,
  getRegistrationProfileErrors,
  hasFieldErrors,
} from "@/domains/auth/presentation/pages/LoginPage/auth-flow.validation";
import type { AuthScreen } from "@/domains/auth/presentation/pages/LoginPage/auth-flow.types";

describe("authentication flow model", () => {
  it("uses explicit screens for login, recovery, and verified OTP purposes", () => {
    expect(getInitialAuthScreen("login")).toEqual({
      type: "phone",
      flow: "login",
    });
    expect(getInitialAuthScreen("recovery")).toEqual({
      type: "phone",
      flow: "recovery",
    });
    expect(getVerifiedAuthScreen("registration")).toEqual({
      type: "registration",
    });
    expect(getVerifiedAuthScreen("password-reset")).toEqual({
      type: "resetPassword",
    });
  });

  it.each<[AuthScreen, string]>([
    [{ type: "phone", flow: "login" }, "phoneTitle"],
    [{ type: "phone", flow: "recovery" }, "recoveryTitle"],
    [{ type: "password" }, "passwordTitle"],
    [{ type: "otp", purpose: "registration" }, "otpTitle"],
    [{ type: "otp", purpose: "password-reset" }, "otpTitle"],
    [{ type: "registration" }, "onboardingTitle"],
    [{ type: "resetPassword" }, "resetTitle"],
    [{ type: "resetComplete" }, "resetCompleteTitle"],
  ])("maps $type to its copy without render-time condition chains", (screen, title) => {
    expect(getAuthScreenCopy(screen).title).toBe(title);
  });

  it("routes only actionable server errors to their fields", () => {
    expect(
      getServerFieldError({ type: "password" }, "invalidCredentials"),
    ).toBe("invalidCredentials");
    expect(
      getServerFieldError(
        { type: "otp", purpose: "registration" },
        "invalidOtp",
      ),
    ).toBe("invalidOtp");
    expect(getServerFieldError({ type: "password" }, "unavailable")).toBeUndefined();
    expect(
      getServerFieldError({ type: "resetPassword" }, "invalidOtp"),
    ).toBeUndefined();
  });

  it("accepts only local return paths", () => {
    expect(safeReturnPath("/reservations?view=today")).toBe(
      "/reservations?view=today",
    );
    expect(safeReturnPath("//example.com/account")).toBeUndefined();
    expect(safeReturnPath("https://example.com/account")).toBeUndefined();
    expect(safeReturnPath(null)).toBeUndefined();
  });
});

describe("authentication flow validation", () => {
  it("returns typed phone and OTP errors", () => {
    expect(getPhoneError("")).toBe("phoneRequired");
    expect(getPhoneError("02112345678")).toBe("invalidPhone");
    expect(getPhoneError("9123456789")).toBeUndefined();
    expect(getOtpError("12345")).toBe("invalidOtp");
    expect(getOtpError("123456")).toBeUndefined();
  });

  it("builds one error object for registration and password setup", () => {
    const profileErrors = getRegistrationProfileErrors({
      fullName: " ",
      businessName: "Nobateno Studio",
    });
    const passwordErrors = getPasswordSetupErrors({
      password: "short",
      confirmPassword: "different",
    });

    expect(profileErrors).toEqual({
      fullName: "fullNameRequired",
      businessName: undefined,
    });
    expect(passwordErrors).toEqual({
      password: "weakPassword",
      confirmPassword: "passwordMismatch",
    });
    expect(hasFieldErrors({ ...profileErrors, ...passwordErrors })).toBe(true);
  });
});
