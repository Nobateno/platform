import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { authNamespace } from "@/domains/auth/i18n";
import Button from "@/shared/ui/components/Base/Button";

export default function ResetCompleteStep() {
  const { t } = useTranslation(authNamespace);

  return (
    <Button
      as={Link}
      to="/login"
      variant="primary"
      rounded
      className="mt-6 w-full py-3.5"
    >
      {t("backToLogin")}
    </Button>
  );
}
