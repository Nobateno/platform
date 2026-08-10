import { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import FormField from "@/shared/ui/components/FormField";
import OtpField from "@/shared/ui/components/OtpField";
import PasswordField from "@/shared/ui/components/PasswordField";
import PhoneNumberField from "@/shared/ui/components/PhoneNumberField";

const passwordMessages = {
  showLabel: "Show",
  hideLabel: "Hide",
  capsLockLabel: "Caps Lock is on",
  strengthLabel: "Password strength",
  strengthLabels: {
    veryWeak: "Very weak",
    weak: "Weak",
    good: "Good",
    strong: "Strong",
  },
};

function OtpExample() {
  const [value, setValue] = useState("");
  return (
    <OtpField
      label="Verification code"
      value={value}
      onChange={setValue}
      digitLabel="Code digit"
      required
    />
  );
}

function PasswordExample() {
  const [value, setValue] = useState("");
  return (
    <PasswordField
      {...passwordMessages}
      label="New password"
      value={value}
      onChange={(event) => setValue(event.target.value)}
      showStrength
    />
  );
}

function PhoneExample() {
  const [value, setValue] = useState("");
  return (
    <PhoneNumberField
      label="Mobile number"
      region="IR"
      regionLabel="Country or region"
      regionName="Iran"
      value={value}
      onValueChange={setValue}
      required
    />
  );
}

describe("validated authentication fields", () => {
  it("links an under-field error to its invalid input", () => {
    render(
      <FormField
        label="Mobile number"
        error="Enter a valid mobile number."
      />,
    );

    const input = screen.getByLabelText("Mobile number");
    const error = screen.getByRole("alert");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-errormessage", error.id);
  });

  it("accepts localized OTP digits and advances through the boxes", async () => {
    const user = userEvent.setup();
    render(<OtpExample />);

    await user.type(screen.getByLabelText("Code digit 1"), "۱");
    expect(screen.getByLabelText("Code digit 1")).toHaveValue("1");
    expect(screen.getByLabelText("Code digit 2")).toHaveFocus();
  });

  it("shows a disabled Iran region and enforces its digit limit", async () => {
    const user = userEvent.setup();
    render(<PhoneExample />);

    const region = screen.getByRole("button", {
      name: "Country or region: Iran +98",
    });
    const input = screen.getByRole("textbox", { name: /^Mobile number/ });

    expect(region).toBeDisabled();
    expect(input).toHaveAttribute("maxlength", "11");
    await user.type(input, "091234567890");
    expect(input).toHaveValue("09123456789");
  });

  it("normalizes localized and formatted pasted phone digits", () => {
    render(<PhoneExample />);
    const input = screen.getByRole("textbox", { name: /^Mobile number/ });

    fireEvent.paste(input, {
      clipboardData: { getData: () => "+98 ۹۱۲ ۳۴۵ ۶۷۸۹" },
    });
    expect(input).toHaveValue("9123456789");
  });

  it("reveals passwords and reports live strength", async () => {
    const user = userEvent.setup();
    render(<PasswordExample />);

    const input = screen.getByLabelText(/^New password/);
    await user.type(input, "Nobateno-Booking-2026!");
    expect(screen.getByText("Password strength: Strong")).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Show" }));
    expect(input).toHaveAttribute("type", "text");
    expect(screen.getByRole("button", { name: "Hide" })).toBeVisible();
  });
});
