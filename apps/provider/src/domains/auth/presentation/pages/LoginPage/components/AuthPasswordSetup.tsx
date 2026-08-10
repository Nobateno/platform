import { useTranslation } from "react-i18next";
import { authNamespace } from "@/domains/auth/i18n";
import PasswordSetupFields from "@/shared/ui/components/PasswordSetupFields";
import type { AuthFlowController } from "../useAuthFlow";
import { useAuthPasswordMessages } from "./useAuthPasswordMessages";

interface AuthPasswordSetupProps {
  controller: AuthFlowController;
  passwordContainerClassName?: string;
}

export default function AuthPasswordSetup({
  controller,
  passwordContainerClassName,
}: AuthPasswordSetupProps) {
  const { t } = useTranslation(authNamespace);
  const messages = useAuthPasswordMessages();
  const { values, fieldErrors, fieldIds, actions } = controller;

  return (
    <PasswordSetupFields
      passwordId={fieldIds.password}
      confirmPasswordId={fieldIds.confirmPassword}
      passwordLabel={t("newPasswordLabel")}
      confirmPasswordLabel={t("confirmPasswordLabel")}
      passwordValue={values.password}
      confirmPasswordValue={values.confirmPassword}
      onPasswordChange={(event) =>
        actions.updateField("password", event.target.value)
      }
      onConfirmPasswordChange={(event) =>
        actions.updateField("confirmPassword", event.target.value)
      }
      messages={messages}
      passwordHint={t("passwordHint")}
      passwordError={
        fieldErrors.password ? t(fieldErrors.password) : undefined
      }
      confirmPasswordError={
        fieldErrors.confirmPassword
          ? t(fieldErrors.confirmPassword)
          : undefined
      }
      passwordContainerClassName={passwordContainerClassName}
    />
  );
}
