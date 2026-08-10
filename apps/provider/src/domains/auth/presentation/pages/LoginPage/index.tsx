import AuthFlowPage from "./AuthFlowPage";

export function ForgotPasswordPage() {
  return <AuthFlowPage flow="recovery" />;
}

export default function LoginPage() {
  return <AuthFlowPage flow="login" />;
}
