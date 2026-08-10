import type { icons } from "@/shared/ui/components/Base/Lucide";
import type { RootState } from "./store";

export interface Menu {
  icon: keyof typeof icons;
  title: string;
  pathname?: string;
  subMenu?: Menu[];
}

export const selectSideMenu = (state: RootState) => state.sideMenu.menu;
