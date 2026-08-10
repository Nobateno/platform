import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import Button from "@/shared/ui/components/Base/Button";
import ActivitiesPanel from "@/shared/ui/components/ActivitiesPanel";
import NotificationsPanel from "@/shared/ui/components/NotificationsPanel";
import QuickSearch from "@/shared/ui/components/QuickSearch";
import SwitchAccount from "@/shared/ui/components/SwitchAccount";

const meta = {
  title: "Shared/Shell composites",
  parameters: {
    docs: {
      description: {
        component:
          "Provider-shell dialogs and panels rendered with their real fixtures and close behavior.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function QuickSearchExample() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open quick search</Button>
      <QuickSearch quickSearch={open} setQuickSearch={setOpen} />
    </>
  );
}

function ActivitiesExample() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open activities</Button>
      <ActivitiesPanel activitiesPanel={open} setActivitiesPanel={setOpen} />
    </>
  );
}

function NotificationsExample() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open notifications</Button>
      <NotificationsPanel notificationsPanel={open} setNotificationsPanel={setOpen} />
    </>
  );
}

function SwitchAccountExample() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Switch account</Button>
      <SwitchAccount switchAccount={open} setSwitchAccount={setOpen} />
    </>
  );
}

export const QuickSearchDialog: Story = {
  render: () => <QuickSearchExample />,
};

export const Activities: Story = {
  render: () => <ActivitiesExample />,
};

export const Notifications: Story = {
  render: () => <NotificationsExample />,
};

export const AccountSwitcher: Story = {
  render: () => <SwitchAccountExample />,
};

export const PersianRtl: Story = {
  globals: { locale: "fa", theme: "light" },
  render: () => <NotificationsExample />,
};

export const EnglishLtr: Story = {
  globals: { locale: "en", theme: "dark" },
  render: () => <NotificationsExample />,
};
