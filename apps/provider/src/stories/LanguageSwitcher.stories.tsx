import type { Meta, StoryObj } from "@storybook/react-vite";
import LanguageSwitcher from "@/shared/ui/components/LanguageSwitcher";

const meta = {
  title: "Material 3/Language Switcher",
  component: LanguageSwitcher,
  parameters: {
    docs: {
      description: {
        component:
          "Accessible locale selector shared by the provider shell and settings. Use the Storybook locale toolbar to verify all supported scripts and directions.",
      },
    },
  },
} satisfies Meta<typeof LanguageSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex min-h-32 items-center justify-center rounded-m3-xl bg-m3-surface-container-low">
      <LanguageSwitcher />
    </div>
  ),
};

export const PersianRtl: Story = {
  ...Default,
  globals: { locale: "fa", theme: "light" },
};

export const EnglishLtr: Story = {
  ...Default,
  globals: { locale: "en", theme: "dark" },
};
