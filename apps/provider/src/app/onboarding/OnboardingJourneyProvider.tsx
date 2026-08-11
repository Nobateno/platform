import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  createEmptyOnboardingProgress,
  getCompletedOnboardingStepCount,
  getNextIncompleteOnboardingStep,
  type OnboardingProgress,
  type OnboardingStep,
} from "@/domains/onboarding/model/checklist";
import { useStore } from "@/domains/auth/store";

type OnboardingJourneyValue = {
  active: boolean;
  completedCount: number;
  progress: OnboardingProgress;
  nextStep: ReturnType<typeof getNextIncompleteOnboardingStep>;
  activate: () => void;
  updateStep: (step: OnboardingStep, complete: boolean) => void;
};

const OnboardingJourneyContext = createContext<OnboardingJourneyValue | null>(
  null,
);

export function OnboardingJourneyProvider({ children }: { children: ReactNode }) {
  const accountId = useStore((state) => state.currentUser?.id ?? "anonymous");
  const [journey, setJourney] = useState(() => ({
    accountId: "",
    active: false,
    progress: createEmptyOnboardingProgress(),
  }));

  const value = useMemo<OnboardingJourneyValue>(() => {
    const isCurrentAccount = journey.accountId === accountId;
    const progress = isCurrentAccount
      ? journey.progress
      : createEmptyOnboardingProgress();
    const completedCount = getCompletedOnboardingStepCount(progress);
    return {
      active: isCurrentAccount && journey.active,
      completedCount,
      progress,
      nextStep: getNextIncompleteOnboardingStep(progress),
      activate: () => {
        setJourney((current) =>
          current.accountId === accountId && current.active
            ? current
            : {
                accountId,
                active: true,
                progress:
                  current.accountId === accountId
                    ? current.progress
                    : createEmptyOnboardingProgress(),
              },
        );
      },
      updateStep: (step, complete) => {
        setJourney((current) => ({
          accountId,
          active: true,
          progress: {
            ...(current.accountId === accountId
              ? current.progress
              : createEmptyOnboardingProgress()),
            [step]: complete,
          },
        }));
      },
    };
  }, [accountId, journey]);

  return (
    <OnboardingJourneyContext.Provider value={value}>
      {children}
    </OnboardingJourneyContext.Provider>
  );
}

export function useOnboardingJourney() {
  const value = useContext(OnboardingJourneyContext);
  if (!value) {
    throw new Error("useOnboardingJourney must be used inside OnboardingJourneyProvider");
  }
  return value;
}
