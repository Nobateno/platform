import { create } from "zustand";

export type CustomerTag = "regular" | "priority" | "accessibility";

export interface CustomerReservationSummary {
  id: string;
  serviceKey: "haircut" | "consultation" | "color";
  startsAt: string;
  status: "confirmed" | "completed" | "cancelled";
}

export interface CustomerRecord {
  id: string;
  displayName: string;
  maskedPhone: string;
  description: string;
  tags: CustomerTag[];
  blocked: boolean;
  reservationCount: number;
  lastReservationAt?: string;
  specialRequirements?: string;
  notes: Array<{ id: string; body: string; createdAt: string }>;
  reservations: CustomerReservationSummary[];
}

const initialCustomers: CustomerRecord[] = [
  {
    id: "customer-1024",
    displayName: "Customer 1024",
    maskedPhone: "+98 ••• ••• 2048",
    description: "",
    tags: ["regular"],
    blocked: false,
    reservationCount: 6,
    lastReservationAt: "2026-07-28T07:00:00.000Z",
    notes: [],
    reservations: [
      {
        id: "reservation-2407",
        serviceKey: "haircut",
        startsAt: "2026-08-03T07:00:00.000Z",
        status: "confirmed",
      },
      {
        id: "reservation-2291",
        serviceKey: "consultation",
        startsAt: "2026-07-21T12:30:00.000Z",
        status: "completed",
      },
    ],
  },
  {
    id: "customer-2078",
    displayName: "Customer 2078",
    maskedPhone: "+98 ••• ••• 7812",
    description: "",
    tags: ["priority"],
    blocked: false,
    reservationCount: 12,
    lastReservationAt: "2026-07-30T11:30:00.000Z",
    specialRequirements: "accessibility",
    notes: [],
    reservations: [
      {
        id: "reservation-2452",
        serviceKey: "color",
        startsAt: "2026-08-05T09:00:00.000Z",
        status: "confirmed",
      },
    ],
  },
  {
    id: "customer-3190",
    displayName: "Customer 3190",
    maskedPhone: "+98 ••• ••• 1900",
    description: "",
    tags: ["accessibility"],
    blocked: false,
    reservationCount: 3,
    lastReservationAt: "2026-06-18T14:00:00.000Z",
    specialRequirements: "accessibility",
    notes: [],
    reservations: [],
  },
  {
    id: "customer-4011",
    displayName: "Customer 4011",
    maskedPhone: "+98 ••• ••• 4011",
    description: "",
    tags: [],
    blocked: true,
    reservationCount: 2,
    lastReservationAt: "2026-04-09T08:00:00.000Z",
    notes: [],
    reservations: [],
  },
];

interface CustomerStore {
  customers: CustomerRecord[];
  addCustomer: (record: Omit<CustomerRecord, "id" | "notes" | "reservations" | "reservationCount">) => CustomerRecord;
  addNote: (customerId: string, body: string) => void;
  setBlocked: (customerId: string, blocked: boolean) => void;
}

function nextCustomerId(customers: CustomerRecord[]) {
  return `customer-${5000 + customers.length + 1}`;
}

export const useCustomerStore = create<CustomerStore>((set, get) => ({
  customers: initialCustomers,
  addCustomer: (record) => {
    const customer: CustomerRecord = {
      ...record,
      id: nextCustomerId(get().customers),
      reservationCount: 0,
      notes: [],
      reservations: [],
    };
    set((state) => ({ customers: [customer, ...state.customers] }));
    return customer;
  },
  addNote: (customerId, body) =>
    set((state) => ({
      customers: state.customers.map((customer) =>
        customer.id === customerId
          ? {
              ...customer,
              notes: [
                ...customer.notes,
                {
                  id: `note-${customer.notes.length + 1}`,
                  body,
                  createdAt: new Date().toISOString(),
                },
              ],
            }
          : customer,
      ),
    })),
  setBlocked: (customerId, blocked) =>
    set((state) => ({
      customers: state.customers.map((customer) =>
        customer.id === customerId ? { ...customer, blocked } : customer,
      ),
    })),
}));
