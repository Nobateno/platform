import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Tippy from "@/shared/ui/components/Base/Tippy";

const tippyMocks = vi.hoisted(() => ({
  create: vi.fn(),
  destroy: vi.fn(),
  setContent: vi.fn(),
}));

vi.mock("tippy.js", () => ({
  default: tippyMocks.create,
  roundArrow: "round-arrow",
  animateFill: { name: "animateFill" },
}));

describe("Tippy lifecycle", () => {
  it("updates content on one instance and destroys it on unmount", () => {
    tippyMocks.create.mockReturnValue({
      destroy: tippyMocks.destroy,
      setContent: tippyMocks.setContent,
    });
    const getRef = vi.fn();
    const options = { placement: "bottom" as const };
    const view = render(
      <Tippy data-testid="tooltip-reference" content="First" options={options} getRef={getRef}>
        Target
      </Tippy>,
    );

    const reference = screen.getByTestId("tooltip-reference");
    expect(tippyMocks.create).toHaveBeenCalledTimes(1);
    expect(getRef).toHaveBeenCalledWith(reference);

    view.rerender(
      <Tippy data-testid="tooltip-reference" content="Second" options={options} getRef={getRef}>
        Target
      </Tippy>,
    );

    expect(tippyMocks.create).toHaveBeenCalledTimes(1);
    expect(tippyMocks.setContent).toHaveBeenLastCalledWith("Second");

    const latestGetRef = vi.fn();
    view.rerender(
      <Tippy data-testid="tooltip-reference" content="Second" options={options} getRef={latestGetRef}>
        Target
      </Tippy>,
    );

    expect(getRef).toHaveBeenLastCalledWith(null);
    expect(latestGetRef).toHaveBeenCalledWith(reference);
    expect(tippyMocks.create).toHaveBeenCalledTimes(1);

    view.unmount();
    expect(tippyMocks.destroy).toHaveBeenCalledTimes(1);
    expect(latestGetRef).toHaveBeenLastCalledWith(null);
  });
});
