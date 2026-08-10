import { useMemo, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import {
  defaultWeeklyAvailability,
  findExceptionConflicts,
  findWeeklyConflicts,
  type AvailabilityException,
  type DayAvailability,
} from "@/domains/availability/model/availability";
import { availabilityNamespace } from "@/domains/availability/i18n";
import { normalizeLanguage, type AppLanguage } from "@/shared/i18n";
import Button from "@/shared/ui/components/Base/Button";
import { FormInput, FormLabel, FormSelect } from "@/shared/ui/components/Base/Form";
import Lucide from "@/shared/ui/components/Base/Lucide";

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

const localIsoDate = (offset = 0) => {
  const value = new Date();
  value.setHours(12, 0, 0, 0);
  value.setDate(value.getDate() + offset);
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatDate = (date: string, language: AppLanguage) =>
  new Intl.DateTimeFormat(localeByLanguage[language], {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(`${date}T12:00:00`));

type ExceptionDraft = {
  date: string;
  type: "closed" | "custom";
  start: string;
  end: string;
};

const initialExceptionDraft = (): ExceptionDraft => ({
  date: localIsoDate(7),
  type: "closed",
  start: "10:00",
  end: "16:00",
});

const showDemonstrationAvailability =
  import.meta.env.DEV || import.meta.env.MODE === "test";

const initialWeeklyAvailability = () =>
  defaultWeeklyAvailability.map((day) => ({
    ...day,
    enabled: showDemonstrationAvailability ? day.enabled : false,
  }));

const initialExceptions = (): AvailabilityException[] =>
  showDemonstrationAvailability
    ? [{ id: "exception-1", date: localIsoDate(10), type: "closed" }]
    : [];

function AvailabilityPage() {
  const { t, i18n } = useTranslation(availabilityNamespace);
  const language = normalizeLanguage(i18n.resolvedLanguage ?? i18n.language);
  const [weekly, setWeekly] = useState<DayAvailability[]>(
    initialWeeklyAvailability,
  );
  const [minimumNotice, setMinimumNotice] = useState("2");
  const [maximumAdvance, setMaximumAdvance] = useState("30");
  const [slotInterval, setSlotInterval] = useState("30");
  const [exceptions, setExceptions] = useState<AvailabilityException[]>(
    initialExceptions,
  );
  const [exceptionDraft, setExceptionDraft] = useState<ExceptionDraft>(
    initialExceptionDraft,
  );
  const [exceptionError, setExceptionError] = useState("");
  const [feedback, setFeedback] = useState("");

  const weeklyConflictDays = useMemo(
    () => findWeeklyConflicts(weekly),
    [weekly],
  );
  const exceptionConflictIds = useMemo(
    () => findExceptionConflicts(exceptions),
    [exceptions],
  );
  const hasConflicts =
    weeklyConflictDays.length > 0 || exceptionConflictIds.length > 0;

  const markChanged = () => setFeedback("");

  const updateDay = (
    index: number,
    update: Partial<DayAvailability>,
  ) => {
    setWeekly((current) =>
      current.map((day, dayIndex) =>
        dayIndex === index ? { ...day, ...update } : day,
      ),
    );
    markChanged();
  };

  const addException = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback("");
    if (exceptions.some(({ date }) => date === exceptionDraft.date)) {
      setExceptionError(t("exceptions.duplicate"));
      return;
    }
    if (
      exceptionDraft.type === "custom" &&
      exceptionDraft.start >= exceptionDraft.end
    ) {
      setExceptionError(
        t("conflicts.exception", {
          date: formatDate(exceptionDraft.date, language),
        }),
      );
      return;
    }

    const nextExceptionNumber = exceptions.reduce((highest, exception) => {
      const numericId = Number(exception.id.replace("exception-", ""));
      return Number.isFinite(numericId) ? Math.max(highest, numericId) : highest;
    }, 0) + 1;
    const nextException: AvailabilityException = {
      id: `exception-${nextExceptionNumber}`,
      date: exceptionDraft.date,
      type: exceptionDraft.type,
      ...(exceptionDraft.type === "custom"
        ? { start: exceptionDraft.start, end: exceptionDraft.end }
        : {}),
    };
    setExceptions((current) => [...current, nextException]);
    setExceptionDraft(initialExceptionDraft());
    setExceptionError("");
    setFeedback(t("exceptions.added"));
  };

  const removeException = (id: string) => {
    setExceptions((current) => current.filter((exception) => exception.id !== id));
    setExceptionError("");
    markChanged();
  };

  return (
    <div className="grid grid-cols-12 gap-x-6 gap-y-10">
      <div className="col-span-12">
        <header className="flex flex-col gap-y-3 md:h-10 md:flex-row md:items-center">
          <h1 className="text-base font-medium group-[.mode--light]:text-white">
            {t("page.title")}
          </h1>
          <div className="flex flex-col gap-x-3 gap-y-2 sm:flex-row md:ms-auto">
            <Button
              type="button"
              variant="primary"
              className="gap-2 group-[.mode--light]:!border-transparent group-[.mode--light]:!bg-white/[0.12] group-[.mode--light]:!text-slate-200"
              disabled={hasConflicts}
              onClick={() => setFeedback(t("page.saved"))}
            >
              <Lucide icon="Check" className="h-4 w-4 stroke-[1.3]" aria-hidden="true" />
              {t("page.save")}
            </Button>
          </div>
        </header>

        <div className="mt-3.5 flex flex-col gap-7 pb-8">
          <section className="box box--stacked p-5">
            <div className="border-b border-dashed border-slate-300/70 pb-5 font-medium">
              {t("page.title")}
            </div>
            <p className="mt-5 max-w-3xl text-sm leading-relaxed text-slate-500">
              {t("page.subtitle")}
            </p>
          </section>

      {feedback && (
        <div
          className="rounded-[0.6rem] border border-success/20 bg-success/5 p-4 text-success"
          aria-live="polite"
          role="status"
        >
          {feedback}
        </div>
      )}

      <section
        aria-labelledby="conflict-check-title"
        className={`rounded-[0.6rem] border p-4 ${
          hasConflicts
            ? "border-danger/20 bg-danger/5 text-danger"
            : "border-success/20 bg-success/5 text-success"
        }`}
        role={hasConflicts ? "alert" : "status"}
      >
        <div className="flex items-start gap-3">
          <Lucide
            icon={hasConflicts ? "AlertTriangle" : "CheckSquare"}
            className="mt-0.5 h-6 w-6"
            aria-hidden="true"
          />
          <div>
            <h2 id="conflict-check-title" className="font-medium">
              {t("conflicts.title")}
            </h2>
            {hasConflicts ? (
              <>
                <p className="mt-1 text-sm">{t("conflicts.warning")}</p>
                <ul className="mt-2 list-disc space-y-1 ps-5 text-sm">
                  {weeklyConflictDays.map((day) => (
                    <li key={day}>
                      {t("conflicts.weekly", { day: t(`day.${day}`) })}
                    </li>
                  ))}
                  {exceptionConflictIds.map((exceptionId) => {
                    const exception = exceptions.find(({ id }) => id === exceptionId);
                    return exception ? (
                      <li key={exceptionId}>
                        {t("conflicts.exception", {
                          date: formatDate(exception.date, language),
                        })}
                      </li>
                    ) : null;
                  })}
                </ul>
              </>
            ) : (
              <p className="mt-1 text-sm">{t("conflicts.clear")}</p>
            )}
          </div>
        </div>
      </section>

      <fieldset className="box box--stacked p-5">
        <legend className="sr-only">{t("weekly.title")}</legend>
        <h2 className="border-b border-dashed border-slate-300/70 pb-5 font-medium">{t("weekly.title")}</h2>
        <p className="mt-5 text-sm leading-relaxed text-slate-500">
          {t("weekly.description")}
        </p>
        <div className="mt-5 divide-y divide-slate-200/60 dark:divide-darkmode-400">
          {weekly.map((day, index) => {
            const dayNameId = `availability-${day.day}-name`;
            const stateId = `availability-${day.day}-state`;
            const startLabelId = `availability-${day.day}-start-label`;
            const endLabelId = `availability-${day.day}-end-label`;
            return (
              <div
                key={day.day}
                className="grid gap-3 py-4 first:pt-0 last:pb-0 sm:grid-cols-[minmax(8rem,1fr)_minmax(9rem,auto)_minmax(9rem,1fr)_minmax(9rem,1fr)] sm:items-end"
              >
                <div id={dayNameId} className="self-center font-medium">
                  {t(`day.${day.day}`)}
                </div>
                <label className="flex min-h-10 cursor-pointer items-center gap-3 rounded-[0.5rem] px-2 text-sm focus-within:ring-4 focus-within:ring-primary/20">
                  <input
                    type="checkbox"
                    className="h-5 w-5 rounded border-slate-300 text-primary focus:ring-0"
                    checked={day.enabled}
                    aria-labelledby={`${dayNameId} ${stateId}`}
                    onChange={(event) =>
                      updateDay(index, { enabled: event.target.checked })
                    }
                  />
                  <span id={stateId}>
                    {day.enabled ? t("weekly.open") : t("weekly.closed")}
                  </span>
                </label>
                <div>
                  <FormLabel
                    id={startLabelId}
                    htmlFor={`availability-${day.day}-start`}
                  >
                    {t("weekly.start")}
                  </FormLabel>
                  <FormInput
                    id={`availability-${day.day}-start`}
                    type="time"
                    dir="ltr"
                    className="text-start"
                    value={day.start}
                    disabled={!day.enabled}
                    aria-labelledby={`${dayNameId} ${startLabelId}`}
                    onChange={(event) =>
                      updateDay(index, { start: event.target.value })
                    }
                  />
                </div>
                <div>
                  <FormLabel
                    id={endLabelId}
                    htmlFor={`availability-${day.day}-end`}
                  >
                    {t("weekly.end")}
                  </FormLabel>
                  <FormInput
                    id={`availability-${day.day}-end`}
                    type="time"
                    dir="ltr"
                    className="text-start"
                    value={day.end}
                    disabled={!day.enabled}
                    aria-labelledby={`${dayNameId} ${endLabelId}`}
                    onChange={(event) =>
                      updateDay(index, { end: event.target.value })
                    }
                  />
                </div>
              </div>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="box box--stacked p-5">
        <legend className="sr-only">{t("windows.title")}</legend>
        <h2 className="border-b border-dashed border-slate-300/70 pb-5 font-medium">{t("windows.title")}</h2>
        <p className="mt-5 text-sm leading-relaxed text-slate-500">
          {t("windows.description")}
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div>
            <FormLabel htmlFor="minimum-booking-notice">{t("windows.notice")}</FormLabel>
            <FormSelect
              id="minimum-booking-notice"
              value={minimumNotice}
              onChange={(event) => {
                setMinimumNotice(event.target.value);
                markChanged();
              }}
            >
              <option value="0">{t("windows.noticeNow")}</option>
              {[2, 4, 24].map((hours) => (
                <option key={hours} value={hours}>{t("windows.hours", { count: hours })}</option>
              ))}
            </FormSelect>
          </div>
          <div>
            <FormLabel htmlFor="maximum-advance-booking">{t("windows.advance")}</FormLabel>
            <FormSelect
              id="maximum-advance-booking"
              value={maximumAdvance}
              onChange={(event) => {
                setMaximumAdvance(event.target.value);
                markChanged();
              }}
            >
              {[14, 30, 60, 90].map((days) => (
                <option key={days} value={days}>{t("windows.days", { count: days })}</option>
              ))}
            </FormSelect>
          </div>
          <div>
            <FormLabel htmlFor="booking-slot-interval">{t("windows.interval")}</FormLabel>
            <FormSelect
              id="booking-slot-interval"
              value={slotInterval}
              onChange={(event) => {
                setSlotInterval(event.target.value);
                markChanged();
              }}
            >
              {[15, 30, 60].map((minutes) => (
                <option key={minutes} value={minutes}>{t("windows.minutes", { count: minutes })}</option>
              ))}
            </FormSelect>
          </div>
        </div>
      </fieldset>

      <section aria-labelledby="calendar-exceptions-title" className="box box--stacked p-5">
        <h2 id="calendar-exceptions-title" className="border-b border-dashed border-slate-300/70 pb-5 font-medium">{t("exceptions.title")}</h2>
        <p className="mt-5 text-sm leading-relaxed text-slate-500">
          {t("exceptions.description")}
        </p>

        <form className="mt-5" onSubmit={addException}>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1fr_1fr_0.8fr_0.8fr_auto] xl:items-end">
            <div>
              <FormLabel htmlFor="exception-date">{t("exceptions.date")}</FormLabel>
              <FormInput
                id="exception-date"
                type="date"
                dir="ltr"
                className="text-start"
                min={localIsoDate()}
                value={exceptionDraft.date}
                onChange={(event) => {
                  setExceptionDraft((current) => ({ ...current, date: event.target.value }));
                  setExceptionError("");
                }}
                required
              />
            </div>
            <div>
              <FormLabel htmlFor="exception-type">{t("exceptions.type")}</FormLabel>
              <FormSelect
                id="exception-type"
                value={exceptionDraft.type}
                onChange={(event) => {
                  setExceptionDraft((current) => ({
                    ...current,
                    type: event.target.value as "closed" | "custom",
                  }));
                  setExceptionError("");
                }}
              >
                <option value="closed">{t("exceptions.fullClosure")}</option>
                <option value="custom">{t("exceptions.customHours")}</option>
              </FormSelect>
            </div>
            <div>
              <FormLabel htmlFor="exception-start">{t("exceptions.start")}</FormLabel>
              <FormInput
                id="exception-start"
                type="time"
                dir="ltr"
                className="text-start"
                value={exceptionDraft.start}
                disabled={exceptionDraft.type === "closed"}
                onChange={(event) => {
                  setExceptionDraft((current) => ({ ...current, start: event.target.value }));
                  setExceptionError("");
                }}
                required={exceptionDraft.type === "custom"}
              />
            </div>
            <div>
              <FormLabel htmlFor="exception-end">{t("exceptions.end")}</FormLabel>
              <FormInput
                id="exception-end"
                type="time"
                dir="ltr"
                className="text-start"
                value={exceptionDraft.end}
                disabled={exceptionDraft.type === "closed"}
                onChange={(event) => {
                  setExceptionDraft((current) => ({ ...current, end: event.target.value }));
                  setExceptionError("");
                }}
                required={exceptionDraft.type === "custom"}
              />
            </div>
            <Button type="submit" variant="outline-primary" className="gap-2">
              <Lucide icon="Plus" className="h-4 w-4 stroke-[1.3]" aria-hidden="true" />
              {t("exceptions.add")}
            </Button>
          </div>
          {exceptionError && (
            <p className="mt-4 rounded-[0.5rem] border border-danger/20 bg-danger/5 p-3 text-sm text-danger" role="alert">
              {exceptionError}
            </p>
          )}
        </form>

        <div className="mt-6 border-t border-slate-200/60 pt-5 dark:border-darkmode-400">
          {exceptions.length === 0 ? (
            <p className="rounded-[0.5rem] bg-slate-50 p-4 text-sm text-slate-500 dark:bg-darkmode-400">
              {t("exceptions.empty")}
            </p>
          ) : (
            <ul className="space-y-3">
              {exceptions.map((exception) => {
                const formattedDate = formatDate(exception.date, language);
                return (
                  <li
                    key={exception.id}
                    className="flex flex-col gap-3 rounded-[0.6rem] border border-slate-200/60 p-4 dark:border-darkmode-400 sm:flex-row sm:items-center"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Lucide icon="Calendar" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{formattedDate}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {exception.type === "closed"
                          ? t("exceptions.fullClosure")
                          : `${t("exceptions.customHours")} · ${exception.start}–${exception.end}`}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="inline-flex min-h-10 min-w-10 items-center justify-center self-end rounded-[0.5rem] text-danger hover:bg-danger/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-danger/20 sm:self-auto"
                      aria-label={t("exceptions.remove", { date: formattedDate })}
                      onClick={() => removeException(exception.id)}
                    >
                      <Lucide icon="Trash2" aria-hidden="true" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>
        </div>
      </div>
    </div>
  );
}

export default AvailabilityPage;
