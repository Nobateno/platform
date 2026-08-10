import { Menu } from "@/shared/ui/components/Base/Headless";
import Lucide, { type icons } from "@/shared/ui/components/Base/Lucide";
import { FormInput } from "@/shared/ui/components/Base/Form";
import { Dialog as HeadlessDialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

interface QuickSearchProps {
  quickSearch: boolean;
  setQuickSearch: (value: boolean) => void;
  canNavigateTo?: (target: string) => boolean;
}

type SearchTarget = {
  id: string;
  group: "reservations" | "customers" | "services";
  titleKey: string;
  descriptionKey: string;
  path: string;
  icon: keyof typeof icons;
};

const targets: SearchTarget[] = [
  {
    id: "reservation",
    group: "reservations",
    titleKey: "quickSearch.reservationResult",
    descriptionKey: "quickSearch.reservationDescription",
    path: "/transaction-detail/NOB-2049",
    icon: "CalendarCheck2",
  },
  {
    id: "customer",
    group: "customers",
    titleKey: "quickSearch.customerResult",
    descriptionKey: "quickSearch.customerDescription",
    path: "/users/customer-1024",
    icon: "Users",
  },
  {
    id: "service",
    group: "services",
    titleKey: "quickSearch.serviceResult",
    descriptionKey: "quickSearch.serviceDescription",
    path: "/product-list",
    icon: "BookMarked",
  },
];

const quickLinks: Array<{
  label: string;
  path: string;
  icon: keyof typeof icons;
}> = [
  { label: "customers", path: "/users", icon: "UsersRound" },
  { label: "reservations", path: "/transaction-list", icon: "CalendarCheck2" },
  { label: "services", path: "/product-list", icon: "BookMarked" },
  { label: "communications", path: "/communications", icon: "MailCheck" },
];

const moreLinks: Array<{
  label: string;
  path: string;
  icon: keyof typeof icons;
}> = [
  { label: "availability", path: "/availability", icon: "Clock" },
  { label: "team", path: "/team", icon: "UsersRound" },
  { label: "reports", path: "/reports", icon: "FileCheck" },
];

const groupPaths: Record<SearchTarget["group"], string> = {
  reservations: "/transaction-list",
  customers: "/users",
  services: "/product-list",
};

const allowAllTargets = () => true;

export default function QuickSearch({
  quickSearch,
  setQuickSearch,
  canNavigateTo = allowAllTargets,
}: QuickSearchProps) {
  const { t, i18n } = useTranslation(["sharedUi", "shared"]);
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setQuickSearch(true);
      }
    };

    document.addEventListener("keydown", handleShortcut);
    return () => document.removeEventListener("keydown", handleShortcut);
  }, [setQuickSearch]);

  useEffect(() => {
    if (!quickSearch) setQuery("");
  }, [quickSearch]);

  const allowedTargets = useMemo(
    () => targets.filter((target) => canNavigateTo(target.path)),
    [canNavigateTo],
  );
  const allowedQuickLinks = useMemo(
    () => quickLinks.filter((item) => canNavigateTo(item.path)),
    [canNavigateTo],
  );
  const allowedMoreLinks = useMemo(
    () => moreLinks.filter((item) => canNavigateTo(item.path)),
    [canNavigateTo],
  );

  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase(i18n.language);
    if (!normalizedQuery) return allowedTargets;

    return allowedTargets.filter((target) =>
      `${t(target.titleKey)} ${t(target.descriptionKey)}`
        .toLocaleLowerCase(i18n.language)
        .includes(normalizedQuery),
    );
  }, [allowedTargets, i18n.language, query, t]);

  const closeAfterNavigation = () => setQuickSearch(false);
  const sectionLabels = {
    reservations: t("nav.reservations", { ns: "shared" }),
    customers: t("nav.customers", { ns: "shared" }),
    services: t("nav.services", { ns: "shared" }),
  };

  return (
    <Transition appear show={quickSearch} as={Fragment}>
      <HeadlessDialog
        as="div"
        className="relative z-[60]"
        onClose={setQuickSearch}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-50"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gradient-to-b from-theme-1/50 via-theme-2/50 to-black/50 backdrop-blur-sm" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex justify-center my-2 sm:mt-40">
            <Transition.Child
              as={Fragment}
              enter="ease-in-out duration-50"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in-out duration-100"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <HeadlessDialog.Panel className="sm:w-[600px] lg:w-[700px] w-[95%] relative mx-auto transition-transform">
                <HeadlessDialog.Title className="sr-only">
                  {t("quickSearch.dialogTitle")}
                </HeadlessDialog.Title>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center justify-center w-12">
                    <Lucide
                      icon="Search"
                      className="w-5 h-5 -me-1.5 text-slate-500 stroke-[1]"
                      aria-hidden="true"
                    />
                  </div>
                  <label htmlFor="provider-quick-search" className="sr-only">
                    {t("quickSearch.placeholder")}
                  </label>
                  <FormInput
                    id="provider-quick-search"
                    autoFocus
                    className="ps-12 pe-14 py-3.5 text-base rounded-lg focus:ring-0 border-0 shadow-lg"
                    type="text"
                    role="searchbox"
                    placeholder={t("quickSearch.placeholder")}
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                  />
                  <div className="absolute inset-y-0 end-0 flex items-center w-14">
                    <div className="px-2 py-1 me-auto text-xs border rounded-[0.4rem] bg-slate-100 text-slate-500/80">
                      ESC
                    </div>
                  </div>
                </div>
                <div className="relative z-10 pb-1 mt-1 bg-white rounded-lg shadow-lg max-h-[468px] sm:max-h-[615px] overflow-y-auto">
                  {query.trim() && results.length === 0 ? (
                    <div className="flex flex-col items-center justify-center pt-20 pb-28">
                      <Lucide
                        icon="SearchX"
                        className="w-20 h-20 text-theme-1/20 fill-theme-1/5 stroke-[0.5]"
                        aria-hidden="true"
                      />
                      <div className="mt-5 text-xl font-medium">
                        {t("quickSearch.noResults")}
                      </div>
                      <div className="w-2/3 mt-3 leading-relaxed text-center text-slate-500">
                        {t("quickSearch.noResultsDescription", { query })}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="px-5 py-4">
                        <div className="flex items-center">
                          <div className="text-xs uppercase text-slate-500">
                            {t("quickSearch.start")}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3.5">
                          {allowedQuickLinks.map((item) => (
                            <Link
                              key={item.label}
                              to={item.path}
                              onClick={closeAfterNavigation}
                              className="flex items-center gap-x-1.5 border rounded-full px-3 py-0.5 border-slate-300/70 hover:bg-slate-50"
                            >
                              <Lucide
                                icon={item.icon}
                                className="w-4 h-4 stroke-[1.3]"
                                aria-hidden="true"
                              />
                              {t(`nav.${item.label}`, { ns: "shared" })}
                            </Link>
                          ))}
                          {allowedMoreLinks.length > 0 && (
                            <Menu>
                              <Menu.Button
                                as="button"
                                type="button"
                                className="flex items-center gap-x-1.5 border rounded-full px-3 py-0.5 border-slate-300/70 hover:bg-slate-50"
                              >
                                {t("quickSearch.openResult")}
                                <Lucide
                                  icon="ChevronDown"
                                  className="w-4 h-4 stroke-[1.3] -ms-0.5"
                                  aria-hidden="true"
                                />
                              </Menu.Button>
                              <Menu.Items className="w-40">
                                {allowedMoreLinks.map((item) => (
                                  <Menu.Item
                                    key={item.label}
                                    onClick={() => {
                                      navigate(item.path);
                                      closeAfterNavigation();
                                    }}
                                  >
                                    <Lucide
                                      icon={item.icon}
                                      className="w-4 h-4 me-2"
                                      aria-hidden="true"
                                    />
                                    {t(`nav.${item.label}`, { ns: "shared" })}
                                  </Menu.Item>
                                ))}
                              </Menu.Items>
                            </Menu>
                          )}
                        </div>
                      </div>

                      {(["reservations", "customers", "services"] as const).map(
                        (group) => {
                          const groupResults = results.filter(
                            (target) => target.group === group,
                          );
                          const groupPath = groupPaths[group];
                          if (
                            groupResults.length === 0 ||
                            !canNavigateTo(groupPath)
                          ) {
                            return null;
                          }

                          return (
                            <section
                              key={group}
                              className="px-5 py-4 border-t border-dashed"
                            >
                              <div className="flex items-center">
                                <h3 className="text-xs uppercase text-slate-500">
                                  {sectionLabels[group]}
                                </h3>
                                <Link
                                  className="ms-auto text-xs text-slate-500"
                                  to={groupPath}
                                  onClick={closeAfterNavigation}
                                >
                                  {t("quickSearch.openResult")}
                                </Link>
                              </div>
                              <div className="flex flex-col gap-1 mt-3.5">
                                {groupResults.map((target) => (
                                  <Link
                                    to={target.path}
                                    key={target.id}
                                    onClick={closeAfterNavigation}
                                    className="flex items-center gap-2.5 hover:bg-slate-50/80 border border-transparent hover:border-slate-100 p-1 rounded-md"
                                  >
                                    <span className="flex items-center justify-center w-6 h-6 overflow-hidden border-2 rounded-full image-fit zoom-in border-slate-200/70 box">
                                      <Lucide
                                        icon={target.icon}
                                        className="w-3.5 h-3.5 stroke-[1.3] text-theme-1"
                                        aria-hidden="true"
                                      />
                                    </span>
                                    <span className="font-medium truncate">
                                      {t(target.titleKey)}
                                    </span>
                                    <span className="hidden text-slate-500 sm:block">
                                      {t(target.descriptionKey)}
                                    </span>
                                  </Link>
                                ))}
                              </div>
                            </section>
                          );
                        },
                      )}
                    </div>
                  )}
                </div>
              </HeadlessDialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </HeadlessDialog>
    </Transition>
  );
}
