import { useTranslation } from "react-i18next";
import { authNamespace } from "@/domains/auth/i18n";
import FormField from "@/shared/ui/components/FormField";
import type { AuthFlowController } from "../useAuthFlow";
import AuthPasswordSetup from "./AuthPasswordSetup";
import AuthSubmitButton from "./AuthSubmitButton";

export default function RegistrationStep({
  controller,
}: {
  controller: AuthFlowController;
}) {
  const { t } = useTranslation(authNamespace);
  const { values, fieldErrors, fieldIds, isSubmitting, actions } = controller;

  return (
    <form className="mt-6" onSubmit={actions.submitRegistration} noValidate>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2">
        <FormField
          id={fieldIds.fullName}
          label={t("fullNameLabel")}
          name="fullName"
          value={values.fullName}
          onChange={(event) =>
            actions.updateField("fullName", event.target.value)
          }
          autoComplete="name"
          required
          error={
            fieldErrors.fullName ? t(fieldErrors.fullName) : undefined
          }
        />
        <FormField
          id={fieldIds.businessName}
          label={t("businessNameLabel")}
          name="businessName"
          value={values.businessName}
          onChange={(event) =>
            actions.updateField("businessName", event.target.value)
          }
          autoComplete="organization"
          required
          error={
            fieldErrors.businessName
              ? t(fieldErrors.businessName)
              : undefined
          }
        />
      </div>

      <AuthPasswordSetup
        controller={controller}
        passwordContainerClassName="mt-4"
      />

      <AuthSubmitButton
        isSubmitting={isSubmitting}
        pendingLabel={t("creatingAccount")}
      >
        {t("createAccount")}
      </AuthSubmitButton>
    </form>
  );
}
