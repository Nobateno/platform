import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

type Variant =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "pending"
  | "danger"
  | "dark"
  | "outline-primary"
  | "outline-secondary"
  | "outline-success"
  | "outline-warning"
  | "outline-pending"
  | "outline-danger"
  | "outline-dark"
  | "soft-primary"
  | "soft-secondary"
  | "soft-success"
  | "soft-warning"
  | "soft-pending"
  | "soft-danger"
  | "soft-dark"
  | "facebook"
  | "twitter"
  | "instagram"
  | "linkedin";

type Elevated = boolean;
type Size = "sm" | "lg";
type Rounded = boolean;

type ButtonProps<C extends React.ElementType> = PolymorphicComponentPropWithRef<
  C,
  {
    as?: C extends string ? "button" | "a" : C;
    variant?: Variant;
    elevated?: Elevated;
    size?: Size;
    rounded?: Rounded;
  }
>;

type ButtonComponent = <C extends React.ElementType = "button">(
  props: ButtonProps<C>
) => React.ReactElement | null | React.ReactNode;

const Button: ButtonComponent = forwardRef(
  <C extends React.ElementType>(
    {
      as,
      size,
      variant,
      elevated,
      rounded,
      children,
      ...props
    }: ButtonProps<C>,
    ref?: PolymorphicRef<C>
  ) => {
    const Component = as || "button";

    // General Styles
    const generalStyles = [
      "m3-label-large min-h-10 transition-colors duration-200 border border-transparent shadow-none inline-flex items-center justify-center py-2 px-6 rounded-full font-medium cursor-pointer", // M3 default
      "focus:ring-4 focus:ring-primary/20", // On focus
      "focus-visible:outline-none", // On focus visible
      "dark:focus:ring-slate-700 dark:focus:ring-opacity-50", // Dark mode
      "active:translate-y-px", // Pressed state
      "[&:not(button)]:text-center", // Not a button element
      "disabled:opacity-70 disabled:cursor-not-allowed", // Disabled
    ];

    // Sizes
    const small = ["m3-label-medium min-h-8 py-1.5 px-4"];
    const large = ["m3-label-large min-h-12 py-2.5 px-8"];

    // Main Colors
    const primary = [
      "bg-m3-primary text-m3-on-primary hover:bg-m3-primary/90 shadow-m3-1", // Default
    ];
    const secondary = [
      "bg-m3-secondary-container text-m3-on-secondary-container", // Default
      "hover:bg-m3-secondary-container/80", // State layer
    ];
    const success = [
      "bg-success border-success text-slate-900", // Default
      "dark:border-success", // Dark mode
    ];
    const warning = [
      "bg-warning border-warning text-slate-900", // Default
      "dark:border-warning", // Dark mode
    ];
    const pending = [
      "bg-pending border-pending text-white", // Default
      "dark:border-pending", // Dark mode
    ];
    const danger = [
      "bg-m3-error text-m3-on-error", // Default
      "dark:border-danger", // Dark mode
    ];
    const dark = [
      "bg-dark border-dark text-white", // Default
      "dark:bg-darkmode-800 dark:border-transparent dark:text-slate-300", // Dark mode
      "[&:hover:not(:disabled)]:dark:bg-darkmode-800/70", // On hover and not disabled in dark mode
    ];

    // Social Media
    const facebook = [
      "bg-[#3b5998] border-[#3b5998] text-white dark:border-[#3b5998]",
    ];
    const twitter = [
      "bg-[#4ab3f4] border-[#4ab3f4] text-white dark:border-[#4ab3f4]",
    ];
    const instagram = [
      "bg-[#517fa4] border-[#517fa4] text-white dark:border-[#517fa4]",
    ];
    const linkedin = [
      "bg-[#0077b5] border-[#0077b5] text-white dark:border-[#0077b5]",
    ];

    // Outline
    const outlinePrimary = [
      "border-m3-outline text-m3-primary", // Default
      "dark:border-primary", // Dark mode
      "[&:hover:not(:disabled)]:bg-m3-primary/10", // On hover and not disabled
    ];
    const outlineSecondary = [
      "border-m3-outline text-m3-on-surface-variant", // Default
      "dark:border-darkmode-100/40 dark:text-slate-300", // Dark mode
      "[&:hover:not(:disabled)]:bg-secondary/20", // On hover and not disabled
      "[&:hover:not(:disabled)]:dark:bg-darkmode-100/10", // On hover and not disabled in dark mode
    ];
    const outlineSuccess = [
      "border-success text-success", // Default
      "dark:border-success", // Dark mode
      "[&:hover:not(:disabled)]:bg-success/10", // On hover and not disabled
    ];
    const outlineWarning = [
      "border-warning text-warning", // Default
      "dark:border-warning", // Dark mode
      "[&:hover:not(:disabled)]:bg-warning/10", // On hover and not disabled
    ];
    const outlinePending = [
      "border-pending text-pending", // Default
      "dark:border-pending", // Dark mode
      "[&:hover:not(:disabled)]:bg-pending/10", // On hover and not disabled
    ];
    const outlineDanger = [
      "border-danger text-danger", // Default
      "dark:border-danger", // Dark mode
      "[&:hover:not(:disabled)]:bg-danger/10", // On hover and not disabled
    ];
    const outlineDark = [
      "border-dark text-dark", // Default
      "dark:border-darkmode-800 dark:text-slate-300", // Dark mode
      "[&:hover:not(:disabled)]:bg-darkmode-800/30", // On hover and not disabled
      "[&:hover:not(:disabled)]:dark:bg-opacity-30", // On hover and not disabled in dark mode
    ];

    // Soft Color
    const softPrimary = [
      "bg-m3-primary-container text-m3-on-primary-container", // M3 tonal button
      "[&:hover:not(:disabled)]:bg-m3-primary-container/80", // State layer
    ];
    const softSecondary = [
      "bg-slate-300 border-secondary bg-opacity-20 text-slate-700", // Default
      "dark:bg-darkmode-100/20 dark:border-darkmode-100/30 dark:text-slate-300", // Dark mode
      "[&:hover:not(:disabled)]:bg-opacity-10", // On hover and not disabled
      "[&:hover:not(:disabled)]:dark:bg-darkmode-100/10 [&:hover:not(:disabled)]:dark:border-darkmode-100/20", // On hover and not disabled in dark mode
    ];
    const softSuccess = [
      "bg-success border-success bg-opacity-20 border-opacity-5 text-slate-900", // Default
      "dark:border-success dark:border-opacity-20 dark:text-success", // Dark mode
      "[&:hover:not(:disabled)]:bg-opacity-10 [&:hover:not(:disabled)]:border-opacity-10", // On hover and not disabled
    ];
    const softWarning = [
      "bg-warning border-warning bg-opacity-20 border-opacity-5 text-slate-900", // Default
      "dark:border-warning dark:border-opacity-20 dark:text-warning", // Dark mode
      "[&:hover:not(:disabled)]:bg-opacity-10 [&:hover:not(:disabled)]:border-opacity-10", // On hover and not disabled
    ];
    const softPending = [
      "bg-pending border-pending bg-opacity-20 border-opacity-5 text-slate-900", // Default
      "dark:border-pending dark:border-opacity-20 dark:text-pending", // Dark mode
      "[&:hover:not(:disabled)]:bg-opacity-10 [&:hover:not(:disabled)]:border-opacity-10", // On hover and not disabled
    ];
    const softDanger = [
      "bg-danger border-danger bg-opacity-20 border-opacity-5 text-slate-900", // Default
      "dark:border-danger dark:border-opacity-20 dark:text-danger", // Dark mode
      "[&:hover:not(:disabled)]:bg-opacity-10 [&:hover:not(:disabled)]:border-opacity-10", // On hover and not disabled
    ];
    const softDark = [
      "bg-dark border-dark bg-opacity-20 border-opacity-5 text-dark", // Default
      "dark:bg-darkmode-800/30 dark:border-darkmode-800/60 dark:text-slate-300", // Dark mode
      "[&:hover:not(:disabled)]:bg-opacity-10 [&:hover:not(:disabled)]:border-opacity-10", // On hover and not disabled
      "[&:hover:not(:disabled)]:dark:bg-darkmode-800/50 [&:hover:not(:disabled)]:dark:border-darkmode-800", // On hover and not disabled in dark mode
    ];

    return (
      <Component
        {...props}
        ref={ref}
        className={twMerge([
          generalStyles,
          size == "sm" && small,
          size == "lg" && large,
          variant == "primary" && primary,
          variant == "secondary" && secondary,
          variant == "success" && success,
          variant == "warning" && warning,
          variant == "pending" && pending,
          variant == "danger" && danger,
          variant == "dark" && dark,
          variant == "outline-primary" && outlinePrimary,
          variant == "outline-secondary" && outlineSecondary,
          variant == "outline-success" && outlineSuccess,
          variant == "outline-warning" && outlineWarning,
          variant == "outline-pending" && outlinePending,
          variant == "outline-danger" && outlineDanger,
          variant == "outline-dark" && outlineDark,
          variant == "soft-primary" && softPrimary,
          variant == "soft-secondary" && softSecondary,
          variant == "soft-success" && softSuccess,
          variant == "soft-warning" && softWarning,
          variant == "soft-pending" && softPending,
          variant == "soft-danger" && softDanger,
          variant == "soft-dark" && softDark,
          variant == "facebook" && facebook,
          variant == "twitter" && twitter,
          variant == "instagram" && instagram,
          variant == "linkedin" && linkedin,
          rounded && "rounded-full",
          elevated && "shadow-m3-2",
          props.className,
        ])}
      >
        {children}
      </Component>
    );
  }
);

export default Button;
