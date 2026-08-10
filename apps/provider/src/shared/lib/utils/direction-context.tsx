"use client";

import {
  createContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import i18n, {
  getLanguageOption,
  normalizeLanguage,
  type AppLanguage,
} from "@/shared/i18n";
import dayjs from "dayjs";
import "dayjs/locale/de";
import "dayjs/locale/es";
import "dayjs/locale/fa";
import "dayjs/locale/fr";
import "dayjs/locale/ja";
import "dayjs/locale/pt-br";
import "dayjs/locale/ru";
import "dayjs/locale/zh-cn";

export type Direction = "ltr" | "rtl";

interface DirectionContextType {
  direction: Direction;
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
}

interface DirectionProviderProps {
  children: ReactNode;
  initialDirection?: Direction;
}

export const DEFAULT_DIRECTION: Direction = "rtl";

const dayjsLocales: Record<AppLanguage, string> = {
  fa: "fa",
  en: "en",
  zh: "zh-cn",
  es: "es",
  ru: "ru",
  pt: "pt-br",
  fr: "fr",
  de: "de",
  ja: "ja",
};

export const getDayjsLocale = (language: AppLanguage) =>
  dayjsLocales[language];

dayjs.locale(
  getDayjsLocale(
    normalizeLanguage(i18n.resolvedLanguage ?? i18n.language),
  ),
);

export const DirectionContext = createContext<
  DirectionContextType | undefined
>(undefined);

export const DirectionProvider = ({
  children,
  initialDirection,
}: DirectionProviderProps) => {
  const initialLanguage = normalizeLanguage(i18n.resolvedLanguage ?? i18n.language);
  const [direction, setDirection] = useState<Direction>(
    initialDirection ?? getLanguageOption(initialLanguage).direction,
  );
  const [language, setLanguageState] = useState<AppLanguage>(initialLanguage);

  useEffect(() => {
    const syncLanguage = (value: string) => {
      const nextLanguage = normalizeLanguage(value);
      const languageOption = getLanguageOption(nextLanguage);
      const nextDirection = languageOption.direction;
      setLanguageState(nextLanguage);
      setDirection(nextDirection);
      document.documentElement.lang = languageOption.documentLanguage;
      document.documentElement.dataset.language = nextLanguage;
      document.documentElement.dir = nextDirection;
      dayjs.locale(getDayjsLocale(nextLanguage));
      const documentT = i18n.getFixedT(nextLanguage, "document");
      document.title = documentT("title");
      document
        .querySelector<HTMLMetaElement>('meta[name="description"]')
        ?.setAttribute("content", documentT("description"));
      try { localStorage.setItem("language", nextLanguage); } catch { /* optional */ }
    };
    syncLanguage(i18n.resolvedLanguage ?? i18n.language);
    i18n.on("languageChanged", syncLanguage);
    return () => i18n.off("languageChanged", syncLanguage);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("dir", direction);
  }, [direction]);

  const setLanguage = (value: AppLanguage) => void i18n.changeLanguage(value);

  const contextValue = useMemo(
    () => ({ direction, language, setLanguage }),
    [direction, language]
  );

  return (
    <DirectionContext.Provider value={contextValue}>
      {children}
    </DirectionContext.Provider>
  );
};
