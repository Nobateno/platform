import FormCheck, { FormCheckProps, LabelProps } from "../FormCheck";
import { twMerge } from "tailwind-merge";

function FormSwitch(props: FormCheckProps) {
  return <FormCheck {...props}>{props.children}</FormCheck>;
}

FormSwitch.Label = (props: LabelProps) => {
  return <FormCheck.Label {...props}>{props.children}</FormCheck.Label>;
};

interface InputProps extends React.ComponentPropsWithoutRef<"input"> {
  type: "checkbox";
}

FormSwitch.Input = (props: InputProps) => {
  return (
    <FormCheck.Input
      {...props}
      className={twMerge([
        // Default
        "w-[38px] h-[24px] p-px rounded-full relative",
        "border-m3-outline bg-m3-surface-variant before:w-[20px] before:h-[20px] before:bg-m3-outline before:transition-[margin-inline-start,background-color] before:duration-200 before:ease-in-out before:absolute before:inset-y-0 before:my-auto before:rounded-full",

        // On checked
        "checked:bg-primary checked:border-primary checked:bg-none",
        "before:checked:ms-[14px] before:checked:bg-m3-on-primary",

        props.className,
      ])}
    />
  );
};

export default FormSwitch;
