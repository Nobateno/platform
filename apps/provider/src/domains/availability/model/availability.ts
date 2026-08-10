export type DayKey =
  | "saturday"
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday";

export type DayAvailability = {
  day: DayKey;
  enabled: boolean;
  start: string;
  end: string;
};

export type AvailabilityException = {
  id: string;
  date: string;
  type: "closed" | "custom";
  start?: string;
  end?: string;
};

export const defaultWeeklyAvailability: DayAvailability[] = [
  { day: "saturday", enabled: true, start: "09:00", end: "18:00" },
  { day: "sunday", enabled: true, start: "09:00", end: "18:00" },
  { day: "monday", enabled: true, start: "09:00", end: "18:00" },
  { day: "tuesday", enabled: true, start: "09:00", end: "18:00" },
  { day: "wednesday", enabled: true, start: "09:00", end: "18:00" },
  { day: "thursday", enabled: true, start: "09:00", end: "15:00" },
  { day: "friday", enabled: false, start: "09:00", end: "18:00" },
];

export const findWeeklyConflicts = (schedule: DayAvailability[]) =>
  schedule
    .filter(({ enabled, start, end }) => enabled && start >= end)
    .map(({ day }) => day);

export const findExceptionConflicts = (
  exceptions: AvailabilityException[],
) =>
  exceptions
    .filter(
      ({ type, start, end }) =>
        type === "custom" && (!start || !end || start >= end),
    )
    .map(({ id }) => id);
