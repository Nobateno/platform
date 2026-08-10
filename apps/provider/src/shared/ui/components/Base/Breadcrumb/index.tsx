import clsx from "clsx";
import { Link } from "@/shared/lib/navigation";
import { cloneElement, createContext, useContext } from "react";
import { useTranslation } from "react-i18next";

interface BreadcrumbProps
  extends React.PropsWithChildren,
    React.ComponentPropsWithoutRef<"nav"> {
  light?: boolean;
  children: React.ReactElement | React.ReactElement[];
}

const breadcrumbContext = createContext<{
  light?: boolean;
}>({
  light: undefined,
});

function Breadcrumb({ className, light, children, ...props }: BreadcrumbProps) {
  const { t } = useTranslation("sharedUi");
  return (
    <breadcrumbContext.Provider
      value={{
        light: light,
      }}
    >
      <nav
        {...props}
        className={clsx(["flex", className])}
        aria-label={props["aria-label"] ?? t("accessibility.breadcrumb")}
      >
        <ol
          className={clsx([
            "flex items-center text-theme-1 dark:text-slate-300",
            { "text-white/90": light },
          ])}
        >
          {Array.isArray(children)
            ? children.map((item, position) =>
                cloneElement(
                  item as React.ReactElement<{ position?: number }>,
                  { key: position, position },
                ),
              )
            : cloneElement(
                children as React.ReactElement<{ position?: number }>,
                { position: 0 },
              )}
        </ol>
      </nav>
    </breadcrumbContext.Provider>
  );
}

interface LinkProps
  extends React.PropsWithChildren,
    React.ComponentPropsWithoutRef<"li"> {
  to?: string;
  active?: boolean;
  position?: number;
}

Breadcrumb.Link = ({
  className,
  to = "",
  active = false,
  children,
  position = 0,
  ...attr
}: LinkProps) => {
  const breadcrumb = useContext(breadcrumbContext);
  return (
    <li
      className={clsx([
        className,
        position > 0 && "relative ms-5 ps-0.5",
        !breadcrumb.light &&
          position > 0 &&
          "before:content-[''] before:w-[14px] before:h-[14px] before:bg-chevron-black before:transform before:rotate-[-90deg] rtl:before:rotate-[90deg] before:bg-[length:100%] before:-ms-[1.125rem] before:absolute before:my-auto before:inset-y-0",
        breadcrumb.light &&
          position > 0 &&
          "before:content-[''] before:w-[14px] before:h-[14px] before:bg-chevron-white before:transform before:rotate-[-90deg] rtl:before:rotate-[90deg] before:bg-[length:100%] before:-ms-[1.125rem] before:absolute before:my-auto before:inset-y-0",
        position > 0 && "dark:before:bg-chevron-black",
        !breadcrumb.light &&
          active &&
          "text-slate-600 cursor-text dark:text-slate-400",
        breadcrumb.light && active && "text-white/70",
      ])}
      {...attr}
    >
      {active ? (
        <span aria-current="page">{children}</span>
      ) : (
        <Link to={to}>{children}</Link>
      )}
    </li>
  );
};

export default Breadcrumb;
