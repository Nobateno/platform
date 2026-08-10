import { twMerge } from "tailwind-merge";
import { Menu as HeadlessMenu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import clsx from "clsx";

function Menu({
  children,
  className,
  ...props
}: ExtractProps<typeof HeadlessMenu>) {
  return (
    <HeadlessMenu
      as="div"
      className={twMerge(["relative", className])}
      {...props}
    >
      {children}
    </HeadlessMenu>
  );
}

Menu.Button = <C extends React.ElementType = "div">({
  as,
  children,
  className,
  ...props
}: ExtractProps<typeof HeadlessMenu.Button> & {
  as?: C;
} & React.ComponentPropsWithRef<C>) => {
  return (
    <HeadlessMenu.Button
      as={as}
      className={twMerge(["cursor-pointer", className])}
      {...props}
    >
      {children}
    </HeadlessMenu.Button>
  );
};

Menu.Items = ({
  children,
  className,
  placement = "bottom-end",
  ...props
}: ExtractProps<typeof HeadlessMenu.Items> & {
  placement?:
    | "top-start"
    | "top"
    | "top-end"
    | "right-start"
    | "right"
    | "right-end"
    | "bottom-end"
    | "bottom"
    | "bottom-start"
    | "left-start"
    | "left"
    | "left-end";
}) => {
  return (
    <Transition
      as={Fragment}
      enter="transition-all ease-linear duration-150"
      enterFrom="mt-5 invisible opacity-0 translate-y-1"
      enterTo="mt-1 visible opacity-100 translate-y-0"
      leave="transition-all ease-linear duration-150"
      leaveFrom="mt-1 visible opacity-100 translate-y-0"
      leaveTo="mt-5 invisible opacity-0 translate-y-1"
    >
      <div
        className={clsx([
          "absolute z-30",
          placement == "top-start" && "start-0 bottom-[100%]",
          placement == "top" && "start-[50%] translate-x-[-50%] bottom-[100%]",
          placement == "top-end" && "end-0 bottom-[100%]",
          placement == "right-start" && "start-[100%] translate-y-[-50%]",
          placement == "right" && "start-[100%] top-[50%] translate-y-[-50%]",
          placement == "right-end" && "start-[100%] bottom-0",
          placement == "bottom-end" && "top-[100%] end-0",
          placement == "bottom" && "top-[100%] start-[50%] translate-x-[-50%]",
          placement == "bottom-start" && "top-[100%] start-0",
          placement == "left-start" && "end-[100%] translate-y-[-50%]",
          placement == "left" && "end-[100%] top-[50%] translate-y-[-50%]",
          placement == "left-end" && "end-[100%] bottom-0",
        ])}
      >
        <HeadlessMenu.Items
          as="div"
          className={twMerge([
            "p-2 shadow-m3-2 bg-m3-surface text-m3-on-surface border border-m3-outline-variant rounded-m3-md",
            className,
          ])}
          {...props}
        >
          {children}
        </HeadlessMenu.Items>
      </div>
    </Transition>
  );
};

Menu.Item = <C extends React.ElementType = "a">({
  as,
  children,
  className,
  ...props
}: ExtractProps<typeof HeadlessMenu.Item> & {
  as?: C;
} & React.ComponentPropsWithRef<C>) => {
  return (
    <HeadlessMenu.Item
      as={as ?? "a"}
      className={twMerge([
        "m3-label-large cursor-pointer flex items-center p-2 transition-colors duration-200 ease-in-out rounded-m3-sm hover:bg-m3-primary/10",
        className,
      ])}
      {...props}
    >
      {children}
    </HeadlessMenu.Item>
  );
};

Menu.Divider = (props: React.ComponentPropsWithoutRef<"div">) => {
  return (
    <div
      className={twMerge([
        "h-px my-2 -mx-2 bg-m3-outline-variant",
        props.className,
      ])}
    ></div>
  );
};

Menu.Header = (
  props: React.PropsWithChildren & React.ComponentPropsWithoutRef<"div">
) => {
  return (
    <div className={twMerge(["p-2 font-medium", props.className])}>
      {props.children}
    </div>
  );
};

Menu.Footer = (
  props: React.PropsWithChildren & React.ComponentPropsWithoutRef<"div">
) => {
  return (
    <div className={twMerge(["flex p-1", props.className])}>
      {props.children}
    </div>
  );
};

export default Menu;
