import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { authNamespace } from "@/domains/auth/i18n";
import type { AuthFlowController } from "../useAuthFlow";
import { authTextActionClassName } from "./action-styles";

export default function AuthFlowFooter({
  controller,
}: {
  controller: AuthFlowController;
}) {
  const { t } = useTranslation(authNamespace);

  return (
    <>
      {controller.showRecoveryBackLink && (
        <div className="mt-5 text-center text-sm">
          <Link to="/login" className={authTextActionClassName}>
            {t("backToLogin")}
          </Link>
        </div>
      )}

      {controller.showDemoCredentials && (
        <section
          aria-labelledby="demo-login-title"
          className="mt-6 border-t border-dashed border-slate-300/70 pt-5"
        >
          <h2 id="demo-login-title" className="font-medium">
            {t("demoTitle")}
          </h2>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
            {t("demoCredentials")}
          </p>
        </section>
      )}
    </>
  );
}
