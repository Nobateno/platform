import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import i18n from "@/app/i18n";
import { DirectionProvider } from "@/shared/lib/utils/direction-context";
import LanguageSwitcher from "@/shared/ui/components/LanguageSwitcher";

const renderLanguageSwitcher = () =>
  render(
    <DirectionProvider>
      <LanguageSwitcher />
    </DirectionProvider>,
  );

describe("LanguageSwitcher", () => {
  beforeEach(async () => {
    window.localStorage.clear();
    document.documentElement.lang = "fa";
    document.documentElement.dir = "rtl";
    await act(() => i18n.changeLanguage("fa"));
  });

  it("offers every supported language", () => {
    renderLanguageSwitcher();

    expect(screen.getAllByRole("option")).toHaveLength(9);
    expect(screen.getByRole("combobox")).toHaveValue("fa");
  });

  it("keeps locale, document direction, and persistence in sync", async () => {
    const user = userEvent.setup();
    renderLanguageSwitcher();
    const languageInput = screen.getByRole("combobox");

    await user.selectOptions(languageInput, "de");

    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute("lang", "de");
      expect(document.documentElement).toHaveAttribute("dir", "ltr");
      expect(document.documentElement).toHaveAttribute("data-language", "de");
      expect(window.localStorage.getItem("language")).toBe("de");
    });

    await user.selectOptions(languageInput, "fa");

    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute("lang", "fa");
      expect(document.documentElement).toHaveAttribute("dir", "rtl");
      expect(window.localStorage.getItem("language")).toBe("fa");
    });
  });

  it("renders one custom chevron and rotates it while the select is open", () => {
    renderLanguageSwitcher();
    const languageInput = screen.getByRole("combobox");
    const container = languageInput.closest("label");
    const chevrons = Array.from(container?.querySelectorAll("svg") ?? []).filter(
      (icon) => icon.getAttribute("class")?.includes("rotate-"),
    );

    expect(chevrons).toHaveLength(1);
    expect(chevrons[0]).toHaveClass("rotate-0");
    expect(container).toHaveAttribute("data-state", "closed");

    fireEvent.pointerDown(languageInput);

    expect(chevrons[0]).toHaveClass("rotate-180");
    expect(container).toHaveAttribute("data-state", "open");

    fireEvent.blur(languageInput);

    expect(chevrons[0]).toHaveClass("rotate-0");
    expect(container).toHaveAttribute("data-state", "closed");
  });
});
