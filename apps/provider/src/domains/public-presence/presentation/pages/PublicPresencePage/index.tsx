import { useMemo, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { publicPresenceNamespace } from "@/domains/public-presence/i18n";
import Button from "@/shared/ui/components/Base/Button";
import {
  FormInput,
  FormLabel,
  FormSelect,
  FormTextarea,
} from "@/shared/ui/components/Base/Form";

type Destination = "publicPage" | "bookingFlow";

const qrPattern = [
  1, 1, 1, 0, 1, 1, 1,
  1, 0, 1, 0, 1, 0, 1,
  1, 1, 1, 1, 1, 1, 1,
  0, 0, 1, 0, 1, 0, 0,
  1, 1, 1, 1, 0, 1, 1,
  1, 0, 1, 0, 1, 0, 1,
  1, 1, 1, 0, 1, 1, 1,
];

function PublicPresencePage() {
  const { t } = useTranslation(publicPresenceNamespace);
  const [businessName, setBusinessName] = useState("");
  const [description, setDescription] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [destination, setDestination] = useState<Destination>("publicPage");
  const [published, setPublished] = useState(false);
  const [feedback, setFeedback] = useState("");
  const bookingLink = "https://booking.nobateno.example/provider-demo";

  const completion = useMemo(() => {
    const completed = [businessName, description, neighborhood].filter((value) => value.trim()).length;
    return Math.round((completed / 3) * 100);
  }, [businessName, description, neighborhood]);

  const canPublish = completion === 100;

  const copyLink = async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(bookingLink);
      setFeedback(t("copied"));
    } catch {
      setFeedback(t("copyFailed"));
    }
  };

  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: businessName || t("previewFallbackName"), url: bookingLink });
        return;
      } catch {
        return;
      }
    }
    await copyLink();
  };

  const saveDraft = (event: FormEvent) => {
    event.preventDefault();
    setFeedback(t("saved"));
  };

  const togglePublication = () => {
    setPublished((current) => {
      const next = !current;
      setFeedback(t(next ? "published" : "unpublished"));
      return next;
    });
  };

  return (
    <section
      className="grid grid-cols-12 gap-x-6 gap-y-10"
      aria-labelledby="public-presence-title"
    >
      <div className="col-span-12">
        <div className="flex flex-col gap-y-3 md:h-10 md:flex-row md:items-center">
          <h1
            id="public-presence-title"
            className="text-base font-medium group-[.mode--light]:text-white"
          >
            {t("title")}
          </h1>
        </div>

      <div className="mt-3.5 grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(18rem,0.7fr)]">
        <form className="space-y-6" onSubmit={saveDraft}>
          <section className="box box--stacked p-5" aria-labelledby="page-details-title">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 id="page-details-title" className="font-medium">{t("profileSection")}</h2>
              <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-2 text-xs font-medium text-primary" aria-live="polite">
                {t("completion", { percent: completion })}
              </span>
            </div>
            <div className="mt-5 border-t border-dashed border-slate-300/70 pt-5">
              <div className="font-medium">{t("eyebrow")}</div>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-500">{t("description")}</p>
            </div>
            <p id="public-profile-required-hint" className="mt-4 text-xs text-slate-500">{t("requiredHint")}</p>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <FormLabel htmlFor="public-business-name">{t("businessName")}</FormLabel>
                <FormInput
                  id="public-business-name"
                  className="mt-2"
                  value={businessName}
                  onChange={(event) => setBusinessName(event.target.value)}
                  placeholder={t("businessNamePlaceholder")}
                  required
                />
              </div>
              <div>
                <FormLabel htmlFor="public-neighborhood">{t("neighborhood")}</FormLabel>
                <FormInput
                  id="public-neighborhood"
                  className="mt-2"
                  value={neighborhood}
                  onChange={(event) => setNeighborhood(event.target.value)}
                  placeholder={t("neighborhoodPlaceholder")}
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <FormLabel htmlFor="public-description">{t("descriptionLabel")}</FormLabel>
                <FormTextarea
                  id="public-description"
                  className="mt-2 min-h-28"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder={t("descriptionPlaceholder")}
                  required
                />
              </div>
            </div>
          </section>

          <section className="box box--stacked p-5" aria-labelledby="booking-link-title">
            <h2 id="booking-link-title" className="border-b border-dashed border-slate-300/70 pb-5 font-medium">{t("linkSection")}</h2>
            <div className="mt-5">
              <FormLabel htmlFor="public-booking-link">{t("bookingLink")}</FormLabel>
              <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                <FormInput id="public-booking-link" dir="ltr" readOnly value={bookingLink} />
                <Button type="button" variant="outline-primary" onClick={copyLink}>{t("copyLink")}</Button>
                <Button type="button" variant="outline-primary" onClick={shareLink}>{t("shareLink")}</Button>
              </div>
            </div>
            <div className="mt-5">
              <FormLabel htmlFor="public-destination">{t("destination")}</FormLabel>
              <FormSelect
                id="public-destination"
                className="mt-2"
                value={destination}
                onChange={(event) => setDestination(event.target.value as Destination)}
              >
                <option value="publicPage">{t("publicPage")}</option>
                <option value="bookingFlow">{t("bookingFlow")}</option>
              </FormSelect>
            </div>
          </section>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button type="submit" variant="outline-primary">{t("saveDraft")}</Button>
            <Button
              type="button"
              variant="primary"
              disabled={!canPublish}
              aria-describedby="public-profile-required-hint"
              onClick={togglePublication}
            >
              {t(published ? "unpublish" : "publish")}
            </Button>
          </div>
          <p className="min-h-6 text-sm text-primary" aria-live="polite">{feedback}</p>
        </form>

        <aside className="space-y-6">
          <section className="box box--stacked p-5" aria-labelledby="qr-preview-title">
            <h2 id="qr-preview-title" className="border-b border-dashed border-slate-300/70 pb-5 font-medium">{t("qrPreview")}</h2>
            <div className="mt-4 flex justify-center">
              <div className="grid h-44 w-44 grid-cols-7 gap-1 rounded-[0.6rem] border border-slate-200/60 bg-white p-4 shadow-sm" aria-hidden="true">
                {qrPattern.map((filled, index) => (
                  <span key={index} className={filled ? "bg-slate-900" : "bg-white"} />
                ))}
              </div>
            </div>
            <p className="mt-4 text-center text-xs font-medium text-primary">{t(destination)}</p>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">{t("qrNote")}</p>
          </section>

          <section className="box box--stacked overflow-hidden" aria-labelledby="page-preview-title">
            <div className="relative h-28 bg-gradient-to-b from-theme-1/95 to-theme-2/95 before:absolute before:inset-0 before:bg-texture-white" aria-hidden="true" />
            <div className="p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 id="page-preview-title" className="font-medium">{t("previewSection")}</h2>
              <span className="rounded-full border border-slate-200/60 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-500 dark:border-darkmode-400 dark:bg-darkmode-400">
                {t(published ? "statusPublished" : "statusDraft")}
              </span>
            </div>
            <h3 className="mt-6 font-medium">{businessName || t("previewFallbackName")}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">{description || t("previewFallbackDescription")}</p>
            {neighborhood ? <p className="mt-4 text-xs font-medium text-primary">{neighborhood}</p> : null}
            </div>
          </section>
        </aside>
      </div>
      </div>
    </section>
  );
}

export default PublicPresencePage;
