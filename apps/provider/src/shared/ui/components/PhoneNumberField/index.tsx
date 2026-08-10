import {
  forwardRef,
  type ChangeEvent,
  type ClipboardEvent,
} from "react";
import { twMerge } from "tailwind-merge";
import {
  constrainPhoneInput,
  getPhoneRegion,
  type PhoneRegionId,
} from "@/shared/lib/phone";
import Lucide from "@/shared/ui/components/Base/Lucide";
import FormField, {
  type FormFieldProps,
} from "@/shared/ui/components/FormField";

export interface PhoneNumberFieldProps
  extends Omit<
    FormFieldProps,
    | "type"
    | "dir"
    | "inputMode"
    | "leading"
    | "leadingClassName"
    | "leadingInteractive"
    | "maxLength"
    | "onChange"
    | "onPaste"
    | "value"
  > {
  region: PhoneRegionId;
  regionLabel: string;
  regionName: string;
  value: string;
  onValueChange: (value: string) => void;
  regionSelectorDisabled?: boolean;
  onRegionSelectRequest?: () => void;
}

const PhoneNumberField = forwardRef<HTMLInputElement, PhoneNumberFieldProps>(
  (
    {
      region,
      regionLabel,
      regionName,
      value,
      onValueChange,
      regionSelectorDisabled = true,
      onRegionSelectRequest,
      inputClassName,
      ...fieldProps
    },
    ref,
  ) => {
    const definition = getPhoneRegion(region);
    const selectorLabel = `${regionLabel}: ${regionName} ${definition.callingCode}`;

    const updateValue = (nextValue: string) => {
      onValueChange(constrainPhoneInput(nextValue, region));
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      updateValue(event.target.value);
    };

    const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
      const pastedValue = event.clipboardData.getData("text");
      if (!pastedValue) return;
      event.preventDefault();
      updateValue(pastedValue);
    };

    return (
      <FormField
        {...fieldProps}
        ref={ref}
        type="tel"
        dir="ltr"
        inputMode="numeric"
        value={value}
        maxLength={definition.maximumInputDigits}
        onChange={handleChange}
        onPaste={handlePaste}
        leadingInteractive
        leadingClassName="inset-y-px start-auto left-px"
        leading={
          <button
            type="button"
            dir="ltr"
            disabled={regionSelectorDisabled}
            onClick={onRegionSelectRequest}
            aria-label={selectorLabel}
            title={selectorLabel}
            className="m3-label-medium flex h-[46px] min-w-[6rem] items-center justify-center gap-1.5 rounded-s-m3-md border-e border-m3-outline/70 px-2.5 text-m3-on-surface disabled:cursor-not-allowed disabled:opacity-100"
          >
            <img
              src={definition.flagAsset}
              alt=""
              className="h-4 w-6 rounded-sm object-cover"
            />
            <bdi>{definition.callingCode}</bdi>
            <Lucide
              icon="ChevronDown"
              className="h-3.5 w-3.5 opacity-40"
              aria-hidden="true"
            />
          </button>
        }
        inputClassName={twMerge("ps-[6.75rem] text-left", inputClassName)}
      />
    );
  },
);

PhoneNumberField.displayName = "PhoneNumberField";

export default PhoneNumberField;
