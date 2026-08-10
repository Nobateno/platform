import type { Meta, StoryObj } from "@storybook/react-vite";
import Button from "@/shared/ui/components/Base/Button";
import Lucide from "@/shared/ui/components/Base/Lucide";

const variants = [
  "primary",
  "secondary",
  "success",
  "warning",
  "pending",
  "danger",
  "dark",
  "outline-primary",
  "outline-secondary",
  "outline-success",
  "outline-warning",
  "outline-pending",
  "outline-danger",
  "outline-dark",
  "soft-primary",
  "soft-secondary",
  "soft-success",
  "soft-warning",
  "soft-pending",
  "soft-danger",
  "soft-dark",
] as const;

const meta = {
  title: "Components/Button",
  component: Button,
  args: {
    children: "دکمه",
    variant: "primary",
  },
  argTypes: {
    variant: {
      control: "select",
      options: variants,
    },
    size: {
      control: "inline-radio",
      options: [undefined, "sm", "lg"],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const PersianRtl: Story = {
  globals: { locale: "fa", theme: "light" },
  args: { children: "ثبت تغییرات" },
};

export const EnglishLtr: Story = {
  globals: { locale: "en", theme: "dark" },
  args: { children: "Save changes" },
};

export const Variants: Story = {
  render: () => (
    <div className="flex max-w-5xl flex-wrap gap-3">
      {variants.map((variant) => (
        <Button key={variant} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  ),
};

export const VariantsDark: Story = {
  ...Variants,
  globals: { locale: "en", theme: "dark" },
};

export const SizesAndStates: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button variant="primary" size="sm">
        کوچک
      </Button>
      <Button variant="primary">معمولی</Button>
      <Button variant="primary" size="lg">
        بزرگ
      </Button>
      <Button variant="outline-primary" rounded>
        گرد
      </Button>
      <Button variant="primary" elevated>
        برجسته
      </Button>
      <Button variant="primary" disabled>
        غیرفعال
      </Button>
      <Button variant="soft-primary" className="gap-2">
        <Lucide icon="Plus" className="h-4 w-4" />
        افزودن مورد
      </Button>
    </div>
  ),
};
