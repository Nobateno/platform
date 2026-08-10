import i18n, { supportedLanguages } from "@/shared/i18n";
import { authI18n } from "./i18n";

for (const language of supportedLanguages) {
  i18n.addResourceBundle(
    language,
    authI18n.namespace,
    authI18n.resources[language],
    true,
    true,
  );
}
