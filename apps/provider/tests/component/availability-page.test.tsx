import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createInstance } from "i18next";
import { I18nextProvider } from "react-i18next";
import { describe, expect, it } from "vitest";
import {
  availabilityNamespace,
  availabilityResources,
} from "@/domains/availability/i18n";
import AvailabilityPage from "@/domains/availability/presentation/pages/AvailabilityPage";

const renderAvailability = async () => {
  const i18n = createInstance();
  await i18n.init({
    lng: "en",
    fallbackLng: "en",
    resources: { en: { [availabilityNamespace]: availabilityResources.en } },
  });
  return render(
    <I18nextProvider i18n={i18n}>
      <AvailabilityPage />
    </I18nextProvider>,
  );
};

describe("AvailabilityPage", () => {
  it("blocks saving on invalid hours and announces a successful save", async () => {
    const user = userEvent.setup();
    await renderAvailability();

    const save = screen.getByRole("button", { name: "Save availability" });
    expect(save).toBeEnabled();
    const starts = screen.getAllByLabelText(/Start/);
    const ends = screen.getAllByLabelText(/End/);
    expect(starts[0]).toHaveAccessibleName("Saturday Start");
    expect(ends[0]).toHaveAccessibleName("Saturday End");
    fireEvent.change(starts[0], { target: { value: "18:00" } });
    fireEvent.change(ends[0], { target: { value: "09:00" } });

    expect(save).toBeDisabled();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "On Saturday, the end time must be after the start time.",
    );

    fireEvent.change(ends[0], { target: { value: "19:00" } });
    expect(save).toBeEnabled();
    await user.click(save);
    expect(screen.getByText("Availability settings were saved for this session.")).toBeInTheDocument();
  });
});
