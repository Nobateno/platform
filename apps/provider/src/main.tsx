import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./app/router";
import { AppErrorBoundary } from "./app/observability/AppErrorBoundary";
import {
  getSentryReactRootOptions,
  initializeSentry,
} from "./app/observability/sentry";
import { DirectionProvider } from "./shared/lib/utils/direction-context";
import "./app/i18n";
import "./index.css";

initializeSentry();

createRoot(
  document.getElementById("root")!,
  getSentryReactRootOptions(),
).render(
  <StrictMode>
    <AppErrorBoundary>
      <BrowserRouter>
        <DirectionProvider>
          <App />
        </DirectionProvider>
      </BrowserRouter>
    </AppErrorBoundary>
  </StrictMode>,
);
