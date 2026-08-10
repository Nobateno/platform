import { getDigits, toLatinDigits } from "@/shared/lib/digits";
import iranFlag from "@/assets/images/flags/ir.svg";

export interface PhoneRegionDefinition {
  id: string;
  callingCode: string;
  flagAsset: string;
  acceptedInputDigitLengths: readonly number[];
  maximumInputDigits: number;
  example: string;
  constrainInput: (value: string) => string;
  normalize: (value: string) => string;
  validate: (value: string) => boolean;
}

function getIranLocalDigits(value: string): string {
  const latinValue = toLatinDigits(value).trim();
  const digits = getDigits(latinValue);

  if (latinValue.startsWith("+98")) return digits.slice(2);
  if (digits.startsWith("0098")) return digits.slice(4);
  if (digits.startsWith("98") && digits.length === 12) return digits.slice(2);
  return digits;
}

function normalizeIranPhone(value: string): string {
  const digits = getIranLocalDigits(value);
  return /^9\d{9}$/.test(digits) ? `0${digits}` : digits;
}

const iranPhoneRegion = {
  id: "IR",
  callingCode: "+98",
  flagAsset: iranFlag,
  acceptedInputDigitLengths: [10, 11],
  maximumInputDigits: 11,
  example: "09123456789",
  constrainInput: (value: string) => getIranLocalDigits(value).slice(0, 11),
  normalize: normalizeIranPhone,
  validate: (value: string) => /^09\d{9}$/.test(normalizeIranPhone(value)),
} as const satisfies PhoneRegionDefinition;

export const phoneRegionConfig = {
  IR: iranPhoneRegion,
} as const satisfies Record<string, PhoneRegionDefinition>;

export type PhoneRegionId = keyof typeof phoneRegionConfig;

export function getPhoneRegion(region: PhoneRegionId): PhoneRegionDefinition {
  return phoneRegionConfig[region];
}

export function constrainPhoneInput(
  value: string,
  region: PhoneRegionId,
): string {
  return getPhoneRegion(region).constrainInput(value);
}

export function normalizePhoneNumber(
  value: string,
  region: PhoneRegionId,
): string {
  return getPhoneRegion(region).normalize(value);
}

export function isValidPhoneNumber(
  value: string,
  region: PhoneRegionId,
): boolean {
  return getPhoneRegion(region).validate(value);
}
