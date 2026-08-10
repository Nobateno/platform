import Chart from "@/shared/ui/components/Base/Chart";
import type { ChartData, ChartOptions } from "chart.js/auto";
import { getColor } from "@/shared/lib/utils/colors";
import { useMemo } from "react";
import { useTheme } from "@/shared/ui/theme-context";

interface MainProps extends React.ComponentPropsWithoutRef<"canvas"> {
  width?: number | "auto";
  height?: number | "auto";
  labels: [string, string];
}

function Main({
  width = "auto",
  height = "auto",
  className = "",
  labels,
  ...canvasProps
}: MainProps) {
  const props = {
    width: width,
    height: height,
    className: className,
  };
  // Subscribe to theme changes before reading the resolved CSS token colors.
  useTheme();

  const dangerColor = getColor("danger", 0.6);
  const secondaryColor = getColor("theme.2", 0.6);
  const data: ChartData = useMemo(() => {
    return {
      labels,
      datasets: [
        {
          data: [35, 65],
          backgroundColor: [dangerColor, secondaryColor],
          hoverBackgroundColor: [dangerColor, secondaryColor],
          borderWidth: 1,
          borderColor: [dangerColor, secondaryColor],
        },
      ],
    };
  }, [dangerColor, labels, secondaryColor]);

  const options: ChartOptions = useMemo(() => {
    return {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      cutout: "89%",
      rotation: -90,
      circumference: 180,
    };
  }, []);

  return (
    <Chart
      {...canvasProps}
      type="doughnut"
      width={props.width}
      height={props.height}
      data={data}
      options={options}
      className={props.className}
    />
  );
}

export default Main;
