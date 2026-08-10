import type { Meta, StoryObj } from "@storybook/react-vite";
import Lucide from "@/shared/ui/components/Base/Lucide";
import Button from "@/shared/ui/components/Base/Button";

const meta = {
  title: "Patterns/Cards",
  parameters: {
    docs: {
      description: {
        component:
          "Cards use the existing `.box` and `.box--stacked` surface primitives.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Surfaces: Story = {
  render: () => (
    <div className="grid max-w-5xl gap-8 lg:grid-cols-2">
      <article className="box p-6">
        <h3 className="text-base font-medium text-slate-800 dark:text-slate-100">
          کارت استاندارد
        </h3>
        <p className="mt-2 leading-7 text-slate-500 dark:text-slate-400">
          سطح پایه برای محتوای داشبورد، فرم‌ها و گزارش‌ها.
        </p>
      </article>

      <article className="box box--stacked p-6">
        <h3 className="text-base font-medium text-slate-800 dark:text-slate-100">
          کارت لایه‌ای
        </h3>
        <p className="mt-2 leading-7 text-slate-500 dark:text-slate-400">
          حالت stacked برای ایجاد عمق بیشتر در صفحات مهم.
        </p>
      </article>
    </div>
  ),
};

export const StructuredCard: Story = {
  render: () => (
    <article className="box max-w-2xl overflow-hidden">
      <header className="flex items-center border-b border-slate-200/70 px-6 py-4 dark:border-darkmode-500">
        <div>
          <h3 className="font-medium text-slate-800 dark:text-slate-100">
            خلاصه حساب
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            آخرین بروزرسانی: امروز
          </p>
        </div>
        <Button
          variant="outline-secondary"
          size="sm"
          className="ms-auto gap-2"
        >
          <Lucide icon="Download" className="h-4 w-4" />
          دریافت
        </Button>
      </header>
      <div className="grid gap-6 p-6 sm:grid-cols-3">
        {[
          ["موجودی", "۲۴,۸۰۰,۰۰۰"],
          ["پرداخت‌ها", "۱,۲۴۰"],
          ["رشد ماهانه", "۱۲.۸٪"],
        ].map(([label, value]) => (
          <div key={label}>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {label}
            </div>
            <div className="mt-2 text-xl font-semibold text-slate-800 dark:text-slate-100">
              {value}
            </div>
          </div>
        ))}
      </div>
      <footer className="border-t border-slate-200/70 bg-slate-50/70 px-6 py-3 text-xs text-slate-500 dark:border-darkmode-500 dark:bg-darkmode-700/40 dark:text-slate-400">
        مبالغ به ریال نمایش داده می‌شوند.
      </footer>
    </article>
  ),
};

export const MetricCards: Story = {
  render: () => (
    <div className="grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {[
        { label: "فروش", value: "۸۴.۲M", icon: "WalletCards" as const },
        { label: "سفارش‌ها", value: "۱,۸۴۲", icon: "Package" as const },
        { label: "مشتریان", value: "۶,۲۱۰", icon: "Users" as const },
        { label: "نرخ رشد", value: "۱۸.۴٪", icon: "Gauge" as const },
      ].map((metric) => (
        <article key={metric.label} className="box p-5">
          <div className="flex items-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-primary/10 bg-primary/10">
              <Lucide
                icon={metric.icon}
                className="h-5 w-5 text-primary dark:text-sky-300"
              />
            </div>
            <div className="ms-auto text-xs text-success">+۱۲٪</div>
          </div>
          <div className="mt-5 text-2xl font-semibold text-slate-800 dark:text-slate-100">
            {metric.value}
          </div>
          <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {metric.label}
          </div>
        </article>
      ))}
    </div>
  ),
};
