import { useState } from "react";
import { useTranslation } from "react-i18next";
import { billingNamespace } from "@/domains/plan-billing/i18n";
import { Link } from "@/shared/lib/navigation";
import Button from "@/shared/ui/components/Base/Button";
import { Menu, Tab } from "@/shared/ui/components/Base/Headless";
import Lucide from "@/shared/ui/components/Base/Lucide";
import Table from "@/shared/ui/components/Base/Table";

const coreFeatures = [
  "unlimitedServices",
  "unlimitedCustomers",
  "unlimitedBookings",
  "intakeChannels",
  "policies",
  "publicPage",
  "tokens",
] as const;

const plans = [
  { key: "basic", fit: "basicFit", boundary: "basicBoundary", current: true },
  { key: "growth", fit: "growthFit", boundary: "growthBoundary", current: false },
  { key: "brandPro", fit: "brandFit", boundary: "brandBoundary", current: false },
  { key: "studioScale", fit: "scaleFit", boundary: "scaleBoundary", current: false },
] as const;

export default function BillingPage() {
  const { t } = useTranslation(billingNamespace);
  const [announcement, setAnnouncement] = useState("");
  const totalDays = 60;
  const remainingDays = 18;
  const usedDays = totalDays - remainingDays;
  const usedPercentage = Math.round((usedDays / totalDays) * 100);

  return (
    <div className="grid grid-cols-12 gap-y-10 gap-x-6 overflow-x-clip">
      <div className="col-span-12">
        <div className="flex flex-col md:h-10 gap-y-3 md:items-center md:flex-row">
          <h1 className="text-base font-medium group-[.mode--light]:text-white">
            {t("title")}
          </h1>
          <div className="flex flex-col sm:flex-row gap-x-3 gap-y-2 md:ms-auto">
            <Button
              as={Link}
              to="/booking-page"
              variant="primary"
              className="group-[.mode--light]:!bg-white/[0.12] group-[.mode--light]:!text-slate-200 group-[.mode--light]:!border-transparent"
            >
              <Lucide icon="ExternalLink" className="stroke-[1.3] w-4 h-4 me-3" aria-hidden="true" />
              {t("bookingPage")}
            </Button>
          </div>
        </div>

        <div className="mt-3.5 grid grid-cols-12 gap-y-10 gap-x-6">
          <section
            aria-labelledby="trial-heading"
            className="col-span-12 min-w-0 xl:col-span-8"
          >
            <div className="flex min-w-0 flex-col p-5 sm:p-14 box box--stacked">
              <div className="flex flex-col gap-y-7 md:flex-row px-8 sm:px-10 py-12 sm:py-16 sm:-mx-10 sm:-mt-10 border bg-primary/[0.03] border-primary/5 rounded-lg">
                <div className="flex flex-col justify-center">
                  <div className="rounded-[0.6rem] w-[50px] h-[50px] border border-primary/50 flex items-center justify-center">
                    <div className="flex items-center justify-center w-[45px] rounded-lg h-[45px] bg-gradient-to-r from-theme-1/90 to-theme-2/90 transition-transform ease-in-out group-[.side-menu--collapsed.side-menu--on-hover]:-rotate-180">
                      <div className="w-[23px] h-[23px] relative -rotate-45 [&_div]:bg-white" aria-hidden="true">
                        <div className="absolute w-[21%] start-0 inset-y-0 my-auto rounded-full opacity-50 h-[75%]" />
                        <div className="absolute w-[21%] inset-0 m-auto h-[120%] rounded-full" />
                        <div className="absolute w-[21%] end-0 inset-y-0 my-auto rounded-full opacity-50 h-[75%]" />
                      </div>
                    </div>
                  </div>
                  <h2 id="trial-heading" className="mt-3.5 text-lg font-medium text-slate-600/90 dark:text-slate-300">
                    {t("trialTitle")}
                  </h2>
                </div>
                <div className="md:text-end md:ms-auto">
                  <div className="-mt-1 text-lg font-medium text-primary">{t("trialActive")}</div>
                  <div className="mt-1">{t("trialDays", { count: remainingDays })}</div>
                  <div
                    className="mt-7"
                    role="progressbar"
                    aria-label={t("trialProgress", { used: usedDays, total: totalDays })}
                    aria-valuemin={0}
                    aria-valuemax={totalDays}
                    aria-valuenow={usedDays}
                    aria-valuetext={t("trialProgress", { used: usedDays, total: totalDays })}
                  >
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {t("trialProgress", { used: usedDays, total: totalDays })}
                    </div>
                    <div className="flex h-2 mt-3.5 overflow-hidden rounded">
                      <div
                        className="h-full border border-primary/50 bg-primary/50"
                        style={{ width: `${usedPercentage}%` }}
                      />
                      <div className="h-full flex-1 border border-success/50 bg-success/50" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col px-8 pt-4 mt-6 sm:px-0 sm:flex-row">
                <div className="max-w-2xl">
                  <div className="text-slate-500">{t("subtitle")}</div>
                  <p className="mt-1.5 text-base font-medium leading-relaxed text-primary">
                    {t("trialDescription")}
                  </p>
                </div>
                <dl className="flex flex-col gap-4 sm:ms-auto sm:text-end mt-7 sm:mt-0 sm:max-w-xs">
                  <div>
                    <dt className="text-slate-500">{t("renewalState")}:</dt>
                    <dd className="mt-1.5 font-medium text-slate-600 dark:text-slate-300">
                      {t("renewalActionRequired")}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">{t("paymentMethod")}:</dt>
                    <dd className="mt-1.5 font-medium text-slate-600 dark:text-slate-300">
                      {t("paymentNotRequired")}
                    </dd>
                  </div>
                </dl>
              </div>

              <section aria-labelledby="plans-heading" className="mt-10 min-w-0">
                <h2 id="plans-heading" className="text-base font-medium">
                  {t("compareTitle")}
                </h2>
                <p className="mt-1 text-slate-500">{t("compareDescription")}</p>
                <div
                  className="mt-5 max-w-full overflow-auto rounded-[0.6rem] border border-slate-200/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  role="region"
                  aria-label={t("compareTitle")}
                  tabIndex={0}
                >
                  <Table className="min-w-[56rem]">
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th className="py-4 font-medium bg-slate-50 first:rounded-ss-[0.6rem] last:rounded-se-[0.6rem] border-slate-200/80 text-slate-500 dark:bg-darkmode-700" scope="col">
                          {t("compareTitle")}
                        </Table.Th>
                        <Table.Th className="py-4 font-medium bg-slate-50 first:rounded-ss-[0.6rem] last:rounded-se-[0.6rem] border-slate-200/80 text-slate-500 dark:bg-darkmode-700" scope="col">
                          {t("coreTitle")}
                        </Table.Th>
                        <Table.Th className="py-4 font-medium bg-slate-50 first:rounded-ss-[0.6rem] last:rounded-se-[0.6rem] border-slate-200/80 text-slate-500 dark:bg-darkmode-700" scope="col">
                          {t("productDecision")}
                        </Table.Th>
                        <Table.Th className="text-end py-4 font-medium bg-slate-50 first:rounded-ss-[0.6rem] last:rounded-se-[0.6rem] border-slate-200/80 text-slate-500 dark:bg-darkmode-700" scope="col">
                          <span className="sr-only">{t("compareTitle")}</span>
                        </Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {plans.map((plan) => {
                        const planName = t(plan.key);
                        return (
                          <Table.Tr key={plan.key} className="[&_td]:last:border-b-0 [&_th]:last:border-b-0">
                            <Table.Th
                              scope="row"
                              className="py-4 text-start border-b border-dashed border-slate-300/70 dark:bg-darkmode-600"
                            >
                              <div className="font-medium whitespace-nowrap text-primary">{planName}</div>
                              {plan.current && (
                                <div className="mt-1.5 text-xs font-normal text-slate-500">
                                  {t("currentPlan")}
                                </div>
                              )}
                            </Table.Th>
                            <Table.Td className="py-4 border-dashed border-slate-300/70 dark:bg-darkmode-600">
                              <div className="max-w-xs leading-relaxed">{t(plan.fit)}</div>
                            </Table.Td>
                            <Table.Td className="py-4 border-dashed border-slate-300/70 dark:bg-darkmode-600">
                              <div className="max-w-xs leading-relaxed">{t(plan.boundary)}</div>
                            </Table.Td>
                            <Table.Td className="relative py-4 border-dashed border-slate-300/70 dark:bg-darkmode-600">
                              <div className="flex items-center justify-center">
                                <Menu className="h-5">
                                  <Menu.Button
                                    as="button"
                                    type="button"
                                    className="h-5 w-5 text-slate-500"
                                    aria-label={`${t("actions")}: ${planName}`}
                                  >
                                    <Lucide
                                      icon="MoreVertical"
                                      className="h-5 w-5 stroke-slate-400/70 fill-slate-400/70"
                                      aria-hidden="true"
                                    />
                                  </Menu.Button>
                                  <Menu.Items className="w-52">
                                    <Menu.Item
                                      as="button"
                                      type="button"
                                      onClick={() =>
                                        setAnnouncement(
                                          t("selectionNotice", { plan: planName }),
                                        )
                                      }
                                    >
                                      <Lucide
                                        icon="CheckSquare"
                                        className="h-4 w-4 me-2"
                                        aria-hidden="true"
                                      />
                                      {t("explorePlan", { plan: planName })}
                                    </Menu.Item>
                                  </Menu.Items>
                                </Menu>
                              </div>
                            </Table.Td>
                          </Table.Tr>
                        );
                      })}
                    </Table.Tbody>
                  </Table>
                </div>
                <p aria-live="polite" className="mt-3 min-h-5 text-sm text-primary">
                  {announcement}
                </p>
              </section>

              <dl className="flex flex-col gap-3.5 pe-5 my-10 ms-auto text-end">
                <div className="flex items-center justify-end">
                  <dt className="text-slate-500">{t("renewalState")}:</dt>
                  <dd className="w-20 font-medium sm:w-52 text-slate-600 dark:text-slate-300">
                    {t("renewalActionRequired")}
                  </dd>
                </div>
                <div className="flex items-center justify-end">
                  <dt className="text-slate-500">{t("paymentMethod")}:</dt>
                  <dd className="w-20 font-medium sm:w-52 text-slate-600 dark:text-slate-300">
                    {t("paymentNotRequired")}
                  </dd>
                </div>
                <div className="flex items-center justify-end">
                  <dt className="text-slate-500">{t("trialProgress", { used: usedDays, total: totalDays })}:</dt>
                  <dd className="w-20 font-medium sm:w-52 text-slate-600 dark:text-slate-300">
                    {t("trialDays", { count: remainingDays })}
                  </dd>
                </div>
              </dl>

              <div className="pt-6 sm:px-10 sm:-mx-8 border-t border-dashed border-slate-200/80">
                <h3 className="text-base font-medium">{t("expiryTitle")}</h3>
                <p className="mt-1 text-slate-500">{t("expiryDescription")}</p>
                <p className="flex items-start gap-2 mt-5 text-slate-500">
                  <Lucide icon="Info" className="w-4 h-4 mt-0.5" aria-hidden="true" />
                  {t("productDecision")}
                </p>
                <div className="mt-5 text-slate-500">© {new Date().getFullYear()} Nobateno.</div>
              </div>
            </div>
          </section>

          <aside className="col-span-12 min-w-0 xl:col-span-4" aria-label={t("receiptsTitle")}>
            <div className="flex min-w-0 flex-col p-5 box box--stacked">
              <h2 className="pb-5 mb-5 font-medium border-b border-dashed border-slate-300/70 text-[0.94rem]">
                {t("receiptsTitle")}
              </h2>
              <div>
                <div className="flex">
                  <div>
                    <span className="text-lg font-medium">{t("trialDays", { count: remainingDays })}</span>
                  </div>
                </div>
                <div
                  className="flex h-2 mt-3.5 overflow-hidden rounded"
                  role="progressbar"
                  aria-label={t("trialProgress", { used: usedDays, total: totalDays })}
                  aria-valuemin={0}
                  aria-valuemax={totalDays}
                  aria-valuenow={usedDays}
                  aria-valuetext={t("trialProgress", { used: usedDays, total: totalDays })}
                >
                  <div
                    className="h-full border border-primary/50 bg-primary/50"
                    style={{ width: `${usedPercentage}%` }}
                  />
                  <div className="h-full flex-1 border border-success/50 bg-success/50" />
                </div>

                <Tab.Group className="mt-8">
                  <Tab.List
                    variant="boxed-tabs"
                    className="bg-white shadow-sm rounded-[0.6rem] border-slate-200 dark:bg-darkmode-600"
                  >
                    <Tab className="bg-slate-50 first:rounded-s-[0.6rem] last:rounded-e-[0.6rem] [&[aria-selected='true']_button]:text-current dark:bg-darkmode-700">
                      <Tab.Button
                        className="w-full text-xs leading-tight text-slate-500 flex items-center justify-center whitespace-normal rounded-[0.6rem] sm:text-sm"
                        as="button"
                      >
                        <span className="w-2 h-2 me-2 border rounded-full border-primary/60 bg-primary/60" aria-hidden="true" />
                        {t("coreTitle")}
                      </Tab.Button>
                    </Tab>
                    <Tab className="bg-slate-50 first:rounded-s-[0.6rem] last:rounded-e-[0.6rem] [&[aria-selected='true']_button]:text-current dark:bg-darkmode-700">
                      <Tab.Button
                        className="w-full text-xs leading-tight text-slate-500 flex items-center justify-center whitespace-normal rounded-[0.6rem] sm:text-sm"
                        as="button"
                      >
                        <span className="w-2 h-2 me-2 border rounded-full border-success/60 bg-success/60" aria-hidden="true" />
                        {t("receiptsTitle")}
                      </Tab.Button>
                    </Tab>
                  </Tab.List>
                  <Tab.Panels className="mt-3">
                    <Tab.Panel>
                      <ul className="border border-dashed rounded-[0.6rem] border-slate-300/80">
                        {coreFeatures.map((feature) => (
                          <li
                            key={feature}
                            className="flex items-start px-5 py-4 border-b border-dashed border-slate-300/80 last:border-b-0 hover:bg-slate-50 dark:hover:bg-darkmode-700"
                          >
                            <Lucide
                              icon="Check"
                              className="w-4 h-4 mt-0.5 me-2.5 text-success"
                              aria-hidden="true"
                            />
                            <span className="leading-relaxed">{t(feature)}</span>
                          </li>
                        ))}
                      </ul>
                      <p className="flex items-start gap-2 mt-4 text-xs leading-relaxed text-slate-500">
                        <Lucide icon="Info" className="w-4 h-4 mt-0.5" aria-hidden="true" />
                        {t("tokenNote")}
                      </p>
                      <Button
                        as={Link}
                        to="/communications"
                        variant="primary"
                        className="w-full mt-3 bg-white text-primary border-primary/[0.15] hover:bg-primary/20 dark:bg-darkmode-600"
                      >
                        {t("tokenSettings")}
                        <Lucide icon="ArrowRight" className="stroke-[1.3] w-4 h-4 ms-2" aria-hidden="true" />
                      </Button>
                    </Tab.Panel>
                    <Tab.Panel>
                      <div className="border border-dashed rounded-[0.6rem] border-slate-300/80 px-5 py-8 text-center">
                        <Lucide icon="Files" className="mx-auto w-9 h-9 text-slate-500" aria-hidden="true" />
                        <p className="mt-3 font-medium">{t("noReceipts")}</p>
                        <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
                          {t("receiptsDescription")}
                        </p>
                      </div>
                    </Tab.Panel>
                  </Tab.Panels>
                </Tab.Group>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
