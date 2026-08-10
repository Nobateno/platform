import { twMerge } from "tailwind-merge";
import Button from "../Button";

type PaginationProps = React.PropsWithChildren &
  React.ComponentPropsWithoutRef<"nav">;

function Pagination({ className, children, ...props }: PaginationProps) {
  return (
    <nav {...props} className={className}>
      <ul className="flex w-full me-0 sm:w-auto sm:me-auto">{children}</ul>
    </nav>
  );
}

interface LinkProps
  extends React.PropsWithChildren,
    React.ComponentPropsWithoutRef<"a"> {
  active?: boolean;
}

Pagination.Link = ({ className, active, children, ...props }: LinkProps) => {
  return (
    <li className="flex-1 sm:flex-initial">
      <Button
        {...props}
        as="a"
        aria-current={active ? "page" : undefined}
        className={twMerge([
          "min-w-0 sm:min-w-[40px] font-normal flex items-center justify-center text-slate-800 sm:me-2 dark:text-slate-300 px-1 sm:px-3",
          active &&
            "rounded-full bg-m3-primary-container text-m3-on-primary-container font-medium",
          !active && "shadow-none border-transparent",
          className,
        ])}
      >
        {children}
      </Button>
    </li>
  );
};

interface ButtonProps
  extends React.PropsWithChildren,
    React.ComponentPropsWithoutRef<"button"> {
  active?: boolean;
}

Pagination.Button = ({
  className,
  disabled,
  active,
  children,
  ...otherProps
}: ButtonProps) => {
  return (
    <li className="flex-1 sm:flex-initial">
      <Button
        {...otherProps}
        disabled={disabled}
        aria-current={active ? "page" : undefined}
        className={twMerge([
          "min-w-0 sm:min-w-[40px] font-normal flex items-center justify-center sm:me-2 px-1 sm:px-3",
          active
            ? "rounded-full bg-m3-primary-container text-m3-on-primary-container font-medium"
            : "shadow-none border-transparent",
          className,
        ])}
      >
        {children}
      </Button>
    </li>
  );
};

export default Pagination;
