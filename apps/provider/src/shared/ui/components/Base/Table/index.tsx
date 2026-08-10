import { twMerge } from "tailwind-merge";
import { createContext, useContext } from "react";

export interface TableProps
  extends React.PropsWithChildren,
    React.ComponentPropsWithoutRef<"table"> {
  dark?: boolean;
  bordered?: boolean;
  hover?: boolean;
  striped?: boolean;
  sm?: boolean;
}

const tableContext = createContext<{
  dark: TableProps["dark"];
  bordered: TableProps["bordered"];
  hover: TableProps["hover"];
  striped: TableProps["striped"];
  sm: TableProps["sm"];
}>({
  dark: false,
  bordered: false,
  hover: false,
  striped: false,
  sm: false,
});
function Table({
  className,
  dark,
  bordered,
  hover,
  striped,
  sm,
  ...props
}: TableProps) {
  return (
    <tableContext.Provider
      value={{
        dark: dark,
        bordered: bordered,
        hover: hover,
        striped: striped,
        sm: sm,
      }}
    >
      <table
        className={twMerge([
          "w-full text-start",
          dark && "bg-dark text-white dark:bg-black/30",
          className,
        ])}
        {...props}
      >
        {props.children}
      </table>
    </tableContext.Provider>
  );
}

interface TheadProps
  extends React.PropsWithChildren,
    React.ComponentPropsWithoutRef<"thead"> {
  variant?: "default" | "light" | "dark";
}

const theadContext = createContext<{
  variant: TheadProps["variant"];
}>({
  variant: "default",
});
Table.Thead = ({ className, ...props }: TheadProps) => {
  return (
    <theadContext.Provider
      value={{
        variant: props.variant,
      }}
    >
      <thead
        className={twMerge([
          props.variant === "light" && "bg-slate-200/60 dark:bg-slate-200",
          props.variant === "dark" && "bg-dark text-white dark:bg-black/30",
          className,
        ])}
        {...props}
      >
        {props.children}
      </thead>
    </theadContext.Provider>
  );
};

type TbodyProps = React.PropsWithChildren<
  React.ComponentPropsWithoutRef<"tbody">
>;

Table.Tbody = ({ className, ...props }: TbodyProps) => {
  return <tbody className={className}>{props.children}</tbody>;
};

type TrProps = React.PropsWithChildren & React.ComponentPropsWithoutRef<"tr">;

Table.Tr = ({ className, ...props }: TrProps) => {
  const table = useContext(tableContext);
  return (
    <tr
      className={twMerge([
        table.hover &&
          "[&:hover_td]:bg-m3-surface-container-low",
        table.striped &&
          "[&:nth-of-type(odd)_td]:bg-m3-surface-container-low",
        className,
      ])}
      {...props}
    >
      {props.children}
    </tr>
  );
};

type ThProps = React.PropsWithChildren & React.ComponentPropsWithoutRef<"th">;

Table.Th = ({ className, ...props }: ThProps) => {
  const table = useContext(tableContext);
  const thead = useContext(theadContext);
  return (
    <th
      className={twMerge([
        "m3-title-small px-5 py-3 border-b border-m3-outline-variant",
        thead.variant === "light" && "border-b-0 text-slate-700",
        thead.variant === "dark" && "border-b-0",
        table.dark && "border-slate-600 dark:border-darkmode-300",
        table.bordered && "border-l border-r border-t",
        table.sm && "px-4 py-2",
        className,
      ])}
      {...props}
    >
      {props.children}
    </th>
  );
};

type TdProps = React.PropsWithChildren & React.ComponentPropsWithoutRef<"td">;

Table.Td = ({ className, ...props }: TdProps) => {
  const table = useContext(tableContext);
  return (
    <td
      className={twMerge([
        "m3-body-medium px-5 py-3 border-b border-m3-outline-variant",
        table.dark && "border-slate-600 dark:border-darkmode-300",
        table.bordered && "border-l border-r border-t",
        table.sm && "px-4 py-2",
        className,
      ])}
      {...props}
    >
      {props.children}
    </td>
  );
};

export default Table;
