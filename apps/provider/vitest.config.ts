import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["tests/e2e/**"],
    clearMocks: true,
    restoreMocks: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      reportsDirectory: "./coverage",
      include: [
        "src/app/observability/sentry.ts",
        "src/app/router.tsx",
        "src/domains/auth/application/auth-store.ts",
        "src/shared/i18n/index.ts",
        "src/shared/i18n/languages.ts",
        "src/shared/lib/utils/direction-context.tsx",
        "src/shared/ui/components/Base/TinySlider/**/*.{ts,tsx}",
        "src/shared/ui/components/LanguageSwitcher/index.tsx",
      ],
      exclude: ["**/*.d.ts"],
      thresholds: {
        statements: 60,
        branches: 50,
        functions: 60,
        lines: 60,
      },
    },
  },
});
