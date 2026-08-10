import "@/assets/css/vendors/litepicker.css";
import { useContext, useEffect, useRef } from "react";
import { setValue, init, localizeValue } from "./litepicker";
import LitepickerJs from "litepicker";
import { FormInput } from "@/shared/ui/components/Base/Form";
import { ILPConfiguration } from "litepicker/dist/types/interfaces";
import { getLanguageOption } from "@/shared/i18n";
import {
  DirectionContext,
  getDayjsLocale,
} from "@/shared/lib/utils/direction-context";

export interface LitepickerElement extends HTMLInputElement {
  litePickerInstance: LitepickerJs;
}

type LitepickerConfig = Partial<ILPConfiguration>;

export interface LitepickerProps
  extends React.PropsWithChildren,
    Omit<React.ComponentPropsWithoutRef<"input">, "onChange"> {
  options: {
    format?: string | undefined;
  } & LitepickerConfig;
  onChange: (e: {
    target: {
      value: string;
    };
  }) => void;
  value?: string;
  getRef?: (el: LitepickerElement) => void;
}

function Litepicker({
  options = {},
  value = "",
  onChange = () => {},
  getRef = () => {},
  ...computedProps
}: LitepickerProps) {
  const locale = useContext(DirectionContext);
  const language = locale?.language ?? "fa";
  const dayjsLocale = getDayjsLocale(language);
  const pickerLanguage = getLanguageOption(language).documentLanguage;
  const localizedOptions = {
    ...options,
    lang: options.lang ?? pickerLanguage,
  };
  const optionsSignature = JSON.stringify(localizedOptions);
  const litepickerRef = useRef<LitepickerElement | null>(null);
  const onChangeRef = useRef(onChange);
  const getRefRef = useRef(getRef);
  const optionsRef = useRef(localizedOptions);
  const previousLocaleRef = useRef(dayjsLocale);

  onChangeRef.current = onChange;
  getRefRef.current = getRef;
  optionsRef.current = localizedOptions;

  useEffect(() => {
    const element = litepickerRef.current;
    if (!element) return;

    const previousLocale = previousLocaleRef.current;
    const runtimeProps: LitepickerProps = {
      options: optionsRef.current,
      value,
      onChange: (event) => onChangeRef.current(event),
      getRef: (pickerElement) => getRefRef.current(pickerElement),
    };

    runtimeProps.getRef?.(element);

    if (previousLocale !== dayjsLocale && runtimeProps.value) {
      const localizedValue = localizeValue(
        runtimeProps.value,
        runtimeProps,
        previousLocale,
        dayjsLocale,
      );

      if (localizedValue !== runtimeProps.value) {
        runtimeProps.value = localizedValue;
        element.value = localizedValue;
        runtimeProps.onChange({
          target: { value: localizedValue },
        });
      }
    }

    setValue(element, runtimeProps, dayjsLocale);
    init(element, runtimeProps, dayjsLocale);
    previousLocaleRef.current = dayjsLocale;

    return () => {
      element.litePickerInstance?.destroy();
    };
  }, [dayjsLocale, optionsSignature, value]);

  return (
    <FormInput
      ref={litepickerRef}
      type="text"
      value={value}
      onChange={(e) => {
        onChangeRef.current(e);
      }}
      {...computedProps}
    />
  );
}

export default Litepicker;
