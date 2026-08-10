import { useCallback, useId, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  useCustomerStore,
  type CustomerTag,
} from "@/domains/customers/application/customer-store";
import { customersNamespace } from "@/domains/customers/i18n";
import Button from "@/shared/ui/components/Base/Button";
import { FormSelect } from "@/shared/ui/components/Base/Form";
import { Menu } from "@/shared/ui/components/Base/Headless";
import Lucide, { type icons } from "@/shared/ui/components/Base/Lucide";
import DataGrid, {
  type DataGridColumn,
} from "@/shared/ui/components/DataGrid";

type StatusFilter = "all" | "active" | "blocked";

interface CustomerGridRow {
  id: string;
  customer: string;
  phone: string;
  tags: string;
  reservations: string;
  lastReservation: string;
  status: string;
}

const tagKeys: Record<CustomerTag, string> = {
  regular: "tagRegular",
  priority: "tagPriority",
  accessibility: "tagAccessibility",
};

interface MetricCardProps {
  label: string;
  value: string;
  icon: keyof typeof icons;
  tone: "primary" | "success" | "danger";
}

function MetricCard({ label, value, icon, tone }: MetricCardProps) {
  return (
    <div className="relative col-span-4 md:col-span-2 xl:col-span-1 p-5 border border-dashed rounded-[0.6rem] border-slate-300/80 box shadow-sm">
      <div className="text-base text-slate-500">{label}</div>
      <div className="mt-1.5 text-2xl font-medium tabular-nums">{value}</div>
      <div className="absolute inset-y-0 end-0 flex flex-col justify-center me-5">
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-full border ${
            tone === "success"
              ? "border-success/10 bg-success/10 text-success"
              : tone === "danger"
                ? "border-danger/10 bg-danger/10 text-danger"
                : "border-primary/10 bg-primary/10 text-primary"
          }`}
          aria-hidden="true"
        >
          <Lucide icon={icon} className="w-4 h-4 stroke-[1.5]" />
        </span>
      </div>
    </div>
  );
}

export default function CustomerListPage() {
  const { t, i18n } = useTranslation(customersNamespace);
  const customers = useCustomerStore((state) => state.customers);
  const [status, setStatus] = useState<StatusFilter>("all");
  const statusId = useId();
  const numberFormatter = useMemo(
    () => new Intl.NumberFormat(i18n.language),
    [i18n.language],
  );
  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(i18n.language, {
        dateStyle: "medium",
        timeZone: "Asia/Tehran",
      }),
    [i18n.language],
  );

  const visibleCustomers = useMemo(
    () =>
      customers.filter(
        (customer) =>
          status === "all" ||
          (status === "blocked" ? customer.blocked : !customer.blocked),
      ),
    [customers, status],
  );

  const rows = useMemo<CustomerGridRow[]>(
    () =>
      visibleCustomers.map((customer) => ({
        id: customer.id,
        customer: customer.displayName,
        phone: customer.maskedPhone,
        tags:
          customer.tags.length > 0
            ? customer.tags.map((tag) => t(tagKeys[tag])).join(", ")
            : "—",
        reservations: numberFormatter.format(customer.reservationCount),
        lastReservation: customer.lastReservationAt
          ? dateFormatter.format(new Date(customer.lastReservationAt))
          : t("never"),
        status: t(customer.blocked ? "blocked" : "active"),
      })),
    [dateFormatter, numberFormatter, t, visibleCustomers],
  );

  const columns = useMemo<DataGridColumn<CustomerGridRow>[]>(
    () => [
      {
        columnName: "customer",
        label: t("customer"),
        isSortable: true,
        isFilterable: true,
      },
      {
        columnName: "phone",
        label: t("phone"),
        isSortable: true,
        isFilterable: true,
      },
      {
        columnName: "tags",
        label: t("tags"),
        isSortable: false,
        isFilterable: true,
      },
      {
        columnName: "reservations",
        label: t("reservations"),
        isSortable: true,
        isFilterable: false,
      },
      {
        columnName: "lastReservation",
        label: t("lastReservation"),
        isSortable: true,
        isFilterable: false,
      },
      {
        columnName: "status",
        label: t("status"),
        isSortable: true,
        isFilterable: true,
      },
    ],
    [t],
  );

  const renderActions = useCallback(
    (row: CustomerGridRow) => (
      <Menu.Item
        as={Link}
        to={`/users/${row.id}`}
        className="w-full"
        aria-label={t("openDetails", { name: row.customer })}
      >
        <Lucide icon="ExternalLink" className="w-4 h-4 me-2" aria-hidden="true" />
        {t("openDetails", { name: row.customer })}
      </Menu.Item>
    ),
    [t],
  );

  const { activeCount, blockedCount, reservationCount } = useMemo(
    () => {
      let active = 0;
      let reservations = 0;
      for (const customer of customers) {
        if (!customer.blocked) active += 1;
        reservations += customer.reservationCount;
      }
      return {
        activeCount: active,
        blockedCount: customers.length - active,
        reservationCount: reservations,
      };
    },
    [customers],
  );

  return (
    <div className="grid grid-cols-12 gap-y-10 gap-x-6">
      <div className="col-span-12">
        <div className="flex flex-col md:h-10 gap-y-3 md:items-center md:flex-row">
          <h1 className="text-base font-medium group-[.mode--light]:text-white">
            {t("title")}
          </h1>
          <div className="flex flex-col sm:flex-row gap-x-3 gap-y-2 md:ms-auto">
            <label htmlFor={statusId} className="sr-only">
              {t("filterLabel")}
            </label>
            <FormSelect
              id={statusId}
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as StatusFilter)
              }
              className="sm:w-44 rounded-[0.5rem]"
            >
              <option value="all">{t("filterAll")}</option>
              <option value="active">{t("filterActive")}</option>
              <option value="blocked">{t("filterBlocked")}</option>
            </FormSelect>
            <Button
              as={Link}
              to="/add-user"
              variant="primary"
              className="group-[.mode--light]:!bg-white/[0.12] group-[.mode--light]:!text-slate-200 group-[.mode--light]:!border-transparent"
            >
              <Lucide icon="PenLine" className="stroke-[1.3] w-4 h-4 me-2" aria-hidden="true" />
              {t("addCustomer")}
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-8 mt-3.5">
          <div className="flex flex-col p-5 box box--stacked">
            <div className="grid grid-cols-4 gap-5">
              <MetricCard
                label={t("title")}
                value={numberFormatter.format(customers.length)}
                icon="Users"
                tone="primary"
              />
              <MetricCard
                label={t("filterActive")}
                value={numberFormatter.format(activeCount)}
                icon="User"
                tone="success"
              />
              <MetricCard
                label={t("filterBlocked")}
                value={numberFormatter.format(blockedCount)}
                icon="Lock"
                tone="danger"
              />
              <MetricCard
                label={t("reservations")}
                value={numberFormatter.format(reservationCount)}
                icon="CalendarCheck2"
                tone="primary"
              />
            </div>
            <div className="flex items-start gap-3 mt-5 pt-5 border-t border-slate-200/60 text-sm text-slate-500">
              <Lucide icon="ShieldCheck" className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
              <p>{t("privacyNotice")}</p>
            </div>
          </div>

          <DataGrid
            gridLabel={t("tableLabel")}
            columns={columns}
            rows={rows}
            showCheckbox
            emptyMessage={t("noResults")}
            renderActions={renderActions}
          />
        </div>
      </div>
    </div>
  );
}
