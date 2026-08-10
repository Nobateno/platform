import { useContext } from "react";
import { formInlineContext } from "../FormInline";
import { twMerge } from "tailwind-merge";

type FormLabelProps = React.PropsWithChildren &
  React.ComponentPropsWithoutRef<"label">;

function FormLabel(props: FormLabelProps) {
  const formInline = useContext(formInlineContext);
  return (
    <label
      {...props}
      className={twMerge([
        "m3-label-large inline-block mb-2 text-m3-on-surface",
        formInline && "mb-2 sm:mb-0 sm:me-5 sm:text-end",
        props.className,
      ])}
    >
      {props.children}
    </label>
  );
}

export default FormLabel;
