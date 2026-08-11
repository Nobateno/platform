export const onboardingChecklist = [
  {
    id: "activeService",
    helpKey: "activeServiceHelp",
    destination: "/add-product",
    icon: "Package",
  },
  {
    id: "businessProfile",
    helpKey: "businessProfileHelp",
    destination: "/booking-page",
    icon: "Building2",
  },
  {
    id: "availability",
    helpKey: "availabilityHelp",
    destination: "/availability",
    icon: "Clock",
  },
  {
    id: "bookingPolicy",
    helpKey: "bookingPolicyHelp",
    destination: "/settings",
    icon: "ShieldCheck",
  },
  {
    id: "publicPreview",
    helpKey: "publicPreviewHelp",
    destination: "/booking-page",
    icon: "CheckSquare",
  },
] as const;

export type OnboardingStep = (typeof onboardingChecklist)[number]["id"];

export type OnboardingProgress = Record<OnboardingStep, boolean>;

export const createEmptyOnboardingProgress = (): OnboardingProgress => ({
  activeService: false,
  businessProfile: false,
  availability: false,
  bookingPolicy: false,
  publicPreview: false,
});

export const getCompletedOnboardingStepCount = (
  progress: OnboardingProgress,
) => onboardingChecklist.filter(({ id }) => progress[id]).length;

export const getNextIncompleteOnboardingStep = (
  progress: OnboardingProgress,
) => onboardingChecklist.find(({ id }) => !progress[id]);
