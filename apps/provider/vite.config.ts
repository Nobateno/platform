import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ command, mode }) => {
  const clientEnvironment = loadEnv(mode, process.cwd(), "VITE_SENTRY_");
  const authToken = process.env.SENTRY_AUTH_TOKEN?.trim();
  const org = process.env.SENTRY_ORG?.trim();
  const project = process.env.SENTRY_PROJECT?.trim();
  const uploadSourceMaps =
    command === "build" &&
    Boolean(clientEnvironment.VITE_SENTRY_DSN?.trim()) &&
    Boolean(authToken && org && project);

  return {
    plugins: [
      react(),
      ...(uploadSourceMaps
        ? [
            sentryVitePlugin({
              authToken,
              org,
              project,
              telemetry: false,
              sourcemaps: {
                filesToDeleteAfterUpload: ["./dist/**/*.map"],
              },
            }),
          ]
        : []),
    ],
    build: {
      sourcemap: uploadSourceMaps ? "hidden" : false,
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  };
});
