import "@/assets/css/vendors/tom-select.css";
import { useEffect, useMemo, useRef } from "react";
import { setValue, init, updateValue } from "./tom-select";
import TomSelectPlugin from "tom-select";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { normalizeLanguage } from "@/shared/i18n";

export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends object ? RecursivePartial<T[P]> : T[P];
};
export type TomSettings = NonNullable<
  ConstructorParameters<typeof TomSelectPlugin>[1]
>;

export interface TomSelectElement extends HTMLSelectElement {
  TomSelect: TomSelectPlugin;
}

export interface TomSelectProps<T extends string | string[] = string | string[]>
  extends React.PropsWithChildren,
    Omit<React.ComponentPropsWithoutRef<"select">, "onChange"> {
  value: T;
  onOptionAdd?: (value: string) => void;
  onChange: (e: {
    target: {
      value: T;
    };
  }) => void;
  options?: RecursivePartial<TomSettings>;
  getRef?: (el: TomSelectElement) => void;
}

function TomSelect<T extends string | string[]>({
  className = "",
  options = {},
  value,
  onOptionAdd = () => {},
  onChange = () => {},
  getRef = () => {},
  children,
  ...computedProps
}: TomSelectProps<T>) {
  const { t, i18n } = useTranslation("sharedUi");
  const language = normalizeLanguage(
    i18n.resolvedLanguage ?? i18n.language,
  );
  const props = {
    className: className,
    options: options,
    value: value,
    onOptionAdd: onOptionAdd,
    onChange: onChange,
    getRef: getRef,
  };
  const isMultipleValue = Array.isArray(props.value);
  const tomSelectRef = useRef<TomSelectElement | null>(null);
  const clonedElementRef = useRef<TomSelectElement | null>(null);

  // Compute all default options
  const computedOptions = useMemo(() => {
    let options: TomSelectProps<T>["options"] = {
      ...props.options,
      plugins: {
        dropdown_input: {},
        ...props.options.plugins,
      },
    };

    if (isMultipleValue) {
      options = {
        persist: false,
        create: true,
        onDelete: function (values: string[]) {
          return confirm(
            values.length > 1
              ? t("selection.removeMany", { count: values.length })
              : t("selection.removeOne", { value: values[0] })
          );
        },
        ...options,
        plugins: {
          remove_button: {
            title: t("selection.removeItem"),
          },
          ...options.plugins,
        },
      };
    }

    return options;
  }, [isMultipleValue, props.options, t]);

  const optionsSignature = JSON.stringify({
    language,
    multiple: isMultipleValue,
    options: props.options,
  });
  const propsRef = useRef(props);
  const computedOptionsRef = useRef(computedOptions);

  propsRef.current = props;
  computedOptionsRef.current = computedOptions;

  useEffect(() => {
    const originalElement = tomSelectRef.current;
    if (!originalElement?.parentNode) return;

    const runtimeProps = propsRef.current;
    const wasHidden = originalElement.hasAttribute("hidden");
    const dataId =
      originalElement.getAttribute("data-id") ??
      `_${Math.random().toString(36).slice(2, 11)}`;
    originalElement.setAttribute("data-id", dataId);
    runtimeProps.getRef(originalElement);

    // Tom Select mutates its target, so initialize it on a managed clone and
    // leave React's original select as the source of truth.
    const clonedElement = originalElement.cloneNode(true) as TomSelectElement;
    const classNames = originalElement.getAttribute("class");
    if (classNames) {
      clonedElement.setAttribute("data-initial-class", classNames);
    }
    originalElement.parentNode.appendChild(clonedElement);
    originalElement.setAttribute("hidden", "true");
    clonedElementRef.current = clonedElement;

    setValue(clonedElement, runtimeProps);
    init(
      originalElement,
      clonedElement,
      runtimeProps,
      computedOptionsRef.current,
    );

    return () => {
      clonedElement.TomSelect?.destroy();
      clonedElement.remove();
      clonedElementRef.current = null;
      if (!wasHidden) {
        originalElement.removeAttribute("hidden");
      }
    };
  }, [language, optionsSignature]);

  useEffect(() => {
    const originalElement = tomSelectRef.current;
    const clonedElement = clonedElementRef.current;
    if (!originalElement || !clonedElement?.TomSelect) return;

    const runtimeProps = propsRef.current;
    runtimeProps.getRef(originalElement);
    updateValue(
      originalElement,
      clonedElement,
      runtimeProps.value,
      runtimeProps,
      computedOptionsRef.current,
    );
  });

  return (
    <select
      {...computedProps}
      ref={tomSelectRef}
      value={props.value}
      onChange={(e) => {
        if (props.onChange) {
          props.onChange({
            target: {
              value: e.target.value as T,
            },
          });
        }
      }}
      className={clsx(["tom-select", props.className])}
    >
      {children}
    </select>
  );
}

export default TomSelect;
