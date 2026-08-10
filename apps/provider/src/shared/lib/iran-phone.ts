export { toLatinDigits } from "@/shared/lib/digits";
import {
  isValidPhoneNumber,
  normalizePhoneNumber,
} from "@/shared/lib/phone";

export function normalizeIranPhone(value: string): string {
  return normalizePhoneNumber(value, "IR");
}

export function isValidIranPhone(value: string): boolean {
  return isValidPhoneNumber(value, "IR");
}
