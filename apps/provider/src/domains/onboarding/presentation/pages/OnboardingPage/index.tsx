import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { onboardingNamespace } from "@/domains/onboarding/i18n";
import Button from "@/shared/ui/components/Base/Button";
import { FormCheck } from "@/shared/ui/components/Base/Form";
import Progress from "@/shared/ui/components/Base/Progress";

const requiredSteps = [
  ["businessProfile", "businessProfileHelp"],
  ["activeService", "activeServiceHelp"],
  ["availability", "availabilityHelp"],
  ["bookingPolicy", "bookingPolicyHelp"],
  ["publicPreview", "publicPreviewHelp"],
] as const;

type RequiredStep = (typeof requiredSteps)[number][0];

function OnboardingPage() {
  const { t } = useTranslation(onboardingNamespace);
  const [completed, setCompleted] = useState<Record<RequiredStep, boolean>>({
    businessProfile: false,
    activeService: false,
    availability: false,
    bookingPolicy: false,
    publicPreview: false,
  });
  const [teamReady, setTeamReady] = useState(false);
  const [published, setPublished] = useState(false);

  const completeCount = useMemo(() => Object.values(completed).filter(Boolean).length, [completed]);
  const allRequiredComplete = completeCount === requiredSteps.length;

  const updateRequiredStep = (step: RequiredStep, checked: boolean) => {
    setCompleted((current) => ({ ...current, [step]: checked }));
    setPublished(false);
  };

  return (
    <section
      className="grid grid-cols-12 gap-x-6 gap-y-10"
      aria-labelledby="onboarding-title"
    >
      <div className="col-span-12">
        <div className="flex flex-col gap-y-3 md:h-10 md:flex-row md:items-center">
          <h1
            id="onboarding-title"
            className="text-base font-medium group-[.mode--light]:text-white"
          >
            {t("title")}
          </h1>
        </div>

        <div className="mt-3.5 flex flex-col gap-7">
          <section className="box box--stacked flex flex-col p-5">
            <div className="border-b border-dashed border-slate-300/70 pb-5 font-medium">
              {t("eyebrow")}
            </div>
            <p className="mt-5 max-w-3xl text-sm leading-relaxed text-slate-500">
              {t("description")}
            </p>
            <p
              className="mt-4 rounded-[0.6rem] border border-primary/20 bg-primary/5 p-4 text-sm leading-relaxed"
              role="note"
            >
              {t("workflowNote")}
            </p>
          </section>

          <section
            className="box box--stacked flex flex-col p-5"
            aria-labelledby="onboarding-progress-title"
          >
            <div className="flex items-end justify-between gap-4 border-b border-dashed border-slate-300/70 pb-5">
              <h2 id="onboarding-progress-title" className="font-medium">
                {t("progressLabel")}
              </h2>
              <span className="text-sm text-slate-500" aria-live="polite">
                {t("progressText", {
                  complete: completeCount,
                  total: requiredSteps.length,
                })}
              </span>
            </div>
            <Progress
              className="mt-5 h-2 bg-slate-200 dark:bg-darkmode-400"
              value={completeCount}
              max={requiredSteps.length}
              aria-label={t("progressLabel")}
            >
              <Progress.Bar
                style={{
                  width: `${(completeCount / requiredSteps.length) * 100}%`,
                }}
              />
            </Progress>
          </section>

          <fieldset className="box box--stacked p-5">
            <legend className="sr-only">{t("requiredTitle")}</legend>
            <div className="border-b border-dashed border-slate-300/70 pb-5 font-medium">
              {t("requiredTitle")}
            </div>
            <div className="mt-5 grid gap-3 lg:grid-cols-2">
              {requiredSteps.map(([stepKey, helpKey]) => (
                <div
                  key={stepKey}
                  className="rounded-[0.6rem] border border-slate-200/60 p-4 dark:border-darkmode-400"
                >
                  <FormCheck className="min-h-10">
                    <FormCheck.Input
                      id={`onboarding-${stepKey}`}
                      type="checkbox"
                      checked={completed[stepKey]}
                      onChange={(event) =>
                        updateRequiredStep(stepKey, event.target.checked)
                      }
                    />
                    <FormCheck.Label
                      htmlFor={`onboarding-${stepKey}`}
                      className="inline-flex min-h-10 items-center font-medium"
                    >
                      {t(stepKey)}
                    </FormCheck.Label>
                  </FormCheck>
                  <p className="ms-7 text-xs leading-relaxed text-slate-500">
                    {t(helpKey)}
                  </p>
                </div>
              ))}
            </div>
          </fieldset>

          <fieldset className="box box--stacked p-5">
            <legend className="sr-only">{t("optionalTitle")}</legend>
            <div className="border-b border-dashed border-slate-300/70 pb-5 font-medium">
              {t("optionalTitle")}
            </div>
            <FormCheck className="mt-4 min-h-10">
              <FormCheck.Input
                id="onboarding-team"
                type="checkbox"
                checked={teamReady}
                onChange={(event) => setTeamReady(event.target.checked)}
              />
              <FormCheck.Label
                htmlFor="onboarding-team"
                className="inline-flex min-h-10 items-center font-medium"
              >
                {t("teamOptional")}
              </FormCheck.Label>
            </FormCheck>
            <p className="ms-7 text-xs leading-relaxed text-slate-500">
              {t("teamOptionalHelp")}
            </p>
          </fieldset>

          <div className="box box--stacked sticky bottom-4 p-4">
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p
                id="onboarding-publish-status"
                className={`min-h-6 text-sm ${published ? "text-primary" : "text-slate-500"}`}
                role="status"
                aria-live="polite"
              >
                {published
                  ? t("published")
                  : !allRequiredComplete
                    ? t("blocked")
                    : ""}
              </p>
              <Button
                type="button"
                variant="primary"
                disabled={!allRequiredComplete}
                aria-describedby="onboarding-publish-status"
                onClick={() => setPublished(true)}
              >
                {t("publish")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default OnboardingPage;
