export { default as OnboardingPage } from "./presentation/pages/OnboardingPage";
export {
  onboardingI18n,
  onboardingNamespace,
  onboardingResources,
  type OnboardingMessages,
} from "./i18n";
export {
  createEmptyOnboardingProgress,
  getCompletedOnboardingStepCount,
  getNextIncompleteOnboardingStep,
  onboardingChecklist,
  type OnboardingProgress,
  type OnboardingStep,
} from "./model/checklist";
