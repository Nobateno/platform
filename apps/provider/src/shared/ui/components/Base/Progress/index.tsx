import { twMerge } from "tailwind-merge";

type ProgressProps = React.PropsWithChildren &
  Omit<React.ComponentPropsWithoutRef<"div">, "role"> & {
    value?: number;
    min?: number;
    max?: number;
  };

function Progress({ value, min = 0, max = 100, ...props }: ProgressProps) {
  const normalizedValue =
    value === undefined ? undefined : Math.min(max, Math.max(min, value));

  return (
    <div
      {...props}
      role="progressbar"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={normalizedValue}
      className={twMerge([
        "w-full h-1 bg-m3-surface-container-highest rounded-full overflow-hidden",
        props.className,
      ])}
    >
      {props.children}
    </div>
  );
}

type BarProps = React.PropsWithChildren & React.ComponentPropsWithoutRef<"div">;

Progress.Bar = (props: BarProps) => {
  return (
    <div
      {...props}
      className={twMerge([
        "bg-m3-primary h-full rounded-full text-xs text-m3-on-primary flex justify-center items-center",
        props.className,
      ])}
    >
      {props.children}
    </div>
  );
};

export default Progress;
