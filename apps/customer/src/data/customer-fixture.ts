import type { CustomerExperienceConfig } from "@nobateno/ui-kit/customer-experience";

export type Locale = "fa" | "en";
export type StaffId = "arman" | "reza" | null;
export type ServiceId = "classic" | "beard" | "facial" | "groom";
export type TimeId =
  | "09:00"
  | "09:30"
  | "10:00"
  | "10:30"
  | "11:00"
  | "12:00"
  | "13:00"
  | "14:00"
  | "15:00"
  | "16:00"
  | "17:00"
  | "18:00";

type Localized = Record<Locale, string>;

export const provider = {
  id: "tenant_barber_khaneh_no",
  name: {
    fa: "آرایشگاه خانه نو",
    en: "Khaneh No Barbershop",
  },
  shortName: {
    fa: "خانه نو",
    en: "Khaneh No",
  },
  meta: {
    fa: "آرایشگاه مردانه · تهرانپارس",
    en: "Men's barbershop · Tehranpars",
  },
  primary: "#5365D8",
  bookingMode: "instant" as const,
};

/**
 * Fixture representation of values that the provider panel will persist and
 * inject for this provider-owned customer surface. The customer app reads this
 * contract first; query parameters are kept as a local preview override only.
 */
export const customerExperience: CustomerExperienceConfig = {
  providerId: provider.id,
  locale: "fa",
  theme: "light",
  primary: provider.primary,
  bookingEntry: "profile",
  bookingConfirmation: provider.bookingMode === "instant" ? "instant" : "approval",
  cancellationWindowHours: 24,
};

/**
 * Tenant-scoped returning-customer data mapped from the canonical Khaneh No
 * fixture. It gives the local panel meaningful self-service states before the
 * provider API is connected; it never represents cross-provider history.
 */
export const customerSessionFixture = {
  displayName: "امیر صالحی",
  verifiedPhoneMasked: "0935***1100",
  specialRequirements: "برای اصلاح ریش، خط گونه خیلی تیز نباشد.",
} as const;

export const reservationFixtures = [
  {
    id: "res_barber_confirmed_001",
    status: "confirmed" as const,
    serviceId: "classic" as const,
    staffId: "arman" as const,
    dateId: "sun",
    timeId: "10:00" as const,
    customerName: customerSessionFixture.displayName,
    canCancel: true,
    createdAt: Date.parse("2026-07-01T09:00:00+03:30"),
  },
  {
    id: "res_barber_provider_assigned_001",
    status: "confirmed" as const,
    serviceId: "classic" as const,
    staffId: null,
    dateId: "sun",
    timeId: "12:00" as const,
    customerName: customerSessionFixture.displayName,
    canCancel: true,
    createdAt: Date.parse("2026-06-30T09:00:00+03:30"),
  },
  {
    id: "res_barber_cancelled_001",
    status: "cancelled_by_customer" as const,
    serviceId: "beard" as const,
    staffId: "reza" as const,
    dateId: "sat",
    timeId: "18:00" as const,
    customerName: customerSessionFixture.displayName,
    canCancel: false,
    createdAt: Date.parse("2026-06-24T09:00:00+03:30"),
  },
] as const;

export const customerTerms = {
  title: "قوانین رزرو پیرایش خانه نو",
  sections: [
    {
      heading: "تأیید نوبت",
      body: "زمان‌های آزاد فوری تأیید می‌شن. اگر زمان پر شده باشه، باید زمان دیگری انتخاب کنی.",
    },
    {
      heading: "لغو نوبت",
      body: "تا ۶ ساعت مانده به نوبت می‌تونی آنلاین لغو کنی. بعد از آن برای هماهنگی باید با آرایشگاه تماس بگیری.",
    },
    {
      heading: "دیر رسیدن",
      body: "اگر بیشتر از ۵ دقیقه دیر برسی، ممکن است نوبت به زمان بعدی منتقل شود.",
    },
  ],
  cancellationCutoffHours: 6,
  contactLabel: "تماس با آرایشگاه",
} as const;

export const assets = {
  cover: "/images/khaneh-no/interior-cover.jpg",
  arman: "/images/khaneh-no/arman-kiani.jpg",
  reza: "/images/khaneh-no/reza-moradi.jpg",
  fade: "/images/khaneh-no/gallery-fade.jpg",
  beard: "/images/khaneh-no/gallery-beard.jpg",
  trim: "/images/khaneh-no/gallery-trim.jpg",
} as const;

export const staff = [
  {
    id: "arman" as const,
    name: { fa: "آرمان کیانی", en: "Arman Kiani" },
    role: { fa: "کوتاهی کلاسیک و استایل مو", en: "Classic cuts and styling" },
    image: assets.arman,
  },
  {
    id: "reza" as const,
    name: { fa: "رضا مرادی", en: "Reza Moradi" },
    role: { fa: "ریش، فیشیال و مراقبت مو", en: "Beard, facial and hair care" },
    image: assets.reza,
  },
] as const;

export const services = [
  {
    id: "classic" as const,
    name: { fa: "کوتاهی کلاسیک", en: "Classic haircut" },
    description: { fa: "کوتاهی، شست‌وشو و حالت‌دهی", en: "Cut, wash and styling" },
    detail: { fa: "۴۰ دقیقه · ۴۲۰٬۰۰۰ تومان", en: "40 min · 420,000 toman" },
    price: { fa: "۴۲۰٬۰۰۰ تومان", en: "420,000 toman" },
    duration: { fa: "۴۰ دقیقه", en: "40 min" },
    image: assets.fade,
    staffIds: ["arman", "reza"] as const,
  },
  {
    id: "beard" as const,
    name: { fa: "اصلاح و فرم‌دهی ریش", en: "Beard trim and shaping" },
    description: { fa: "اصلاح، خط‌گیری و مرتب‌سازی", en: "Trim, line-up and styling" },
    detail: { fa: "۲۵ دقیقه · ۲۶۰٬۰۰۰ تومان", en: "25 min · 260,000 toman" },
    price: { fa: "۲۶۰٬۰۰۰ تومان", en: "260,000 toman" },
    duration: { fa: "۲۵ دقیقه", en: "25 min" },
    image: assets.beard,
    staffIds: ["arman", "reza"] as const,
  },
  {
    id: "facial" as const,
    name: { fa: "پاکسازی صورت", en: "Facial cleansing" },
    description: { fa: "پاکسازی و مراقبت پایه پوست", en: "Cleanse and basic skin care" },
    detail: { fa: "۴۵ دقیقه · از ۶۵۰٬۰۰۰ تومان", en: "45 min · from 650,000 toman" },
    price: { fa: "از ۶۵۰٬۰۰۰ تومان", en: "from 650,000 toman" },
    duration: { fa: "۴۵ دقیقه", en: "45 min" },
    image: assets.trim,
    staffIds: ["reza"] as const,
  },
  {
    id: "groom" as const,
    name: { fa: "پکیج داماد", en: "Groom package" },
    description: { fa: "مو، ریش و آماده‌سازی نهایی", en: "Hair, beard and finishing" },
    detail: { fa: "۱۲۰ دقیقه · قیمت بعد از هماهنگی", en: "120 min · price after consultation" },
    price: { fa: "قیمت بعد از هماهنگی", en: "price after consultation" },
    duration: { fa: "۱۲۰ دقیقه", en: "120 min" },
    image: assets.cover,
    staffIds: ["arman"] as const,
  },
] as const;

export const dateOptions = [
  { id: "sat", day: { fa: "۴", en: "4" }, weekday: { fa: "ش", en: "SAT" }, label: { fa: "شنبه ۱۳ تیر", en: "Saturday, July 4" } },
  { id: "sun", day: { fa: "۵", en: "5" }, weekday: { fa: "ی", en: "SUN" }, label: { fa: "یکشنبه ۱۴ تیر", en: "Sunday, July 5" } },
  { id: "mon", day: { fa: "۶", en: "6" }, weekday: { fa: "د", en: "MON" }, label: { fa: "دوشنبه ۱۵ تیر", en: "Monday, July 6" } },
  { id: "tue", day: { fa: "۷", en: "7" }, weekday: { fa: "س", en: "TUE" }, label: { fa: "سه‌شنبه ۱۶ تیر", en: "Tuesday, July 7" } },
  { id: "wed", day: { fa: "۸", en: "8" }, weekday: { fa: "چ", en: "WED" }, label: { fa: "چهارشنبه ۱۷ تیر", en: "Wednesday, July 8" } },
  { id: "thu", day: { fa: "۹", en: "9" }, weekday: { fa: "پ", en: "THU" }, label: { fa: "پنجشنبه ۱۸ تیر", en: "Thursday, July 9" } },
  { id: "fri", day: { fa: "۱۰", en: "10" }, weekday: { fa: "ج", en: "FRI" }, label: { fa: "جمعه ۱۹ تیر", en: "Friday, July 10" } },
] as const;

export const timeSlots = [
  { id: "09:00" as const, group: "morning", value: { fa: "۰۹:۰۰ – ۰۹:۴۰", en: "09:00 - 09:40" } },
  { id: "09:30" as const, group: "morning", value: { fa: "۰۹:۳۰ – ۱۰:۱۰", en: "09:30 - 10:10" } },
  { id: "10:00" as const, group: "morning", value: { fa: "۱۰:۰۰ – ۱۰:۴۰", en: "10:00 - 10:40" } },
  { id: "10:30" as const, group: "morning", value: { fa: "۱۰:۳۰ – ۱۱:۱۰", en: "10:30 - 11:10" } },
  { id: "11:00" as const, group: "morning", value: { fa: "۱۱:۰۰ – ۱۱:۴۰", en: "11:00 - 11:40" } },
  { id: "12:00" as const, group: "morning", value: { fa: "۱۲:۰۰ – ۱۲:۴۰", en: "12:00 - 12:40" } },
  { id: "13:00" as const, group: "afternoon", value: { fa: "۱۳:۰۰ – ۱۳:۴۰", en: "13:00 - 13:40" } },
  { id: "14:00" as const, group: "afternoon", value: { fa: "۱۴:۰۰ – ۱۴:۴۰", en: "14:00 - 14:40" } },
  { id: "15:00" as const, group: "afternoon", value: { fa: "۱۵:۰۰ – ۱۵:۴۰", en: "15:00 - 15:40" } },
  { id: "16:00" as const, group: "afternoon", value: { fa: "۱۶:۰۰ – ۱۶:۴۰", en: "16:00 - 16:40" } },
  { id: "17:00" as const, group: "afternoon", value: { fa: "۱۷:۰۰ – ۱۷:۴۰", en: "17:00 - 17:40" } },
  { id: "18:00" as const, group: "afternoon", value: { fa: "۱۸:۰۰ – ۱۸:۴۰", en: "18:00 - 18:40" } },
] as const;

export const copy = {
  fa: {
    direction: "rtl" as const,
    online: "آنلاین",
    book: "رزرو نوبت",
    highlights: "هایلایت‌ها",
    highlightItems: ["کوتاهی", "ریش", "داماد", "بهداشت"],
    tabs: ["گالری", "خدمات", "متخصص‌ها", "تماس"],
    gallery: "گالری",
    steps: ["متخصص", "خدمت", "زمان", "مرور و ثبت"],
    staffTitle: "متخصصت رو انتخاب کن",
    staffSubtitle: "متخصص مدنظرت رو انتخاب کن یا به مجموعه بسپر.",
    providerChoice: "انتخاب با مجموعه",
    providerChoiceBody: "مجموعه متخصص مناسب رو برات انتخاب می‌کنه.",
    staffLabel: "متخصص",
    staffCta: "انتخاب خدمت",
    serviceTitle: "چه خدمتی می‌خوای؟",
    serviceSubtitle: "برای ادامه، یک خدمت انتخاب کن.",
    search: "جست‌وجوی خدمت",
    categories: ["همه", "مو", "ریش", "مراقبت"],
    serviceLabel: "خدمت",
    serviceCta: "انتخاب زمان",
    timeTitle: "زمان نوبت رو انتخاب کن",
    timeSubtitle: "فقط زمان‌های خالی قابل انتخاب‌اند.",
    month: "تیر ۱۴۰۵",
    morning: "صبح",
    afternoon: "بعدازظهر",
    timeLabel: "زمان",
    timeCta: "مرور نوبت",
    reviewTitle: "نوبتت رو مرور کن",
    reviewSubtitle: "قبل از ادامه، جزئیات رو یک بار چک کن.",
    reviewLabels: ["خدمت", "متخصص", "تاریخ", "ساعت"],
    instantTitle: "تأیید فوری",
    instantBody: "بعد از ثبت، نوبتت همون لحظه قطعی می‌شه.",
    cancellation: "تا ۶ ساعت قبل از نوبت می‌تونی رایگان لغوش کنی.",
    estimatedTotal: "هزینه تقریبی",
    confirm: "تأیید نوبت",
    phoneTitle: "برای تأیید نوبت وارد شو",
    phoneBody: "شماره موبایلت فقط برای اطلاع‌رسانی نوبت استفاده می‌شه.",
    phoneLabel: "شماره موبایل",
    continue: "ادامه",
    otpTitle: "کد تأیید را وارد کن",
    otpBody: "کد شش‌رقمی برای شماره‌ات ارسال شد.",
    resultTitle: "نوبتت قطعی شد",
    resultBody: "جزئیات نوبت در پروفایل همین مجموعه ذخیره شد.",
  },
  en: {
    direction: "ltr" as const,
    online: "Online",
    book: "Book appointment",
    highlights: "Highlights",
    highlightItems: ["Haircuts", "Beard", "Groom", "Hygiene"],
    tabs: ["Gallery", "Services", "Specialists", "Contact"],
    gallery: "Gallery",
    steps: ["Specialist", "Service", "Time", "Review & submit"],
    staffTitle: "Choose a specialist",
    staffSubtitle: "Pick someone you trust, or let the provider choose.",
    providerChoice: "Let the provider choose",
    providerChoiceBody: "They'll match you with the right specialist.",
    staffLabel: "Specialist",
    staffCta: "Choose a service",
    serviceTitle: "Choose a service",
    serviceSubtitle: "Pick the service you'd like to book.",
    search: "Search services",
    categories: ["All", "Hair", "Beard", "Care"],
    serviceLabel: "Service",
    serviceCta: "Choose a time",
    timeTitle: "Choose a time",
    timeSubtitle: "Pick a date and time that works for you.",
    month: "July 2026",
    morning: "Morning",
    afternoon: "Afternoon",
    timeLabel: "Time",
    timeCta: "Review booking",
    reviewTitle: "Review your booking",
    reviewSubtitle: "Make sure everything looks right before you continue.",
    reviewLabels: ["Service", "Specialist", "Date", "Time"],
    instantTitle: "Instant confirmation",
    instantBody: "Confirmed immediately after you submit.",
    cancellation: "Cancel free up to 6 hours before.",
    estimatedTotal: "Estimated total",
    confirm: "Confirm booking",
    phoneTitle: "Sign in to confirm",
    phoneBody: "Your number is used only for appointment updates.",
    phoneLabel: "Mobile number",
    continue: "Continue",
    otpTitle: "Enter verification code",
    otpBody: "We sent a six-digit code to your phone.",
    resultTitle: "Your appointment is confirmed",
    resultBody: "The appointment was saved to this provider profile.",
  },
} as const;

export function getService(id: ServiceId | null | undefined) {
  return services.find((service) => service.id === id);
}

export function getStaff(id: StaffId | undefined) {
  return staff.find((member) => member.id === id);
}

export function getDate(id: string | undefined) {
  return dateOptions.find((date) => date.id === id) ?? dateOptions[1];
}

export function getTime(id: TimeId | null | undefined) {
  return timeSlots.find((slot) => slot.id === id);
}

export function localize(value: Localized, locale: Locale) {
  return value[locale];
}
