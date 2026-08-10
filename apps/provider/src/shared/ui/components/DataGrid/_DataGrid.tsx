import { useLayoutEffect } from "react";

import Table, { type TableProps } from "@/shared/ui/components/Base/Table";
import { DataGridBanner } from "./_Banner";
import { DataGridHead } from "./_Head";
import { DataGridBody } from "./_Body";
import { DataGridPagination } from "./_Pagination";
import { useDataGridDispatch } from "./_context/hooks";
import { twMerge } from "tailwind-merge";

interface ObjectWithId {
  id: string;
}

export interface DataGridColumn<T> {
  columnName: Extract<keyof T, string>;
  label: string;
  isSortable: boolean;
  isFilterable: boolean;
}

export interface DataGridProps<T extends ObjectWithId> {
  gridLabel: string;
  columns: DataGridColumn<T>[];
  rows: T[];
  showCheckbox?: boolean;
  selectedRowIds?: readonly string[];
  defaultSelectedRowIds?: readonly string[];
  onSelectedRowIdsChange?: (selectedRowIds: string[]) => void;
  emptyMessage?: React.ReactNode;
  renderActions?: (row: T) => React.ReactNode;
  paginationLabels?: {
    firstPage?: string;
    previousPage?: string;
    nextPage?: string;
    lastPage?: string;
    rowsPerPage?: string;
  };
  htmlTableProps?: React.ComponentPropsWithoutRef<"table">;
  dark?: TableProps["dark"];
  bordered?: TableProps["bordered"];
  hover?: TableProps["hover"];
  striped?: TableProps["striped"];
  sm?: TableProps["sm"];
}

export function InternalDataGrid<T extends ObjectWithId>({
  gridLabel,
  columns,
  rows,
  showCheckbox = false,
  selectedRowIds,
  defaultSelectedRowIds,
  onSelectedRowIdsChange,
  emptyMessage,
  renderActions,
  paginationLabels,
  htmlTableProps,
  ...tableProps
}: DataGridProps<T>) {
  const dispatch = useDataGridDispatch();
  useLayoutEffect(() => {
    dispatch({
      type: "initialize/setInitialData",
      payload: {
        columns,
        rows,
        showCheckbox,
        selectedRowIds,
        defaultSelectedRowIds,
        onSelectedRowIdsChange,
        gridLabel,
        numRows: rows.length,
        emptyMessage,
        renderActions,
        paginationLabels,
      },
    });
  }, [
    columns,
    defaultSelectedRowIds,
    dispatch,
    emptyMessage,
    gridLabel,
    paginationLabels,
    onSelectedRowIdsChange,
    renderActions,
    rows,
    selectedRowIds,
    showCheckbox,
  ]);

  return (
    <div className="flex flex-col box box--stacked">
      <DataGridBanner />
      <div className="overflow-auto xl:overflow-visible">
        <Table
          {...tableProps}
          {...htmlTableProps}
          aria-label={htmlTableProps?.["aria-label"] ?? gridLabel}
          className={twMerge(
            "border-b border-slate-200/60",
            htmlTableProps?.className,
          )}
        >
          <DataGridHead />
          <DataGridBody />
        </Table>
      </div>
      <DataGridPagination />
    </div>
  );
}
