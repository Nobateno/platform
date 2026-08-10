import type { Meta, StoryObj } from "@storybook/react-vite";
import Alert, {
  alertStateConfig,
  type AlertState,
} from "@/shared/ui/components/Base/Alert";
import Progress from "@/shared/ui/components/Base/Progress";

const meta = {
  title: "Components/Feedback",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const alertStates = Object.keys(alertStateConfig) as AlertState[];

export const Alerts: Story = {
  render: () => (
    <div className="grid max-w-3xl gap-4">
      {alertStates.map((state) => (
        <Alert key={state} state={state} title={`وضعیت ${state}`}>
          پیام کوتاه و کاربردی درباره نتیجه یا وضعیت کاربر.
        </Alert>
      ))}
    </div>
  ),
};

export const AlertsDark: Story = {
  ...Alerts,
  globals: { locale: "en", theme: "dark" },
};

export const DismissibleAlert: Story = {
  render: () => (
    <div className="max-w-3xl">
      <Alert
        state="info"
        title="تنظیمات ذخیره شد"
        dismissible
        closeLabel="بستن اعلان"
      >
        این اعلان تا زمانی که کاربر آن را ببندد، باقی می‌ماند.
      </Alert>
    </div>
  ),
};

export const WithActions: Story = {
  render: () => (
    <div className="grid max-w-3xl gap-4">
      <Alert
        state="warn"
        title="یک مرحله باقی مانده است"
        action={{ label: "تکمیل اطلاعات", onClick: () => undefined }}
      >
        برای فعال‌شدن صفحه رزرو، ساعت کاری را مشخص کنید.
      </Alert>
      <Alert
        state="success"
        title="صفحه رزرو آماده است"
        action={{ label: "مشاهده صفحه", href: "#booking-page" }}
      >
        لینک عمومی شما اکنون در دسترس مشتریان است.
      </Alert>
    </div>
  ),
};

export const TimedFixedAlert: Story = {
  render: () => (
    <div className="min-h-40 max-w-3xl">
      <Alert
        state="primary"
        title="اعلان زمان‌دار"
        position="fixed"
        durationMs={5000}
        dismissible
        closeLabel="بستن اعلان"
      >
        این اعلان پس از پنج ثانیه بسته می‌شود.
      </Alert>
    </div>
  ),
};

export const ProgressBars: Story = {
  render: () => (
    <div className="box grid max-w-3xl gap-7 p-6">
      {[24, 48, 72, 92].map((value) => (
        <div key={value}>
          <div className="mb-2 flex text-xs">
            <span>پیشرفت</span>
            <span className="ms-auto">{value}٪</span>
          </div>
          <Progress value={value} aria-label={`پیشرفت: ${value}٪`}>
            <Progress.Bar style={{ width: `${value}%` }} />
          </Progress>
        </div>
      ))}
    </div>
  ),
};
