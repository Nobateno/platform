import { useTranslation } from "react-i18next";
import { authNamespace } from "@/domains/auth/i18n";
import type { AuthFlowController } from "../useAuthFlow";
import AuthPasswordSetup from "./AuthPasswordSetup";
import AuthSubmitButton from "./AuthSubmitButton";

export default function ResetPasswordStep({
  controller,
}: {
  controller: AuthFlowController;
}) {
  const { t } = useTranslation(authNamespace);

  return (
    <form
      className="mt-6"
      onSubmit={controller.actions.submitPasswordReset}
      noValidate
    >
      <AuthPasswordSetup controller={controller} />
      <AuthSubmitButton
        isSubmitting={controller.isSubmitting}
        pendingLabel={t("resettingPassword")}
      >
        {t("resetPassword")}
      </AuthSubmitButton>
    </form>
  );
}
