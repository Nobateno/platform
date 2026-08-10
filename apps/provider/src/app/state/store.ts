import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Menu } from "./sideMenuSlice";
import {
  providerNavigation,
  providerNavigationSections,
} from "@/app/navigation";

export const DEFAULT_DARK_MODE = false;
export const DEFAULT_COMPACT_MENU = true;

// This remains the compatibility source for consumers of `selectSideMenu`.
// Role filtering is applied by the shell before rendering.
const menu: Array<Menu | string> = providerNavigationSections.flatMap(
  (section) => [
    section.labelKey,
    ...providerNavigation
      .filter((item) => item.section === section.id)
      .map((item) => ({
        icon: item.icon,
        pathname: item.path,
        title: item.labelKey,
      })),
  ],
);

export interface UiStore {
  darkMode: { value: boolean };
  compactMenu: { value: boolean };
  pageLoader: { value: boolean };
  sideMenu: { menu: Array<Menu | string> };
  setDarkMode: (value: boolean) => void;
  setCompactMenu: (value: boolean) => void;
  setPageLoader: (value: boolean) => void;
}

export const useUiStore = create<UiStore>()(
  persist(
    (set) => ({
      darkMode: { value: DEFAULT_DARK_MODE },
      compactMenu: { value: DEFAULT_COMPACT_MENU },
      pageLoader: { value: false },
      sideMenu: { menu },
      setDarkMode: (value) => {
        document.documentElement.classList.toggle("dark", value);
        set({ darkMode: { value } });
      },
      setCompactMenu: (value) => set({ compactMenu: { value } }),
      setPageLoader: (value) => set({ pageLoader: { value } }),
    }),
    {
      name: "nobateno-ui",
      partialize: ({ darkMode, compactMenu }) => ({ darkMode, compactMenu }),
      onRehydrateStorage: () => (state) => {
        document.documentElement.classList.toggle(
          "dark",
          state?.darkMode.value ?? DEFAULT_DARK_MODE,
        );
      },
    },
  ),
);

export type RootState = UiStore;
