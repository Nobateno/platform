import type { Meta, StoryObj } from "@storybook/react-vite";
import TinySlider from "@/shared/ui/components/Base/TinySlider";

const meta = {
  title: "Components/Media/TinySlider",
  component: TinySlider,
} satisfies Meta<typeof TinySlider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Responsive: Story = {
  args: {
    options: {
      items: 1,
      gutter: 16,
      controls: false,
      nav: true,
      responsive: { 640: { items: 2 }, 1024: { items: 3 } },
    },
  },
  render: (args) => (
    <div className="max-w-4xl overflow-hidden">
      <TinySlider {...args}>
        {["Consultation", "Follow-up", "Assessment", "Treatment"].map((service) => (
          <article key={service} className="box min-h-32 p-6">
            <h3 className="font-medium">{service}</h3>
            <p className="mt-2 text-sm text-m3-on-surface-variant">Available this week</p>
          </article>
        ))}
      </TinySlider>
    </div>
  ),
};
