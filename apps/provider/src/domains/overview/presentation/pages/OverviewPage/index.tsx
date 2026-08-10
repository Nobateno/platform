import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { overviewNamespace } from "@/domains/overview/i18n";
import ReportDonutChart from "@/domains/overview/presentation/components/ReportDonutChart";
import ReportLineChart from "@/domains/overview/presentation/components/ReportLineChart";
import Button from "@/shared/ui/components/Base/Button";
import { FormSelect } from "@/shared/ui/components/Base/Form";
import Lucide, { type icons } from "@/shared/ui/components/Base/Lucide";
import Table from "@/shared/ui/components/Base/Table";
import { getColor } from "@/shared/lib/utils/colors";

type IconName = keyof typeof icons;

type ReservationStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "cancelled"
  | "completed"
  | "noShow";

type OverviewReservation = {
  id: string;
  date: string;
  time: string;
  durationMinutes: number;
  service: "consultation" | "followUp" | "wellness" | "assessment";
  staff: "owner" | "specialist" | "team";
  customerKind: "new" | "returning" | "manual";
  customerLabel?: string;
  source: "online" | "manual" | "voice";
  status: ReservationStatus;
};

type OverviewPageProps = {
  reservations?: readonly OverviewReservation[];
};

const quickActions: Array<{
  title: string;
  body: string;
  to: string;
  icon: IconName;
}> = [
  {
    title: "quick.manualTitle",
    body: "quick.manualBody",
    to: "/transaction-list?create=1",
    icon: "Plus",
  },
  {
    title: "quick.reservationsTitle",
    body: "quick.reservationsBody",
    to: "/transaction-list",
    icon: "CalendarCheck2",
  },
  {
    title: "quick.servicesTitle",
    body: "quick.servicesBody",
    to: "/product-list",
    icon: "Clipboard",
  },
  {
    title: "quick.availabilityTitle",
    body: "quick.availabilityBody",
    to: "/availability",
    icon: "Clock",
  },
];

const statusStyles: Record<
  ReservationStatus,
  { text: string; icon: IconName }
> = {
  pending: { text: "text-warning", icon: "Hourglass" },
  approved: { text: "text-success", icon: "Check" },
  completed: { text: "text-primary", icon: "CheckSquare" },
  cancelled: { text: "text-slate-500", icon: "X" },
  rejected: { text: "text-danger", icon: "AlertCircle" },
  noShow: { text: "text-danger", icon: "User" },
};

const localIsoDate = (offset = 0) => {
  const value = new Date();
  value.setHours(12, 0, 0, 0);
  value.setDate(value.getDate() + offset);
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

function OverviewPage({ reservations = [] }: OverviewPageProps) {
  const { t, i18n } = useTranslation(overviewNamespace);
  const [scheduleWindow, setScheduleWindow] = useState<"today" | "upcoming">(
    "today",
  );
  const showDemonstrationMetrics =
    import.meta.env.DEV || import.meta.env.MODE === "test";
  const today = localIsoDate();
  const nextWeek = localIsoDate(7);
  const todayReservations = reservations.filter(
    (reservation) => reservation.date === today,
  );
  const pendingReservations = reservations.filter(
    (reservation) => reservation.status === "pending",
  );
  const upcomingReservations = reservations.filter(
    (reservation) =>
      reservation.date >= today && reservation.date <= nextWeek,
  );
  const scheduleReservations =
    scheduleWindow === "today" ? todayReservations : upcomingReservations;
  const visibleReservations = [...scheduleReservations]
    .sort((left, right) =>
      `${left.date}T${left.time}`.localeCompare(`${right.date}T${right.time}`),
    )
    .slice(0, 5);
  const numberFormatter = new Intl.NumberFormat(i18n.language);
  const dateFormatter = new Intl.DateTimeFormat(i18n.language, {
    month: "short",
    day: "numeric",
  });

  const customerLabel = (reservation: OverviewReservation) =>
    reservation.customerLabel || t(`customer.${reservation.customerKind}`);

  const formatDate = (date: string) =>
    dateFormatter.format(new Date(`${date}T12:00:00`));

  return (
    <div className="grid grid-cols-12 gap-y-10 gap-x-6">
      <section className="col-span-12" aria-labelledby="overview-title">
        <div className="flex flex-col md:h-10 gap-y-3 md:items-center md:flex-row">
          <div>
            <h1
              id="overview-title"
              className="text-base font-medium group-[.mode--light]:text-white"
            >
              {t("page.title")}
            </h1>
            <p className="sr-only">{t("page.subtitle")}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-x-3 gap-y-2 md:ms-auto">
            <div className="relative">
              <Lucide
                icon="CalendarCheck2"
                className="absolute group-[.mode--light]:!text-slate-200 inset-y-0 start-0 z-10 w-4 h-4 my-auto ms-3 stroke-[1.3]"
                aria-hidden="true"
              />
              <FormSelect
                aria-label={t("sections.today")}
                className="sm:w-44 rounded-[0.5rem] group-[.mode--light]:bg-chevron-white group-[.mode--light]:!bg-white/[0.12] group-[.mode--light]:!text-slate-200 group-[.mode--light]:!border-transparent ps-9"
                value={scheduleWindow}
                onChange={(event) =>
                  setScheduleWindow(event.target.value as "today" | "upcoming")
                }
              >
                <option value="today">{t("sections.today")}</option>
                <option value="upcoming">{t("metrics.upcoming")}</option>
              </FormSelect>
            </div>
            <Button
              as={Link}
              to="/transaction-list?create=1"
              variant="primary"
              className="group-[.mode--light]:!bg-white/[0.12] group-[.mode--light]:!text-slate-200 group-[.mode--light]:!border-transparent"
            >
              <Lucide icon="Plus" className="stroke-[1.3] w-4 h-4 me-2" />
              {t("quick.manualTitle")}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-5 mt-3.5">
          <div className="col-span-12 p-1 md:col-span-6 2xl:col-span-3 box box--stacked">
            <div className="-mx-1 overflow-hidden h-[244px]">
              <div className="h-full px-1">
                <div className="overflow-hidden relative flex flex-col w-full h-full p-5 rounded-[0.5rem] bg-gradient-to-b from-theme-2/90 to-theme-1/[0.85]">
                  <Lucide
                    icon="Calendar"
                    className="absolute top-0 end-0 w-36 h-36 -mt-5 -me-5 text-white/20 fill-white/[0.03] transform rotate-[-10deg] stroke-[0.3]"
                    aria-hidden="true"
                  />
                  <div className="mt-8 mb-auto">
                    <div className="text-2xl font-medium leading-snug text-white">
                      {t("trial.statusTitle")}
                    </div>
                    <div className="mt-2 text-base leading-relaxed text-white/70">
                      {t("trial.statusBody")}
                    </div>
                  </div>
                  <Link
                    className="flex items-center font-medium text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    to="/invoice"
                  >
                    {t("trial.action")}
                    <Lucide icon="ArrowRight" className="w-4 h-4 ms-1.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <article className="flex flex-col col-span-12 p-5 md:col-span-6 2xl:col-span-3 box box--stacked">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-12 h-12 border rounded-full border-primary/10 bg-primary/10">
                <Lucide
                  icon="CalendarCheck2"
                  className="w-6 h-6 text-primary fill-primary/10"
                  aria-hidden="true"
                />
              </div>
              <div className="ms-4">
                <div className="text-base font-medium">
                  {t("metrics.today")}
                </div>
                <div className="text-slate-500 mt-0.5">
                  {numberFormatter.format(todayReservations.length)}
                </div>
              </div>
            </div>
            <div className="relative mt-5 mb-6 overflow-hidden">
              <div className="absolute inset-0 h-px my-auto tracking-widest text-slate-400/60 whitespace-nowrap leading-[0] text-xs">
                .......................................................................
              </div>
              {showDemonstrationMetrics ? (
                <ReportLineChart
                  aria-label={`${t("metrics.today")}: ${t("metrics.todayHint")}`}
                  className="relative z-10 -ms-1.5"
                  height={100}
                  index={2}
                  borderColor={getColor("primary")}
                  backgroundColor={getColor("primary", 0.3)}
                />
              ) : (
                <p className="relative z-10 flex h-[100px] items-center justify-center bg-white text-sm text-slate-500 dark:bg-darkmode-600">
                  {t("metrics.unavailable")}
                </p>
              )}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-y-3 gap-x-5">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-primary/70" />
                <div className="ms-2.5">
                  {t(
                    showDemonstrationMetrics
                      ? "metrics.todayHint"
                      : "metrics.unavailable",
                  )}
                </div>
              </div>
            </div>
          </article>

          <article className="flex flex-col col-span-12 p-5 md:col-span-6 2xl:col-span-3 box box--stacked">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-12 h-12 border rounded-full border-warning/10 bg-warning/10">
                <Lucide
                  icon="Hourglass"
                  className="w-6 h-6 text-warning fill-warning/10"
                  aria-hidden="true"
                />
              </div>
              <div className="ms-4">
                <div className="text-base font-medium">
                  {t("metrics.pending")}
                </div>
                <div className="text-slate-500 mt-0.5">
                  {numberFormatter.format(pendingReservations.length)}
                </div>
              </div>
            </div>
            <div className="relative mt-5 mb-6 overflow-hidden">
              <div className="absolute inset-0 h-px my-auto tracking-widest text-slate-400/60 whitespace-nowrap leading-[0] text-xs">
                .......................................................................
              </div>
              {showDemonstrationMetrics ? (
                <ReportLineChart
                  aria-label={`${t("metrics.pending")}: ${t("metrics.pendingHint")}`}
                  className="relative z-10 -ms-1.5"
                  height={100}
                  index={0}
                  borderColor={getColor("warning")}
                  backgroundColor={getColor("warning", 0.3)}
                />
              ) : (
                <p className="relative z-10 flex h-[100px] items-center justify-center bg-white text-sm text-slate-500 dark:bg-darkmode-600">
                  {t("metrics.unavailable")}
                </p>
              )}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-y-3 gap-x-5">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-warning/70" />
                <div className="ms-2.5">
                  {t(
                    showDemonstrationMetrics
                      ? "metrics.pendingHint"
                      : "metrics.unavailable",
                  )}
                </div>
              </div>
            </div>
          </article>

          <article className="flex flex-col col-span-12 p-5 md:col-span-6 2xl:col-span-3 box box--stacked">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-12 h-12 border rounded-full border-success/10 bg-success/10">
                <Lucide
                  icon="Clock"
                  className="w-6 h-6 text-success fill-success/10"
                  aria-hidden="true"
                />
              </div>
              <div className="ms-4">
                <div className="text-base font-medium">
                  {t("metrics.openSlots")}
                </div>
                <div className="text-slate-500 mt-0.5">
                  {showDemonstrationMetrics ? numberFormatter.format(6) : "—"}
                </div>
              </div>
            </div>
            <div className="relative mt-5 mb-6">
              {showDemonstrationMetrics ? (
                <ReportDonutChart
                  aria-label={`${t("metrics.openSlots")}: ${t("metrics.openSlotsHint")}`}
                  className="relative z-10"
                  height={100}
                  labels={[t("metrics.openSlots"), t("metrics.upcoming")]}
                />
              ) : (
                <p className="flex h-[100px] items-center justify-center text-sm text-slate-500">
                  {t("metrics.unavailable")}
                </p>
              )}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-y-3 gap-x-5">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-theme-2/70" />
                <div className="ms-2.5">
                  {t(
                    showDemonstrationMetrics
                      ? "metrics.openSlotsHint"
                      : "metrics.unavailable",
                  )}
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="col-span-12" aria-labelledby="quick-actions-title">
        <div className="flex flex-col md:h-10 gap-y-3 md:items-center md:flex-row">
          <h2 id="quick-actions-title" className="text-base font-medium">
            {t("sections.quickActions")}
          </h2>
          <div className="flex gap-x-3 gap-y-2 md:ms-auto">
            <Button
              as={Link}
              to="/transaction-list"
              aria-label={t("quick.reservationsTitle")}
              className="rounded-[0.5rem] bg-white text-slate-600 dark:text-slate-300"
            >
              <div className="flex items-center justify-center w-3.5 h-5">
                <Lucide icon="ChevronLeft" className="w-4 h-4" />
              </div>
            </Button>
            <Button
              as={Link}
              to="/availability"
              aria-label={t("quick.availabilityTitle")}
              className="rounded-[0.5rem] bg-white text-slate-600 dark:text-slate-300"
            >
              <div className="flex items-center justify-center w-3.5 h-5">
                <Lucide icon="ChevronRight" className="w-4 h-4" />
              </div>
            </Button>
          </div>
        </div>
        <div className="mt-3.5 -mx-2.5 grid sm:grid-cols-2 xl:grid-cols-4 gap-y-2">
          {quickActions.map((action, index) => (
            <div className="px-2.5 pb-3" key={action.title}>
              <Link
                to={action.to}
                className="relative block h-full p-5 box box--stacked focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <div className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 border rounded-full ${
                      index % 2 === 0
                        ? "border-primary/10 bg-primary/10"
                        : "border-success/10 bg-success/10"
                    }`}
                  >
                    <Lucide
                      icon={action.icon}
                      className={`w-5 h-5 ${
                        index % 2 === 0 ? "text-primary" : "text-success"
                      }`}
                      aria-hidden="true"
                    />
                  </div>
                  <Lucide
                    icon="ExternalLink"
                    className="w-4 h-4 ms-auto text-slate-400"
                    aria-hidden="true"
                  />
                </div>
                <div className="mt-11">
                  <h3 className="text-base font-medium">{t(action.title)}</h3>
                  <p className="text-slate-500 mt-0.5">{t(action.body)}</p>
                </div>
                <div className="flex items-center pt-4 mt-4 font-medium border-t border-dashed text-primary">
                  {t(action.title)}
                  <Lucide icon="ArrowRight" className="w-4 h-4 ms-1.5" />
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="col-span-12" aria-labelledby="today-schedule-title">
        <div className="flex flex-col md:h-10 gap-y-3 md:items-center md:flex-row">
          <div>
            <h2 id="today-schedule-title" className="text-base font-medium">
              {t(
                scheduleWindow === "today"
                  ? "sections.today"
                  : "metrics.upcoming",
              )}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {t(
                scheduleWindow === "today"
                  ? "metrics.today"
                  : "metrics.upcoming",
              )}: {numberFormatter.format(scheduleReservations.length)}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-x-3 gap-y-2 md:ms-auto">
            <Button
              as={Link}
              to="/transaction-list"
              variant="outline-secondary"
              className="bg-white rounded-[0.5rem]"
            >
              {t("common.viewAll")}
              <Lucide icon="ArrowRight" className="w-4 h-4 ms-2" />
            </Button>
          </div>
        </div>

        <div className="mt-2 overflow-auto lg:overflow-visible">
          <Table className="border-spacing-y-[10px] border-separate">
            <Table.Thead className="sr-only">
              <Table.Tr>
                <Table.Th scope="col">{t("schedule.appointment")}</Table.Th>
                <Table.Th scope="col">{t("schedule.customer")}</Table.Th>
                <Table.Th scope="col">{t("schedule.service")}</Table.Th>
                <Table.Th scope="col">{t("schedule.status")}</Table.Th>
                <Table.Th scope="col">{t("schedule.time")}</Table.Th>
                <Table.Th scope="col">{t("schedule.action")}</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {visibleReservations.map((reservation) => {
                const status = statusStyles[reservation.status];
                return (
                  <Table.Tr key={reservation.id}>
                    <Table.Td className="box shadow-[5px_3px_5px_#00000005] first:border-l last:border-r first:rounded-s-[0.6rem] last:rounded-e-[0.6rem] rounded-s-none rounded-e-none border-x-0 dark:bg-darkmode-600">
                      <div className="flex items-center">
                        <Lucide
                          icon="CalendarCheck2"
                          className="w-6 h-6 text-theme-1 fill-primary/10 stroke-[0.8]"
                          aria-hidden="true"
                        />
                        <div className="ms-3.5">
                          <Link
                            to={`/transaction-detail/${reservation.id}`}
                            className="font-medium whitespace-nowrap"
                            dir="ltr"
                          >
                            {reservation.id}
                          </Link>
                          <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                            {t(`source.${reservation.source}`)}
                          </div>
                        </div>
                      </div>
                    </Table.Td>
                    <Table.Td className="w-60 box shadow-[5px_3px_5px_#00000005] first:border-l last:border-r first:rounded-s-[0.6rem] last:rounded-e-[0.6rem] rounded-s-none rounded-e-none border-x-0 dark:bg-darkmode-600">
                      <div className="text-slate-500 text-xs">
                        {t(`customer.${reservation.customerKind}`)}
                      </div>
                      <div className="mt-1 font-medium whitespace-nowrap">
                        {customerLabel(reservation)}
                      </div>
                    </Table.Td>
                    <Table.Td className="w-60 box shadow-[5px_3px_5px_#00000005] first:border-l last:border-r first:rounded-s-[0.6rem] last:rounded-e-[0.6rem] rounded-s-none rounded-e-none border-x-0 dark:bg-darkmode-600">
                      <div className="font-medium whitespace-nowrap">
                        {t(`service.${reservation.service}`)}
                      </div>
                      <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                        {t("schedule.duration", {
                          count: reservation.durationMinutes,
                        })}
                      </div>
                    </Table.Td>
                    <Table.Td className="w-44 box shadow-[5px_3px_5px_#00000005] first:border-l last:border-r first:rounded-s-[0.6rem] last:rounded-e-[0.6rem] rounded-s-none rounded-e-none border-x-0 dark:bg-darkmode-600">
                      <div className={`flex items-center ${status.text}`}>
                        <Lucide
                          icon={status.icon}
                          className="w-3.5 h-3.5 stroke-[1.7]"
                          aria-hidden="true"
                        />
                        <div className="ms-1.5 whitespace-nowrap">
                          {t(`status.${reservation.status}`)}
                        </div>
                      </div>
                    </Table.Td>
                    <Table.Td className="w-44 box shadow-[5px_3px_5px_#00000005] first:border-l last:border-r first:rounded-s-[0.6rem] last:rounded-e-[0.6rem] rounded-s-none rounded-e-none border-x-0 dark:bg-darkmode-600">
                      <div className="font-medium whitespace-nowrap">
                        {formatDate(reservation.date)}
                      </div>
                      <div
                        className="text-slate-500 text-xs whitespace-nowrap mt-0.5"
                        dir="ltr"
                      >
                        {reservation.time}
                      </div>
                    </Table.Td>
                    <Table.Td className="w-20 relative py-0 box shadow-[5px_3px_5px_#00000005] first:border-l last:border-r first:rounded-s-[0.6rem] last:rounded-e-[0.6rem] rounded-s-none rounded-e-none border-x-0 dark:bg-darkmode-600">
                      <Link
                        to={`/transaction-detail/${reservation.id}`}
                        aria-label={`${t("common.review")} ${reservation.id}`}
                        className="flex min-h-11 min-w-11 items-center justify-center text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        <Lucide icon="ChevronRight" className="w-5 h-5" />
                      </Link>
                    </Table.Td>
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>
        </div>
      </section>
    </div>
  );
}

export default OverviewPage;
