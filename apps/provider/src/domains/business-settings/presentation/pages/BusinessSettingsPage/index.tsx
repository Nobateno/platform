import { useId, useState, type FormEvent } from "react";
import clsx from "clsx";
import { flushSync } from "react-dom";
import { useTranslation } from "react-i18next";
import { businessSettingsNamespace } from "@/domains/business-settings/i18n";
import { languageOptions, type AppLanguage } from "@/shared/i18n";
import { Link, useLocation } from "@/shared/lib/navigation";
import { useUiStore } from "@/app/state/store";
import Button from "@/shared/ui/components/Base/Button";
import {
  FormCheck,
  FormInput,
  FormSelect,
  FormSwitch,
} from "@/shared/ui/components/Base/Form";
import Lucide from "@/shared/ui/components/Base/Lucide";
import Table from "@/shared/ui/components/Base/Table";
import LanguageSwitcher from "@/shared/ui/components/LanguageSwitcher";
import { startThemeViewTransition } from "@/shared/ui/theme-transition";

type BookingMode = "approval" | "instant";
type RequestState = "idle" | "pending" | "success" | "error";

const settingsSections = [
  { key: "policy", to: "/settings", label: "policyTitle", icon: "AppWindow" },
  { key: "locale", to: "/settings?page=locale", label: "localeTitle", icon: "Globe" },
  { key: "access", to: "/settings?page=access", label: "accessTitle", icon: "ShieldCheck" },
  { key: "security", to: "/settings?page=security", label: "securityTitle", icon: "KeyRound" },
  { key: "delete", to: "/settings?page=delete", label: "dangerTitle", icon: "Trash2" },
] as const;

type SettingsSection = (typeof settingsSections)[number]["key"];

const fieldRowClassName =
  "flex-col block pt-5 mt-5 xl:items-center sm:flex xl:flex-row first:mt-0 first:pt-0";
const fieldLabelClassName =
  "inline-block mb-2 sm:mb-0 sm:me-5 sm:text-end xl:w-60 xl:me-14";

export default function BusinessSettingsPage() {
  const { t } = useTranslation(businessSettingsNamespace);
  const { t: shellT } = useTranslation();
  const { search } = useLocation();
  const darkMode = useUiStore((state) => state.darkMode.value);
  const setDarkMode = useUiStore((state) => state.setDarkMode);
  const requestedPage = new URLSearchParams(search).get("page");
  const activePage: SettingsSection = settingsSections.some(
    (section) => section.key === requestedPage,
  )
    ? (requestedPage as SettingsSection)
    : "policy";
  const [bookingMode, setBookingMode] = useState<BookingMode>("approval");
  const [cancellationHours, setCancellationHours] = useState(24);
  const [businessLanguage, setBusinessLanguage] = useState<AppLanguage>("fa");
  const [policyMessage, setPolicyMessage] = useState("");
  const [localeMessage, setLocaleMessage] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordState, setPasswordState] = useState<RequestState>("idle");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [acknowledged, setAcknowledged] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [deletionState, setDeletionState] = useState<RequestState>("idle");
  const [deletionMessage, setDeletionMessage] = useState("");
  const bookingModeId = useId();
  const cancellationId = useId();
  const languageId = useId();
  const themeId = useId();
  const timezoneId = useId();
  const currentPasswordId = useId();
  const newPasswordId = useId();
  const confirmPasswordId = useId();
  const acknowledgementId = useId();
  const deletionId = useId();

  const savePolicy = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPolicyMessage(t("policySaved"));
  };

  const saveLocale = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLocaleMessage(t("localeSaved"));
  };

  const toggleDarkMode = () => {
    startThemeViewTransition(() => {
      flushSync(() =>
        setDarkMode(!useUiStore.getState().darkMode.value),
      );
    });
  };

  const changePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPasswordMessage("");
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMessage(t("passwordRequired"));
      setPasswordState("error");
      return;
    }
    if (newPassword.length < 12) {
      setPasswordMessage(t("passwordLength"));
      setPasswordState("error");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage(t("passwordMismatch"));
      setPasswordState("error");
      return;
    }

    setPasswordState("pending");
    try {
      if (!import.meta.env.DEV) {
        const response = await fetch("/api/provider/security/password", {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ currentPassword, newPassword }),
        });
        if (!response.ok) throw new Error("password-change-failed");
      }
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordState("success");
      setPasswordMessage(t("passwordChanged"));
    } catch {
      setPasswordState("error");
      setPasswordMessage(t("passwordFailed"));
    }
  };

  const requestDeletion = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!acknowledged || confirmation !== "DELETE") return;
    setDeletionState("pending");
    setDeletionMessage("");
    try {
      if (import.meta.env.DEV) {
        setDeletionState("success");
        setDeletionMessage(t("deletionPreview"));
        return;
      }
      const response = await fetch("/api/provider/business", {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ confirmation }),
      });
      if (!response.ok) throw new Error("deletion-failed");
      setDeletionState("success");
    } catch {
      setDeletionState("error");
      setDeletionMessage(t("deletionFailed"));
    }
  };

  return (
    <div className="grid grid-cols-12 gap-y-10 gap-x-6 overflow-x-clip">
      <div className="col-span-12">
        <div className="flex flex-col md:h-10 gap-y-3 md:items-center md:flex-row">
          <h1 className="text-base font-medium group-[.mode--light]:text-white">
            {t("title")}
          </h1>
        </div>

        <div className="mt-3.5 grid grid-cols-12 gap-y-10 gap-x-6">
          <aside className="relative col-span-12 xl:col-span-3" aria-label={t("title")}>
            <div className="sticky top-[104px]">
              <nav className="flex flex-col px-5 pt-5 pb-6 box box--stacked">
                {settingsSections.map((section) => {
                  const isActive = activePage === section.key;
                  return (
                    <Link
                      key={section.key}
                      to={section.to}
                      aria-current={isActive ? "page" : undefined}
                      className={clsx(
                        "flex items-center py-3 first:-mt-3 last:-mb-3 [&.active]:text-primary [&.active]:font-medium hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                        { active: isActive },
                      )}
                    >
                      <Lucide
                        icon={section.icon}
                        className="stroke-[1.3] w-4 h-4 me-3"
                        aria-hidden="true"
                      />
                      {t(section.label)}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          <div className="flex min-w-0 flex-col col-span-12 xl:col-span-9 gap-y-7">
            <section className="p-1.5 box flex flex-col box--stacked" aria-label={t("title")}>
              <div className="h-60 relative w-full rounded-[0.6rem] bg-gradient-to-b from-theme-1/95 to-theme-2/95">
                <div
                  className={clsx(
                    "w-full h-full relative overflow-hidden",
                    "before:content-[''] before:absolute before:inset-0 before:bg-texture-white before:-mt-[50rem]",
                    "after:content-[''] after:absolute after:inset-0 after:bg-texture-white after:-mt-[50rem]",
                  )}
                  aria-hidden="true"
                />
                <div className="absolute inset-x-0 top-0 w-32 h-32 mx-auto mt-36">
                  <div className="w-full h-full overflow-hidden border-[6px] box border-white rounded-full">
                    <div className="grid w-full h-full place-items-center bg-slate-100 text-primary dark:bg-darkmode-600">
                      <Lucide icon="Building2" className="w-12 h-12" aria-hidden="true" />
                    </div>
                  </div>
                  <div
                    className="absolute bottom-0 end-0 w-5 h-5 mb-2.5 me-2.5 border-2 border-white rounded-full bg-success box"
                    aria-hidden="true"
                  />
                </div>
              </div>
              <div className="p-5 flex flex-col sm:flex-row gap-y-3 sm:items-end rounded-[0.6rem] bg-slate-50 dark:bg-darkmode-700 pt-12">
                <div className="min-w-0">
                  <div className="font-medium text-slate-600 dark:text-slate-300">
                    {t("title")}
                  </div>
                  <p className="mt-1.5 max-w-2xl text-xs leading-relaxed text-slate-500/80 dark:text-slate-400">
                    {t("subtitle")}
                  </p>
                </div>
                <div className="sm:ms-auto rounded-[0.5rem] border border-primary/50 bg-white px-4 py-2 font-medium text-primary dark:bg-darkmode-600">
                  {t(bookingMode === "instant" ? "instantMode" : "approvalMode")}
                </div>
              </div>
            </section>

            {activePage === "policy" && (
              <section aria-labelledby="policy-heading" className="flex flex-col p-5 box box--stacked">
                <h2
                  id="policy-heading"
                  className="pb-5 mb-6 font-medium border-b border-dashed border-slate-300/70 text-[0.94rem]"
                >
                  {t("policyTitle")}
                </h2>
                <form onSubmit={savePolicy}>
                  <div>
                    <div className={fieldRowClassName}>
                      <div className={fieldLabelClassName}>
                        <div className="text-start">
                          <div className="font-medium">{t("bookingModeLegend")}</div>
                          <div className="mt-1.5 xl:mt-3 text-xs leading-relaxed text-slate-500/80">
                            {t(
                              bookingMode === "instant"
                                ? "instantDescription"
                                : "approvalDescription",
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 w-full mt-3 xl:mt-0">
                        <FormSwitch className="justify-between rounded-[0.5rem] border border-slate-300/60 bg-white px-3 py-2 shadow-sm dark:bg-darkmode-600 dark:border-darkmode-400">
                          <FormSwitch.Label htmlFor={bookingModeId} className="ms-0 me-3">
                            {t(bookingMode === "instant" ? "instantMode" : "approvalMode")}
                          </FormSwitch.Label>
                          <FormSwitch.Input
                            id={bookingModeId}
                            type="checkbox"
                            checked={bookingMode === "instant"}
                            onChange={(event) =>
                              setBookingMode(event.target.checked ? "instant" : "approval")
                            }
                            aria-label={t("bookingModeLegend")}
                          />
                        </FormSwitch>
                      </div>
                    </div>

                    <div className={fieldRowClassName}>
                      <label htmlFor={cancellationId} className={fieldLabelClassName}>
                        <div className="text-start">
                          <div className="font-medium">{t("cancellationLabel")}</div>
                          <div className="mt-1.5 xl:mt-3 text-xs leading-relaxed text-slate-500/80">
                            {t("cancellationHelp")}
                          </div>
                        </div>
                      </label>
                      <div className="flex-1 w-full mt-3 xl:mt-0">
                        <FormSelect
                          id={cancellationId}
                          value={cancellationHours}
                          onChange={(event) => setCancellationHours(Number(event.target.value))}
                        >
                          {[1, 6, 12, 24, 48].map((hours) => (
                            <option key={hours} value={hours}>
                              {t("hourCount", { count: hours })}
                            </option>
                          ))}
                        </FormSelect>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 pt-5 mt-6 border-t border-dashed md:flex-row md:items-center md:justify-end border-slate-300/70">
                    <p aria-live="polite" className="min-h-5 text-sm text-success md:me-auto">
                      {policyMessage}
                    </p>
                    <Button
                      type="submit"
                      variant="outline-primary"
                      className="w-full px-4 border-primary/50 md:w-auto"
                    >
                      {t("savePolicy")}
                    </Button>
                  </div>
                </form>
              </section>
            )}

            {activePage === "locale" && (
              <section aria-labelledby="locale-heading" className="flex flex-col p-5 box box--stacked">
                <h2
                  id="locale-heading"
                  className="pb-5 mb-6 font-medium border-b border-dashed border-slate-300/70 text-[0.94rem]"
                >
                  {t("localeTitle")}
                </h2>
                <form onSubmit={saveLocale}>
                  <div>
                    <div className={fieldRowClassName}>
                      <div className={fieldLabelClassName}>
                        <div className="text-start">
                          <div className="font-medium">{shellT("shell.language")}</div>
                        </div>
                      </div>
                      <div className="flex-1 w-full mt-3 xl:mt-0">
                        <LanguageSwitcher />
                      </div>
                    </div>

                    <div className={fieldRowClassName}>
                      <label htmlFor={languageId} className={fieldLabelClassName}>
                        <div className="text-start">
                          <div className="font-medium">{t("businessLanguage")}</div>
                          <div className="mt-1.5 xl:mt-3 text-xs leading-relaxed text-slate-500/80">
                            {t("localeDescription")}
                          </div>
                        </div>
                      </label>
                      <div className="flex-1 w-full mt-3 xl:mt-0">
                        <FormSelect
                          id={languageId}
                          aria-label={t("businessLanguage")}
                          value={businessLanguage}
                          onChange={(event) => setBusinessLanguage(event.target.value as AppLanguage)}
                        >
                          {languageOptions.map((language) => (
                            <option
                              key={language.code}
                              value={language.code}
                              lang={language.documentLanguage}
                              dir={language.direction}
                            >
                              {language.nativeName}
                            </option>
                          ))}
                        </FormSelect>
                      </div>
                    </div>

                    <div className={fieldRowClassName}>
                      <div className={fieldLabelClassName}>
                        <div className="text-start">
                          <div className="font-medium">{shellT("shell.darkMode")}</div>
                        </div>
                      </div>
                      <div className="flex-1 w-full mt-3 xl:mt-0">
                        <FormSwitch className="justify-between rounded-[0.5rem] border border-slate-300/60 bg-white px-3 py-2 shadow-sm dark:bg-darkmode-600 dark:border-darkmode-400">
                          <FormSwitch.Label htmlFor={themeId} className="ms-0 me-3">
                            {shellT("shell.darkMode")}
                          </FormSwitch.Label>
                          <FormSwitch.Input
                            id={themeId}
                            type="checkbox"
                            checked={darkMode}
                            onChange={toggleDarkMode}
                            aria-label={shellT("shell.darkMode")}
                          />
                        </FormSwitch>
                      </div>
                    </div>
                    <div className={fieldRowClassName}>
                      <label htmlFor={timezoneId} className={fieldLabelClassName}>
                        <div className="text-start">
                          <div className="font-medium">{t("timezone")}</div>
                        </div>
                      </label>
                      <div className="flex-1 w-full mt-3 xl:mt-0">
                        <FormSelect
                          id={timezoneId}
                          aria-label={t("timezone")}
                          value="Asia/Tehran"
                          disabled
                        >
                          <option value="Asia/Tehran">{t("tehranTimezone")}</option>
                        </FormSelect>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 pt-5 mt-6 border-t border-dashed md:flex-row md:items-center md:justify-end border-slate-300/70">
                    <p aria-live="polite" className="min-h-5 text-sm text-success md:me-auto">
                      {localeMessage}
                    </p>
                    <Button
                      type="submit"
                      variant="outline-primary"
                      className="w-full px-4 border-primary/50 md:w-auto"
                    >
                      {t("saveLocale")}
                    </Button>
                  </div>
                </form>
              </section>
            )}

            {activePage === "access" && (
              <section aria-labelledby="access-heading" className="flex flex-col p-5 box box--stacked">
                <h2
                  id="access-heading"
                  className="pb-5 mb-6 font-medium border-b border-dashed border-slate-300/70 text-[0.94rem]"
                >
                  {t("accessTitle")}
                </h2>
                <p className="leading-relaxed text-slate-500">{t("accessDescription")}</p>
                <div
                  className="mt-5 max-w-full overflow-auto rounded-[0.6rem] border border-slate-200/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  role="region"
                  aria-label={t("accessTitle")}
                  tabIndex={0}
                >
                  <Table className="min-w-[36rem]">
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th
                          scope="col"
                          className="py-4 font-medium whitespace-nowrap first:rounded-ss-lg border-slate-200/80 last:rounded-se-lg bg-slate-50 text-slate-500 dark:bg-darkmode-700"
                        >
                          {t("role")}
                        </Table.Th>
                        <Table.Th
                          scope="col"
                          className="py-4 font-medium whitespace-nowrap first:rounded-ss-lg border-slate-200/80 last:rounded-se-lg bg-slate-50 text-slate-500 dark:bg-darkmode-700"
                        >
                          {t("defaultScope")}
                        </Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {(
                        [
                          ["owner", "ownerScope"],
                          ["receptionist", "receptionistScope"],
                          ["staff", "staffScope"],
                        ] as const
                      ).map(([role, scope]) => (
                        <Table.Tr key={role} className="[&_td]:last:border-b-0 [&_th]:last:border-b-0">
                          <Table.Th
                            scope="row"
                            className="py-4 font-medium text-start border-b border-dashed border-slate-300/70 dark:bg-darkmode-600"
                          >
                            {t(role)}
                          </Table.Th>
                          <Table.Td className="py-4 border-dashed border-slate-300/70 dark:bg-darkmode-600">
                            {t(scope)}
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </div>
                <p className="flex items-start gap-2 pt-5 mt-6 text-xs leading-relaxed text-slate-500 border-t border-dashed border-slate-300/70">
                  <Lucide icon="ShieldCheck" className="w-4 h-4 mt-0.5" aria-hidden="true" />
                  {t("apiAuthority")}
                </p>
              </section>
            )}

            {activePage === "security" && (
              <section aria-labelledby="security-heading" className="flex flex-col p-5 box box--stacked">
                <h2
                  id="security-heading"
                  className="pb-5 mb-6 font-medium border-b border-dashed border-slate-300/70 text-[0.94rem]"
                >
                  {t("securityTitle")}
                </h2>
                <form onSubmit={(event) => void changePassword(event)} noValidate>
                  <div>
                    <div className={fieldRowClassName}>
                      <label htmlFor={currentPasswordId} className={fieldLabelClassName}>
                        <div className="text-start">
                          <div className="font-medium">{t("currentPassword")}</div>
                          <div className="mt-1.5 xl:mt-3 text-xs leading-relaxed text-slate-500/80">
                            {t("securityDescription")}
                          </div>
                        </div>
                      </label>
                      <div className="flex-1 w-full mt-3 xl:mt-0">
                        <FormInput
                          id={currentPasswordId}
                          type="password"
                          autoComplete="current-password"
                          value={currentPassword}
                          onChange={(event) => setCurrentPassword(event.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className={fieldRowClassName}>
                      <label htmlFor={newPasswordId} className={fieldLabelClassName}>
                        <div className="text-start">
                          <div className="font-medium">{t("newPassword")}</div>
                          <div className="mt-1.5 xl:mt-3 text-xs leading-relaxed text-slate-500/80">
                            {t("passwordHelp")}
                          </div>
                        </div>
                      </label>
                      <div className="flex-1 w-full mt-3 xl:mt-0">
                        <FormInput
                          id={newPasswordId}
                          type="password"
                          autoComplete="new-password"
                          value={newPassword}
                          onChange={(event) => setNewPassword(event.target.value)}
                          minLength={12}
                          required
                        />
                      </div>
                    </div>
                    <div className={fieldRowClassName}>
                      <label htmlFor={confirmPasswordId} className={fieldLabelClassName}>
                        <div className="text-start">
                          <div className="font-medium">{t("confirmPassword")}</div>
                        </div>
                      </label>
                      <div className="flex-1 w-full mt-3 xl:mt-0">
                        <FormInput
                          id={confirmPasswordId}
                          type="password"
                          autoComplete="new-password"
                          value={confirmPassword}
                          onChange={(event) => setConfirmPassword(event.target.value)}
                          minLength={12}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 pt-5 mt-6 border-t border-dashed md:flex-row md:items-center md:justify-end border-slate-300/70">
                    <p
                      role={passwordState === "error" ? "alert" : undefined}
                      aria-live="polite"
                      className={clsx("min-h-5 text-sm md:me-auto", {
                        "text-danger": passwordState === "error",
                        "text-success": passwordState === "success",
                      })}
                    >
                      {passwordMessage}
                    </p>
                    <Button
                      type="submit"
                      variant="outline-primary"
                      className="w-full px-4 border-primary/50 md:w-auto"
                      disabled={passwordState === "pending"}
                    >
                      {t(passwordState === "pending" ? "changingPassword" : "changePassword")}
                    </Button>
                  </div>
                </form>
              </section>
            )}

            {activePage === "delete" && (
              <section aria-labelledby="danger-heading" className="flex flex-col p-5 box box--stacked">
                <h2
                  id="danger-heading"
                  className="pb-5 mb-6 font-medium text-danger border-b border-dashed border-slate-300/70 text-[0.94rem]"
                >
                  {t("dangerTitle")}
                </h2>
                <p className="leading-relaxed text-slate-500">{t("dangerDescription")}</p>
                <form onSubmit={(event) => void requestDeletion(event)}>
                  <FormCheck className="mt-5">
                    <FormCheck.Input
                      id={acknowledgementId}
                      type="checkbox"
                      checked={acknowledged}
                      onChange={(event) => setAcknowledged(event.target.checked)}
                    />
                    <FormCheck.Label htmlFor={acknowledgementId}>
                      {t("acknowledgeDeletion")}
                    </FormCheck.Label>
                  </FormCheck>

                  <div className={fieldRowClassName}>
                    <label htmlFor={deletionId} className={fieldLabelClassName}>
                      <div className="text-start">
                        <div className="font-medium">{t("confirmationLabel")}</div>
                      </div>
                    </label>
                    <div className="flex-1 w-full mt-3 xl:mt-0">
                      <FormInput
                        id={deletionId}
                        value={confirmation}
                        onChange={(event) => setConfirmation(event.target.value)}
                        autoComplete="off"
                        spellCheck={false}
                        dir="ltr"
                        placeholder={t("confirmationPlaceholder")}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col-reverse gap-3 pt-5 mt-6 border-t border-dashed md:flex-row md:items-center md:justify-end border-slate-300/70">
                    <p
                      role={deletionState === "error" ? "alert" : undefined}
                      aria-live="polite"
                      className={clsx("min-h-5 text-sm md:me-auto", {
                        "text-danger": deletionState === "error",
                        "text-success": deletionState === "success",
                      })}
                    >
                      {deletionMessage}
                    </p>
                    <Button
                      type="submit"
                      variant="outline-danger"
                      className="w-full px-4 border-danger/50 bg-danger/5 md:w-auto"
                      disabled={
                        !acknowledged ||
                        confirmation !== "DELETE" ||
                        deletionState === "pending"
                      }
                    >
                      {t(deletionState === "pending" ? "deletingBusiness" : "deleteBusiness")}
                    </Button>
                  </div>
                </form>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
