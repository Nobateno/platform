import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import i18n from "@/app/i18n";
import Alert, {
  alertStateConfig,
  type AlertState,
} from "@/shared/ui/components/Base/Alert";

describe("Alert", () => {
  beforeEach(async () => {
    await act(() => i18n.changeLanguage("en"));
  });

  it("defines an icon and color contract for every supported state", () => {
    const states: AlertState[] = ["primary", "warn", "error", "info", "success"];

    expect(Object.keys(alertStateConfig)).toEqual(states);
    states.forEach((state) => {
      expect(alertStateConfig[state].icon).toBeTruthy();
      expect(alertStateConfig[state].color.container).toBeTruthy();
    });
  });

  it("uses assertive alert semantics only for errors", () => {
    render(
      <>
        <Alert state="error" title="Could not save">Try again.</Alert>
        <Alert state="info" title="Saving">This may take a moment.</Alert>
      </>,
    );

    expect(screen.getByRole("alert")).toHaveAttribute("aria-live", "assertive");
    expect(screen.getByRole("status")).toHaveAttribute("aria-live", "polite");
  });

  it("supports parent-handled button actions and links", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    render(
      <>
        <Alert
          title="Incomplete profile"
          action={{ label: "Complete profile", onClick: onAction }}
        />
        <Alert
          state="success"
          title="Published"
          action={{ label: "View page", href: "/booking" }}
        />
      </>,
    );

    await user.click(screen.getByRole("button", { name: "Complete profile" }));
    expect(onAction).toHaveBeenCalledOnce();
    expect(screen.getByRole("link", { name: "View page" })).toHaveAttribute(
      "href",
      "/booking",
    );
  });

  it("can be dismissed by the close control", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(
      <Alert title="Dismiss me" dismissible onDismiss={onDismiss} />,
    );

    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it("can dismiss itself after a timer", () => {
    vi.useFakeTimers();
    const onDismiss = vi.fn();
    render(<Alert title="Temporary" durationMs={2000} onDismiss={onDismiss} />);

    act(() => vi.advanceTimersByTime(2000));
    expect(onDismiss).toHaveBeenCalledOnce();
    vi.useRealTimers();
  });
});
