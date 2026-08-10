import {
  isValidPhoneNumber,
  type PhoneRegionId,
} from "@/shared/lib/phone";

export const PASSWORD_MIN_LENGTH = 8;

export type ValidationIssue =
  | "required"
  | "invalidPhone"
  | "invalidOtp"
  | "passwordTooShort"
  | "valuesDoNotMatch";

export type Validator<T> = (value: T) => ValidationIssue | undefined;

export const validators = {
  required:
    (issue: ValidationIssue = "required"): Validator<string> =>
    (value) =>
      value.trim() ? undefined : issue,
  phone:
    (region: PhoneRegionId): Validator<string> =>
    (value) =>
      isValidPhoneNumber(value, region) ? undefined : "invalidPhone",
  otp:
    (length = 6): Validator<string> =>
    (value) =>
      new RegExp(`^\\d{${length}}$`).test(value) ? undefined : "invalidOtp",
  password:
    (minimumLength = PASSWORD_MIN_LENGTH): Validator<string> =>
    (value) =>
      value.length >= minimumLength ? undefined : "passwordTooShort",
  matches:
    (expected: string): Validator<string> =>
    (value) =>
      value === expected ? undefined : "valuesDoNotMatch",
} as const;

export function validateValue<T>(
  value: T,
  rules: readonly Validator<T>[],
): ValidationIssue | undefined {
  for (const rule of rules) {
    const issue = rule(value);
    if (issue) return issue;
  }
  return undefined;
}

export type PasswordStrengthLevel =
  | "empty"
  | "veryWeak"
  | "weak"
  | "good"
  | "strong";

export interface PasswordStrength {
  level: PasswordStrengthLevel;
  score: 0 | 1 | 2 | 3 | 4;
}

export function getPasswordStrength(value: string): PasswordStrength {
  if (!value) return { level: "empty", score: 0 };

  const criteria = [
    value.length >= PASSWORD_MIN_LENGTH,
    value.length >= 12,
    /\p{L}/u.test(value) && /\d/u.test(value),
    (/[a-z]/u.test(value) && /[A-Z]/u.test(value)) ||
      /[^\p{L}\d\s]/u.test(value),
  ];
  const rawScore = criteria.filter(Boolean).length;
  const score = Math.max(1, rawScore) as 1 | 2 | 3 | 4;
  const level = (
    score === 1
      ? "veryWeak"
      : score === 2
        ? "weak"
        : score === 3
          ? "good"
          : "strong"
  ) satisfies Exclude<PasswordStrengthLevel, "empty">;

  return { level, score };
}
