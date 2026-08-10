import "@/assets/css/vendors/tiny-slider.css";
import { useContext, useLayoutEffect, useRef } from "react";
import { destroy, init } from "./tiny-slider";
import {
  TinySliderInstance,
  TinySliderSettings,
} from "tiny-slider/src/tiny-slider";
import clsx from "clsx";
import { DirectionContext } from "@/shared/lib/utils/direction-context";

export interface TinySliderElement extends HTMLDivElement {
  tns?: TinySliderInstance;
}

export interface TinySliderProps
  extends React.PropsWithChildren,
    React.ComponentPropsWithoutRef<"div"> {
  getRef?: (el: TinySliderElement) => void;
  options: TinySliderSettings;
}

function TinySlider({
  options = {},
  getRef = () => {},
  className = "",
  children,
  ...computedProps
}: TinySliderProps) {
  const locale = useContext(DirectionContext);
  const language = locale?.language ?? "fa";
  const sliderRef = useRef<TinySliderElement | null>(null);
  const getRefRef = useRef(getRef);
  const optionsRef = useRef(options);
  const optionsSignature = JSON.stringify(options);

  getRefRef.current = getRef;
  optionsRef.current = options;

  useLayoutEffect(() => {
    const element = sliderRef.current;
    if (!element) return;

    const runtimeProps: TinySliderProps = {
      options: optionsRef.current,
      getRef: (sliderElement) => getRefRef.current(sliderElement),
    };
    runtimeProps.getRef?.(element);
    init(element, runtimeProps);

    return () => {
      destroy(element);
    };
  }, [language, optionsSignature]);

  return (
    <div
      {...computedProps}
      ref={sliderRef}
      className={clsx(["tiny-slider", className])}
      dir={locale?.direction ?? "rtl"}
    >
      {children}
    </div>
  );
}

export default TinySlider;
