import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { onboardingChecklist } from "@/domains/onboarding/model/checklist";
import { onboardingNamespace } from "@/domains/onboarding/i18n";
import Lucide from "@/shared/ui/components/Base/Lucide";
import Progress from "@/shared/ui/components/Base/Progress";
import { useOnboardingJourney } from "./OnboardingJourneyProvider";

export default function OnboardingProgressBanner() {
  const { t } = useTranslation(onboardingNamespace);
  const { active, completedCount, nextStep } = useOnboardingJourney();

  if (!active || !nextStep) return null;

  const total = onboardingChecklist.length;
  const percentage = Math.round((completedCount / total) * 100);

  return (
    <section
      aria-labelledby="onboarding-progress-banner-title"
      className="mb-6 overflow-hidden rounded-[0.75rem] border border-m3-primary/20 bg-m3-primary-container/35 px-4 py-4 shadow-sm dark:bg-m3-primary-container/20 sm:px-5"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-m3-primary text-m3-on-primary">
            <Lucide icon="Lightbulb" className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <h2
                id="onboarding-progress-banner-title"
                className="font-medium text-m3-on-primary-container"
              >
                {t("progressLabel")}
              </h2>
              <span className="text-sm text-m3-on-surface-variant">
                {t("progressText", { complete: completedCount, total })}
              </span>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-m3-on-surface-variant">
              {t(nextStep.id)}
            </p>
            <Progress
              value={completedCount}
              max={total}
              aria-label={t("progressLabel")}
              className="mt-3 h-1.5 bg-m3-surface/75"
            >
              <Progress.Bar style={{ width: `${percentage}%` }} />
            </Progress>
          </div>
        </div>
        <Link
          to={nextStep.destination}
          className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-full bg-m3-primary px-4 text-sm font-medium text-m3-on-primary shadow-m3-1 transition-colors hover:bg-m3-primary/90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-m3-primary/25"
        >
          {t(nextStep.id)}
          <Lucide icon="ArrowRight" className="ms-2 h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
