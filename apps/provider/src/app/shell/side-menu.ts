import type {
  NavigateFunction,
  NavigationLocation,
} from "@/shared/lib/navigation";
import type { Menu } from "@/app/state/sideMenuSlice";
import { slideUp, slideDown } from "@/shared/lib/utils/helper";

interface MenuSource extends Menu {
  badge?: string;
  ignore?: boolean;
  subMenu?: MenuSource[];
}

export interface FormattedMenu extends MenuSource {
  active?: boolean;
  activeDropdown?: boolean;
  subMenu?: FormattedMenu[];
}

const findActiveMenu = (
  subMenu: MenuSource[],
  location: NavigationLocation
): boolean => {
  let match = false;
  subMenu.forEach((item) => {
    if (
      ((location.forceActiveMenu !== undefined &&
        item.pathname === location.forceActiveMenu) ||
        (location.forceActiveMenu === undefined &&
          item.pathname === location.pathname + location.search)) &&
      !item.ignore
    ) {
      match = true;
    } else if (!match && item.subMenu) {
      match = findActiveMenu(item.subMenu, location);
    }
  });
  return match;
};

const nestedMenu = (
  menu: Array<Menu | string>,
  location: NavigationLocation
) => {
  const formattedMenu: Array<FormattedMenu | string> = [];
  menu.forEach((item) => {
    if (typeof item !== "string") {
      const sourceItem = item as MenuSource;
      const menuItem: FormattedMenu = {
        icon: sourceItem.icon,
        title: sourceItem.title,
        badge: sourceItem.badge,
        pathname: sourceItem.pathname,
        subMenu: sourceItem.subMenu,
        ignore: sourceItem.ignore,
      };
      menuItem.active =
        ((location.forceActiveMenu !== undefined &&
          menuItem.pathname === location.forceActiveMenu) ||
          (location.forceActiveMenu === undefined &&
            menuItem.pathname === location.pathname + location.search) ||
          (menuItem.subMenu && findActiveMenu(menuItem.subMenu, location))) &&
        !menuItem.ignore;

      if (menuItem.subMenu) {
        menuItem.activeDropdown = findActiveMenu(menuItem.subMenu, location);

        const subMenu: Array<FormattedMenu> = [];
        nestedMenu(menuItem.subMenu, location).forEach(
          (menu) => typeof menu !== "string" && subMenu.push(menu)
        );
        menuItem.subMenu = subMenu;
      }

      formattedMenu.push(menuItem);
    } else {
      formattedMenu.push(item);
    }
  });

  return formattedMenu;
};

const linkTo = (menu: FormattedMenu, navigate: NavigateFunction) => {
  if (menu.subMenu) {
    menu.activeDropdown = !menu.activeDropdown;
  } else if (menu.pathname !== undefined) {
    navigate(menu.pathname);
  }
};

const enter = (el: HTMLElement) => {
  slideDown(el, 300);
};

const leave = (el: HTMLElement) => {
  slideUp(el, 300);
};

export { nestedMenu, linkTo, enter, leave };
