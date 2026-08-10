import type { Meta, StoryObj } from "@storybook/react-vite";
import Button from "@/shared/ui/components/Base/Button";
import FormInput from "@/shared/ui/components/Base/Form/FormInput";
import Lucide from "@/shared/ui/components/Base/Lucide";

const meta = {
  title: "Material 3/Components",
  parameters: {
    docs: {
      description: {
        component:
          "Shared provider-panel primitives using Material 3 color, shape, state, typography, and elevation tokens.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const ComponentGallery: Story = {
  render: () => (
    <div className="mx-auto grid max-w-4xl gap-8">
      <section className="rounded-[var(--md-sys-shape-corner-extra-large)] bg-surface-container p-6 shadow-elevation-1">
        <h2 className="mb-1 text-title-large font-semibold text-on-surface">Buttons</h2>
        <p className="mb-5 text-body-medium text-on-surface-variant">
          Filled, tonal, outlined, and icon actions preserve a 40px minimum target.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button variant="primary">Filled action</Button>
          <Button variant="soft-primary">Tonal action</Button>
          <Button variant="outline-primary">Outlined action</Button>
          <Button variant="primary" aria-label="Add item">
            <Lucide icon="Plus" className="me-2" />
            Add item
          </Button>
        </div>
      </section>

      <section className="rounded-[var(--md-sys-shape-corner-extra-large)] bg-surface-container p-6 shadow-elevation-1">
        <h2 className="mb-5 text-title-large font-semibold text-on-surface">Text fields</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-label-large text-on-surface">
            Service name
            <FormInput placeholder="Enter a name" />
          </label>
          <label className="grid gap-2 text-label-large text-on-surface">
            Search
            <div className="relative">
              <Lucide icon="Search" className="absolute start-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <FormInput className="ps-10" placeholder="Search services" />
            </div>
          </label>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {([
          ["BookMarked", "Services", "128 bookable"],
          ["Users", "Customers", "42 active"],
          ["Calendar", "Reservations", "Today"],
        ] as const).map(([icon, title, supporting]) => (
          <article
            key={title}
            className="rounded-[var(--md-sys-shape-corner-large)] bg-surface-container-high p-5 text-on-surface shadow-elevation-1"
          >
            <Lucide icon={icon} className="mb-4 text-primary" />
            <h3 className="text-title-medium font-semibold">{title}</h3>
            <p className="mt-1 text-body-medium text-on-surface-variant">{supporting}</p>
          </article>
        ))}
      </section>
    </div>
  ),
};
