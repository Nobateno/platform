import { useTranslation } from "react-i18next";
import { authNamespace } from "@/domains/auth/i18n";

export function useAuthPasswordMessages() {
  const { t } = useTranslation(authNamespace);

  return {
    showLabel: t("showPassword"),
    hideLabel: t("hidePassword"),
    capsLockLabel: t("capsLockOn"),
    strengthLabel: t("passwordStrength"),
    strengthLabels: {
      veryWeak: t("strengthVeryWeak"),
      weak: t("strengthWeak"),
      good: t("strengthGood"),
      strong: t("strengthStrong"),
    },
  };
}
