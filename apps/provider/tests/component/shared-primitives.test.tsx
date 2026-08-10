import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import i18n from "@/app/i18n";
import Alert from "@/shared/ui/components/Base/Alert";
import Breadcrumb from "@/shared/ui/components/Base/Breadcrumb";
import Button from "@/shared/ui/components/Base/Button";
import { Tab } from "@/shared/ui/components/Base/Headless";
import Pagination from "@/shared/ui/components/Base/Pagination";
import Progress from "@/shared/ui/components/Base/Progress";
import DataGrid, {
  type DataGridColumn,
} from "@/shared/ui/components/DataGrid";

interface Row {
  id: string;
  name: string;
  service: string;
}

const columns: DataGridColumn<Row>[] = [
  { columnName: "name", label: "Name", isSortable: false, isFilterable: false },
  { columnName: "service", label: "Service", isSortable: false, isFilterable: false },
];

const sortableColumns: DataGridColumn<Row>[] = [
  { columnName: "name", label: "Name", isSortable: true, isFilterable: false },
  { columnName: "service", label: "Service", isSortable: false, isFilterable: false },
];

const rows: Row[] = Array.from({ length: 12 }, (_, index) => ({
  id: String(index + 1),
  name: `Customer ${index + 1}`,
  service: "Consultation",
}));

describe("shared primitives", () => {
  beforeEach(async () => {
    await act(() => i18n.changeLanguage("en"));
  });

  it("preserves the original default button geometry", () => {
    render(<Button>Save</Button>);

    expect(screen.getByRole("button", { name: "Save" })).toHaveClass("min-h-10");
  });

  it("uses contrast-safe status foregrounds", () => {
    render(
      <>
        <Button variant="success">Saved</Button>
        <Button variant="pending">Queued</Button>
        <Button variant="soft-danger">Pending</Button>
        <Alert state="warn" title="Needs attention" />
        <Alert state="success" title="Available" />
      </>,
    );

    expect(screen.getByRole("button", { name: "Saved" })).toHaveClass(
      "text-slate-900",
    );
    expect(screen.getByRole("button", { name: "Queued" })).toHaveClass(
      "text-white",
    );
    expect(screen.getByRole("button", { name: "Pending" })).toHaveClass(
      "text-slate-900",
      "dark:text-danger",
    );
    const statuses = screen.getAllByRole("status");
    expect(statuses[0]).toHaveClass("bg-m3-warning/10");
    expect(statuses[1]).toHaveClass("bg-m3-success/10");
  });

  it("places tab semantics on the focusable control", async () => {
    const user = userEvent.setup();
    render(
      <Tab.Group>
        <Tab.List>
          <Tab>
            <Tab.Button>Upcoming</Tab.Button>
          </Tab>
          <Tab>
            <Tab.Button>Completed</Tab.Button>
          </Tab>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>Upcoming reservations</Tab.Panel>
          <Tab.Panel>Completed reservations</Tab.Panel>
        </Tab.Panels>
      </Tab.Group>,
    );

    const upcoming = screen.getByRole("tab", { name: "Upcoming" });
    const completed = screen.getByRole("tab", { name: "Completed" });
    expect(upcoming.tagName).toBe("A");
    expect(upcoming.querySelector("button, a")).toBeNull();

    upcoming.focus();
    await user.keyboard("{ArrowRight}");
    expect(completed).toHaveFocus();
    expect(completed).toHaveAttribute("aria-selected", "true");
  });

  it("marks the current breadcrumb without making it a link", () => {
    render(
      <MemoryRouter>
        <Breadcrumb>
          <Breadcrumb.Link to="/">Dashboard</Breadcrumb.Link>
          <Breadcrumb.Link to="/reservations">Reservations</Breadcrumb.Link>
          <Breadcrumb.Link active>Details</Breadcrumb.Link>
        </Breadcrumb>
      </MemoryRouter>,
    );

    expect(screen.getByText("Details")).toHaveAttribute("aria-current", "page");
    expect(screen.queryByRole("link", { name: "Details" })).not.toBeInTheDocument();
  });

  it("forwards pagination semantics", () => {
    render(
      <Pagination aria-label="Reservation pages">
        <Pagination.Button active>2</Pagination.Button>
        <Pagination.Link href="?page=3">3</Pagination.Link>
      </Pagination>,
    );

    expect(screen.getByRole("navigation", { name: "Reservation pages" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "2" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "3" })).toHaveAttribute("href", "?page=3");
  });

  it("exposes determinate progress values", () => {
    render(
      <Progress value={140} aria-label="Upload progress">
        <Progress.Bar style={{ width: "100%" }} />
      </Progress>,
    );

    expect(screen.getByRole("progressbar", { name: "Upload progress" })).toHaveAttribute(
      "aria-valuenow",
      "100",
    );
  });

  it("keeps DataGrid props, table semantics, and pagination in sync", async () => {
    const user = userEvent.setup();
    const handleSelectedRowsChange = vi.fn();
    const view = render(
      <DataGrid
        gridLabel="Customers"
        columns={columns}
        rows={rows}
        showCheckbox
        emptyMessage="No customers"
        onSelectedRowIdsChange={handleSelectedRowsChange}
      />,
    );

    const table = screen.getByRole("table", { name: "Customers" });
    expect(table.parentElement).toHaveClass("overflow-auto", "xl:overflow-visible");
    expect(table.parentElement?.parentElement).toHaveClass(
      "flex",
      "flex-col",
      "box",
      "box--stacked",
    );
    expect(within(table).getAllByRole("columnheader")).toHaveLength(3);
    expect(within(table).queryByText("Actions")).not.toBeInTheDocument();
    expect(
      within(table).getByRole("checkbox", { name: "Select all Customers" }),
    ).toBeInTheDocument();
    expect(within(table).getByText("Customer 1")).toBeInTheDocument();
    expect(within(table).queryByText("Customer 11")).not.toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: "Customers pages" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Rows per page" })).toHaveValue("10");
    const search = screen.getByRole("searchbox", {
      name: "Search Customers",
    });
    await user.type(search, "Customer 12");
    expect(within(table).getByText("Customer 12")).toBeInTheDocument();
    expect(within(table).queryByText("Customer 1")).not.toBeInTheDocument();
    await user.clear(search);

    const firstRowCheckbox = screen.getByRole("checkbox", {
      name: "Select row 1",
    });
    expect(firstRowCheckbox).toBeInTheDocument();
    await user.click(firstRowCheckbox);
    expect(firstRowCheckbox).toBeChecked();
    expect(handleSelectedRowsChange).toHaveBeenLastCalledWith(["1"]);

    await user.click(
      within(table).getByRole("checkbox", { name: "Select all Customers" }),
    );
    expect(firstRowCheckbox).toBeChecked();
    expect(handleSelectedRowsChange).toHaveBeenLastCalledWith(
      Array.from({ length: 10 }, (_, index) => String(index + 1)),
    );

    const pageTwoButton = screen
      .getAllByRole("button", { name: "Page 2" })
      .find((button) => button.textContent === "2");
    expect(pageTwoButton).toBeDefined();
    await user.click(pageTwoButton!);
    expect(within(table).getByText("Customer 11")).toBeInTheDocument();
    expect(pageTwoButton).toHaveAttribute("aria-current", "page");

    view.rerender(
      <DataGrid
        gridLabel="Customers"
        columns={columns}
        rows={[]}
        emptyMessage="No customers"
      />,
    );

    expect(await screen.findByText("No customers")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Customers pages" })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Rows per page" })).toHaveValue("10");
  });

  it("respects disabled column features and announces sort direction", async () => {
    const user = userEvent.setup();
    const view = render(
      <DataGrid gridLabel="Customers" columns={columns} rows={rows.slice(0, 2)} />,
    );

    expect(screen.getByRole("button", { name: /^Sort/ })).toBeDisabled();
    expect(screen.getByRole("button", { name: /^Filter/ })).toBeDisabled();

    view.rerender(
      <DataGrid
        gridLabel="Customers"
        columns={sortableColumns}
        rows={rows.slice(0, 2)}
      />,
    );

    const sortButton = screen.getByRole("button", { name: /^Sort/ });
    await user.click(sortButton);
    await user.click(screen.getByRole("menuitem", { name: /^Name/ }));
    expect(screen.getByRole("columnheader", { name: "Name" })).toHaveAttribute(
      "aria-sort",
      "ascending",
    );

    await user.click(sortButton);
    await user.click(screen.getByRole("menuitem", { name: /^Name/ }));
    expect(screen.getByRole("columnheader", { name: "Name" })).toHaveAttribute(
      "aria-sort",
      "descending",
    );
  });
});
