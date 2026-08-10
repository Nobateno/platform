import { create } from "zustand";
import {
  allowedStatusTransitions,
  createSeedReservations,
  type Reservation,
  type ReservationStatus,
  type ServiceKey,
  type StaffKey,
} from "@/domains/reservations/model/reservations";

export type ManualBookingInput = {
  customerName: string;
  customerPhone: string;
  service: ServiceKey;
  staff: StaffKey;
  date: string;
  time: string;
  note?: string;
};

type ManualBookingResult =
  | { ok: true; reservation: Reservation }
  | { ok: false; reason: "conflict" };

type ReservationState = {
  reservations: Reservation[];
  createManualBooking: (input: ManualBookingInput) => ManualBookingResult;
  updateStatus: (id: string, status: ReservationStatus) => boolean;
  reset: () => void;
};

const serviceDurations: Record<ServiceKey, number> = {
  consultation: 45,
  followUp: 30,
  wellness: 60,
  assessment: 45,
};

const timeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const seedReservations = () =>
  import.meta.env.DEV || import.meta.env.MODE === "test"
    ? createSeedReservations()
    : [];

export const useReservationStore = create<ReservationState>((set, get) => ({
  reservations: seedReservations(),
  createManualBooking: (input) => {
    const current = get().reservations;
    const durationMinutes = serviceDurations[input.service];
    const requestedStart = timeToMinutes(input.time);
    const requestedEnd = requestedStart + durationMinutes;
    const hasConflict = current.some((reservation) => {
      if (
        reservation.date !== input.date ||
        reservation.staff !== input.staff ||
        reservation.status === "cancelled" ||
        reservation.status === "rejected"
      ) {
        return false;
      }

      const existingStart = timeToMinutes(reservation.time);
      const existingEnd = existingStart + reservation.durationMinutes;
      return requestedStart < existingEnd && existingStart < requestedEnd;
    });
    if (hasConflict) return { ok: false, reason: "conflict" };

    const highestReference = current.reduce((highest, reservation) => {
      const numericReference = Number(reservation.id.replace("NOB-", ""));
      return Number.isFinite(numericReference)
        ? Math.max(highest, numericReference)
        : highest;
    }, 2052);
    const reservation: Reservation = {
      id: `NOB-${highestReference + 1}`,
      date: input.date,
      time: input.time,
      durationMinutes,
      service: input.service,
      staff: input.staff,
      customerKind: "manual",
      customerLabel: input.customerName.trim(),
      customerPhone: input.customerPhone.trim(),
      source: "manual",
      status: "approved",
      note: input.note?.trim() || undefined,
    };
    set({ reservations: [reservation, ...current] });
    return { ok: true, reservation };
  },
  updateStatus: (id, nextStatus) => {
    const current = get().reservations;
    const reservation = current.find(({ id: reservationId }) => reservationId === id);
    if (
      !reservation ||
      !allowedStatusTransitions[reservation.status].includes(nextStatus)
    ) {
      return false;
    }
    set({
      reservations: current.map((item) =>
        item.id === id ? { ...item, status: nextStatus } : item,
      ),
    });
    return true;
  },
  reset: () => set({ reservations: seedReservations() }),
}));
