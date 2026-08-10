import { useState } from "react";
import { useTranslation } from "react-i18next";
import { voiceBookingNamespace } from "@/domains/voice-booking/i18n";
import Button from "@/shared/ui/components/Base/Button";
import { FormCheck, FormSelect } from "@/shared/ui/components/Base/Form";

const historyRows = [
  { reference: "CALL-DEMO-001", time: "09:20", confidenceKey: "low" },
  { reference: "CALL-DEMO-002", time: "11:05", confidenceKey: "medium" },
] as const;

function VoiceBookingPage() {
  const { t } = useTranslation(voiceBookingNamespace);
  const [notifyInApp, setNotifyInApp] = useState(true);
  const [connectionFeedback, setConnectionFeedback] = useState("");
  const [saveFeedback, setSaveFeedback] = useState("");

  return (
    <section
      className="grid grid-cols-12 gap-x-6 gap-y-10"
      aria-labelledby="voice-booking-title"
    >
      <div className="col-span-12">
        <div className="flex flex-col gap-y-3 md:h-10 md:flex-row md:items-center">
          <h1
            id="voice-booking-title"
            className="text-base font-medium group-[.mode--light]:text-white"
          >
            {t("title")}
          </h1>
        </div>

        <div className="mt-3.5 flex flex-col gap-7">
      <aside className="box box--stacked p-5">
        <div className="mb-5 border-b border-dashed border-slate-300/70 pb-5">
          <div className="font-medium">{t("eyebrow")}</div>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-500">
            {t("description")}
          </p>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-medium">{t("boundaryTitle")}</h2>
            <p className="mt-1 max-w-3xl text-sm leading-relaxed text-slate-500">{t("boundaryBody")}</p>
          </div>
          <span className="inline-flex min-h-10 shrink-0 items-center rounded-full border border-slate-300/80 bg-slate-50 px-4 text-xs font-medium text-slate-500 dark:border-darkmode-400 dark:bg-darkmode-400">
            {t("disconnected")}
          </span>
        </div>
        <div className="mt-4 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <Button type="button" variant="outline-primary" onClick={() => setConnectionFeedback(t("checkResult"))}>
            {t("checkConnection")}
          </Button>
          <span className="min-h-6 text-xs text-slate-500" role="status" aria-live="polite">{connectionFeedback}</span>
        </div>
      </aside>

      <section className="box box--stacked p-5" aria-labelledby="voice-policy-title">
        <h2 id="voice-policy-title" className="border-b border-dashed border-slate-300/70 pb-5 font-medium">{t("policyTitle")}</h2>
        <ul className="mt-5 grid gap-3 text-sm text-slate-500 lg:grid-cols-3">
          {["activeServices", "availabilityRules", "approvalRules"].map((key) => (
            <li key={key} className="rounded-[0.6rem] border border-slate-200/60 bg-slate-50 p-4 dark:border-darkmode-400 dark:bg-darkmode-400">{t(key)}</li>
          ))}
        </ul>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <div>
            <label className="block font-medium" htmlFor="voice-fallback">{t("fallbackLabel")}</label>
            <FormSelect id="voice-fallback" className="mt-2" value="manual-review" disabled>
              <option value="manual-review">{t("manualReview")}</option>
            </FormSelect>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">{t("fallbackHelp")}</p>
          </div>
          <FormCheck className="min-h-10 self-center">
            <FormCheck.Input
              id="voice-review-alert"
              type="checkbox"
              checked={notifyInApp}
              onChange={(event) => {
                setNotifyInApp(event.target.checked);
                setSaveFeedback("");
              }}
            />
            <FormCheck.Label htmlFor="voice-review-alert" className="inline-flex min-h-10 items-center text-sm">
              {t("notifyLabel")}
            </FormCheck.Label>
          </FormCheck>
        </div>

        <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-end">
          <span className="min-h-6 text-sm text-primary" role="status" aria-live="polite">{saveFeedback}</span>
          <Button type="button" variant="primary" onClick={() => setSaveFeedback(t("saved"))}>{t("save")}</Button>
        </div>
      </section>

      <section className="box box--stacked flex flex-col" aria-labelledby="voice-history-title">
        <div className="flex flex-col gap-1 p-5 sm:flex-row sm:items-end sm:justify-between">
          <h2 id="voice-history-title" className="font-medium">{t("historyTitle")}</h2>
          <p className="text-xs text-slate-500">{t("demoNotice")}</p>
        </div>
        <div
          className="overflow-auto xl:overflow-visible focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          role="region"
          aria-label={t("historyTitle")}
          tabIndex={0}
        >
          <table className="w-full min-w-[620px]">
            <caption className="sr-only">{t("historyTitle")}</caption>
            <thead>
              <tr>
                {["reference", "received", "confidence", "outcome"].map((key) => (
                  <th key={key} scope="col" className="border-b border-t border-slate-200/60 bg-slate-50 px-5 py-4 text-start font-medium text-slate-500 dark:border-darkmode-400 dark:bg-darkmode-400">{t(key)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {historyRows.map((row) => (
                <tr key={row.reference} className="border-b border-slate-200/60 dark:border-darkmode-400">
                  <th scope="row" className="px-5 py-4 text-start text-xs font-medium" dir="ltr">{row.reference}</th>
                  <td className="px-5 py-4 text-xs"><span>{t("today")}</span> <span dir="ltr">{row.time}</span></td>
                  <td className="px-5 py-4 text-sm">{t(row.confidenceKey)}</td>
                  <td className="px-5 py-4 text-sm">{t("needsReview")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
        </div>
      </div>
    </section>
  );
}

export default VoiceBookingPage;
