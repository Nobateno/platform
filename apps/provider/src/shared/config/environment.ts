export type AppMode = "demo" | "production";

function resolveAppMode(): AppMode {
  const configuredMode = import.meta.env.VITE_APP_MODE;

  if (configuredMode === "demo" || configuredMode === "production") {
    return configuredMode;
  }

  if (import.meta.env.DEV || import.meta.env.MODE === "test") {
    return "demo";
  }

  return "production";
}

export const appMode = resolveAppMode();

export const isDemoMode = appMode === "demo";
