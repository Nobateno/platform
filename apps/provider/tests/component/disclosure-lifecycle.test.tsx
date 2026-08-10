import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import Disclosure from "@/shared/ui/components/Base/Headless/Disclosure";

describe("Disclosure lifecycle", () => {
  it("does not close a standalone default-open disclosure as a group side effect", async () => {
    const user = userEvent.setup();
    render(
      <Disclosure defaultOpen>
        <Disclosure.Button>Cancellation policy</Disclosure.Button>
        <Disclosure.Panel>Customers may cancel before the cutoff.</Disclosure.Panel>
      </Disclosure>,
    );

    const button = screen.getByRole("button", { name: "Cancellation policy" });
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Customers may cancel before the cutoff.")).toBeVisible();

    await user.click(button);
    expect(button).toHaveAttribute("aria-expanded", "false");
  });
});
