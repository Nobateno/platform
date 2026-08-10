import type { ReactElement } from "react";
import type { AuthFlowController } from "../useAuthFlow";
import OtpStep from "./OtpStep";
import PasswordStep from "./PasswordStep";
import PhoneStep from "./PhoneStep";
import RegistrationStep from "./RegistrationStep";
import ResetCompleteStep from "./ResetCompleteStep";
import ResetPasswordStep from "./ResetPasswordStep";

export default function AuthStep({
  controller,
}: {
  controller: AuthFlowController;
}): ReactElement {
  switch (controller.screen.type) {
    case "phone":
      return <PhoneStep controller={controller} />;
    case "password":
      return <PasswordStep controller={controller} />;
    case "otp":
      return <OtpStep controller={controller} />;
    case "registration":
      return <RegistrationStep controller={controller} />;
    case "resetPassword":
      return <ResetPasswordStep controller={controller} />;
    case "resetComplete":
      return <ResetCompleteStep />;
  }
}
