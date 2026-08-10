import type { ReactElement } from "react";
import { render } from "@testing-library/react";
import i18next from "i18next";
import { I18nextProvider, initReactI18next } from "react-i18next";
import type { AppLanguage } from "@/shared/i18n/languages";

export async function renderWithDomainI18n<TMessages extends Record<string, string>>(
  page: ReactElement,
  namespace: string,
  resources: Record<AppLanguage, TMessages>,
) {
  const instance = i18next.createInstance();
  await instance.use(initReactI18next).init({
    lng: "en",
    fallbackLng: "en",
    ns: [namespace],
    defaultNS: namespace,
    interpolation: { escapeValue: false },
    resources: {
      en: { [namespace]: resources.en },
    },
  });

  return render(<I18nextProvider i18n={instance}>{page}</I18nextProvider>);
}
