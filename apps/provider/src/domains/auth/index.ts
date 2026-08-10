export { default as LoginPage } from "./presentation/pages/LoginPage";
export { ForgotPasswordPage } from "./presentation/pages/LoginPage";
export {
  canAccessArea,
  getDefaultAreaPath,
  type ProviderArea,
} from "./application/permissions";
export type {
  OtpPurpose,
  PanelRole,
  PanelUser,
} from "./application/auth-store";
export { authI18n, authNamespace, authResources } from "./i18n";
