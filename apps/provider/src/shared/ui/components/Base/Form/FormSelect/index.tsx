import { useContext } from "react";
import { formInlineContext } from "../FormInline";
import { twMerge } from "tailwind-merge";

interface FormSelectProps extends React.ComponentPropsWithoutRef<"select"> {
  formSelectSize?: "sm" | "lg";
}

function FormSelect(props: FormSelectProps) {
  const formInline = useContext(formInlineContext);
  const { formSelectSize: _formSelectSize, ...computedProps } = props;
  return (
    <select
      {...computedProps}
      className={
        "bg-[length:20px_auto] " +
        twMerge([
          "disabled:bg-m3-surface-container disabled:text-m3-on-surface/38 disabled:cursor-not-allowed",
          "[&[readonly]]:bg-slate-100 [&[readonly]]:cursor-not-allowed [&[readonly]]:dark:bg-darkmode-800/50",
          "m3-body-medium min-h-10 bg-chevron-black transition-colors duration-200 ease-in-out w-full bg-m3-surface text-m3-on-surface border-m3-outline shadow-none rounded-m3-xs py-2 px-3 pe-8 focus:ring-4 focus:ring-primary/20 focus:border-m3-primary dark:bg-chevron-white dark:bg-m3-surface dark:border-m3-outline dark:text-m3-on-surface",
          props.formSelectSize == "sm" && "text-xs py-1.5 ps-2 pe-8",
          props.formSelectSize == "lg" && "text-lg py-1.5 ps-4 pe-8",
          formInline && "flex-1",
          props.className,
        ])
      }
    >
      {props.children}
    </select>
  );
}

export default FormSelect;
