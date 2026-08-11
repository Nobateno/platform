import type { ReactNode, Ref } from "react";
import nobatenoLogo from "@/assets/images/nobateno-app-logo.svg";
import LanguageSwitcher from "@/shared/ui/components/LanguageSwitcher";
import AuthHeroPanel from "./AuthHeroPanel";

const styles = {
  page:
    "relative isolate min-h-svh overflow-x-clip bg-m3-background text-m3-on-background",
  language: "fixed end-4 top-4 z-50 sm:end-6 sm:top-6",
  shell:
    "container relative z-10 flex min-h-svh w-full flex-col items-center justify-center gap-10 px-5 pb-12 pt-20 sm:px-10 sm:py-14 md:px-20 lg:max-w-[1550px] lg:flex-row lg:gap-12 lg:px-12 lg:py-10 xl:gap-20 xl:px-16 2xl:max-w-[1750px]",
  formPanel:
    "relative flex w-full flex-col rounded-[1.75rem] border border-white/80 bg-m3-surface p-7 shadow-[0_24px_64px_rgb(52_60_115_/_0.12)] sm:max-w-[36rem] sm:p-10 lg:w-[30rem] lg:max-w-none lg:flex-none xl:w-[33rem] xl:p-12 dark:border-m3-outline/35 dark:shadow-[0_24px_64px_rgb(0_0_0_/_0.24)]",
  formContent: "flex h-full w-full flex-col justify-center",
} as const;

interface AuthPageLayoutProps {
  headingId: string;
  headingRef: Ref<HTMLHeadingElement>;
  title: string;
  subtitle: string;
  feedback?: ReactNode;
  children: ReactNode;
  heroTitle: string;
  heroDescription: string;
}

export default function AuthPageLayout({
  headingId,
  headingRef,
  title,
  subtitle,
  feedback,
  children,
  heroTitle,
  heroDescription,
}: AuthPageLayoutProps) {
  return (
    <main className={styles.page}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -start-64 top-1/2 h-[43rem] w-[43rem] -translate-y-1/2 rounded-full bg-m3-primary/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute end-[18%] top-[-14rem] h-[32rem] w-[32rem] rounded-full border border-m3-primary/10 bg-m3-primary-container/25"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute end-[20%] top-[-11rem] h-[26rem] w-[26rem] rounded-full border border-m3-primary/10"
      />
      <div className={styles.language}>
        <LanguageSwitcher />
      </div>

      <div className={styles.shell}>
        <section aria-labelledby={headingId} className={styles.formPanel}>
          <div className={styles.formContent}>
            <img
              src={nobatenoLogo}
              alt=""
              aria-hidden="true"
              className="block h-14 w-14 rounded-[1rem] shadow-m3-1"
            />

            <div className="mt-9">
              <h1
                ref={headingRef}
                id={headingId}
                tabIndex={-1}
                className="text-2xl font-medium leading-relaxed focus:outline-none"
              >
                {title}
              </h1>
              <p className="mt-2.5 leading-relaxed text-m3-on-surface-variant">
                {subtitle}
              </p>
              {feedback}
              {children}
            </div>
          </div>
        </section>

        <AuthHeroPanel title={heroTitle} description={heroDescription} />
      </div>
    </main>
  );
}
