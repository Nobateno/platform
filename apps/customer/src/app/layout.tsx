import type { Metadata, Viewport } from "next";
import { BookingProvider } from "@/lib/booking/booking-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "آرایشگاه خانه نو | رزرو آنلاین نوبت",
  description: "رزرو آنلاین نوبت آرایشگاه خانه نو در تهرانپارس.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#F8F8FF",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa-IR" dir="rtl" suppressHydrationWarning>
      <body>
        <BookingProvider>{children}</BookingProvider>
      </body>
    </html>
  );
}
