import { useId, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import clsx from "clsx";
import {
  useCustomerStore,
  type CustomerTag,
} from "@/domains/customers/application/customer-store";
import { customersNamespace } from "@/domains/customers/i18n";
import Button from "@/shared/ui/components/Base/Button";
import {
  FormCheck,
  FormInput,
  FormTextarea,
} from "@/shared/ui/components/Base/Form";
import Lucide from "@/shared/ui/components/Base/Lucide";

const tagOptions: Array<{ value: CustomerTag; label: string }> = [
  { value: "regular", label: "tagRegular" },
  { value: "priority", label: "tagPriority" },
  { value: "accessibility", label: "tagAccessibility" },
];

const stepClassName = [
  "flex items-center lg:justify-center flex-1 lg:first:justify-start lg:last:justify-end group",
  "after:hidden before:hidden after:lg:block before:lg:block",
  "first:after:content-[''] first:after:w-full first:after:bg-slate-300/60 first:after:h-[2px] first:after:ms-5 group-[.mode--light]:first:after:bg-slate-300/20",
  "last:before:content-[''] last:before:w-full last:before:bg-slate-300/60 last:before:h-[2px] last:before:me-5 group-[.mode--light]:last:before:bg-slate-300/20",
  "last:after:hidden after:content-[''] after:w-full after:bg-slate-300/60 after:h-[2px] after:ms-5 group-[.mode--light]:after:bg-slate-300/20",
  "first:before:hidden before:content-[''] before:w-full before:bg-slate-300/60 before:h-[2px] before:me-5 group-[.mode--light]:before:bg-slate-300/20",
];

const joinedInputClassName =
  "first:rounded-b-none first:md:rounded-es-md first:md:rounded-e-none [&:not(:first-child):not(:last-child)]:-mt-px [&:not(:first-child):not(:last-child)]:md:mt-0 [&:not(:first-child):not(:last-child)]:md:-ml-px [&:not(:first-child):not(:last-child)]:rounded-none last:rounded-t-none last:md:rounded-s-none last:md:rounded-se-md last:-mt-px last:md:mt-0 last:md:-ml-px focus:z-10";

const formRowClassName =
  "flex-col block pt-5 mt-5 xl:items-center sm:flex xl:flex-row first:mt-0 first:pt-0";
const labelClassName =
  "inline-block mb-2 sm:mb-0 sm:me-5 sm:text-end xl:w-60 xl:me-14";

export default function CreateCustomerPage() {
  const { t } = useTranslation(customersNamespace);
  const addCustomer = useCustomerStore((state) => state.addCustomer);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [specialRequirements, setSpecialRequirements] = useState("");
  const [tags, setTags] = useState<CustomerTag[]>([]);
  const [blocked, setBlocked] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [saved, setSaved] = useState(false);
  const nameId = useId();
  const phoneId = useId();
  const descriptionId = useId();
  const specialId = useId();
  const blockedId = useId();
  const steps = [t("createTitle"), t("tagsLegend"), t("specialLabel")];

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const digits = phone.replace(/\D/g, "");
    const nextErrors = {
      name: name.trim() ? undefined : t("requiredName"),
      phone:
        digits.length >= 10 && digits.length <= 15
          ? undefined
          : t("invalidPhone"),
    };
    setErrors(nextErrors);
    setSaved(false);
    if (nextErrors.name || nextErrors.phone) return;

    addCustomer({
      displayName: name.trim(),
      maskedPhone: `${phone.slice(0, 3)} \u2022\u2022\u2022 \u2022\u2022\u2022 ${digits.slice(-4)}`,
      description: description.trim(),
      tags,
      blocked,
      lastReservationAt: undefined,
      specialRequirements: specialRequirements.trim() || undefined,
    });
    setSaved(true);
    setName("");
    setPhone("");
    setDescription("");
    setSpecialRequirements("");
    setTags([]);
    setBlocked(false);
  };

  return (
    <div className="grid grid-cols-12 gap-y-10 gap-x-6">
      <div className="col-span-12 sm:col-span-10 sm:col-start-2">
        <div className="flex flex-col lg:items-center lg:flex-row gap-y-2">
          {steps.map((step, index) => (
            <div
              key={step}
              className={clsx(stepClassName, index === 0 && "active")}
            >
              <div className="flex items-center">
                <div className="bg-white border rounded-full group-[.mode--light]:!bg-transparent group-[.active]:bg-primary group-[.active]:text-white group-[.mode--light]:!text-slate-200 group-[.mode--light]:!border-white/[0.25] [.group.mode--light_.group.active_&]:!bg-white/[0.12] [.group.mode--light_.group.active_&]:!border-white/[0.15]">
                  <div className="flex items-center justify-center w-10 h-10">
                    {index + 1}
                  </div>
                </div>
                {index === 0 ? (
                  <h1 className="ms-3.5 group-[.mode--light]:!text-slate-300 font-medium whitespace-nowrap text-slate-500 group-[.active]:text-current [.group.mode--light_.group.active_&]:!text-slate-100">
                    {step}
                  </h1>
                ) : (
                  <div className="ms-3.5 group-[.mode--light]:!text-slate-300 font-medium whitespace-nowrap text-slate-500 group-[.active]:text-current [.group.mode--light_.group.active_&]:!text-slate-100">
                    {step}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} noValidate className="mt-7">
          <div className="flex flex-col box box--stacked">
            <div className="p-7">
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
                    aria-describedby={errors.name ? `${nameId}-error` : undefined}
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
                <label htmlFor={phoneId} className={labelClassName}>
                  <div className="text-start">
                    <div className="flex items-center">
                      <div className="font-medium">{t("phoneLabel")}</div>
                      <div className="ms-2.5 px-2 py-0.5 bg-slate-100 text-slate-500 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md border border-slate-200">
                        *
                      </div>
                    </div>
                    <div className="mt-1.5 xl:mt-3 text-xs leading-relaxed text-slate-500/80">
                      {t("phonePlaceholder")}
                    </div>
                  </div>
                </label>
                <div className="flex-1 w-full mt-3 xl:mt-0">
                  <FormInput
                    id={phoneId}
                    type="tel"
                    dir="ltr"
                    inputMode="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder={t("phonePlaceholder")}
                    required
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={errors.phone ? `${phoneId}-error` : undefined}
                    className="text-start"
                  />
                  {errors.phone && (
                    <div
                      id={`${phoneId}-error`}
                      className="mt-2 text-sm text-danger"
                    >
                      {errors.phone}
                    </div>
                  )}
                </div>
              </div>

              <div className={formRowClassName}>
                <label htmlFor={descriptionId} className={labelClassName}>
                  <div className="text-start">
                    <div className="font-medium">{t("descriptionLabel")}</div>
                    <div className="mt-1.5 xl:mt-3 text-xs leading-relaxed text-slate-500/80">
                      {t("descriptionPlaceholder")}
                    </div>
                  </div>
                </label>
                <div className="flex-1 w-full mt-3 xl:mt-0">
                  <FormTextarea
                    id={descriptionId}
                    rows={3}
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder={t("descriptionPlaceholder")}
                  />
                </div>
              </div>

              <fieldset className={formRowClassName}>
                <legend className={labelClassName}>
                  <div className="text-start">
                    <div className="font-medium">{t("tagsLegend")}</div>
                  </div>
                </legend>
                <div className="flex-1 w-full mt-3 xl:mt-0">
                  <div className="flex flex-col items-center md:flex-row">
                    {tagOptions.map((option) => {
                      const id = `customer-tag-${option.value}`;
                      return (
                        <div
                          key={option.value}
                          className={clsx(
                            "bg-white dark:bg-darkmode-600 w-full px-3 py-2 border rounded-md shadow-sm border-slate-300/60 dark:border-darkmode-400",
                            joinedInputClassName,
                          )}
                        >
                          <FormCheck>
                            <FormCheck.Input
                              id={id}
                              type="checkbox"
                              checked={tags.includes(option.value)}
                              onChange={(event) =>
                                setTags((current) =>
                                  event.target.checked
                                    ? [...current, option.value]
                                    : current.filter(
                                        (tag) => tag !== option.value,
                                      ),
                                )
                              }
                            />
                            <FormCheck.Label htmlFor={id}>
                              {t(option.label)}
                            </FormCheck.Label>
                          </FormCheck>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </fieldset>

              <div className={formRowClassName}>
                <label htmlFor={specialId} className={labelClassName}>
                  <div className="text-start">
                    <div className="font-medium">{t("specialLabel")}</div>
                    <div className="mt-1.5 xl:mt-3 text-xs leading-relaxed text-slate-500/80">
                      {t("specialPlaceholder")}
                    </div>
                  </div>
                </label>
                <div className="flex-1 w-full mt-3 xl:mt-0">
                  <FormTextarea
                    id={specialId}
                    rows={3}
                    value={specialRequirements}
                    onChange={(event) =>
                      setSpecialRequirements(event.target.value)
                    }
                    placeholder={t("specialPlaceholder")}
                  />
                </div>
              </div>

              <div className={formRowClassName}>
                <div className={labelClassName}>
                  <div className="text-start">
                    <div className="font-medium">{t("blockLabel")}</div>
                  </div>
                </div>
                <div className="flex-1 w-full mt-3 xl:mt-0">
                  <FormCheck>
                    <FormCheck.Input
                      id={blockedId}
                      type="checkbox"
                      checked={blocked}
                      onChange={(event) => setBlocked(event.target.checked)}
                      aria-label={t("blockLabel")}
                    />
                    <FormCheck.Label htmlFor={blockedId}>
                      {t(blocked ? "blocked" : "active")}
                    </FormCheck.Label>
                  </FormCheck>
                </div>
              </div>

              <div aria-live="polite">
                {saved && (
                  <div className="mt-5 rounded-md bg-success/10 px-4 py-3 text-success">
                    {t("created")}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2 py-5 border-t md:flex-row md:justify-end px-7 border-slate-200/80 dark:border-darkmode-400">
              <Button
                as={Link}
                to="/users"
                variant="outline-secondary"
                className="w-full px-10 md:w-auto"
              >
                <Lucide
                  icon="ArrowLeft"
                  className="stroke-[1.3] w-4 h-4 me-2 -ms-2"
                  aria-hidden="true"
                />
                {t("backToList")}
              </Button>
              <Button
                type="submit"
                variant="outline-primary"
                className="w-full px-10 md:w-auto border-primary/50"
              >
                <Lucide
                  icon="Pocket"
                  className="stroke-[1.3] w-4 h-4 me-2 -ms-2"
                  aria-hidden="true"
                />
                {t("create")}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
