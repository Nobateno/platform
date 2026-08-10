import "@/assets/css/vendors/tippy.css";
import { useEffect, useRef } from "react";
import tippy, {
  Instance,
  PopperElement,
  Props,
  roundArrow,
  animateFill as animateFillPlugin,
} from "tippy.js";
import clsx from "clsx";

type TippyProps<C extends React.ElementType> = PolymorphicComponentPropWithRef<
  C,
  {
    getRef?: (el: PopperElement | null) => void;
    content: string;
    as?: C;
    options?: Partial<Props>;
  }
>;

const init = (
  el: PopperElement,
  content: string,
  options?: Partial<Props>,
) => {
  return tippy(el, {
    plugins: [animateFillPlugin],
    content,
    arrow: roundArrow,
    popperOptions: {
      modifiers: [
        {
          name: "preventOverflow",
          options: {
            rootBoundary: "viewport",
          },
        },
      ],
    },
    animateFill: false,
    animation: "shift-away",
    ...options,
  });
};

const Tippy = <C extends React.ElementType = "span">({
  content,
  as,
  options,
  getRef,
  className,
  children,
  ...computedProps
}: TippyProps<C>) => {
  const tippyRef = useRef<PopperElement | null>(null);
  const instanceRef = useRef<Instance | null>(null);
  const latestContentRef = useRef(content);
  const Component = as || "span";
  const optionContent = options?.content;

  latestContentRef.current = content;

  useEffect(() => {
    const element = tippyRef.current;
    if (!element) return;

    getRef?.(element);
    return () => getRef?.(null);
  }, [Component, getRef]);

  useEffect(() => {
    const element = tippyRef.current;
    if (!element) return;

    const instance = init(
      element,
      latestContentRef.current,
      options,
    );
    instanceRef.current = instance;

    return () => {
      if (instanceRef.current === instance) {
        instanceRef.current = null;
      }
      instance.destroy();
    };
  }, [Component, options]);

  useEffect(() => {
    instanceRef.current?.setContent(optionContent ?? content);
  }, [content, optionContent]);

  return (
    <Component
      ref={tippyRef}
      className={clsx(["cursor-pointer", className])}
      {...computedProps}
    >
      {children}
    </Component>
  );
};

export default Tippy;
