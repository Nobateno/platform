import type { Meta, StoryObj } from "@storybook/react-vite";
import ImageZoom from "@/shared/ui/components/Base/ImageZoom";

const meta = {
  title: "Components/Media/ImageZoom",
  component: ImageZoom,
} satisfies Meta<typeof ImageZoom>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ClickToZoom: Story = {
  args: {
    src: "/assets/images/products/product1-400x400.jpg",
    alt: "Service gallery example",
  },
  render: (args) => (
    <div className="box max-w-md p-6">
      <ImageZoom {...args} className="aspect-square w-full rounded-m3-lg object-cover" />
      <p className="mt-3 text-sm text-m3-on-surface-variant">Select the image to inspect it.</p>
    </div>
  ),
};
