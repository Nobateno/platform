import { lazy, Suspense, useEffect, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import AdminShell from "@/app/shell";
import {
  OnboardingJourneyProvider,
  OnboardingProgressBanner,
  useOnboardingJourney,
} from "@/app/onboarding";
import {
  canAccessArea,
  getDefaultAreaPath,
  type ProviderArea,
} from "@/domains/auth/application/permissions";
import { useStore } from "@/domains/auth/store";
import { useReservationStore } from "@/domains/reservations";

const Login = lazy(() => import("@/domains/auth").then(({ LoginPage }) => ({ default: LoginPage })));
const ForgotPassword = lazy(() => import("@/domains/auth").then(({ ForgotPasswordPage }) => ({ default: ForgotPasswordPage })));
const Overview = lazy(() => import("@/domains/overview").then(({ OverviewPage }) => ({ default: OverviewPage })));
const ReservationList = lazy(() => import("@/domains/reservations").then(({ ReservationListPage }) => ({ default: ReservationListPage })));
const ReservationDetail = lazy(() => import("@/domains/reservations").then(({ ReservationDetailPage }) => ({ default: ReservationDetailPage })));
const Availability = lazy(() => import("@/domains/availability").then(({ AvailabilityPage }) => ({ default: AvailabilityPage })));
const CustomerList = lazy(() => import("@/domains/customers").then(({ CustomerListPage }) => ({ default: CustomerListPage })));
const CreateCustomer = lazy(() => import("@/domains/customers").then(({ CreateCustomerPage }) => ({ default: CreateCustomerPage })));
const CustomerDetail = lazy(() => import("@/domains/customers").then(({ CustomerDetailPage }) => ({ default: CustomerDetailPage })));
const ServiceList = lazy(() => import("@/domains/services").then(({ ServiceListPage }) => ({ default: ServiceListPage })));
const CreateService = lazy(() => import("@/domains/services").then(({ CreateServicePage }) => ({ default: CreateServicePage })));
const ServiceCategories = lazy(() => import("@/domains/services").then(({ ServiceCategoriesPage }) => ({ default: ServiceCategoriesPage })));
const Team = lazy(() => import("@/domains/team").then(({ TeamPage }) => ({ default: TeamPage })));
const PublicPresence = lazy(() => import("@/domains/public-presence").then(({ PublicPresencePage }) => ({ default: PublicPresencePage })));
const Communications = lazy(() => import("@/domains/communications").then(({ CommunicationsPage }) => ({ default: CommunicationsPage })));
const VoiceBooking = lazy(() => import("@/domains/voice-booking").then(({ VoiceBookingPage }) => ({ default: VoiceBookingPage })));
const Reports = lazy(() => import("@/domains/reports").then(({ ReportsPage }) => ({ default: ReportsPage })));
const Billing = lazy(() => import("@/domains/plan-billing").then(({ BillingPage }) => ({ default: BillingPage })));
const BusinessSettings = lazy(() => import("@/domains/business-settings").then(({ BusinessSettingsPage }) => ({ default: BusinessSettingsPage })));
const Onboarding = lazy(() => import("@/domains/onboarding").then(({ OnboardingPage }) => ({ default: OnboardingPage })));

function RouteFallback({ fullScreen = false }: { fullScreen?: boolean }) {
  const { t } = useTranslation();
  return (
    <div className={`flex items-center justify-center ${fullScreen ? "min-h-screen" : "min-h-40"}`} role="status">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-theme-1/20 border-t-theme-1" aria-hidden="true" />
      <span className="sr-only">{t("common.loading")}</span>
    </div>
  );
}

function useInitializeSession() {
  const status = useStore((state) => state.status);
  const initialize = useStore((state) => state.initialize);
  useEffect(() => {
    if (status === "idle") void initialize();
  }, [initialize, status]);
  return status;
}

function ProtectedRoute({ area, children }: { area: ProviderArea; children: ReactNode }) {
  const status = useInitializeSession();
  const currentUser = useStore((state) => state.currentUser);
  const location = useLocation();

  if (status === "idle" || status === "checking") return <RouteFallback fullScreen />;
  if (!currentUser || status !== "authenticated") {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }
  if (!canAccessArea(currentUser.roleId, area)) {
    return <Navigate to={getDefaultAreaPath(currentUser.roleId)} replace />;
  }
  return <AdminShell>{children}</AdminShell>;
}

function LoginRoute() {
  const status = useInitializeSession();
  const currentUser = useStore((state) => state.currentUser);
  if (status === "idle" || status === "checking") return <RouteFallback fullScreen />;
  if (currentUser && status === "authenticated") {
    return <Navigate to={getDefaultAreaPath(currentUser.roleId)} replace />;
  }
  return <Login />;
}

function ForgotPasswordRoute() {
  const status = useInitializeSession();
  const currentUser = useStore((state) => state.currentUser);
  if (status === "idle" || status === "checking") return <RouteFallback fullScreen />;
  if (currentUser && status === "authenticated") {
    return <Navigate to={getDefaultAreaPath(currentUser.roleId)} replace />;
  }
  return <ForgotPassword />;
}

function protectedPage(area: ProviderArea, page: ReactNode) {
  return <ProtectedRoute area={area}>{page}</ProtectedRoute>;
}

function ProviderOverview() {
  const reservations = useReservationStore((state) => state.reservations);
  return (
    <>
      <OnboardingProgressBanner />
      <Overview reservations={reservations} />
    </>
  );
}

function ProviderOnboarding() {
  const { activate, progress, updateStep } = useOnboardingJourney();

  useEffect(() => {
    activate();
  }, [activate]);

  return <Onboarding progress={progress} onProgressChange={updateStep} />;
}

export default function App() {
  return (
    <Suspense fallback={<RouteFallback fullScreen />}>
      <OnboardingJourneyProvider>
        <Routes>
          <Route path="/login" element={<LoginRoute />} />
          <Route path="/forgot-password" element={<ForgotPasswordRoute />} />
          <Route path="/" element={protectedPage("overview", <ProviderOverview />)} />
          <Route path="/transaction-list" element={protectedPage("reservations", <ReservationList />)} />
          <Route path="/transaction-detail/:id" element={protectedPage("reservations", <ReservationDetail />)} />
          <Route path="/transaction-detail" element={protectedPage("reservations", <ReservationDetail />)} />
          <Route path="/availability" element={protectedPage("availability", <Availability />)} />
          <Route path="/users" element={protectedPage("customers", <CustomerList />)} />
          <Route path="/add-user" element={protectedPage("customers", <CreateCustomer />)} />
          <Route path="/users/:customerId" element={protectedPage("customers", <CustomerDetail />)} />
          <Route path="/product-list" element={protectedPage("services", <ServiceList />)} />
          <Route path="/add-product" element={protectedPage("services", <CreateService />)} />
          <Route path="/categories" element={protectedPage("services", <ServiceCategories />)} />
          <Route path="/team" element={protectedPage("team", <Team />)} />
          <Route path="/booking-page" element={protectedPage("publicPresence", <PublicPresence />)} />
          <Route path="/communications" element={protectedPage("communications", <Communications />)} />
          <Route path="/voice-booking" element={protectedPage("voiceBooking", <VoiceBooking />)} />
          <Route path="/reports" element={protectedPage("reports", <Reports />)} />
          <Route path="/invoice" element={protectedPage("planBilling", <Billing />)} />
          <Route path="/settings" element={protectedPage("businessSettings", <BusinessSettings />)} />
          <Route path="/onboarding" element={protectedPage("onboarding", <ProviderOnboarding />)} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </OnboardingJourneyProvider>
    </Suspense>
  );
}
