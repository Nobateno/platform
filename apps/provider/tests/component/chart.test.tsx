import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Chart from "@/shared/ui/components/Base/Chart";

const chartMocks = vi.hoisted(() => ({
  construct: vi.fn(),
  destroy: vi.fn(),
  update: vi.fn(),
}));

vi.mock("chart.js/auto", () => ({
  default: class ChartMock {
    data: unknown;
    options: unknown;

    constructor(_context: unknown, configuration: { data: unknown; options: unknown }) {
      this.data = configuration.data;
      this.options = configuration.options;
      chartMocks.construct(configuration);
    }

    destroy = chartMocks.destroy;
    update = chartMocks.update;
  },
}));

describe("Chart", () => {
  it("uses valid dimensions, updates data, and destroys its instance", () => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
      {} as CanvasRenderingContext2D,
    );
    const getRef = vi.fn();
    const firstData = {
      labels: ["Mon"],
      datasets: [{ label: "Reservations", data: [4] }],
    };
    const secondData = {
      labels: ["Mon"],
      datasets: [{ label: "Reservations", data: [8] }],
    };

    const view = render(
      <Chart
        type="line"
        data={firstData}
        options={{ responsive: true }}
        width="auto"
        height={240}
        aria-label="Reservation chart"
        getRef={getRef}
      />,
    );

    const canvas = screen.getByRole("img", { name: "Reservation chart" });
    expect(canvas.parentElement).toHaveStyle({ width: "auto", height: "240px" });
    expect(chartMocks.construct).toHaveBeenCalledTimes(1);
    expect(chartMocks.update).not.toHaveBeenCalled();
    expect(getRef).toHaveBeenCalledWith(canvas);

    view.rerender(
      <Chart
        type="line"
        data={secondData}
        options={{ responsive: false }}
        width="auto"
        height={240}
        aria-label="Reservation chart"
        getRef={getRef}
      />,
    );

    expect(chartMocks.update).toHaveBeenCalled();
    view.unmount();
    expect(chartMocks.destroy).toHaveBeenCalledTimes(1);
    expect(getRef).toHaveBeenLastCalledWith(null);
  });
});
