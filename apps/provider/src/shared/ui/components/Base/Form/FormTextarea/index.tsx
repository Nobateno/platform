import { useContext, forwardRef } from "react";
import { formInlineContext } from "../FormInline";
import { inputGroupContext } from "../InputGroup";
import { twMerge } from "tailwind-merge";

interface FormTextareaProps extends React.ComponentPropsWithoutRef<"textarea"> {
  formTextareaSize?: "sm" | "lg";
  rounded?: boolean;
}

type FormTextareaRef = React.ComponentPropsWithRef<"textarea">["ref"];

const FormTextarea = forwardRef(
  (props: FormTextareaProps, ref: FormTextareaRef) => {
    const formInline = useContext(formInlineContext);
    const inputGroup = useContext(inputGroupContext);
    const {
      formTextareaSize: _formTextareaSize,
      rounded: _rounded,
      ...computedProps
    } = props;
    return (
      <textarea
        {...computedProps}
        ref={ref}
        className={twMerge([
          "disabled:bg-m3-surface-container disabled:text-m3-on-surface/38 disabled:cursor-not-allowed",
          "[&[readonly]]:bg-slate-100 [&[readonly]]:cursor-not-allowed [&[readonly]]:dark:bg-darkmode-800/50 [&[readonly]]:dark:border-transparent",
          "m3-body-medium transition-colors duration-200 ease-in-out w-full bg-m3-surface text-m3-on-surface border-m3-outline shadow-none rounded-m3-xs placeholder:text-m3-on-surface-variant focus:ring-4 focus:ring-primary/20 focus:border-m3-primary dark:bg-m3-surface dark:border-m3-outline dark:placeholder:text-m3-on-surface-variant",
          props.formTextareaSize == "sm" && "text-xs py-1.5 px-2",
          props.formTextareaSize == "lg" && "text-lg py-1.5 px-4",
          props.rounded && "rounded-full",
          formInline && "flex-1",
          inputGroup &&
            "rounded-none [&:not(:first-child)]:border-l-transparent first:rounded-l last:rounded-r z-10",
          props.className,
        ])}
      />
    );
  }
);

export default FormTextarea;
