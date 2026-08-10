import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { authNamespace } from "@/domains/auth/i18n";
import PasswordField from "@/shared/ui/components/PasswordField";
import type { AuthFlowController } from "../useAuthFlow";
import AuthSubmitButton from "./AuthSubmitButton";
import { authTextActionClassName } from "./action-styles";
import { useAuthPasswordMessages } from "./useAuthPasswordMessages";

export default function PasswordStep({
  controller,
}: {
  controller: AuthFlowController;
}) {
  const { t } = useTranslation(authNamespace);
  const passwordMessages = useAuthPasswordMessages();
  const {
    values,
    fieldErrors,
    fieldIds,
    isSubmitting,
    serverFieldError,
    actions,
  } = controller;

  return (
    <form className="mt-6" onSubmit={actions.submitPassword} noValidate>
      <div className="mb-5 flex items-center justify-between gap-3 rounded-m3-md bg-m3-surface-container-low px-4 py-2 text-sm">
        <span dir="ltr">{values.phone}</span>
        <button
          type="button"
          className={authTextActionClassName}
          onClick={actions.returnToPhone}
        >
          {t("changePhone")}
        </button>
      </div>

      <PasswordField
        {...passwordMessages}
        id={fieldIds.password}
        label={t("passwordLabel")}
        name="password"
        value={values.password}
        onChange={(event) =>
          actions.updateField("password", event.target.value)
        }
        placeholder={t("passwordPlaceholder")}
        autoComplete="current-password"
        required
        error={
          fieldErrors.password
            ? t(fieldErrors.password)
            : serverFieldError
              ? t(serverFieldError)
              : undefined
        }
      />

      <div className="mt-3 text-end text-sm">
        <Link
          to="/forgot-password"
          state={{ phone: values.phone }}
          className={authTextActionClassName}
        >
          {t("forgotPassword")}
        </Link>
      </div>

      <AuthSubmitButton
        isSubmitting={isSubmitting}
        pendingLabel={t("signingIn")}
        className="mt-3"
      >
        {t("signIn")}
      </AuthSubmitButton>
    </form>
  );
}
