import type { ReactNode, Ref } from "react";
import nobatenoLogo from "@/assets/images/nobateno-app-logo.svg";
import LanguageSwitcher from "@/shared/ui/components/LanguageSwitcher";
import AuthHeroPanel from "./AuthHeroPanel";

const styles = {
  page: "relative min-h-svh overflow-x-clip bg-gradient-to-b from-theme-1 to-theme-2",
  language: "fixed end-4 top-4 z-50 sm:end-6 sm:top-6",
  shell:
    "container relative z-10 flex min-h-svh w-full flex-col items-center justify-center gap-10 px-5 pb-12 pt-20 sm:px-10 sm:py-14 md:px-36 lg:max-w-[1550px] lg:flex-row lg:gap-0 lg:px-0 lg:py-0 lg:ps-14 lg:pe-12 xl:px-24 2xl:max-w-[1750px]",
  formPanel:
    "box box--stacked flex w-full flex-col rounded-2xl border-0 bg-white p-7 shadow-m3-2 before:rounded-2xl before:border-0 before:bg-white/40 sm:p-14 lg:w-5/12 lg:flex-none lg:p-10 xl:p-12 2xl:w-4/12 dark:bg-darkmode-800 dark:before:bg-darkmode-800/40",
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
              className="block h-[55px] w-[55px] rounded-[0.8rem]"
            />

            <div className="mt-8">
              <h1
                ref={headingRef}
                id={headingId}
                tabIndex={-1}
                className="text-2xl font-medium focus:outline-none"
              >
                {title}
              </h1>
              <p className="mt-2 leading-relaxed text-m3-on-surface-variant">
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
