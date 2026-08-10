import { useTranslation } from "react-i18next";
import { authNamespace } from "@/domains/auth/i18n";
import Alert from "@/shared/ui/components/Base/Alert";
import OtpField from "@/shared/ui/components/OtpField";
import type { AuthFlowController } from "../useAuthFlow";
import AuthSubmitButton from "./AuthSubmitButton";
import {
  authMutedActionClassName,
  authTextActionClassName,
} from "./action-styles";

export default function OtpStep({
  controller,
}: {
  controller: AuthFlowController;
}) {
  const { t } = useTranslation(authNamespace);
  const {
    values,
    fieldErrors,
    fieldIds,
    isSubmitting,
    serverFieldError,
    actions,
  } = controller;

  return (
    <form className="mt-6" onSubmit={actions.submitOtp} noValidate>
      <Alert state="info" title={t("codeSentTitle")} className="mb-5">
        {t("codeSent", { phone: values.phone })}
      </Alert>

      <OtpField
        id={fieldIds.otp}
        label={t("otpLabel")}
        value={values.otp}
        onChange={(value) => actions.updateField("otp", value)}
        error={
          fieldErrors.otp
            ? t(fieldErrors.otp)
            : serverFieldError
              ? t(serverFieldError)
              : undefined
        }
        hint={t("otpHint")}
        digitLabel={t("otpDigitLabel")}
        required
        disabled={isSubmitting}
      />

      <AuthSubmitButton
        isSubmitting={isSubmitting}
        pendingLabel={t("verifyingCode")}
      >
        {t("verifyCode")}
      </AuthSubmitButton>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm">
        <button
          type="button"
          className={authTextActionClassName}
          onClick={() => void actions.resendOtp()}
          disabled={isSubmitting}
        >
          {t("resendCode")}
        </button>
        <button
          type="button"
          className={authMutedActionClassName}
          onClick={actions.returnToPhone}
        >
          {t("changePhone")}
        </button>
      </div>
    </form>
  );
}
