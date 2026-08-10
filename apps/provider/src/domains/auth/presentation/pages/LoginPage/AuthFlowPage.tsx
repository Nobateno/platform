import { useTranslation } from "react-i18next";
import "@/domains/auth/register-i18n";
import { authNamespace } from "@/domains/auth/i18n";
import Alert from "@/shared/ui/components/Base/Alert";
import type { AuthFlow } from "./auth-flow.types";
import { useAuthFlow } from "./useAuthFlow";
import AuthFlowFooter from "./components/AuthFlowFooter";
import AuthPageLayout from "./components/AuthPageLayout";
import AuthStep from "./components/AuthStep";

const headingId = "provider-login-title";

export default function AuthFlowPage({ flow }: { flow: AuthFlow }) {
  const { t } = useTranslation(authNamespace);
  const controller = useAuthFlow(flow);

  const feedback = controller.formError ? (
    <Alert
      id={controller.fieldIds.formError}
      state="error"
      title={t("formErrorTitle")}
      className="mt-5"
    >
      {t(controller.formError)}
    </Alert>
  ) : undefined;

  return (
    <AuthPageLayout
      headingId={headingId}
      headingRef={controller.headingRef}
      title={t(controller.screenCopy.title)}
      subtitle={t(controller.screenCopy.subtitle, {
        phone: controller.values.phone,
      })}
      feedback={feedback}
      heroTitle={t("heroTitle")}
      heroDescription={t("heroDescription")}
    >
      <AuthStep controller={controller} />
      <AuthFlowFooter controller={controller} />
    </AuthPageLayout>
  );
}
