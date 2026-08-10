import { useId } from "react";
import clsx from "clsx";

import Lucide from "@/shared/ui/components/Base/Lucide";
import Pagination from "@/shared/ui/components/Base/Pagination";
import { FormSelect } from "@/shared/ui/components/Base/Form";
import { useTranslation } from "react-i18next";
import {
  useDataGridDispatch,
  useDataGridState,
} from "@/shared/ui/components/DataGrid/_context/hooks";

const perPageOptions = [10, 15, 25, 50];

const generateNumsInRange = (
  activePage: number,
  allPages: number,
  rangeLength: number,
): number[] => {
  if (allPages <= 0) return [];

  const length = Math.min(rangeLength, allPages);
  const maxStart = allPages - length + 1;
  const start = Math.min(
    Math.max(activePage - Math.floor(length / 2), 1),
    maxStart,
  );

  return Array.from({ length }, (_, index) => start + index);
};

export function DataGridPagination() {
  const { t } = useTranslation("sharedUi");
  const dispatch = useDataGridDispatch();
  const selectId = useId();
  const { numRows, perPage, curPage, gridLabel, paginationLabels } =
    useDataGridState();

  const numPages = Math.ceil(numRows / perPage);
  const pageButtons = generateNumsInRange(curPage, numPages, 5);

  const handlePerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({
      type: "pagination/setPerPage",
      payload: Number(event.target.value),
    });
  };

  const handleCurPageChange = (newPage: number) => {
    dispatch({ type: "pagination/setCurPage", payload: newPage });
  };

  return (
    <div className="flex flex-col-reverse flex-wrap items-center p-5 flex-reverse gap-y-2 sm:flex-row">
      <Pagination
        aria-label={t("dataGrid.pagination", { label: gridLabel })}
        className="flex-1 w-full me-auto sm:w-auto"
      >
        <Pagination.Button
          aria-label={paginationLabels?.firstPage ?? t("dataGrid.firstPage")}
          disabled={curPage <= 1}
          className={clsx(
            "border border-inherit",
            curPage <= 1 && "bg-slate-50",
          )}
          onClick={() => handleCurPageChange(1)}
        >
          <Lucide
            icon="ChevronsLeft"
            className="h-4 w-4 rtl:-scale-x-100"
            aria-hidden="true"
          />
        </Pagination.Button>
        <Pagination.Button
          aria-label={
            paginationLabels?.previousPage ?? t("dataGrid.previousPage")
          }
          disabled={curPage <= 1}
          className={clsx(
            "border border-inherit",
            curPage <= 1 && "bg-slate-50",
          )}
          onClick={() => handleCurPageChange(curPage - 1)}
        >
          <Lucide
            icon="ChevronLeft"
            className="h-4 w-4 rtl:-scale-x-100"
            aria-hidden="true"
          />
        </Pagination.Button>

        <Pagination.Button
          disabled
          aria-hidden="true"
          className={clsx(
            curPage <= 5 && "!opacity-0",
            "disabled:cursor-default",
          )}
        >
          ...
        </Pagination.Button>
        {pageButtons.map((pageNumber) => (
          <Pagination.Button
            key={pageNumber}
            aria-label={t("dataGrid.page", { page: pageNumber })}
            active={pageNumber === curPage}
            onClick={() => handleCurPageChange(pageNumber)}
          >
            {pageNumber}
          </Pagination.Button>
        ))}
        <Pagination.Button
          disabled
          aria-hidden="true"
          className={clsx(
            (curPage > numPages - 5 || numPages <= 5) && "!opacity-0",
            "disabled:cursor-default",
          )}
        >
          ...
        </Pagination.Button>

        <Pagination.Button
          aria-label={paginationLabels?.nextPage ?? t("dataGrid.nextPage")}
          disabled={curPage >= numPages}
          className={clsx(
            "border border-inherit",
            curPage >= numPages && "bg-slate-50",
          )}
          onClick={() => handleCurPageChange(curPage + 1)}
        >
          <Lucide
            icon="ChevronRight"
            className="h-4 w-4 rtl:-scale-x-100"
            aria-hidden="true"
          />
        </Pagination.Button>
        <Pagination.Button
          aria-label={paginationLabels?.lastPage ?? t("dataGrid.lastPage")}
          disabled={curPage >= numPages}
          className={clsx(
            "border border-inherit",
            curPage >= numPages && "bg-slate-50",
          )}
          onClick={() => handleCurPageChange(numPages)}
        >
          <Lucide
            icon="ChevronsRight"
            className="h-4 w-4 rtl:-scale-x-100"
            aria-hidden="true"
          />
        </Pagination.Button>
      </Pagination>

      <label htmlFor={selectId} className="sr-only">
        {paginationLabels?.rowsPerPage ?? t("dataGrid.rowsPerPage")}
      </label>
      <FormSelect
        id={selectId}
        className="sm:w-20 rounded-[0.5rem]"
        value={perPage}
        onChange={handlePerPageChange}
      >
        {perPageOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </FormSelect>
    </div>
  );
}
