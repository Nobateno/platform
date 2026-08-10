import * as Sentry from "@sentry/react";

const dsn = import.meta.env.VITE_SENTRY_DSN?.trim();

const readSampleRate = (value: string | undefined): number => {
  if (!value?.trim()) return 0;

  const sampleRate = Number(value);
  return Number.isFinite(sampleRate) && sampleRate >= 0 && sampleRate <= 1
    ? sampleRate
    : 0;
};

const stripQueryAndFragment = (value: string): string => {
  try {
    const url = new URL(value, window.location.origin);
    url.search = "";
    url.hash = "";

    return value.startsWith("/") ? `${url.pathname}` : url.toString();
  } catch {
    return value.split(/[?#]/, 1)[0];
  }
};

let initialized = false;

export const initializeSentry = (): boolean => {
  if (initialized) return true;
  if (!dsn) return false;

  const tracesSampleRate = readSampleRate(
    import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE,
  );
  const replaysSessionSampleRate = readSampleRate(
    import.meta.env.VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE,
  );
  const replaysOnErrorSampleRate = readSampleRate(
    import.meta.env.VITE_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE,
  );
  const integrations = [];

  if (tracesSampleRate > 0) {
    integrations.push(Sentry.browserTracingIntegration());
  }

  if (replaysSessionSampleRate > 0 || replaysOnErrorSampleRate > 0) {
    integrations.push(
      Sentry.replayIntegration({
        maskAllText: true,
        maskAllInputs: true,
        blockAllMedia: true,
      }),
    );
  }

  Sentry.init({
    dsn,
    environment:
      import.meta.env.VITE_SENTRY_ENVIRONMENT?.trim() || import.meta.env.MODE,
    release: import.meta.env.VITE_SENTRY_RELEASE?.trim() || undefined,
    sendDefaultPii: false,
    integrations,
    tracesSampleRate,
    replaysSessionSampleRate,
    replaysOnErrorSampleRate,
    beforeBreadcrumb(breadcrumb) {
      const url = breadcrumb.data?.url;
      if (typeof url === "string" && breadcrumb.data) {
        breadcrumb.data.url = stripQueryAndFragment(url);
      }

      return breadcrumb;
    },
    beforeSend(event) {
      if (event.request?.url) {
        event.request.url = stripQueryAndFragment(event.request.url);
      }

      if (event.user) {
        event.user = event.user.id == null ? undefined : { id: event.user.id };
      }

      return event;
    },
  });

  initialized = true;
  return true;
};

export const getSentryReactRootOptions = () => {
  if (!initialized) return undefined;

  return {
    onUncaughtError: Sentry.reactErrorHandler(),
    onCaughtError: Sentry.reactErrorHandler(),
    onRecoverableError: Sentry.reactErrorHandler(),
  };
};
