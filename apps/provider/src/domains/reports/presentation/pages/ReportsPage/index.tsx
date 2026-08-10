import { useState } from "react";
import { useTranslation } from "react-i18next";
import { reportsNamespace } from "@/domains/reports/i18n";
import { FormSelect } from "@/shared/ui/components/Base/Form";
import Progress from "@/shared/ui/components/Base/Progress";

type Period = "7" | "30";

const reportData = {
  "7": {
    volume: 42,
    approved: 34,
    cancelled: 5,
    noShow: 3,
    sources: { online: 24, manual: 12, voice: 6 },
    performance: { serviceA: 18, serviceB: 11, teamMember: 22 },
    conversion: { publicLink: [118, 24], qrLink: [46, 9] },
  },
  "30": {
    volume: 184,
    approved: 151,
    cancelled: 20,
    noShow: 13,
    sources: { online: 107, manual: 51, voice: 26 },
    performance: { serviceA: 76, serviceB: 49, teamMember: 91 },
    conversion: { publicLink: [502, 103], qrLink: [211, 43] },
  },
} as const;

interface ProgressRowProps {
  label: string;
  value: number;
  max: number;
  valueLabel: string;
}

function ProgressRow({ label, value, max, valueLabel }: ProgressRowProps) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-4 text-sm">
        <span>{label}</span>
        <span className="font-medium" dir="ltr">{valueLabel}</span>
      </div>
      <Progress
        value={value}
        max={max}
        className="h-2 bg-slate-200 dark:bg-darkmode-400"
        aria-label={`${label}: ${valueLabel}`}
      >
        <Progress.Bar style={{ width: `${Math.min(100, (value / max) * 100)}%` }} />
      </Progress>
    </div>
  );
}

function ReportsPage() {
  const { t } = useTranslation(reportsNamespace);
  const [period, setPeriod] = useState<Period>("7");
  const data = reportData[period];

  const summaryCards = [
    ["volume", data.volume],
    ["approved", data.approved],
    ["cancelled", data.cancelled],
    ["noShow", data.noShow],
  ] as const;

  return (
    <section
      className="grid grid-cols-12 gap-x-6 gap-y-10"
      aria-labelledby="reports-title"
    >
      <div className="col-span-12">
        <div className="flex flex-col gap-y-3 md:h-10 md:flex-row md:items-center">
          <h1
            id="reports-title"
            className="text-base font-medium group-[.mode--light]:text-white"
          >
            {t("title")}
          </h1>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center md:ms-auto">
            <label
              htmlFor="reports-period"
              className="text-sm group-[.mode--light]:text-slate-200"
            >
              {t("period")}
            </label>
            <FormSelect
              id="reports-period"
              className="sm:w-44 group-[.mode--light]:border-transparent group-[.mode--light]:bg-white/[0.12] group-[.mode--light]:text-slate-200"
              value={period}
              onChange={(event) => setPeriod(event.target.value as Period)}
            >
              <option value="7">{t("last7")}</option>
              <option value="30">{t("last30")}</option>
            </FormSelect>
          </div>
        </div>

        <div className="mt-3.5 flex flex-col gap-7">
          <section className="box box--stacked p-5">
            <div className="border-b border-dashed border-slate-300/70 pb-5 font-medium">
              {t("eyebrow")}
            </div>
            <p className="mt-5 max-w-3xl text-sm leading-relaxed text-slate-500">
              {t("description")}
            </p>
            <p
              className="mt-4 rounded-[0.6rem] border border-primary/20 bg-primary/5 p-4 text-sm"
              role="note"
            >
              {t("sampleData")}
            </p>
          </section>

      <section className="grid grid-cols-4 gap-5" aria-label={t("outcomesTitle")}>
        {summaryCards.map(([labelKey, value]) => (
          <article key={labelKey} className="box col-span-4 rounded-[0.6rem] border border-dashed border-slate-300/80 p-5 shadow-sm md:col-span-2 xl:col-span-1">
            <p className="text-base text-slate-500">{t(labelKey)}</p>
            <p className="mt-1.5 text-2xl font-medium" dir="ltr">{value}</p>
          </article>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="box box--stacked p-5" aria-labelledby="sources-title">
          <h2 id="sources-title" className="border-b border-dashed border-slate-300/70 pb-5 font-medium">{t("sourcesTitle")}</h2>
          <div className="mt-5 space-y-5">
            {(["online", "manual", "voice"] as const).map((key) => (
              <ProgressRow key={key} label={t(key)} value={data.sources[key]} max={data.volume} valueLabel={String(data.sources[key])} />
            ))}
          </div>
        </section>

        <section className="box box--stacked p-5" aria-labelledby="performance-title">
          <h2 id="performance-title" className="border-b border-dashed border-slate-300/70 pb-5 font-medium">{t("performanceTitle")}</h2>
          <div className="mt-5 space-y-5">
            {(["serviceA", "serviceB", "teamMember"] as const).map((key) => (
              <ProgressRow
                key={key}
                label={t(key)}
                value={data.performance[key]}
                max={data.volume}
                valueLabel={t("completedBookings", { count: data.performance[key] })}
              />
            ))}
          </div>
        </section>
      </div>

      <section className="box box--stacked p-5" aria-labelledby="conversion-title">
        <h2 id="conversion-title" className="border-b border-dashed border-slate-300/70 pb-5 font-medium">{t("conversionTitle")}</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {(["publicLink", "qrLink"] as const).map((key) => {
            const [visits, bookings] = data.conversion[key];
            return (
              <ProgressRow
                key={key}
                label={t(key)}
                value={bookings}
                max={visits}
                valueLabel={t("conversions", { visits, bookings })}
              />
            );
          })}
        </div>
      </section>

      <aside className="box box--stacked border border-warning/20 bg-warning/5 p-5" aria-labelledby="advanced-reports-title">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 id="advanced-reports-title" className="font-medium">{t("advancedTitle")}</h2>
            <p className="mt-2 max-w-4xl text-sm leading-relaxed text-slate-500">{t("advancedBody")}</p>
          </div>
          <span className="inline-flex min-h-10 shrink-0 items-center rounded-full border border-warning/30 px-4 text-xs font-medium text-warning">{t("entitlementPending")}</span>
        </div>
      </aside>
        </div>
      </div>
    </section>
  );
}

export default ReportsPage;
