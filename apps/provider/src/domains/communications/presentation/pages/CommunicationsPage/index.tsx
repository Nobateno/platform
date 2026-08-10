import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { communicationsNamespace } from "@/domains/communications/i18n";
import Button from "@/shared/ui/components/Base/Button";
import { FormCheck, FormSelect } from "@/shared/ui/components/Base/Form";

type Channel = "inApp" | "sms";
type RuleId = "reminder24" | "reminder1" | "staffAlert";

interface MessageRule {
  id: RuleId;
  titleKey: "reminder24Title" | "reminder1Title" | "staffAlertTitle";
  bodyKey: "reminder24Body" | "reminder1Body" | "staffAlertBody";
  enabled: boolean;
  channel: Channel;
}

const initialRules: MessageRule[] = [
  { id: "reminder24", titleKey: "reminder24Title", bodyKey: "reminder24Body", enabled: true, channel: "sms" },
  { id: "reminder1", titleKey: "reminder1Title", bodyKey: "reminder1Body", enabled: false, channel: "sms" },
  { id: "staffAlert", titleKey: "staffAlertTitle", bodyKey: "staffAlertBody", enabled: true, channel: "inApp" },
];

const deliveryRows = [
  { eventKey: "bookingApproved", reference: "BOOKING-DEMO-01", channelKey: "inApp", statusKey: "delivered", time: "09:00" },
  { eventKey: "reminderPreview", reference: "BOOKING-DEMO-02", channelKey: "sms", statusKey: "previewOnly", time: "10:30" },
  { eventKey: "staffAlert", reference: "BOOKING-DEMO-03", channelKey: "inApp", statusKey: "queued", time: "11:15" },
] as const;

function CommunicationsPage() {
  const { t } = useTranslation(communicationsNamespace);
  const [rules, setRules] = useState(initialRules);
  const [feedback, setFeedback] = useState("");

  const enabledSmsRules = useMemo(
    () => rules.filter((rule) => rule.enabled && rule.channel === "sms").length,
    [rules],
  );

  const updateRule = (id: RuleId, patch: Partial<Pick<MessageRule, "enabled" | "channel">>) => {
    setRules((current) => current.map((rule) => rule.id === id ? { ...rule, ...patch } : rule));
    setFeedback("");
  };

  return (
    <section
      className="grid grid-cols-12 gap-x-6 gap-y-10"
      aria-labelledby="communications-title"
    >
      <div className="col-span-12">
        <div className="flex flex-col gap-y-3 md:h-10 md:flex-row md:items-center">
          <h1
            id="communications-title"
            className="text-base font-medium group-[.mode--light]:text-white"
          >
            {t("title")}
          </h1>
        </div>

        <div className="mt-3.5 flex flex-col gap-7">
      <aside className="box box--stacked p-5">
        <div className="border-b border-dashed border-slate-300/70 pb-5 font-medium">
          {t("eyebrow")}
        </div>
        <p className="mt-5 max-w-3xl text-sm leading-relaxed text-slate-500">
          {t("description")}
        </p>
        <div className="mt-4 rounded-[0.6rem] border border-primary/20 bg-primary/5 p-4">
          <h2 className="font-medium">{t("boundaryTitle")}</h2>
          <p className="mt-1 text-sm leading-relaxed text-slate-500">{t("boundaryBody")}</p>
        </div>
      </aside>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.65fr)]">
        <section className="box box--stacked p-5" aria-labelledby="message-rules-title">
          <h2 id="message-rules-title" className="border-b border-dashed border-slate-300/70 pb-5 font-medium">{t("rulesTitle")}</h2>
          <div className="mt-5 space-y-3">
            {rules.map((rule) => {
              const title = t(rule.titleKey);
              return (
                <article key={rule.id} className="rounded-[0.6rem] border border-slate-200/60 p-4 dark:border-darkmode-400">
                  <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_13rem] sm:items-center">
                    <div>
                      <FormCheck className="min-h-10">
                        <FormCheck.Input
                          id={`${rule.id}-enabled`}
                          type="checkbox"
                          checked={rule.enabled}
                          onChange={(event) => updateRule(rule.id, { enabled: event.target.checked })}
                        />
                        <FormCheck.Label htmlFor={`${rule.id}-enabled`} className="inline-flex min-h-10 items-center font-medium">
                          {title}
                        </FormCheck.Label>
                      </FormCheck>
                      <p className="ms-7 text-xs leading-relaxed text-slate-500">{t(rule.bodyKey)}</p>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500" htmlFor={`${rule.id}-channel`}>
                        {t("channel")}
                      </label>
                      <FormSelect
                        id={`${rule.id}-channel`}
                        className="mt-1"
                        value={rule.channel}
                        aria-label={t("channelLabel", { rule: title })}
                        onChange={(event) => updateRule(rule.id, { channel: event.target.value as Channel })}
                      >
                        <option value="inApp">{t("inApp")}</option>
                        <option value="sms">{t("sms")}</option>
                      </FormSelect>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          <div className="mt-5 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-end">
            <span className="min-h-6 text-sm" aria-live="polite">{feedback}</span>
            <Button type="button" variant="primary" onClick={() => setFeedback(t("saved"))}>
              {t("save")}
            </Button>
          </div>
        </section>

        <aside className="box box--stacked p-5" aria-labelledby="token-preview-title">
          <h2 id="token-preview-title" className="border-b border-dashed border-slate-300/70 pb-5 font-medium">{t("tokenPreviewTitle")}</h2>
          <p className="mt-5 font-medium" aria-live="polite">
            {enabledSmsRules > 0
              ? t("quoteRequired", { count: enabledSmsRules })
              : t("noTokenRules")}
          </p>
          <p className="mt-4 text-xs leading-relaxed text-slate-500">{t("balanceUnavailable")}</p>
          <p className="mt-2 text-xs leading-relaxed text-slate-500">{t("noSpend")}</p>
        </aside>
      </div>

      <section className="box box--stacked flex flex-col" aria-labelledby="delivery-log-title">
        <h2 id="delivery-log-title" className="p-5 font-medium">{t("deliveryLog")}</h2>
        <div
          className="overflow-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary xl:overflow-visible"
          role="region"
          aria-label={t("deliveryLog")}
          tabIndex={0}
        >
          <table className="w-full min-w-[640px]">
            <caption className="sr-only">{t("deliveryLog")}</caption>
            <thead>
              <tr>
                {["event", "reference", "channel", "status", "time"].map((key) => (
                  <th key={key} scope="col" className="border-b border-t border-slate-200/60 bg-slate-50 px-5 py-4 text-start font-medium text-slate-500 dark:border-darkmode-400 dark:bg-darkmode-400">{t(key)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {deliveryRows.map((row) => (
                <tr key={row.reference} className="border-b border-slate-200/60 dark:border-darkmode-400">
                  <th scope="row" className="px-5 py-4 text-start font-medium">{t(row.eventKey)}</th>
                  <td className="px-5 py-4 text-xs" dir="ltr">{row.reference}</td>
                  <td className="px-5 py-4 text-sm">{t(row.channelKey)}</td>
                  <td className="px-5 py-4 text-sm">{t(row.statusKey)}</td>
                  <td className="px-5 py-4 text-xs"><span>{t("today")}</span> <span dir="ltr">{row.time}</span></td>
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

export default CommunicationsPage;
