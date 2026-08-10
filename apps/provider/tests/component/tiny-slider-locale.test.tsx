import { act, render, waitFor } from "@testing-library/react";
import { useTranslation } from "react-i18next";
import { beforeEach, describe, expect, it, vi } from "vitest";
import i18n from "@/app/i18n";
import { DirectionProvider } from "@/shared/lib/utils/direction-context";
import TinySlider from "@/shared/ui/components/Base/TinySlider";
import {
  destroy,
  init,
} from "@/shared/ui/components/Base/TinySlider/tiny-slider";

vi.mock("@/shared/ui/components/Base/TinySlider/tiny-slider", () => ({
  destroy: vi.fn(),
  init: vi.fn(),
}));

const options = { mode: "gallery" as const, nav: true };

function TranslatedSlider() {
  const { t } = useTranslation("overview");

  return (
    <TinySlider options={options}>
      <div>{t("promotions.newFeatureTitle")}</div>
      <div>{t("promotions.stayAhead")}</div>
    </TinySlider>
  );
}

describe("TinySlider locale updates", () => {
  beforeEach(async () => {
    vi.mocked(init).mockImplementation((element) => {
      element.tns = {} as never;
    });
    await act(() => i18n.changeLanguage("en"));
  });

  it("reinitializes translated slides on the same React-owned element", async () => {
    const view = render(
      <DirectionProvider>
        <TranslatedSlider />
      </DirectionProvider>,
    );
    const englishSlider = view.container.querySelector(".tiny-slider");

    expect(init).toHaveBeenCalledTimes(1);
    expect(view.getByText("New feature")).toBeInTheDocument();

    await act(() => i18n.changeLanguage("zh"));

    expect(await view.findByText("新功能")).toBeInTheDocument();
    await waitFor(() => {
      expect(destroy).toHaveBeenCalledTimes(1);
      expect(init).toHaveBeenCalledTimes(2);
    });
    expect(view.container.querySelector(".tiny-slider")).toBe(englishSlider);
  });
});
