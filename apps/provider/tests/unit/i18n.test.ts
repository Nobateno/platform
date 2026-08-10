import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  getLanguageOption,
  languageOptions,
  normalizeLanguage,
  supportedLanguages,
} from "@/shared/i18n/languages";

describe("language catalog", () => {
  it("supports every product locale with Persian as the safe fallback", () => {
    expect(supportedLanguages).toEqual([
      "fa",
      "en",
      "zh",
      "es",
      "ru",
      "pt",
      "fr",
      "de",
      "ja",
    ]);
    expect(languageOptions).toHaveLength(supportedLanguages.length);
    expect(normalizeLanguage(undefined)).toBe("fa");
    expect(normalizeLanguage("unsupported")).toBe("fa");
  });

  it("normalizes regional locales and exposes the correct writing direction", () => {
    expect(normalizeLanguage("FA-IR")).toBe("fa");
    expect(normalizeLanguage("pt-BR")).toBe("pt");
    expect(normalizeLanguage("zh-Hans")).toBe("zh");
    expect(getLanguageOption("fa").direction).toBe("rtl");

    for (const language of supportedLanguages.filter(
      (language) => language !== "fa",
    )) {
      expect(getLanguageOption(language).direction).toBe("ltr");
    }
  });
});

describe("i18n initialization", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.resetModules();
  });

  it("starts a first-time visit in Persian", async () => {
    const { default: i18n } = await import("@/shared/i18n");

    expect(i18n.resolvedLanguage).toBe("fa");
    expect(i18n.t("common.loading")).not.toBe("common.loading");
  });

  it("falls back to Persian when persisted locale data is invalid", async () => {
    window.localStorage.setItem("language", "xx-YY");
    const { default: i18n } = await import("@/shared/i18n");

    expect(i18n.resolvedLanguage).toBe("fa");
  });

  it("loads shared messages for every supported language", async () => {
    const { default: i18n } = await import("@/shared/i18n");

    for (const language of supportedLanguages) {
      const t = i18n.getFixedT(language);
      expect(t("shell.language")).not.toBe("shell.language");
      expect(t("common.loading")).not.toBe("common.loading");
    }
  });
});
