"use client";

import "@/assets/css/vendors/simplebar.css";
import "@/assets/css/themes/hook.css";
import {
  Dialog as HeadlessDialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { useTranslation } from "react-i18next";
import {
  Link as RouterLink,
  useLocation,
  useNavigate,
} from "react-router-dom";
import clsx from "clsx";
import SimpleBar from "simplebar";
import {
  canAccessProviderTarget,
  getNavigationItemForPath,
  providerNavigation,
  providerNavigationSections,
} from "@/app/navigation";
import { selectCompactMenu } from "@/app/state/compactMenuSlice";
import { useAppSelector } from "@/app/state/hooks";
import { useUiStore } from "@/app/state/store";
import { canAccessArea } from "@/domains/auth/application/permissions";
import {
  useStore as useAuthStore,
  type PanelRole,
} from "@/domains/auth/store";
import type { Menu as MenuItem } from "@/app/state/sideMenuSlice";
import {
  enter,
  leave,
  nestedMenu,
  type FormattedMenu,
} from "../side-menu";
import Transition from "@/shared/ui/components/Base/Transition";
import Breadcrumb from "@/shared/ui/components/Base/Breadcrumb";
import Lucide from "@/shared/ui/components/Base/Lucide";
import { Menu } from "@/shared/ui/components/Base/Headless";
import QuickSearch from "@/shared/ui/components/QuickSearch";
import SwitchAccount from "@/shared/ui/components/SwitchAccount";
import NotificationsPanel from "@/shared/ui/components/NotificationsPanel";
import ActivitiesPanel from "@/shared/ui/components/ActivitiesPanel";

function providerMenuForRole(role?: PanelRole): Array<MenuItem | string> {
  if (!role) return [];

  return providerNavigationSections.flatMap((section) => {
    const items = providerNavigation
      .filter(
        (item) =>
          item.section === section.id && canAccessArea(role, item.area),
      )
      .map<MenuItem>((item) => ({
        icon: item.icon,
        pathname: item.path,
        title: item.labelKey,
      }));

    return items.length > 0 ? [section.labelKey, ...items] : [];
  });
}

interface SideMenuSurfaceProps {
  compactMenu: boolean;
  compactMenuOnHover: boolean;
  formattedMenu: Array<FormattedMenu | string>;
  mobile?: boolean;
  setCompactMenuOnHover: (value: boolean) => void;
  setFormattedMenu: Dispatch<SetStateAction<Array<FormattedMenu | string>>>;
  toggleCompactMenu: () => void;
  onNavigate?: () => void;
}

function SideMenuSurface({
  compactMenu,
  compactMenuOnHover,
  formattedMenu,
  mobile = false,
  setCompactMenuOnHover,
  setFormattedMenu,
  toggleCompactMenu,
  onNavigate,
}: SideMenuSurfaceProps) {
  const { t } = useTranslation();
  const scrollableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollableElement = scrollableRef.current;
    if (!scrollableElement) return;

    const simpleBar = new SimpleBar(scrollableElement);
    return () => simpleBar.unMount();
  }, []);

  const toggleSubMenu = (menu: FormattedMenu) => {
    menu.activeDropdown = !menu.activeDropdown;
    setFormattedMenu([...formattedMenu]);
  };

  return (
    <div
      data-mobile-navigation-surface={mobile ? "" : undefined}
      className={clsx([
        "z-20 relative w-[275px] border-slate-200/80 duration-300 transition-[width] flex flex-col",
        mobile
          ? "h-dvh max-w-[calc(100vw-4rem)] min-w-0 shrink"
          : "h-screen group-[.side-menu--collapsed]:xl:w-[91px] group-[.side-menu--collapsed.side-menu--on-hover]:xl:shadow-[6px_0_12px_-4px_#0000000f] group-[.side-menu--collapsed.side-menu--on-hover]:xl:w-[275px]",
        "before:content-[''] before:absolute before:inset-0 before:xl:rounded-[0_0.75rem_0.75rem_0/0_1.1rem_1.1rem_0] rtl:rounded-[0.75rem_0_0_0.75rem/1.1rem_0_0_1.1rem] before:bg-gradient-to-b before:from-theme-1 before:to-theme-2 before:border-slate-200/80 before:group-[.side-menu--collapsed.side-menu--on-hover]:xl:shadow-[6px_0_12px_-4px_#0000000f]",
        "after:content-[''] after:absolute after:inset-0 after:xl:-me-4 after:bg-texture-white after:bg-contain after:bg-fixed after:bg-[center_-20rem] after:bg-no-repeat",
        { "side-menu--on-hover": compactMenuOnHover },
      ])}
      onMouseEnter={() => setCompactMenuOnHover(true)}
      onMouseLeave={() => setCompactMenuOnHover(false)}
    >
      <div className="flex-none hidden xl:flex items-center z-10 px-5 h-[65px] w-[275px] overflow-hidden relative duration-300 group-[.side-menu--collapsed]:xl:w-[91px] group-[.side-menu--collapsed.side-menu--on-hover]:xl:w-[275px]">
        <RouterLink
          to="/"
          className="flex items-center transition-[margin] duration-300 group-[.side-menu--collapsed]:xl:ms-4 group-[.side-menu--collapsed.side-menu--on-hover]:xl:ms-0"
        >
          <div className="transition-transform ease-in-out group-[.side-menu--collapsed.side-menu--on-hover]:xl:-rotate-180">
            <div className="w-[18px] h-[18px] relative -rotate-45 [&_div]:bg-white">
              <div className="absolute w-[21%] start-0 inset-y-0 my-auto rounded-full opacity-50 h-[75%]"></div>
              <div className="absolute w-[21%] inset-0 m-auto h-[120%] rounded-full"></div>
              <div className="absolute w-[21%] end-0 inset-y-0 my-auto rounded-full opacity-50 h-[75%]"></div>
            </div>
          </div>
          <div className="ms-3.5 group-[.side-menu--collapsed.side-menu--on-hover]:xl:opacity-100 group-[.side-menu--collapsed]:xl:opacity-0 transition-opacity font-medium text-white">
            {t("shell.brand")}
          </div>
        </RouterLink>
        <button
          type="button"
          onClick={toggleCompactMenu}
          aria-label={t("shell.openMenu")}
          aria-pressed={!compactMenu}
          className="group-[.side-menu--collapsed.side-menu--on-hover]:xl:opacity-100 group-[.side-menu--collapsed]:xl:rotate-180 group-[.side-menu--collapsed]:xl:opacity-0 transition-[opacity,transform] hidden 3xl:flex items-center justify-center w-[20px] h-[20px] ms-auto border rounded-full border-white/40 text-white hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
        >
          <Lucide icon="ArrowLeft" className="w-3.5 h-3.5 stroke-[1.3]" />
        </button>
      </div>
      <div
        ref={scrollableRef}
        className={clsx([
          "w-full h-full z-20 px-5 overflow-y-auto overflow-x-hidden pb-3 [-webkit-mask-image:-webkit-linear-gradient(top,rgba(0,0,0,0),black_30px)] [&:-webkit-scrollbar]:w-0 [&:-webkit-scrollbar]:bg-transparent",
          "[&_.simplebar-content]:p-0 [&_.simplebar-track.simplebar-vertical]:w-[10px] [&_.simplebar-track.simplebar-vertical]:me-0.5 [&_.simplebar-track.simplebar-vertical_.simplebar-scrollbar]:before:bg-slate-400/30",
        ])}
      >
        <nav aria-label={t("shell.mainNavigation")}>
          <ul className="scrollable">
            {formattedMenu.map((menu, menuKey) =>
              typeof menu === "string" ? (
                <li className="side-menu__divider" key={`${menu}-${menuKey}`}>
                  {menu}
                </li>
              ) : (
                <li key={`${menu.pathname ?? menu.title}-${menuKey}`}>
                  {menu.subMenu ? (
                    <button
                      type="button"
                      className={clsx([
                        "side-menu__link w-full text-start",
                        { "side-menu__link--active": menu.active },
                        {
                          "side-menu__link--active-dropdown":
                            menu.activeDropdown,
                        },
                      ])}
                      onClick={() => toggleSubMenu(menu)}
                    >
                      <Lucide icon={menu.icon} className="side-menu__link__icon" />
                      <span className="side-menu__link__title">{menu.title}</span>
                      {menu.badge && (
                        <span className="side-menu__link__badge">{menu.badge}</span>
                      )}
                      <Lucide icon="ChevronDown" className="side-menu__link__chevron" />
                    </button>
                  ) : (
                    <RouterLink
                      to={menu.pathname ?? "/"}
                      aria-current={menu.active ? "page" : undefined}
                      className={clsx([
                        "side-menu__link",
                        { "side-menu__link--active": menu.active },
                      ])}
                      onClick={onNavigate}
                    >
                      <Lucide icon={menu.icon} className="side-menu__link__icon" />
                      <span className="side-menu__link__title">{menu.title}</span>
                      {menu.badge && (
                        <span className="side-menu__link__badge">{menu.badge}</span>
                      )}
                    </RouterLink>
                  )}
                  {menu.subMenu && (
                    <Transition
                      in={menu.activeDropdown}
                      onEnter={enter}
                      onExit={leave}
                      timeout={300}
                    >
                      <ul
                        className={clsx({
                          block: menu.activeDropdown,
                          hidden: !menu.activeDropdown,
                        })}
                      >
                        {menu.subMenu.map((subMenu, subMenuKey) => (
                          <li key={`${subMenu.pathname ?? subMenu.title}-${subMenuKey}`}>
                            <RouterLink
                              to={subMenu.pathname ?? "/"}
                              aria-current={subMenu.active ? "page" : undefined}
                              className={clsx([
                                "side-menu__link",
                                { "side-menu__link--active": subMenu.active },
                              ])}
                              onClick={onNavigate}
                            >
                              <Lucide icon={subMenu.icon} className="side-menu__link__icon" />
                              <span className="side-menu__link__title">{subMenu.title}</span>
                            </RouterLink>
                          </li>
                        ))}
                      </ul>
                    </Transition>
                  )}
                </li>
              ),
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default function ProviderShell({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const compactMenu = useAppSelector(selectCompactMenu);
  const setCompactMenuStore = useUiStore((state) => state.setCompactMenu);
  const currentUser = useAuthStore((state) => state.currentUser);
  const logout = useAuthStore((state) => state.logout);
  const location = useLocation();
  const navigate = useNavigate();
  const [quickSearch, setQuickSearch] = useState(false);
  const [switchAccount, setSwitchAccount] = useState(false);
  const [notificationsPanel, setNotificationsPanel] = useState(false);
  const [activitiesPanel, setActivitiesPanel] = useState(false);
  const [compactMenuOnHover, setCompactMenuOnHover] = useState(false);
  const [activeMobileMenu, setActiveMobileMenu] = useState(false);
  const [formattedMenu, setFormattedMenu] = useState<Array<FormattedMenu | string>>([]);
  const activeItem = getNavigationItemForPath(location.pathname);
  const canManageSettings = currentUser
    ? canAccessArea(currentUser.roleId, "businessSettings")
    : false;
  const canNavigateTo = useCallback(
    (target: string) =>
      canAccessProviderTarget(currentUser?.roleId, target),
    [currentUser?.roleId],
  );

  const setCompactMenu = useCallback(
    (value: boolean) => setCompactMenuStore(value),
    [setCompactMenuStore],
  );

  const localizedSideMenu = useMemo(() => {
    const translateItems = (
      items: Array<MenuItem | string>,
    ): Array<MenuItem | string> =>
      items.map((item) =>
        typeof item === "string"
          ? t(item)
          : {
              ...item,
              title: t(item.title),
              subMenu: item.subMenu
                ? (translateItems(item.subMenu) as MenuItem[])
                : undefined,
            },
      );

    return translateItems(providerMenuForRole(currentUser?.roleId));
  }, [currentUser?.roleId, t]);

  const toggleCompactMenu = useCallback(() => {
    setCompactMenu(!useUiStore.getState().compactMenu.value);
  }, [setCompactMenu]);

  const compactLayout = useCallback(() => {
    if (window.innerWidth <= 1600) setCompactMenu(true);
  }, [setCompactMenu]);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      void document.exitFullscreen?.();
      return;
    }
    void document.documentElement.requestFullscreen?.();
  };

  const handleLogout = () => {
    void logout().finally(() => navigate("/login", { replace: true }));
  };

  useEffect(() => {
    setFormattedMenu(
      nestedMenu(localizedSideMenu, {
        pathname: location.pathname,
        search: location.search,
        forceActiveMenu: activeItem?.path,
      }),
    );
  }, [activeItem?.path, localizedSideMenu, location.pathname, location.search]);

  useEffect(() => {
    compactLayout();
    window.addEventListener("resize", compactLayout);
    return () => window.removeEventListener("resize", compactLayout);
  }, [compactLayout]);

  return (
    <div
      className={clsx([
        "hook",
        "before:content-[''] before:z-[-1] before:w-screen before:bg-gradient-to-b before:from-theme-1 before:to-theme-2 before:top-0 before:h-screen before:fixed before:bg-fixed",
      ])}
    >
      <a
        href="#main-content"
        className="fixed start-4 top-3 z-[100] -translate-y-24 rounded-md bg-theme-1 px-5 py-3 font-medium text-white shadow-lg transition-transform focus:translate-y-0"
      >
        {t("shell.skipToContent")}
      </a>

      <div
        className={clsx([
          "side-menu group relative z-50",
          { "side-menu--collapsed": compactMenu },
          { "side-menu--on-hover": compactMenuOnHover },
        ])}
      >
        <div className="hidden xl:block xl:ms-0 shadow-xl xl:shadow-none fixed top-0 start-0 z-50">
          <SideMenuSurface
            compactMenu={compactMenu}
            compactMenuOnHover={compactMenuOnHover}
            formattedMenu={formattedMenu}
            setCompactMenuOnHover={setCompactMenuOnHover}
            setFormattedMenu={setFormattedMenu}
            toggleCompactMenu={toggleCompactMenu}
          />
        </div>

        <HeadlessDialog
          open={activeMobileMenu}
          onClose={setActiveMobileMenu}
          className="hook side-menu group relative z-[60] xl:hidden"
        >
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-black/80 transition-opacity duration-300 data-[closed]:opacity-0"
          />
          <DialogPanel
            transition
            data-mobile-navigation-panel=""
            className="fixed inset-y-0 start-0 z-[61] flex w-fit max-w-full flex-row-reverse outline-none transition-transform duration-300 ease-in-out motion-reduce:duration-0 data-[closed]:-translate-x-full rtl:data-[closed]:translate-x-full"
          >
            <DialogTitle className="sr-only">{t("shell.mainNavigation")}</DialogTitle>
            <div className="z-[62] flex w-16 shrink-0 items-start justify-center pt-4">
              <button
                type="button"
                onClick={() => setActiveMobileMenu(false)}
                aria-label={t("shell.closeMenu")}
                className="flex h-11 w-11 items-center justify-center rounded-full text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <Lucide icon="X" className="w-8 h-8 text-white" />
              </button>
            </div>
            <SideMenuSurface
              compactMenu={compactMenu}
              compactMenuOnHover={false}
              formattedMenu={formattedMenu}
              mobile
              setCompactMenuOnHover={() => undefined}
              setFormattedMenu={setFormattedMenu}
              toggleCompactMenu={toggleCompactMenu}
              onNavigate={() => setActiveMobileMenu(false)}
            />
          </DialogPanel>
        </HeadlessDialog>

        <div
          className={clsx([
            "fixed h-[65px] transition-[margin] duration-100 xl:ms-[275px] group-[.side-menu--collapsed]:xl:ms-[90px] mt-3.5 inset-x-0 top-0",
            "before:content-[''] before:mx-5 before:absolute before:top-0 before:inset-x-0 before:-mt-[15px] before:h-[20px] before:backdrop-blur",
          ])}
        >
          <div className="absolute inset-x-0 h-full mx-5 box rounded-xl before:content-[''] before:z-[-1] before:inset-x-4 before:shadow-sm before:h-full before:bg-slate-50 before:border before:border-slate-200 before:absolute before:rounded-lg before:mx-auto before:top-0 before:mt-3 before:dark:bg-darkmode-600/70 before:dark:border-darkmode-500/60">
            <div className="flex items-center w-full h-full px-5">
              <div className="flex items-center gap-1 xl:hidden">
                <button
                  type="button"
                  aria-label={t("shell.openMenu")}
                  aria-expanded={activeMobileMenu}
                  onClick={() => setActiveMobileMenu(true)}
                  className="p-2 rounded-full hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme-1"
                >
                  <Lucide icon="AlignJustify" className="w-[18px] h-[18px]" />
                </button>
                <button
                  type="button"
                  aria-label={t("common.search")}
                  onClick={() => setQuickSearch(true)}
                  className="p-2 rounded-full hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme-1"
                >
                  <Lucide icon="Search" className="w-[18px] h-[18px]" />
                </button>
              </div>

              <Breadcrumb className="flex-1 hidden xl:block">
                <Breadcrumb.Link to="/">{t("shell.app")}</Breadcrumb.Link>
                <Breadcrumb.Link to="/">{t("shell.analytics")}</Breadcrumb.Link>
                <Breadcrumb.Link active>
                  {activeItem ? t(activeItem.labelKey) : t("shell.dashboards")}
                </Breadcrumb.Link>
              </Breadcrumb>

              <button
                type="button"
                className="relative justify-center flex-1 hidden xl:flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme-1 rounded-lg"
                onClick={() => setQuickSearch(true)}
                aria-label={t("shell.quickSearch")}
              >
                <span className="bg-slate-50 border w-[300px] flex items-center py-2 px-3.5 rounded-[0.5rem] text-slate-400 cursor-pointer hover:bg-slate-100 transition-colors dark:bg-darkmode-700 dark:border-darkmode-500 dark:hover:bg-darkmode-600">
                  <Lucide icon="Search" className="w-[18px] h-[18px]" />
                  <span className="ms-2.5 me-auto">{t("shell.quickSearch")}</span>
                  <span aria-hidden="true">⌘K</span>
                </span>
              </button>
              <QuickSearch
                quickSearch={quickSearch}
                setQuickSearch={setQuickSearch}
                canNavigateTo={canNavigateTo}
              />

              <div className="flex items-center flex-1">
                <div className="flex items-center gap-1 ms-auto">
                  <button
                    type="button"
                    aria-label={t("shell.activities")}
                    title={t("shell.activities")}
                    className="p-2 rounded-full hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme-1"
                    onClick={() => setActivitiesPanel(true)}
                  >
                    <Lucide icon="LayoutGrid" className="w-[18px] h-[18px]" />
                  </button>
                  <button
                    type="button"
                    aria-label={t("shell.fullscreen")}
                    title={t("shell.fullscreen")}
                    className="p-2 rounded-full hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme-1"
                    onClick={toggleFullscreen}
                  >
                    <Lucide icon="Expand" className="w-[18px] h-[18px]" />
                  </button>
                  <button
                    type="button"
                    aria-label={t("shell.notifications")}
                    title={t("shell.notifications")}
                    className="p-2 rounded-full hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme-1"
                    onClick={() => setNotificationsPanel(true)}
                  >
                    <Lucide icon="Bell" className="w-[18px] h-[18px]" />
                  </button>
                </div>
                <Menu className="ms-2">
                  <Menu.Button
                    as="button"
                    type="button"
                    aria-label={t("shell.accountMenu")}
                    className="overflow-hidden rounded-full w-[36px] h-[36px] border-[3px] border-slate-200/70 flex items-center justify-center bg-slate-100 text-theme-1 font-medium dark:bg-darkmode-600 dark:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme-1"
                  >
                    {currentUser?.fullName.trim().charAt(0) || "N"}
                  </Menu.Button>
                  <Menu.Items className="w-56 mt-1">
                    <Menu.Item
                      as="button"
                      className="w-full"
                      onClick={() => setSwitchAccount(true)}
                    >
                      <Lucide icon="ToggleLeft" className="w-4 h-4 me-2" />
                      {t("shell.switchAccount")}
                    </Menu.Item>
                    {canManageSettings && (
                      <>
                        <Menu.Divider />
                        <Menu.Item
                          as="button"
                          className="w-full"
                          onClick={() => navigate("/settings?page=security")}
                        >
                          <Lucide icon="Lock" className="w-4 h-4 me-2" />
                          {t("shell.resetPassword")}
                        </Menu.Item>
                        <Menu.Divider />
                        <Menu.Item
                          as="button"
                          className="w-full"
                          onClick={() => navigate("/settings")}
                        >
                          <Lucide icon="Users" className="w-4 h-4 me-2" />
                          {t("shell.profile")}
                        </Menu.Item>
                      </>
                    )}
                    <Menu.Item
                      as="button"
                      className="w-full"
                      onClick={handleLogout}
                    >
                      <Lucide icon="Power" className="w-4 h-4 me-2" />
                      {t("shell.logout")}
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              </div>
              <ActivitiesPanel
                activitiesPanel={activitiesPanel}
                setActivitiesPanel={setActivitiesPanel}
                canNavigateTo={canNavigateTo}
              />
              <NotificationsPanel
                notificationsPanel={notificationsPanel}
                setNotificationsPanel={setNotificationsPanel}
                canNavigateTo={canNavigateTo}
              />
              <SwitchAccount
                switchAccount={switchAccount}
                setSwitchAccount={setSwitchAccount}
              />
            </div>
          </div>
        </div>
      </div>

      <div
        className={clsx([
          "relative transition-[margin,width] duration-100 px-5 pt-[66px] pb-16",
          "before:content-[''] before:bg-gradient-to-b before:from-theme-1 before:to-theme-2 before:h-screen before:w-full before:fixed before:top-0 before:-ms-5",
          "after:content-[''] after:bg-gradient-to-b after:from-slate-100 after:to-slate-50 after:h-screen after:w-full after:fixed after:top-0 after:-ms-5 after:xl:rounded-[1.2rem/1.7rem] after:dark:from-darkmode-700 after:dark:to-darkmode-900",
          { "xl:ms-[275px]": !compactMenu },
          { "xl:ms-[91px]": compactMenu },
        ])}
      >
        <main
          id="main-content"
          tabIndex={-1}
          className="container mt-[55px] z-10 relative outline-none"
        >
          <Breadcrumb className="mb-5 max-w-full overflow-x-auto xl:hidden">
            <Breadcrumb.Link to="/">{t("shell.app")}</Breadcrumb.Link>
            <Breadcrumb.Link to="/">{t("shell.analytics")}</Breadcrumb.Link>
            <Breadcrumb.Link active>
              {activeItem ? t(activeItem.labelKey) : t("shell.dashboards")}
            </Breadcrumb.Link>
          </Breadcrumb>
          {children}
        </main>
      </div>
    </div>
  );
}
