import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import Litepicker from "@/shared/ui/components/Base/Litepicker";

const meta = {
  title: "Components/Vendor inputs/Litepicker",
  component: Litepicker,
} satisfies Meta<typeof Litepicker>;

export default meta;
type Story = StoryObj<typeof meta>;

function LitepickerExample() {
  const [value, setValue] = useState("2026-08-01");
  return (
    <div className="box max-w-lg p-6">
      <label htmlFor="story-date" className="mb-2 block font-medium">
        Reservation date
      </label>
      <Litepicker
        id="story-date"
        value={value}
        options={{ format: "YYYY-MM-DD", singleMode: true }}
        onChange={(event) => setValue(event.target.value)}
      />
    </div>
  );
}

export const Controlled: Story = {
  args: {
    options: { format: "YYYY-MM-DD" },
    onChange: () => undefined,
  },
  render: () => <LitepickerExample />,
};
