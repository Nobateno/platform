import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import Breadcrumb from "@/shared/ui/components/Base/Breadcrumb";
import Pagination from "@/shared/ui/components/Base/Pagination";

const meta = {
  title: "Components/Navigation",
  parameters: {
    docs: {
      description: {
        component:
          "Breadcrumb and pagination primitives with current-page semantics and keyboard-operable controls.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function PaginationExample({ label }: { label: string }) {
  const [page, setPage] = useState(2);

  return (
    <Pagination aria-label={label} className="max-w-xl">
      {[1, 2, 3, 4].map((pageNumber) => (
        <Pagination.Button
          key={pageNumber}
          active={page === pageNumber}
          aria-label={`${label}: ${pageNumber}`}
          onClick={() => setPage(pageNumber)}
        >
          {pageNumber}
        </Pagination.Button>
      ))}
    </Pagination>
  );
}

function NavigationExample({ persian = false }: { persian?: boolean }) {
  const copy = persian
    ? { home: "داشبورد", list: "رزروها", current: "جزئیات رزرو", pages: "صفحات رزرو" }
    : { home: "Dashboard", list: "Reservations", current: "Reservation details", pages: "Reservation pages" };

  return (
    <div className="box grid max-w-3xl gap-8 p-6">
      <Breadcrumb>
        <Breadcrumb.Link to="/">{copy.home}</Breadcrumb.Link>
        <Breadcrumb.Link to="/reservations">{copy.list}</Breadcrumb.Link>
        <Breadcrumb.Link active>{copy.current}</Breadcrumb.Link>
      </Breadcrumb>
      <PaginationExample label={copy.pages} />
    </div>
  );
}

export const PersianRtl: Story = {
  globals: { locale: "fa", theme: "light" },
  render: () => <NavigationExample persian />,
};

export const EnglishLtr: Story = {
  globals: { locale: "en", theme: "dark" },
  render: () => <NavigationExample />,
};
