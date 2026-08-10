import { create } from "zustand";

export type ServicePriceMode =
  | "exact"
  | "startsFrom"
  | "hidden"
  | "consultation";
export type ServiceKey = "haircut" | "hairColor" | "consultation" | "styling";
export type CategoryKey = "hair" | "beauty" | "consulting";

export interface ServiceRecord {
  id: string;
  nameKey?: ServiceKey;
  customName?: string;
  category: CategoryKey;
  durationMinutes: number;
  priceMode: ServicePriceMode;
  priceRials?: number;
  bufferBeforeMinutes: number;
  bufferAfterMinutes: number;
  active: boolean;
  multiServiceCompatible: boolean;
  assignedStaffCount: number;
}

export interface ServiceCategory {
  id: CategoryKey;
  customName?: string;
  active: boolean;
}

const initialServices: ServiceRecord[] = [
  {
    id: "service-haircut",
    nameKey: "haircut",
    category: "hair",
    durationMinutes: 45,
    priceMode: "exact",
    priceRials: 4_500_000,
    bufferBeforeMinutes: 0,
    bufferAfterMinutes: 10,
    active: true,
    multiServiceCompatible: true,
    assignedStaffCount: 3,
  },
  {
    id: "service-color",
    nameKey: "hairColor",
    category: "beauty",
    durationMinutes: 120,
    priceMode: "startsFrom",
    priceRials: 12_000_000,
    bufferBeforeMinutes: 10,
    bufferAfterMinutes: 20,
    active: true,
    multiServiceCompatible: false,
    assignedStaffCount: 2,
  },
  {
    id: "service-consultation",
    nameKey: "consultation",
    category: "consulting",
    durationMinutes: 20,
    priceMode: "consultation",
    bufferBeforeMinutes: 0,
    bufferAfterMinutes: 5,
    active: true,
    multiServiceCompatible: true,
    assignedStaffCount: 2,
  },
  {
    id: "service-styling",
    nameKey: "styling",
    category: "hair",
    durationMinutes: 60,
    priceMode: "hidden",
    bufferBeforeMinutes: 5,
    bufferAfterMinutes: 10,
    active: false,
    multiServiceCompatible: true,
    assignedStaffCount: 1,
  },
];

const initialCategories: ServiceCategory[] = [
  { id: "hair", active: true },
  { id: "beauty", active: true },
  { id: "consulting", active: true },
];

interface ServiceStore {
  services: ServiceRecord[];
  categories: ServiceCategory[];
  toggleService: (serviceId: string) => void;
  addService: (service: Omit<ServiceRecord, "id" | "assignedStaffCount">) => ServiceRecord;
  addCategory: (name: string) => void;
  toggleCategory: (categoryId: CategoryKey) => void;
}

export const useServiceStore = create<ServiceStore>((set, get) => ({
  services: initialServices,
  categories: initialCategories,
  toggleService: (serviceId) =>
    set((state) => ({
      services: state.services.map((service) =>
        service.id === serviceId ? { ...service, active: !service.active } : service,
      ),
    })),
  addService: (service) => {
    const created: ServiceRecord = {
      ...service,
      id: `service-custom-${get().services.length + 1}`,
      assignedStaffCount: 0,
    };
    set((state) => ({ services: [created, ...state.services] }));
    return created;
  },
  addCategory: (name) => {
    const customCategory: ServiceCategory = {
      id: `custom-${get().categories.length + 1}` as CategoryKey,
      customName: name,
      active: true,
    };
    set((state) => ({ categories: [...state.categories, customCategory] }));
  },
  toggleCategory: (categoryId) =>
    set((state) => ({
      categories: state.categories.map((category) =>
        category.id === categoryId
          ? { ...category, active: !category.active }
          : category,
      ),
    })),
}));
