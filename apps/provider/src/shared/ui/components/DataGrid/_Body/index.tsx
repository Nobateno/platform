import Table from "@/shared/ui/components/Base/Table";
import Lucide from "@/shared/ui/components/Base/Lucide";
import { FormCheck } from "@/shared/ui/components/Base/Form";
import { Menu } from "@/shared/ui/components/Base/Headless";
import {
  useDataGridDispatch,
  useDataGridState,
} from "@/shared/ui/components/DataGrid/_context/hooks";
import { useTranslation } from "react-i18next";

export function DataGridBody() {
  const { t } = useTranslation("sharedUi");
  const dispatch = useDataGridDispatch();
  const {
    columns,
    rows,
    showCheckbox,
    perPage,
    curPage,
    emptyMessage,
    renderActions,
    selectedRowIds,
    onSelectedRowIdsChange,
  } = useDataGridState();

  const startIndex = Math.max(curPage - 1, 0) * perPage;
  const rowsToShow = rows.slice(startIndex, startIndex + perPage);
  const columnCount =
    columns.length + Number(showCheckbox) + Number(Boolean(renderActions));

  const handleToggleRow = (rowId: string) => {
    const nextSelectedRowIds = selectedRowIds.includes(rowId)
      ? selectedRowIds.filter((id) => id !== rowId)
      : [...selectedRowIds, rowId];

    dispatch({
      type: "selection/setSelectedRowIds",
      payload: nextSelectedRowIds,
    });
    onSelectedRowIdsChange?.(nextSelectedRowIds);
  };

  return (
    <Table.Tbody>
      {rowsToShow.length === 0 ? (
        <Table.Tr>
          <Table.Td
            colSpan={Math.max(columnCount, 1)}
            className="py-10 text-center text-m3-on-surface-variant"
          >
            {emptyMessage ?? t("dataGrid.empty")}
          </Table.Td>
        </Table.Tr>
      ) : (
        rowsToShow.map((row) => (
          <Table.Tr key={row.id} className="[&_td]:last:border-b-0">
            {showCheckbox && (
              <Table.Td className="py-4 border-dashed dark:bg-darkmode-600">
                <FormCheck.Input
                  type="checkbox"
                  aria-label={t("dataGrid.selectRow", { id: row.id })}
                  checked={selectedRowIds.includes(String(row.id))}
                  onChange={() => handleToggleRow(String(row.id))}
                />
              </Table.Td>
            )}
            {columns.map(({ columnName }) => (
              <Table.Td
                key={columnName}
                className="py-4 border-dashed dark:bg-darkmode-600"
              >
                {row[columnName] as React.ReactNode}
              </Table.Td>
            ))}
            {renderActions && (
              <Table.Td className="relative py-4 border-dashed dark:bg-darkmode-600">
                <div className="flex items-center justify-center">
                  <Menu className="h-5">
                    <Menu.Button
                      as="button"
                      type="button"
                      className="w-5 h-5 text-slate-500"
                      aria-label={`${t("dataGrid.actions")} ${row.id}`}
                    >
                      <Lucide
                        icon="MoreVertical"
                        className="w-5 h-5 stroke-slate-400/70 fill-slate-400/70"
                        aria-hidden="true"
                      />
                    </Menu.Button>
                    <Menu.Items className="w-56">
                      {renderActions(row)}
                    </Menu.Items>
                  </Menu>
                </div>
              </Table.Td>
            )}
          </Table.Tr>
        ))
      )}
    </Table.Tbody>
  );
}
