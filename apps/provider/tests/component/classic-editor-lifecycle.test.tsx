import { act, render, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ClassicEditor } from "@/shared/ui/components/Base/Ckeditor";

const editorMocks = vi.hoisted(() => ({
  create: vi.fn(),
  destroy: vi.fn(),
  disableReadOnlyMode: vi.fn(),
  enableReadOnlyMode: vi.fn(),
  getData: vi.fn(),
  setData: vi.fn(),
  documentOn: vi.fn(),
  viewOn: vi.fn(),
}));

vi.mock("@ckeditor/ckeditor5-build-classic", () => ({
  default: { create: editorMocks.create },
}));

describe("ClassicEditor lifecycle", () => {
  it("uses current callbacks and destroys the imperative editor on unmount", async () => {
    const editor = {
      destroy: editorMocks.destroy,
      disableReadOnlyMode: editorMocks.disableReadOnlyMode,
      enableReadOnlyMode: editorMocks.enableReadOnlyMode,
      getData: editorMocks.getData,
      setData: editorMocks.setData,
      model: { document: { on: editorMocks.documentOn } },
      editing: { view: { document: { on: editorMocks.viewOn } } },
    };
    editorMocks.create.mockResolvedValue(editor);
    editorMocks.getData.mockReturnValue("<p>edited</p>");

    const firstOnChange = vi.fn();
    const latestOnChange = vi.fn();
    const onReady = vi.fn();
    const view = render(
      <ClassicEditor
        value="<p>first</p>"
        onChange={firstOnChange}
        onReady={onReady}
      />,
    );

    await waitFor(() => expect(onReady).toHaveBeenCalledWith(editor));

    view.rerender(
      <ClassicEditor
        value="<p>second</p>"
        onChange={latestOnChange}
        onReady={onReady}
        disabled
      />,
    );

    await waitFor(() => {
      expect(editorMocks.setData).toHaveBeenCalledWith("<p>second</p>");
      expect(editorMocks.enableReadOnlyMode).toHaveBeenCalledWith("ckeditor");
    });

    const changeListener = editorMocks.documentOn.mock.calls.find(
      ([eventName]) => eventName === "change:data",
    )?.[1] as (() => void) | undefined;
    expect(changeListener).toBeTypeOf("function");
    act(() => changeListener?.());

    expect(firstOnChange).not.toHaveBeenCalled();
    expect(latestOnChange).toHaveBeenCalledWith("<p>edited</p>");

    view.unmount();
    expect(editorMocks.destroy).toHaveBeenCalledTimes(1);
  });
});
