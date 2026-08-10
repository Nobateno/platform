import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import Button from "@/shared/ui/components/Base/Button";
import { Dialog, Disclosure, Menu, Popover, Slideover, Tab } from "@/shared/ui/components/Base/Headless";
import Tippy from "@/shared/ui/components/Base/Tippy";

const meta = {
  title: "Components/Overlays and disclosure",
  parameters: {
    docs: {
      description: {
        component:
          "Keyboard-operable overlay and disclosure primitives. Verify Tab, arrow keys, Escape, focus trapping, and focus restoration.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function DialogExample({ persian = false }: { persian?: boolean }) {
  const [open, setOpen] = useState(false);
  const copy = persian
    ? { trigger: "باز کردن گفت‌وگو", title: "تأیید رزرو", body: "این رزرو برای ساعت ۱۰:۳۰ ثبت می‌شود.", close: "بستن" }
    : { trigger: "Open dialog", title: "Confirm reservation", body: "This reservation will be booked for 10:30.", close: "Close" };

  return (
    <>
      <Button onClick={() => setOpen(true)}>{copy.trigger}</Button>
      <Dialog open={open} onClose={setOpen}>
        <Dialog.Panel>
          <Dialog.Title as="h2">{copy.title}</Dialog.Title>
          <Dialog.Description>{copy.body}</Dialog.Description>
          <Dialog.Footer>
            <Button variant="primary" onClick={() => setOpen(false)}>
              {copy.close}
            </Button>
          </Dialog.Footer>
        </Dialog.Panel>
      </Dialog>
    </>
  );
}

function SlideoverExample() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outline-primary" onClick={() => setOpen(true)}>
        Open side panel
      </Button>
      <Slideover open={open} onClose={setOpen}>
        <Slideover.Panel>
          <Slideover.Title as="h2">Reservation details</Slideover.Title>
          <Slideover.Description>
            Side-panel content remains reachable by keyboard and closes with Escape.
          </Slideover.Description>
          <Slideover.Footer>
            <Button onClick={() => setOpen(false)}>Close</Button>
          </Slideover.Footer>
        </Slideover.Panel>
      </Slideover>
    </>
  );
}

export const DialogAndSlideover: Story = {
  render: () => (
    <div className="box flex max-w-2xl flex-wrap gap-4 p-6">
      <DialogExample />
      <SlideoverExample />
    </div>
  ),
};

export const MenuAndPopover: Story = {
  render: () => (
    <div className="box flex min-h-64 max-w-2xl items-start gap-5 p-6">
      <Menu>
        <Menu.Button as={Button} variant="outline-primary">
          Actions
        </Menu.Button>
        <Menu.Items className="w-44">
          <Menu.Item>Edit reservation</Menu.Item>
          <Menu.Item>Cancel reservation</Menu.Item>
        </Menu.Items>
      </Menu>
      <Popover>
        <Popover.Button as={Button} variant="outline-secondary">
          Show filters
        </Popover.Button>
        <Popover.Panel className="w-64 p-4" placement="bottom-start">
          <p className="text-sm">A real popover panel with focusable content.</p>
          <Button className="mt-4 w-full" size="sm">
            Apply
          </Button>
        </Popover.Panel>
      </Popover>
    </div>
  ),
};

export const DisclosureAndTabs: Story = {
  render: () => (
    <div className="grid max-w-3xl gap-8">
      <div className="box p-6">
        <Disclosure defaultOpen>
          <Disclosure.Button>Cancellation policy</Disclosure.Button>
          <Disclosure.Panel>
            Customers may cancel until two hours before the reservation.
          </Disclosure.Panel>
        </Disclosure>
      </div>
      <div className="box p-6">
        <Tab.Group>
          <Tab.List>
            <Tab>
              <Tab.Button as="button" type="button">Upcoming</Tab.Button>
            </Tab>
            <Tab>
              <Tab.Button as="button" type="button">Completed</Tab.Button>
            </Tab>
          </Tab.List>
          <Tab.Panels className="pt-5">
            <Tab.Panel>Three upcoming reservations.</Tab.Panel>
            <Tab.Panel>Twelve completed reservations.</Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  ),
};

export const Tooltip: Story = {
  render: () => (
    <div className="box flex min-h-32 max-w-md items-center justify-center p-6">
      <Tippy content="Create a new reservation">
        <Button>New reservation</Button>
      </Tippy>
    </div>
  ),
};

export const PersianRtl: Story = {
  globals: { locale: "fa", theme: "light" },
  render: () => <DialogExample persian />,
};

export const EnglishLtr: Story = {
  globals: { locale: "en", theme: "dark" },
  render: () => <DialogExample />,
};
