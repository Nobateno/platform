import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getDefaultAreaPath } from "@/domains/auth/application/permissions";
import {
  isDemoAuthAvailable,
  type PanelRole,
  useStore,
} from "@/domains/auth/application/auth-store";
import {
  constrainPhoneInput,
  normalizePhoneNumber,
} from "@/shared/lib/phone";
import {
  getAuthScreenCopy,
  getInitialAuthScreen,
  getServerFieldError,
  getVerifiedAuthScreen,
  providerPhoneRegion,
  safeReturnPath,
} from "./auth-flow.model";
import type {
  AuthFieldErrorKey,
  AuthFieldErrors,
  AuthFieldName,
  AuthFlow,
  AuthFormValues,
} from "./auth-flow.types";
import {
  getOtpError,
  getPasswordSetupErrors,
  getPhoneError,
  getRegistrationProfileErrors,
  hasFieldErrors,
} from "./auth-flow.validation";

type LoginLocationState = { from?: string; phone?: string };

function getInitialValues(phone = ""): AuthFormValues {
  return {
    phone,
    password: "",
    confirmPassword: "",
    otp: "",
    fullName: "",
    businessName: "",
    verificationToken: "",
  };
}

export function useAuthFlow(flow: AuthFlow) {
  const navigate = useNavigate();
  const location = useLocation();
  const lookupPhone = useStore((state) => state.lookupPhone);
  const requestOtp = useStore((state) => state.requestOtp);
  const verifyOtp = useStore((state) => state.verifyOtp);
  const login = useStore((state) => state.login);
  const registerProvider = useStore((state) => state.registerProvider);
  const resetPassword = useStore((state) => state.resetPassword);
  const clearServerError = useStore((state) => state.clearError);
  const isSubmitting = useStore((state) => state.pending);
  const serverError = useStore((state) => state.error);
  const routeState = location.state as LoginLocationState | null;
  const returnPath = safeReturnPath(routeState?.from);

  const [screen, setScreen] = useState(() => getInitialAuthScreen(flow));
  const [values, setValues] = useState(() =>
    getInitialValues(
      typeof routeState?.phone === "string"
        ? constrainPhoneInput(routeState.phone, providerPhoneRegion)
        : "",
    ),
  );
  const [fieldErrors, setFieldErrors] = useState<AuthFieldErrors>({});
  const headingRef = useRef<HTMLHeadingElement>(null);
  const isInitialScreen = useRef(true);

  const phoneId = useId();
  const fieldIds = {
    phone: phoneId,
    password: useId(),
    confirmPassword: useId(),
    otp: useId(),
    fullName: useId(),
    businessName: useId(),
    formError: `${phoneId}-form-error`,
  };

  useEffect(() => {
    if (isInitialScreen.current) {
      isInitialScreen.current = false;
      return;
    }

    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    headingRef.current?.focus();
  }, [screen]);

  const clearFieldError = (field: AuthFieldName) => {
    clearServerError();
    setFieldErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const updateField = <Field extends AuthFieldName>(
    field: Field,
    value: AuthFormValues[Field],
  ) => {
    setValues((current) => ({ ...current, [field]: value }));
    clearFieldError(field);
  };

  const setFieldError = (
    field: AuthFieldName,
    error?: AuthFieldErrorKey,
  ) => {
    setFieldErrors((current) => ({ ...current, [field]: error }));
  };

  const resetMessages = () => {
    clearServerError();
    setFieldErrors({});
  };

  const completeLogin = (role: PanelRole) => {
    navigate(returnPath ?? getDefaultAreaPath(role), { replace: true });
  };

  const returnToPhone = () => {
    resetMessages();
    setValues((current) => ({
      ...current,
      password: "",
      confirmPassword: "",
      otp: "",
      verificationToken: "",
    }));
    setScreen(getInitialAuthScreen(flow));
  };

  const validatePhone = () => {
    const error = getPhoneError(values.phone);
    setFieldError("phone", error);
    return !error;
  };

  const validateOtp = () => {
    const error = getOtpError(values.otp);
    setFieldError("otp", error);
    return !error;
  };

  const submitPhone = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearServerError();
    if (!validatePhone()) return;

    const normalizedPhone = normalizePhoneNumber(
      values.phone,
      providerPhoneRegion,
    );
    setValues((current) => ({ ...current, phone: normalizedPhone }));

    const accountExists = await lookupPhone(normalizedPhone);
    if (accountExists === undefined) return;

    if (flow === "recovery") {
      if (!accountExists) {
        setFieldErrors({ phone: "accountNotFound" });
        return;
      }
      if (await requestOtp(normalizedPhone, "password-reset")) {
        setScreen({ type: "otp", purpose: "password-reset" });
      }
      return;
    }

    if (accountExists) {
      setScreen({ type: "password" });
      return;
    }

    if (await requestOtp(normalizedPhone, "registration")) {
      setScreen({ type: "otp", purpose: "registration" });
    }
  };

  const submitPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearServerError();
    if (!values.password) {
      setFieldErrors({ password: "passwordRequired" });
      return;
    }

    const user = await login({
      phone: values.phone,
      password: values.password,
    });
    if (user) completeLogin(user.roleId);
  };

  const submitOtp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearServerError();
    if (screen.type !== "otp" || !validateOtp()) return;

    const token = await verifyOtp(
      values.phone,
      values.otp,
      screen.purpose,
    );
    if (!token) return;

    setValues((current) => ({
      ...current,
      password: "",
      confirmPassword: "",
      verificationToken: token,
    }));
    setFieldErrors({});
    setScreen(getVerifiedAuthScreen(screen.purpose));
  };

  const resendOtp = async () => {
    if (screen.type !== "otp") return false;
    resetMessages();
    return requestOtp(values.phone, screen.purpose);
  };

  const submitRegistration = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearServerError();

    const nextErrors = {
      ...getRegistrationProfileErrors(values),
      ...getPasswordSetupErrors(values),
    };
    setFieldErrors(nextErrors);
    if (hasFieldErrors(nextErrors)) return;

    const user = await registerProvider({
      phone: values.phone,
      password: values.password,
      verificationToken: values.verificationToken,
      fullName: values.fullName.trim(),
      businessName: values.businessName.trim(),
    });
    if (user) navigate("/onboarding", { replace: true });
  };

  const submitPasswordReset = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearServerError();

    const nextErrors = getPasswordSetupErrors(values);
    setFieldErrors(nextErrors);
    if (hasFieldErrors(nextErrors)) return;

    const succeeded = await resetPassword({
      phone: values.phone,
      password: values.password,
      verificationToken: values.verificationToken,
    });
    if (!succeeded) return;

    setValues((current) => ({
      ...current,
      password: "",
      confirmPassword: "",
      verificationToken: "",
    }));
    setFieldErrors({});
    setScreen({ type: "resetComplete" });
  };

  const serverFieldError = getServerFieldError(screen, serverError);

  return {
    flow,
    screen,
    screenCopy: getAuthScreenCopy(screen),
    values,
    fieldErrors,
    fieldIds,
    headingRef,
    isSubmitting,
    serverFieldError,
    formError: serverFieldError ? undefined : serverError,
    showDemoCredentials:
      isDemoAuthAvailable &&
      screen.type === "phone" &&
      screen.flow === "login",
    showRecoveryBackLink:
      flow === "recovery" && screen.type !== "resetComplete",
    actions: {
      updateField,
      validatePhone,
      returnToPhone,
      submitPhone,
      submitPassword,
      submitOtp,
      resendOtp,
      submitRegistration,
      submitPasswordReset,
    },
  };
}

export type AuthFlowController = ReturnType<typeof useAuthFlow>;
