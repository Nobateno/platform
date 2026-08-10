import { useId, useMemo, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import clsx from "clsx";
import {
  useServiceStore,
  type CategoryKey,
  type ServicePriceMode,
} from "@/domains/services/application/service-store";
import { servicesNamespace } from "@/domains/services/i18n";
import Button from "@/shared/ui/components/Base/Button";
import {
  FormCheck,
  FormInput,
  FormSelect,
  FormSwitch,
} from "@/shared/ui/components/Base/Form";
import Lucide from "@/shared/ui/components/Base/Lucide";

const priceModes: Array<{ value: ServicePriceMode; label: string }> = [
  { value: "exact", label: "priceExact" },
  { value: "startsFrom", label: "priceStartsFrom" },
  { value: "hidden", label: "priceHidden" },
  { value: "consultation", label: "priceConsultation" },
];

const categoryLabels: Record<string, string> = {
  hair: "categoryHair",
  beauty: "categoryBeauty",
  consulting: "categoryConsulting",
};

const formRowClassName =
  "flex-col block pt-5 mt-5 xl:items-center sm:flex xl:flex-row first:mt-0 first:pt-0";
const labelClassName =
  "inline-block mb-2 sm:mb-0 sm:me-5 sm:text-end xl:w-60 xl:me-14";
const joinedInputClassName =
  "first:rounded-b-none first:md:rounded-es-md first:md:rounded-e-none [&:not(:first-child):not(:last-child)]:-mt-px [&:not(:first-child):not(:last-child)]:md:mt-0 [&:not(:first-child):not(:last-child)]:md:-ml-px [&:not(:first-child):not(:last-child)]:rounded-none last:rounded-t-none last:md:rounded-s-none last:md:rounded-se-md last:-mt-px last:md:mt-0 last:md:-ml-px focus:z-10";
const sectionCardClassName = "flex flex-col p-5 box box--stacked scroll-mt-28";
const sectionInnerClassName =
  "p-5 border rounded-[0.6rem] border-slate-200/60 dark:border-darkmode-400";
const sectionHeadingClassName =
  "flex items-center pb-5 text-[0.94rem] font-medium border-b border-slate-200/60 dark:border-darkmode-400";
const sectionNavItemClassName = [
  "relative px-5 py-[9.2px] group-[.mode--light]:text-white/90 [&.active]:text-primary [&.active]:font-medium [&.active]:before:bg-primary/70 [.group.mode--light_&.active]:text-white [.group.mode--light_&.active]:before:bg-white",
  "before:content-[''] before:absolute before:h-[60%] before:w-0.5 before:start-0 before:inset-y-0 before:my-auto before:-ml-px",
];

export default function CreateServicePage() {
  const { t } = useTranslation(servicesNamespace);
  const allCategories = useServiceStore((state) => state.categories);
  const categories = useMemo(
    () => allCategories.filter((category) => category.active),
    [allCategories],
  );
  const addService = useServiceStore((state) => state.addService);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<CategoryKey>("hair");
  const [duration, setDuration] = useState(45);
  const [priceMode, setPriceMode] = useState<ServicePriceMode>("exact");
  const [price, setPrice] = useState("");
  const [bufferBefore, setBufferBefore] = useState(0);
  const [bufferAfter, setBufferAfter] = useState(10);
  const [multiService, setMultiService] = useState(true);
  const [active, setActive] = useState(true);
  const [errors, setErrors] = useState<{
    name?: string;
    duration?: string;
    price?: string;
  }>({});
  const [saved, setSaved] = useState(false);
  const nameId = useId();
  const categoryId = useId();
  const durationId = useId();
  const priceId = useId();
  const bufferBeforeId = useId();
  const bufferAfterId = useId();
  const multiServiceId = useId();
  const activeId = useId();
  const selectedCategory =
    categories.find((item) => item.id === category)?.id ??
    categories[0]?.id ??
    category;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const needsPrice = priceMode === "exact" || priceMode === "startsFrom";
    const numericPrice = Number(price);
    const nextErrors = {
      name: name.trim() ? undefined : t("nameRequired"),
      duration:
        duration >= 5 && duration <= 720
          ? undefined
          : t("durationInvalid"),
      price:
        !needsPrice || numericPrice > 0 ? undefined : t("priceInvalid"),
    };
    setErrors(nextErrors);
    setSaved(false);
    if (nextErrors.name || nextErrors.duration || nextErrors.price) return;

    addService({
      customName: name.trim(),
      category: selectedCategory,
      durationMinutes: duration,
      priceMode,
      priceRials: needsPrice ? numericPrice : undefined,
      bufferBeforeMinutes: Math.max(0, bufferBefore),
      bufferAfterMinutes: Math.max(0, bufferAfter),
      active,
      multiServiceCompatible: multiService,
    });
    setSaved(true);
    setName("");
    setPrice("");
  };

  return (
    <div className="grid grid-cols-12 gap-y-10 gap-x-6">
      <div className="col-span-12">
        <div className="flex flex-col mt-4 md:mt-0 md:h-10 gap-y-3 md:items-center md:flex-row">
          <h1 className="text-base font-medium group-[.mode--light]:text-white">
            {t("createTitle")}
          </h1>
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
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="mt-3.5 grid grid-cols-12 xl:grid-cols-10 gap-y-7 lg:gap-y-10 gap-x-6"
        >
          <div className="relative flex flex-col col-span-12 lg:col-span-9 xl:col-span-8 gap-y-7">
            <section id="service-information" className={sectionCardClassName}>
              <div className={sectionInnerClassName}>
                <h2 className={sectionHeadingClassName}>
                  <Lucide
                    icon="ChevronDown"
                    className="w-5 h-5 stroke-[1.3] me-2"
                    aria-hidden="true"
                  />
                  {t("service")}
                </h2>
                <div className="mt-5">
                  <div className={formRowClassName}>
                    <label htmlFor={nameId} className={labelClassName}>
                      <div className="text-start">
                        <div className="flex items-center">
                          <div className="font-medium">{t("nameLabel")}</div>
                          <div className="ms-2.5 px-2 py-0.5 bg-slate-100 text-slate-500 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md border border-slate-200">
                            *
                          </div>
                        </div>
                        <div className="mt-1.5 xl:mt-3 text-xs leading-relaxed text-slate-500/80">
                          {t("namePlaceholder")}
                        </div>
                      </div>
                    </label>
                    <div className="flex-1 w-full mt-3 xl:mt-0">
                      <FormInput
                        id={nameId}
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder={t("namePlaceholder")}
                        required
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={
                          errors.name ? `${nameId}-error` : undefined
                        }
                      />
                      {errors.name && (
                        <div
                          id={`${nameId}-error`}
                          className="mt-2 text-sm text-danger"
                        >
                          {errors.name}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={formRowClassName}>
                    <label htmlFor={categoryId} className={labelClassName}>
                      <div className="text-start">
                        <div className="flex items-center">
                          <div className="font-medium">
                            {t("categoryLabel")}
                          </div>
                          <div className="ms-2.5 px-2 py-0.5 bg-slate-100 text-slate-500 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md border border-slate-200">
                            *
                          </div>
                        </div>
                      </div>
                    </label>
                    <div className="flex-1 w-full mt-3 xl:mt-0">
                      <FormSelect
                        id={categoryId}
                        value={selectedCategory}
                        onChange={(event) =>
                          setCategory(event.target.value as CategoryKey)
                        }
                        disabled={categories.length === 0}
                      >
                        {categories.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.customName ??
                              (categoryLabels[item.id]
                                ? t(categoryLabels[item.id])
                                : item.id)}
                          </option>
                        ))}
                      </FormSelect>
                    </div>
                  </div>

                  <div className={formRowClassName}>
                    <label htmlFor={durationId} className={labelClassName}>
                      <div className="text-start">
                        <div className="flex items-center">
                          <div className="font-medium">
                            {t("durationLabel")}
                          </div>
                          <div className="ms-2.5 px-2 py-0.5 bg-slate-100 text-slate-500 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md border border-slate-200">
                            *
                          </div>
                        </div>
                      </div>
                    </label>
                    <div className="flex-1 w-full mt-3 xl:mt-0">
                      <FormInput
                        id={durationId}
                        type="number"
                        min={5}
                        max={720}
                        step={5}
                        dir="ltr"
                        inputMode="numeric"
                        value={duration}
                        onChange={(event) =>
                          setDuration(Number(event.target.value))
                        }
                        required
                        aria-invalid={Boolean(errors.duration)}
                        aria-describedby={
                          errors.duration ? `${durationId}-error` : undefined
                        }
                        className="text-start"
                      />
                      {errors.duration && (
                        <div
                          id={`${durationId}-error`}
                          className="mt-2 text-sm text-danger"
                        >
                          {errors.duration}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="service-pricing" className={sectionCardClassName}>
              <div className={sectionInnerClassName}>
                <h2 className={sectionHeadingClassName}>
                  <Lucide
                    icon="ChevronDown"
                    className="w-5 h-5 stroke-[1.3] me-2"
                    aria-hidden="true"
                  />
                  {t("price")}
                </h2>
                <div className="mt-5">
                  <fieldset className={formRowClassName}>
                    <legend className={labelClassName}>
                      <div className="text-start">
                        <div className="font-medium">
                          {t("priceModeLegend")}
                        </div>
                      </div>
                    </legend>
                    <div className="flex-1 w-full mt-3 xl:mt-0">
                      <div className="flex flex-col items-center md:flex-row">
                        {priceModes.map((mode) => {
                          const id = `service-price-mode-${mode.value}`;
                          return (
                            <div
                              key={mode.value}
                              className={clsx(
                                "bg-white dark:bg-darkmode-600 w-full px-3 py-2 border rounded-md shadow-sm border-slate-300/60 dark:border-darkmode-400",
                                joinedInputClassName,
                              )}
                            >
                              <FormCheck>
                                <FormCheck.Input
                                  id={id}
                                  type="radio"
                                  name="service-price-mode"
                                  value={mode.value}
                                  checked={priceMode === mode.value}
                                  onChange={() => setPriceMode(mode.value)}
                                />
                                <FormCheck.Label
                                  htmlFor={id}
                                  className="whitespace-nowrap"
                                >
                                  {t(mode.label)}
                                </FormCheck.Label>
                              </FormCheck>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </fieldset>

                  {(priceMode === "exact" ||
                    priceMode === "startsFrom") && (
                    <div className={formRowClassName}>
                      <label htmlFor={priceId} className={labelClassName}>
                        <div className="text-start">
                          <div className="flex items-center">
                            <div className="font-medium">
                              {t("priceAmountLabel")}
                            </div>
                            <div className="ms-2.5 px-2 py-0.5 bg-slate-100 text-slate-500 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md border border-slate-200">
                              *
                            </div>
                          </div>
                        </div>
                      </label>
                      <div className="flex-1 w-full mt-3 xl:mt-0">
                        <FormInput
                          id={priceId}
                          type="number"
                          min={1}
                          step={10000}
                          dir="ltr"
                          inputMode="numeric"
                          value={price}
                          onChange={(event) => setPrice(event.target.value)}
                          required
                          aria-invalid={Boolean(errors.price)}
                          aria-describedby={
                            errors.price ? `${priceId}-error` : undefined
                          }
                          className="text-start"
                        />
                        {errors.price && (
                          <div
                            id={`${priceId}-error`}
                            className="mt-2 text-sm text-danger"
                          >
                            {errors.price}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className={formRowClassName}>
                    <div className={labelClassName}>
                      <div className="text-start">
                        <div className="font-medium">{t("buffers")}</div>
                      </div>
                    </div>
                    <div className="flex-1 w-full mt-3 xl:mt-0">
                      <div className="grid gap-3 md:grid-cols-2">
                        <label htmlFor={bufferBeforeId}>
                          <span className="mb-2 block text-xs text-slate-500">
                            {t("bufferBeforeLabel")}
                          </span>
                          <FormInput
                            id={bufferBeforeId}
                            type="number"
                            min={0}
                            max={240}
                            step={5}
                            dir="ltr"
                            inputMode="numeric"
                            value={bufferBefore}
                            onChange={(event) =>
                              setBufferBefore(Number(event.target.value))
                            }
                            className="text-start"
                          />
                        </label>
                        <label htmlFor={bufferAfterId}>
                          <span className="mb-2 block text-xs text-slate-500">
                            {t("bufferAfterLabel")}
                          </span>
                          <FormInput
                            id={bufferAfterId}
                            type="number"
                            min={0}
                            max={240}
                            step={5}
                            dir="ltr"
                            inputMode="numeric"
                            value={bufferAfter}
                            onChange={(event) =>
                              setBufferAfter(Number(event.target.value))
                            }
                            className="text-start"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="service-booking" className={sectionCardClassName}>
              <div className={sectionInnerClassName}>
                <h2 className={sectionHeadingClassName}>
                  <Lucide
                    icon="ChevronDown"
                    className="w-5 h-5 stroke-[1.3] me-2"
                    aria-hidden="true"
                  />
                  {t("compatibility")}
                </h2>
                <div className="mt-5">
                  <div className={formRowClassName}>
                    <div className={labelClassName}>
                      <div className="text-start">
                        <div className="font-medium">
                          {t("multiServiceLabel")}
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 w-full mt-3 xl:mt-0">
                      <FormSwitch>
                        <FormSwitch.Input
                          id={multiServiceId}
                          type="checkbox"
                          role="switch"
                          checked={multiService}
                          onChange={(event) =>
                            setMultiService(event.target.checked)
                          }
                          aria-label={t("multiServiceLabel")}
                        />
                        <FormSwitch.Label htmlFor={multiServiceId}>
                          {t(multiService ? "compatible" : "singleOnly")}
                        </FormSwitch.Label>
                      </FormSwitch>
                    </div>
                  </div>

                  <div className={formRowClassName}>
                    <div className={labelClassName}>
                      <div className="text-start">
                        <div className="font-medium">{t("activeLabel")}</div>
                      </div>
                    </div>
                    <div className="flex-1 w-full mt-3 xl:mt-0">
                      <FormSwitch>
                        <FormSwitch.Input
                          id={activeId}
                          type="checkbox"
                          role="switch"
                          checked={active}
                          onChange={(event) => setActive(event.target.checked)}
                          aria-label={t("activeLabel")}
                        />
                        <FormSwitch.Label htmlFor={activeId}>
                          {t(active ? "active" : "inactive")}
                        </FormSwitch.Label>
                      </FormSwitch>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div aria-live="polite">
              {saved && (
                <div className="rounded-md bg-success/10 px-4 py-3 text-success">
                  {t("serviceSaved")}
                </div>
              )}
            </div>

            <div className="flex flex-col justify-end gap-3 mt-1 md:flex-row">
              <Button
                as={Link}
                to="/product-list"
                variant="outline-secondary"
                className="w-full border-slate-300/80 bg-white/80 dark:bg-darkmode-600 md:w-56 py-2.5 rounded-[0.5rem]"
              >
                <Lucide
                  icon="ArrowLeft"
                  className="stroke-[1.3] w-4 h-4 me-2"
                  aria-hidden="true"
                />
                {t("backToServices")}
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="w-full md:w-56 py-2.5 rounded-[0.5rem]"
                disabled={categories.length === 0}
              >
                <Lucide
                  icon="PenLine"
                  className="stroke-[1.3] w-4 h-4 me-2"
                  aria-hidden="true"
                />
                {t("saveService")}
              </Button>
            </div>
          </div>

          <aside className="relative order-first col-span-12 lg:order-last lg:col-span-3 xl:col-span-2">
            <div className="sticky top-[104px]">
              <nav aria-label={t("createTitle")}>
                <ul className="relative flex flex-col py-2.5 rounded-[0.6rem] bg-primary/[0.03] group-[.mode--light]:bg-slate-300/10 border border-primary/10 group-[.mode--light]:border-slate-300/20 text-slate-600/80">
                  <li
                    className={clsx(
                      sectionNavItemClassName,
                      "active ps-5",
                    )}
                  >
                    <a
                      className="block -mt-px truncate"
                      href="#service-information"
                    >
                      {t("service")}
                    </a>
                  </li>
                  <li className={clsx(sectionNavItemClassName)}>
                    <a
                      className="block -mt-px truncate"
                      href="#service-pricing"
                    >
                      {t("price")}
                    </a>
                  </li>
                  <li className={clsx(sectionNavItemClassName)}>
                    <a
                      className="block -mt-px truncate"
                      href="#service-booking"
                    >
                      {t("compatibility")}
                    </a>
                  </li>
                </ul>
              </nav>

              <div className="relative p-5 mt-7 border rounded-[0.6rem] bg-warning/[0.07] dark:bg-darkmode-600 border-warning/[0.15] dark:border-0">
                <Lucide
                  icon="Lightbulb"
                  className="absolute top-0 end-0 w-12 h-12 mt-5 me-3 text-warning/80"
                  aria-hidden="true"
                />
                <h2 className="text-lg font-medium">{t("createTitle")}</h2>
                <div className="mt-5 font-medium">{t("status")}</div>
                <p className="mt-2 text-xs leading-relaxed text-slate-600/90 dark:text-slate-500">
                  {t("createSubtitle")}
                </p>
              </div>
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
}
