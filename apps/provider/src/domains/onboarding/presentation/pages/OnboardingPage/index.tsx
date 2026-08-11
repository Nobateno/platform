import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  createEmptyOnboardingProgress,
  getCompletedOnboardingStepCount,
  onboardingChecklist,
  type OnboardingProgress,
  type OnboardingStep,
} from "@/domains/onboarding/model/checklist";
import { onboardingNamespace } from "@/domains/onboarding/i18n";
import Button from "@/shared/ui/components/Base/Button";
import { FormCheck } from "@/shared/ui/components/Base/Form";
import Lucide from "@/shared/ui/components/Base/Lucide";
import Progress from "@/shared/ui/components/Base/Progress";

export interface OnboardingPageProps {
  progress?: OnboardingProgress;
  onProgressChange?: (step: OnboardingStep, complete: boolean) => void;
}

function OnboardingPage({
  progress: controlledProgress,
  onProgressChange,
}: OnboardingPageProps) {
  const { t } = useTranslation(onboardingNamespace);
  const [uncontrolledProgress, setUncontrolledProgress] = useState(
    createEmptyOnboardingProgress,
  );
  const [activeStep, setActiveStep] = useState<OnboardingStep>(
    onboardingChecklist[0].id,
  );
  const [published, setPublished] = useState(false);
  const progress = controlledProgress ?? uncontrolledProgress;

  const completeCount = useMemo(
    () => getCompletedOnboardingStepCount(progress),
    [progress],
  );
  const allRequiredComplete = completeCount === onboardingChecklist.length;
  const progressPercentage = Math.round(
    (completeCount / onboardingChecklist.length) * 100,
  );

  const updateRequiredStep = (step: OnboardingStep, checked: boolean) => {
    if (!controlledProgress) {
      setUncontrolledProgress((current) => ({ ...current, [step]: checked }));
    }
    onProgressChange?.(step, checked);
    setActiveStep(step);
    setPublished(false);
  };

  const scrollToPageTop = () => window.scrollTo(0, 0);

  return (
    <section className="grid grid-cols-12 gap-x-6 gap-y-6 pb-8" aria-labelledby="onboarding-title">
      <div className="col-span-12">
        <nav
          aria-label={t("progressLabel")}
          className="box box--stacked overflow-x-auto rounded-[0.9rem] p-4 sm:p-5"
        >
          <ol className="flex min-w-[46rem] items-start justify-between gap-2 sm:min-w-0">
            {onboardingChecklist.map(({ id }, index) => {
              const complete = progress[id];
              const active = id === activeStep;
              return (
                <li key={id} className="relative flex min-w-[8.5rem] flex-1 justify-center">
                  {index > 0 && (
                    <span
                      aria-hidden="true"
                      className="absolute end-1/2 top-5 h-px w-full border-t border-dashed border-m3-outline/70"
                    />
                  )}
                  <button
                    type="button"
                    aria-current={active ? "step" : undefined}
                    aria-label={`${index + 1}. ${t(id)}`}
                    onClick={() => setActiveStep(id)}
                    className="relative z-10 flex min-h-11 flex-col items-center rounded-[0.7rem] px-2 text-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-m3-primary/20"
                  >
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-medium transition-colors ${
                        complete
                          ? "border-m3-primary bg-m3-primary text-m3-on-primary"
                          : active
                            ? "border-m3-primary bg-m3-primary-container text-m3-on-primary-container"
                            : "border-m3-outline bg-m3-surface text-m3-on-surface-variant"
                      }`}
                    >
                      {complete ? (
                        <Lucide icon="Check" className="h-5 w-5" aria-hidden="true" />
                      ) : (
                        index + 1
                      )}
                    </span>
                    <span className="mt-2 text-xs font-medium leading-relaxed text-m3-on-surface">
                      {t(id)}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>

      <div className="col-span-12">
        <div className="box box--stacked overflow-hidden rounded-[0.9rem]">
          <header className="border-b border-dashed border-slate-300/70 px-5 py-6 sm:px-7 sm:py-7 dark:border-m3-outline/55">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-medium text-m3-primary">{t("eyebrow")}</p>
                <h1 id="onboarding-title" className="mt-2 text-xl font-medium text-m3-on-surface">
                  {t("title")}
                </h1>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-m3-on-surface-variant">
                  {t("description")}
                </p>
              </div>
              <div className="shrink-0 rounded-full bg-m3-primary-container px-4 py-2 text-sm font-medium text-m3-on-primary-container">
                {t("progressText", {
                  complete: completeCount,
                  total: onboardingChecklist.length,
                })}
              </div>
            </div>
            <Progress
              value={completeCount}
              max={onboardingChecklist.length}
              aria-label={t("progressLabel")}
              className="mt-5 h-2 bg-m3-surface-container-high"
            >
              <Progress.Bar style={{ width: `${progressPercentage}%` }} />
            </Progress>
          </header>

          <div className="grid gap-4 p-5 sm:p-7 lg:grid-cols-2">
            {onboardingChecklist.map(({ id, helpKey, destination, icon }, index) => {
              const complete = progress[id];
              const active = activeStep === id;
              return (
                <article
                  key={id}
                  className={`relative rounded-[0.75rem] border p-4 transition-colors sm:p-5 ${
                    active
                      ? "border-m3-primary/45 bg-m3-primary-container/20 shadow-sm"
                      : "border-m3-outline/45 bg-m3-surface"
                  } ${complete ? "border-m3-success/35" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[0.7rem] ${
                        complete
                          ? "bg-m3-success/15 text-m3-success"
                          : "bg-m3-primary-container text-m3-on-primary-container"
                      }`}
                    >
                      <Lucide icon={icon} className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <p className="text-xs font-medium text-m3-primary">
                          {index + 1} / {onboardingChecklist.length}
                        </p>
                        {complete && (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-m3-success">
                            <Lucide icon="Check" className="h-3.5 w-3.5" aria-hidden="true" />
                            {t("completed")}
                          </span>
                        )}
                      </div>
                      <h2 className="mt-1 font-medium text-m3-on-surface">{t(id)}</h2>
                      <p className="mt-1 text-sm leading-relaxed text-m3-on-surface-variant">
                        {t(helpKey)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-col gap-3 border-t border-dashed border-m3-outline/45 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <FormCheck className="min-h-10">
                      <FormCheck.Input
                        id={`onboarding-${id}`}
                        type="checkbox"
                        checked={complete}
                        onChange={(event) => updateRequiredStep(id, event.target.checked)}
                      />
                      <FormCheck.Label
                        htmlFor={`onboarding-${id}`}
                        className="inline-flex min-h-10 items-center text-sm font-medium"
                      >
                        {t(id)}
                      </FormCheck.Label>
                    </FormCheck>
                    <Button
                      as={Link}
                      to={destination}
                      variant="outline-primary"
                      size="sm"
                      className="shrink-0"
                      onClick={scrollToPageTop}
                    >
                      {t("configureStep")}
                      <Lucide icon="ArrowRight" className="ms-1.5 h-4 w-4" aria-hidden="true" />
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>

          <footer className="flex flex-col gap-3 border-t border-dashed border-slate-300/70 bg-m3-surface-container-low px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7 dark:border-m3-outline/55">
            <p
              id="onboarding-publish-status"
              className={`min-h-6 text-sm ${published ? "text-m3-success" : "text-m3-on-surface-variant"}`}
              role="status"
              aria-live="polite"
            >
              {published ? t("published") : !allRequiredComplete ? t("blocked") : ""}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                as={Link}
                to="/"
                variant="outline-secondary"
                className="w-full sm:w-auto"
                onClick={scrollToPageTop}
              >
                {t("skipForNow")}
              </Button>
              <Button
                type="button"
                variant="primary"
                className="w-full sm:w-auto"
                disabled={!allRequiredComplete}
                aria-describedby="onboarding-publish-status"
                onClick={() => setPublished(true)}
              >
                {t("publish")}
              </Button>
            </div>
          </footer>
        </div>
      </div>
    </section>
  );
}

export default OnboardingPage;
