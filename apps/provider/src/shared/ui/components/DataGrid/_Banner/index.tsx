import Button from "@/shared/ui/components/Base/Button";
import Lucide from "@/shared/ui/components/Base/Lucide";
import { Menu, Popover } from "@/shared/ui/components/Base/Headless";
import { FormCheck, FormInput } from "@/shared/ui/components/Base/Form";
import {
  useDataGridDispatch,
  useDataGridState,
} from "@/shared/ui/components/DataGrid/_context/hooks";
import { useId, useState } from "react";
import { useTranslation } from "react-i18next";

export function DataGridBanner() {
  const { t } = useTranslation("sharedUi");
  const dispatch = useDataGridDispatch();
  const filterIdPrefix = useId();
  const {
    gridLabel,
    columns,
    searchQuery,
    activeFilterColumns,
    sortColumn,
    sortDirection,
  } = useDataGridState();
  const filterableColumns = columns.filter((column) => column.isFilterable);
  const sortableColumns = columns.filter((column) => column.isSortable);
  const [draftFilterColumns, setDraftFilterColumns] = useState<string[] | null>(
    null,
  );
  const currentDraftFilterColumns = draftFilterColumns ?? activeFilterColumns;

  const toggleDraftFilter = (columnName: string) => {
    setDraftFilterColumns((draft) => {
      const current = draft ?? activeFilterColumns;
      return current.includes(columnName)
        ? current.filter((candidate) => candidate !== columnName)
        : [...current, columnName];
    });
  };

  return (
    <div className="flex flex-col p-5 sm:items-center sm:flex-row gap-y-2">
      <div>
        <div className="relative">
          <Lucide
            icon="Search"
            className="absolute inset-y-0 start-0 z-10 w-4 h-4 my-auto ms-3 stroke-[1.3] text-slate-500"
            aria-hidden="true"
          />
          <FormInput
            type="text"
            role="searchbox"
            aria-label={t("dataGrid.search", { label: gridLabel })}
            placeholder={t("dataGrid.search", { label: gridLabel })}
            className="ps-9 sm:w-64 rounded-[0.5rem]"
            value={searchQuery}
            onChange={(event) =>
              dispatch({
                type: "view/setSearchQuery",
                payload: event.target.value,
              })
            }
          />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-x-3 gap-y-2 sm:ms-auto">
        <Menu>
          <Menu.Button
            as={Button}
            type="button"
            variant="outline-secondary"
            className="w-full sm:w-auto"
            disabled={sortableColumns.length === 0}
          >
            <Lucide
              icon="ListFilter"
              className="stroke-[1.3] w-4 h-4 me-2"
              aria-hidden="true"
            />
            {t("dataGrid.sort")}
            <Lucide
              icon="ChevronDown"
              className="stroke-[1.3] w-4 h-4 ms-2"
              aria-hidden="true"
            />
          </Menu.Button>
          <Menu.Items className="w-40">
            {sortableColumns.map((column) => {
              const columnName = String(column.columnName);
              const isActive = sortColumn === columnName;
              const nextDirection =
                isActive && sortDirection === "asc" ? "desc" : "asc";

              return (
                <Menu.Item
                  key={columnName}
                  onClick={() =>
                    dispatch({
                      type: "view/setSort",
                      payload: {
                        columnName,
                        direction: nextDirection,
                      },
                    })
                  }
                >
                  <Lucide
                    icon={
                      isActive
                        ? sortDirection === "asc"
                          ? "ChevronUp"
                          : "ChevronDown"
                        : "ArrowDownWideNarrow"
                    }
                    className="w-4 h-4 me-2"
                    aria-hidden="true"
                  />
                  {column.label}
                  {isActive && (
                    <span className="sr-only">
                      {t(
                        sortDirection === "asc"
                          ? "dataGrid.sortAscending"
                          : "dataGrid.sortDescending",
                      )}
                    </span>
                  )}
                </Menu.Item>
              );
            })}
          </Menu.Items>
        </Menu>
        <Popover className="inline-block">
          {({ close }) => (
            <>
              <Popover.Button
                as={Button}
                type="button"
                variant="outline-secondary"
                className="w-full sm:w-auto"
                disabled={filterableColumns.length === 0}
              >
                <Lucide
                  icon="Filter"
                  className="stroke-[1.3] w-4 h-4 me-2"
                  aria-hidden="true"
                />
                {t("dataGrid.filter")}
                <div className="flex items-center justify-center h-5 px-1.5 ms-2 text-xs font-medium border rounded-full bg-slate-100">
                  {filterableColumns.length === 0
                    ? 0
                    : activeFilterColumns.length}
                </div>
              </Popover.Button>
              <Popover.Panel placement="bottom-end">
                <div className="p-2">
                  <div className="grid gap-3">
                    {filterableColumns.map((column) => {
                      const columnName = String(column.columnName);
                      const inputId = `${filterIdPrefix}-${columnName}`;

                      return (
                        <FormCheck key={columnName}>
                          <FormCheck.Input
                            id={inputId}
                            type="checkbox"
                            checked={currentDraftFilterColumns.includes(
                              columnName,
                            )}
                            onChange={() => toggleDraftFilter(columnName)}
                          />
                          <FormCheck.Label htmlFor={inputId}>
                            {column.label}
                          </FormCheck.Label>
                        </FormCheck>
                      );
                    })}
                  </div>
                  <div className="flex items-center mt-4">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        setDraftFilterColumns(null);
                        close();
                      }}
                      className="w-32 ms-auto"
                    >
                      {t("dataGrid.cancel")}
                    </Button>
                    <Button
                      type="button"
                      variant="primary"
                      className="w-32 ms-2"
                      onClick={() => {
                        dispatch({
                          type: "view/setFilterColumns",
                          payload: currentDraftFilterColumns,
                        });
                        setDraftFilterColumns(null);
                        close();
                      }}
                    >
                      {t("dataGrid.apply")}
                    </Button>
                  </div>
                </div>
              </Popover.Panel>
            </>
          )}
        </Popover>
      </div>
    </div>
  );
}
