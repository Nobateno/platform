import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { Menu, Slideover } from "@/shared/ui/components/Base/Headless";
import Lucide from "@/shared/ui/components/Base/Lucide";
import FileIcon from "@/shared/ui/components/Base/FileIcon";

interface ActivitiesPanelProps {
  activitiesPanel: boolean;
  setActivitiesPanel: (value: boolean) => void;
  canNavigateTo?: (target: string) => boolean;
}

const entries: Array<{
  id: string;
  titleKey: string;
  bodyKey: string;
  timeKey: string;
  path: string;
  status: "primary" | "success" | "info";
  statusNavKey: "reservations" | "availability" | "services";
}> = [
  {
    id: "NOB-2049",
    titleKey: "activities.reservationTitle",
    bodyKey: "activities.reservationBody",
    timeKey: "activities.now",
    path: "/transaction-detail/NOB-2049",
    status: "primary",
    statusNavKey: "reservations",
  },
  {
    id: "availability",
    titleKey: "activities.availabilityTitle",
    bodyKey: "activities.availabilityBody",
    timeKey: "activities.today",
    path: "/availability",
    status: "info",
    statusNavKey: "availability",
  },
  {
    id: "service",
    titleKey: "activities.serviceTitle",
    bodyKey: "activities.serviceBody",
    timeKey: "activities.yesterday",
    path: "/product-list",
    status: "success",
    statusNavKey: "services",
  },
];

const allowAllTargets = () => true;

export default function ActivitiesPanel({
  activitiesPanel,
  setActivitiesPanel,
  canNavigateTo = allowAllTargets,
}: ActivitiesPanelProps) {
  const { t } = useTranslation(["sharedUi", "shared"]);
  const [feedback, setFeedback] = useState("");

  const copyReference = async (reference: string) => {
    try {
      await navigator.clipboard.writeText(reference);
      setFeedback(t("activities.referenceCopied"));
    } catch {
      setFeedback(t("activities.copyFailed"));
    }
  };

  return (
    <div>
      <Slideover
        open={activitiesPanel}
        onClose={() => setActivitiesPanel(false)}
      >
        <Slideover.Panel className="w-72 rounded-[0.75rem_0_0_0.75rem/1.1rem_0_0_1.1rem] rtl:rounded-[0_0.75rem_0.75rem_0/0_1.1rem_1.1rem_0]">
          <button
            type="button"
            aria-label={t("activities.close")}
            title={t("activities.close")}
            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-white hover:bg-white/10 bg-white/5 transition-all hover:rotate-180 absolute inset-y-0 start-0 right-auto flex items-center justify-center my-auto -ms-[60px] sm:-ms-[105px] border rounded-full text-white/90 w-8 h-8 sm:w-14 sm:h-14 border-white/90 hover:scale-105"
            onClick={() => setActivitiesPanel(false)}
          >
            <Lucide
              className="w-8 h-8 stroke-[1]"
              icon="X"
              aria-hidden="true"
            />
          </button>
          <Slideover.Title className="px-6 py-5">
            <h2 className="me-auto text-base font-medium">
              {t("activities.title")}
            </h2>
          </Slideover.Title>
          <Slideover.Description className="p-0">
            <p className="sr-only" aria-live="polite">
              {feedback}
            </p>
            <div className="px-5 py-3 flex flex-col gap-3.5">
              <div className="relative overflow-hidden before:content-[''] before:absolute before:w-px before:bg-slate-200/60 before:start-0 before:inset-y-0 before:dark:bg-darkmode-400 before:ms-[14px]">
                {entries.filter((entry) => canNavigateTo(entry.path)).map((entry) => (
                  <div
                    className={clsx([
                      "mb-3 last:mb-0 relative",
                      "first:before:content-[''] first:before:h-1/2 first:before:w-5 first:before:bg-white first:before:absolute",
                      "last:after:content-[''] last:after:h-1/2 last:after:w-5 last:after:bg-white last:after:absolute last:after:bottom-0",
                    ])}
                    key={entry.id}
                  >
                    <div
                      className={clsx([
                        "px-4 py-3 ms-8",
                        "before:content-[''] before:ms-1 before:absolute before:w-5 before:h-5 before:bg-slate-200 before:rounded-full before:inset-y-0 before:my-auto before:start-0 before:dark:bg-darkmode-300 before:z-10",
                        "after:content-[''] after:absolute after:w-1.5 after:h-1.5 after:bg-slate-500 after:rounded-full after:inset-y-0 after:my-auto after:start-0 after:ms-[11px] after:dark:bg-darkmode-200 after:z-10",
                      ])}
                    >
                      <Link
                        to={entry.path}
                        onClick={() => setActivitiesPanel(false)}
                        className="font-medium text-primary"
                      >
                        {t(entry.titleKey)}
                      </Link>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-y-1.5 mt-1.5 leading-relaxed text-slate-500 text-[0.8rem]">
                        {t(entry.bodyKey)}
                        <span
                          className={clsx([
                            "group flex items-center text-xs font-medium rounded-md sm:ms-2 border px-1.5 py-px me-auto sm:me-0",
                            "[&.primary]:text-primary [&.primary]:bg-primary/10 [&.primary]:border-primary/10",
                            "[&.success]:text-success [&.success]:bg-success/10 [&.success]:border-success/10",
                            "[&.warning]:text-warning [&.warning]:bg-warning/10 [&.warning]:border-warning/10",
                            "[&.info]:text-info [&.info]:bg-info/10 [&.info]:border-info/10",
                            entry.status,
                          ])}
                        >
                          <span className="w-1.5 h-1.5 me-1.5 rounded-full group-[.success]:bg-success/80 group-[.primary]:bg-primary/80 group-[.warning]:bg-warning/80 group-[.info]:bg-info/80" />
                          <span className="-mt-px">
                            {t(`nav.${entry.statusNavKey}`, { ns: "shared" })}
                          </span>
                        </span>
                      </div>
                      {entry.id === "NOB-2049" && (
                        <div className="grid grid-cols-1 gap-4 my-3.5">
                          <div className="flex items-center ps-5 pe-2.5 py-4 border rounded-[0.6rem] border-slate-200/80 bg-slate-50/70">
                            <FileIcon
                              className="hidden w-10 sm:block"
                              variant="directory"
                            />
                            <div className="sm:ms-3.5 me-auto">
                              <div className="max-w-[8rem] font-medium truncate text-primary">
                                {entry.id}
                              </div>
                              <div className="mt-1 text-xs text-slate-500">
                                {t("activities.copyReference")}
                              </div>
                            </div>
                            <Menu>
                              <Menu.Button
                                as="button"
                                type="button"
                                className="w-5 h-5 text-slate-500"
                                aria-label={t("activities.copyReference")}
                              >
                                <Lucide
                                  icon="MoreVertical"
                                  className="w-4 h-4"
                                  aria-hidden="true"
                                />
                              </Menu.Button>
                              <Menu.Items className="w-40">
                                <Menu.Item
                                  onClick={() => void copyReference(entry.id)}
                                >
                                  <Lucide
                                    icon="Copy"
                                    className="w-4 h-4 me-2"
                                    aria-hidden="true"
                                  />
                                  {t("activities.copyReference")}
                                </Menu.Item>
                              </Menu.Items>
                            </Menu>
                          </div>
                        </div>
                      )}
                      <div className="mt-1.5 text-xs text-slate-500">
                        {t(entry.timeKey)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Slideover.Description>
        </Slideover.Panel>
      </Slideover>
    </div>
  );
}
