import { useMemo, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useServiceStore } from "@/domains/services/application/service-store";
import { servicesNamespace } from "@/domains/services/i18n";
import Button from "@/shared/ui/components/Base/Button";
import {
  FormInput,
  FormSelect,
  FormSwitch,
} from "@/shared/ui/components/Base/Form";
import Lucide from "@/shared/ui/components/Base/Lucide";
import Pagination from "@/shared/ui/components/Base/Pagination";
import Table from "@/shared/ui/components/Base/Table";

type StatusFilter = "all" | "active" | "inactive";

const categoryLabels: Record<string, string> = {
  hair: "categoryHair",
  beauty: "categoryBeauty",
  consulting: "categoryConsulting",
};

const tableHeadingClassName =
  "py-4 font-medium border-t bg-slate-50 dark:bg-darkmode-700 border-slate-200/60 text-slate-500";
const tableCellClassName =
  "py-4 border-dashed dark:bg-darkmode-600";

export default function ServiceCategoriesPage() {
  const { t, i18n } = useTranslation(servicesNamespace);
  const categories = useServiceStore((state) => state.categories);
  const services = useServiceStore((state) => state.services);
  const addCategory = useServiceStore((state) => state.addCategory);
  const toggleCategory = useServiceStore((state) => state.toggleCategory);
  const [name, setName] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [announcement, setAnnouncement] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const number = useMemo(
    () => new Intl.NumberFormat(i18n.language),
    [i18n.language],
  );
  const serviceCountByCategory = useMemo(
    () =>
      services.reduce<Record<string, number>>((counts, service) => {
        counts[service.category] = (counts[service.category] ?? 0) + 1;
        return counts;
      }, {}),
    [services],
  );

  const getCategoryName = (category: (typeof categories)[number]) =>
    category.customName ??
    (categoryLabels[category.id]
      ? t(categoryLabels[category.id])
      : category.id);

  const filteredCategories = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase(i18n.language);
    return categories.filter((category) => {
      const categoryName = (
        category.customName ??
        (categoryLabels[category.id]
          ? t(categoryLabels[category.id])
          : category.id)
      ).toLocaleLowerCase(i18n.language);
      const matchesQuery = !normalized || categoryName.includes(normalized);
      const matchesStatus =
        status === "all" ||
        (status === "active" ? category.active : !category.active);
      return matchesQuery && matchesStatus;
    });
  }, [categories, i18n.language, query, status, t]);

  const totalPages = Math.max(1, Math.ceil(filteredCategories.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visibleCategories = filteredCategories.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  const visiblePages = Array.from({ length: totalPages }, (_, index) => index + 1);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) return;
    addCategory(name.trim());
    setName("");
    setAnnouncement(t("categoryAdded"));
  };

  const pageLabel = (targetPage: number) =>
    `${t("categoriesTitle")}: ${number.format(targetPage)}`;

  return (
    <div className="grid grid-cols-12 gap-y-10 gap-x-6">
      <div className="col-span-12">
        <div className="flex flex-col md:h-10 gap-y-3 md:items-center md:flex-row">
          <h1 className="text-base font-medium group-[.mode--light]:text-white">
            {t("categoriesTitle")}
          </h1>
          <p className="sr-only">{t("categoriesSubtitle")}</p>
          <div className="flex flex-col sm:flex-row gap-x-3 gap-y-2 md:ms-auto">
            <Button
              as={Link}
              to="/product-list"
              variant="outline-secondary"
              className="group-[.mode--light]:!bg-white/[0.12] group-[.mode--light]:!text-slate-200 group-[.mode--light]:!border-transparent"
            >
              <Lucide
                icon="ArrowLeft"
                className="stroke-[1.3] w-4 h-4 me-2"
                aria-hidden="true"
              />
              {t("backToServices")}
            </Button>
            <Button
              as="a"
              href="#new-category"
              variant="primary"
              className="group-[.mode--light]:!bg-white/[0.12] group-[.mode--light]:!text-slate-200 group-[.mode--light]:!border-transparent"
            >
              <Lucide
                icon="PenLine"
                className="stroke-[1.3] w-4 h-4 me-2"
                aria-hidden="true"
              />
              {t("addCategory")}
            </Button>
          </div>
        </div>

        <div className="mt-3.5">
          <div className="flex flex-col box box--stacked">
            <div className="flex flex-col p-5 sm:items-center sm:flex-row sm:flex-wrap gap-y-2">
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
                    placeholder={t("categoryNamePlaceholder")}
                    aria-label={t("categoriesTitle")}
                    className="ps-9 sm:w-64 rounded-[0.5rem]"
                  />
                </div>
              </div>
              <form
                id="new-category"
                onSubmit={handleSubmit}
                className="flex flex-col sm:w-full sm:flex-row sm:flex-wrap lg:w-auto lg:flex-nowrap gap-x-3 gap-y-2 sm:ms-auto"
              >
                <FormInput
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder={t("categoryNamePlaceholder")}
                  aria-label={t("categoryNameLabel")}
                  aria-describedby="category-help"
                  className="sm:w-52 rounded-[0.5rem]"
                />
                <Button
                  type="submit"
                  variant="primary"
                  disabled={!name.trim()}
                  className="w-full sm:w-auto"
                >
                  <Lucide
                    icon="Plus"
                    className="stroke-[1.3] w-4 h-4 me-2"
                    aria-hidden="true"
                  />
                  {t("addCategory")}
                </Button>
                <FormSelect
                  value={status}
                  onChange={(event) => {
                    setStatus(event.target.value as StatusFilter);
                    setPage(1);
                  }}
                  aria-label={t("filterLabel")}
                  className="sm:w-40 rounded-[0.5rem]"
                >
                  <option value="all">{t("filterAll")}</option>
                  <option value="active">{t("filterActive")}</option>
                  <option value="inactive">{t("filterInactive")}</option>
                </FormSelect>
              </form>
            </div>

            <div className="overflow-auto xl:overflow-visible">
              <Table className="border-b border-slate-200/60">
                <caption className="sr-only">{t("categoriesTitle")}</caption>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th scope="col" className={tableHeadingClassName}>
                      {t("category")}
                    </Table.Th>
                    <Table.Th
                      scope="col"
                      className={`${tableHeadingClassName} text-center`}
                    >
                      {t("service")}
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
                      {t("active")}
                    </Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {visibleCategories.map((category) => {
                    const categoryName = getCategoryName(category);
                    const count = serviceCountByCategory[category.id] ?? 0;
                    const switchId = `category-status-${category.id}`;

                    return (
                      <Table.Tr
                        key={category.id}
                        className="[&_td]:last:border-b-0"
                      >
                        <Table.Th
                          scope="row"
                          className={`${tableCellClassName} text-start font-medium whitespace-nowrap`}
                        >
                          {categoryName}
                        </Table.Th>
                        <Table.Td
                          className={`${tableCellClassName} text-center`}
                        >
                          <div className="whitespace-nowrap tabular-nums">
                            {t("serviceCount", {
                              count: number.format(count),
                            })}
                          </div>
                        </Table.Td>
                        <Table.Td className={tableCellClassName}>
                          <div
                            className={`flex items-center justify-center ${
                              category.active ? "text-success" : "text-danger"
                            }`}
                          >
                            <Lucide
                              icon="Database"
                              className="w-3.5 h-3.5 stroke-[1.7]"
                              aria-hidden="true"
                            />
                            <div className="ms-1.5 whitespace-nowrap">
                              {t(category.active ? "active" : "inactive")}
                            </div>
                          </div>
                        </Table.Td>
                        <Table.Td
                          className={`${tableCellClassName} text-center`}
                        >
                          <FormSwitch className="inline-flex justify-center">
                            <FormSwitch.Input
                              id={switchId}
                              type="checkbox"
                              role="switch"
                              checked={category.active}
                              onChange={() => toggleCategory(category.id)}
                              aria-label={t("toggleCategory", {
                                name: categoryName,
                              })}
                            />
                          </FormSwitch>
                        </Table.Td>
                      </Table.Tr>
                    );
                  })}
                  {visibleCategories.length === 0 && (
                    <Table.Tr>
                      <Table.Td colSpan={4} className="py-12 text-center">
                        {t("noResults")}
                      </Table.Td>
                    </Table.Tr>
                  )}
                </Table.Tbody>
              </Table>
            </div>

            <div className="flex flex-col-reverse flex-wrap items-center p-5 flex-reverse gap-y-2 sm:flex-row">
              <Pagination
                className="flex-1 w-full me-auto sm:w-auto"
                aria-label={t("categoriesTitle")}
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
                aria-label={t("categoriesTitle")}
                className="sm:w-20 rounded-[0.5rem]"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </FormSelect>
            </div>

            <div className="border-t border-slate-200/80 p-5 dark:border-darkmode-400">
              <p id="category-help" className="text-sm text-slate-500">
                {t("categoryHelp")}
              </p>
              <p className="sr-only" aria-live="polite">
                {announcement}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
