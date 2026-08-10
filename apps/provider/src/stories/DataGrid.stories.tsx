import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import Button from "@/shared/ui/components/Base/Button";
import { Menu } from "@/shared/ui/components/Base/Headless";
import DataGrid, {
  type DataGridColumn,
} from "@/shared/ui/components/DataGrid";

interface StoryRow {
  id: string;
  customer: string;
  service: string;
  status: string;
}

const rows: StoryRow[] = Array.from({ length: 23 }, (_, index) => ({
  id: String(index + 1),
  customer: `Customer ${index + 1}`,
  service: index % 2 === 0 ? "Consultation" : "Follow-up",
  status: index % 3 === 0 ? "Pending" : "Confirmed",
}));

const columns: DataGridColumn<StoryRow>[] = [
  { columnName: "customer", label: "Customer", isSortable: true, isFilterable: true },
  { columnName: "service", label: "Service", isSortable: true, isFilterable: true },
  { columnName: "status", label: "Status", isSortable: true, isFilterable: true },
];

const meta = {
  title: "Shared/DataGrid",
  parameters: {
    docs: {
      description: {
        component:
          "Paginated provider table using the original toolbar, with working search, sorting, filtering, row selection, and custom actions.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function DataGridExample({ persian = false }: { persian?: boolean }) {
  const [showRows, setShowRows] = useState(true);
  const labels = persian
    ? {
        grid: "مشتریان",
        empty: "مشتری‌ای برای نمایش وجود ندارد.",
        first: "صفحه نخست",
        previous: "صفحه قبل",
        next: "صفحه بعد",
        last: "صفحه آخر",
        perPage: "تعداد ردیف در هر صفحه",
        action: "مشاهده",
        selected: "ردیف انتخاب شده",
      }
    : {
        grid: "Customers",
        empty: "There are no customers to display.",
        first: "First page",
        previous: "Previous page",
        next: "Next page",
        last: "Last page",
        perPage: "Rows per page",
        action: "View",
        selected: "selected rows",
      };
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);

  return (
    <div className="grid gap-4">
      <Button
        variant="outline-primary"
        className="w-fit"
        onClick={() => setShowRows((value) => !value)}
      >
        {showRows ? labels.empty : labels.grid}
      </Button>
      <p role="status" aria-live="polite" className="text-sm text-m3-on-surface-variant">
        {selectedRowIds.length} {labels.selected}
      </p>
      <DataGrid
        gridLabel={labels.grid}
        columns={columns}
        rows={showRows ? rows : []}
        showCheckbox
        selectedRowIds={selectedRowIds}
        onSelectedRowIdsChange={setSelectedRowIds}
        emptyMessage={labels.empty}
        paginationLabels={{
          firstPage: labels.first,
          previousPage: labels.previous,
          nextPage: labels.next,
          lastPage: labels.last,
          rowsPerPage: labels.perPage,
        }}
        renderActions={(row) => (
          <Menu.Item
            as="button"
            type="button"
            className="w-full"
            aria-label={`${labels.action}: ${row.customer}`}
          >
            {labels.action}
          </Menu.Item>
        )}
      />
    </div>
  );
}

export const PersianRtl: Story = {
  globals: { locale: "fa", theme: "light" },
  render: () => <DataGridExample persian />,
};

export const EnglishLtr: Story = {
  globals: { locale: "en", theme: "dark" },
  render: () => <DataGridExample />,
};

export const Empty: Story = {
  render: () => (
    <DataGrid
      gridLabel="Customers"
      columns={columns}
      rows={[]}
      emptyMessage="There are no customers to display."
    />
  ),
};
