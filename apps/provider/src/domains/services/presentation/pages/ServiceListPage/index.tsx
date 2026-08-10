import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  useServiceStore,
  type CategoryKey,
  type ServiceKey,
  type ServicePriceMode,
} from "@/domains/services/application/service-store";
import { servicesNamespace } from "@/domains/services/i18n";
import Button from "@/shared/ui/components/Base/Button";
import { FormInput, FormSelect } from "@/shared/ui/components/Base/Form";
import { Menu, Popover } from "@/shared/ui/components/Base/Headless";
import Lucide from "@/shared/ui/components/Base/Lucide";
import Pagination from "@/shared/ui/components/Base/Pagination";
import Table from "@/shared/ui/components/Base/Table";

type StatusFilter = "all" | "active" | "inactive";

const serviceKeys: Record<ServiceKey, string> = {
  haircut: "serviceHaircut",
  hairColor: "serviceHairColor",
  consultation: "serviceConsultation",
  styling: "serviceStyling",
};

const categoryKeys: Record<string, string> = {
  hair: "categoryHair",
  beauty: "categoryBeauty",
  consulting: "categoryConsulting",
};

const priceModeKeys: Record<ServicePriceMode, string> = {
  exact: "priceExact",
  startsFrom: "priceStartsFrom",
  hidden: "priceHidden",
  consultation: "priceConsultation",
};

const tableHeadingClassName =
  "py-4 font-medium border-t bg-slate-50 dark:bg-darkmode-700 border-slate-200/60 text-slate-500";
const tableCellClassName =
  "py-4 border-dashed dark:bg-darkmode-600";
const spreadsheetFormulaPrefix = /^[=+\-@\t\r\n]/;

const escapeCsvCell = (value: string | number) => {
  const cell = String(value);
  const safeCell = spreadsheetFormulaPrefix.test(cell) ? `'${cell}` : cell;
  return `"${safeCell.replaceAll('"', '""')}"`;
};

export default function ServiceListPage() {
  const { t, i18n } = useTranslation(servicesNamespace);
  const services = useServiceStore((state) => state.services);
  const toggleService = useServiceStore((state) => state.toggleService);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [pendingStatus, setPendingStatus] =
    useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const currency = useMemo(
    () =>
      new Intl.NumberFormat(i18n.language, {
        style: "currency",
        currency: "IRR",
        maximumFractionDigits: 0,
      }),
    [i18n.language],
  );
  const number = useMemo(
    () => new Intl.NumberFormat(i18n.language),
    [i18n.language],
  );

  const getServiceName = useCallback(
    (nameKey?: ServiceKey, customName?: string) =>
      customName ?? (nameKey ? t(serviceKeys[nameKey]) : ""),
    [t],
  );
  const getCategoryName = (category: CategoryKey) =>
    categoryKeys[category] ? t(categoryKeys[category]) : category;

  const filteredServices = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase(i18n.language);
    return services.filter((service) => {
      const name = getServiceName(
        service.nameKey,
        service.customName,
      ).toLocaleLowerCase(i18n.language);
      const matchesQuery = !normalized || name.includes(normalized);
      const matchesStatus =
        status === "all" ||
        (status === "active" ? service.active : !service.active);
      return matchesQuery && matchesStatus;
    });
  }, [getServiceName, i18n.language, query, services, status]);

  const totalPages = Math.max(1, Math.ceil(filteredServices.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visibleServices = filteredServices.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  const visiblePages = Array.from({ length: totalPages }, (_, index) => index + 1);

  const clearFilters = () => {
    setQuery("");
    setStatus("all");
    setPendingStatus("all");
    setPage(1);
  };

  const exportCsv = () => {
    const rows = filteredServices.map((service) => [
      getServiceName(service.nameKey, service.customName),
      getCategoryName(service.category),
      service.durationMinutes,
      service.priceRials ?? "",
      service.active ? t("active") : t("inactive"),
    ]);
    const csv = [
      [t("service"), t("category"), t("duration"), t("price"), t("status")],
      ...rows,
    ]
      .map((row) => row.map(escapeCsvCell).join(","))
      .join("\n");
    const url = URL.createObjectURL(
      new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "services.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const pageLabel = (targetPage: number) =>
    `${t("tableLabel")}: ${number.format(targetPage)}`;

  return (
    <div className="grid grid-cols-12 gap-y-10 gap-x-6">
      <div className="col-span-12">
        <div className="flex flex-col md:h-10 gap-y-3 md:items-center md:flex-row">
          <h1 className="text-base font-medium group-[.mode--light]:text-white">
            {t("title")}
          </h1>
          <p className="sr-only">{t("subtitle")}</p>
          <div className="flex flex-col sm:flex-row gap-x-3 gap-y-2 md:ms-auto">
            <Button
              as={Link}
              to="/categories"
              variant="outline-secondary"
              className="group-[.mode--light]:!bg-white/[0.12] group-[.mode--light]:!text-slate-200 group-[.mode--light]:!border-transparent"
            >
              <Lucide
                icon="BookMarked"
                className="stroke-[1.3] w-4 h-4 me-2"
                aria-hidden="true"
              />
              {t("categories")}
            </Button>
            <Button
              as={Link}
              to="/add-product"
              variant="primary"
              className="group-[.mode--light]:!bg-white/[0.12] group-[.mode--light]:!text-slate-200 group-[.mode--light]:!border-transparent"
            >
              <Lucide
                icon="PenLine"
                className="stroke-[1.3] w-4 h-4 me-2"
                aria-hidden="true"
              />
              {t("addService")}
            </Button>
          </div>
        </div>

        <div className="mt-3.5">
          <div className="flex flex-col box box--stacked">
            <div className="flex flex-col p-5 sm:items-center sm:flex-row gap-y-2">
              <div>
                <div className="relative">
                  <Lucide
                    icon="Search"
                    className="absolute inset-y-0 start-0 z-10 w-4 h-4 my-auto ms-3 stroke-[1.3] text-slate-500"
                    aria-hidden="true"
                  />
                  <FormInput
                    type="search"
                    value={query}
                    onChange={(event) => {
                      setQuery(event.target.value);
                      setPage(1);
                    }}
                    placeholder={t("searchPlaceholder")}
                    aria-label={t("searchLabel")}
                    className="ps-9 sm:w-64 rounded-[0.5rem]"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-x-3 gap-y-2 sm:ms-auto">
                <Menu>
                  <Menu.Button
                    as={Button}
                    variant="outline-secondary"
                    className="w-full sm:w-auto"
                  >
                    <Lucide
                      icon="Download"
                      className="stroke-[1.3] w-4 h-4 me-2"
                      aria-hidden="true"
                    />
                    {t("export")}
                    <Lucide
                      icon="ChevronDown"
                      className="stroke-[1.3] w-4 h-4 ms-2"
                      aria-hidden="true"
                    />
                  </Menu.Button>
                  <Menu.Items className="w-40">
                    <Menu.Item as="button" type="button" onClick={exportCsv}>
                      <Lucide
                        icon="FileBarChart"
                        className="w-4 h-4 me-2"
                        aria-hidden="true"
                      />
                      CSV
                    </Menu.Item>
                    <Menu.Item
                      as="button"
                      type="button"
                      onClick={() => window.print()}
                    >
                      <Lucide
                        icon="FileBarChart"
                        className="w-4 h-4 me-2"
                        aria-hidden="true"
                      />
                      PDF
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
                <Popover className="inline-block">
                  {({ close }) => (
                    <>
                      <Popover.Button
                        as={Button}
                        variant="outline-secondary"
                        className="w-full sm:w-auto"
                      >
                        <Lucide
                          icon="ArrowDownWideNarrow"
                          className="stroke-[1.3] w-4 h-4 me-2"
                          aria-hidden="true"
                        />
                        {t("filter")}
                        <span className="flex items-center justify-center h-5 px-1.5 ms-2 text-xs font-medium border rounded-full bg-slate-100 dark:bg-darkmode-400">
                          {status === "all" ? 0 : 1}
                        </span>
                      </Popover.Button>
                      <Popover.Panel placement="bottom-end" className="w-72">
                        <div className="p-2">
                          <label
                            htmlFor="service-status-filter"
                            className="block text-start text-slate-500"
                          >
                            {t("status")}
                          </label>
                          <FormSelect
                            id="service-status-filter"
                            value={pendingStatus}
                            onChange={(event) =>
                              setPendingStatus(
                                event.target.value as StatusFilter,
                              )
                            }
                            className="flex-1 mt-2"
                          >
                            <option value="all">{t("filterAll")}</option>
                            <option value="active">{t("filterActive")}</option>
                            <option value="inactive">
                              {t("filterInactive")}
                            </option>
                          </FormSelect>
                          <div className="flex items-center mt-4">
                            <Button
                              type="button"
                              variant="secondary"
                              onClick={() => {
                                setPendingStatus(status);
                                close();
                              }}
                              className="w-32 ms-auto"
                            >
                              {t("translation:common.close")}
                            </Button>
                            <Button
                              type="button"
                              variant="primary"
                              className="w-32 ms-2"
                              onClick={() => {
                                setStatus(pendingStatus);
                                setPage(1);
                                close();
                              }}
                            >
                              {t("apply")}
                            </Button>
                          </div>
                        </div>
                      </Popover.Panel>
                    </>
                  )}
                </Popover>
              </div>
            </div>

            <div className="overflow-auto xl:overflow-visible">
              <Table className="border-b border-slate-200/60">
                <caption className="sr-only">{t("tableLabel")}</caption>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th scope="col" className={tableHeadingClassName}>
                      {t("service")}
                    </Table.Th>
                    <Table.Th scope="col" className={tableHeadingClassName}>
                      {t("category")}
                    </Table.Th>
                    <Table.Th
                      scope="col"
                      className={`${tableHeadingClassName} whitespace-nowrap`}
                    >
                      {t("duration")}
                    </Table.Th>
                    <Table.Th scope="col" className={tableHeadingClassName}>
                      {t("price")}
                    </Table.Th>
                    <Table.Th scope="col" className={tableHeadingClassName}>
                      {t("buffers")}
                    </Table.Th>
                    <Table.Th
                      scope="col"
                      className={`${tableHeadingClassName} text-center`}
                    >
                      {t("team")}
                    </Table.Th>
                    <Table.Th
                      scope="col"
                      className={`${tableHeadingClassName} text-center`}
                    >
                      {t("compatibility")}
                    </Table.Th>
                    <Table.Th
                      scope="col"
                      className={`${tableHeadingClassName} text-center`}
                    >
                      {t("status")}
                    </Table.Th>
                    <Table.Th
                      scope="col"
                      className={`${tableHeadingClassName} text-center w-36`}
                    >
                      {t("actions")}
                    </Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {visibleServices.map((service) => {
                    const name = getServiceName(
                      service.nameKey,
                      service.customName,
                    );
                    const price =
                      service.priceRials &&
                      (service.priceMode === "exact" ||
                        service.priceMode === "startsFrom")
                        ? `${
                            service.priceMode === "startsFrom"
                              ? `${t("priceStartsFrom")} `
                              : ""
                          }${currency.format(service.priceRials)}`
                        : t(priceModeKeys[service.priceMode]);
                    return (
                      <Table.Tr
                        key={service.id}
                        className="[&_td]:last:border-b-0"
                      >
                        <Table.Th
                          scope="row"
                          className={`${tableCellClassName} text-start font-medium whitespace-nowrap`}
                        >
                          {name}
                        </Table.Th>
                        <Table.Td className={tableCellClassName}>
                          <div className="whitespace-nowrap">
                            {getCategoryName(service.category)}
                          </div>
                        </Table.Td>
                        <Table.Td className={tableCellClassName}>
                          <div className="whitespace-nowrap tabular-nums">
                            {t("minutes", {
                              count: service.durationMinutes,
                            })}
                          </div>
                        </Table.Td>
                        <Table.Td className={tableCellClassName}>
                          <div className="whitespace-nowrap">{price}</div>
                        </Table.Td>
                        <Table.Td className={tableCellClassName}>
                          <div className="whitespace-nowrap">
                            {t("bufferSummary", {
                              before: service.bufferBeforeMinutes,
                              after: service.bufferAfterMinutes,
                            })}
                          </div>
                        </Table.Td>
                        <Table.Td
                          className={`${tableCellClassName} text-center`}
                        >
                          <div className="whitespace-nowrap">
                            {t("assignedStaff", {
                              count: service.assignedStaffCount,
                            })}
                          </div>
                        </Table.Td>
                        <Table.Td
                          className={`${tableCellClassName} text-center`}
                        >
                          <div className="whitespace-nowrap">
                            {t(
                              service.multiServiceCompatible
                                ? "compatible"
                                : "singleOnly",
                            )}
                          </div>
                        </Table.Td>
                        <Table.Td
                          className={`${tableCellClassName} text-center`}
                        >
                          <div
                            className={`flex items-center justify-center ${
                              service.active ? "text-success" : "text-danger"
                            }`}
                          >
                            <Lucide
                              icon="Database"
                              className="w-3.5 h-3.5 stroke-[1.7]"
                              aria-hidden="true"
                            />
                            <span className="ms-1.5 whitespace-nowrap">
                              {t(service.active ? "active" : "inactive")}
                            </span>
                          </div>
                        </Table.Td>
                        <Table.Td
                          className={`${tableCellClassName} relative text-center`}
                        >
                          <div className="flex items-center justify-center">
                            <Menu className="h-5">
                              <Menu.Button
                                as="button"
                                type="button"
                                className="w-5 h-5 text-slate-500"
                                aria-label={`${t("actions")}: ${name}`}
                              >
                                <Lucide
                                  icon="MoreVertical"
                                  className="w-5 h-5 stroke-slate-400/70 fill-slate-400/70"
                                  aria-hidden="true"
                                />
                              </Menu.Button>
                              <Menu.Items className="w-52">
                                <Menu.Item
                                  as="button"
                                  type="button"
                                  onClick={() => toggleService(service.id)}
                                >
                                  <Lucide
                                    icon="ToggleLeft"
                                    className="w-4 h-4 me-2"
                                    aria-hidden="true"
                                  />
                                  {t(
                                    service.active
                                      ? "deactivateService"
                                      : "activateService",
                                    { name },
                                  )}
                                </Menu.Item>
                              </Menu.Items>
                            </Menu>
                          </div>
                        </Table.Td>
                      </Table.Tr>
                    );
                  })}
                  {visibleServices.length === 0 && (
                    <Table.Tr>
                      <Table.Td colSpan={9} className="py-12 text-center">
                        <p>{t("noResults")}</p>
                        <Button
                          type="button"
                          variant="outline-primary"
                          size="sm"
                          className="mt-4"
                          onClick={clearFilters}
                        >
                          {t("clearFilters")}
                        </Button>
                      </Table.Td>
                    </Table.Tr>
                  )}
                </Table.Tbody>
              </Table>
            </div>

            <div className="flex flex-col-reverse flex-wrap items-center p-5 flex-reverse gap-y-2 sm:flex-row">
              <Pagination
                className="flex-1 w-full me-auto sm:w-auto"
                aria-label={t("tableLabel")}
              >
                <Pagination.Button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setPage(1)}
                  aria-label={pageLabel(1)}
                >
                  <Lucide
                    icon="ChevronsLeft"
                    className="w-4 h-4"
                    aria-hidden="true"
                  />
                </Pagination.Button>
                <Pagination.Button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setPage(Math.max(1, currentPage - 1))}
                  aria-label={pageLabel(Math.max(1, currentPage - 1))}
                >
                  <Lucide
                    icon="ChevronLeft"
                    className="w-4 h-4"
                    aria-hidden="true"
                  />
                </Pagination.Button>
                {visiblePages.map((pageNumber) => (
                  <Pagination.Button
                    key={pageNumber}
                    type="button"
                    active={pageNumber === currentPage}
                    onClick={() => setPage(pageNumber)}
                    aria-label={pageLabel(pageNumber)}
                  >
                    {number.format(pageNumber)}
                  </Pagination.Button>
                ))}
                <Pagination.Button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setPage(Math.min(totalPages, currentPage + 1))
                  }
                  aria-label={pageLabel(
                    Math.min(totalPages, currentPage + 1),
                  )}
                >
                  <Lucide
                    icon="ChevronRight"
                    className="w-4 h-4"
                    aria-hidden="true"
                  />
                </Pagination.Button>
                <Pagination.Button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setPage(totalPages)}
                  aria-label={pageLabel(totalPages)}
                >
                  <Lucide
                    icon="ChevronsRight"
                    className="w-4 h-4"
                    aria-hidden="true"
                  />
                </Pagination.Button>
              </Pagination>
              <FormSelect
                value={pageSize}
                onChange={(event) => {
                  setPageSize(Number(event.target.value));
                  setPage(1);
                }}
                aria-label={t("tableLabel")}
                className="sm:w-20 rounded-[0.5rem]"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </FormSelect>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
