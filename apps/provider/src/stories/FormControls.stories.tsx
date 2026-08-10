import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import FormInput from "@/shared/ui/components/Base/Form/FormInput";
import FormSelect from "@/shared/ui/components/Base/Form/FormSelect";
import FormTextarea from "@/shared/ui/components/Base/Form/FormTextarea";
import FormLabel from "@/shared/ui/components/Base/Form/FormLabel";
import FormHelp from "@/shared/ui/components/Base/Form/FormHelp";
import FormCheck from "@/shared/ui/components/Base/Form/FormCheck";
import FormSwitch from "@/shared/ui/components/Base/Form/FormSwitch";
import FormInline from "@/shared/ui/components/Base/Form/FormInline";
import InputGroup from "@/shared/ui/components/Base/Form/InputGroup";
import OtpField from "@/shared/ui/components/OtpField";
import PasswordSetupFields from "@/shared/ui/components/PasswordSetupFields";
import PhoneNumberField from "@/shared/ui/components/PhoneNumberField";

const meta = {
  title: "Components/Form controls",
  parameters: {
    docs: {
      description: {
        component:
          "Inputs and controls composed from the existing Base/Form primitives.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const FieldTypes: Story = {
  render: () => (
    <div className="box grid max-w-3xl gap-6 p-6">
      <div>
        <FormLabel htmlFor="story-name">نام کامل</FormLabel>
        <FormInput id="story-name" placeholder="نام و نام خانوادگی" />
        <FormHelp>نام مطابق اطلاعات حساب وارد شود.</FormHelp>
      </div>
      <div>
        <FormLabel htmlFor="story-role">نقش کاربری</FormLabel>
        <FormSelect id="story-role" defaultValue="manager">
          <option value="manager">مدیر</option>
          <option value="editor">ویرایشگر</option>
          <option value="viewer">مشاهده‌گر</option>
        </FormSelect>
      </div>
      <div>
        <FormLabel htmlFor="story-description">توضیحات</FormLabel>
        <FormTextarea
          id="story-description"
          rows={4}
          placeholder="توضیحات تکمیلی"
        />
      </div>
    </div>
  ),
};

export const SizesAndStates: Story = {
  render: () => (
    <div className="box grid max-w-3xl gap-5 p-6">
      <FormInput aria-label="ورودی کوچک" formInputSize="sm" placeholder="ورودی کوچک" />
      <FormInput aria-label="ورودی معمولی" placeholder="ورودی معمولی" />
      <FormInput aria-label="ورودی بزرگ" formInputSize="lg" placeholder="ورودی بزرگ" />
      <FormInput aria-label="فقط خواندنی" value="فقط خواندنی" readOnly />
      <FormInput aria-label="غیرفعال" value="غیرفعال" disabled />
      <FormInput
        aria-label="مقدار نامعتبر"
        className="border-danger/60 focus:border-danger focus:ring-danger/20"
        defaultValue="مقدار نامعتبر"
        aria-invalid="true"
      />
    </div>
  ),
};

export const ChecksAndSwitches: Story = {
  render: () => (
    <div className="box flex max-w-xl flex-col gap-5 p-6">
      <FormCheck>
        <FormCheck.Input id="check-1" type="checkbox" defaultChecked />
        <FormCheck.Label htmlFor="check-1">دریافت اعلان ایمیلی</FormCheck.Label>
      </FormCheck>
      <FormCheck>
        <FormCheck.Input id="radio-1" type="radio" name="plan" defaultChecked />
        <FormCheck.Label htmlFor="radio-1">طرح حرفه‌ای</FormCheck.Label>
      </FormCheck>
      <FormCheck>
        <FormCheck.Input id="radio-2" type="radio" name="plan" />
        <FormCheck.Label htmlFor="radio-2">طرح پایه</FormCheck.Label>
      </FormCheck>
      <FormSwitch>
        <FormSwitch.Input id="switch-1" type="checkbox" defaultChecked />
        <FormSwitch.Label htmlFor="switch-1">فعال‌سازی دسترسی</FormSwitch.Label>
      </FormSwitch>
    </div>
  ),
};

export const InputGroups: Story = {
  render: () => (
    <div className="box grid max-w-2xl gap-5 p-6">
      <InputGroup>
        <InputGroup.Text>https://</InputGroup.Text>
        <FormInput aria-label="دامنه" placeholder="example.com" />
      </InputGroup>
      <InputGroup>
        <FormInput aria-label="مبلغ" placeholder="مبلغ" />
        <InputGroup.Text>ریال</InputGroup.Text>
      </InputGroup>
    </div>
  ),
};

export const InlineField: Story = {
  render: () => (
    <div className="box max-w-3xl p-6">
      <FormInline>
        <FormLabel htmlFor="story-inline-name">نام نمایشی</FormLabel>
        <FormInput id="story-inline-name" defaultValue="نوبت‌نو" />
        <FormHelp>این نام در صفحه عمومی نمایش داده می‌شود.</FormHelp>
      </FormInline>
    </div>
  ),
};

function ValidatedAuthFieldsExample() {
  const [phone, setPhone] = useState("091234");
  const [otp, setOtp] = useState("12");
  const [password, setPassword] = useState("Nobat123");
  const [confirmPassword, setConfirmPassword] = useState("");
  const passwordLabels = {
    showLabel: "نمایش",
    hideLabel: "پنهان",
    capsLockLabel: "Caps Lock روشن است",
    strengthLabel: "قدرت گذرواژه",
    strengthLabels: {
      veryWeak: "بسیار ضعیف",
      weak: "ضعیف",
      good: "خوب",
      strong: "قوی",
    },
  };

  return (
    <div className="box grid max-w-2xl gap-6 p-6">
      <PhoneNumberField
        label="شماره موبایل"
        region="IR"
        regionLabel="کشور یا منطقه"
        regionName="ایران"
        value={phone}
        onValueChange={setPhone}
        required
        error="شماره موبایل معتبر ایران وارد کنید."
        hint="شماره را با ۹ وارد کنید؛ صفر ابتدای آن اختیاری است (۱۰ یا ۱۱ رقم)."
      />
      <OtpField
        label="کد تأیید"
        value={otp}
        onChange={setOtp}
        digitLabel="رقم کد"
        hint="هر رقم را در یک خانه وارد کنید."
        required
      />
      <PasswordSetupFields
        passwordLabel="گذرواژه جدید"
        confirmPasswordLabel="تکرار گذرواژه"
        passwordValue={password}
        confirmPasswordValue={confirmPassword}
        onPasswordChange={(event) => setPassword(event.target.value)}
        onConfirmPasswordChange={(event) =>
          setConfirmPassword(event.target.value)
        }
        messages={passwordLabels}
        passwordHint="حداقل ۸ نویسه؛ ترکیب واژه‌ها، عددها و نمادها بهتر است."
      />
    </div>
  );
}

export const ValidatedAuthFields: Story = {
  render: () => <ValidatedAuthFieldsExample />,
};
