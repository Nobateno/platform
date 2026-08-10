import Table from "@/shared/ui/components/Base/Table";
import { FormCheck } from "@/shared/ui/components/Base/Form";
import {
  useDataGridDispatch,
  useDataGridState,
} from "@/shared/ui/components/DataGrid/_context/hooks";
import { useTranslation } from "react-i18next";

export function DataGridHead() {
  const { t } = useTranslation("sharedUi");
  const dispatch = useDataGridDispatch();
  const {
    showCheckbox,
    columns,
    gridLabel,
    rows,
    curPage,
    perPage,
    selectedRowIds,
    onSelectedRowIdsChange,
    renderActions,
    sortColumn,
    sortDirection,
  } = useDataGridState();
  const startIndex = Math.max(curPage - 1, 0) * perPage;
  const pageRowIds = rows
    .slice(startIndex, startIndex + perPage)
    .map((row) => String(row.id));
  const pageRowIdSet = new Set(pageRowIds);
  const allPageRowsSelected =
    pageRowIds.length > 0 &&
    pageRowIds.every((id) => selectedRowIds.includes(id));
  const somePageRowsSelected =
    !allPageRowsSelected &&
    pageRowIds.some((id) => selectedRowIds.includes(id));

  const handleTogglePage = () => {
    const nextSelectedRowIds = allPageRowsSelected
      ? selectedRowIds.filter((id) => !pageRowIdSet.has(id))
      : [
          ...selectedRowIds,
          ...pageRowIds.filter((id) => !selectedRowIds.includes(id)),
        ];

    dispatch({
      type: "selection/setSelectedRowIds",
      payload: nextSelectedRowIds,
    });
    onSelectedRowIdsChange?.(nextSelectedRowIds);
  };

  return (
    <Table.Thead>
      <Table.Tr>
        {showCheckbox && (
          <Table.Th
            scope="col"
            className="m3-body-medium w-5 px-5 py-4 font-medium border-b border-t bg-slate-50 border-slate-200/60 text-slate-500"
          >
            <FormCheck.Input
              type="checkbox"
              aria-label={t("dataGrid.selectAll", { label: gridLabel })}
              aria-checked={somePageRowsSelected ? "mixed" : undefined}
              checked={allPageRowsSelected}
              disabled={pageRowIds.length === 0}
              onChange={handleTogglePage}
            />
          </Table.Th>
        )}
        {columns.map((column) => {
          const columnName = String(column.columnName);
          const ariaSort =
            sortColumn === columnName
              ? sortDirection === "asc"
                ? "ascending"
                : "descending"
              : undefined;

          return (
            <Table.Th
              key={columnName}
              scope="col"
              aria-sort={ariaSort}
              className="m3-body-medium px-5 py-4 font-medium border-b border-t bg-slate-50 border-slate-200/60 text-slate-500"
            >
              {column.label as string}
            </Table.Th>
          );
        })}
        {renderActions && (
          <Table.Th
            scope="col"
            className="m3-body-medium w-5 px-5 py-4 font-medium border-b border-t bg-slate-50 border-slate-200/60 text-slate-500"
          >
            {t("dataGrid.actions")}
          </Table.Th>
        )}
      </Table.Tr>
    </Table.Thead>
  );
}
