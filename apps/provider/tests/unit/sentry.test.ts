import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const sentry = vi.hoisted(() => ({
  init: vi.fn(),
  browserTracingIntegration: vi.fn(() => ({ name: "browser-tracing" })),
  replayIntegration: vi.fn(() => ({ name: "replay" })),
  reactErrorHandler: vi.fn(() => vi.fn()),
}));

vi.mock("@sentry/react", () => sentry);

describe("Sentry initialization", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("is a safe no-op when no DSN is configured", async () => {
    vi.stubEnv("VITE_SENTRY_DSN", "  ");
    const { getSentryReactRootOptions, initializeSentry } = await import(
      "@/app/observability/sentry"
    );

    expect(initializeSentry()).toBe(false);
    expect(getSentryReactRootOptions()).toBeUndefined();
    expect(sentry.init).not.toHaveBeenCalled();
  });

  it("initializes once with privacy-safe defaults", async () => {
    vi.stubEnv("VITE_SENTRY_DSN", "https://public@example.test/1");
    vi.stubEnv("VITE_SENTRY_ENVIRONMENT", "test");
    const { getSentryReactRootOptions, initializeSentry } = await import(
      "@/app/observability/sentry"
    );

    expect(initializeSentry()).toBe(true);
    expect(initializeSentry()).toBe(true);
    expect(sentry.init).toHaveBeenCalledTimes(1);
    expect(sentry.init).toHaveBeenCalledWith(
      expect.objectContaining({
        dsn: "https://public@example.test/1",
        environment: "test",
        sendDefaultPii: false,
        integrations: [],
        tracesSampleRate: 0,
        replaysSessionSampleRate: 0,
        replaysOnErrorSampleRate: 0,
      }),
    );

    expect(getSentryReactRootOptions()).toEqual({
      onUncaughtError: expect.any(Function),
      onCaughtError: expect.any(Function),
      onRecoverableError: expect.any(Function),
    });
    expect(sentry.reactErrorHandler).toHaveBeenCalledTimes(3);
  });

  it("enables tracing and masked replay only for positive sample rates", async () => {
    vi.stubEnv("VITE_SENTRY_DSN", "https://public@example.test/1");
    vi.stubEnv("VITE_SENTRY_TRACES_SAMPLE_RATE", "0.25");
    vi.stubEnv("VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE", "0.1");
    vi.stubEnv("VITE_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE", "1");
    const { initializeSentry } = await import("@/app/observability/sentry");

    initializeSentry();

    expect(sentry.browserTracingIntegration).toHaveBeenCalledTimes(1);
    expect(sentry.replayIntegration).toHaveBeenCalledWith({
      maskAllText: true,
      maskAllInputs: true,
      blockAllMedia: true,
    });
    expect(sentry.init).toHaveBeenCalledWith(
      expect.objectContaining({
        integrations: [
          { name: "browser-tracing" },
          { name: "replay" },
        ],
        tracesSampleRate: 0.25,
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1,
      }),
    );
  });

  it("drops query strings, fragments, and user PII before sending", async () => {
    vi.stubEnv("VITE_SENTRY_DSN", "https://public@example.test/1");
    const { initializeSentry } = await import("@/app/observability/sentry");
    initializeSentry();
    const options = sentry.init.mock.calls[0][0] as {
      beforeBreadcrumb: (breadcrumb: any) => any;
      beforeSend: (event: any) => any;
    };

    const breadcrumb = options.beforeBreadcrumb({
      data: { url: "/customers?email=private@example.test#profile" },
    });
    expect(breadcrumb.data.url).toBe("/customers");

    const event = options.beforeSend({
      request: { url: "https://provider.test/settings?token=secret#security" },
      user: {
        id: "safe-id",
        email: "private@example.test",
        username: "private-name",
      },
    });
    expect(event.request.url).toBe("https://provider.test/settings");
    expect(event.user).toEqual({ id: "safe-id" });
  });
});
