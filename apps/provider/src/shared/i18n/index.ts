import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { de } from "./locales/de";
import { en } from "./locales/en";
import { es } from "./locales/es";
import { fa } from "./locales/fa";
import { fr } from "./locales/fr";
import { ja } from "./locales/ja";
import { pt } from "./locales/pt";
import { ru } from "./locales/ru";
import { zh } from "./locales/zh";
import { sharedUiResources } from "./shared-ui";
import { documentResources } from "./document";
import {
  normalizeLanguage,
  supportedLanguages,
  type AppLanguage,
} from "./languages";

export {
  getLanguageOption,
  isAppLanguage,
  languageOptions,
  normalizeLanguage,
  supportedLanguages,
  type AppLanguage,
  type LanguageOption,
} from "./languages";

const resources = {
  fa: { translation: fa, shared: fa, sharedUi: sharedUiResources.fa, document: documentResources.fa },
  en: { translation: en, shared: en, sharedUi: sharedUiResources.en, document: documentResources.en },
  zh: { translation: zh, shared: zh, sharedUi: sharedUiResources.zh, document: documentResources.zh },
  es: { translation: es, shared: es, sharedUi: sharedUiResources.es, document: documentResources.es },
  ru: { translation: ru, shared: ru, sharedUi: sharedUiResources.ru, document: documentResources.ru },
  pt: { translation: pt, shared: pt, sharedUi: sharedUiResources.pt, document: documentResources.pt },
  fr: { translation: fr, shared: fr, sharedUi: sharedUiResources.fr, document: documentResources.fr },
  de: { translation: de, shared: de, sharedUi: sharedUiResources.de, document: documentResources.de },
  ja: { translation: ja, shared: ja, sharedUi: sharedUiResources.ja, document: documentResources.ja },
};

const getInitialLanguage = (): AppLanguage => {
  if (typeof window === "undefined") return "fa";
  try {
    return normalizeLanguage(window.localStorage.getItem("language"));
  } catch {
    return "fa";
  }
};

void i18n.use(initReactI18next).init({
  resources,
  lng: getInitialLanguage(),
  fallbackLng: "fa",
  supportedLngs: [...supportedLanguages],
  load: "languageOnly",
  cleanCode: true,
  interpolation: { escapeValue: false },
});

export default i18n;
