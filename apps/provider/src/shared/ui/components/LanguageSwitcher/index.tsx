import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  languageOptions,
  normalizeLanguage,
} from "@/shared/i18n";
import { DirectionContext } from "@/shared/lib/utils/direction-context";
import Lucide from "@/shared/ui/components/Base/Lucide";

export default function LanguageSwitcher() {
  const { t } = useTranslation();
  const locale = useContext(DirectionContext);
  const [isOpen, setIsOpen] = useState(false);

  if (!locale) return null;

  return (
    <label
      className="relative flex h-10 w-10 items-center justify-center rounded-full bg-m3-surface-container text-m3-on-surface transition-colors hover:bg-m3-surface-container-high focus-within:ring-2 focus-within:ring-m3-primary sm:w-auto sm:min-w-[8.5rem] sm:justify-start sm:px-3"
      title={t("shell.language")}
      data-state={isOpen ? "open" : "closed"}
    >
      <Lucide icon="Globe" className="pointer-events-none h-[18px] w-[18px]" />
      <select
        value={locale.language}
        onBlur={() => setIsOpen(false)}
        onChange={(event) => {
          setIsOpen(false);
          locale.setLanguage(normalizeLanguage(event.target.value));
        }}
        onKeyDown={(event) => {
          if (
            event.key === "Enter" ||
            event.key === " " ||
            event.key === "ArrowDown" ||
            event.key === "ArrowUp"
          ) {
            setIsOpen(true);
          }
          if (event.key === "Escape" || event.key === "Tab") {
            setIsOpen(false);
          }
        }}
        onPointerDown={() => setIsOpen((open) => !open)}
        aria-label={t("shell.language")}
        className="absolute inset-0 h-full w-full cursor-pointer appearance-none border-0 bg-transparent bg-none opacity-0 shadow-none outline-none focus:ring-0 sm:static sm:min-w-0 sm:flex-1 sm:py-0 sm:ps-2 sm:pe-6 sm:text-sm sm:font-medium sm:text-inherit sm:opacity-100"
      >
        {languageOptions.map(({ code, nativeName, documentLanguage, direction }) => (
          <option
            key={code}
            value={code}
            lang={documentLanguage}
            dir={direction}
          >
            {nativeName}
          </option>
        ))}
      </select>
      <Lucide
        icon="ChevronDown"
        className={`pointer-events-none absolute end-3 hidden h-4 w-4 transition-transform duration-200 sm:block ${
          isOpen ? "rotate-180" : "rotate-0"
        }`}
      />
    </label>
  );
}
