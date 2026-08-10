import { describe, expect, it } from "vitest";
import {
  constrainPhoneInput,
  getPhoneRegion,
  isValidPhoneNumber,
  normalizePhoneNumber,
  phoneRegionConfig,
} from "@/shared/lib/phone";

describe("region-aware phone rules", () => {
  it("keeps dialing metadata and input limits in the region definition", () => {
    expect(Object.keys(phoneRegionConfig)).toEqual(["IR"]);
    expect(getPhoneRegion("IR")).toMatchObject({
      callingCode: "+98",
      acceptedInputDigitLengths: [10, 11],
      maximumInputDigits: 11,
    });
  });

  it.each([
    ["0912 345 6789", "09123456789"],
    ["912 345 6789", "09123456789"],
    ["+98 912 345 6789", "09123456789"],
    ["0098-912-345-6789", "09123456789"],
    ["۹۱۲۳۴۵۶۷۸۹", "09123456789"],
    ["٠٩١٢٣٤٥٦٧٨٩", "09123456789"],
  ])("normalizes %s", (input, expected) => {
    expect(normalizePhoneNumber(input, "IR")).toBe(expected);
    expect(isValidPhoneNumber(input, "IR")).toBe(true);
  });

  it("constrains the editable value to the region digit limit", () => {
    expect(constrainPhoneInput("091234567890123", "IR")).toBe("09123456789");
    expect(constrainPhoneInput("+98 912 345 6789", "IR")).toBe("9123456789");
    expect(constrainPhoneInput("۰۹۱۲abc۳۴۵۶۷۸۹", "IR")).toBe("09123456789");
  });

  it.each(["", "02112345678", "0912345678", "091234567890"])(
    "rejects %s",
    (input) => {
      expect(isValidPhoneNumber(input, "IR")).toBe(false);
    },
  );
});
