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
      className="hidden min-w-0 flex-1 text-white lg:flex lg:flex-col lg:justify-center lg:ps-16 xl:ps-28 2xl:ps-36"
    >
      <div className="w-full max-w-[720px]">
        <h2
          id={headingId}
          className="text-[2.6rem] font-medium leading-[1.4] xl:text-5xl xl:leading-[1.2]"
        >
          {title}
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/75 xl:text-lg">
          {description}
        </p>
        <img
          src={authProviderHero}
          alt=""
          aria-hidden="true"
          className="mt-7 w-full max-w-[570px] xl:max-w-[640px]"
        />
      </div>
    </aside>
  );
}
