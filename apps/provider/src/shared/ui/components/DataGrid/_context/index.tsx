import { createContext, useReducer } from "react";

import type { DataGridProps } from "@/shared/ui/components/DataGrid/_DataGrid";

export const DataGridStateContext = createContext<DataGridState | undefined>(
  undefined,
);
export const DataGridDispatchContext = createContext<
  React.Dispatch<DataGridAction> | undefined
>(undefined);

type SortDirection = "asc" | "desc";

type DataGridState = Pick<
  DataGridProps<any>,
  | "gridLabel"
  | "columns"
  | "rows"
  | "emptyMessage"
  | "renderActions"
  | "paginationLabels"
> & {
  sourceRows: DataGridProps<any>["rows"];
  numRows: number;
  curPage: number;
  perPage: number;
  showCheckbox: boolean;
  selectedRowIds: string[];
  onSelectedRowIdsChange?: DataGridProps<any>["onSelectedRowIdsChange"];
  searchQuery: string;
  activeFilterColumns: string[];
  sortColumn: string | null;
  sortDirection: SortDirection;
  initialized: boolean;
};

type InitializeAction = {
  type: "initialize/setInitialData";
  payload: {
    columns: DataGridState["columns"];
    rows: DataGridState["rows"];
    showCheckbox: boolean;
    gridLabel: string;
    numRows: number;
    selectedRowIds?: readonly string[];
    defaultSelectedRowIds?: readonly string[];
    onSelectedRowIdsChange?: DataGridState["onSelectedRowIdsChange"];
  } & Pick<
    DataGridState,
    "emptyMessage" | "renderActions" | "paginationLabels"
  >;
};

type RowsAction = { type: "rows/setAllRows"; payload: DataGridState["rows"] };

type ColumnAction = {
  type: "columns/setAllColumns";
  payload: DataGridState["columns"];
};

type PaginationAction =
  | { type: "pagination/setCurPage"; payload: number }
  | { type: "pagination/setPerPage"; payload: number };

type CheckboxAction = { type: "checkbox/setShow"; payload: boolean };

type SelectionAction = {
  type: "selection/setSelectedRowIds";
  payload: string[];
};

type ViewAction =
  | { type: "view/setSearchQuery"; payload: string }
  | { type: "view/setFilterColumns"; payload: string[] }
  | {
      type: "view/setSort";
      payload: { columnName: string; direction: SortDirection };
    };

type DataGridAction =
  | InitializeAction
  | RowsAction
  | ColumnAction
  | PaginationAction
  | CheckboxAction
  | SelectionAction
  | ViewAction;

const initialState: DataGridState = {
  gridLabel: "",
  columns: [],
  rows: [],
  sourceRows: [],
  numRows: 0,
  curPage: 0,
  perPage: 10,
  showCheckbox: false,
  selectedRowIds: [],
  searchQuery: "",
  activeFilterColumns: [],
  sortColumn: null,
  sortDirection: "asc",
  initialized: false,
};

const availableColumnNames = (columns: DataGridState["columns"]) =>
  columns.map((column) => String(column.columnName));

const defaultFilterColumns = (columns: DataGridState["columns"]) => {
  const filterable = columns
    .filter((column) => column.isFilterable)
    .map((column) => String(column.columnName));

  return filterable.length > 0 ? filterable : availableColumnNames(columns);
};

const buildVisibleRows = ({
  sourceRows,
  columns,
  searchQuery,
  activeFilterColumns,
  sortColumn,
  sortDirection,
}: Pick<
  DataGridState,
  | "sourceRows"
  | "columns"
  | "searchQuery"
  | "activeFilterColumns"
  | "sortColumn"
  | "sortDirection"
>) => {
  const normalizedQuery = searchQuery.trim().toLocaleLowerCase();
  const validColumnNames = new Set(availableColumnNames(columns));
  const searchableColumns = activeFilterColumns.filter((columnName) =>
    validColumnNames.has(columnName),
  );
  const visibleRows = normalizedQuery
    ? sourceRows.filter((row) =>
        searchableColumns.some((columnName) =>
          String(row[columnName] ?? "")
            .toLocaleLowerCase()
            .includes(normalizedQuery),
        ),
      )
    : [...sourceRows];

  if (!sortColumn || !validColumnNames.has(sortColumn)) return visibleRows;

  return visibleRows
    .map((row, index) => ({ row, index }))
    .sort((left, right) => {
      const comparison = String(left.row[sortColumn] ?? "").localeCompare(
        String(right.row[sortColumn] ?? ""),
        undefined,
        { numeric: true, sensitivity: "base" },
      );

      return comparison === 0
        ? left.index - right.index
        : sortDirection === "asc"
          ? comparison
          : -comparison;
    })
    .map(({ row }) => row);
};

const withVisibleRows = (
  state: DataGridState,
  updates: Partial<DataGridState>,
  resetPage = false,
): DataGridState => {
  const nextState = { ...state, ...updates };
  const rows = buildVisibleRows(nextState);
  const numRows = rows.length;
  const maxPage = Math.ceil(numRows / nextState.perPage);

  return {
    ...nextState,
    rows,
    numRows,
    curPage:
      numRows === 0
        ? 0
        : resetPage
          ? 1
          : Math.min(Math.max(nextState.curPage, 1), maxPage),
  };
};

function DataGridReducer(
  state: DataGridState,
  action: DataGridAction,
): DataGridState {
  switch (action.type) {
    case "initialize/setInitialData": {
      const validRowIds = new Set(
        action.payload.rows.map((row) => String(row.id)),
      );
      const requestedSelection =
        action.payload.selectedRowIds ??
        (state.initialized
          ? state.selectedRowIds
          : action.payload.defaultSelectedRowIds ?? []);
      const validColumns = new Set(availableColumnNames(action.payload.columns));
      const activeFilterColumns = state.initialized
        ? state.activeFilterColumns.filter((columnName) =>
            validColumns.has(columnName),
          )
        : defaultFilterColumns(action.payload.columns);
      const sortColumn =
        state.sortColumn && validColumns.has(state.sortColumn)
          ? state.sortColumn
          : null;

      return withVisibleRows(state, {
        ...action.payload,
        sourceRows: action.payload.rows,
        activeFilterColumns,
        sortColumn,
        selectedRowIds: requestedSelection.filter((id) => validRowIds.has(id)),
        initialized: true,
      });
    }

    case "rows/setAllRows": {
      const nextRowIds = new Set(action.payload.map((row) => String(row.id)));
      return withVisibleRows(state, {
        sourceRows: action.payload,
        selectedRowIds: state.selectedRowIds.filter((id) =>
          nextRowIds.has(id),
        ),
      });
    }

    case "columns/setAllColumns": {
      const validColumns = new Set(availableColumnNames(action.payload));
      return withVisibleRows(state, {
        columns: action.payload,
        activeFilterColumns: state.activeFilterColumns.filter((columnName) =>
          validColumns.has(columnName),
        ),
        sortColumn:
          state.sortColumn && validColumns.has(state.sortColumn)
            ? state.sortColumn
            : null,
      });
    }

    case "pagination/setCurPage":
      return {
        ...state,
        curPage:
          state.numRows === 0
            ? 0
            : Math.min(
                Math.max(action.payload, 1),
                Math.ceil(state.numRows / state.perPage),
              ),
      };

    case "pagination/setPerPage":
      return {
        ...state,
        perPage: action.payload,
        curPage: state.numRows === 0 ? 0 : 1,
      };

    case "checkbox/setShow":
      return { ...state, showCheckbox: action.payload };

    case "selection/setSelectedRowIds":
      return { ...state, selectedRowIds: action.payload };

    case "view/setSearchQuery":
      return withVisibleRows(
        state,
        { searchQuery: action.payload },
        true,
      );

    case "view/setFilterColumns":
      return withVisibleRows(
        state,
        { activeFilterColumns: action.payload },
        true,
      );

    case "view/setSort":
      return withVisibleRows(
        state,
        {
          sortColumn: action.payload.columnName,
          sortDirection: action.payload.direction,
        },
        true,
      );

    default:
      throw new Error("Unknown action type");
  }
}

function DataGridProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(DataGridReducer, initialState);

  return (
    <DataGridStateContext.Provider value={state}>
      <DataGridDispatchContext.Provider value={dispatch}>
        {children}
      </DataGridDispatchContext.Provider>
    </DataGridStateContext.Provider>
  );
}

export { DataGridProvider };
