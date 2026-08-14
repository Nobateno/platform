"use client";

import {
  customerSessionFixture,
  getService,
  provider,
  reservationFixtures,
  type ServiceId,
  type StaffId,
  type TimeId,
} from "@/data/customer-fixture";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type BookingStatus = "confirmed" | "pending_approval";
export type ReservationStatus =
  | BookingStatus
  | "cancelled_by_customer"
  | "completed";

export type BookingDraft = {
  staffId: StaffId;
  serviceId: ServiceId | null;
  dateId: string;
  timeId: TimeId | null;
  phone: string;
  name: string;
  verified: boolean;
};

export type ReservationRecord = {
  id: string;
  providerId: string;
  draft: BookingDraft;
  status: ReservationStatus;
  canCancel: boolean;
  createdAt: number;
};

export type CustomerNotification = {
  id: string;
  providerId: string;
  reservationId: string;
  event: "booking_submitted" | "booking_confirmed" | "booking_cancelled";
  createdAt: number;
  read: boolean;
};

export type CustomerProfile = {
  displayName: string;
  phone: string;
  specialRequirements: string;
};

type BookingContextValue = {
  draft: BookingDraft;
  hydrated: boolean;
  reservations: ReservationRecord[];
  notifications: CustomerNotification[];
  profile: CustomerProfile;
  unreadNotificationCount: number;
  setStaff: (staffId: StaffId) => void;
  setService: (serviceId: ServiceId) => void;
  setDate: (dateId: string) => void;
  setTime: (timeId: TimeId) => void;
  setPhone: (phone: string) => void;
  setName: (name: string) => void;
  updateProfile: (updates: Partial<CustomerProfile>) => void;
  verifyPhone: () => void;
  prepareServiceStep: () => void;
  prepareTimeStep: () => void;
  submit: (status: BookingStatus) => string;
  cancelReservation: (reservationId: string) => boolean;
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
  reset: () => void;
};

type StoredSession = {
  draft: BookingDraft;
  reservations: ReservationRecord[];
  notifications: CustomerNotification[];
  profile: CustomerProfile;
};

const storageKey = "nobateno.customer.booking.v3";
const previousStorageKey = "nobateno.customer.booking.v2";

const emptyDraft: BookingDraft = {
  staffId: null,
  serviceId: null,
  dateId: "sun",
  timeId: null,
  phone: "",
  name: "",
  verified: false,
};

const emptyProfile: CustomerProfile = {
  displayName: "",
  phone: "",
  specialRequirements: "",
};

const seededReservations: ReservationRecord[] = reservationFixtures.map(
  (reservation) => ({
    id: reservation.id,
    providerId: provider.id,
    draft: {
      staffId: reservation.staffId,
      serviceId: reservation.serviceId,
      dateId: reservation.dateId,
      timeId: reservation.timeId,
      phone: "",
      name: reservation.customerName,
      verified: true,
    },
    status: reservation.status,
    canCancel: reservation.canCancel,
    createdAt: reservation.createdAt,
  }),
);

const seededNotifications: CustomerNotification[] = seededReservations.map(
  (reservation, index) => ({
    id: `fixture_notification_${reservation.id}`,
    providerId: provider.id,
    reservationId: reservation.id,
    event:
      reservation.status === "cancelled_by_customer"
        ? "booking_cancelled"
        : "booking_confirmed",
    createdAt: reservation.createdAt + index,
    read: index !== 0,
  }),
);

const BookingContext = createContext<BookingContextValue | null>(null);

function isDraft(value: unknown): value is BookingDraft {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<BookingDraft>;
  const validService =
    candidate.serviceId === null ||
    (typeof candidate.serviceId === "string" &&
      ["classic", "beard", "facial", "groom"].includes(candidate.serviceId));
  const validTime =
    candidate.timeId === null ||
    (typeof candidate.timeId === "string" &&
      [
        "09:00",
        "09:30",
        "10:00",
        "10:30",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
      ].includes(candidate.timeId));
  return (
    (candidate.staffId === null ||
      candidate.staffId === "arman" ||
      candidate.staffId === "reza") &&
    validService &&
    typeof candidate.dateId === "string" &&
    validTime &&
    typeof candidate.phone === "string" &&
    (candidate.name === undefined || typeof candidate.name === "string") &&
    typeof candidate.verified === "boolean"
  );
}

function isStoredSession(value: unknown): value is StoredSession {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<StoredSession>;
  return (
    isDraft(candidate.draft) &&
    Array.isArray(candidate.reservations) &&
    Array.isArray(candidate.notifications) &&
    Boolean(candidate.profile) &&
    typeof candidate.profile?.displayName === "string" &&
    typeof candidate.profile?.phone === "string" &&
    typeof candidate.profile?.specialRequirements === "string"
  );
}

function migrationDraft(value: BookingDraft): BookingDraft {
  return { ...emptyDraft, ...value, name: value.name ?? "" };
}

export function BookingProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<BookingDraft>(emptyDraft);
  const [reservations, setReservations] =
    useState<ReservationRecord[]>(seededReservations);
  const [notifications, setNotifications] =
    useState<CustomerNotification[]>(seededNotifications);
  const [profile, setProfile] = useState<CustomerProfile>({
    displayName: customerSessionFixture.displayName,
    phone: customerSessionFixture.verifiedPhoneMasked,
    specialRequirements: customerSessionFixture.specialRequirements,
  });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const raw = window.sessionStorage.getItem(storageKey);
        const previous = window.sessionStorage.getItem(previousStorageKey);
        const stored = raw
          ? (JSON.parse(raw) as unknown)
          : previous
            ? (JSON.parse(previous) as unknown)
            : null;

        if (isStoredSession(stored)) {
          setDraft(migrationDraft(stored.draft));
          setReservations(
            stored.reservations.filter(
              (reservation) => reservation.providerId === provider.id,
            ),
          );
          setNotifications(
            stored.notifications.filter(
              (notification) => notification.providerId === provider.id,
            ),
          );
          setProfile(stored.profile);
        } else if (isDraft(stored)) {
          const migrated = migrationDraft(stored);
          setDraft(migrated);
          setProfile({
            ...emptyProfile,
            displayName: migrated.name,
            phone: migrated.phone,
          });
        }
      } catch {
        window.sessionStorage.removeItem(storageKey);
      } finally {
        setHydrated(true);
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const session: StoredSession = {
      draft,
      reservations,
      notifications,
      profile,
    };
    window.sessionStorage.setItem(storageKey, JSON.stringify(session));
  }, [draft, hydrated, notifications, profile, reservations]);

  const setStaff = useCallback((staffId: StaffId) => {
    setDraft((current) => {
      const service = getService(current.serviceId);
      const compatible =
        !service ||
        staffId === null ||
        (service.staffIds as readonly string[]).includes(staffId);
      return {
        ...current,
        staffId,
        serviceId: compatible ? current.serviceId : null,
        timeId: current.staffId === staffId ? current.timeId : null,
      };
    });
  }, []);

  const setService = useCallback((serviceId: ServiceId) => {
    setDraft((current) => {
      const service = getService(serviceId);
      const compatible =
        current.staffId === null ||
        (service?.staffIds as readonly string[] | undefined)?.includes(
          current.staffId,
        );
      return {
        ...current,
        serviceId,
        staffId: compatible ? current.staffId : null,
        timeId: current.serviceId === serviceId ? current.timeId : null,
      };
    });
  }, []);

  const setDate = useCallback((dateId: string) => {
    setDraft((current) => ({
      ...current,
      dateId,
      timeId: current.dateId === dateId ? current.timeId : null,
    }));
  }, []);

  const setTime = useCallback((timeId: TimeId) => {
    setDraft((current) => ({ ...current, timeId }));
  }, []);

  const setPhone = useCallback((phone: string) => {
    setDraft((current) => ({ ...current, phone, verified: false }));
    setProfile((current) => ({ ...current, phone }));
  }, []);

  const setName = useCallback((name: string) => {
    setDraft((current) => ({ ...current, name }));
    setProfile((current) => ({ ...current, displayName: name }));
  }, []);

  const updateProfile = useCallback((updates: Partial<CustomerProfile>) => {
    const { displayName, phone } = updates;

    setProfile((current) => ({ ...current, ...updates }));

    if (typeof displayName === "string") {
      setDraft((current) => ({
        ...current,
        name: displayName,
      }));
    }

    if (typeof phone === "string") {
      setDraft((current) => ({
        ...current,
        phone,
        verified: false,
      }));
    }
  }, []);

  const verifyPhone = useCallback(() => {
    setDraft((current) => ({ ...current, verified: true }));
  }, []);

  const prepareServiceStep = useCallback(() => {
    setDraft((current) => ({
      ...current,
      serviceId: current.serviceId ?? "classic",
    }));
  }, []);

  const prepareTimeStep = useCallback(() => {
    setDraft((current) => ({
      ...current,
      timeId: current.timeId ?? "10:00",
    }));
  }, []);

  const submit = useCallback(
    (status: BookingStatus) => {
      if (!draft.serviceId || !draft.timeId) {
        throw new Error(
          "A valid service and time are required before booking submission.",
        );
      }
      if (!draft.verified || !draft.phone || !draft.name.trim()) {
        throw new Error(
          "A verified phone number and customer name are required before booking submission.",
        );
      }

      const createdAt = Date.now();
      const reservationId = `res_${status === "pending_approval" ? "pending" : "confirmed"}_${createdAt}`;
      const reservation: ReservationRecord = {
        id: reservationId,
        providerId: provider.id,
        draft: { ...draft },
        status,
        canCancel: true,
        createdAt,
      };
      const notification: CustomerNotification = {
        id: `notification_${createdAt}`,
        providerId: provider.id,
        reservationId,
        event:
          status === "confirmed" ? "booking_confirmed" : "booking_submitted",
        createdAt,
        read: false,
      };

      setReservations((current) => [reservation, ...current]);
      setNotifications((current) => [notification, ...current]);
      return reservationId;
    },
    [draft],
  );

  const cancelReservation = useCallback(
    (reservationId: string) => {
      const reservation = reservations.find(
        (item) => item.id === reservationId && item.providerId === provider.id,
      );
      if (
        !reservation ||
        !reservation.canCancel ||
        reservation.status === "cancelled_by_customer" ||
        reservation.status === "completed"
      )
        return false;

      const createdAt = Date.now();
      setReservations((current) =>
        current.map((item) =>
          item.id === reservationId
            ? {
                ...item,
                status: "cancelled_by_customer" as const,
                canCancel: false,
              }
            : item,
        ),
      );
      setNotifications((current) => [
        {
          id: `notification_cancelled_${createdAt}`,
          providerId: provider.id,
          reservationId,
          event: "booking_cancelled",
          createdAt,
          read: false,
        },
        ...current,
      ]);
      return true;
    },
    [reservations],
  );

  const markNotificationRead = useCallback((notificationId: string) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification,
      ),
    );
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((current) =>
      current.map((notification) => ({ ...notification, read: true })),
    );
  }, []);

  const reset = useCallback(
    () =>
      setDraft({
        ...emptyDraft,
        name: profile.displayName,
        phone: profile.phone,
      }),
    [profile.displayName, profile.phone],
  );

  const unreadNotificationCount = notifications.filter(
    (notification) => !notification.read,
  ).length;
  const value = useMemo(
    () => ({
      draft,
      hydrated,
      reservations,
      notifications,
      profile,
      unreadNotificationCount,
      setStaff,
      setService,
      setDate,
      setTime,
      setPhone,
      setName,
      updateProfile,
      verifyPhone,
      prepareServiceStep,
      prepareTimeStep,
      submit,
      cancelReservation,
      markNotificationRead,
      markAllNotificationsRead,
      reset,
    }),
    [
      cancelReservation,
      draft,
      hydrated,
      markAllNotificationsRead,
      markNotificationRead,
      notifications,
      prepareServiceStep,
      prepareTimeStep,
      profile,
      reservations,
      reset,
      setDate,
      setName,
      setPhone,
      setService,
      setStaff,
      setTime,
      submit,
      unreadNotificationCount,
      updateProfile,
      verifyPhone,
    ],
  );

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context)
    throw new Error("useBooking must be used inside BookingProvider");
  return context;
}
