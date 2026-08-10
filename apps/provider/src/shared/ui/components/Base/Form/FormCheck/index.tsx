import { twMerge } from "tailwind-merge";

export type FormCheckProps = React.PropsWithChildren &
  React.ComponentPropsWithoutRef<"div">;

function FormCheck(props: FormCheckProps) {
  return (
    <div {...props} className={twMerge(["flex items-center", props.className])}>
      {props.children}
    </div>
  );
}

export type LabelProps = React.PropsWithChildren &
  React.ComponentPropsWithoutRef<"label">;

FormCheck.Label = (props: LabelProps) => {
  return (
    <label
      {...props}
      className={twMerge(["cursor-pointer ms-2", props.className])}
    >
      {props.children}
    </label>
  );
};

interface InputProps extends React.ComponentPropsWithoutRef<"input"> {
  type: "radio" | "checkbox";
}

FormCheck.Input = (props: InputProps) => {
  return (
    <input
      {...props}
      className={twMerge([
        // Default
        "transition-all duration-100 ease-in-out",

        // Input type radio
        props.type == "radio" &&
          "shadow-none border-m3-outline cursor-pointer text-m3-primary focus:ring-4 focus:ring-offset-0 focus:ring-primary/20 dark:bg-m3-surface dark:border-m3-outline",

        // Input type checkbox
        props.type == "checkbox" &&
          "shadow-none border-m3-outline cursor-pointer rounded-m3-xs text-m3-primary focus:ring-4 focus:ring-offset-0 focus:ring-primary/20 dark:bg-m3-surface dark:border-m3-outline",

        // On checked
        "[&[type='radio']]:checked:bg-m3-primary [&[type='radio']]:checked:border-m3-primary",
        "[&[type='checkbox']]:checked:bg-m3-primary [&[type='checkbox']]:checked:border-m3-primary",

        // On checked and not disabled
        "[&:disabled:not(:checked)]:bg-slate-100 [&:disabled:not(:checked)]:cursor-not-allowed [&:disabled:not(:checked)]:dark:bg-darkmode-800/50",

        // On checked and disabled
        "[&:disabled:checked]:opacity-70 [&:disabled:checked]:cursor-not-allowed [&:disabled:checked]:dark:bg-darkmode-800/50",
        props.className,
      ])}
    />
  );
};

export default FormCheck;
