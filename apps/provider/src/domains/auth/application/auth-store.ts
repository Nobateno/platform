import { create } from "zustand";
import { isDemoMode } from "@/shared/config/environment";

export type PanelRole = "owner" | "receptionist" | "staff";
export type OtpPurpose = "registration" | "password-reset";
export type AuthErrorCode =
  | "invalidCredentials"
  | "invalidSession"
  | "unavailable"
  | "otpRequestFailed"
  | "invalidOtp"
  | "registrationFailed"
  | "resetFailed";

export interface PanelUser {
  id: string;
  fullName: string;
  roleId: PanelRole;
  active: boolean;
}

export type AuthStatus =
  | "idle"
  | "checking"
  | "authenticated"
  | "anonymous";

interface LoginCredentials {
  phone: string;
  password: string;
}

interface RegisterProviderInput extends LoginCredentials {
  verificationToken: string;
  fullName: string;
  businessName: string;
}

interface ResetPasswordInput extends LoginCredentials {
  verificationToken: string;
}

interface AuthStore {
  currentUser?: PanelUser;
  status: AuthStatus;
  pending: boolean;
  error?: AuthErrorCode;
  initialize: () => Promise<void>;
  lookupPhone: (phone: string) => Promise<boolean | undefined>;
  requestOtp: (phone: string, purpose: OtpPurpose) => Promise<boolean>;
  verifyOtp: (
    phone: string,
    code: string,
    purpose: OtpPurpose,
  ) => Promise<string | undefined>;
  login: (credentials: LoginCredentials) => Promise<PanelUser | undefined>;
  registerProvider: (
    input: RegisterProviderInput,
  ) => Promise<PanelUser | undefined>;
  resetPassword: (input: ResetPasswordInput) => Promise<boolean>;
  loginDemo: (role: PanelRole) => PanelUser | undefined;
  clearError: () => void;
  logout: () => Promise<void>;
}

const DEMO_SESSION_KEY = "nobateno-demo-session";
const DEMO_OTP = "123456";
const DEMO_PASSWORD = "Demo12345!";

const demoUsers: Record<PanelRole, PanelUser> = {
  owner: {
    id: "demo-owner",
    fullName: "مدیر کسب‌وکار",
    roleId: "owner",
    active: true,
  },
  receptionist: {
    id: "demo-receptionist",
    fullName: "پذیرش نمونه",
    roleId: "receptionist",
    active: true,
  },
  staff: {
    id: "demo-staff",
    fullName: "مدیر کسب‌وکار",
    roleId: "staff",
    active: true,
  },
};

const demoPhoneRoles: Record<string, PanelRole> = {
  "09120000001": "owner",
  "09120000002": "receptionist",
  "09120000003": "staff",
};

function toPanelUser(value: unknown): PanelUser | undefined {
  if (!value || typeof value !== "object") return undefined;
  const user = value as Partial<PanelUser>;
  if (
    typeof user.id === "string" &&
    typeof user.fullName === "string" &&
    (user.roleId === "owner" ||
      user.roleId === "receptionist" ||
      user.roleId === "staff") &&
    user.active === true
  ) {
    return {
      id: user.id,
      fullName: user.fullName,
      roleId: user.roleId,
      active: true,
    };
  }

  return undefined;
}

function storeDemoSession(user: PanelUser) {
  window.sessionStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(user));
}

function readDemoSession(): PanelUser | undefined {
  if (!isDemoMode || typeof window === "undefined") return undefined;

  try {
    const stored = window.sessionStorage.getItem(DEMO_SESSION_KEY);
    if (!stored) return undefined;
    const parsed: unknown = JSON.parse(stored);
    return toPanelUser(parsed);
  } catch {
    return undefined;
  }
}

async function readServerSession(): Promise<PanelUser | undefined> {
  try {
    const response = await fetch("/api/provider/session", {
      credentials: "include",
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return undefined;
    const payload: unknown = await response.json();
    return toPanelUser(payload);
  } catch {
    return undefined;
  }
}

async function postJson(path: string, body: object): Promise<Response> {
  return fetch(path, {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

function useDemoFallback(): boolean {
  return isDemoMode && typeof window !== "undefined";
}

function isMissingDevEndpoint(response: Response): boolean {
  return useDemoFallback() && response.status === 404;
}

export const useStore = create<AuthStore>((set, get) => ({
  currentUser: undefined,
  status: "idle",
  pending: false,
  error: undefined,
  initialize: async () => {
    if (get().status !== "idle") return;
    set({ status: "checking", pending: false, error: undefined });
    const user = readDemoSession() ?? (await readServerSession());
    set({
      currentUser: user,
      status: user ? "authenticated" : "anonymous",
      pending: false,
    });
  },
  lookupPhone: async (phone) => {
  set({ pending: true, error: undefined });

  if (isDemoMode) {
    set({ pending: false, error: undefined });

    return phone in demoPhoneRoles;
  }

  try {
    const response = await postJson("/api/provider/auth/phone-lookup", {
      phone,
    });

    if (!response.ok) {
      set({ pending: false, error: "unavailable" });

      return undefined;
    }

    const payload: unknown = await response.json();

    if (
      !payload ||
      typeof payload !== "object" ||
      typeof (payload as { exists?: unknown }).exists !== "boolean"
    ) {
      throw new Error("Invalid phone lookup response");
    }

    set({ pending: false, error: undefined });

    return (payload as { exists: boolean }).exists;
  } catch {
    set({ pending: false, error: "unavailable" });

    return undefined;
  }
},
  requestOtp: async (phone, purpose) => {
    set({ pending: true, error: undefined });

    try {
      const response = await postJson("/api/provider/auth/otp/request", {
        phone,
        purpose,
      });
      if (!response.ok) {
        if (isMissingDevEndpoint(response)) {
          set({ pending: false, error: undefined });
          return true;
        }
        set({ pending: false, error: "otpRequestFailed" });
        return false;
      }
      set({ pending: false, error: undefined });
      return true;
    } catch {
      if (useDemoFallback()) {
        set({ pending: false, error: undefined });
        return true;
      }
      set({ pending: false, error: "unavailable" });
      return false;
    }
  },
  verifyOtp: async (phone, code, purpose) => {
    set({ pending: true, error: undefined });

    try {
      const response = await postJson("/api/provider/auth/otp/verify", {
        phone,
        code,
        purpose,
      });
      if (!response.ok) {
        if (isMissingDevEndpoint(response) && code === DEMO_OTP) {
          set({ pending: false, error: undefined });
          return `demo-${purpose}-${phone}`;
        }
        set({ pending: false, error: "invalidOtp" });
        return undefined;
      }

      const payload: unknown = await response.json();
      const verificationToken =
        payload && typeof payload === "object"
          ? (payload as { verificationToken?: unknown }).verificationToken
          : undefined;
      if (typeof verificationToken !== "string" || !verificationToken) {
        throw new Error("Invalid OTP response");
      }

      set({ pending: false, error: undefined });
      return verificationToken;
    } catch {
      if (useDemoFallback() && code === DEMO_OTP) {
        set({ pending: false, error: undefined });
        return `demo-${purpose}-${phone}`;
      }
      set({ pending: false, error: "invalidOtp" });
      return undefined;
    }
  },
  login: async ({ phone, password }) => {
  window.sessionStorage.removeItem(DEMO_SESSION_KEY);

  set({
    currentUser: undefined,
    pending: true,
    error: undefined,
  });

  if (isDemoMode) {
    const demoRole = demoPhoneRoles[phone];

    if (!demoRole || password !== DEMO_PASSWORD) {
      set({
        status: "anonymous",
        pending: false,
        error: "invalidCredentials",
      });

      return undefined;
    }

    const user = demoUsers[demoRole];

    storeDemoSession(user);

    set({
      currentUser: user,
      status: "authenticated",
      pending: false,
      error: undefined,
    });

    return user;
  }

  try {
    const response = await postJson("/api/provider/session", {
      phone,
      password,
    });

      if (!response.ok) {
        const demoRole = demoPhoneRoles[phone];
        if (
          isMissingDevEndpoint(response) &&
          demoRole &&
          password === DEMO_PASSWORD
        ) {
          const user = demoUsers[demoRole];
          storeDemoSession(user);
          set({
            currentUser: user,
            status: "authenticated",
            pending: false,
            error: undefined,
          });
          return user;
        }
        set({ status: "anonymous", pending: false, error: "invalidCredentials" });
        return undefined;
      }

      const payload: unknown = await response.json();
      const user = toPanelUser(payload);
      if (!user) {
        set({ status: "anonymous", pending: false, error: "invalidSession" });
        return undefined;
      }

      set({
        currentUser: user,
        status: "authenticated",
        pending: false,
        error: undefined,
      });
      return user;
    } catch {
      const demoRole = demoPhoneRoles[phone];
      if (useDemoFallback() && demoRole && password === DEMO_PASSWORD) {
        const user = demoUsers[demoRole];
        storeDemoSession(user);
        set({
          currentUser: user,
          status: "authenticated",
          pending: false,
          error: undefined,
        });
        return user;
      }
      set({
        status: "anonymous",
        pending: false,
        error: useDemoFallback() ? "invalidCredentials" : "unavailable",
      });
      return undefined;
    }
  },
  registerProvider: async ({
    phone,
    password,
    verificationToken,
    fullName,
    businessName,
  }) => {
    window.sessionStorage.removeItem(DEMO_SESSION_KEY);
    set({ currentUser: undefined, pending: true, error: undefined });

    try {
      const response = await postJson("/api/provider/accounts", {
        phone,
        password,
        verificationToken,
        fullName,
        businessName,
      });
      if (!response.ok) {
        if (
          isMissingDevEndpoint(response) &&
          verificationToken.startsWith("demo-registration-")
        ) {
          const user: PanelUser = {
            id: `demo-owner-${phone}`,
            fullName,
            roleId: "owner",
            active: true,
          };
          storeDemoSession(user);
          set({
            currentUser: user,
            status: "authenticated",
            pending: false,
            error: undefined,
          });
          return user;
        }
        set({ status: "anonymous", pending: false, error: "registrationFailed" });
        return undefined;
      }

      const payload: unknown = await response.json();
      const user = toPanelUser(payload);
      if (!user) throw new Error("Invalid registration response");

      set({
        currentUser: user,
        status: "authenticated",
        pending: false,
        error: undefined,
      });
      return user;
    } catch {
      if (useDemoFallback() && verificationToken.startsWith("demo-registration-")) {
        const user: PanelUser = {
          id: `demo-owner-${phone}`,
          fullName,
          roleId: "owner",
          active: true,
        };
        storeDemoSession(user);
        set({
          currentUser: user,
          status: "authenticated",
          pending: false,
          error: undefined,
        });
        return user;
      }
      set({ status: "anonymous", pending: false, error: "registrationFailed" });
      return undefined;
    }
  },
  resetPassword: async ({ phone, password, verificationToken }) => {
    set({ pending: true, error: undefined });

    try {
      const response = await postJson("/api/provider/password-reset", {
        phone,
        password,
        verificationToken,
      });
      if (!response.ok) {
        if (
          isMissingDevEndpoint(response) &&
          verificationToken.startsWith("demo-password-reset-")
        ) {
          set({ pending: false, error: undefined });
          return true;
        }
        set({ pending: false, error: "resetFailed" });
        return false;
      }
      set({ pending: false, error: undefined });
      return true;
    } catch {
      if (
        useDemoFallback() &&
        verificationToken.startsWith("demo-password-reset-")
      ) {
        set({ pending: false, error: undefined });
        return true;
      }
      set({ pending: false, error: "resetFailed" });
      return false;
    }
  },
  loginDemo: (role) => {
    if (!isDemoMode) return undefined;

    const user = demoUsers[role];
    storeDemoSession(user);
    set({
      currentUser: user,
      status: "authenticated",
      pending: false,
      error: undefined,
    });
    return user;
  },
  clearError: () => set({ error: undefined }),
  logout: async () => {
    window.sessionStorage.removeItem(DEMO_SESSION_KEY);
    set({
      currentUser: undefined,
      status: "anonymous",
      pending: false,
      error: undefined,
    });

    try {
      await fetch("/api/provider/session", {
        method: "DELETE",
        credentials: "include",
        headers: { Accept: "application/json" },
      });
    } catch {
      // Local state is cleared even when the server is temporarily unreachable.
    }
  },
}));

export const isDemoAuthAvailable = isDemoMode;
