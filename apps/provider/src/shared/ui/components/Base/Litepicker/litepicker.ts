import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import Litepicker from "litepicker";
import { LitepickerElement, LitepickerProps } from "./index";

dayjs.extend(customParseFormat);

const LitepickerConstructor =
  (
    Litepicker as unknown as {
      default?: typeof Litepicker;
      Litepicker?: typeof Litepicker;
    }
  ).default ??
  (Litepicker as unknown as { Litepicker?: typeof Litepicker }).Litepicker ??
  Litepicker;

const getDateFormat = (format: string | undefined) => {
  return format !== undefined ? format : "D MMM, YYYY";
};

const parseValue = (
  value: string | undefined,
  props: LitepickerProps,
  locale: string,
) => {
  if (!value) return [];

  const format = getDateFormat(props.options.format);
  const delimiter = props.options.delimiter ?? " - ";

  return value.split(delimiter).map((dateValue) =>
    dayjs(dateValue.trim(), format, locale, true),
  );
};

const setValue = (
  element: LitepickerElement,
  props: LitepickerProps,
  locale: string,
) => {
  const format = getDateFormat(props.options.format);
  const delimiter = props.options.delimiter ?? " - ";
  if (props.value !== undefined && !props.value.length) {
    let date = dayjs().locale(locale).format(format);
    date +=
      !props.options.singleMode && props.options.singleMode !== undefined
        ? delimiter +
          dayjs().add(1, "month").locale(locale).format(format)
        : "";
    props.value = date;
    element.value = date;
    props.onChange({
      target: {
        value: date,
      },
    });
  }
};

const init = (
  el: LitepickerElement,
  props: LitepickerProps,
  locale: string,
) => {
  const format = getDateFormat(props.options.format);
  const delimiter = props.options.delimiter ?? " - ";
  const [parsedStartDate, parsedEndDate] = parseValue(
    props.value,
    props,
    locale,
  );
  const initialDates = parsedStartDate?.isValid()
    ? {
        startDate:
          props.options.startDate ?? parsedStartDate.toDate(),
        ...(parsedEndDate?.isValid()
          ? {
              endDate:
                props.options.endDate ?? parsedEndDate.toDate(),
            }
          : {}),
      }
    : {};

  el.litePickerInstance = new LitepickerConstructor({
    ...props.options,
    ...initialDates,
    element: el,
    format: format,
    setup: (picker) => {
      if (picker.on) {
        picker.on("selected", (startDate, endDate) => {
          let date = dayjs(startDate.dateInstance)
            .locale(locale)
            .format(format);
          date +=
            endDate !== undefined
              ? delimiter +
                dayjs(endDate.dateInstance).locale(locale).format(format)
              : "";
          props.onChange({
            target: {
              value: date,
            },
          });
        });
      }
    },
  });
};

const localizeValue = (
  value: string,
  props: LitepickerProps,
  previousLocale: string,
  nextLocale: string,
) => {
  const format = getDateFormat(props.options.format);
  const delimiter = props.options.delimiter ?? " - ";

  return value
    .split(delimiter)
    .map((dateValue) => {
      const parsedDate = dayjs(
        dateValue.trim(),
        format,
        previousLocale,
        true,
      );

      return parsedDate.isValid()
        ? parsedDate.locale(nextLocale).format(format)
        : dateValue;
    })
    .join(delimiter);
};

export { setValue, init, localizeValue };
