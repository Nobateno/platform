import { useRef, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import {
  createStaffAccount,
  CreateStaffAccountError,
} from "@/domains/team/application/create-staff-account";
import { teamNamespace } from "@/domains/team/i18n";
import { normalizePhoneNumber } from "@/shared/lib/phone";
import { validateValue, validators } from "@/shared/lib/validation";
import Button from "@/shared/ui/components/Base/Button";
import {
  FormCheck,
  FormSelect,
} from "@/shared/ui/components/Base/Form";
import FormField from "@/shared/ui/components/FormField";
import PasswordSetupFields from "@/shared/ui/components/PasswordSetupFields";
import PhoneNumberField from "@/shared/ui/components/PhoneNumberField";

type ServiceId = "serviceCut" | "serviceColor" | "serviceConsultation";
type AccessState = "activeAccess" | "invitationPending" | "profileOnly";

interface StaffProfile {
  id: string;
  name?: string;
  nameKey?: "ownerProfile" | "leadProfile" | "assistantProfile";
  phone?: string;
  roleKey: "ownerRole" | "staffRole";
  scheduleKey: "fullWeek" | "weekdays" | "flexible";
  services: ServiceId[];
  access: AccessState | "ownerAccess";
}

const services: ServiceId[] = [
  "serviceCut",
  "serviceColor",
  "serviceConsultation",
];
const staffPhoneRegion = "IR" as const;

const initialProfiles: StaffProfile[] = [
  {
    id: "owner",
    nameKey: "ownerProfile",
    roleKey: "ownerRole",
    scheduleKey: "fullWeek",
    services: ["serviceCut", "serviceConsultation"],
    access: "ownerAccess",
  },
  {
    id: "lead",
    nameKey: "leadProfile",
    roleKey: "staffRole",
    scheduleKey: "weekdays",
    services: ["serviceCut", "serviceColor"],
    access: "activeAccess",
  },
  {
    id: "associate",
    nameKey: "assistantProfile",
    roleKey: "staffRole",
    scheduleKey: "flexible",
    services: ["serviceConsultation"],
    access: "profileOnly",
  },
];

function TeamPage() {
  const { t } = useTranslation(teamNamespace);
  const [profiles, setProfiles] = useState(initialProfiles);
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [createState, setCreateState] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle");
  const [createMessage, setCreateMessage] = useState("");
  const [errors, setErrors] = useState<
    Partial<Record<"fullName" | "phone" | "password" | "confirmPassword", string>>
  >({});
  const fullNameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const passwordMessages = {
    showLabel: t("showPassword"),
    hideLabel: t("hidePassword"),
    capsLockLabel: t("capsLockOn"),
    strengthLabel: t("passwordStrength"),
    strengthLabels: {
      veryWeak: t("strengthVeryWeak"),
      weak: t("strengthWeak"),
      good: t("strengthGood"),
      strong: t("strengthStrong"),
    },
  };

  const clearStaffError = (field: keyof typeof errors) => {
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const updateServices = (profileId: string, service: ServiceId) => {
    setProfiles((current) =>
      current.map((profile) => {
        if (profile.id !== profileId) return profile;
        const hasService = profile.services.includes(service);
        return {
          ...profile,
          services: hasService
            ? profile.services.filter((item) => item !== service)
            : [...profile.services, service],
        };
      }),
    );
    setDirty(true);
    setSaved(false);
  };

  const updateAccess = (profileId: string, access: AccessState) => {
    setProfiles((current) =>
      current.map((profile) =>
        profile.id === profileId ? { ...profile, access } : profile,
      ),
    );
    setDirty(true);
    setSaved(false);
  };

  const saveChanges = () => {
    setDirty(false);
    setSaved(true);
  };

  const submitStaff = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (createState === "pending") return;

    const normalizedPhone = normalizePhoneNumber(phone, staffPhoneRegion);
    const nextErrors: typeof errors = {};
    if (validateValue(fullName, [validators.required()])) {
      nextErrors.fullName = t("nameRequired");
    }
    if (validateValue(normalizedPhone, [validators.phone(staffPhoneRegion)])) {
      nextErrors.phone = t("phoneInvalid");
    }
    if (validateValue(password, [validators.password()])) {
      nextErrors.password = t("passwordWeak");
    }
    if (validateValue(confirmPassword, [validators.matches(password)])) {
      nextErrors.confirmPassword = t("passwordMismatch");
    }
    if (
      profiles.some(
        (profile) =>
          profile.phone &&
          normalizePhoneNumber(profile.phone, staffPhoneRegion) ===
            normalizedPhone,
      )
    ) {
      nextErrors.phone = t("phoneInUse");
    }

    setErrors(nextErrors);
    setCreateMessage("");
    setCreateState("idle");

    const firstInvalidRef = nextErrors.fullName
      ? fullNameRef
      : nextErrors.phone
        ? phoneRef
        : nextErrors.password
          ? passwordRef
          : nextErrors.confirmPassword
            ? confirmPasswordRef
            : null;
    if (firstInvalidRef) {
      firstInvalidRef.current?.focus();
      return;
    }

    setCreateState("pending");
    try {
      const createdStaff = await createStaffAccount({
        fullName: fullName.trim(),
        phone: normalizedPhone,
        password,
      });
      setProfiles((current) => [
        ...current,
        {
          id: createdStaff.id,
          name: createdStaff.fullName,
          phone: createdStaff.phone,
          roleKey: "staffRole",
          scheduleKey: "flexible",
          services: [],
          access: "activeAccess",
        },
      ]);
      setFullName("");
      setPhone("");
      setPassword("");
      setConfirmPassword("");
      setCreateState("success");
      setCreateMessage(t("staffCreated", { name: createdStaff.fullName }));
    } catch (error) {
      setCreateState("error");
      setCreateMessage(
        error instanceof CreateStaffAccountError && error.code === "phone-in-use"
          ? t("phoneInUse")
          : t("createFailed"),
      );
    }
  };

  return (
    <section
      className="grid grid-cols-12 gap-x-6 gap-y-10"
      aria-labelledby="team-title"
    >
      <div className="col-span-12">
        <div className="flex flex-col gap-y-3 md:h-10 md:flex-row md:items-center">
          <h1
            id="team-title"
            className="text-base font-medium group-[.mode--light]:text-white"
          >
            {t("title")}
          </h1>
        </div>

        <div className="mt-3.5 flex flex-col gap-7">
      <aside className="box box--stacked p-5">
        <div className="border-b border-dashed border-slate-300/70 pb-5 font-medium">
          {t("eyebrow")}
        </div>
        <p className="mt-5 max-w-3xl text-sm leading-relaxed text-slate-500">
          {t("description")}
        </p>
        <div className="mt-4 rounded-[0.6rem] border border-primary/20 bg-primary/5 p-4">
          <h2 className="font-medium">{t("distinctionTitle")}</h2>
          <p className="mt-1 text-sm leading-relaxed text-slate-500">{t("distinctionBody")}</p>
        </div>
      </aside>

      <section className="box box--stacked p-5" aria-labelledby="add-staff-title">
        <div className="border-b border-dashed border-slate-300/70 pb-5">
          <h2 id="add-staff-title" className="font-medium">
            {t("addStaffTitle")}
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-slate-500">
            {t("addStaffDescription")}
          </p>
        </div>

        <form
          className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2"
          onSubmit={(event) => void submitStaff(event)}
          noValidate
        >
          <FormField
            ref={fullNameRef}
            id="staff-full-name"
            label={t("fullName")}
            type="text"
            autoComplete="name"
            value={fullName}
            onChange={(event) => {
              setFullName(event.target.value);
              clearStaffError("fullName");
            }}
            required
            error={errors.fullName}
          />

          <PhoneNumberField
            ref={phoneRef}
            id="staff-phone"
            label={t("phoneNumber")}
            region={staffPhoneRegion}
            regionLabel={t("phoneRegionLabel")}
            regionName={t("iranRegionName")}
            regionSelectorDisabled
            autoComplete="tel"
            value={phone}
            onValueChange={(value) => {
              setPhone(value);
              clearStaffError("phone");
            }}
            placeholder={t("phonePlaceholder")}
            hint={t("phoneHint")}
            required
            error={errors.phone}
          />

          <PasswordSetupFields
            passwordRef={passwordRef}
            confirmPasswordRef={confirmPasswordRef}
            passwordId="staff-password"
            confirmPasswordId="staff-confirm-password"
            passwordLabel={t("initialPassword")}
            confirmPasswordLabel={t("confirmPassword")}
            passwordValue={password}
            confirmPasswordValue={confirmPassword}
            onPasswordChange={(event) => {
              setPassword(event.target.value);
              clearStaffError("password");
            }}
            onConfirmPasswordChange={(event) => {
              setConfirmPassword(event.target.value);
              clearStaffError("confirmPassword");
            }}
            messages={passwordMessages}
            passwordHint={t("passwordHelp")}
            passwordError={errors.password}
            confirmPasswordError={errors.confirmPassword}
            passwordName="staffPassword"
            confirmPasswordName="staffConfirmPassword"
            confirmPasswordContainerClassName=""
          />

          <div className="flex flex-col gap-3 border-t border-dashed border-slate-300/70 pt-5 md:col-span-2 md:flex-row md:items-center md:justify-end">
            <p
              role={createState === "error" ? "alert" : undefined}
              aria-live="polite"
              className={`min-h-5 text-sm md:me-auto ${
                createState === "error"
                  ? "text-danger"
                  : createState === "success"
                    ? "text-success"
                    : "text-slate-500"
              }`}
            >
              {createMessage}
            </p>
            <Button type="submit" variant="primary" disabled={createState === "pending"}>
              {createState === "pending" ? t("creatingStaff") : t("createStaff")}
            </Button>
          </div>
        </form>
      </section>

      <section className="box box--stacked flex flex-col" aria-labelledby="staff-roster-title">
        <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
          <h2 id="staff-roster-title" className="font-medium">
            {t("roster")}
          </h2>
          <div className="min-h-6 text-xs text-slate-500" aria-live="polite">
            {saved ? t("saved") : dirty ? t("unsaved") : null}
          </div>
        </div>

        <div
          className="overflow-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary xl:overflow-visible"
          role="region"
          aria-label={t("roster")}
          tabIndex={0}
        >
          <table className="w-full min-w-[760px] text-start">
            <caption className="sr-only">{t("roster")}</caption>
            <thead>
              <tr>
                {["profile", "services", "schedule", "access"].map((key) => (
                  <th key={key} scope="col" className="border-b border-t border-slate-200/60 bg-slate-50 px-5 py-4 text-start font-medium text-slate-500 dark:border-darkmode-400 dark:bg-darkmode-400">
                    {t(key)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {profiles.map((profile) => {
                const translatedName = profile.name ?? t(profile.nameKey ?? "staffRole");
                return (
                  <tr key={profile.id} className="border-b border-dashed border-slate-200/60 align-top dark:border-darkmode-400">
                    <th scope="row" className="px-5 py-4 text-start font-normal">
                      <span className="block font-medium">{translatedName}</span>
                      <span className="mt-1 block text-xs text-slate-500">
                        {t(profile.roleKey)}
                      </span>
                      {profile.phone && (
                        <span className="mt-1 block text-xs text-slate-500" dir="ltr">
                          {profile.phone}
                        </span>
                      )}
                    </th>
                    <td className="px-5 py-2">
                      <fieldset>
                        <legend className="sr-only">
                          {t("serviceLabel", { name: translatedName })}
                        </legend>
                        <div className="flex flex-wrap gap-x-4 gap-y-1">
                          {services.map((service) => {
                            const id = `${profile.id}-${service}`;
                            return (
                              <FormCheck key={service} className="min-h-10">
                                <FormCheck.Input
                                  id={id}
                                  type="checkbox"
                                  checked={profile.services.includes(service)}
                                  onChange={() => updateServices(profile.id, service)}
                                />
                                <FormCheck.Label htmlFor={id} className="inline-flex min-h-10 items-center text-sm">
                                  {t(service)}
                                </FormCheck.Label>
                              </FormCheck>
                            );
                          })}
                        </div>
                      </fieldset>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-500">
                      {t(profile.scheduleKey)}
                    </td>
                    <td className="px-5 py-3">
                      {profile.access === "ownerAccess" ? (
                        <span className="inline-flex min-h-9 items-center rounded-full border border-primary/20 bg-primary/10 px-4 text-xs font-medium text-primary">
                          {t("ownerAccess")}
                        </span>
                      ) : (
                        <FormSelect
                          className="min-w-48"
                          value={profile.access}
                          aria-label={t("accessLabel", { name: translatedName })}
                          onChange={(event) => updateAccess(profile.id, event.target.value as AccessState)}
                        >
                          <option value="activeAccess">{t("activeAccess")}</option>
                          <option value="invitationPending">{t("invitationPending")}</option>
                          <option value="profileOnly">{t("profileOnly")}</option>
                        </FormSelect>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end border-t border-slate-200/60 p-5 dark:border-darkmode-400">
          <Button
            type="button"
            variant="primary"
            disabled={!dirty}
            onClick={saveChanges}
          >
            {t("save")}
          </Button>
        </div>
      </section>
        </div>
      </div>
    </section>
  );
}

export default TeamPage;
