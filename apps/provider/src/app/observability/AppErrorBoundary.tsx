import * as Sentry from "@sentry/react";
import { ArrowClockwiseIcon, WarningCircleIcon } from "@phosphor-icons/react";
import { useEffect, useRef, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import Button from "@/shared/ui/components/Base/Button";
import { observabilityI18n } from "./i18n";

function AppErrorFallback({ onRetry }: { onRetry: () => void }) {
  const { t } = useTranslation(observabilityI18n.namespace);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-m3-surface p-6 text-m3-on-surface">
      <section
        className="w-full max-w-lg rounded-m3-xl border border-m3-outline-variant bg-m3-surface-container-low p-6 text-center shadow-m3-2 sm:p-8"
        role="alert"
        aria-labelledby="app-error-title"
        aria-describedby="app-error-description"
      >
        <span
          className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-m3-error-container text-m3-error"
          aria-hidden="true"
        >
          <WarningCircleIcon size={30} weight="fill" />
        </span>
        <h1
          ref={headingRef}
          id="app-error-title"
          className="m3-headline-small focus:outline-none"
          tabIndex={-1}
        >
          {t("errorBoundary.title")}
        </h1>
        <p
          id="app-error-description"
          className="m3-body-large mx-auto mt-3 max-w-md text-m3-on-surface-variant"
        >
          {t("errorBoundary.description")}
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Button type="button" variant="primary" onClick={onRetry}>
            {t("errorBoundary.retry")}
          </Button>
          <Button
            type="button"
            variant="outline-primary"
            onClick={() => window.location.reload()}
          >
            <ArrowClockwiseIcon
              className="me-2 rtl:me-0 rtl:ms-2"
              size={18}
              aria-hidden="true"
            />
            {t("errorBoundary.reload")}
          </Button>
        </div>
      </section>
    </main>
  );
}

export function AppErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <Sentry.ErrorBoundary
      fallback={({ resetError }) => (
        <AppErrorFallback onRetry={resetError} />
      )}
      beforeCapture={(scope) => scope.setTag("error_boundary", "app")}
    >
      {children}
    </Sentry.ErrorBoundary>
  );
}
