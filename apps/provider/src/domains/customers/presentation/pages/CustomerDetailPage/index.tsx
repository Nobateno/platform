import { useMemo, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { useCustomerStore, type CustomerTag } from "@/domains/customers/application/customer-store";
import { customersNamespace } from "@/domains/customers/i18n";
import Button from "@/shared/ui/components/Base/Button";
import Lucide from "@/shared/ui/components/Base/Lucide";

const tagKeys: Record<CustomerTag, string> = { regular: "tagRegular", priority: "tagPriority", accessibility: "tagAccessibility" };
const serviceKeys = { haircut: "serviceHaircut", consultation: "serviceConsultation", color: "serviceColor" } as const;
const statusKeys = { confirmed: "statusConfirmed", completed: "statusCompleted", cancelled: "statusCancelled" } as const;

export default function CustomerDetailPage() {
  const { customerId } = useParams();
  const { t, i18n } = useTranslation(customersNamespace);
  const customer = useCustomerStore((state) => state.customers.find((item) => item.id === customerId));
  const addNote = useCustomerStore((state) => state.addNote);
  const setBlocked = useCustomerStore((state) => state.setBlocked);
  const [note, setNote] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const formatter = useMemo(() => new Intl.DateTimeFormat(i18n.language, { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Tehran" }), [i18n.language]);

  if (!customer) {
    return (
      <section className="box box--stacked mx-auto max-w-2xl p-8 text-center">
        <Lucide icon="SearchX" className="mx-auto h-12 w-12 text-slate-400" aria-hidden="true" />
        <h1 className="mt-4 text-lg font-medium">{t("notFound")}</h1>
        <Button as={Link} to="/users" variant="primary" className="mt-6">{t("backToList")}</Button>
      </section>
    );
  }

  const handleNote = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!note.trim()) return;
    addNote(customer.id, note.trim());
    setNote("");
    setAnnouncement(t("noteAdded"));
  };

  const toggleBlocked = () => {
    setBlocked(customer.id, !customer.blocked);
    setAnnouncement(t("blockedUpdated"));
  };

  return (
    <div className="grid grid-cols-12 gap-x-6 gap-y-10">
      <div className="col-span-12">
        <header className="flex flex-col gap-y-3 lg:h-10 lg:flex-row lg:items-center">
          <h1
            className="flex items-center text-lg font-medium group-[.mode--light]:text-white"
            aria-label={`${t("detailTitle")}: ${customer.displayName}`}
          >
            {t("detailTitle")}
            <Lucide icon="ArrowRight" className="mx-2 h-5 w-5 stroke-[1.3]" aria-hidden="true" />
            <span className="text-sm sm:text-lg">{customer.displayName}</span>
          </h1>
          <div className="flex flex-col gap-x-3 gap-y-2 sm:flex-row lg:ms-auto">
            <Button
              as={Link}
              to="/users"
              variant="primary"
              className="group-[.mode--light]:!border-transparent group-[.mode--light]:!bg-white/[0.12] group-[.mode--light]:!text-slate-200"
            >
              <Lucide icon="ArrowLeft" className="me-2 h-4 w-4 stroke-[1.3]" aria-hidden="true" />
              {t("backToList")}
            </Button>
            <Button
              type="button"
              variant={customer.blocked ? "outline-primary" : "outline-danger"}
              className="group-[.mode--light]:!border-transparent group-[.mode--light]:!bg-white/[0.12] group-[.mode--light]:!text-slate-200"
              onClick={toggleBlocked}
            >
              {t(customer.blocked ? "unblockCustomer" : "blockCustomer")}
            </Button>
          </div>
        </header>

      <div className="mt-3.5 grid min-w-0 grid-cols-10 gap-5">
        <aside className="col-span-10 xl:col-span-3">
          <div className="box box--stacked flex flex-col gap-5 p-5">
          <section aria-labelledby="customer-context" className="relative mt-3 rounded-[0.6rem] border border-slate-200/80 dark:border-darkmode-400">
            <h2 id="customer-context" className="absolute start-0 -mt-2 ms-4 bg-white px-3 text-xs uppercase text-slate-500 dark:bg-darkmode-600">
              {t("detailTitle")}
            </h2>
            <p className="px-5 pt-5 text-sm leading-relaxed text-slate-500">
              {t("detailSubtitle")}
            </p>
            <dl className="mt-2.5 flex flex-col gap-5 p-5 pt-2">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2.5">
                <dt className="flex items-center gap-2.5">
                  <Lucide icon="Smartphone" className="h-4 w-4 shrink-0 stroke-[1.3] text-slate-500" aria-hidden="true" />
                  {t("phone")}:
                </dt>
                <dd className="font-mono" dir="ltr">{customer.maskedPhone}</dd>
              </div>
              <div>
                <dt className="flex items-center gap-2.5">
                  <Lucide icon="BookMarked" className="h-4 w-4 shrink-0 stroke-[1.3] text-slate-500" aria-hidden="true" />
                  {t("tags")}:
                </dt>
                <dd className="mt-2 flex flex-wrap gap-2 ps-[26px]">
                  {customer.tags.map((tag) => (
                    <span key={tag} className="rounded-md border border-primary/10 bg-primary/10 px-1.5 py-px text-xs font-medium text-primary">
                      {t(tagKeys[tag])}
                    </span>
                  ))}
                </dd>
              </div>
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2.5">
                <dt className="flex items-center gap-2.5">
                  <Lucide icon="Check" className="h-4 w-4 shrink-0 stroke-[1.3] text-slate-500" aria-hidden="true" />
                  {t("status")}:
                </dt>
                <dd className={`rounded-md border px-1.5 py-px text-xs font-medium ${customer.blocked ? "border-danger/10 bg-danger/10 text-danger" : "border-success/10 bg-success/10 text-success"}`}>
                  {t(customer.blocked ? "blocked" : "active")}
                </dd>
              </div>
            </dl>
          </section>
          </div>
        </aside>

        <div className="col-span-10 flex min-w-0 flex-col gap-5 xl:col-span-7">
        <section aria-labelledby="customer-history" className="box box--stacked min-w-0 p-5">
          <h2 id="customer-history" className="mb-6 border-b border-dashed border-slate-300/70 pb-5 font-medium text-[0.94rem]">{t("historyTitle")}</h2>
          {customer.reservations.length === 0 ? <p className="rounded-[0.6rem] bg-slate-50 p-5 text-sm text-slate-500 dark:bg-darkmode-400">{t("noHistory")}</p> : (
            <div
              className="max-w-full overflow-x-auto focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
              tabIndex={0}
              role="region"
              aria-label={t("historyTitle")}
            >
              <table className="w-full min-w-[540px]">
                <thead><tr><th scope="col" className="border-b border-t border-slate-200/60 bg-slate-50 px-5 py-4 text-start font-medium text-slate-500 dark:border-darkmode-400 dark:bg-darkmode-400">{t("service")}</th><th scope="col" className="border-b border-t border-slate-200/60 bg-slate-50 px-5 py-4 text-start font-medium text-slate-500 dark:border-darkmode-400 dark:bg-darkmode-400">{t("date")}</th><th scope="col" className="border-b border-t border-slate-200/60 bg-slate-50 px-5 py-4 text-start font-medium text-slate-500 dark:border-darkmode-400 dark:bg-darkmode-400">{t("reservationStatus")}</th></tr></thead>
                <tbody>{customer.reservations.map((reservation) => <tr key={reservation.id}><td className="border-b border-dashed border-slate-200/60 px-5 py-4 dark:border-darkmode-400">{t(serviceKeys[reservation.serviceKey])}</td><td className="border-b border-dashed border-slate-200/60 px-5 py-4 dark:border-darkmode-400">{formatter.format(new Date(reservation.startsAt))}</td><td className="border-b border-dashed border-slate-200/60 px-5 py-4 dark:border-darkmode-400">{t(statusKeys[reservation.status])}</td></tr>)}</tbody>
              </table>
            </div>
          )}
        </section>

          <section aria-labelledby="customer-notes" className="box box--stacked p-5">
            <h2 id="customer-notes" className="mb-6 border-b border-dashed border-slate-300/70 pb-5 font-medium text-[0.94rem]">{t("notesTitle")}</h2>
            {customer.notes.length === 0 ? <p className="mt-3 text-sm text-slate-500">{t("noNotes")}</p> : <ul className="mt-4 space-y-2">{customer.notes.map((item) => <li key={item.id} className="rounded-[0.5rem] border border-slate-200/60 bg-slate-50 p-3 text-sm dark:border-darkmode-400 dark:bg-darkmode-400">{item.body}</li>)}</ul>}
            <form onSubmit={handleNote} className="mt-5">
              <label className="block"><span className="mb-2 block font-medium">{t("noteLabel")}</span><textarea value={note} onChange={(event) => setNote(event.target.value)} rows={3} className="w-full rounded-[0.5rem] border border-slate-300/60 bg-white px-3 py-2 shadow-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/20 dark:border-darkmode-400 dark:bg-darkmode-600" placeholder={t("notePlaceholder")} /></label>
              <Button type="submit" variant="primary" className="mt-3 w-full" disabled={!note.trim()}>{t("addNote")}</Button>
            </form>
          </section>
        </div>
      </div>
      <p className="sr-only" aria-live="polite">{announcement}</p>
      </div>
    </div>
  );
}
