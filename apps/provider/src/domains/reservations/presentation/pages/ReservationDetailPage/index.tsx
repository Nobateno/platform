import { useState, type PropsWithChildren, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  allowedStatusTransitions,
  type ReservationStatus,
} from "@/domains/reservations/model/reservations";
import { useReservationStore } from "@/domains/reservations/application/reservation-store";
import { reservationsNamespace } from "@/domains/reservations/i18n";
import { normalizeLanguage, type AppLanguage } from "@/shared/i18n";
import Button from "@/shared/ui/components/Base/Button";
import Lucide, { type icons } from "@/shared/ui/components/Base/Lucide";
import Table from "@/shared/ui/components/Base/Table";

type IconName = keyof typeof icons;

const localeByLanguage: Record<AppLanguage, string> = {
  fa: "fa-IR",
  en: "en-US",
  zh: "zh-CN",
  es: "es-ES",
  ru: "ru-RU",
  pt: "pt-BR",
  fr: "fr-FR",
  de: "de-DE",
  ja: "ja-JP",
};

const formatDate = (date: string, language: AppLanguage) =>
  new Intl.DateTimeFormat(localeByLanguage[language], {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date + "T12:00:00"));

const statusPresentation: Record<
  ReservationStatus,
  { className: string; icon: IconName }
> = {
  pending: { className: "text-warning bg-warning/10 border-warning/10", icon: "Hourglass" },
  approved: { className: "text-success bg-success/10 border-success/10", icon: "Check" },
  completed: { className: "text-primary bg-primary/10 border-primary/10", icon: "CheckSquare" },
  cancelled: { className: "text-slate-500 bg-slate-100 border-slate-200", icon: "X" },
  rejected: { className: "text-danger bg-danger/10 border-danger/10", icon: "AlertCircle" },
  noShow: { className: "text-danger bg-danger/10 border-danger/10", icon: "User" },
};

const actionPresentation: Record<
  ReservationStatus,
  {
    label: string;
    variant: "primary" | "danger" | "success" | "outline-danger";
    icon: IconName;
  }
> = {
  approved: { label: "detail.approve", variant: "primary", icon: "Check" },
  rejected: { label: "detail.reject", variant: "danger", icon: "X" },
  cancelled: { label: "detail.cancel", variant: "danger", icon: "X" },
  completed: { label: "detail.complete", variant: "success", icon: "CheckSquare" },
  noShow: { label: "detail.noShow", variant: "outline-danger", icon: "User" },
  pending: { label: "status.pending", variant: "primary", icon: "Hourglass" },
};

function DetailGroup({
  children,
  id,
  title,
}: PropsWithChildren<{ id: string; title: string }>) {
  return (
    <section
      aria-labelledby={id}
      className="border rounded-[0.6rem] border-slate-200/80 dark:border-darkmode-400 relative mt-3"
    >
      <div className="absolute start-0 px-3 ms-4 -mt-2 text-xs uppercase bg-white text-slate-500 dark:bg-darkmode-600">
        <h2 id={id} className="-mt-px font-normal">
          {title}
        </h2>
      </div>
      <div className="p-5 mt-2.5 flex flex-col gap-5">{children}</div>
    </section>
  );
}

function DetailRow({
  children,
  icon,
  label,
}: {
  children: ReactNode;
  icon: IconName;
  label: string;
}) {
  return (
    <div className="flex items-start">
      <Lucide
        icon={icon}
        className="w-4 h-4 mt-0.5 me-2.5 stroke-[1.3] text-slate-500"
        aria-hidden="true"
      />
      <div className="flex flex-col flex-wrap w-full sm:items-center sm:flex-row gap-y-1">
        <div className="sm:me-auto w-54 text-slate-500">{label}:</div>
        <div className="min-w-0 text-start">{children}</div>
      </div>
    </div>
  );
}

function ReservationDetailPage() {
  const { id } = useParams<{ id?: string }>();
  const { t, i18n } = useTranslation(reservationsNamespace);
  const reference = id ?? "NOB-2048";
  const reservations = useReservationStore((state) => state.reservations);
  const reservation = reservations.find(
    ({ id: reservationId }) => reservationId === reference,
  );
  const updateReservationStatus = useReservationStore(
    (state) => state.updateStatus,
  );
  const [historyByReservation, setHistoryByReservation] = useState<
    Record<string, ReservationStatus[]>
  >({});
  const [feedback, setFeedback] = useState<{
    reservationId: string;
    message: string;
  } | null>(null);
  const language = normalizeLanguage(i18n.resolvedLanguage ?? i18n.language);

  if (!reservation) {
    return (
      <div className="grid grid-cols-12 gap-y-10 gap-x-6">
        <section className="col-span-12 box box--stacked mx-auto w-full max-w-2xl p-6 text-center sm:p-10">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-danger/10 text-danger">
            <Lucide icon="Calendar" className="h-7 w-7" aria-hidden="true" />
          </span>
          <h1 className="mt-4 text-lg font-medium">{t("detail.notFoundTitle")}</h1>
          <p className="mt-2 text-slate-500">{t("detail.notFoundBody")}</p>
          <Button
            as={Link}
            to="/transaction-list"
            variant="primary"
            className="mt-6 min-h-11"
          >
            <Lucide icon="ArrowLeft" className="me-2" aria-hidden="true" />
            {t("detail.back")}
          </Button>
        </section>
      </div>
    );
  }

  const orderedReservations = [...reservations].sort((left, right) =>
    left.id.localeCompare(right.id),
  );
  const reservationIndex = orderedReservations.findIndex(
    ({ id: reservationId }) => reservationId === reservation.id,
  );
  const previousReservation = orderedReservations[reservationIndex - 1];
  const nextReservation = orderedReservations[reservationIndex + 1];
  const transitions = allowedStatusTransitions[reservation.status];
  const status = statusPresentation[reservation.status];
  const customer =
    reservation.customerLabel || t("customer." + reservation.customerKind);
  const notes =
    reservation.note ||
    (reservation.noteKey
      ? t("detail.note." + reservation.noteKey)
      : t("detail.noNotes"));
  const history =
    historyByReservation[reservation.id] ?? [reservation.status];

  const updateStatus = (nextStatus: ReservationStatus) => {
    const previousStatus = reservation.status;
    if (!updateReservationStatus(reservation.id, nextStatus)) return;
    setHistoryByReservation((current) => ({
      ...current,
      [reservation.id]: [
        ...(current[reservation.id] ?? [previousStatus]),
        nextStatus,
      ],
    }));
    setFeedback({
      reservationId: reservation.id,
      message: t("detail.updated", {
        id: reservation.id,
        status: t("status." + nextStatus),
      }),
    });
  };

  return (
    <div className="grid grid-cols-12 gap-y-10 gap-x-6">
      <div className="col-span-12">
        <div className="flex flex-col lg:h-10 gap-y-3 lg:items-center lg:flex-row">
          <div className="text-lg font-medium group-[.mode--light]:text-white flex items-center">
            <h1>{t("detail.title")}</h1>
            <Lucide
              icon="ArrowRight"
              className="stroke-[1.3] w-3.5 h-3.5 sm:w-5 sm:h-5 mx-1 sm:mx-2"
              aria-hidden="true"
            />
            <div className="text-sm sm:text-lg" dir="ltr">
              {reservation.id}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-x-3 gap-y-2 lg:ms-auto">
            {previousReservation && (
              <Button
                as={Link}
                to={"/transaction-detail/" + previousReservation.id}
                variant="primary"
                aria-label={t("table.view", { id: previousReservation.id })}
                className="group-[.mode--light]:!bg-white/[0.12] group-[.mode--light]:!text-slate-200 group-[.mode--light]:!border-transparent"
              >
                <Lucide
                  icon="ArrowLeft"
                  className="stroke-[1.3] w-4 h-4 me-3"
                  aria-hidden="true"
                />
                <span dir="ltr">{previousReservation.id}</span>
              </Button>
            )}
            {nextReservation && (
              <Button
                as={Link}
                to={"/transaction-detail/" + nextReservation.id}
                variant="primary"
                aria-label={t("table.view", { id: nextReservation.id })}
                className="group-[.mode--light]:!bg-white/[0.12] group-[.mode--light]:!text-slate-200 group-[.mode--light]:!border-transparent"
              >
                <Lucide
                  icon="ArrowRight"
                  className="stroke-[1.3] w-4 h-4 me-3"
                  aria-hidden="true"
                />
                <span dir="ltr">{nextReservation.id}</span>
              </Button>
            )}
            <Button
              type="button"
              variant="primary"
              onClick={() => window.print()}
              className="group-[.mode--light]:!bg-white/[0.12] group-[.mode--light]:!text-slate-200 group-[.mode--light]:!border-transparent"
            >
              <Lucide
                icon="Printer"
                className="stroke-[1.3] w-4 h-4 me-3"
                aria-hidden="true"
              />
              {t("detail.print")}
            </Button>
          </div>
        </div>

        {feedback?.reservationId === reservation.id && (
          <div
            className="mt-3.5 rounded-[0.6rem] border border-success/20 bg-success/10 p-4 text-success"
            aria-live="polite"
            role="status"
          >
            {feedback.message}
          </div>
        )}

        <div className="grid grid-cols-10 gap-5 mt-3.5">
          <div className="col-span-12 xl:col-span-3">
            <div className="flex flex-col p-5 box box--stacked">
              <div className="flex flex-col gap-5">
                <DetailGroup id="appointment-summary-title" title={t("detail.summary")}>
                  <DetailRow icon="Calendar" label={t("detail.dateTime")}>
                    <span>
                      {formatDate(reservation.date, language)}
                      <span aria-hidden="true"> · </span>
                      <span dir="ltr">{reservation.time}</span>
                    </span>
                  </DetailRow>
                  <DetailRow icon={status.icon} label={t("detail.status")}>
                    <span
                      className={
                        "flex items-center text-xs font-medium rounded-md border px-1.5 py-px " +
                        status.className
                      }
                    >
                      {t("status." + reservation.status)}
                    </span>
                  </DetailRow>
                  <div aria-labelledby="appointment-actions-title" className="mt-1.5">
                    <h3
                      id="appointment-actions-title"
                      className="mb-2 text-xs uppercase text-slate-500"
                    >
                      {t("detail.actions")}
                    </h3>
                    {transitions.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {transitions.map((nextStatus) => {
                          const action = actionPresentation[nextStatus];
                          return (
                            <Button
                              key={nextStatus}
                              type="button"
                              variant={action.variant}
                              className="min-h-11 flex-1 gap-2"
                              onClick={() => updateStatus(nextStatus)}
                            >
                              <Lucide
                                icon={action.icon}
                                className="w-4 h-4"
                                aria-hidden="true"
                              />
                              {t(action.label)}
                            </Button>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="rounded-md bg-slate-50 p-3 text-slate-500 dark:bg-darkmode-700">
                        {t("detail.terminal")}
                      </p>
                    )}
                  </div>
                </DetailGroup>

                <DetailGroup id="appointment-service-title" title={t("detail.service")}>
                  <DetailRow icon="Clipboard" label={t("detail.service")}>
                    {t("service." + reservation.service)}
                  </DetailRow>
                  <DetailRow icon="Clock" label={t("detail.duration")}>
                    {t("duration", { count: reservation.durationMinutes })}
                  </DetailRow>
                  <DetailRow icon="User" label={t("detail.provider")}>
                    {t("staff." + reservation.staff)}
                  </DetailRow>
                </DetailGroup>

                <DetailGroup id="appointment-customer-title" title={t("detail.customer")}>
                  <DetailRow icon="User" label={t("detail.customer")}>
                    {customer}
                  </DetailRow>
                  {reservation.customerPhone && (
                    <DetailRow icon="Smartphone" label={t("detail.phone")}>
                      <span dir="ltr">{reservation.customerPhone}</span>
                    </DetailRow>
                  )}
                </DetailGroup>

                <DetailGroup id="appointment-notes-title" title={t("detail.notes")}>
                  <DetailRow icon="Globe" label={t("detail.source")}>
                    {t("source." + reservation.source)}
                  </DetailRow>
                  <div className="flex items-start">
                    <Lucide
                      icon="Clipboard"
                      className="w-4 h-4 mt-0.5 me-2.5 stroke-[1.3] text-slate-500"
                      aria-hidden="true"
                    />
                    <p className="leading-relaxed text-slate-500">{notes}</p>
                  </div>
                </DetailGroup>
              </div>
            </div>
          </div>

          <div className="flex flex-col col-span-12 xl:col-span-7 gap-7">
            <div className="flex flex-col p-5 box box--stacked">
              <DetailGroup id="appointment-service-details-title" title={t("detail.service")}>
                <div className="overflow-auto xl:overflow-visible">
                  <Table className="border-b border-dashed border-slate-200/80">
                    <Table.Thead>
                      <Table.Tr>
                        {[t("detail.service"), t("detail.duration"), t("detail.provider"), t("detail.status")].map(
                          (heading, index) => (
                            <Table.Th
                              key={heading}
                              scope="col"
                              className="px-0 py-0 border-b-0"
                            >
                              <div
                                className={
                                  "px-5 py-4 font-medium bg-slate-50 border-slate-200/80 text-slate-500 border-y dark:bg-darkmode-700 " +
                                  (index > 0 ? "text-end" : "")
                                }
                              >
                                {heading}
                              </div>
                            </Table.Th>
                          ),
                        )}
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      <Table.Tr className="[&_td]:last:border-b-0 [&_td]:first:pt-5 [&_td]:last:pb-5">
                        <Table.Td className="py-3.5 border-dashed dark:bg-darkmode-600">
                          <div className="flex items-center">
                            <span className="flex w-11 h-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                              <Lucide icon="Clipboard" aria-hidden="true" />
                            </span>
                            <div className="ms-5">
                              <div className="font-medium whitespace-nowrap">
                                {t("service." + reservation.service)}
                              </div>
                              <div className="text-slate-500 text-xs mt-1 whitespace-nowrap">
                                {t("source." + reservation.source)}
                              </div>
                            </div>
                          </div>
                        </Table.Td>
                        <Table.Td className="py-3.5 text-end border-dashed dark:bg-darkmode-600">
                          {t("duration", { count: reservation.durationMinutes })}
                        </Table.Td>
                        <Table.Td className="py-3.5 text-end border-dashed dark:bg-darkmode-600">
                          {t("staff." + reservation.staff)}
                        </Table.Td>
                        <Table.Td className="py-3.5 text-end border-dashed dark:bg-darkmode-600">
                          <span className={"inline-flex rounded-md border px-2 py-1 text-xs " + status.className}>
                            {t("status." + reservation.status)}
                          </span>
                        </Table.Td>
                      </Table.Tr>
                    </Table.Tbody>
                  </Table>
                </div>
                <div className="flex flex-col gap-3 pt-2 sm:items-end">
                  <div className="flex items-center justify-end">
                    <div className="text-slate-500">{t("detail.dateTime")}:</div>
                    <div className="ms-4 font-medium text-slate-600 dark:text-slate-300">
                      {formatDate(reservation.date, language)}
                      <span aria-hidden="true"> · </span>
                      <span dir="ltr">{reservation.time}</span>
                    </div>
                  </div>
                </div>
              </DetailGroup>
            </div>

            <div className="flex flex-col p-5 box box--stacked">
              <DetailGroup id="appointment-history-title" title={t("detail.history")}>
                <ol className="relative overflow-hidden before:content-[''] before:absolute before:w-px before:bg-slate-200/60 before:start-0 before:inset-y-0 before:dark:bg-darkmode-400 before:ms-[14px]">
                  <li className="mb-3 last:mb-0 relative first:before:content-[''] first:before:h-1/2 first:before:w-5 first:before:bg-white first:before:dark:bg-darkmode-600 first:before:absolute last:after:content-[''] last:after:h-1/2 last:after:w-5 last:after:bg-white last:after:dark:bg-darkmode-600 last:after:absolute last:after:bottom-0">
                    <div className="px-4 py-3 ms-8 before:content-[''] before:ms-1 before:absolute before:w-5 before:h-5 before:bg-slate-200 before:rounded-full before:inset-y-0 before:my-auto before:start-0 before:dark:bg-darkmode-300 before:z-10 after:content-[''] after:absolute after:w-1.5 after:h-1.5 after:bg-slate-500 after:rounded-full after:inset-y-0 after:my-auto after:start-0 after:ms-[11px] after:dark:bg-darkmode-200 after:z-10">
                      <p className="font-medium text-primary">
                        {t("detail.historyCreated", {
                          source: t("source." + reservation.source),
                        })}
                      </p>
                      <p className="mt-1.5 leading-relaxed text-slate-500 text-[0.8rem]">
                        {customer}
                      </p>
                      <p className="mt-1.5 text-xs text-slate-500">
                        {formatDate(reservation.date, language)}
                        <span aria-hidden="true"> · </span>
                        <span dir="ltr">{reservation.time}</span>
                      </p>
                    </div>
                  </li>
                  {history.map((historyStatus, index) => (
                    <li
                      key={historyStatus + "-" + index}
                      className="mb-3 last:mb-0 relative first:before:content-[''] first:before:h-1/2 first:before:w-5 first:before:bg-white first:before:dark:bg-darkmode-600 first:before:absolute last:after:content-[''] last:after:h-1/2 last:after:w-5 last:after:bg-white last:after:dark:bg-darkmode-600 last:after:absolute last:after:bottom-0"
                    >
                      <div className="px-4 py-3 ms-8 before:content-[''] before:ms-1 before:absolute before:w-5 before:h-5 before:bg-slate-200 before:rounded-full before:inset-y-0 before:my-auto before:start-0 before:dark:bg-darkmode-300 before:z-10 after:content-[''] after:absolute after:w-1.5 after:h-1.5 after:bg-slate-500 after:rounded-full after:inset-y-0 after:my-auto after:start-0 after:ms-[11px] after:dark:bg-darkmode-200 after:z-10">
                        <p className="font-medium text-primary">
                          {t("detail.historyStatus", {
                            status: t("status." + historyStatus),
                          })}
                        </p>
                        <p className="mt-1.5 leading-relaxed text-slate-500 text-[0.8rem]">
                          {t("detail.provider")}: {t("staff." + reservation.staff)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </DetailGroup>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReservationDetailPage;
