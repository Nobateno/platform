import type { Meta, StoryObj } from "@storybook/react-vite";
import ReportDonutChart from "@/domains/overview/presentation/components/ReportDonutChart";
import ReportLineChart from "@/domains/overview/presentation/components/ReportLineChart";

const meta = {
  title: "Domains/Overview/Report charts",
  parameters: {
    docs: {
      description: {
        component:
          "Overview-specific chart compositions connected to the real Storybook theme context.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Light: Story = {
  globals: { locale: "en", theme: "light" },
  render: () => (
    <div className="grid max-w-4xl gap-6 sm:grid-cols-2">
      <figure className="box h-72 p-6">
        <figcaption className="mb-4 font-medium">Reservation trend</figcaption>
        <ReportLineChart index={0} height={210} borderColor="#4f46e5" backgroundColor="#4f46e540" />
      </figure>
      <figure className="box h-72 p-6">
        <figcaption className="mb-4 font-medium">Reservation completion</figcaption>
        <ReportDonutChart height={210} labels={["Cancelled", "Completed"]} />
      </figure>
    </div>
  ),
};

export const Dark: Story = {
  ...Light,
  globals: { locale: "fa", theme: "dark" },
};
