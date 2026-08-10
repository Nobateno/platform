export type ReservationStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "cancelled"
  | "completed"
  | "noShow";

export type ReservationSource = "online" | "manual" | "voice";
export type ServiceKey = "consultation" | "followUp" | "wellness" | "assessment";
export type StaffKey = "owner" | "specialist" | "team";
export type CustomerKind = "new" | "returning" | "manual";

export type Reservation = {
  id: string;
  date: string;
  time: string;
  durationMinutes: number;
  service: ServiceKey;
  staff: StaffKey;
  customerKind: CustomerKind;
  customerLabel?: string;
  customerPhone?: string;
  source: ReservationSource;
  status: ReservationStatus;
  noteKey?: "intake" | "accessibility";
  note?: string;
};

const localIsoDate = (referenceDate: Date, offset: number) => {
  const value = new Date(referenceDate);
  value.setHours(12, 0, 0, 0);
  value.setDate(value.getDate() + offset);
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const createSeedReservations = (
  referenceDate = new Date(),
): Reservation[] => [
  {
    id: "NOB-2048",
    date: localIsoDate(referenceDate, 0),
    time: "09:00",
    durationMinutes: 45,
    service: "consultation",
    staff: "owner",
    customerKind: "new",
    source: "online",
    status: "approved",
    noteKey: "intake",
  },
  {
    id: "NOB-2049",
    date: localIsoDate(referenceDate, 0),
    time: "10:30",
    durationMinutes: 30,
    service: "followUp",
    staff: "specialist",
    customerKind: "returning",
    source: "voice",
    status: "pending",
  },
  {
    id: "NOB-2050",
    date: localIsoDate(referenceDate, 0),
    time: "13:00",
    durationMinutes: 60,
    service: "wellness",
    staff: "team",
    customerKind: "new",
    source: "manual",
    status: "approved",
    noteKey: "accessibility",
  },
  {
    id: "NOB-2051",
    date: localIsoDate(referenceDate, 1),
    time: "11:00",
    durationMinutes: 45,
    service: "assessment",
    staff: "owner",
    customerKind: "returning",
    source: "online",
    status: "pending",
  },
  {
    id: "NOB-2052",
    date: localIsoDate(referenceDate, 3),
    time: "16:00",
    durationMinutes: 30,
    service: "followUp",
    staff: "specialist",
    customerKind: "returning",
    source: "online",
    status: "approved",
  },
  {
    id: "NOB-2046",
    date: localIsoDate(referenceDate, -1),
    time: "15:30",
    durationMinutes: 45,
    service: "consultation",
    staff: "owner",
    customerKind: "new",
    source: "online",
    status: "completed",
  },
  {
    id: "NOB-2045",
    date: localIsoDate(referenceDate, -2),
    time: "12:00",
    durationMinutes: 60,
    service: "wellness",
    staff: "team",
    customerKind: "returning",
    source: "manual",
    status: "cancelled",
  },
];

export const allowedStatusTransitions: Record<
  ReservationStatus,
  ReservationStatus[]
> = {
  pending: ["approved", "rejected"],
  approved: ["cancelled", "completed", "noShow"],
  rejected: [],
  cancelled: [],
  completed: [],
  noShow: [],
};
