"use client";

import ProviderButton from "@nobateno/ui-kit/provider-button";
import {
  copy,
  getDate,
  provider,
  services,
  staff,
  timeSlots,
  type Locale,
} from "@/data/customer-fixture";
import { useBooking, type BookingStatus } from "@/lib/booking/booking-context";
import {
  CustomerReferenceScreen,
  screenPaletteStyle,
  type ColorPalette,
  type ScreenContext,
} from "@/views/customer-panel/reference-svg";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState, type CSSProperties } from "react";

type CoreScreen = "profile" | "staff" | "service" | "time" | "review";
type SheetStage = "phone" | "otp" | "name";

const lightPalette: ColorPalette = {
  background: "#F8F8FF",
  surface: "#FFFFFF",
  surfaceContainer: "#F0F1FA",
  surfaceHigh: "#E4E6F2",
  primary: "#5365D8",
  onPrimary: "#FFFFFF",
  primaryContainer: "#DEE1FF",
  onPrimaryContainer: "#11194C",
  onSurface: "#151724",
  muted: "#676A7D",
  outline: "#C4C5D3",
  success: "#1F7A5F",
};

const darkPalette: ColorPalette = {
  background: "#10111B",
  surface: "#151620",
  surfaceContainer: "#1F202B",
  surfaceHigh: "#2A2B37",
  primary: "#BEC2FF",
  onPrimary: "#222A73",
  primaryContainer: "#3B4790",
  onPrimaryContainer: "#DEE1FF",
  onSurface: "#E5E6F2",
  muted: "#B7B8C9",
  outline: "#4D4E60",
  success: "#79D9B9",
};

function normalizeDigits(value: string) {
  return value
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)))
    .replace(/[^0-9+]/g, "");
}

function safeHex(value: string | null) {
  if (!value) return null;
  const normalized = value.startsWith("#") ? value : `#${value}`;
  return /^#[0-9a-f]{6}$/i.test(normalized) ? normalized : null;
}

function hitStyle(x: number, y: number, width: number, height: number): CSSProperties {
  return {
    left: `${(x / 390) * 100}%`,
    top: `${(y / 844) * 100}%`,
    width: `${(width / 390) * 100}%`,
    height: `${(height / 844) * 100}%`,
  };
}

function resolveScreen(pathname: string): CoreScreen | null {
  if (pathname === "/") return "profile";
  if (pathname === "/booking" || pathname === "/booking/staff") return "staff";
  if (pathname === "/booking/service" || pathname === "/services") return "service";
  if (pathname === "/booking/time") return "time";
  if (pathname === "/booking/checkout") return "review";
  return null;
}

function preserveOptions(path: string, searchParams: ReturnType<typeof useSearchParams>) {
  const options = new URLSearchParams();
  for (const key of ["lang", "locale", "theme", "primary", "mode"]) {
    const value = searchParams.get(key);
    if (value) options.set(key, value);
  }
  const query = options.toString();
  return query ? `${path}?${query}` : path;
}

function CustomerPanelContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const booking = useBooking();
  const [sheetStage, setSheetStage] = useState<SheetStage | null>(null);
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");

  const locale: Locale = searchParams.get("lang") === "en" || searchParams.get("locale") === "en" ? "en" : "fa";
  const rtl = locale === "fa";
  const isDark = searchParams.get("theme") === "dark";
  const configuredPrimary = safeHex(searchParams.get("primary"));
  const palette = useMemo(() => ({ ...(isDark ? darkPalette : lightPalette), primary: configuredPrimary ?? (isDark ? darkPalette.primary : provider.primary) }), [configuredPrimary, isDark]);
  const context: ScreenContext = { locale, rtl, strings: copy[locale], palette };
  const coreScreen = resolveScreen(pathname);
  const bookingStatus: BookingStatus = searchParams.get("mode") === "pending" ? "pending_approval" : "confirmed";
  const navigate = (path: string) => {
    window.scrollTo(0, 0);
    router.push(preserveOptions(path, searchParams), { scroll: true });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const continueReview = () => {
    if (!booking.draft.serviceId || !booking.draft.timeId) return;
    if (booking.draft.verified) {
      const id = booking.submit(bookingStatus);
      navigate(`/booking/result/${id}`);
      return;
    }
    setSheetStage("phone");
  };

  const finaliseSheet = () => {
    const id = booking.submit(bookingStatus);
    setSheetStage(null);
    navigate(`/booking/result/${id}`);
  };

  return (
    <main className="customer-panel-root" style={screenPaletteStyle(palette)} lang={locale === "fa" ? "fa-IR" : "en"} dir={rtl ? "rtl" : "ltr"}>
      {coreScreen ? (
        <section className="customer-wireframe-shell" aria-label={locale === "fa" ? "رزرو آنلاین خانه نو" : "Khaneh No online booking"}>
          <div className="customer-wireframe-canvas">
            <CustomerReferenceScreen screen={coreScreen} context={context} draft={booking.draft} />
            <div className="customer-hit-layer">
              {coreScreen === "profile" && <HitButton label={copy[locale].book} style={hitStyle(16, 779, 358, 56)} onClick={() => navigate("/booking/staff")} />}
              {coreScreen === "staff" && <>
                <HitButton label={copy[locale].providerChoice} style={hitStyle(16, 248, 358, 79)} onClick={() => booking.setStaff(null)} />
                {staff.map((member, index) => <HitButton key={member.id} label={member.name[locale]} style={hitStyle(16, 336 + index * 88, 358, 79)} onClick={() => booking.setStaff(member.id)} />)}
                <HitButton label={copy[locale].staffCta} style={hitStyle(16, 779, 358, 56)} onClick={() => { booking.prepareServiceStep(); navigate("/booking/service"); }} />
              </>}
              {coreScreen === "service" && <>
                {services.map((service, index) => <HitButton key={service.id} label={service.name[locale]} style={hitStyle(16, 352 + index * 88, 358, 79)} onClick={() => booking.setService(service.id)} />)}
                <HitButton label={copy[locale].serviceCta} disabled={!booking.draft.serviceId} style={hitStyle(16, 779, 358, 56)} onClick={() => { if (!booking.draft.serviceId) return; booking.prepareTimeStep(); navigate("/booking/time"); }} />
              </>}
              {coreScreen === "time" && <>
                {dateOptionsForHit().map((date, index) => <HitButton key={date} label={getDate(date).label[locale]} style={hitStyle(rtl ? 328 - index * 52 : 16 + index * 52, 288, 44, 68)} onClick={() => booking.setDate(date)} />)}
                {timeSlots.map((slot, index) => <HitButton key={slot.id} label={slot.value[locale]} style={hitStyle(16 + (index % 3) * 122, index < 6 ? 391 + Math.floor(index / 3) * 56 : 531 + Math.floor((index - 6) / 3) * 56, 114, 48)} onClick={() => booking.setTime(slot.id)} />)}
                <HitButton label={copy[locale].timeCta} disabled={!booking.draft.timeId} style={hitStyle(16, 779, 358, 56)} onClick={() => { if (booking.draft.timeId) navigate("/booking/checkout"); }} />
              </>}
              {coreScreen === "review" && <HitButton label={copy[locale].confirm} style={hitStyle(16, 772, 358, 56)} onClick={continueReview} />}
            </div>
          </div>
        </section>
      ) : (
        <SupportingScreen context={context} pathname={pathname} status={bookingStatus} onBook={() => navigate("/booking/staff")} />
      )}
      {sheetStage && <AuthenticationSheet context={context} stage={sheetStage} phone={booking.draft.phone} otp={otp} name={name} onPhoneChange={booking.setPhone} onOtpChange={setOtp} onNameChange={setName} onClose={() => setSheetStage(null)} onNext={() => {
        if (sheetStage === "phone") {
          if (normalizeDigits(booking.draft.phone).replace(/^\+98/, "0").length >= 10) setSheetStage("otp");
          return;
        }
        if (sheetStage === "otp") {
          if (normalizeDigits(otp).length === 6) { booking.verifyPhone(); setSheetStage("name"); }
          return;
        }
        if (name.trim().length >= 2) finaliseSheet();
      }} />}
    </main>
  );
}

function dateOptionsForHit() {
  return ["sat", "sun", "mon", "tue", "wed", "thu", "fri"];
}

function HitButton({ label, style, onClick, disabled = false }: { label: string; style: CSSProperties; onClick: () => void; disabled?: boolean }) {
  return <button type="button" className="customer-hit-button" style={style} onClick={onClick} aria-label={label} disabled={disabled} />;
}

function AuthenticationSheet({ context, stage, phone, otp, name, onPhoneChange, onOtpChange, onNameChange, onClose, onNext }: { context: ScreenContext; stage: SheetStage; phone: string; otp: string; name: string; onPhoneChange: (value: string) => void; onOtpChange: (value: string) => void; onNameChange: (value: string) => void; onClose: () => void; onNext: () => void }) {
  const title = stage === "phone" ? context.strings.phoneTitle : stage === "otp" ? context.strings.otpTitle : context.locale === "fa" ? "اسمت رو وارد کن" : "What should we call you?";
  const body = stage === "phone" ? context.strings.phoneBody : stage === "otp" ? context.strings.otpBody : context.locale === "fa" ? "این نام در نوبت‌های همین مجموعه دیده می‌شه." : "This name appears on reservations for this provider.";
  const action = stage === "phone" ? context.strings.continue : stage === "otp" ? context.strings.continue : context.strings.confirm;
  return <div className="customer-sheet-backdrop" role="presentation">
    <section className="customer-auth-sheet" role="dialog" aria-modal="true" aria-labelledby="auth-sheet-title">
      <button type="button" className="customer-sheet-close" onClick={onClose} aria-label={context.locale === "fa" ? "بستن" : "Close"}>×</button>
      <div className="customer-sheet-handle" />
      <h2 id="auth-sheet-title">{title}</h2>
      <p>{body}</p>
      {stage === "phone" && <label className="customer-sheet-field"><span>{context.strings.phoneLabel}</span><input value={phone} onChange={(event) => onPhoneChange(normalizeDigits(event.target.value))} inputMode="tel" autoComplete="tel" dir="ltr" placeholder="0912 000 0000" /></label>}
      {stage === "otp" && <label className="customer-sheet-field"><span dir="ltr">OTP</span><input className="customer-otp-input" value={otp} onChange={(event) => onOtpChange(normalizeDigits(event.target.value).slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" dir="ltr" maxLength={6} placeholder="• • • • • •" /></label>}
      {stage === "name" && <label className="customer-sheet-field"><span>{context.locale === "fa" ? "نام" : "Name"}</span><input value={name} onChange={(event) => onNameChange(event.target.value)} autoComplete="name" placeholder={context.locale === "fa" ? "مثلاً امیر صالحی" : "For example, Amir Salehi"} /></label>}
      <ProviderButton variant="primary" className="customer-kit-button" onClick={onNext}>{action}</ProviderButton>
    </section>
  </div>;
}

function SupportingScreen({ context, pathname, status, onBook }: { context: ScreenContext; pathname: string; status: BookingStatus; onBook: () => void }) {
  const isResult = pathname.startsWith("/booking/result/");
  const isPending = status === "pending_approval";
  const title = isResult ? (isPending ? (context.locale === "fa" ? "درخواستت ثبت شد" : "Your request is submitted") : context.strings.resultTitle) : pathname.startsWith("/profile") ? (context.locale === "fa" ? "نوبت‌های من" : "My appointments") : (context.locale === "fa" ? "قوانین رزرو" : "Booking terms");
  const body = isResult ? (isPending ? (context.locale === "fa" ? "مجموعه زمان را بررسی می‌کند و نتیجه را خبر می‌دهد." : "The provider will review the time and let you know.") : context.strings.resultBody) : context.locale === "fa" ? "این بخش برای تجربه کامل رزرو در همین مجموعه آماده است." : "This surface is ready for the provider-scoped booking experience.";
  return <section className="customer-support-screen">
    <div className={isPending ? "customer-status-icon customer-status-icon--pending" : "customer-status-icon"}>✓</div>
    <h1>{title}</h1>
    <p>{body}</p>
    <div className="customer-support-summary">
      <span>{context.locale === "fa" ? "مجموعه" : "Provider"}</span>
      <strong>{provider.name[context.locale]}</strong>
      <span>{context.locale === "fa" ? "وضعیت" : "Status"}</span>
      <strong>{isPending ? (context.locale === "fa" ? "منتظر پاسخ مجموعه" : "Waiting for provider") : (context.locale === "fa" ? "تأیید شده" : "Confirmed")}</strong>
    </div>
    <ProviderButton variant="primary" className="customer-kit-button" onClick={onBook}>{context.strings.book}</ProviderButton>
  </section>;
}

export default function CustomerPanelApp() {
  return <Suspense fallback={<main className="customer-panel-root" />}><CustomerPanelContent /></Suspense>;
}
