import { useMemo, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import Button from "@/shared/ui/components/Base/Button";
import Chart from "@/shared/ui/components/Base/Chart";

const meta = {
  title: "Components/Chart",
  component: Chart,
  parameters: {
    docs: {
      description: {
        component:
          "Chart.js canvas wrapper with responsive dimensions, data updates, cleanup, fallback text, and an accessible name.",
      },
    },
  },
} satisfies Meta<typeof Chart>;

export default meta;
type Story = StoryObj<typeof meta>;

function ChartExample() {
  const [alternate, setAlternate] = useState(false);
  const data = useMemo(
    () => ({
      labels: ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"],
      datasets: [
        {
          label: "Confirmed reservations",
          data: alternate
            ? [12, 18, 14, 21, 17, 25, 23]
            : [8, 12, 10, 16, 15, 19, 21],
          borderColor: "#4f46e5",
          backgroundColor: "rgba(79, 70, 229, 0.15)",
          fill: true,
          tension: 0.35,
        },
      ],
    }),
    [alternate],
  );

  return (
    <div className="box grid max-w-3xl gap-5 p-6">
      <Button className="w-fit" onClick={() => setAlternate((value) => !value)}>
        Update data
      </Button>
      <Chart
        type="line"
        data={data}
        height={280}
        width="auto"
        aria-label="Confirmed reservations over the last seven days"
        options={{ responsive: true, maintainAspectRatio: false }}
      />
    </div>
  );
}

export const ResponsiveAndUpdating: Story = {
  args: {
    type: "line",
    data: { datasets: [] },
  },
  render: () => <ChartExample />,
};
