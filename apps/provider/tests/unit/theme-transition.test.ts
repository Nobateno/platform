import { afterEach, describe, expect, it, vi } from "vitest";
import { startThemeViewTransition } from "@/shared/ui/theme-transition";

const reducedMotionPreference = (matches: boolean): MediaQueryList => ({
  matches,
  media: "(prefers-reduced-motion: reduce)",
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
});

const setStartViewTransition = (
  implementation: Document["startViewTransition"] | undefined,
) => {
  Object.defineProperty(document, "startViewTransition", {
    configurable: true,
    value: implementation,
  });
};

afterEach(() => {
  Reflect.deleteProperty(document, "startViewTransition");
});

describe("startThemeViewTransition", () => {
  it("runs the theme update through the View Transition API", () => {
    const updateTheme = vi.fn();
    const transition = {} as ViewTransition;
    const startViewTransition = vi.fn((update: () => void) => {
      update();
      return transition;
    });
    setStartViewTransition(
      startViewTransition as Document["startViewTransition"],
    );

    expect(startThemeViewTransition(updateTheme)).toBe(transition);
    expect(startViewTransition).toHaveBeenCalledOnce();
    expect(updateTheme).toHaveBeenCalledOnce();
  });

  it("updates immediately when the View Transition API is unavailable", () => {
    setStartViewTransition(undefined);
    const updateTheme = vi.fn();

    expect(startThemeViewTransition(updateTheme)).toBeUndefined();
    expect(updateTheme).toHaveBeenCalledOnce();
  });

  it("updates immediately when reduced motion is requested", () => {
    const updateTheme = vi.fn();
    const startViewTransition = vi.fn();
    setStartViewTransition(
      startViewTransition as Document["startViewTransition"],
    );
    vi.spyOn(window, "matchMedia").mockReturnValue(
      reducedMotionPreference(true),
    );

    expect(startThemeViewTransition(updateTheme)).toBeUndefined();
    expect(startViewTransition).not.toHaveBeenCalled();
    expect(updateTheme).toHaveBeenCalledOnce();
  });
});
