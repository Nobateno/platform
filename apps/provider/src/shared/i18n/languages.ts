export const supportedLanguages = [
  "fa",
  "en",
  "zh",
  "es",
  "ru",
  "pt",
  "fr",
  "de",
  "ja",
] as const;

export type AppLanguage = (typeof supportedLanguages)[number];

export interface LanguageOption {
  code: AppLanguage;
  nativeName: string;
  shortLabel: string;
  direction: "ltr" | "rtl";
  documentLanguage: string;
}

export const languageOptions: readonly LanguageOption[] = [
  { code: "fa", nativeName: "فارسی", shortLabel: "فا", direction: "rtl", documentLanguage: "fa" },
  { code: "en", nativeName: "English", shortLabel: "EN", direction: "ltr", documentLanguage: "en" },
  { code: "zh", nativeName: "简体中文", shortLabel: "中文", direction: "ltr", documentLanguage: "zh-Hans" },
  { code: "es", nativeName: "Español", shortLabel: "ES", direction: "ltr", documentLanguage: "es" },
  { code: "ru", nativeName: "Русский", shortLabel: "RU", direction: "ltr", documentLanguage: "ru" },
  { code: "pt", nativeName: "Português", shortLabel: "PT", direction: "ltr", documentLanguage: "pt-BR" },
  { code: "fr", nativeName: "Français", shortLabel: "FR", direction: "ltr", documentLanguage: "fr" },
  { code: "de", nativeName: "Deutsch", shortLabel: "DE", direction: "ltr", documentLanguage: "de" },
  { code: "ja", nativeName: "日本語", shortLabel: "日本", direction: "ltr", documentLanguage: "ja" },
] as const;

export const isAppLanguage = (value: unknown): value is AppLanguage =>
  typeof value === "string" &&
  supportedLanguages.includes(value as AppLanguage);

export const normalizeLanguage = (value: unknown): AppLanguage => {
  if (typeof value !== "string") return "fa";
  const baseLanguage = value.toLowerCase().split("-")[0];
  return isAppLanguage(baseLanguage) ? baseLanguage : "fa";
};

export const getLanguageOption = (language: AppLanguage) =>
  languageOptions.find(({ code }) => code === language) ?? languageOptions[0];
