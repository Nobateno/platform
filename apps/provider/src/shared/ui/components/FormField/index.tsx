import { forwardRef, useId, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import {
  FormInput,
  FormLabel,
  type FormInputProps,
} from "@/shared/ui/components/Base/Form";

export interface FormFieldProps extends Omit<FormInputProps, "id"> {
  id?: string;
  label: ReactNode;
  error?: ReactNode;
  hint?: ReactNode;
  leading?: ReactNode;
  leadingClassName?: string;
  leadingInteractive?: boolean;
  trailing?: ReactNode;
  requiredIndicator?: ReactNode;
  containerClassName?: string;
  inputClassName?: string;
  footer?: ReactNode;
}

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  (
    {
      id: providedId,
      label,
      error,
      hint,
      leading,
      leadingClassName,
      leadingInteractive = false,
      trailing,
      required,
      requiredIndicator = "*",
      containerClassName,
      inputClassName,
      footer,
      "aria-describedby": describedBy,
      ...inputProps
    },
    ref,
  ) => {
    const generatedId = useId();
    const id = providedId ?? generatedId;
    const messageId = `${id}-message`;
    const descriptionIds = [describedBy, error || hint ? messageId : undefined]
      .filter(Boolean)
      .join(" ") || undefined;

    return (
      <div className={containerClassName}>
        <FormLabel htmlFor={id}>
          {label}
          {required && (
            <span className="ms-1 text-m3-error" aria-hidden="true">
              {requiredIndicator}
            </span>
          )}
        </FormLabel>
        <div className="relative">
          {leading && (
            <span
              className={twMerge(
                "pointer-events-none absolute inset-y-0 start-3 z-10 flex items-center text-m3-on-surface-variant",
                leadingInteractive && "pointer-events-auto",
                leadingClassName,
              )}
            >
              {leading}
            </span>
          )}
          <FormInput
            {...inputProps}
            ref={ref}
            id={id}
            required={required}
            aria-invalid={Boolean(error)}
            aria-describedby={descriptionIds}
            aria-errormessage={error ? messageId : undefined}
            className={twMerge(
              "min-h-12 rounded-m3-md px-4",
              leading && "ps-14",
              trailing && "pe-14",
              inputClassName,
            )}
          />
          {trailing && (
            <span className="absolute inset-y-0 end-1 z-10 flex items-center">
              {trailing}
            </span>
          )}
        </div>
        {(error || hint) && (
          <p
            id={messageId}
            role={error ? "alert" : undefined}
            className={twMerge(
              "mt-2 text-xs leading-relaxed",
              error ? "text-m3-error" : "text-m3-on-surface-variant",
            )}
          >
            {error ?? hint}
          </p>
        )}
        {footer}
      </div>
    );
  },
);

FormField.displayName = "FormField";

export default FormField;
