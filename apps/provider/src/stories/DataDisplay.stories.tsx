import type { Meta, StoryObj } from "@storybook/react-vite";
import FileIcon from "@/shared/ui/components/Base/FileIcon";
import Lucide from "@/shared/ui/components/Base/Lucide";
import Table from "@/shared/ui/components/Base/Table";

const meta = {
  title: "Components/Data display",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const TableVariants: Story = {
  globals: { locale: "en", theme: "light" },
  render: () => (
    <div
      className="box max-w-3xl overflow-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      role="region"
      aria-label="Scrollable reservation table"
      tabIndex={0}
    >
      <Table hover striped aria-label="Upcoming reservations">
        <Table.Thead>
          <Table.Tr>
            <Table.Th scope="col">Customer</Table.Th>
            <Table.Th scope="col">Service</Table.Th>
            <Table.Th scope="col">Time</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr>
            <Table.Td>Samira Ahmadi</Table.Td>
            <Table.Td>Consultation</Table.Td>
            <Table.Td>09:30</Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td>Arman Karimi</Table.Td>
            <Table.Td>Follow-up</Table.Td>
            <Table.Td>11:00</Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </div>
  ),
};

export const FileIcons: Story = {
  render: () => (
    <div className="box flex max-w-2xl flex-wrap gap-8 p-6">
      <FileIcon
        variant="empty-directory"
        className="w-16"
        role="img"
        aria-label="Empty folder"
      />
      <FileIcon
        variant="directory"
        className="w-16"
        role="img"
        aria-label="Folder"
      />
      <FileIcon
        variant="file"
        type="PDF"
        className="w-16"
        role="img"
        aria-label="PDF file"
      />
      <FileIcon
        variant="image"
        src="/assets/images/products/product1-400x400.jpg"
        className="w-16"
      />
    </div>
  ),
};

export const IconSet: Story = {
  render: () => (
    <div className="box grid max-w-3xl grid-cols-2 gap-4 p-6 sm:grid-cols-4">
      {([
        { icon: "Calendar", label: "Calendar" },
        { icon: "Users", label: "Customers" },
        { icon: "Bell", label: "Notifications" },
        { icon: "Settings", label: "Settings" },
        { icon: "Search", label: "Search" },
        { icon: "Plus", label: "Add" },
        { icon: "ArrowLeft", label: "Previous" },
        { icon: "ArrowRight", label: "Next" },
      ] as const).map(
        ({ icon, label }) => (
          <div key={icon} className="flex items-center gap-3">
            <Lucide icon={icon} aria-hidden="true" />
            <span className="text-sm">{label}</span>
          </div>
        ),
      )}
    </div>
  ),
};
