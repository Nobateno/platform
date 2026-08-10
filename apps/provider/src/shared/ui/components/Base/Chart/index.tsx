import { useEffect, useRef } from "react";
import ChartJs, { type ChartConfiguration } from "chart.js/auto";

export interface ChartElement extends HTMLCanvasElement {
  instance: ChartJs;
}

export interface ChartProps
  extends React.ComponentPropsWithoutRef<"canvas">,
    ChartConfiguration {
  width?: number | "auto";
  height?: number | "auto";
  getRef?: (el: ChartElement | null) => void;
}

const toCssDimension = (value: number | "auto") =>
  value === "auto" ? value : `${value}px`;

const getDataLabel = (data: ChartConfiguration["data"]) => {
  const datasetLabel = data.datasets
    .map((dataset) => dataset.label)
    .find((label): label is string => Boolean(label));

  if (datasetLabel) return datasetLabel;

  const labels = data.labels
    ?.slice(0, 3)
    .map((label) => String(label))
    .filter(Boolean);

  return labels?.join(", ");
};

function Chart({
  type = "line",
  data = { datasets: [] },
  options = {},
  width = "auto",
  height = "auto",
  getRef,
  className = "",
  ...canvasProps
}: ChartProps) {
  const canvasRef = useRef<ChartElement | null>(null);
  const instanceRef = useRef<ChartJs | null>(null);
  const getRefCallback = useRef(getRef);
  const dataRef = useRef(data);
  const optionsRef = useRef(options);
  const appliedConfigurationRef = useRef({ data, options });

  getRefCallback.current = getRef;
  dataRef.current = data;
  optionsRef.current = options;

  useEffect(() => {
    const element = canvasRef.current;
    const context = element?.getContext("2d");
    if (!element || !context) return;

    const instance = new ChartJs(context, {
      type,
      data: dataRef.current,
      options: optionsRef.current,
    });
    appliedConfigurationRef.current = {
      data: dataRef.current,
      options: optionsRef.current,
    };
    instanceRef.current = instance;
    element.instance = instance;
    getRefCallback.current?.(element);

    return () => {
      getRefCallback.current?.(null);
      instance.destroy();
      instanceRef.current = null;
    };
  }, [type]);

  useEffect(() => {
    const instance = instanceRef.current;
    if (!instance) return;
    if (
      appliedConfigurationRef.current.data === data &&
      appliedConfigurationRef.current.options === options
    ) {
      return;
    }

    instance.data = data;
    instance.options = options;
    instance.update();
    appliedConfigurationRef.current = { data, options };
  }, [data, options]);

  const accessibleLabel = canvasProps["aria-label"] ?? getDataLabel(data);

  return (
    <div
      style={{
        width: toCssDimension(width),
        height: toCssDimension(height),
      }}
    >
      <canvas
        {...canvasProps}
        ref={canvasRef}
        className={className}
        role={canvasProps.role ?? "img"}
        aria-label={accessibleLabel}
      >
        {accessibleLabel}
      </canvas>
    </div>
  );
}

export default Chart;
