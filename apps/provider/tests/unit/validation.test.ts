import { describe, expect, it } from "vitest";
import {
  getPasswordStrength,
  validateValue,
  validators,
} from "@/shared/lib/validation";

describe("shared validation", () => {
  it("selects the phone rule by region and reuses it across forms", () => {
    const rules = [validators.required(), validators.phone("IR")];

    expect(validateValue("", rules)).toBe("required");
    expect(validateValue("02112345678", rules)).toBe("invalidPhone");
    expect(validateValue("+989121234567", rules)).toBeUndefined();
    expect(validateValue("۰۹۱۲۱۲۳۴۵۶۷", rules)).toBeUndefined();
  });

  it("validates OTP length and numeric content", () => {
    const rule = validators.otp();

    expect(rule("12345")).toBe("invalidOtp");
    expect(rule("12345a")).toBe("invalidOtp");
    expect(rule("123456")).toBeUndefined();
  });

  it("keeps password acceptance separate from strength guidance", () => {
    expect(validators.password()("short")).toBe("passwordTooShort");
    expect(validators.password()("eight888")).toBeUndefined();
    expect(getPasswordStrength("12345678").level).toBe("veryWeak");
    expect(getPasswordStrength("Nobateno-Booking-2026!").level).toBe("strong");
  });
});
