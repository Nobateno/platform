import { useContext, forwardRef, type ComponentPropsWithoutRef } from "react";
import { formInlineContext } from "../FormInline";
import { inputGroupContext } from "../InputGroup";
import { twMerge } from "tailwind-merge";

export interface FormInputProps extends ComponentPropsWithoutRef<"input"> {
  formInputSize?: "sm" | "lg";
  rounded?: boolean;
}

type FormInputRef = React.ComponentPropsWithRef<"input">["ref"];

const FormInput = forwardRef((props: FormInputProps, ref: FormInputRef) => {
  const formInline = useContext(formInlineContext);
  const inputGroup = useContext(inputGroupContext);
  const {
    formInputSize: _formInputSize,
    rounded: _rounded,
    ...computedProps
  } = props;
  return (
    <input
      {...computedProps}
      ref={ref}
      className={twMerge([
        "disabled:bg-m3-surface-container disabled:text-m3-on-surface/38 disabled:cursor-not-allowed",
        "[&[readonly]]:bg-slate-100 [&[readonly]]:cursor-not-allowed [&[readonly]]:dark:bg-darkmode-800/50 [&[readonly]]:dark:border-transparent",
        "m3-body-medium min-h-10 transition-colors duration-200 ease-in-out w-full bg-m3-surface text-m3-on-surface border-m3-outline shadow-none rounded-m3-xs placeholder:text-m3-on-surface-variant focus:ring-4 focus:ring-primary/20 focus:border-m3-primary dark:bg-m3-surface dark:border-m3-outline dark:placeholder:text-m3-on-surface-variant",
        "aria-[invalid=true]:border-m3-error aria-[invalid=true]:focus:border-m3-error aria-[invalid=true]:focus:ring-m3-error/15",
        props.formInputSize == "sm" && "text-xs py-1.5 px-2",
        props.formInputSize == "lg" && "text-lg py-1.5 px-4",
        props.rounded && "rounded-full",
        formInline && "flex-1",
        inputGroup &&
          "rounded-none [&:not(:first-child)]:border-l-transparent first:rounded-l last:rounded-r z-10",
        props.className,
      ])}
    />
  );
});

export default FormInput;
