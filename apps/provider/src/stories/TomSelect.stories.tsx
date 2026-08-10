import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import TomSelect from "@/shared/ui/components/Base/TomSelect";

const meta = {
  title: "Components/Vendor inputs/TomSelect",
  component: TomSelect,
} satisfies Meta<typeof TomSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

function TomSelectExample() {
  const [value, setValue] = useState("consultation");
  return (
    <div className="box max-w-lg p-6">
      <label htmlFor="story-service" className="mb-2 block font-medium">
        Service
      </label>
      <TomSelect
        id="story-service"
        aria-label="Service"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        options={{ create: false }}
      >
        <option value="consultation">Consultation</option>
        <option value="follow-up">Follow-up</option>
        <option value="assessment">Assessment</option>
      </TomSelect>
    </div>
  );
}

export const Controlled: Story = {
  args: { value: "consultation", onChange: () => undefined },
  render: () => <TomSelectExample />,
};
