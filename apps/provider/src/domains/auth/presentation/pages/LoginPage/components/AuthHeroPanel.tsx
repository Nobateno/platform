import authProviderHero from "@/assets/images/auth-provider-hero.svg";

const headingId = "provider-auth-hero-title";

interface AuthHeroPanelProps {
  title: string;
  description: string;
}

export default function AuthHeroPanel({
  title,
  description,
}: AuthHeroPanelProps) {
  return (
    <aside
      aria-labelledby={headingId}
      className="hidden min-w-0 flex-1 lg:flex lg:flex-col lg:justify-center"
    >
      <div className="relative w-full max-w-[720px]">
        <div
          aria-hidden="true"
          className="absolute -start-14 top-1/2 h-[31rem] w-[31rem] -translate-y-1/2 rounded-full bg-m3-primary/10 blur-2xl"
        />
        <h2
          id={headingId}
          className="relative max-w-[34rem] text-[2.35rem] font-medium leading-[1.38] text-m3-on-surface xl:text-5xl xl:leading-[1.25]"
        >
          {title}
        </h2>
        <p className="relative mt-5 max-w-xl text-base leading-relaxed text-m3-on-surface-variant xl:text-lg">
          {description}
        </p>
        <div className="relative mt-8 max-w-[640px] overflow-hidden rounded-[2rem] border border-white/80 bg-gradient-to-br from-m3-primary-container/70 via-white/80 to-m3-surface-container p-2 shadow-[0_22px_54px_rgb(52_60_115_/_0.14)] dark:border-m3-outline/35 dark:from-m3-primary-container/30 dark:via-m3-surface dark:to-m3-surface-container">
          <img
            src={authProviderHero}
            alt=""
            aria-hidden="true"
            className="w-full"
          />
        </div>
      </div>
    </aside>
  );
}
