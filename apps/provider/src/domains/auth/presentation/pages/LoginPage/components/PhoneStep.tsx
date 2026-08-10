import { useTranslation } from "react-i18next";
import { authNamespace } from "@/domains/auth/i18n";
import PhoneNumberField from "@/shared/ui/components/PhoneNumberField";
import { providerPhoneRegion } from "../auth-flow.model";
import type { AuthFlowController } from "../useAuthFlow";
import AuthSubmitButton from "./AuthSubmitButton";

export default function PhoneStep({
  controller,
}: {
  controller: AuthFlowController;
}) {
  const { t } = useTranslation(authNamespace);
  const { values, fieldErrors, fieldIds, isSubmitting, actions } = controller;

  return (
    <form className="mt-6" onSubmit={actions.submitPhone} noValidate>
      <PhoneNumberField
        id={fieldIds.phone}
        label={t("phoneLabel")}
        region={providerPhoneRegion}
        regionLabel={t("phoneRegionLabel")}
        regionName={t("iranRegionName")}
        regionSelectorDisabled
        name="phone"
        value={values.phone}
        onValueChange={(value) => actions.updateField("phone", value)}
        onBlur={actions.validatePhone}
        placeholder={t("phonePlaceholder")}
        autoComplete="tel"
        required
        error={fieldErrors.phone ? t(fieldErrors.phone) : undefined}
        hint={t("phoneHint")}
      />
      <AuthSubmitButton
        isSubmitting={isSubmitting}
        pendingLabel={t("checkingPhone")}
      >
        {t("continue")}
      </AuthSubmitButton>
    </form>
  );
}
