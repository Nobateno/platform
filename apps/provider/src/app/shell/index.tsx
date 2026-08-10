"use client";

import type { ReactNode } from "react";
import { Transition } from "@headlessui/react";
import { useTranslation } from "react-i18next";
import { selectDarkMode } from "@/app/state/darkModeSlice";
import { selectPageLoader } from "@/app/state/pageLoaderSlice";
import { useAppSelector } from "@/app/state/hooks";
import { ThemeProvider } from "@/shared/ui/theme-context";
import ProviderShell from "./Hook";

export default function AdminShell({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const pageLoader = useAppSelector(selectPageLoader);
  const darkMode = useAppSelector(selectDarkMode);

  return (
    <ThemeProvider darkMode={darkMode}>
      <div>
        <Transition
          show={!pageLoader}
          enter="transition-opacity duration-75"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div>
            <ProviderShell>{children}</ProviderShell>
          </div>
        </Transition>
        <Transition
          show={pageLoader}
          enter="transition-opacity duration-75"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <svg
            className="fixed inset-0 w-10 h-10 m-auto text-theme-1 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            role="status"
            aria-label={t("common.loading")}
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </Transition>
      </div>
    </ThemeProvider>
  );
}
