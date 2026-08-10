import type {
  ChangeEventHandler,
  ReactNode,
  Ref,
} from "react";
import { PASSWORD_MIN_LENGTH } from "@/shared/lib/validation";
import PasswordField, {
  type PasswordFieldProps,
} from "@/shared/ui/components/PasswordField";

type PasswordMessages = Pick<
  PasswordFieldProps,
  | "showLabel"
  | "hideLabel"
  | "capsLockLabel"
  | "strengthLabel"
  | "strengthLabels"
>;

export interface PasswordSetupFieldsProps {
  passwordId?: string;
  confirmPasswordId?: string;
  passwordLabel: ReactNode;
  confirmPasswordLabel: ReactNode;
  passwordValue: string;
  confirmPasswordValue: string;
  onPasswordChange: ChangeEventHandler<HTMLInputElement>;
  onConfirmPasswordChange: ChangeEventHandler<HTMLInputElement>;
  messages: PasswordMessages;
  passwordHint?: ReactNode;
  passwordError?: ReactNode;
  confirmPasswordError?: ReactNode;
  passwordName?: string;
  confirmPasswordName?: string;
  passwordRef?: Ref<HTMLInputElement>;
  confirmPasswordRef?: Ref<HTMLInputElement>;
  passwordContainerClassName?: string;
  confirmPasswordContainerClassName?: string;
  minimumLength?: number;
  disabled?: boolean;
  showStrength?: boolean;
}

export default function PasswordSetupFields({
  passwordId,
  confirmPasswordId,
  passwordLabel,
  confirmPasswordLabel,
  passwordValue,
  confirmPasswordValue,
  onPasswordChange,
  onConfirmPasswordChange,
  messages,
  passwordHint,
  passwordError,
  confirmPasswordError,
  passwordName = "newPassword",
  confirmPasswordName = "confirmPassword",
  passwordRef,
  confirmPasswordRef,
  passwordContainerClassName,
  confirmPasswordContainerClassName = "mt-4",
  minimumLength = PASSWORD_MIN_LENGTH,
  disabled = false,
  showStrength = true,
}: PasswordSetupFieldsProps) {
  return (
    <>
      <PasswordField
        {...messages}
        ref={passwordRef}
        id={passwordId}
        label={passwordLabel}
        name={passwordName}
        value={passwordValue}
        onChange={onPasswordChange}
        autoComplete="new-password"
        minLength={minimumLength}
        required
        disabled={disabled}
        showStrength={showStrength}
        hint={passwordHint}
        error={passwordError}
        containerClassName={passwordContainerClassName}
      />
      <PasswordField
        {...messages}
        ref={confirmPasswordRef}
        id={confirmPasswordId}
        label={confirmPasswordLabel}
        name={confirmPasswordName}
        value={confirmPasswordValue}
        onChange={onConfirmPasswordChange}
        autoComplete="new-password"
        minLength={minimumLength}
        required
        disabled={disabled}
        error={confirmPasswordError}
        containerClassName={confirmPasswordContainerClassName}
      />
    </>
  );
}
