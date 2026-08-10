import { useId, useMemo, useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  type Reservation,
  type ReservationSource,
  type ReservationStatus,
  type ServiceKey,
  type StaffKey,
} from "@/domains/reservations/model/reservations";
import { useReservationStore } from "@/domains/reservations/application/reservation-store";
import { reservationsNamespace } from "@/domains/reservations/i18n";
import { normalizeLanguage, type AppLanguage } from "@/shared/i18n";
import Button from "@/shared/ui/components/Base/Button";
import { Dialog, Popover } from "@/shared/ui/components/Base/Headless";
import {
  FormCheck,
  FormInput,
  FormLabel,
  FormSelect,
  FormTextarea,
} from "@/shared/ui/components/Base/Form";
import Lucide, { type icons } from "@/shared/ui/components/Base/Lucide";
import Pagination from "@/shared/ui/components/Base/Pagination";
import Table from "@/shared/ui/components/Base/Table";

type IconName = keyof typeof icons;

const statusOptions: ReservationStatus[] = [
  "pending",
  "approved",
  "completed",
  "cancelled",
  "rejected",
  "noShow",
];
const sourceOptions: ReservationSource[] = ["online", "manual", "voice"];
const serviceOptions: ServiceKey[] = [
  "consultation",
  "followUp",
  "wellness",
  "assessment",
];
const staffOptions: StaffKey[] = ["owner", "specialist", "team"];

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

const statusPresentation: Record<
  ReservationStatus,
  { className: string; icon: IconName }
> = {
  pending: { className: "text-warning", icon: "Hourglass" },
  approved: { className: "text-success", icon: "Check" },
  completed: { className: "text-primary", icon: "CheckSquare" },
  cancelled: { className: "text-slate-500", icon: "X" },
  rejected: { className: "text-danger", icon: "AlertCircle" },
  noShow: { className: "text-danger", icon: "User" },
};

const formatDate = (date: string, language: AppLanguage) =>
  new Intl.DateTimeFormat(localeByLanguage[language], {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date(`${date}T12:00:00`));

const todayAsLocalIso = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

type ManualForm = {
  name: string;
  phone: string;
  service: ServiceKey;
  staff: StaffKey;
  date: string;
  time: string;
  note: string;
};

const initialManualForm = (): ManualForm => ({
  name: "",
  phone: "",
  service: "consultation",
  staff: "owner",
  date: todayAsLocalIso(),
  time: "09:00",
  note: "",
});

function ReservationListPage() {
  const { t, i18n } = useTranslation(reservationsNamespace);
  const [searchParams] = useSearchParams();
  const initialStatus = searchParams.get("status");
  const reservations = useReservationStore((state) => state.reservations);
  const createManualBooking = useReservationStore(
    (state) => state.createManualBooking,
  );
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ReservationStatus | "all">(
    statusOptions.includes(initialStatus as ReservationStatus)
      ? (initialStatus as ReservationStatus)
      : "all",
  );
  const [sourceFilter, setSourceFilter] = useState<ReservationSource | "all">(
    "all",
  );
  const [manualOpen, setManualOpen] = useState(
    searchParams.get("create") === "1",
  );
  const [manualForm, setManualForm] = useState<ManualForm>(initialManualForm);
  const [feedback, setFeedback] = useState("");
  const [formError, setFormError] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const formId = useId();
  const perPageId = useId();
  const language = normalizeLanguage(i18n.resolvedLanguage ?? i18n.language);

  const filteredReservations = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase(language);
    return reservations.filter((reservation) => {
      if (statusFilter !== "all" && reservation.status !== statusFilter)
        return false;
      if (sourceFilter !== "all" && reservation.source !== sourceFilter)
        return false;
      if (!normalizedQuery) return true;
      const searchable = [
        reservation.id,
        reservation.customerLabel ?? t(`customer.${reservation.customerKind}`),
        t(`service.${reservation.service}`),
        t(`staff.${reservation.staff}`),
        t(`source.${reservation.source}`),
      ]
        .join(" ")
        .toLocaleLowerCase(language);
      return searchable.includes(normalizedQuery);
    });
  }, [language, query, reservations, sourceFilter, statusFilter, t]);

  const pageCount = Math.max(1, Math.ceil(filteredReservations.length / perPage));
  const safeCurrentPage = Math.min(currentPage, pageCount);
  const visibleReservations = filteredReservations.slice(
    (safeCurrentPage - 1) * perPage,
    safeCurrentPage * perPage,
  );
  const allVisibleSelected =
    visibleReservations.length > 0 &&
    visibleReservations.every((reservation) =>
      selectedIds.includes(reservation.id),
    );
  const hasPartialVisibleSelection =
    !allVisibleSelected &&
    visibleReservations.some((reservation) =>
      selectedIds.includes(reservation.id),
    );

  const resetFilters = () => {
    setQuery("");
    setStatusFilter("all");
    setSourceFilter("all");
    setCurrentPage(1);
  };

  const handleCreate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback("");
    const result = createManualBooking({
      customerName: manualForm.name,
      customerPhone: manualForm.phone,
      service: manualForm.service,
      staff: manualForm.staff,
      date: manualForm.date,
      time: manualForm.time,
      note: manualForm.note,
    });
    if (!result.ok) {
      setFormError(t("manual.conflict"));
      return;
    }
    setManualForm(initialManualForm());
    setFormError("");
    setFeedback(t("manual.success", { id: result.reservation.id }));
    setManualOpen(false);
    resetFilters();
  };

  const customerLabel = (reservation: Reservation) =>
    reservation.customerLabel || t(`customer.${reservation.customerKind}`);

  const toggleVisibleRows = () => {
    const visibleIds = new Set(
      visibleReservations.map((reservation) => reservation.id),
    );
    setSelectedIds((current) =>
      allVisibleSelected
        ? current.filter((id) => !visibleIds.has(id))
        : [
            ...current,
            ...visibleReservations
              .map((reservation) => reservation.id)
              .filter((id) => !current.includes(id)),
          ],
    );
  };

  const toggleRow = (id: string) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((selectedId) => selectedId !== id)
        : [...current, id],
    );
  };

  return (
    <div className="grid grid-cols-12 gap-y-10 gap-x-6">
      <div className="col-span-12">
        <div className="flex flex-col md:h-10 gap-y-3 md:items-center md:flex-row">
          <div>
            <h1 className="text-base font-medium group-[.mode--light]:text-white">
              {t("list.title")}
            </h1>
            <p className="sr-only">{t("list.subtitle")}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-x-3 gap-y-2 md:ms-auto">
            <Button
              type="button"
              variant="primary"
              className="group-[.mode--light]:!bg-white/[0.12] group-[.mode--light]:!text-slate-200 group-[.mode--light]:!border-transparent"
              aria-haspopup="dialog"
              onClick={() => {
                setManualOpen(true);
                setFormError("");
              }}
            >
              <Lucide icon="Plus" className="stroke-[1.3] w-4 h-4 me-2" />
              {t("list.create")}
            </Button>
          </div>
        </div>

        {feedback && (
          <div
            className="mt-3.5 px-4 py-3 border rounded-[0.6rem] border-success/30 bg-success/10 text-success"
            role="status"
          >
            {feedback}
          </div>
        )}

        <div className="mt-3.5">
          <section
            className="flex flex-col box box--stacked"
            aria-labelledby="reservation-results-title"
          >
            <h2 id="reservation-results-title" className="sr-only">
              {t("list.title")}
            </h2>
            <div className="flex flex-col p-5 sm:items-center sm:flex-row gap-y-2">
              <div>
                <FormLabel htmlFor="reservation-search" className="sr-only">
                  {t("filters.searchLabel")}
                </FormLabel>
                <div className="relative">
                  <Lucide
                    icon="Search"
                    className="absolute inset-y-0 start-0 z-10 w-4 h-4 my-auto ms-3 stroke-[1.3] text-slate-500"
                    aria-hidden="true"
                  />
                  <FormInput
                    id="reservation-search"
                    type="search"
                    placeholder={t("filters.searchPlaceholder")}
                    className="ps-9 sm:w-64 rounded-[0.5rem]"
                    value={query}
                    onChange={(event) => {
                      setQuery(event.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>
                <p
                  className="mt-2 text-xs text-slate-500"
                  aria-live="polite"
                >
                  {t("filters.resultCount", {
                    count: filteredReservations.length,
                  })}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-x-3 gap-y-2 sm:ms-auto">
                <Button
                  type="button"
                  variant="outline-secondary"
                  className="w-full sm:w-auto"
                  onClick={resetFilters}
                >
                  <Lucide
                    icon="ArrowLeft"
                    className="stroke-[1.3] w-4 h-4 me-2"
                  />
                  {t("filters.reset")}
                </Button>
                <Popover className="inline-block">
                  {({ close }) => (
                    <>
                      <Popover.Button
                        as={Button}
                        variant="outline-secondary"
                        className="w-full sm:w-auto"
                      >
                        <Lucide
                          icon="ArrowDownWideNarrow"
                          className="stroke-[1.3] w-4 h-4 me-2"
                        />
                        {t("filters.statusLabel")}
                        <span className="flex items-center justify-center h-5 px-1.5 ms-2 text-xs font-medium border rounded-full bg-slate-100 dark:bg-darkmode-700">
                          {Number(statusFilter !== "all") +
                            Number(sourceFilter !== "all")}
                        </span>
                      </Popover.Button>
                      <Popover.Panel placement="bottom-end" className="w-72">
                        <div className="p-2">
                          <div>
                            <FormLabel
                              htmlFor="reservation-status"
                              className="text-start text-slate-500"
                            >
                              {t("filters.statusLabel")}
                            </FormLabel>
                            <FormSelect
                              id="reservation-status"
                              className="flex-1 mt-2"
                              value={statusFilter}
                              onChange={(event) => {
                                setStatusFilter(
                                  event.target.value as
                                    | ReservationStatus
                                    | "all",
                                );
                                setCurrentPage(1);
                              }}
                            >
                              <option value="all">{t("filters.all")}</option>
                              {statusOptions.map((status) => (
                                <option key={status} value={status}>
                                  {t(`status.${status}`)}
                                </option>
                              ))}
                            </FormSelect>
                          </div>
                          <div className="mt-3">
                            <FormLabel
                              htmlFor="reservation-source"
                              className="text-start text-slate-500"
                            >
                              {t("filters.sourceLabel")}
                            </FormLabel>
                            <FormSelect
                              id="reservation-source"
                              className="flex-1 mt-2"
                              value={sourceFilter}
                              onChange={(event) => {
                                setSourceFilter(
                                  event.target.value as
                                    | ReservationSource
                                    | "all",
                                );
                                setCurrentPage(1);
                              }}
                            >
                              <option value="all">{t("filters.all")}</option>
                              {sourceOptions.map((source) => (
                                <option key={source} value={source}>
                                  {t(`source.${source}`)}
                                </option>
                              ))}
                            </FormSelect>
                          </div>
                          <div className="flex items-center mt-4">
                            <Button
                              type="button"
                              variant="secondary"
                              onClick={() => {
                                resetFilters();
                                close();
                              }}
                              className="w-32 ms-auto"
                            >
                              {t("filters.reset")}
                            </Button>
                            <Button
                              type="button"
                              variant="primary"
                              className="w-32 ms-2"
                              onClick={() => close()}
                            >
                              {t("filters.apply")}
                            </Button>
                          </div>
                        </div>
                      </Popover.Panel>
                    </>
                  )}
                </Popover>
              </div>
            </div>

            <div className="overflow-auto xl:overflow-visible">
              <Table className="border-b border-slate-200/60">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th className="w-5 py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-800">
                      <FormCheck.Input
                        type="checkbox"
                        aria-label={t("list.title")}
                        aria-checked={
                          hasPartialVisibleSelection ? "mixed" : undefined
                        }
                        checked={allVisibleSelected}
                        onChange={toggleVisibleRows}
                      />
                    </Table.Th>
                    <Table.Th className="py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-800">
                      {t("detail.customer")}
                    </Table.Th>
                    <Table.Th className="py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-800">
                      {t("table.reference")}
                    </Table.Th>
                    <Table.Th className="py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-800">
                      {t("table.status")}
                    </Table.Th>
                    <Table.Th className="py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-800">
                      {t("table.source")}
                    </Table.Th>
                    <Table.Th className="py-4 font-medium border-t bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-800">
                      {t("table.date")}
                    </Table.Th>
                    <Table.Th className="py-4 font-medium text-center border-t w-36 bg-slate-50 border-slate-200/60 text-slate-500 dark:bg-darkmode-800">
                      {t("table.actions")}
                    </Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {visibleReservations.length === 0 ? (
                    <Table.Tr>
                      <Table.Td colSpan={7} className="py-14 text-center">
                        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-darkmode-700">
                          <Lucide icon="SearchX" className="h-7 w-7" />
                        </span>
                        <h3 className="mt-4 text-base font-medium">
                          {t("empty.title")}
                        </h3>
                        <p className="mt-2 text-slate-500">
                          {t("empty.body")}
                        </p>
                      </Table.Td>
                    </Table.Tr>
                  ) : (
                    visibleReservations.map((reservation) => {
                      const status = statusPresentation[reservation.status];
                      return (
                        <Table.Tr
                          key={reservation.id}
                          className="[&_td]:last:border-b-0"
                        >
                          <Table.Td className="py-4 border-dashed dark:bg-darkmode-600">
                            <FormCheck.Input
                              type="checkbox"
                              aria-label={reservation.id}
                              checked={selectedIds.includes(reservation.id)}
                              onChange={() => toggleRow(reservation.id)}
                            />
                          </Table.Td>
                          <Table.Td className="py-4 border-dashed w-60 dark:bg-darkmode-600">
                            <div className="flex items-center">
                              <div className="flex items-center justify-center w-9 h-9 border-2 rounded-full border-slate-200/70 bg-primary/10 text-primary">
                                <Lucide
                                  icon="User"
                                  className="w-4 h-4"
                                  aria-hidden="true"
                                />
                              </div>
                              <div className="ms-3.5">
                                <div className="font-medium whitespace-nowrap">
                                  {customerLabel(reservation)}
                                </div>
                                <div className="flex text-slate-500 text-xs whitespace-nowrap mt-0.5">
                                  {t(`service.${reservation.service}`)}
                                  <span className="ms-1">
                                    · {t(`staff.${reservation.staff}`)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </Table.Td>
                          <Table.Td className="py-4 border-dashed dark:bg-darkmode-600">
                            <Link
                              to={`/transaction-detail/${reservation.id}`}
                              className="flex items-center text-primary"
                              dir="ltr"
                            >
                              <Lucide
                                icon="ExternalLink"
                                className="w-3.5 h-3.5 stroke-[1.7]"
                                aria-hidden="true"
                              />
                              <span className="ms-1.5 text-[13px] whitespace-nowrap underline decoration-dotted decoration-primary/30 underline-offset-[3px]">
                                {reservation.id}
                              </span>
                            </Link>
                          </Table.Td>
                          <Table.Td className="py-4 border-dashed dark:bg-darkmode-600">
                            <div
                              className={`flex items-center ${status.className}`}
                            >
                              <Lucide
                                icon={status.icon}
                                className="w-3.5 h-3.5 stroke-[1.7]"
                                aria-hidden="true"
                              />
                              <span className="ms-1.5 whitespace-nowrap">
                                {t(`status.${reservation.status}`)}
                              </span>
                            </div>
                          </Table.Td>
                          <Table.Td className="py-4 border-dashed dark:bg-darkmode-600">
                            <div className="whitespace-nowrap">
                              {t(`source.${reservation.source}`)}
                            </div>
                          </Table.Td>
                          <Table.Td className="py-4 border-dashed dark:bg-darkmode-600">
                            <div className="whitespace-nowrap">
                              {formatDate(reservation.date, language)}
                            </div>
                            <div
                              className="text-xs text-slate-500 mt-0.5"
                              dir="ltr"
                            >
                              {reservation.time} · {t("duration", {
                                count: reservation.durationMinutes,
                              })}
                            </div>
                          </Table.Td>
                          <Table.Td className="relative py-4 border-dashed dark:bg-darkmode-600">
                            <div className="flex items-center justify-center">
                              <Link
                                to={`/transaction-detail/${reservation.id}`}
                                aria-label={t("table.view", {
                                  id: reservation.id,
                                })}
                                className="flex min-h-11 min-w-11 items-center justify-center text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                              >
                                <Lucide
                                  icon="MoreVertical"
                                  className="w-5 h-5 stroke-slate-400/70 fill-slate-400/70"
                                  aria-hidden="true"
                                />
                              </Link>
                            </div>
                          </Table.Td>
                        </Table.Tr>
                      );
                    })
                  )}
                </Table.Tbody>
              </Table>
            </div>

            <div className="flex flex-col-reverse flex-wrap items-center p-5 flex-reverse gap-y-2 sm:flex-row">
              <Pagination
                className="flex-1 w-full me-auto sm:w-auto"
                aria-label={t("list.title")}
              >
                <Pagination.Button
                  type="button"
                  disabled={safeCurrentPage === 1}
                  onClick={() => setCurrentPage(1)}
                  aria-label={t("pagination.first")}
                >
                  <Lucide icon="ChevronsLeft" className="w-4 h-4" />
                </Pagination.Button>
                <Pagination.Button
                  type="button"
                  disabled={safeCurrentPage === 1}
                  onClick={() =>
                    setCurrentPage(Math.max(1, safeCurrentPage - 1))
                  }
                  aria-label={t("pagination.previous")}
                >
                  <Lucide icon="ChevronLeft" className="w-4 h-4" />
                </Pagination.Button>
                {Array.from({ length: pageCount }, (_, index) => index + 1).map(
                  (page) => (
                    <Pagination.Button
                      type="button"
                      key={page}
                      active={page === safeCurrentPage}
                      onClick={() => setCurrentPage(page)}
                      aria-label={t("pagination.page", { page })}
                    >
                      {page}
                    </Pagination.Button>
                  ),
                )}
                <Pagination.Button
                  type="button"
                  disabled={safeCurrentPage === pageCount}
                  onClick={() =>
                    setCurrentPage(Math.min(pageCount, safeCurrentPage + 1))
                  }
                  aria-label={t("pagination.next")}
                >
                  <Lucide icon="ChevronRight" className="w-4 h-4" />
                </Pagination.Button>
                <Pagination.Button
                  type="button"
                  disabled={safeCurrentPage === pageCount}
                  onClick={() => setCurrentPage(pageCount)}
                  aria-label={t("pagination.last")}
                >
                  <Lucide icon="ChevronsRight" className="w-4 h-4" />
                </Pagination.Button>
              </Pagination>
              <FormLabel htmlFor={perPageId} className="sr-only">
                {t("pagination.perPage")}
              </FormLabel>
              <FormSelect
                id={perPageId}
                className="sm:w-20 rounded-[0.5rem]"
                value={perPage}
                onChange={(event) => {
                  setPerPage(Number(event.target.value));
                  setCurrentPage(1);
                }}
              >
                {[10, 25, 35, 50].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </FormSelect>
            </div>
          </section>
        </div>
      </div>

      <Dialog
        open={manualOpen}
        onClose={() => {
          setManualOpen(false);
          setFormError("");
        }}
        size="xl"
      >
        <Dialog.Panel as="section">
          <Dialog.Title as="h2" id={`${formId}-title`}>
            <span>{t("manual.title")}</span>
            <button
              type="button"
              className="ms-auto flex min-h-11 min-w-11 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:hover:bg-darkmode-700"
              aria-label={t("list.closeForm")}
              onClick={() => {
                setManualOpen(false);
                setFormError("");
              }}
            >
              <Lucide icon="X" className="w-5 h-5" aria-hidden="true" />
            </button>
          </Dialog.Title>
          <Dialog.Description>
            <p className="leading-relaxed text-slate-500">
              {t("manual.description")}
            </p>
            <p className="mt-2 text-xs text-slate-500">
              {t("manual.requiredHint")}
            </p>
            <form className="mt-5" onSubmit={handleCreate}>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="xl:col-span-2">
                  <FormLabel htmlFor={`${formId}-name`}>
                    {t("manual.name")}
                  </FormLabel>
                  <FormInput
                    id={`${formId}-name`}
                    value={manualForm.name}
                    onChange={(event) =>
                      setManualForm((current) => ({
                        ...current,
                        name: event.target.value,
                      }))
                    }
                    placeholder={t("manual.namePlaceholder")}
                    autoComplete="name"
                    required
                  />
                </div>
                <div className="xl:col-span-2">
                  <FormLabel htmlFor={`${formId}-phone`}>
                    {t("manual.phone")}
                  </FormLabel>
                  <FormInput
                    id={`${formId}-phone`}
                    type="tel"
                    inputMode="tel"
                    dir="ltr"
                    className="text-start"
                    value={manualForm.phone}
                    onChange={(event) =>
                      setManualForm((current) => ({
                        ...current,
                        phone: event.target.value,
                      }))
                    }
                    placeholder={t("manual.phonePlaceholder")}
                    autoComplete="tel"
                    required
                  />
                </div>
                <div>
                  <FormLabel htmlFor={`${formId}-service`}>
                    {t("manual.service")}
                  </FormLabel>
                  <FormSelect
                    id={`${formId}-service`}
                    value={manualForm.service}
                    onChange={(event) =>
                      setManualForm((current) => ({
                        ...current,
                        service: event.target.value as ServiceKey,
                      }))
                    }
                    required
                  >
                    {serviceOptions.map((service) => (
                      <option key={service} value={service}>
                        {t(`service.${service}`)}
                      </option>
                    ))}
                  </FormSelect>
                </div>
                <div>
                  <FormLabel htmlFor={`${formId}-staff`}>
                    {t("manual.staff")}
                  </FormLabel>
                  <FormSelect
                    id={`${formId}-staff`}
                    value={manualForm.staff}
                    onChange={(event) =>
                      setManualForm((current) => ({
                        ...current,
                        staff: event.target.value as StaffKey,
                      }))
                    }
                    required
                  >
                    {staffOptions.map((staff) => (
                      <option key={staff} value={staff}>
                        {t(`staff.${staff}`)}
                      </option>
                    ))}
                  </FormSelect>
                </div>
                <div>
                  <FormLabel htmlFor={`${formId}-date`}>
                    {t("manual.date")}
                  </FormLabel>
                  <FormInput
                    id={`${formId}-date`}
                    type="date"
                    dir="ltr"
                    className="text-start"
                    min={todayAsLocalIso()}
                    value={manualForm.date}
                    onChange={(event) =>
                      setManualForm((current) => ({
                        ...current,
                        date: event.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div>
                  <FormLabel htmlFor={`${formId}-time`}>
                    {t("manual.time")}
                  </FormLabel>
                  <FormInput
                    id={`${formId}-time`}
                    type="time"
                    dir="ltr"
                    className="text-start"
                    value={manualForm.time}
                    onChange={(event) =>
                      setManualForm((current) => ({
                        ...current,
                        time: event.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className="md:col-span-2 xl:col-span-4">
                  <FormLabel htmlFor={`${formId}-note`}>
                    {t("manual.note")}
                  </FormLabel>
                  <FormTextarea
                    id={`${formId}-note`}
                    rows={3}
                    value={manualForm.note}
                    onChange={(event) =>
                      setManualForm((current) => ({
                        ...current,
                        note: event.target.value,
                      }))
                    }
                    placeholder={t("manual.notePlaceholder")}
                  />
                </div>
              </div>

              {formError && (
                <p
                  className="mt-4 px-4 py-3 border rounded-[0.6rem] border-danger/30 bg-danger/5 text-danger"
                  role="alert"
                >
                  {formError}
                </p>
              )}

              <div className="flex flex-col-reverse gap-3 pt-5 mt-5 -mx-5 -mb-5 px-5 border-t sm:flex-row sm:justify-end border-slate-200/80">
                <Button
                  type="button"
                  variant="outline-secondary"
                  onClick={() => {
                    setManualOpen(false);
                    setFormError("");
                  }}
                >
                  {t("manual.cancel")}
                </Button>
                <Button type="submit" variant="primary">
                  <Lucide
                    icon="CalendarCheck2"
                    className="w-4 h-4 me-2"
                    aria-hidden="true"
                  />
                  {t("manual.submit")}
                </Button>
              </div>
            </form>
          </Dialog.Description>
        </Dialog.Panel>
      </Dialog>
    </div>
  );
}

export default ReservationListPage;
