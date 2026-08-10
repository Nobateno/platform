import type {
  AuthErrorCode,
  OtpPurpose,
} from "@/domains/auth/application/auth-store";
import type { AuthMessages } from "@/domains/auth/i18n";

export type AuthFlow = "login" | "recovery";

export type AuthScreen =
  | { type: "phone"; flow: AuthFlow }
  | { type: "password" }
  | { type: "otp"; purpose: OtpPurpose }
  | { type: "registration" }
  | { type: "resetPassword" }
  | { type: "resetComplete" };

export type AuthMessageKey = keyof AuthMessages;

export type AuthFieldName =
  | "phone"
  | "password"
  | "confirmPassword"
  | "otp"
  | "fullName"
  | "businessName";

export type AuthFieldErrorKey =
  | "phoneRequired"
  | "invalidPhone"
  | "accountNotFound"
  | "passwordRequired"
  | "otpRequired"
  | "invalidOtp"
  | "fullNameRequired"
  | "businessNameRequired"
  | "weakPassword"
  | "confirmPasswordRequired"
  | "passwordMismatch";

export type AuthFieldErrors = Partial<
  Record<AuthFieldName, AuthFieldErrorKey>
>;

export interface AuthFormValues {
  phone: string;
  password: string;
  confirmPassword: string;
  otp: string;
  fullName: string;
  businessName: string;
  verificationToken: string;
}

export interface AuthFieldIds {
  phone: string;
  password: string;
  confirmPassword: string;
  otp: string;
  fullName: string;
  businessName: string;
  formError: string;
}

export interface AuthScreenCopy {
  title: AuthMessageKey;
  subtitle: AuthMessageKey;
}

export type AuthServerFieldError = Extract<
  AuthErrorCode,
  "invalidCredentials" | "invalidOtp"
>;
