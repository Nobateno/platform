import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Foundations/Design tokens",
  parameters: {
    docs: {
      description: {
        component:
          "The live color, typography, radius, and elevation tokens used by the application.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const semanticColors = [
  { name: "Primary", token: "primary", className: "bg-primary" },
  {
    name: "Secondary",
    token: "secondary",
    className: "bg-secondary",
  },
  { name: "Success", token: "success", className: "bg-success" },
  { name: "Info", token: "info", className: "bg-info" },
  { name: "Warning", token: "warning", className: "bg-warning" },
  { name: "Pending", token: "pending", className: "bg-pending" },
  { name: "Danger", token: "danger", className: "bg-danger" },
  { name: "Dark", token: "dark", className: "bg-dark" },
];

const darkSurfaces = [
  { name: "50", className: "bg-darkmode-50" },
  { name: "100", className: "bg-darkmode-100" },
  { name: "200", className: "bg-darkmode-200" },
  { name: "300", className: "bg-darkmode-300" },
  { name: "400", className: "bg-darkmode-400" },
  { name: "500", className: "bg-darkmode-500" },
  { name: "600", className: "bg-darkmode-600" },
  { name: "700", className: "bg-darkmode-700" },
  { name: "800", className: "bg-darkmode-800" },
  { name: "900", className: "bg-darkmode-900" },
];

export const Colors: Story = {
  render: () => (
    <div className="space-y-10">
      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-100">
          Semantic colors
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {semanticColors.map((color) => (
            <div
              key={color.token}
              className="overflow-hidden rounded-lg border border-m3-outline-variant bg-m3-surface shadow-sm"
            >
              <div
                className={`${color.className} h-16`}
                aria-hidden="true"
              />
              <div className="p-4 text-m3-on-surface">
                <div className="font-medium">{color.name}</div>
                <code className="mt-1 block text-xs text-m3-on-surface-variant">
                  {color.token}
                </code>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-100">
          Dark surface scale
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {darkSurfaces.map((surface) => (
            <div
              key={surface.name}
              className="overflow-hidden rounded-lg border border-m3-outline-variant bg-m3-surface"
            >
              <div
                className={`${surface.className} h-16`}
                aria-hidden="true"
              />
              <code className="block p-3 text-xs text-m3-on-surface">
                darkmode-{surface.name}
              </code>
            </div>
          ))}
        </div>
      </section>
    </div>
  ),
};

export const TypographyAndElevation: Story = {
  render: () => (
    <div className="grid gap-8 lg:grid-cols-2">
      <section className="box p-6">
        <div className="space-y-4">
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">
            عنوان اصلی
          </h1>
          <h2 className="text-2xl font-medium text-slate-800 dark:text-slate-100">
            عنوان بخش
          </h2>
          <h3 className="text-lg font-medium">عنوان کارت</h3>
          <p className="text-sm leading-7">
            متن بدنه با فونت و فاصله‌گذاری پیش‌فرض سامانه نمایش داده می‌شود.
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            متن راهنما و توضیحات تکمیلی
          </p>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm dark:border-darkmode-500 dark:bg-darkmode-600">
          <div className="font-medium">Small elevation</div>
          <code className="mt-2 block text-xs text-slate-500">shadow-sm</code>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-md dark:border-darkmode-500 dark:bg-darkmode-600">
          <div className="font-medium">Medium elevation</div>
          <code className="mt-2 block text-xs text-slate-500">shadow-md</code>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-lg dark:border-darkmode-500 dark:bg-darkmode-600">
          <div className="font-medium">Large elevation</div>
          <code className="mt-2 block text-xs text-slate-500">shadow-lg</code>
        </div>
        <div className="rounded-[0.6rem] border border-slate-200 bg-white p-5 dark:border-darkmode-500 dark:bg-darkmode-600">
          <div className="font-medium">Application radius</div>
          <code className="mt-2 block text-xs text-slate-500">
            rounded-[0.6rem]
          </code>
        </div>
      </section>
    </div>
  ),
};
