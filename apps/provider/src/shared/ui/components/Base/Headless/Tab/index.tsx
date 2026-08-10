import { twMerge } from "tailwind-merge";
import { Tab as HeadlessTab, Transition } from "@headlessui/react";
import {
  Children,
  Fragment,
  cloneElement,
  createContext,
  forwardRef,
  isValidElement,
  useContext,
} from "react";

type Variant = "tabs" | "pills" | "boxed-tabs" | "link-tabs";

const tabContext = createContext<{
  selected: boolean;
  disabled: boolean;
}>({
  selected: false,
  disabled: false,
});

const listContext = createContext<{
  variant: Variant;
}>({
  variant: "tabs",
});

const TabControl = forwardRef<
  HTMLElement,
  {
    children: React.ReactNode;
    selected: boolean;
    disabled: boolean;
  }
>(({ children, selected, disabled, ...props }, ref) => {
  const child = Children.only(children);

  if (!isValidElement<Record<string, unknown>>(child)) return null;

  return (
    <tabContext.Provider value={{ selected, disabled }}>
      {cloneElement(child, { ...props, disabled, ref })}
    </tabContext.Provider>
  );
});

TabControl.displayName = "TabControl";

function Tab({
  children,
  className,
  fullWidth = true,
  ...props
}: Omit<
  ExtractProps<typeof HeadlessTab> & {
    fullWidth?: boolean;
  },
  "ref"
>) {
  const list = useContext(listContext);
  return (
    <li
      role="presentation"
      className={twMerge([
        fullWidth && "flex-1",
        list.variant == "tabs" && "-mb-px",
        className,
      ])}
    >
      <HeadlessTab as={Fragment} {...props}>
        {(tabProps) => (
          <TabControl
            selected={tabProps.selected}
            disabled={tabProps.disabled}
          >
            {typeof children === "function" ? children(tabProps) : children}
          </TabControl>
        )}
      </HeadlessTab>
    </li>
  );
}

Tab.Button = <C extends React.ElementType = "a">({
  children,
  className,
  as,
  ...props
}: {
  as?: C;
} & React.PropsWithChildren &
  React.ComponentPropsWithoutRef<C>) => {
  const tab = useContext(tabContext);
  const list = useContext(listContext);
  const Component = as || "a";

  return (
    <Component
      type={Component === "button" ? "button" : undefined}
      className={twMerge([
        "cursor-pointer block appearance-none px-3 py-2 border border-transparent text-slate-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-400",
        tab.selected && "text-slate-700 dark:text-white",

        // Default
        list.variant == "tabs" &&
          "block border-transparent rounded-t-md dark:border-transparent",
        list.variant == "tabs" &&
          tab.selected &&
          "bg-white border-slate-200 border-b-transparent font-medium dark:bg-transparent dark:border-t-darkmode-400 dark:border-b-darkmode-600 dark:border-x-darkmode-400",
        list.variant == "tabs" &&
          !tab.selected &&
          "hover:bg-slate-100 dark:hover:bg-darkmode-400 dark:hover:border-transparent",

        // Pills
        list.variant == "pills" && "rounded-md border-0",
        list.variant == "pills" &&
          tab.selected &&
          "bg-primary text-white font-medium",

        // Boxed tabs
        list.variant == "boxed-tabs" &&
          "rounded-md py-1.5 dark:border-transparent",
        list.variant == "boxed-tabs" &&
          tab.selected &&
          "text-slate-700 border shadow-sm font-medium border-slate-200 bg-white dark:text-slate-300 dark:bg-darkmode-400 dark:border-darkmode-400",

        // Link tabs
        list.variant == "link-tabs" &&
          "border-b-2 border-transparent dark:border-transparent",
        list.variant == "link-tabs" &&
          tab.selected &&
          "border-b-primary font-medium dark:border-b-primary",

        className,
      ])}
      {...props}
    >
      {children}
    </Component>
  );
};

Tab.Group = ({
  children,
  ...props
}: ExtractProps<typeof HeadlessTab.Group>) => {
  return (
    <HeadlessTab.Group as="div" {...props}>
      {children}
    </HeadlessTab.Group>
  );
};

Tab.List = ({
  children,
  className,
  variant = "tabs",
  ...props
}: ExtractProps<typeof HeadlessTab.List> & {
  variant?: Variant;
}) => {
  return (
    <listContext.Provider
      value={{
        variant: variant,
      }}
    >
      <HeadlessTab.List
        as="ul"
        className={twMerge([
          variant == "tabs" &&
            "border-b border-slate-200 dark:border-darkmode-400",
          variant == "boxed-tabs" &&
            "p-0.5 border bg-slate-50/70 border-slate-200/70 rounded-lg dark:border-darkmode-400",
          "w-full flex",
          className,
        ])}
        {...props}
      >
        {children}
      </HeadlessTab.List>
    </listContext.Provider>
  );
};

Tab.Panels = ({
  children,
  className,
  ...props
}: ExtractProps<typeof HeadlessTab.Panels>) => {
  return (
    <HeadlessTab.Panels as="div" className={className} {...props}>
      {children}
    </HeadlessTab.Panels>
  );
};

Tab.Panel = ({
  children,
  className,
  ...props
}: ExtractProps<typeof HeadlessTab.Panel>) => {
  return (
    <HeadlessTab.Panel as={Fragment}>
      {(panelProps) => (
        <Transition
          appear
          as="div"
          show={panelProps.selected}
          enter="transition-opacity duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          className={className}
          {...props}
        >
          <>
            {typeof children === "function"
              ? children(panelProps)
              : children}
          </>
        </Transition>
      )}
    </HeadlessTab.Panel>
  );
};

export default Tab;
